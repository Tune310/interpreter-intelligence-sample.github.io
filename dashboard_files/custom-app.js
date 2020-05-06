/*
 * Copyright (C) 2013 Interpreter Intelligence, Inc. <support@interpreterintelligence.com>
 *
 * custom-app.js
 * <copyright notice>
 */

/* enable strict mode */
"use strict";

/**
 * global log for convenient logging to miscellaneous container
 */
var LOG = function log(msg) {

    var logDiv = $('.container-log');
    logDiv.prepend('<p>&gt;&nbsp;' + msg + '</p>');
    logDiv.scrollTop = logDiv.scrollHeight;

    console.log(msg);

};


var WFSID_DEFAULT = App.config.twilio.workflowSid;
var WFOPISID_DEFAULT = "WWf6f127b723a7c9b34e874ee5dc83c50b";
var TQSID_DEFAULT = "WQ1997c7254ec7ccaf85e7c7df0c398225";

var WFA_AVAILABLE = App.config.twilio.activities.idle;
var WFA_UNAVAILABLE = App.config.twilio.activities.busy;

var WF_TASK_TIMEOUT_SECS = App.config.twilio.tasktimeout;

// inject indexOf for IE8+ support
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    }
}

//set up spinner
if (typeof jQuery !== 'undefined') {
    (function($) {
        $('#loader').ajaxStart(function() {
            $(".content").css({opacity: 0.4});
            $(this).fadeIn();
        }).ajaxStop(function() {
            $(this).fadeOut(500);
            $(".content").css({opacity: 1});
        });
    })(jQuery);

    //don't cache ajax calls on msie
    // TODO: msie deprecated in jQuery 1.9. Need to remove
    if (jQuery.browser && jQuery.browser.msie) {
        $.ajaxSetup({ cache: false });
    }

    // ability to use "localized" terms, similar function in callbacks in view
    (function($) {
        doLocalize($("body *"));
    })(jQuery);
}
var isUnloading=false;

// catch global javascript errors as the loading icon is not hidden
// sometimes if a javascript error is encountered and this leads users
// to believe that loading is continuing, where as it has stopped long
// ago. catch this globally to provide feedback to user.
window.onerror = function(msg, url, line, col, error) {

    // Note that col & error are new to the HTML 5 spec and may not be
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;

    // hide loader
    $('#loader').fadeOut(500);

    if (msg.indexOf("Script error") !== -1 /* && url === "" */ && line === 0 /* && col === 0 */ && (error === null || error === undefined)) {
        // twilio token expiration or issue connecting to twilio services. can safely ignore
        console.log("Twilio web socket error likely due to socket disconnect. Ignoring.");
        return;
    }

    var hasPopupErrorContainer = $("#popupErrorContainer").length > 0 ? true : false;
    var hasErrorContainer = $("#errorContainer").length > 0 ? true : false;

    if (!isUnloading){
        if (hasPopupErrorContainer) {

            popupHandleError({}, { status: 'ERROR',
                message: 'An unexpected error has occurred: ' + msg,
                actual: "Error: " + msg + "\nurl: " + url + "\nline: " + line + extra,
                errors: []
            });
        } else if (hasErrorContainer) {

            handleError({}, { status: 'ERROR',
                message: 'An unexpected error has occurred: ' + msg,
                actual: "Error: " + msg + "\nurl: " + url + "\nline: " + line + extra,
                errors: []
            });

        } else {

            // show alert as fall back
            alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

        }
    }


    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
};

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {

  //handleError([] /* model */, jqXHR /* response */);
});

(function($) {

    // help text setup
    var ht = new Prefs({
        name: 'helptext-enabled',
        data: {
            'helptext-enabled': true
        }
    });
    ht.load();

    if (ht.data['helptext-enabled']) {

        App['helptext-enabled'] = true;

    } else {

        App['helptext-enabled'] = false;
    }

    $((".toggle-help")).click(function(evt) {

        // show / hide help text
        $(".helptext").toggle();

        // turn on popover
        $(".helptext").popover($.common.popOverOptions());

        // toggle flag
        App['helptext-enabled'] = !App['helptext-enabled'];

        // save cookie
        ht.data['helptext-enabled'] = App['helptext-enabled'];
        ht.save(new Date().addYears(50), "/"); // never expire

    });

})(jQuery);


String.prototype.trunc =
    function( n, useWordBoundary ){
        if (this.length <= n) { return this; }
        var subString = this.substr(0, n-1);
        return (useWordBoundary
            ? subString.substr(0, subString.lastIndexOf(' '))
            : subString) + "&hellip;";
    };

function doLocalize(el) {
    // replace all instances of the following
    //$("body *").replaceText( /Company/gi, "Court" );
    //$("body *").replaceText( /Companies/gi, "Courts" );
    //$("body *").replaceText( /Customer/gi, "Site" );
    //$("body *").replaceText( /Client/gi, "Judge" );

    // only apply for CourtCall
    if (App.config.company.name == "CourtCall") {

        if (el) {
            $(el).find("*").replaceText( /Company/gi, "Court" );
            $(el).find("*").replaceText( /Companies/gi, "Courts" );
            $(el).find("*").replaceText( /Customer/gi, "Site" );
            $(el).find("*").replaceText( /Client/gi, "Judge" );
        }
    }

    if (App.config.company.name == "USIHS Delivery") {

        if (el) {
            $(el).find("*").replaceText( /Interpreter/g, "Driver" );
            $(el).find("*").replaceText( /interpreter/g, "driver" );
        }
    }

    if (App.config.company.name == "Sorenson Communications, LLC" || App.config.company.name == "Demo: Sorenson Interpretive Services, LLC") {

        if (el) {
            $(el).find("*").replaceText( /Swift/g, "Right Crowd (DD/MM)" );
        }
    }

    // turn off autocomplete on all input fields
    $(el).find("input").attr("autocomplete", "off");
};

/**
 * add "classes" method to get array of classes from element or pass callback function
 *
 * @see http://stackoverflow.com/questions/1227286/get-class-list-for-element-with-jquery
 */
;!(function ($) {
    $.fn.classes = function (callback) {
        var classes = [];
        $.each(this, function (i, v) {
            var splitClassName = v.className.split(/\s+/);
            for (var j in splitClassName) {
                var className = splitClassName[j];
                if (-1 === classes.indexOf(className)) {
                    classes.push(className);
                }
            }
        });
        if ('function' === typeof callback) {
            for (var i in classes) {
                callback(classes[i]);
            }
        }
        return classes;
    };
})(jQuery);

/**
 * Call once at beginning to ensure your app can safely call console.log() and
 * console.dir(), even on browsers that don't support it.  You may not get useful
 * logging on those browers, but at least you won't generate errors.
 *
 * @param  alertFallback - if 'true', all logs become alerts, if necessary.
 *   (not usually suitable for production)
 *
 * @see http://stackoverflow.com/questions/690251/what-happened-to-console-log-in-ie8
 */
function fixConsole(alertFallback)
{
    if (typeof console === "undefined")
    {
        console = {}; // define it if it doesn't exist already
    }
    if (typeof console.log === "undefined")
    {
        if (alertFallback) { console.log = function(msg) { alert(msg); }; }
        else { console.log = function() {}; }
    }
    if (typeof console.dir === "undefined")
    {
        if (alertFallback) {
            // THIS COULD BE IMPROVED maybe list all the object properties?
            console.dir = function(obj) { alert("DIR: "+ debugObject(obj)); };
        }
        else { console.dir = function() {}; }
    }
}

if (dbg === "undefined") {
    var dbg = false;
}
fixConsole(dbg ? true : false);

/*
 * json is not part of JS implementation in most modern browsers!!! check ie 6.0
 */
function Prefs(props) {

    this.defaultName = "prefs";
    this.name = props.name;
    this.data = props.data;
    var that = this;
    Prefs.prototype.load = function () {
        var cook=window['sessionStorage'].getItem(that.name);
        if (cook){
            var the_cookie = cook.split(';');
            //var the_cookie2 = document.cookie.split(';');


            for (var i=0; i < the_cookie.length; i++) {
                //alert(the_cookie[i]);
                // a name/value pair (a crumb) is separated by an equal sign
                var aCrumb = the_cookie[i].split("=");
                //alert(aCrumb);
                //alert(aCrumb[0]);
                //need to trim cookie to match on name (use jQuery trim() to avoid missing functions in IE 6)
                if (that.name == $.trim(aCrumb[0])) {
                    that.data = JSON.parse(unescape(aCrumb[1]));
                    //alert("Got cookie: " + this.name);
                }
            }

            /*if (the_cookie[0]) {
             this.data = unescape(the_cookie[0]).parseJSON();
             }*/
        }
        return that.data;
    },

    Prefs.prototype.save = function (expires, path) {
        //var d = expires || new Date(2020, 02, 02);
        var d = expires;
        var p = path || '/';

        var ck = that.name + "=" + escape(JSON.stringify(that.data, null, "\t"));

        if (path) {
            ck += ';path=' + p;
        }

        if (expires) {

            if (expires == -1) {
                ck += ';expires=-1';
            } else {
                ck += ';expires=' + d.toUTCString();
            }

        } else {

            var d = new Date((new Date()).getTime() + (1000 * 60 * 60));
            ck += ';expires=' + d.toUTCString();
        }
        //alert(ck);
        window['sessionStorage'].setItem(that.name, ck);
        //document.cookie = ck;
        //alert("Saved cookie: " + this.name);
    }

    Prefs.prototype.remove = function (key) {
        if (window['sessionStorage'].getItem(key)) {
            window['sessionStorage'].removeItem(key);
        }

    }

    Prefs.prototype.loadCookie = function () {
        var cook=document.cookie;
        if (cook){
            var the_cookie = cook.split(';');
            //var the_cookie2 = document.cookie.split(';');


            for (var i=0; i < the_cookie.length; i++) {
                //alert(the_cookie[i]);
                // a name/value pair (a crumb) is separated by an equal sign
                var aCrumb = the_cookie[i].split("=");
                //alert(aCrumb);
                //alert(aCrumb[0]);
                //need to trim cookie to match on name (use jQuery trim() to avoid missing functions in IE 6)
                if (that.name == $.trim(aCrumb[0])) {
                    that.data = JSON.parse(unescape(aCrumb[1]));
                    //alert("Got cookie: " + this.name);
                }
            }

            if (the_cookie[0]) {
                this.data = unescape(the_cookie[0]).parseJSON();
            }
        }
        return that.data;
    },

        Prefs.prototype.saveCookie = function (expires, path) {
            //var d = expires || new Date(2020, 02, 02);
            var d = expires;
            var p = path || '/';

            var ck = that.name + "=" + escape(JSON.stringify(that.data, null, "\t"));

            if (path) {
                ck += ';path=' + p;
            }

            if (expires) {

                if (expires == -1) {
                    ck += ';expires=-1';
                } else {
                    ck += ';expires=' + d.toUTCString();
                }

            } else {

                var d = new Date((new Date()).getTime() + (1000 * 60 * 60));
                ck += ';expires=' + d.toUTCString();
            }
            //alert(ck);
            //window['sessionStorage'].setItem(that.name, ck);
            document.cookie = ck;
            //alert("Saved cookie: " + this.name);
        }
}

function getType(obj) {

    alert(obj.constructor.name);
}

/**
 * remove an element from an array based on property and value
 */
function findAndRemove(array, property, value) {
   $.each(array, function(index, result) {
      if(result[property] == value) {
          //Remove from array
          array.splice(index, 1);
      }
   });
}

function writeObject(obj, message) {
  if (!message) { message = obj; }
  var details = "*****************" + "\n" + message + "\n";
  var fieldContents;
  for (var field in obj) {
    fieldContents = obj[field];
    if (typeof(fieldContents) == "function") {
      fieldContents = "(function)";
    }
    details += "  " + field + ": " + fieldContents + "\n";
  }
  console.log(details);

  return details;
}

function debugObject(obj, parent) {
   // Go through all the properties of the passed-in object
   for (var i in obj) {
      // if a parent (2nd parameter) was passed in, then use that to
      // build the message. Message includes i (the object's property name)
      // then the object's property value on a new line
      if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
      // Display the message. If the user clicks "OK", then continue. If they
      // click "CANCEL" then quit this level of recursion
      if (!confirm(msg)) { return; }
      // If this property (i) is an object, then recursively process the object
      if (typeof obj[i] == "object") {
         if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
      }
   }
}

function objectToParams(obj) {
    var pairs = [];
    for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
            continue;
        }
        pairs.push(prop + '=' + obj[prop]);
    }
    return pairs.join('&');
}

function resetSignature(container, pad, from, to, drawOnly /* to show or draw */, sigObj) {
  /*var w = container.width();
  var h = '100';*/
  if (container.length === 0 || pad.length === 0) {
    return true;
  }

  var scaledSig = scaleSignature(sigObj.sig || sigObj.signatureRaw, false, from, to);

  var canvas = container.find(".pad")[0];
  canvas.setAttribute('width', to.w);
  canvas.setAttribute('height', to.h);

  var sig = pad.signaturePad({
    drawOnly: drawOnly,
    displayOnly: !drawOnly
  });

  //set the pad on the global object (OMG!!!!!!!!!)
  sigObj.sigPad = sig;

  if (sig) sig.regenerate(scaledSig);

  return sig;
}

//get length, used for assoc arrays / lengths
/*Object.prototype.listSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};*/

/*Object.prototype.listKeys = function() {
    var keys = [];
    for (var key in this)
    {
        if (this.hasOwnProperty[key])
            keys.push(key);
    }

    return keys;
};*/

var keys = function(obj) {
    if (typeof obj != "object" && typeof obj != "function" || obj == null) {
        throw TypeError("Object.keys called on non-object");
    }
    var keys = [];
    for (var p in obj)
        obj.hasOwnProperty(p) && keys.push(p);
    return keys;
};

if (!Object.keys) {
    Object.keys = keys;
}

/**
 * given a type as defined in the common javascript find the respective type by id
 *
 * returns 	{
    this.name = props.name;
    this.nameKey = props.nameKey;
    this.id = props.id;
    this.defaultValue = props.defaultValue;
    this.description = props.description;
    }
 * replaced by getStatusById
 */
/*
function findTypeById(list, id) {

    for (var i = 0; i < list.length; i++) {

        if (list[i].id === id) {
            return list[i];
        }
    }
}
*/

function getAbbreviationByStatus(status) {
    var abbr;
    switch (status) {
        case 'new':
            abbr = 'NEW';
            break;
        case 'open':
            abbr = 'OPE';
            break;
        case 'assigned':
            abbr = 'ASS';
            break;
        case 'confirmed':
            abbr = 'CON';
            break;
        case 'declined':
            abbr = 'UNF';
            break;
        case 'nonattendance':
            abbr = 'NON';
            break;
        case 'cancelled':
            abbr = 'CAN';
            break;
        case 'closed':
            abbr = 'CLS';
            break;
        case 'offered':
            abbr = 'OFD';
            break;
        default:
            abbr = "<i class='icon icon-exclamation-sign'></i>";
            break;
    }
    return abbr;
}

function getStatusAttributeById(list, id, attrib, defaultValue) {

    var type = getStatusById(list, id)

    if (type) {
        return type[attrib];
    } else {
        return defaultValue || '';
    }
}

/**
 * retrieve a status by id
 */
function getStatusById(statusList, id) {

  if (typeof id == "string") {
    id = parseInt(id);
  }

    var listKeys = keys(statusList);

    for (var i = 0; i < listKeys.length; i++) {

        if (statusList[listKeys[i]].id === id) {
            return statusList[listKeys[i]];
        }
    }
}

/**
 * used in templates to handle display of null values
 */
function writeNullAs(val, alt) {

    if (val) {
        return val;
    } else {
        return alt;
    }
}

function getMonthName(num) {

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (num < 12) {
        return months[num];
    }
}
function scaleSignature(signature, parse /* parse as json */, from /* dimensions */, to /* dimensions */) {

  var ratioX = to.w / from.w;
  var ratioY = to.h / from.h;

  var scaledSig = [];

  var jsonSig;

  if (parse) {
    jsonSig = $.parseJSON(signature);
  } else {
    jsonSig = signature;
  }
  for (var i = 0; i < jsonSig.length; i++) {
    var pt = {
      lx: jsonSig[i].lx * ratioX,
      ly: jsonSig[i].ly * ratioY,
      mx: jsonSig[i].mx * ratioX,
      my: jsonSig[i].my * ratioY
    };
    scaledSig.push(pt);
  }

  return scaledSig;
}

function filtersContain(filters, field, op) {

    var numRules = 0;
    //rules size
    if (filters.rules && filters.rules.length) {
        numRules = filters.rules.length;
    }
    var foundField = false;

    for (var i = 0; i < numRules; i++) {

        if (filters.rules[i].field == field) {

            if (op) {

                if (filters.rules[i].op == op) {

                    foundField = true;
                    break;
                }
            } else {

                foundField = true;
                break;
            }
        }
    }

    return foundField;
}

function getFilter(filters, field, op) {

    var numRules = 0;
    //rules size
    if (filters.rules && filters.rules.length) {
        numRules = filters.rules.length;
    }
    var foundField = false;

    for (var i = 0; i < numRules; i++) {

        if (filters.rules[i].field == field) {

            if (op) {

                if (filters.rules[i].op == op) {

                    return filters.rules[i];
                }
            } else {

                return filters.rules[i];
            }
        }
    }
}

function addFilter(filters, field, op, data, type, format) {

  if (!filters.rules) {
      filters.rules = [];
    }

    var fltr = {"field": field, "op": op, "data": data};
    // add data type and format filters
    if (type) fltr.type = type;
    if (format) fltr.format = format;

    filters.rules[filters.rules.length] = fltr;

    return filters;
}

function addParsedFilter(filters, fltr) {
    filters.rules[filters.rules.length] = fltr;

    return filters;
}

/**
 * only updates first.
 *
 *
 * @param filters
 * @param field
 * @param op
 * @param data
 * @returns
 */
function updateFilter(filters, field, op, data, type, format) {

    var numRules = 0;
    //rules size
  if (filters.rules && filters.rules.length) {
      numRules = filters.rules.length;
    }
    var filter;

    for (var i = 0; i < numRules; i++) {

        if (filters.rules[i].field == field) {

            if (op) {

                if (filters.rules[i].op == op) {

                    filters.rules[i].data = data;

                    // add data type and format filters
                    if (type) filters.rules[i].type = type;
                    if (format) filters.rules[i].format = format;

                    break;
                }
            } else {

                filters.rules[i].op = op;
                filters.rules[i].data = data;

                // add data type and format filters
                if (type) filters.rules[i].type = type;
                if (format) filters.rules[i].format = format;

                break;
            }
        }
    }

    return filters;
}

function addOrUpdateFilter(filters, field, op, data, type, format) {

    //add / update company filter
    if (filtersContain(filters, field, op)) {

        return updateFilter(filters, field, op, data, type, format);

    } else {

        return addFilter(filters, field, op, data, type, format);

    }
}

function addOrUpdateDateRangeFilter(periodStart, periodEnd, field, filtersJSON) {
    //adds to the filtersJSON where date ranges are used and filtersJSON is applicable (such as financial payables page), use addDateRangeParams if filtersJSON is not used
    //check to see if periodStart and periodEnd is null
    if (validateDateRange(periodStart, periodEnd)) {
        //if periodStart and/or periodEnd are not null, add the values to the filtersJSON
        // Expected start date
        filtersJSON = addOrUpdateFilter(filtersJSON, field, "ge",
            periodStart.toString(App.config.company.config.dateFormat),"date", App.config.company.config.dateFormat);
        // Expected end date
        filtersJSON = addOrUpdateFilter(filtersJSON, field, "le",
            periodEnd.toString(App.config.company.config.dateFormat),"date", App.config.company.config.dateFormat);
    }
    return filtersJSON;

}

function addDateRangeParams(periodStart, periodEnd, params) {
    //adds to the params value for date ranges calls that don't use filtersJSON, such as the refresh methods on customer and company reports dashboard, use addOrUpdateDateRangeFilter if params are not used
    //validateDateRange validates the date range values to make sure they match with the company config dateFormat
    //check to see if periodStart and periodEnd is null
    if (validateDateRange(periodStart, periodEnd)) {
        //if periodStart and/or periodEnd are not null, add the values to the filtersJSON
        // Expected start date
        params.startDate = periodStart.toString(App.config.company.config.dateFormat)
        // Expected end date
        params.endDate = periodEnd.toString(App.config.company.config.dateFormat);
    }
    return params;

}

function mergeFilters(toFilters, fromFilters) {

    var numRules = 0;

    if (fromFilters.rules && fromFilters.rules.length) {
        numRules = fromFilters.rules.length;
    } else {
        return toFilters;
    }

    for (var i = 0; i < numRules; i++) {


        toFilters = addOrUpdateFilter(toFilters, fromFilters.rules[i].field, fromFilters.rules[i].op, fromFilters.rules[i].data, fromFilters.rules[i].type, fromFilters.rules[i].format);
    }

    return toFilters;
}


function removeFilter(filters, field, op) {

    var numRules = 0;
    var numRemoved = 0;

    //rules size
  if (filters.rules && filters.rules.length) {
      numRules = filters.rules.length;
    }

    for (var i = 0; i < numRules; i++) {

        if (filters.rules[i].field == field) {

            if (op) {

                if (filters.rules[i].op == op) {

                    filters.rules.splice(i, 1);
                    i--;
                    numRules--;

                }

            } else {

                filters.rules.splice(i, 1);
                i--;
                numRules--;

            }
        }
    }

    return filters;
}

/**
 * adds data type and format parameters to all filters matching the field
 *
 * @param filters
 * @param field
 * @param type
 * @param format
 */
function decorateFilter(filters, field, type, format) {

    var numRules = 0;
    //rules size
    if (filters.rules && filters.rules.length) {
        numRules = filters.rules.length;
    }
    var filter;

    for (var i = 0; i < numRules; i++) {

        if (filters.rules[i].field == field) {

            // add data type and format filters
            if (type) filters.rules[i].type = type;
            if (format) filters.rules[i].format = format;


        }
    }
}

/**
 * populate the description for the calendar popup.
 *
 * @param row
 * @returns {String}
 */
function getEventDescription(row) {

    var description = "";

    if (row.isTelephoneTranslation === true) {
        description = "<b><div class='phone'>" + row.actualLocationDisplayLabel + "(" + row["customer.label"] + ")</div></b>";
    } else if (App.dict.bookingMode['opi'] && (row['bookingMode.id'] === App.dict.bookingMode['opi'].id)) {
        description = "<b><div class='phone'>" + row.actualLocationDisplayLabel + "(" + row["customer.label"] + ")</div></b>";
    } else if (App.dict.bookingMode['video'] && (row['bookingMode.id'] === App.dict.bookingMode['video'].id)) {
        description = "<b><div class='video'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['vri'] && (row['bookingMode.id'] === App.dict.bookingMode['vri'].id)) {
        description = "<b><div class='video'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['phone'] && (row['bookingMode.id'] === App.dict.bookingMode['phone'].id)) {
        description = "<b><div class='phone'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['phoneScheduled'] && (row['bookingMode.id'] === App.dict.bookingMode['phoneScheduled'].id)) {
        description = "<b><div class='phone'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['video3rd'] && (row['bookingMode.id'] === App.dict.bookingMode['video3rd'].id)) {
        description = "<b><div class='video'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['phone3rd'] && (row['bookingMode.id'] === App.dict.bookingMode['phone3rd'].id)) {
        description = "<b><div class='phone'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['inperson'] && (row['bookingMode.id'] === App.dict.bookingMode['inperson'].id)) {
        description = "<b><div class='person'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['mr'] && (row['bookingMode.id'] === App.dict.bookingMode['mr'].id)) {
        description = "<b><div class='envelope'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['cmr'] && (row['bookingMode.id'] === App.dict.bookingMode['cmr'].id)) {
        description = "<b><div class='envelope'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['court'] && (row['bookingMode.id'] === App.dict.bookingMode['court'].id)) {
        description = "<b><div class='legal'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['conference'] && (row['bookingMode.id'] === App.dict.bookingMode['conference'].id)) {
        description = "<b><div class='group'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['group'] && (row['bookingMode.id'] === App.dict.bookingMode['group'].id)) {
        description = "<b><div class='group'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else if (App.dict.bookingMode['simultaneous'] && (row['bookingMode.id'] === App.dict.bookingMode['simultaneous'].id)) {
        description = "<b><div class='group'>" + row.actualLocationDisplayLabel + "</div></b>";
    } else {
        description = "<b><div class='generic'>" + row.actualLocationDisplayLabel + "</div></b>";
        if (row["subLocation.id"]) {
            description += "<div><b>Sub-Location:</b> " + row["subLocation.label"] + "</div>";
        }
    }

    var status = getStatusById(App.dict.bookingStatus, row["status.id"]);

    description += "<div><b>Booking #</b>: " + row["superBooking.id"] + "</div>";
    description += "<div><b>Job #</b>: " + row.id + "</div>";
    description += "<div><b>Status</b>: " + (status ? status.name :"n/a")  + "</div>";
    description += "<div><b>Created by</b>: " + row.createdBy  + "</div>";
    description += "<div><b>Customer</b>: " + row["customer.label"] + "</div>";
    description += "<div><b>Client</b>: " + row["client.label"] + "</div>";
    if(row["consumer.label"]) {
        description += "<div><b>Consumer</b>: " + row["consumer.label"] + "</div>";
    }
    description += "<div><b>Customer</b>: " + row["customer.label"] + "</div>";
    description += "<div><b>Calendar Date</b>: " + (new Date(row.expectedStartDateMs).toString(App.config.company.config.calDateTimeFormat)) + "</div>";
    description += "<div><b>Booking (Local Time)</b>: " + row.timeZone + ": " + row.startDate + " " + row.startTime + "</div>";
    description += "<div><b>Interpreter (Local Time)</b>: " + row.terpTimeZone + ": " + row.terpStartDate + " " + row.terpStartTime + "</div>";
    description += "<div><b>Language:</b> " + row["language.label"]  + "</div>";
    description += "<div><b>Interpreter:</b> " + (row["interpreter.label"] ? row["interpreter.label"] : "n/a")  + "</div>";

    description += "<div><b>Reference(s)</b>";


    for (var i = 0; i < row.refs.length; i++) {

        // promote this reference field to top
        if (row.refs[i] && row.refs[i].config && row.refs[i].config.promote) {

            description = "<div><b>" + row.refs[i].name + "</b>: " + row.refs[i].ref + "</div>" + description;

        }

        // concat each ref
        if (row.refs[i] && row.refs[i].name) {

            description += "<br/><b>" + row.refs[i].name + "</b>: " + row.refs[i].ref;
        }

    }

    description += "</div>";

    return description;
}
function getEventDescriptionJSON(booking) {

    var description = "";
    var status = getStatusById(App.dict.bookingStatus, booking.status.id);
    var templateHelpers = $.app.mixins.templateHelpersMixin;

    function addLocationOrRemote(cssIcon) {
        description += "<b><div class='" + cssIcon + "'>" + (booking.actualLocation ? booking.actualLocation.displayLabel : "Remote") + "</div></b>";
    }

    function addLocationAndSublocation(cssIcon) {
        if (booking.location) {
            description += "<b><div class='" + cssIcon + "'>" + booking.actualLocation.displayLabel + "</div></b>";
        }
        if (booking.subLocation) {
            description += "<div><b>Sub-Location:</b> " + booking.subLocation.displayLabel + "</div>";
        }
    }

    if (booking.isTelephoneTranslation === true) {
        description = "<b><div class='phone'>" + booking.actualLocation.displayLabel + "(" + booking.customer.label + ")</div></b>";
    } else if (App.dict.bookingMode['video'] && (booking.bookingMode.id === App.dict.bookingMode['video'].id)) {
        addLocationOrRemote("video");
    } else if (App.dict.bookingMode['vri'] && (booking.bookingMode.id === App.dict.bookingMode['vri'].id)) {
        addLocationOrRemote("video");
    } else if (App.dict.bookingMode['opi'] && (booking.bookingMode.id === App.dict.bookingMode['opi'].id)) {
        addLocationOrRemote("phone");
    } else if (App.dict.bookingMode['inperson'] && (booking.bookingMode.id === App.dict.bookingMode['inperson'].id)) {
        addLocationAndSublocation("person");
    } else if (App.dict.bookingMode['phone'] && (booking.bookingMode.id === App.dict.bookingMode['phone'].id)) {
        addLocationAndSublocation("phone");
    } else if (App.dict.bookingMode['phoneScheduled'] && (booking.bookingMode.id === App.dict.bookingMode['phoneScheduled'].id)) {
        addLocationAndSublocation("phone");
    } else if (App.dict.bookingMode['video3rd'] && (booking.bookingMode.id === App.dict.bookingMode['video3rd'].id)) {
        addLocationAndSublocation("video");
    } else if (App.dict.bookingMode['phone3rd'] && (booking.bookingMode.id === App.dict.bookingMode['phone3rd'].id)) {
        addLocationAndSublocation("phone");
    } else if (App.dict.bookingMode['mr'] && (booking.bookingMode.id === App.dict.bookingMode['mr'].id)) {
        addLocationAndSublocation("envelope");
    } else if (App.dict.bookingMode['cmr'] && (booking.bookingMode.id === App.dict.bookingMode['cmr'].id)) {
        addLocationAndSublocation("envelope");
    } else if (App.dict.bookingMode['court'] && (booking.bookingMode.id === App.dict.bookingMode['court'].id)) {
        addLocationAndSublocation("legal");
    } else if (App.dict.bookingMode['conference'] && (booking.bookingMode.id === App.dict.bookingMode['conference'].id)) {
        addLocationAndSublocation("group");
    } else if (App.dict.bookingMode['group'] && (booking.bookingMode.id === App.dict.bookingMode['group'].id)) {
        addLocationAndSublocation("group");
    } else if (App.dict.bookingMode['simultaneous'] && (booking.bookingMode.id === App.dict.bookingMode['simultaneous'].id)) {
        addLocationAndSublocation("group");
    } else {
        addLocationAndSublocation("generic");
    }

    description += "<div><b>Booking #</b>: " + booking.superBooking.id + "</div>";
    description += "<div><b>Job #</b>: " + booking.id + "</div>";
    description += "<div><b>Status</b>: " + (status ? status.name :"n/a")  + "</div>";
    description += "<div><b>Created by</b>: " + booking.createdBy  + "</div>";
    description += "<div><b>Customer</b>: " + (booking.customer ? booking.customer.name : "On Demand") + "</div>";
    description += "<div><b>Customer (Bill To)</b>: " + (booking.billingCustomer ? booking.billingCustomer.name : "On Demand") + "</div>";
    description += "<div><b>Client</b>: " + (booking.client ? booking.client.name : "On Demand") + "</div>";
    if(booking.consumer) {
        description += "<div><b>Consumer</b>: " + booking.consumer.name + "</div>";
    }
    description += "<div><b>Calendar Date</b>: " + (new Date(booking.expectedStartDate).toString(App.config.company.config.calDateTimeFormat)) + "</div>";
    description += "<div><b>Booking (Local Time)</b>: " + booking.timeZone + ": " + templateHelpers.formatDate(booking.expectedStartDate, booking.timeZone) +" " +templateHelpers.formatTime(booking.expectedStartDate, booking.timeZone) + " - " +templateHelpers.formatTime(booking.expectedEndDate, booking.timeZone) +"</div>";
    //description += "<div><b>Interpreter (Local Time)</b>: " + booking.terpTimeZone + ": " + booking.terpStartDate + " " + booking.terpStartTime + "</div>";

    if(booking.interpreter){
        if(booking.interpreter.timeZone){

            description += "<div><b>Interpreter (Local Time)</b> " + booking.interpreter.timeZone + ":" + templateHelpers.formatDate(booking.expectedStartDate, booking.interpreter.timeZone) +" " +templateHelpers.formatTime(booking.expectedStartDate, booking.interpreter.timeZone)+ "</div>";
        }
        else{
            description += "<div><b>Interpreter (Local Time)</b> " + booking.timeZone + ":" + templateHelpers.formatDate(booking.expectedStartDate, booking.timeZone) +" " +templateHelpers.formatTime(booking.expectedStartDate, booking.timeZone) + "</div>";
        }
    }
    else{
        description += "<div><b>Interpreter (Local Time)</b> " + booking.timeZone + ":" + templateHelpers.formatDate(booking.expectedStartDate, booking.timeZone) +" " +templateHelpers.formatTime(booking.expectedStartDate, booking.timeZone) + "</div>";
    }
    description += "<div><b>Language:</b> " + booking.language.displayName  + "</div>";
    description += "<div><b>Interpreter:</b> " + (booking.interpreter ? booking.interpreter.displayName : "n/a")  + "</div>";

    description += "<div><b>Reference(s)</b>";


    for (var i = 0; booking.refs && i < booking.refs.length; i++) {

        // promote this reference field to top
        if (booking.refs[i] && booking.refs[i].config && booking.refs[i].config.promote) {

            description = "<div><b>" + booking.refs[i].name + "</b>: " + booking.refs[i].ref + "</div>" + description;

        }

        // concat each ref
        if (booking.refs[i] && booking.refs[i].name) {

            description += "<br/><b>" + booking.refs[i].name + "</b>: " + booking.refs[i].ref;
        }

    }

    description += "</div>";

    return description;
}

/*
 * TOOD: possible add an additional param to pass function to invoke on change
 */
function createSelect(selName) {

    $(selName).hide();
    $(selName + '\\.replace').show();

    //if there is an option selected set this
    if ($(selName + ' option:selected').val()) {
        $(selName + '\\.current').text($(selName + ' option:selected').text());
    }

    $(selName + '\\.options li').click(function() {

        //uncheck the current selection
        $(selName).get(0).selectedIndex = -1; //ie 6 fix for dynamic select
        $(selName + ' option').attr('selected', false);

        //get the index of the clicked on item
        var index = $(selName + ' option').index($(selName + ' option[value=' + $(this).attr('rel') + ']'));

        //select the new selection
        try {
            $(selName).get(0).selectedIndex = index; //ie 6 fix for dynamic select
            $(selName + ' option[value=' + $(this).attr('rel') + ']').attr('selected', true);
        } catch(ex) {
            $(selName).get(0).selectedIndex = index; //ie 6 fix for dynamic select
        }

        //trigger change event to ensure all handlers are fired correctly
        $(selName).trigger('change', function() {});

        $(selName + '\\.options').hide();

        $(selName + '\\.current').text($(this).text());

    }).mouseover(function() { $(this).css({'background-color': '#EEE'}); }).mouseout(function() { $(this).css({'background-color': 'white'})});

    $(selName + '\\.replace').mouseenter(function() {
        $(this).css("z-index", "999");
        //alert($(selName + '\\.options').css("z-index"));
        $(selName + '\\.options').show();
    });

    $(selName + '\\.replace').mouseleave(function(evt) {
        $(this).css("z-index", "0");
        $(selName + '\\.options').hide();

    });
}

/*
 * used for dynamically inserted elements where ids maybe duplicated.
 *
 * only supports single select at the moment for dynamically inserted options
 */
function createSelectFromParent(parent) {

    var selName = "#" + parent.find("select").attr("id");
    //escape any periods
    selName = selName.replace(/\./g, "\\.");

    parent.find(selName).hide();
    parent.find(selName + '\\.replace').show();

    //if there is an option selected set this
    if (parent.find(selName + ' option:selected').val()) {
        parent.find(selName + '\\.current').text(parent.find(selName + ' option:selected').text());
    }

    parent.find(selName + '\\.options li').click(function() {

        //uncheck the current selection
        parent.find(selName).get(0).selectedIndex = -1; //ie 6 fix for dynamic select
        parent.find(selName + ' option').attr('selected', false);

        //get the index of the clicked on item
        var index = parent.find(selName + ' option').index(parent.find(selName + ' option[value=' + $(this).attr('rel') + ']'));

        //select the new selection
        try {
            parent.find(selName).get(0).selectedIndex = index; //ie 6 fix for dynamic select
            parent.find(selName + ' option[value=' + $(this).attr('rel') + ']').attr('selected', true);
        } catch(ex) {
            parent.find(selName).get(0).selectedIndex = index; //ie 6 fix for dynamic select
        }
        //trigger change event to ensure all handlers are fired correctly
        parent.find(selName).trigger('change', function() {});
        parent.find(selName + '\\.options').hide();
        parent.find(selName + '\\.current').text($(this).text());
    }).mouseover(function() { $(this).css({'background-color': '#EEE'}); }).mouseout(function() { $(this).css({'background-color': 'white'})});

    parent.find(selName + '\\.replace').mouseenter(function() {
        $(this).css("z-index", "999");
        //alert($(selName + '\\.options').css("z-index"));
        parent.find(selName + '\\.options').show();
    });

    parent.find(selName + '\\.replace').mouseleave(function(evt) {
        $(this).css("z-index", "0");
        parent.find(selName + '\\.options').hide();

    });

}





function addToActivities(str){
    $g('#activities').prepend("<li style='display:none;'><img src=\"${request.contextPath}/images/mavatar.gif\"/><a href=\"#\">New job.</a><div class=\"clear\"/></li>");
    $g('#activities li').first().show(500);
    $g('#activities li').last().hide(500);
    setTimeout("$g('#activities li').last().remove()", 500);
}

function swapStateForIcon(grid, context) {

    var rows= $(grid).jqGrid('getRowData');

    for (var i = 0; i < rows.length; i++) {

        if (rows[i].status == 'new') {

            //$(this).setCell(rows[i].id, "status", "&nbsp;", "status-new");
            $(grid).setCell(rows[i].id, "status", "<img src='" + context + "/images/icon-new.png'></img>", "");

        } else {

            $(grid).setCell(rows[i].id, "status", "&nbsp;", "");

        }

        if (rows[i].priority == 'high' || rows[i].priority == 'urgent') {

            //alert($(this).getCell(rows[i].id, "priority"));
            $(grid).setCell(rows[i].id, "priority", "<img src='" + context + "/images/icon-" + rows[i].priority + ".png'></img>", "");

        } else {

            $(grid).setCell(rows[i].id, "priority", "&nbsp;", "");
        }
    }
}

/*
 * //on IE and Chrome the mouseout is fired when scrolling
        //fix to check if mouse is still within div and do nothing
        //if it is
 */
function withinBounds(evt, elem) {

    //offset of element
    var os = elem.offset();
    //from left
    var x = evt.pageX;
    //from top
    var y = evt.pageY;

    //alert(os.left + ',' + elem.width());
    if ((x < os.left) || x > (os.left + elem.width())) {

        return false;
    }

    if (y < os.top || y > os.top + elem.height()) {

        return false;
    }

    return true;

}
//get dist between two points (OpenLayers)
function getDistance(lon1, lat1, lon2, lat2) {

    var lonLat1 = new OpenLayers.LonLat( lon1, lat1 );
    var lonLat2 = new OpenLayers.LonLat( lon2, lat2 );

    var dist = OpenLayers.Util.distVincenty(lonLat1, lonLat2);

    return dist;

}

function scrollToRow(gridName, row) {

    //alert(row);
    //$(gridName).jqGrid('setSelection','" + row + "');
    //jQuery('#contact-list').jqGrid('editRow','8',true);
    //alert(jQuery(gridName).getGridParam('selarrrow'));
    //$(gridName + " > #8").focus();
    //jQuery('#contact-list').jqGrid('restoreRow',lastsel);
    //jQuery('#contact-list').jqGrid('editRow',row,true);
    //jQuery('#contact-list').jqGrid('restoreRow',lastsel);


    //jQuery('#contact-list').jqGrid('setSelection',row);
    $("#contact-list .ui-state-highlight").removeClass('ui-state-highlight');
    $("#contact-list #"+row).addClass('ui-state-highlight');

    var ids = jQuery("#contact-list").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++)
    {
      var current_id = ids[i];
      var row_data = $("#contact-list").getRowData(current_id);
      if(row_data['id'] == row)
      {
        var height = $("#"+current_id).attr('offsetHeight');

        //var index = $("#dynamic_arrival_times").getInd(current_id);
        $(".ui-jqgrid-bdiv").scrollTop(height*i);
        break;
      }
    }
}

function joinArrayAttributes(arr, attrib) {

    var retStr = "";

    for (var i = 0; i < arr.length; i++) {

        retStr += arr[i][attrib];

        if (i < arr.length) {
            retStr += ",";
        }
    }

    return retStr
}

// From $.ui.autocomplete.escapeRegex
function escapeRegex(value) {
    return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
}

function validateAddressWithBackbone(view, region, stripLineFeeds) {

    var showPopover = false;
    var popoverContent = "";
    var popoverTitle = "";

    /**
     * Returns the value of a property from an address_component, given a type and a property name,
     * only if the given type matches any of the address_component types.
     * More details https://developers.google.com/places/web-service/details
     *
     * address_component structure:
     *
     *   {
     *      "long_name" : "Pirrama Road",
     *      "short_name" : "Pirrama Rd",
     *      "types" : [ "route" ]
     *   },
     *
     * @usage:
     *
     *   getComponentProp(addrComponents, "route", "long_name"); // Returns "Pirrama Road"
     *
     * @param components {array} - list of address_components from geocoder.geocode() results.
     * @param type {string} - The component type ("route", "street_number", "postal_code", ...)
     * @param prop  {string} - The property to get the value ("long_name", "short_name")
     * @returns {Mixed|*|string}
     */
    function getComponentProp (components, type, prop) {
        var component = _.head(_.filter(components, function(comp) {
            return _.contains(comp.types, type);
        }));
        return (component && component[prop]) || "";
    }

    // ensure google is defined
    if (typeof google != "undefined") {

        var geocoder = new google.maps.Geocoder();
        var address = view.model.get("addrEntered") ? view.model.get("addrEntered") : "";

        if (stripLineFeeds) {
            address = address.replace(/\n/g, " ");
            address = address.replace(/\r/g, " ");
        }

        geocoder.geocode({'address': address, 'region': region}, function (results, status) {

            if (status === google.maps.GeocoderStatus.OK) {

                var addrComponents = results[0].address_components;
                var statusString = status;
                var route = getComponentProp(addrComponents, "route", "long_name");
                var street_number = getComponentProp(addrComponents, "street_number", "long_name");
                var postalCode = getComponentProp(addrComponents, "postal_code", "long_name");
                var cityTown = getComponentProp(addrComponents, "postal_town", "long_name");
                var locality = getComponentProp(addrComponents, "locality", "long_name");
                var subLocality = getComponentProp(addrComponents, "sublocality", "long_name");
                var country = getComponentProp(addrComponents, "country", "short_name");
                var admAreaLevel1 = getComponentProp(addrComponents, "administrative_area_level_1", "short_name");
                var admAreaLevel2 = getComponentProp(addrComponents, "administrative_area_level_2", "short_name");
                var stateCounty = country === "GB" ? admAreaLevel2 : admAreaLevel1; // II-6843
                var street1;

                /*
                 Temporary fix for gmaps-api issue : 3320
                 https://code.google.com/p/gmaps-api-issues/issues/detail?id=3320
                 if cityTown is not set already with postal_town
                 update cityTown with sublocality if there is no locality
                 */
                if (cityTown === "") {
                    if (locality !== "") {
                        cityTown = locality;
                    } else {
                        cityTown = subLocality;
                    }
                }

                // define street1 from user entry
                // II-6808
                // If cityTown appears more than once in the full address, and route has been returned from Google response,
                // then set street1 value from that route value and the street_number
                // Otherwise, set street1 value as anything entered by the user before cityTown
                var addrEntered = view.model.get("addrEntered") ? view.model.get("addrEntered") : "";
                var index = addrEntered.indexOf(cityTown);
                var ctRegExp = new RegExp(escapeRegex(cityTown),"gi");
                var count = (addrEntered.match(ctRegExp) || []).length;

                // II-6808
                if (count > 1 && route !== "") {
                    street1 = (street_number + " " + route).trim() ;
                } else if (addrEntered !== "") {
                    street1 = addrEntered.substr(0, index).replace(/\n/g, " ").trim();
                }

                if (results.length > 1) {

                    statusString = statusString + ".MULTIPLE_RESULTS";

                    showPopover = true;
                    popoverTitle = "Multiple Matches";
                    popoverContent = "<p>Address validation returned multiple matching results: <ul class=''>";
                    for (var i = 0; i < results.length; i++) {
                        popoverContent += "<li>" + results[i].formatted_address + "</li>";
                    }
                    popoverContent += "</ul>";
                    popoverContent += "<p>Please review the alternative suggestions, refine the address if necessary and retry the validation to get an accurate match.</p>";

                    view.model.set({
                        "validationStatus": statusString,
                        "addrFormatted": results[0].formatted_address,
                        "postalCode": postalCode,
                        "street1" : street1,
                        "cityTown": cityTown,
                        "stateCounty": stateCounty,
                        "lat": results[0].geometry.location.lat(),
                        "lng": results[0].geometry.location.lng(),
                        "valid": true,
                        "validated": true,
                        "showPopover": showPopover,
                        "popoverTitle": popoverTitle,
                        "popoverContent": popoverContent
                    }, {silent: true});

                } else if (results[0].partial_match == true) {

                    //if partial_match is not true the value is "undefined"

                    statusString = statusString + ".PARTIAL";

                    showPopover = true;
                    popoverTitle = "Partial Match";
                    popoverContent = "<p>Address validation found a partial match: <ul class=''>";
                    popoverContent += "<li>" + results[0].formatted_address + "</li>";
                    popoverContent += "</ul>";
                    popoverContent += "<p>Please refine the address and retry the validation.</p>";

                    view.model.set({
                        "validationStatus": statusString,
                        "addrFormatted": results[0].formatted_address,
                        "postalCode": postalCode,
                        "street1" : street1,
                        "cityTown": cityTown,
                        "stateCounty": stateCounty,
                        "lat": results[0].geometry.location.lat(),
                        "lng": results[0].geometry.location.lng(),
                        "valid": true,
                        "validated": true,
                        "showPopover": showPopover,
                        "popoverTitle": popoverTitle,
                        "popoverContent": popoverContent
                    }, {silent: true});

                } else {

                    view.model.set({
                        "validationStatus": statusString,
                        "addrFormatted": results[0].formatted_address,
                        "postalCode": postalCode,
                        "street1" : street1,
                        "cityTown": cityTown,
                        "stateCounty": stateCounty,
                        "lat": results[0].geometry.location.lat(),
                        "lng": results[0].geometry.location.lng(),
                        "valid": true,
                        "validated": true,
                        "showPopover": showPopover,
                        "popoverTitle": popoverTitle,
                        "popoverContent": popoverContent
                    }, {silent: true});

                }

            } else {

                showPopover = true;
                popoverTitle = "No Match";
                popoverContent = "<p>Address validation failed with response code: <ul class=''><li>" + status + "</li></ul><p>Please refine the address and retry the validation.</p>";

                view.model.set({
                    "validationStatus": status,
                    "lat": 0,
                    "lng": 0,
                    "valid": false,
                    "validated": false,
                    "showPopover": showPopover,
                    "popoverTitle": popoverTitle,
                    "popoverContent": popoverContent
                }, {silent: true});
            }

            //rerender the view
            view.render();

        });

    } else {

        // google not defined e.g. customer portal cannot access google JS API

        view.model.set({
            "validationStatus": "GOOGLE_NOT_AVAILABLE",
            "lat": 0,
            "lng": 0,
            "valid": false,
            "validated": false,
            "showPopover": showPopover,
            "popoverTitle": popoverTitle,
            "popoverContent": popoverContent
        }, {silent: true});
    }
}

function validateDateRange(periodStart, periodEnd) {

    //called from addOrUpdateDateRangeFilter and addDateRangeParams
    //pulls in the periodStart and periodEnd values to compare the format with the company config dateFormat
    var periodStart = Date.parseExact(periodStart, App.config.company.config.dateFormat);
    var periodEnd = Date.parseExact(periodEnd, App.config.company.config.dateFormat);

    if ( !periodStart || !periodEnd || (!periodStart && !periodEnd) ) {
        //if the format does not match, periodStart and/or periodEnd return null
        //if they are null, display a popup error for the user to see they need to change their format to the proper dateFormat according to the company config
        popupHandleActionError({
            message: "The format for Period Starting and Period Ending should be " + App.config.company.config.dateFormat + ". Please change your format and try again."
        });
    } else {
        return true;
    }

}

function isChecked(val) {

    if (val && (val === true) || (val === "true")) {

        return "checked";
    }

    return "";

}

/**
 * initialization for date picker in grid
 */
var dateSearchInit = function(elem) {

    $(elem).datepicker({
        //dateFormat: "dd/mm/yy"
        dateFormat: App.config.company.config.jsDateFormat,
        changeMonth: true,
        changeYear: true,
        yearRange: "-80:+20",
        onSelect: function(dateText, inst) {
            //$(elem).datepicker('hide');
            $(this).change();
        }/*,
        onClose: function(dateText, inst) {
            //trigger refresh on the grid
            $(elem).parents("table tr:nth-child(1)").triggerToolbar();
        }*/
    });

    //alert($(this).attr('id'));
    //$(elem).change(function(){ alert($(this).attr('id')); /*$('#booking-list')[0].triggerToolbar();*/ });

}

/**
 * determine if n is a number
 */
function isNumber(n) {

  //if (n === "0" || n === "0.0") return true;

  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * overwrite the ISO function to ignore milliseconds to match up with the format expected by Grails
 *
 * @return {String}
 */
Date.prototype.toISOString = function(){
    function pad(n){return n<10 ? '0'+n : n}
    return this.getUTCFullYear()+'-'
        + pad(this.getUTCMonth()+1)+'-'
        + pad(this.getUTCDate())+'T'
        + pad(this.getUTCHours())+':'
        + pad(this.getUTCMinutes())+':'
        + pad(this.getUTCSeconds())+'Z'
};

Date.fromISOString = function(isostr){
    if (!isostr) {
        return null;
    }
    var parts = isostr.match(/\d+/g);
    var localDate = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    localDate.addMinutes(-1 * localDate.getTimezoneOffset());
    return localDate;
};

/**
 * determine standard offset when not in DST
 * @return {Number}
 */
Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

/**
 * determine whether in dst or not
 * @return {Boolean}
 */
Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var	_ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();


// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

function openColorBox(rowId) {

    if(rowId) {
        $.colorbox({iframe:true, innerWidth:App.config.popups.legacy.width, innerHeight:App.config.popups.legacy.height, open:true, href: App.config.context + '/booking/refs/' + rowId + '#ssstabs-5', maxHeight: '500px', returnFocus: false, title: 'Booking Reference(s) / Details'});
    }
};

function openDocumentColorBox(rowId) {

    if(rowId) {
        $.colorbox({iframe:true, innerWidth:App.config.popups.legacy.width, innerHeight:'600px', open:true, href: App.config.context + '/contact/documents/' + rowId + '#ssstabs-5', maxHeight: '600px', returnFocus: false, title: 'Documents'});
    }
};

function businessUnitFilter(filterbuilder, type) {
    var buModel = new Prefs({name: 'businessUnit.id'});
    var buId = buModel.load() ? buModel.data["businessUnit.id"] : App.config.userData.businessUnit;
    type = type.toLowerCase();

    filterbuilder
        .removeAll([
            {field: "customerBusinessUnit.id", op: "eq"},
            {field: "interpreterBusinessUnit.id", op: "eq"},
            {field: "businessUnit.id", op: "eq"},
            {field: "consumerBusinessUnit.id", op: "eq"},
            {field: "interactionCustomerBusinessUnit.id", op: "eq"},
            {field: "requestorCustomerBusinessUnit.id", op: "eq"},
            {field: "clientCustomerBusinessUnit.id", op: "eq"}
        ])
        .removeByName("interpreterBusinessUnit")
        .update({field: "customerBusinessUnit.id", op: "eq", data: buId}, buId && type === "customer")
        // .update({field: "interpreterBusinessUnit.id", op: "eq", data: buId}, buId && type === "contact") // why is this interpreterBusinessUnit
        /*.addGroup("OR", !!buId && type === "contact", "interpreterBusinessUnit")
        .add({
                "op": "eq",
                "field": "businessUnit.id",
                "data": buId
            }, !!buId && type === "contact")
        .add({
                "op": "eq",
                "field": "businessUnit.id",
                "data": "null"
            }, !!buId && type === "contact")
        .done()*/
        .add(new $.filterbuilder
            .init({groupOp: "OR", rules: []})
            .add({
                "op": "eq",
                "field": "businessUnit.id",
                "data": buId
            }, !!buId && type === "contact")
            .add({
                "op": "eq",
                "field": "businessUnit.id",
                "data": "null"
            })
            .build(), !!buId && type === "contact", "interpreterBusinessUnit"
        )
        .update({field: "consumerBusinessUnit.id", op: "eq", data: buId}, buId && type === "consumer")
        .update({field: "interactionCustomerBusinessUnit.id", op: "eq", data: buId}, buId && type === "interaction")
        .update({field: "requestorCustomerBusinessUnit.id", op: "eq", data: buId}, buId && type === "requestor")
        .update({field: "clientCustomerBusinessUnit.id", op: "eq", data: buId}, buId && type === "client");
}

/**
 * TODO: legacy method to be replaced with businessUnitFilter when calling code migrated to use filterbuilder
 *
 *
 * @param filters
 * @param type
 * @deprecated
 * @returns {string}
 */
function addOrRemoveBusinessUnitFilter(filters, type) {

    // updated to be wrapper around new businessUnitFilter. this to be used
    // until the calling code of this method is refactored to use filterbuilder
    var buFilters = new $.filterbuilder.init(JSON.parse(filters)).call(businessUnitFilter, [type]);

    return buFilters.toString();

    // var filtersJSON;
    //
    // var buModel = new Prefs({name:'businessUnit.id'});
    //
    // if (filters) {
    //     filtersJSON = JSON.parse(filters);
    // }
    //
    // // Remove all BU Filters, if exists
    // filtersJSON = removeFilter(filtersJSON, "customerBusinessUnit.id", "eq");
    // filtersJSON = removeFilter(filtersJSON, "interpreterBusinessUnit.id", "eq");
    // filtersJSON = removeFilter(filtersJSON, "consumerBusinessUnit.id", "eq");
    // filtersJSON = removeFilter(filtersJSON, "interactionCustomerBusinessUnit.id", "eq");
    // filtersJSON = removeFilter(filtersJSON, "requestorCustomerBusinessUnit.id", "eq");
    // filtersJSON = removeFilter(filtersJSON, "clientCustomerBusinessUnit.id", "eq");
    //
    // if(buModel.load()) {
    //     // load from cookie
    //     var buId = buModel.data["businessUnit.id"];
    //
    //     if(buId !== "") {
    //         if(type === "customer" || type === "Customer") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "customerBusinessUnit.id", "eq", buId);
    //         } else if(type === "contact" || type === "Contact") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "interpreterBusinessUnit.id", "eq", buId);
    //         } else if(type === "consumer" || type === "Consumer") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "consumerBusinessUnit.id", "eq", buId);
    //         } else if(type === "interaction" || type === "Interaction") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "interactionCustomerBusinessUnit.id", "eq", buId);
    //         } else if(type === "requestor" || type === "Requestor") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "requestorCustomerBusinessUnit.id", "eq", buId);
    //         } else if(type === "client" || type === "Client") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "clientCustomerBusinessUnit.id", "eq", buId);
    //         }
    //     }
    //
    // } else if (App.config.userData.businessUnit) {
    //     // else load from user object
    //     buId = App.config.userData.businessUnit;
    //
    //     if(buId !== "") {
    //         if(type === "customer" || type === "Customer") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "customerBusinessUnit.id", "eq", buId);
    //         } else if(type === "contact" || type === "Contact") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "interpreterBusinessUnit.id", "eq", buId);
    //         } else if(type === "consumer" || type === "Consumer") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "consumerBusinessUnit.id", "eq", buId);
    //         } else if(type === "interaction" || type === "Interaction") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "interactionCustomerBusinessUnit.id", "eq", buId);
    //         } else if(type === "requestor" || type === "Requestor") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "requestorCustomerBusinessUnit.id", "eq", buId);
    //         } else if(type === "client" || type === "Client") {
    //             filtersJSON = addOrUpdateFilter(filtersJSON, "clientCustomerBusinessUnit.id", "eq", buId);
    //         }
    //     }
    // }
    //
    // filters = JSON.stringify(filtersJSON, null, "\t");
    //
    // return filters;
};

function getSelectedBusinessUnitId() {
    var buModel = new Prefs({name:'businessUnit.id'});

    var buId = "";

    if(buModel.load()) {
        // load from cookie
        buId = buModel.data["businessUnit.id"];
    }  else if (App.config.userData.businessUnit) {
        // else load from user object
        buId = App.config.userData.businessUnit;
    }
     return buId;
};

/**
 * Returns single association for the given requestor.
 * If association cookie exists, then the association is returned from the cookie
 * Else, first association from default associations list is returned and then saved to the cookie.
 *
 * @param  associations - List of all requestor associations
 * @param  defaultAssociations - List of requestor default associations
 *
 */

function getCustomerAssociation(associations, defaultAssociations) {
    var association = new $.core.CustomerClientLocation();
    var associationsPrefs = new Prefs({
        name: "requestor-association-preferences"
    });

    if (associationsPrefs.load()) {
        console.log("loading from cache", associationsPrefs);
        association.set("customer", associationsPrefs.data.customer);
        association.set("client", associationsPrefs.data.client);
        association.set("location", associationsPrefs.data.location);
        association.set("company", App.config.company);
    } else {
        console.log("load default associations", associationsPrefs);
        // revert to previous load
        if (defaultAssociations.size() > 0) {
            association = defaultAssociations.first();
        } else {
            association = associations.first();
        }
    }

    saveCustomerAssociation(association);

    return association;
};

/**
 * Saves association preference to a cookie
 *
 * @param  association - Selected association
 *
 */

function saveCustomerAssociation(association) {
    var associationsPrefs = new Prefs({
        name: 'requestor-association-preferences'
    });

    if (association) {
        associationsPrefs.data = association.toJSON();
        associationsPrefs.save(new Date().addYears(50), "/");
    }
};

/**
 * Adds the customer, client and location selection to the filters
 * This is used in CSR and LUR reports
 *
 * @param  associations - List of all requestor associations
 * @param  filtersJSON - JSON Filter
 *
 */

function addCustomerReportFilters(associations, filtersJSON) {
    var associationsPrefs = new Prefs({
        name: "requestor-association-preferences"
    });

    if (associationsPrefs.load()) {
        if (associationsPrefs.data.customer) {
            if (associationsPrefs.data.customer.id === "") {
                var customerIds = [];
                _.each(associations.models, function (assoc) {
                    var customerId = assoc.get("customer").id;
                    customerIds.push(customerId);
                });

                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.ids", "eq", customerIds.join(","));
            } else {
                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", associationsPrefs.data.customer.id);

                if (associationsPrefs.data.client) {
                    if (associationsPrefs.data.client.id !== "") {
                        filtersJSON = addOrUpdateFilter(filtersJSON, "client.id", "eq", associationsPrefs.data.client.id);
                    }
                }

                if (associationsPrefs.data.location) {
                    if (associationsPrefs.data.location.id !== "") {
                        filtersJSON = addOrUpdateFilter(filtersJSON, "location.id", "eq", associationsPrefs.data.location.id);
                    }
                }
            }
        }
    } else {
        var defaultAssociations = new $.core.CustomerClientLocationCollection(associations.filter(function (model) {
            return model.get("defaultAssociation") === true;
        }));

        var association = getCustomerAssociation(associations, defaultAssociations);

        filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", association.customer.id);
    }

    return filtersJSON;
}

/**
 * Adds the customer, client and location selection to the filters
 * This is used in Booking Reports Page
 *
 * @param  params - Filter params
 * @param  association - Selected association
 *
 */

function addCustomerAssociationReportParams(params, association) {
    // clearing existing associations
    delete params["customer.id"];
    delete params["client.id"];
    delete params["location.id"];

    if (association.get("customer")) {
        if (association.get("customer").id !== "") {
            params["customer.id"] = association.get("customer").id;
        }
    }

    if (association.get("client")) {
        if (association.get("client").id !== "") {
            params["client.id"] = association.get("client").id;
        }
    }

    if (association.get("location")) {
        if (association.get("location").id !== "") {
            params["location.id"] = association.get("location").id;
        }
    }

    return params;
}

/**
 * Adds the customer, client and location selection to the filters
 * This is used in Booking Reports Page
 *
 * @param  params - Filter params
 * @param  association - Selected association
 *
 */

function addBookingExportParams(associations, defaultAssociations, filtersJSON) {

    var association = getCustomerAssociation(associations, defaultAssociations);

    if (association.get("customer")) {
        if (association.get("customer").id !== "") {
            filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", association.get("customer").id);
        }
    }

    if (association.get("client")) {
        if (association.get("client").id !== "") {
            filtersJSON = addOrUpdateFilter(filtersJSON, "client.id", "eq", association.get("client").id);
        }
    }

    if (association.get("location")) {
        if (association.get("location").id !== "") {
            filtersJSON = addOrUpdateFilter(filtersJSON, "location.id", "eq", association.get("location").id);
        }
    }

    return filtersJSON;
}

/**
 * Returns filters after adding the selected customer, client and location.
 * This is used in Booking Reports Page
 *
 * @param  association - Selected association
 *
 */

function getCustomerBookingFilters(association) {
    var presetFilters = [];
    if (association.get("customer")) {
        if (association.get("customer").id !== "") {
            var customer = {
                field: "customer.id",
                op: "eq",
                data: association.get("customer").id
            };
            presetFilters.push(customer);
        }
    }
    if (association.get("client")) {
        if (association.get("client").id !== "") {
            var client = {
                field: "client.id",
                op: "eq",
                data: association.get("client").id
            };
            presetFilters.push(client);
        }
    }
    if (association.get("location")) {
        if (association.get("location").id !== "") {
            var location = {
                field: "location.id",
                op: "eq",
                data: association.get("location").id
            };
            presetFilters.push(location);
        }
    }

    return presetFilters;
}

/**
 * function to convert milliseconds into string for display e.g. 2 hours 30 minutes
 *
 * @param milliseconds
 * @returns {string}
 */
function millisecondsToStr (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks?
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}

function completeMillisecondsToStr (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }
    var result = " ";
    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        result += years + ' year' + numberEnding(years) + completeMillisecondsToStr(milliseconds - 1000 * years * 365 * 24 * 60 * 60);
        return result;
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        result += days + ' day' + numberEnding(days) + completeMillisecondsToStr(milliseconds - 1000 * days * 24 * 60 * 60);
        return result;
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        result += hours + ' hour' + numberEnding(hours) + completeMillisecondsToStr(milliseconds - 1000 * hours * 60 * 60);
        return result;
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        result += minutes + ' minute' + numberEnding(minutes) + completeMillisecondsToStr(milliseconds - 1000 * minutes * 60);
        return result;
    }
    var seconds = temp % 60;
    if (seconds) {
        result += seconds + ' second' + numberEnding(seconds) + completeMillisecondsToStr(milliseconds - 1000 * seconds);
        return result;
    }
    return "";
}

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place.
 *
 * NOTE
 *
 * It's inspired in _.get method from Lodash >= 3.7.0. See: https://lodash.com/docs/4.17.11#get
 * getNestedProp has the same args as _.get, so it can be replaced with _.get once we upgrade Lodash to >= 3.7.0.
 *
 * getNestedProp doesn't work with nested arrays as _.get does.
 *
 * USAGE
 *
 *   var object = { 'a': { 'b': { 'c': 3 } } };
 *
 *   getNestedProp(object, 'a.b.c'); // => 3
 *   getNestedProp(object, 'a.b.w', 'default'); // => 'default'
 *
 * @param {Object} obj
 * @param {string} path
 * @param {*} [defaultValue]
 * @returns {*}
 */
function getNestedProp (obj, path, defaultValue) {
    return _.inject(path.split('.'), function (o, k) {
        return o && o[k];
    }, obj);
}

/*
Presets for daterangepicker with presetRanges
 */

// presets for daterangepicker on almost all booking pages (unassigned page is the exception)
var bookingPresets = [
    {
        text: 'Tomorrow',
        dateStart: 'tomorrow',
        dateEnd: 'tomorrow+1day'
    }, {
        text: 'Next 5 Days',
        dateStart: 'today',
        dateEnd: 'today+5days'
    }, {
        text: 'Next 7 Days',
        dateStart: 'today',
        dateEnd: 'today+8days'
    }, {
        text: 'Next 14 Days',
        dateStart: 'today',
        dateEnd: 'today+15days'
    }, {
        text: 'Next 30 Days',
        dateStart: 'today',
        dateEnd: 'today+31days'
    }, {
        text: 'Today',
        dateStart: 'today',
        dateEnd: 'today+1day'
    }, {
        text: 'Last 7 days',
        dateStart: 'today-7days',
        dateEnd: 'today+1day'
    }, {
        text: 'Month to date',
        dateStart: function () {
            return Date.parse('today').moveToFirstDayOfMonth();
        },
        dateEnd: 'today+1day'
    }, {
        text: 'Year to date',
        dateStart: function () {
            var x = Date.parse('today');
            x.setMonth(0);
            x.setDate(1);
            return x;
        },
        dateEnd: 'today+1day'
    }
];

// presets for daterangepicker on unassigned booking page
var unassignedBookingPresets = [
    {
        text: 'Today',
        dateStart: 'today',
        dateEnd: 'today+1day'
    }, {
        text: 'Tomorrow',
        dateStart: 'Tomorrow',
        dateEnd: 'Tomorrow+1day'
    }, {
        text: 'Next 7 Days',
        dateStart: 'today',
        dateEnd: 'today+8days'
    }, {
        text: 'Next 14 Days',
        dateStart: 'today',
        dateEnd: 'today+15days'
    }, {
        text: 'Next 30 Days',
        dateStart: 'today',
        dateEnd: 'today+31days'
    }
];

// presets for daterangepicker on company financial dashboard page
var companyFinancialDashboardPresets = [
    {
        text: 'Last Month',
        dateStart: function () {
            return (new Date()).addMonths(-1).moveToFirstDayOfMonth();
        },
        dateEnd: function () {
            return (new Date()).moveToFirstDayOfMonth();
        }
    }, {
        text: 'Prior 3 Months',
        dateStart: function () {
            return (new Date()).addMonths(-3).moveToFirstDayOfMonth();
        },
        dateEnd: function () {
            return (new Date()).moveToFirstDayOfMonth();
        }
    }, {
        text: 'Month to Date',
        dateStart: function () {
            return Date.parse('today').moveToFirstDayOfMonth();
        },
        dateEnd: 'today+1day'
    }, {
        text: 'Year to date',
        dateStart: function () {
            var x = Date.parse('today');
            x.setMonth(0);
            x.setDate(1);
            return x;
        },
        dateEnd: 'today+1day'
    }, {
        text: 'Last 7 days',
        dateStart: 'today-7days',
        dateEnd: 'today+1day'
    }, {
        text: 'Last 14 days',
        dateStart: 'today-14days',
        dateEnd: 'today'
    }, {
        text: 'Last 30 days',
        dateStart: 'today-30days',
        dateEnd: 'today'
    }
];

// presets for daterangepicker on almost all financial and report pages (company.financial.dashboard is the exception)
var financialAndReportPresets = [
    {
        text: 'Last Month',
        dateStart: function () {
            return (new Date()).addMonths(-1).moveToFirstDayOfMonth();
        },
        dateEnd: function () {
            return (new Date()).moveToFirstDayOfMonth();
        }
    }, {
        text: 'Month to Date',
        dateStart: function () {
            return Date.parse('today').moveToFirstDayOfMonth();
        },
        dateEnd: 'today+1day'
    }, {
        text: 'Year to date',
        dateStart: function () {
            var x = Date.parse('today');
            x.setMonth(0);
            x.setDate(1);
            return x;
        },
        dateEnd: 'today+1day'
    }, {
        text: 'Today',
        dateStart: 'today',
        dateEnd: 'today+1day'
    }, {
        text: 'Last 7 days',
        dateStart: 'today-7days',
        dateEnd: 'today+1day'
    }, {
        text: 'Last 14 days',
        dateStart: 'today-14days',
        dateEnd: 'today+1day'
    }, {
        text: 'Last 30 days',
        dateStart: 'today-30days',
        dateEnd: 'today+1day'
    }
];

$(window).bind('resize', function() {
    var jqgrid;
    if($('.tab-content').length && $('.tab-pane.active').find('.ui-jqgrid').length) {
        jqgrid = "#" + $('.tab-pane.active').find('.ui-jqgrid').attr('id').substring(5);
    } else if ($('.ui-jqgrid').length) {
        jqgrid = "#" + $('.ui-jqgrid').attr('id').substring(5);
    }
    if(jqgrid) {
        var width;
        if($(jqgrid).closest('.portlet').width() != 0) {
            width = $(jqgrid).closest('.portlet').width();
        } else {
            width = $(jqgrid).closest('.tab-content').width();
        }
        if(width != 0 && _.isFunction($(jqgrid).setGridWidth)) {
            width = width - 4;
            $(jqgrid).setGridWidth(width);
        }
    }
}).trigger('resize');
