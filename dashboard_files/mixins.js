/*
 * Copyright (C) 2012 Interpreter Intelligence <support@interpreterintelligence.com>
 *
 * <copyright notice>
 *
 *
 */

(function ($) { //# sourceURL=app/common/mixins.js
    /* enable strict mode */
    "use strict";

    if (!$.app) $.app = {};

    $.app.mixins = $.app.mixins || {};

    $.app.mixins.templateHelpersMixin = {

        isNew: function () {
            return !this.id;
        },

        hasRole: function (role) {
            return _.contains(App.config.userData.roles, role);
        },

        selectOptions: (function () {
            var optionTemplate = _.template('<option <@ if (selected) { @> selected="selected" <@ } @> value="<@-value@>"><@-display@></option>');
            var defaults = {
                selected: null,
                value: 'id',
                display: 'name'
            };

            return function (list, opts) {
                opts = _.defaults(opts || {}, defaults);

                if (opts.sortBy) {
                    list = _.sortBy(list, "name");
                }

                // convert list to array of objects
                var asArray = _.toArray(list);

                // if a noSelection option has been passed in, prepend to array
                if (opts.noSelection) {
                    asArray.unshift(opts.noSelection);
                }

                return _.map(asArray, function (elmt) {
                    return optionTemplate({
                        selected: _.isFunction(opts.selected) ? opts.selected(elmt) : opts.selected === elmt[opts.value],
                        value: elmt[opts.value],
                        display: elmt[opts.display]
                    });
                }).join("\n");
            };
        })(),

        /**
         * method to populate select control from collection
         * TODO: can't bind this to view in return function, binds to model
         **/
        selectOptionsAsync: (function () {

            var optionTemplate = _.template('<option <@ if (selected) { @> selected="selected" <@ } @> value="<@-value@>"><@-display@></option>');
            var defaults = {
                selected: null,
                value: 'id',
                display: 'name'
            };

            return function (el, collection, opts) {
                opts = _.defaults(opts || {}, defaults);

                var that = this;

                collection.queryParams = collection.queryParams || {}; // ensure query params set
                collection.queryParams.sidx = opts.sidx || collection.queryParams.sidx;
                collection.queryParams.sord = opts.sord || collection.queryParams.sord;
                collection.queryParams.rows = opts.rows || collection.queryParams.rows;

                if (opts.filters) {
                    var filters = new $.filterbuilder.init();

                    _.each(opts.filters, function (f) {
                        filters.update(f);
                    }, this);
                    collection.queryParams.filters = filters.toString();
                }

                // fetch
                collection.fetch({
                    error: popupFetchOptions.error,
                    success: function (collection, response) {

                        var list = collection.toJSON();

                        if (opts.sortBy) {
                            list = _.sortBy(list, "name");
                        }

                        // convert list to array of objects
                        var asArray = _.toArray(list);

                        if (opts.propertyName) {
                            // pluck the named property
                            asArray = _.pluck(asArray, opts.propertyName);
                        }

                        // if a noSelection option has been passed in, prepend to array
                        if (opts.noSelection) {
                            asArray.unshift(opts.noSelection);
                        }

                        // clear element
                        $(el).empty();

                        _.each(asArray, function (elmt) {
                            $(el).append(optionTemplate({
                                selected: _.isFunction(opts.selected) ? opts.selected(elmt) : opts.selected == elmt[opts.value],
                                value: elmt[opts.value],
                                display: _.isFunction(opts.display) ? opts.display(elmt) : elmt[opts.display]
                            }));
                        });
                    },
                    rows: -1
                });

                // show initial loading
                return optionTemplate({
                    selected: true,
                    value: 'Loading ...',
                    display: 'Loading ...'
                });
            };
        })(),

        formatMoney: function (amt, precision, currencySymbol, currencyCode) {

            var options = {};

            options.symbol = currencySymbol ? currencySymbol : App.config.company.config.currencySymbol;

            if (options.symbol === null || options.symbol === "") {
                options.symbol = currencyCode ? currencyCode : App.config.company.config.currencyCode;
            }

            if (precision) {
                options.precision = precision;
            }

            // show brackets for negative
            accounting.settings.currency.format = {
                pos: "%s%v", // for positive values, eg. "$ 1.00" (required)
                neg: "(%s%v)", // for negative values, eg. "$ (1.00)" [optional]
                zero: "%s%v " // for zero values, eg. "$  --" [optional]
            };

            return accounting.formatMoney(amt, options);

        },

        // assumes date in UTC format (or at least parseable with no ambiguity)
        formatDate: function (dtStr, tz, fmt /* override format */ ) {

            if (!dtStr) {
                return "";
            }

            var dt = this.dateFromISO8601(dtStr);

            // First get local timezone offset for the provided date.
            var hereDate = new timezoneJS.Date(dt);
            var hereOffset = hereDate.getTimezoneOffset();
            var thereDate;

            if (tz) {
                thereDate = new timezoneJS.Date(dt, tz);
            } else {
                thereDate = new timezoneJS.Date(dt, App.config.userData.timeZone);
            }

            var thereOffset = thereDate.getTimezoneOffset();

            dt.addMinutes(hereOffset - thereOffset);

            return dt.toString(fmt ? fmt : App.config.company.config.dateFormat);
        },

        formatDateTime: function (dtStr, tz, fmt) {
            return this.formatDate(dtStr, tz, fmt) + " " + this.formatTime(dtStr, tz);
        },

        formatTime: function (dtStr, tz) {
            // TODO abstract the code duplication between here and formatDate

            if (!dtStr) {
                return "";
            }

            var dt = this.dateFromISO8601(dtStr);

            // First get local timezone offset for the provided date.
            var hereDate = new timezoneJS.Date(dt);
            var hereOffset = hereDate.getTimezoneOffset();
            var thereDate;

            if (tz) {
                thereDate = new timezoneJS.Date(dt, tz);
            } else {
                thereDate = new timezoneJS.Date(dt, App.config.userData.timeZone);
            }

            var thereOffset = thereDate.getTimezoneOffset();

            dt.addMinutes(hereOffset - thereOffset);

            return dt.toString(App.config.company.config.jsTimeFormat);
        },

        formatDuration: function (start, end) {

            if (!start || !end) {
                return "";
            }

            var difference = end - start;

            return completeMillisecondsToStr(difference);
        },

        formatTimeDuration: function () {

            var view = this;

            this.$el.find("select.time-duration").val(function () {
                var element = $(this);
                var start = view.model.get(element.data("start"));
                var end = view.model.get(element.data("end"));
                var time = element.data("time");
                return (start && end) ? $.common.extractDatesInformation(view.templateHelpers.dateFromISO8601(end.toLocaleString()) - view.templateHelpers.dateFromISO8601(start.toLocaleString()), true)[time] : null;
            });
        },

        parseDate: function (dtStr, tz) {

            // TODO merge common logic in parseDate and parseDateTime
            if (!dtStr) {
                return "";
            }

            // First get local timezone offset for the provided date.
            // parse date appends 12:00 midnight (h:mm tt)
            var dt = Date.parseExact(dtStr + " 12:00 AM", App.config.company.config.dateFormat + " h:mm tt");
            if (!dt) return;

            var hereOffset = dt.getTimezoneOffset();
            var thereDate;

            if (tz) {
                thereDate = new timezoneJS.Date(dt, tz);
            } else {
                thereDate = new timezoneJS.Date(dt, App.config.userData.timeZone);
            }

            var thereOffset = thereDate.getTimezoneOffset();


            dt.addMinutes(thereOffset - hereOffset);

            return dt.toISOString();

        },

        parseDateTime: function (dtStr, timeStr, tz) {
            if (!dtStr) {
                return "";
            }

            // First get local timezone offset for the provided date.
            var dt = Date.parseExact(dtStr + " " + timeStr, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);
            if (!dt) return;

            var hereOffset = dt.getTimezoneOffset();
            var thereDate;

            if (tz) {
                thereDate = new timezoneJS.Date(dt, tz);
            } else {
                thereDate = new timezoneJS.Date(dt, App.config.userData.timeZone);
            }

            var thereOffset = thereDate.getTimezoneOffset();

            dt.addMinutes(thereOffset - hereOffset);

            return dt.toISOString();
        },

        getShortTimezone: function (tz_id) {
            if (!tz_id) {
                return null;
            }

            var tz = _.where(App.dict.timeZones, {
                id: tz_id
            });

            if (tz) {
                return tz[0].shortName;
            } else return null;
        },

        millisecondsToStr: function (miliseconds) {
            return completeMillisecondsToStr(miliseconds);
        },

        dateFromISO8601: function (isoDateString) {
            var parts = isoDateString.match(/\d+/g);
            var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
            var isoDate = new Date(isoTime);

            return isoDate;
        },

        isGuaranteeEditable: function (model) {
            if ($.app.mixins.templateHelpersMixin.hasRole("cont") && $.app.mixins.templateHelpersMixin.isGuaranteeType(model)) {
                return false;
            } else {
                return true;
            }
        },

        isGuaranteeType: function (model) {
            if (model.get("type") && (model.get("type").nameKey === "guarantee" || model.get("type").nameKey === "forfeit")) {
                return true;
            } else {
                return false;
            }
        },

        convert24to12Hour: function (timeStr) {

            if (!timeStr) {
                return "";
            }

            // if timeStr already has AM/PM it's already converted, it can be returned
            if (timeStr.match("AM") !== null || timeStr.match("PM") !== null) {
                return timeStr;
            }
            var hrs = timeStr.split(":")[0];
            var mins = timeStr.split(":")[1];
            var AMPM;
            if (hrs >= 12) {
                if (hrs != 12) {
                    hrs -= 12;
                }
                AMPM = " PM";
            } else {
                // if the company config does not include hh, then remove the leading 0 from AM times
                if (hrs == "00") {
                    hrs = 12;
                }
                if (App.config.company.config.jsTimeFormat.match("hh") === null) {
                    hrs = parseInt(hrs, 10);
                }
                AMPM = " AM";
            }
            return hrs + ":" + mins + AMPM;
        },

        convert12to24Hour: function (timeStr) {

            if (!timeStr) {
                return "";
            }

            var hrs = timeStr.split(":")[0];
            hrs = parseInt(hrs, 10);
            var mins = timeStr.split(":")[1];
            var AMPM;
            // just in case if the job has been closed before and the end time is already in the company config 12 hour format, remove the AM/PM from the time
            if (mins.match("AM") !== null || mins.match("PM") !== null) {
                AMPM = mins.split(" ")[1];
                mins = mins.split(" ")[0];
            } else {
                // already 24 hour
                return timeStr;
            }
            if (AMPM == "PM") {
                if (hrs != 12) {
                    hrs += 12;
                }
            } else {
                // if the company config does not include hh, then remove the leading 0 from AM times
                if (hrs < 10) {
                    hrs = "0" + hrs;
                } else if (hrs == 12) {
                    hrs = "00";
                }
            }
            return hrs + ":" + mins;
        },

        clearCopyPasteHTMLRegex: function (string) {
            if (string) {
                // removes everything between and including < and > in string
                return string.replace(/(<([^>]+)>)/ig, "");
            } else {
                return null;
            }
        }
    };

    $.app.mixins.commonAppMixin = {

        cleanUpEditor: function (tinyMCEEditors, editorId) {
            if (tinyMCEEditors && tinyMCEEditors[editorId]) {
                _.each(tinyMCEEditors, function (editor, i, editors) {
                    if (editor.editorId === editorId) {
                        editors.splice(i, 1);
                        delete editors[editorId];
                        return false; // exits _.each loop
                    }
                });
            }
        },

        initialiseEditor: function (tinyMCEEditors, options) {
            var settings = _.defaults(options, {
                "script_url": App.config.context + "/js/tinymce/jscripts/tiny_mce/tiny_mce_src.js",
                "theme": "advanced",
                "theme_advanced_buttons1": "",
                "theme_advanced_buttons2": "",
                "theme_advanced_buttons3": "",
                "theme_advanced_buttons4": "",
                "force_br_newlines": true,
                "force_p_newlines": false,
                "forced_root_block": "", // Needed for 3.x
                "remove_linebreaks": true,
                "apply_source_formatting": false,
                "convert_newlines_to_brs": false,
                "relative_urls": false,
                "remove_script_host": false,
                "convert_urls": false,
                init_instance_callback: function () {
                    $(".mceToolbar a").attr("tabIndex", "-1");
                }
            });

            return function (elm) {
                var $editor = $(elm);
                var editorId = $editor.attr("id");

                // We must cleanup any existing editor before adding them again
                $.app.mixins.commonAppMixin.cleanUpEditor(tinyMCEEditors, editorId);

                $editor.tinymce(settings);
            };
        },

        // common callbacks to be invoked after view rendering
        callbacks: function (el, model) {
            var that = this;
            var $el = $(el);
            var editors = $el.find('.wysiwyg');
            var advancedEditors = $el.find('.wysiwyg-advanced');
            var tinyMCEEditors = window && window.tinyMCE && window.tinyMCE.editors;

            // do localize terminology changes
            doLocalize($el);

            //initialize select controls (assumption is that anything with .id maps to select control (not very efficient))
            if (model.attributes) {
                var attribs = keys(model.attributes);

                for (var i = 0; i < attribs.length; i++) {
                    if (attribs[i] === 'id' || attribs[i].indexOf(".id") != -1) {
                        this.setSelect(el, model, attribs[i]);
                        //$("#" + attribs[i].replace(".", "\\.") + " option[value=" + model.get(attribs[i]) + "]", el).attr("selected", "selected");
                    }
                }
            }

            // set the select controls for new API controls
            _.each($el.find(".api-v2"), function (elem) {
                var name = $(elem).attr("name");

                // if stub object is not null
                if (model.get(name)) {
                    //get id on nested object
                    $("option[value='" + model.get(name).id + "']", elem).attr("selected", "selected");
                }
            });

            //      model.
            //      $("#type\\.id option[value=" + this.model.get("type.id") + "]", this.$el).attr("selected", "selected");

            if ($el.find(".gridiFramePopup").length > 0) {
                $el.find(".gridiFramePopup").colorbox({
                    iframe: true,
                    innerWidth: App.config.popups.cal.width,
                    innerHeight: App.config.popups.cal.height,
                    open: false,
                    returnFocus: false
                });
                $el.find(".gridPopup").colorbox();
            }

            //initialize helptext if enabled
            if (App['helptext-enabled']) {
                if (jQuery.fn.popover) {
                    $el.find(".helptext").popover($.common.popOverOptions());
                }
            } else {
                $el.find(".helptext").hide();
            }

            // turn on all tooltips
            if (jQuery.fn.tooltip) {
                $el.find("[rel=tooltip]").tooltip();
            }

            //inintialize any editors
            //check tinymce has been declared
            if (jQuery.fn.tinymce) {
                if (editors.length > 0) {
                    _.each(editors, $.app.mixins.commonAppMixin.initialiseEditor(tinyMCEEditors, {
                        plugins: "paste",
                        theme_advanced_buttons1: "fontselect,fontsizeselect,bold,italic,underline,strikethrough",
                        theme_advanced_buttons2: ",forecolor,backcolor,|,undo,redo,bullist,numlist,pastetext",
                        paste_auto_cleanup_on_paste: true,
                        paste_strip_class_attributes: "all",
                        paste_remove_spans: true,
                        paste_remove_styles: true,
                        paste_text_sticky: true,
                        paste_text_sticky_default: true,
                        onchange_callback: function (inst) {
                            that.synchModelWysiwyg(inst, model);
                        }
                    }));
                }

                if (advancedEditors.length > 0) {
                    _.each(advancedEditors, $.app.mixins.commonAppMixin.initialiseEditor(tinyMCEEditors, {
                        width: '100%',
                        height: '450',
                        plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                        theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                        theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                        theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                        theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                        theme_advanced_toolbar_location: "top",
                        theme_advanced_toolbar_align: "left",
                        theme_advanced_statusbar_location: "bottom",
                        theme_advanced_resizing: false,
                        onchange_callback: function (inst) {
                            that.synchModelWysiwyg(inst, model);
                        }
                    }));
                }
            }

            // Binding the element to events input, textarea and select.
            // TODO: uncomment
            //            this.setEventsToEl(el);
            // Binding the model to events error, invalid and sync.
            // TODO: uncomment
            //            this.setEventsToModel(model);
            // Call elements formatter.
            // TODO: uncomment
            //            this.formatElements();
            // Show secured elements handler.
            // TODO: uncomment
            //            this.showSecured();
        },

        // Hook into model to prompt unsaved changes confirmation when leaving page.
        // TODO: add hook to callbacks function if this is wanted throughout the application.
        hookPristine: function (model) {
            function confirmOnPageExit(e) {
                e = e || window.event;
                var message = 'You have unsaved changes';
                if (e) {
                    e.returnValue = message;
                }
                return message;
            }
            model.on('change', function () {
                window.onbeforeunload = confirmOnPageExit;
            });
            model.on('sync', function () {
                window.onbeforeunload = null;
            });
        },

        setEventsToEl: function (el) {
            var eventsToBound = ["input", "textarea", "select"];
            var events = $.data(el, "events").change;
            events = _.map(events, function (event) {
                return event.selector;
            });
            events = _.difference(eventsToBound, events);
            $(el).on("change", events.join(','), this.synchModel);
        },

        setEventsToModel: function (model) {
            model.on('error', this.error);
            model.on('invalid', this.invalid);
            model.on('sync', this.render);

            model.on('request', submitActions.disableAll);
            model.on('sync', submitActions.enableAll);
            model.on('error', submitActions.enableAll);
        },

        /**
         * set the select control identified by id to the value
         */
        setSelect: function (el, model, id, field) {
            //escape the '.'
            //attribs[i] = attribs[i].replace(".", "\\\\.");

            if (field) {
                //use the field to populate the dropdown
                $("select[name='" + id.replace(".", "\\.") + "'] option[value='" + model.get(field) + "']", el)
                    .first() // Added because of nested select boxes. Introduced with II-5504
                    .attr("selected", "selected");
            } else {
                //use the id field to populate dropdown
                $("select[name='" + id.replace(".", "\\.") + "'] option[value='" + model.get(id) + "']", el)
                    .first() // Added because of nested select boxes. Introduced with II-5504
                    .attr("selected", "selected");
            }
        },

        /*
         * method to synch a model
         */
        synch: function (evt, silent) {

            var changed = evt.currentTarget;
            var $changed = $(changed);
            var name = $changed.attr("name"); //$(evt.currentTarget).attr("id");
            //get the value
            var value = $changed.val(); //$(evt.currentTarget).val();

            if (!name) {
                return;
            }

            // Dropdown autocompletes have their own logic for setting the model
            if ($changed.parents('.dropdown-autocomplete').length > 0) {
                return;
            }

            var success;
            //check if input is a checkbox. disregard value for checkbox and use boolean
            if ($changed.is(":checkbox")) {
                //override the value
                value = $changed.prop("checked");
                //try to show check on IE
                //$(changed).prop("checked", value);
                success = this.model.set(name, value);
            } else if ($changed.hasClass("api-delegate")) {

                // the change is handled by another widget
                // need to ensure that anything delgated correctly resets the
                // error classes as they will not be done here
                return;
            } else if ($changed.hasClass("api-v2")) { // stub object
                var obj = {};
                // assume only applies to drop downs
                if (value) {
                    obj = {
                        id: parseInt(value, 10),
                        name: $(changed).find(':selected').text()
                    };
                } else {
                    obj = null;
                }

                success = this.model.set(name, obj);
            } else if ($changed.hasClass("api-delegate")) { // stub object
                // Relationship object setting is delegated to $.common.generateAutoComplete select function
                return;
            } else if ($changed.is("input.format-date") || $changed.is("input.format-time")) { // Set a date
                var timezone = $changed.data("timezone"),
                    $timeEl = this.$el.find("input[name=" + name + "].format-time"),
                    $dateEl = this.$el.find("input[name=" + name + "].format-date");

                var date;

                if (($dateEl.length === 1) && ($timeEl.length === 0)) {
                    // only parse date
                    date = this.templateHelpers.parseDate($dateEl.val(), timezone);
                } else if (($dateEl.length === 1) && ($timeEl.length === 1)) {
                    // parse date time
                    var timeValue = $timeEl.val();

                    // check for type of time input field. type of 'time' indicates native mobile widget
                    // so need to do conversion to / from 12 to 24 hours. input that are set to type="time"
                    // always returns value in 24 hours (at least so far) and this is what gets set on the
                    // input value and s such we need to convert these to expected format on back end.
                    // browsers set the value to 24 hour time. check for match on tt (AM/PM is used)
                    // if it's used 24 hour needs converted to 12 hour with AM/PM before setting on model.
                    // NOTE: when setting the field value, we need to do the opposite conversion

                    // do the conversion if company time is not in 24 hour format && input element is time
                    if (!App.config.company.config.isTimeFormat24Hour && $timeEl.attr("type") === "time") {

                        // convert field value rom 24
                        timeValue = this.templateHelpers.convert24to12Hour(timeValue);
                    }

                    date = this.templateHelpers.parseDateTime($dateEl.val(), timeValue, timezone);
                } else {
                    // not enough information
                    return;
                }
                success = this.model.set(name, date);
                if (success) {
                    // If the start date changes, we need to update the end dates based on any set durations
                    this.$el.find("input[data-start=" + name + "].format-duration").trigger("change");
                }
            } else if ($changed.is("input.format-duration")) { // Set a duration
                var startName = $changed.data("start"),
                    endName = $changed.data("end"),
                    startDate = Date.fromISOString(this.model.get(startName));

                // quick and dirty hack to make sure start date is valid
                if (startDate && (startDate.getFullYear() > 0)) {
                    var endDate = startDate.addHours(value);

                    if (endDate && (endDate.getFullYear() > 0)) {
                        success = this.model.set(endName, endDate.toISOString());
                    }
                    // Also set the value directly, so hilighting works
                    success = success && this.model.set(name, value);
                }
            } else if ($changed.is("select.format-duration")) { // Set a duration
                var start = $changed.data("start"),
                    end = $changed.data("end"),
                    startDateISO = this.templateHelpers.dateFromISO8601(this.model.get(start)),
                    hoursContainer = $($changed.data("hours")),
                    minutesContainer = $($changed.data("mintues"));
                var startOffset = startDateISO.getTimezoneOffset();
                var endOffset;
                // quick and dirty hack to make sure start date is valid
                if (startDateISO && (startDateISO.getFullYear() > 0)) {
                    var endDateISO = startDateISO;
                    if (hoursContainer.length > 0) {
                        endDateISO = endDateISO.addHours(hoursContainer.val());
                    }
                    if (minutesContainer.length > 0) {
                        endDateISO = endDateISO.addMinutes(minutesContainer.val());
                    }

                    // This is to handle bookings that have start date and end date
                    // in DST and non DST.
                    endOffset = endDateISO.getTimezoneOffset();
                    var offSetDiff = startOffset - endOffset;
                    endDateISO.addMinutes(offSetDiff);
                    if (endDateISO && (endDateISO.getFullYear() > 0)) {
                        success = this.model.set(end, endDateISO.toISOString());
                    }
                    // Also set the value directly, so hilighting works
                    success = success && this.model.set(name, value);
                }
            } else {
                success = this.model.set(name, value);
            }

            //reset any error class if silent (otherwise validation may have set error class)
            if (success) {
                // TODO: apply to id, class and name while transitioning from id to class nomenclature
                this.$("#" + name.replace(".", "\\.")).closest(".control-group").removeClass("error");
                this.$("." + name.replace(".", "\\.")).closest(".control-group").removeClass("error");
                this.$("input[name='" + name.replace(".", "\\.") + "']").closest(".control-group").removeClass("error");
                this.$("select[name='" + name.replace(".", "\\.") + "']").closest(".control-group").removeClass("error");
                // add error to label for when not in same tree
                this.$("label[for='" + name.replace(".", "\\.") + "']").closest(".control-group").removeClass("error");
            }

            //don't bubble event to avoid children bubbling up to parent
            evt.stopPropagation();
            return true;
        },

        templateHelpers: $.app.mixins.templateHelpersMixin,

        /**
         * used to synchronize form updates to the model after changes have been made
         */
        synchModel: function (evt) {
            this.synch.call(this, evt, true);
            return true;
        },

        /**
         * used to synchronize form updates to the model after changes have been made.
         * <p>
         * this version performs validation on model
         */
        synchModelWithValidation: function (evt) {
            this.synch.call(this, evt, false);
            return true;
        },

        synchModelWysiwyg: function (inst, model) {
            var name = inst.getElement().name;
            var value = inst.getContent();
            //if (console) console.log("Wysiwyg update [" + name + ": " + value.substring(10) + "] on model.");

            var obj = {};
            obj[name] = value;
            //  var objInst = JSON.parse(obj);
            //this.model.set(objInst);
            //don't fire change event
            //model.set(obj, {silent: true});
            model.set(obj, {
                silent: true
            });
        },

        /* duplicate of invalid function */
        error: function (model, response, options) {
            if (response.responseText) {
                response = JSON.parse(response.responseText);
            }
            //var that =
            //highlight view issues
            _.each(response.errors, function (err) {
                // TODO: apply to id and class while transitioning from id to class nomenclature
                //escape period
                this.$("#" + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("." + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("input[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("select[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("textarea[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                // add error to label for when not in same tree
                this.$("label[for='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
            }, this);

            //bubble to default handler
            handleError(model, response, options);
            return false;
        },

        /* duplicate of error function */
        invalid: function (model, response, options) {
            //highlight view issues
            _.each(response.errors, function (err) {
                // TODO: apply to id and class while transitioning from id to class nomenclature
                //escape period
                this.$("#" + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("." + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("input[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("select[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("textarea[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                // add error to label for when not in same tree
                this.$("label[for='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
            }, this);

            //bubble to default handler
            handleError(model, response, options);
            return false;
        },

        // duplicate methods to handle popup
        popupError: function (model, response, options) {
            var responseBody = response;
            if (response.responseText) {
                responseBody = JSON.parse(response.responseText);
            }
            //var that =
            //highlight view issues
            _.each(responseBody.errors, function (err) {
                // TODO: apply to id and class while transitioning from id to class nomenclature
                //escape period
                this.$("#" + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("." + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("input[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("select[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("textarea[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                // add error to label for when not in same tree
                this.$("label[for='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
            }, this);

            //bubble to default handler
            popupHandleError(model, response, options);
            return false;
        },

        // duplicate methods to handle popup
        popupInvalid: function (model, response, options) {
            //highlight view issues
            _.each(response.errors, function (err) {
                // TODO: apply to id and class while transitioning from id to class nomenclature
                //escape period
                this.$("#" + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("." + err.field.replace(".", "\\.")).closest(".control-group").addClass("error");
                this.$("input[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("select[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                this.$("textarea[name='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
                // add error to label for when not in same tree
                this.$("label[for='" + err.field.replace(".", "\\.") + "']").closest(".control-group").addClass("error");
            }, this);

            //bubble to default handler
            popupHandleError(model, response, options);
            return false;
        },

        formatElements: function () {
            var view = this;
            var elements = this.$el.find(":input.format-date").val(function (index, value) {
                var timeZone = $(this).data("timezone");
                // console.log("TimeZone", timeZone);
                return view.templateHelpers.formatDate(value, timeZone);
            });
            // only apply datepicker if available. not available on mobile
            if ($.datepicker) {
                elements.datepicker({
                    dateFormat: App.config.company.config.jsDateFormat,
                    showOtherMonths: true
                });
            }

            // setup time widget, if no value, can use defaultime
            // attribute to help time entry by setting minutes and
            // am / pm appropriately. if no value and no defaulttime
            // will set to the current hour / minute
            this.$el.find(":input.format-time").each(function () {

                var timeZone = $(this).data("timezone");
                var defaultTime = $(this).data("defaulttime");

                if (defaultTime) {
                    // parse into timezone so AM / PM set appropriately
                    defaultTime = view.templateHelpers.formatTime(defaultTime, timeZone);
                } else {
                    // if no default use current time with time cleared so always defaults to morning
                    defaultTime = new Date().clearTime();
                }

                // set the value and enable time entry
                elements = $(this).val(function (index, value) {

                    // for time fields we need to get the value from the data attribute as the widget
                    // returns "" unless the value is correctly formatted. at this point the value
                    // will still be UTC so need to get the value elsewhere
                    if ($(this).attr("type") === "time") {

                        value = $(this).data("value");
                    }

                    var timeValue = view.templateHelpers.formatTime(value, timeZone);

                    // check to see if field is of type="time". if so, the value needs to be converted to
                    // 24 hours as this the format used by browsers. the company config of time format is
                    // not used. this is primarily used on the mobile www site where time widgets are used
                    // NOTE that on synchModel the opposite conversion is done

                    // do the conversion if the value is not already in 24 hour format
                    if (!App.config.company.config.isTimeFormat24Hour && $(this).attr("type") === "time") {
                        timeValue = view.templateHelpers.convert12to24Hour(timeValue);
                    }

                    return timeValue;
                });

                // only apply timeEntry if available. not available on mobile
                if ($.timeEntry) {
                    elements.timeEntry({
                        spinnerImage: "",
                        ampmPrefix: " ",
                        defaultTime: defaultTime,
                        show24Hours: App.config.company.config.isTimeFormat24Hour
                    });
                }
            });

            // This is readonly, at least for the moment
            this.$el.find(":input.format-datetime").val(function (index, value) {
                var timeZone = $(this).data("timezone");
                return view.templateHelpers.formatDateTime(value, timeZone);
            });

            this.$el.find(":not(:input).format-datetime").html(function (index, value) {
                var timeZone = $(this).data("timezone");
                var fmt = $(this).data("format");
                return view.templateHelpers.formatDateTime(value, timeZone, fmt);
            });

            this.$el.find(":not(:input).format-date").html(function (index, value) {
                var timeZone = $(this).data("timezone");
                var fmt = $(this).data("format");
                return view.templateHelpers.formatDate(value, timeZone, fmt);
            });

            this.$el.find(":not(:input).format-time").html(function (index, value) {
                var timeZone = $(this).data("timezone");
                return view.templateHelpers.formatTime(value, timeZone);
            });

            // duration formatting
            this.$el.find(":not(:input).format-duration").html(function (index, value) {
                var startDate = Date.fromISOString(view.model.get($(this).data("start")));
                var endDate = Date.fromISOString(view.model.get($(this).data("end")));
                return view.templateHelpers.formatDuration(startDate, endDate);
            });

            view.templateHelpers.formatTimeDuration.call(view);
            /*this.$el.find("select.time-duration").val(function () {
                var element = $(this);
                var start = view.model.get(element.data("start"));
                var end = view.model.get(element.data("end"));
                var time = element.data("time");
                return (start && end) ? $.common.extractDatesInformation(view.templateHelpers.dateFromISO8601(end.toLocaleString()) - view.templateHelpers.dateFromISO8601(start.toLocaleString()))[time] : null;
            });*/
        },

        hilightUpdated: function () {
            var view = this;
            if (this.templateHelpers.hasRole("comp")) {
                var updatedFields = view.model.get("updatedFields") || [];

                // TODO: this'll flicker. fix it
                view.$el.find(".control-group").removeClass("updated");
                _.each(updatedFields, function (fieldName) {
                    // console.log("hilighting field: " + fieldName);
                    view.$("input[name='" + fieldName + "']").closest(".control-group").addClass("updated");
                    view.$("input.format-duration[data-end='" + fieldName + "']").closest(".control-group").addClass("updated");
                });
            }
        },

        hilightInvalid: function () {
            var view = this;
            if (this.templateHelpers.hasRole("comp")) {
                var invalidFields = view.model.get("invalidFields") || [];

                // TODO: this'll flicker. fix it
                view.$el.find(".control-group").removeClass("invalid");
                _.each(invalidFields, function (fieldName) {
                    // console.log("hilighting field: " + fieldName);
                    view.$("input[name='" + fieldName + "']").closest(".control-group").addClass("invalid");
                    view.$("input.format-duration[data-end='" + fieldName + "']").closest(".control-group").addClass("invalid");
                });
            }
        },

        showSecured: function () {

            doLocalize(this.$el);

            var view = this;
            // show secured elements
            // Ideally we'd use CSS instead of this function. The trouble is distinguishing between inline and block
            // elements. There's a CSS3 property called display: initial, but it's not supported in IE
            //var roles = ['comp', 'uberadmin', 'admin', 'user', 'cust', 'comp', 'cont', 'fina', 'beta', 'video'];
            view.$el.find('.secured-disabled').each(function (index, element) {
                $(element).attr("disabled", "disabled");
            });

            _.each(App.config.userData.roles, function (element) {
                //that.$el.find('.role-' + element + ' .secured-' + element).show();
                view.$el.find('.secured-' + element).each(function (index, elem) {
                    var $elem = $(elem);
                    if ($elem.hasClass('secured-disabled')) {
                        $elem.removeAttr("disabled");
                    } else {
                        $elem.show();
                    }
                });
            });
        },

        freezeFields: function () {
            var editFreeze = this.model.get("editFrozen");
            var status = this.model.get("status") && this.model.get("status").nameKey;

            if (editFreeze || status == "closed" || status == "verified") {
                this.$el.find("input").attr("disabled", "true");
                this.$el.find("select").attr("disabled", "true");
                this.$el.find("textarea").attr("disabled", "true")
                    .replaceWith(function () {
                        return '<div class="well">' + $(this).text() + '</div>';
                    });

                this.$el.find("button").attr("disabled", "true");
                this.$el.find("a.btn").addClass("disabled");
                this.$el.find("a").click(function (e) {
                    e.preventDefault();
                });
            }
        }
    };

    var visitActionsMixin = $.app.mixins.visitActionsMixin = {

        createAction: function (evt) {
            window.location.href = App.config.context + "/booking/create";
        },

        onSaveNewSuccess: function (model, response) {
            this.model.set({
                "isSaveFlow": false
            }, {
                "silent": true
            });

            // change browser URL to avoid page refresh issues
            History.pushState(null, "Booking # " + model.get("superBooking").id, App.config.context + "/job/edit/" + model.get("jobContextId"));

            popupFetchOptions.success(model, response, {
                waitForOk: true,
                template: "jobSuccessPopup",
                returnUrl: document.referrer
            });
        },

        onSaveNewError: function (model, response) {
            this.model.set({
                "isSaveFlow": false
            }, {
                "silent": true
            });

            popupFetchOptions.error(model, response, {
                waitForOk: true,
                template: "jobSuccessPopup",
                returnUrl: document.referrer
            });
        },

        getExpectedDurationInMins: function () {
            var expectedStartDate = Date.fromISOString(this.model.get("expectedStartDate"));
            var expectedEndDate = Date.fromISOString(this.model.get("expectedEndDate"));
            return (expectedEndDate - expectedStartDate) / 1000 /* milliseconds */ / 60 /* seconds */ ;
        },

        checkForShiftsUpdate: function () {
            var updateShiftsDialog;

            if (this.isShiftsErrorApplicable()) {

                // Show error message
                popupHandleActionError({
                    message: "Changing the start date/time or duration is not possible for this job since it has multiple shifts. Please contact the agency to make the change."
                });

                this.model.set({
                    "expectedStartDate": this.options.frameConfig.get("originalStartDate"),
                    "expectedEndDate": this.options.frameConfig.get("originalEndDate"),
                    "expectedDurationHrs": this.options.frameConfig.get("originalDurationHrs"),
                    "expectedDurationMins": this.options.frameConfig.get("originalDurationMins")
                });

                // Re-render the view (formatElements, ...)
                Backbone.trigger("render:JobDetailsView");

                // Reset date/time/duration change flag
                this.resetFlags();

            } else if (this.isShiftsApplicable()) {
                updateShiftsDialog = new $.common.JobUpdateShiftTimesConfirmationView({
                    "model": this.model,
                    "checkForBulkUpdate": this.checkForBulkUpdate.bind(this)
                });
                updateShiftsDialog.render(); // We will call this.checkForBulkUpdate(); from updateShiftsDialog
            } else {
                this.checkForBulkUpdate();
            }
        },

        checkForBulkUpdate: function () {
            var bulkEditDialog = new $.common.JobBulkEditOptionsView({
                jobModel: this.model,
                onOk: function () {
                    this.jobModelSave();
                }.bind(this)
            });

            // edit existing, check for bulk update
            if (this.isBulkApplicable()) {
                bulkEditDialog.render();
            } else {
                this.jobModelSave();
            }
        },

        saveAction: function (evt) {
            var originalVisitId = this.options.frameConfig.get("originalVisitId");
            var createOrigin = this.options.frameConfig.get("createOrigin");
            var saveModelAttrs = originalVisitId && originalVisitId !== "null" ? {
                "originalVisitId": originalVisitId,
                "createOrigin": createOrigin
            } : {};

            this.model.set({
                "isSaveFlow": true
            }, {
                "silent": true
            });

            // new job save, not follow-up or duplicate
            // implicitly assumes the save is for single job
            if (this.model.isNew()) {
                this.jobModelSave(saveModelAttrs, {
                    success: this.onSaveNewSuccess.bind(this),
                    error: this.onSaveNewError.bind(this),
                    header: "Warning!" // adding warning header for dialog message popup
                });
            } else {
                this.checkForShiftsUpdate();
            }
        },

        /**
         * Reset date/time/duration change flags. These are used to check if user changed the job date/time or duration
         */
        resetFlags: function () {
            this.options.frameConfig.set({
                "isDateChanged": false
            }, {
                "silent": true
            });
        },

        jobModelSave: function (attrs, options) {
            var saveAttrs = _.isObject(attrs) ? attrs : {};
            var saveOptions = _.isObject(options) ? _.defaults(options, popupFetchOptions) : popupFetchOptions;

            //disable save button to prevent double click
            this.$el.find(".widget-save").addClass("processing");

            // Need to check if this.model is valid before saving, so we can use this.model.save().done()
            // this.model.save() Returns a jqXHR if validation is successful and false otherwise
            // this.model.save().done returns an error in model isn't valid
            if (this.model.isValid()) {

                this.model.save(saveAttrs, saveOptions).done(function (response) {
                    // There are scenarios where the page is not refreshed after saving the job,
                    // so we need to reset these flags manually once the job has been saved
                    this.resetFlags();

                    // Make the "Save" button available again
                    this.$el.find(".widget-save").removeClass("processing");
                }.bind(this));
            } else {
                // Make the "Save" button available again
                this.$el.find(".widget-save").removeClass("processing");
            }
        },

        closeAction: function (evt) {

            // as this is visitActionsMixin
            // need the Booking id to close job using booking/review
            // get it by accessing interpreterJob in frameConfig
            var booking = this.options.frameConfig.get('interpreterJob');
            var companyConfig = App.config.company.config; // where to get company config from
            var customerConfig = this.options.frameConfig.get('customerConfig');

            // load a new model for closing
            var model = new $.visit.v2.InterpreterVisitModel(booking);
            model.fetch({
                success: function () {
                    var close = new $.closing.init({
                        job: model,
                        companyConfig: companyConfig, // where to get company config from
                        customerConfig: customerConfig,
                        debug: false
                    });
                    close.render();
                }
            });

            // if (this.model.get("status").id === App.dict.bookingStatus.closed.id) {
            //     // only allow company users close already closed bookings
            //     if (!_.contains(App.config.userData.roles, "comp")) {
            //         popupHandleCustomerError("The booking has previously been closed. If you would like to update the booking details please contact the administrator.");
            //         return null;
            //     }
            // }
            //
            // if (booking.id) {
            //     $.colorbox({
            //         iframe: true,
            //         innerWidth: App.config.popups.landscape.width,
            //         innerHeight: App.config.popups.landscape.height,
            //         open: true,
            //         href: App.config.context + '/booking/review/' + booking.id,
            //         returnFocus: false,
            //         title: 'Close Booking',
            //         onCleanup: function () {
            //             Backbone.trigger("bookingUpdate", booking);
            //         }
            //     });
            // } else {
            //     handleActionError({
            //         message: "Please save the job first."
            //     });
            // }
            evt.preventDefault();
        },

        /**
         * We should allow requestors to change date & time and duration for single interpreter jobs and straight team
         * jobs that do not have shifts. We prevent this change only if a job is part of the team visit with shifts
         * @returns {boolean}
         */
        isShiftsErrorApplicable: function () {
            var shiftEnabled = this.model.get("shiftEnabled");
            var isDateChanged = this.options.frameConfig.get("isDateChanged");
            var isRequestor = $.app.mixins.templateHelpersMixin.hasRole("cust");

            return !!(isRequestor && shiftEnabled && isDateChanged);
        },

        /**
         * Do not display the updateShiftTimes popup when the duration has been made shorter.
         * @returns {boolean}
         */
        isShiftsApplicable: function () {
            var shiftEnabled = this.model.get("shiftEnabled");
            var originalDurationInMins = _.parseInt(this.options.frameConfig.get("originalDurationMins"));
            var expectedDurationInMins = this.getExpectedDurationInMins();
            var isShortedDuration = expectedDurationInMins < originalDurationInMins;

            return !!(shiftEnabled &&
                this.options.frameConfig.get("isDateChanged") &&
                !isShortedDuration);
        },

        isBulkApplicable: function () {
            var mdl = this.model;
            var numRecurringJobs = mdl.get("numJobs");

            if (numRecurringJobs <= 1) {
                return false;
            }

            return !!(mdl.hasChanged("notes") ||
                mdl.hasChanged("billingNotes") ||
                mdl.hasChanged("interpreterNotes") ||
                mdl.hasChanged("excludeFromAutoOffer") ||
                mdl.hasChanged("excludeFromJobOfferPool") ||
                this.options.frameConfig.get("isDateChanged") ||
                mdl.hasChanged("customerRatePlan") ||
                mdl.hasChanged("contactRatePlan"));
        },

        editAction: function (evt) {
            if (this.model.id) {
                window.location.href = App.config.context + "/job/edit/" + this.options.frameConfig.get("jobContextId");
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            return false;
        },

        archiveFieldAction: function (evt) {
            var view = this;
            view.model.set("updateCheckpoint", new Date().toISOString());
            view.model.save().done(function () {
                // TODO: there's enough of a drift between client and server that this is necessary.
                // but perhaps if we change from passing a date to passing a flag of some sort it won't be.
                view.model.set("updatedFields", []);
                view.hilightUpdated();
            });
            return false;
        },

        cloneAction: function (evt) {
            //TODO: ajax call to manager
            if (this.model.id) {
                window.location.href = App.config.context + '/visit/manager/clone/' + this.model.id;
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            return false;

            //            var visitModel = $.core.JobModel.findOrCreate({
            //                id: this.model.id
            //            });
            //            this.model.createFollowUp();
        },

        cancelAction: function (evt) {
            var visitModel = $.core.JobModel.findOrCreate({
                id: this.model.id
            });
            visitModel.fetch().done(function () {
                var view = new $.common.VisitCancelView({
                    disableVos: true,
                    model: visitModel
                });
                view.render();

                // Hack to make sure any context menus close
                view.$el.click();
            });

            evt.preventDefault();
        },

        duplicateAction: function (evt) {
            // TODO: ajax call to manager
            if (this.model.id) {
                window.location.href = App.config.context + '/visit/manager/duplicate/' + this.model.id;
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            return false;

            //            var visitModel = $.core.JobModel.findOrCreate({
            //                id: this.model.id
            //            });
            //            this.model.duplicate();
        },

        repeatAction: function (evt) {
            var visitModel = $.core.JobModel.findOrCreate({
                id: this.model.id
            });

            visitModel.fetch().done(function () {
                var view = new $.common.VisitRepeatView({
                    disableVos: true,
                    model: visitModel
                });
                view.render();
                // Hack to make sure any context menus close
                view.$el.click();
            });

            evt.preventDefault();
        },

        deleteAction: function (evt) {

            var jobModel = this.model;

            // edit existing, check for bulk update
            var numRecurringJobs = this.model.get("numJobs");
            if (numRecurringJobs > 1) {
                var view = new $.common.JobBulkDeleteOptionsView({
                    jobModel: jobModel,
                    onOk: function () {

                        if (confirm("Are you sure you want to delete the job?\n\nThis action is not reversible.")) {
                            jobModel.destroy({
                                data: {
                                    bulkUpdate: jobModel.get("bulkUpdate"),
                                    bulkAction: jobModel.get("bulkAction")
                                },
                                success: function (model, response) {

                                    handleSuccess(model, response);

                                },
                                error: handleError
                            });
                        }
                    }
                });
                view.render();
            } else {

                if (confirm("Are you sure you want to delete the job?\n\nThis action is not reversible.")) {
                    this.model.destroy({
                        success: function (model, response) {

                            handleSuccess(model, response);

                        },
                        error: handleError
                    });
                }

            }

            return true;
        },

        unlockAction: function (evt) {
            var jobId = this.model.get("jobContextId");
            var visitId = this.model.get("id");

            if (jobId !== null && jobId !== undefined) {
                $.ajax({
                    url: App.config.context + '/api/visit/' + visitId + '/clearLock?forceUnlock=true',
                    type: 'PUT',
                    dataType: 'json',
                    async: false,
                    success: function () {
                        window.location.href = App.config.context + "/job/edit/" + jobId;
                    },
                    error: function () {}
                });
            }
        },

        visitQuotationAction: function (e) {
            var that = this;
            var customerId = this.model.get("billingCustomer").id;
            var visitId = this.model.get("id");

            var view = new $.common.PriceQuoteView({
                model: that.model
            });

            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });

            modal.open();

            modal.listenTo(view, 'save', function () {
                modal.close();

                $.ajax({
                    url: App.config.context + '/booking/manager/customer/' + customerId + '/quote/' + visitId,
                    dataType: 'json',
                    data: {
                        quotationLevel: 'visit'
                    },
                    beforeSend: function () {

                    },
                    complete: function () {

                    },
                    success: function (doc) {

                        popupHandleSuccess(doc, doc);
                    },
                    error: function (xhr, status, error) {

                        var msg = 'An error has occurred sending the customer quotation.';

                        var response = {
                            status: "ERROR",
                            code: 400,
                            message: msg,
                            actual: error,
                            errors: []
                        };

                        popupHandleError({}, xhr);

                    }
                });
            });
        },

        superbookingQuotationAction: function (e) {
            var that = this;
            var customerId = this.model.get("billingCustomer").id;
            var superbookingId = this.model.get("superBooking").id;

            var view = new $.common.PriceQuoteView({
                model: that.model
            });

            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });

            modal.open();

            modal.listenTo(view, 'save', function () {
                modal.close();

                $.ajax({
                    url: App.config.context + '/booking/manager/customer/' + customerId + '/quote/' + superbookingId,
                    dataType: 'json',
                    data: {
                        quotationLevel: 'superbooking'
                    },
                    beforeSend: function () {

                    },
                    complete: function () {

                    },
                    success: function (doc) {

                        popupHandleSuccess(doc, doc);
                    },
                    error: function (xhr, status, error) {

                        var msg = 'An error has occurred sending the customer quotation.';

                        var response = {
                            status: "ERROR",
                            code: 400,
                            message: msg,
                            actual: error,
                            errors: []
                        };

                        popupHandleError({}, xhr);

                    }
                });
            });
        }
    };

    var interpreterVisitActionsMixin = $.app.mixins.interpreterVisitActionsMixin = {
        saveAction: function (evt) {
            console.log("terpVisitAction.save");
            var existingRequirements = this.model.get("existingRequirements");

            if (existingRequirements instanceof Backbone.Collection) {
                this.model.set("bookingRequirements", existingRequirements.toJSON());
            } else if (_.isArray(existingRequirements)) {
                this.model.set("bookingRequirements", existingRequirements);
            }

            this.model.save({}, popupFetchOptions);

            evt.preventDefault();
            evt.stopPropagation();

        },

        startVideo: function (evt) {
            var model = this.model;

            var that = this;

            // create new session
            var sessionModel = new $.core.VideoSessionModel({
                company: this.model.get("company").uuid,
                customer: this.model.get("customer") ? this.model.get("customer").uuid : null,
                jobUuid: this.model.get("uuid")
            }, {
                companyUuid: this.model.get("company").uuid
            });

            //         ession: "6ebd18a2-20e5-4101-b7c2-a07facfb177e", teamSession: "91a24c9d-d743-471b-94d9-e1ec5cc6846f",…}
            //     session: "6ebd18a2-20e5-4101-b7c2-a07facfb177e"
            //     teamSession: "91a24c9d-d743-471b-94d9-e1ec5cc6846f"
            //     company: "d724859a-ac78-400b-867f-17d9feca6461"
            //     customer: "932489f9-5b1f-44cb-98f7-bb4636d1ed17"
            //     language: "spa"
            //     job: {id: 2598568, uri: "http://localhost:8080/interpreter-direct/api/booking/2598568", versionValue: 5,…}
            // config: {,…}
            // providerSessionIdentifier: null
            // taskSid: "WT71d71e578c2e4df13ed2ba040c6bc5e7"
            // overflowPartners: "392aab5b-86ce-4a2f-84c3-2fe7d3a9c53c"

            // sessionModel.fetch({
            //     success: function (model) {
            //
            //         var config = model.get("config");
            //
            //         // join existing conference, no routing
            //         var conferenceView = new $.vri.ConferenceView({
            //             model: model,
            //             identity: config.identity,
            //             token: config.vriToken,
            //             wsToken: config.wsToken,
            //             company: that.company,
            //             companyConfig: that.options.companyConfig,
            //             envContext: App.config.envContext
            //         });
            //         conferenceView.render();
            //
            //     },
            //     error: function (model, xhr, options) {
            //         popupHandleActionError(JSON.parse(xhr.responseText));
            //     }
            // });

            // create conference
            var conferenceView = new $.vri.ConferenceView({
                model: sessionModel,
                identity: "lookinginthewrongplace",
                token: "lookinginthewrongplace",
                wsToken: "lookinginthewrongplace",
                company: this.model.get("company"),
                companyConfig: this.options.companyConfig,
                envContext: App.config.envContext
            });
            conferenceView.render();

            evt.preventDefault();

            // // see if session passed in and start immediately
            // sessionModel = new $.core.VideoSessionModel({
            //     session: this.sessionUuid,
            //     starLeafEnabled: getParameterByName("starLeafEnabled")
            // }, {
            //     companyUuid: this.company.uuid,
            //     createRoom: true // force create room to trigger audit history
            // });
            // sessionModel.fetch({
            //     success: function (model) {
            //
            //         // join existing conference, no routing
            //         var conferenceView = new $.vri.ConferenceView({
            //             model: sessionModel,
            //             identity: that.identity,
            //             token: that.token,
            //             wsToken: that.wsToken,
            //             company: that.company,
            //             companyConfig: that.companyConfig,
            //             envContext: that.envContext
            //         });
            //         conferenceView.render();
            //     },
            //     error: function (model, xhr, options) {
            //         popupHandleActionError(JSON.parse(xhr.responseText));
            //     }
            // });
        },

        startVoice: function (evt) {

            var that = this;

            // initialize voice services
            $.voice.frame.bootstrap({
                envContext: App.config.envContext
            });
            $.voice.frame.init({
                callback: function () {

                    // // create new session
                    // var sessionModel = new $.core.IvrCallSessionModel({
                    //     company: that.model.get("company").uuid,
                    //     customer: that.model.get("customer") ? that.model.get("customer").uuid : null,
                    //     jobUuid: that.model.get("uuid")
                    // }, {
                    //     companyUuid: that.model.get("company").uuid
                    // });

                    // create conference
                    // var callView = new $.voice.views.CallView({
                    //     model: sessionModel,
                    //     identity: "lookinginthewrongplace",
                    //     token: "lookinginthewrongplace",
                    //     wsToken: "lookinginthewrongplace",
                    //     company: that.model.get("company"),
                    //     companyConfig: that.options.companyConfig,
                    //     envContext: App.config.envContext,
                    //     connection: Twilio.Device.connect({
                    //         Attributes: JSON.stringify({
                    //             session: sessionModel.get("jobUuid")
                    //         })
                    //     })
                    // });
                    // callView.render();


                    // create new session
                    var sessionModel = new $.core.IvrCallSessionModel({
                        company: this.model.get("company").uuid,
                        customer: this.model.get("customer") ? this.model.get("customer").uuid : null,
                        jobUuid: this.model.get("uuid"),
                        jobId: this.model.get("id")
                    }, {
                        companyUuid: this.model.get("company").uuid
                    });

                    var that = this;
                    sessionModel.save({}, {
                        success: function (model) {
                            // create conference
                            var callView = new $.voice.views.MainView({
                                model: model,
                                identity: "lookinginthewrongplace",
                                token: "lookinginthewrongplace",
                                wsToken: "lookinginthewrongplace",
                                company: model.get("company"),
                                companyConfig: that.options.companyConfig,
                                envContext: App.config.envContext,
                                connection: Twilio.Device.connect({
                                    Attributes: JSON.stringify({
                                        session: model.get("jobUuid")
                                    })
                                })
                            });
                            callView.render();
                        }
                    });

                    // evt.preventDefault();

                },
                context: that
            });

            if (evt) {
                evt.preventDefault();
            }
        },

        uploadDocument: function (evt) {
            var id = this.model.id;
            var view = new $.common.AddFileView({
                model: new $.core.Document(),
                options: {
                    parentEntityId: id,
                    parentEntityClass: 'com.ngs.id.model.Booking',
                    parentEntityType: 'booking',
                    documentType: App.dict.documentType.vossigned.id
                }
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });
            modal.open();
            modal.listenTo(view, 'upload:complete', function (document) {
                modal.close();
                Backbone.trigger("refreshMissingDocument");
            });
        },

        viewMoreAction: function () {

            this.model.fetch({
                success: function (model, response) {

                    var viewMore = new $.common.JobModalView({
                        model: model
                    });
                    viewMore.render();


                }
            });

        },

        editFull: function (t) {
            var id = this.model.id;
            //window.parent.location.href = App.config.context + '/visit/edit/' + id;
            window.parent.location.href = App.config.context + '/job/edit/' + id;
            //$(event.target).parent("tr").attr("id")
            return false;
        },

        viewFull: function (t) {
            //var id = t.id.substr(t.id.lastIndexOf("-") + 1);
            var id = this.model.id; //$(t).data('booking-id');
            //window.parent.location.href = App.config.context + '/booking/show/' + id;
            window.parent.location.href = App.config.context + '/job/show/' + id;
            return false;
        },

        sendAdHocSMSAction: function (evt) {
            var model = this.model;
            var that = this;

            var sms = new $.core.SmsModel({
                jobId: model.id
            });
            var adHocSms = new $.common.AdHocSmsView({
                model: sms,
                interpreterJob: model
            });
            adHocSms.render();
            adHocSms.on("send", function () {

                sms.save({}, {
                    success: function () {
                        // TODO: this should be scoped to this.$el but not working for calendar view
                        //that.$el.modal('hide');
                        $("#modalContainer").modal('hide');
                        popupFetchOptions.success(arguments);
                    },
                    error: popupFetchOptions.error
                });
            });

            evt.preventDefault();
        },

        resendConfirmationSMSAction: function (evt) {
            var model = this.model;

            $.ajax({
                type: "POST",
                url: App.config.context + "/api/company/" + App.config.company.id + "/booking/sendConfirmation/sms/" + model.id,
                data: {
                    "interpreter.id": model.get("interpreter").id
                }
            }).done(function () {
                popupHandleSuccess(model);
            }).fail(function () {
                handleActionError({
                    message: "Can't resend confirmation SMS."
                });
            });

            evt.preventDefault();
        },

        resendReminderSMSAction: function (evt) {
            var model = this.model;

            $.ajax({
                type: "POST",
                url: App.config.context + "/api/company/" + App.config.company.id + "/booking/sendConfirmation/sms/" + model.id,
                data: {
                    "interpreter.id": this.model.get("interpreter").id
                }
            }).done(function () {
                popupHandleSuccess(model);
            }).fail(function () {
                handleActionError({
                    message: "Can't resend reminder SMS."
                });
            });

            evt.preventDefault();
        },

        incidentalsAction: function (evt) {
            var incidentals = new $.core.IncidentalCollection();
            incidentals['booking.id'] = this.model.id;
            var incidentalsView = new $.common.IncidentalsView({
                collection: incidentals,
                booking: this.model
            });
            var modal = new Backbone.BootstrapModal({
                content: incidentalsView
            });

            // open as wide modal
            modal.$el.addClass("modal-wide");
            modal.open();

            incidentalsView.$el.click();

            return false;
        },

        confirmInterpreterAction: function (evt) {
            this.model.confirmInterpreter();
            evt.preventDefault();
        },

        priceQuoteAction: function (e) {
            var bookingModel = this.model;
            var id = bookingModel.get("id");

            if (id) {
                var errs = bookingModel.validate(bookingModel.attributes);
                if (errs) {
                    bookingModel.trigger("invalid", bookingModel, errs);
                } else {
                    var href = App.config.context + '/booking/quote/' + id;
                    var customer = bookingModel.get("customer.id");
                    var language = bookingModel.get("language.id");

                    $.colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.legacy.width,
                        innerHeight: App.config.popups.portrait.height,
                        open: true,
                        href: href,
                        returnFocus: false,
                        title: 'Job Price Quote'
                    });
                }
            } else {
                handleActionError({
                    message: "Please save the booking first."
                });
            }
            e.preventDefault();
        },

        confirmCustomerAction: function (evt) {

            var model = this.model;
            model.confirmCustomer();

            evt.preventDefault();
        },

        confirmRequestorAction: function (evt) {
            var model = this.model;
            model.confirmRequestor();
            evt.preventDefault();
        },

        assignInterpreterAction: function (evt) {
            //var context = encodeURIComponent(window.location.href);
            if (this.model.id) {
                var context = window.location.href;
                if (context.indexOf("/create") !== -1) {
                    var urlPrefix = "/edit/" + this.model.get("superBooking").id;
                    context = context.replace("/create", urlPrefix);
                }
                var contextURL = encodeURIComponent(context);
                window.location.href = App.config.context + "/booking/select/" + this.model.id + "?context=" + contextURL;
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            evt.preventDefault();
        },

        editJobAction: function (evt) {
            //var context = encodeURIComponent(window.location.href);
            if (this.model.id) {
                window.location.href = App.config.context + "/job/edit/" + this.model.id;
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            evt.preventDefault();
        },

        emailCustomerConfirmationAction: function (evt) {
            var model = this.model;
            $.ajax({
                type: "GET",
                url: App.config.context + "/booking/manager/customerconfirmation/" + model.id
            }).done(function () {
                popupHandleSuccess(model);
            }).fail(function () {
                handleActionError({
                    message: "An error occurred while trying to send confirmation the customer. Please try again. If the error persists, contact the agency administrator"
                });
            });

            evt.preventDefault();
        },

        emailInterpreterConfirmationAction: function (evt) {
            var model = this.model;

            if (this.model.id && this.model.get("interpreter")) {
                $.ajax({
                    type: "GET",
                    url: App.config.context + "/booking/manager/interpreterconfirmation/" + model.id
                }).done(function () {
                    popupHandleSuccess(model);
                }).fail(function () {
                    handleActionError({
                        message: "An error occurred while trying to send confirmation the interpreter. Please try again. If the error persists, contact the agency administrator"
                    });
                });
            } else {
                handleActionError({
                    message: "An interpreter has not yet been assigned."
                });
            }

            evt.preventDefault();
        },

        emailNewJobAction: function (evt) {
            var model = this.model;
            $.ajax({
                type: "GET",
                url: App.config.context + "/booking/manager/newjob/" + model.id
            }).done(function () {
                popupHandleSuccess(model);
            }).fail(function () {
                handleActionError({
                    message: "An error occurred while trying to send the new job email. Please try again. If the error persists, contact the agency administrator"
                });
            });

            evt.preventDefault();
        },

        sendAdHocEmailAction: function (evt) {
            var model = this.model;
            var that = this;

            var email = new $.core.EmailModel({
                jobId: model.id,
                subject: "Job #" + model.id
            });
            var adHocEmail = new $.common.AdHocEmailView({
                model: email,
                interpreterJob: model
            });
            adHocEmail.render();
            adHocEmail.on("send", function () {
                email.save({}, {
                    success: function () {
                        // TODO: this should be scoped to this.$el but not working for calendar view
                        //that.$el.modal('hide');
                        $("#modalContainer").modal('hide');
                        popupFetchOptions.success(arguments);
                    },
                    error: popupFetchOptions.error
                });
            });

            evt.preventDefault();
        },

        sendJobStatusUpdateAction: function (evt) {
            var model = this.model;
            var email = new $.core.EmailModel({
                jobId: model.id,
                subject: ": Job #" + model.id + " Status Update"
            });
            var jobStatusUpdateView = new $.common.JobStatusUpdateEmailView({
                model: email,
                jobModel: model,
                type: "job"
            });
        },

        unassignInterpreterAction: function (evt) {
            var visit = this.model;
            var that = this;

            /*$.ajax({
                type: "GET",
                url: App.config.context + "/booking/manager/unassign/" + model.id
            }).done(function () {
                popupHandleSuccess(model);
                App.marionette.vent.trigger("interpreterVisits:change", model);
            });*/


            //interpreterJob.unassign();

            var view = new $.booking.v2.UnassignView({
                model: visit
            });

            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });

            modal.open();

            modal.listenTo(view, 'unassigned', function () {
                modal.close();
            });


            evt.preventDefault();
        },

        viewInterpreterOffersAction: function (evt) {
            var jobOffers = new $.core.JobOfferCollection();
            var filters = {
                "rules": [{
                    "field": "job.id",
                    "op": "eq",
                    "data": this.model.id
                }]
            };
            jobOffers.queryParams.filters = JSON.stringify(filters);
            jobOffers.queryParams.rows = -1;
            $("#modalContainer").modal("show");
            // flag the view will be a Modal
            var jobOffersView = new $.common.JobOffersForJobModalView({
                el: $("#modalContainer"),
                collection: jobOffers,
                model: this.model
            });
            jobOffersView.render();
        },

        closeAction: function (evt) {

            var close = new $.closing.init({
                job: this.model,
                companyConfig: App.config.company.config, // where to get company config from
                debug: false
            });
            close.render();

            // var booking = this.model;
            //
            // if (this.model.get("status").id === App.dict.bookingStatus.closed.id) {
            //     if (!_.contains(App.config.userData.roles, "comp")) {
            //         popupHandleCustomerError("The booking has previously been closed. If you would like to update the booking details please contact the administrator.");
            //         return null;
            //     }
            // }
            //
            // if (booking.id) {
            //     $.colorbox({
            //         iframe: true,
            //         innerWidth: App.config.popups.landscape.width,
            //         innerHeight: App.config.popups.landscape.height,
            //         open: true,
            //         href: App.config.context + '/booking/review/' + booking.id,
            //         returnFocus: false,
            //         title: 'Close Booking',
            //         onCleanup: function () {
            //             Backbone.trigger("bookingUpdate", booking);
            //         }
            //     });
            // } else {
            //     handleActionError({
            //         message: "Please save the job first."
            //     });
            // }
            evt.preventDefault();
        },

        uploadAction: function (evt) {
            var id = this.model.id;
            var view = new $.common.AddFileView({
                model: new $.core.Document(),
                options: {
                    parentEntityId: id,
                    parentEntityClass: 'com.ngs.id.model.Booking',
                    parentEntityType: 'booking',
                    documentType: App.dict.documentType.vossigned.id
                }
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });
            modal.open();
            modal.listenTo(view, 'upload:complete', function (document) {
                modal.close();
                Backbone.trigger("refreshMissingDocument");
            });
        },

        editAction: function (evt) {
            if (this.model.id) {
                this.options.frameConfig.attributes.jobContextId = this.model.id;
                window.location.href = App.config.context + "/job/edit/" + this.options.frameConfig.get("jobContextId");
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            return false;
        },

        viewFullAction: function (evt) {
            var id = this.model.id;
            window.location.href = App.config.context + '/job/show/' + id;
        },
        cloneAction: function (evt) {
            //TODO: ajax call to manager
            if (this.model.get("visit").id) {
                window.location.href = App.config.context + '/visit/manager/clone/' + this.model.get("visit").id;
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            return false;

            //            var visitModel = $.core.JobModel.findOrCreate({
            //                id: this.model.get("visit").id
            //            });
            //            visitModel.createFollowUp();
        },

        duplicateAction: function (evt) {
            // TODO: ajax call to manager
            if (this.model.get("visit").id) {
                window.location.href = App.config.context + '/visit/manager/duplicate/' + this.model.get("visit").id;
            } else {
                handleActionError({
                    message: "Please save the job first."
                });
            }
            return false;

            //            var visitModel = $.core.JobModel.findOrCreate({
            //                id: this.model.get("visit").id
            //            });
            //            visitModel.duplicate();
        },

        repeatAction: function (evt) {
            var visitModel = $.core.JobModel.findOrCreate({
                id: this.model.get("visit").id
            }).fetch({
                success: function (model) {
                    var view = new $.common.VisitRepeatView({
                        disableVos: true,
                        model: model
                    });
                    view.render();
                }
            });
        },

        cancelAction: function (evt) {
            var view = new $.common.BookingCancelView({
                model: this.model
            });
            view.render();
        },

        declineAction: function (evt) {
            var view = new $.common.BookingDeclineView({
                model: this.model
            });
            view.render();
            view.$el.click();
        },

        eSigAction: function (evt) {
            var verification = $.core.BookingClose.findOrCreate({
                id: this.model.id
            });

            verification.fetch().done(function () {
                var verificationView = new $.common.VerificationView({
                    disableVos: true,
                    model: verification
                });
                new Backbone.BootstrapModal({
                    content: verificationView,
                    cancelText: ""
                }).open();

                // Hack to make sure any context menus close
                verificationView.$el.click();
            });

            evt.preventDefault();
        },

        vosAction: function (evt) {
            var visit = this.model;
            if (this.model.id) {
                $.colorbox({
                    iframe: true,
                    height: "700px",
                    width: "850px",
                    open: true,
                    href: App.config.context + '/booking/vos/' + this.model.id,
                    returnFocus: false,
                    title: 'Verification of Service',
                    onCleanup: function () {
                        App.marionette.vent.trigger("interpreterVisits:change", visit);
                    }
                });
            } else {
                handleActionError({
                    message: "Please save the booking first."
                });
            }
            evt.preventDefault();
        },


        deleteAction: function (evt) {
            if (confirm("Are you sure you want to delete the booking?\n\nThis action is not reversible.")) {
                this.model.destroy({
                    success: function (model, response) {

                        handleSuccess(model, response);

                        //this.remove();

                        //window.location.href = App.config.context + "/booking/list";
                    },
                    error: handleError
                });
            }
            return false;
        },

        createInteractionAction: function (evt) {

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.message.width,
                innerHeight: App.config.popups.message.height,
                open: false,
                returnFocus: false,
                title: 'New Interaction',
                href: App.config.context + '/interaction/quickadd/?job.id=' + this.model.id
            });
            return false;
        }
    };

    var schedulerInterpreterActionsMixin = $.app.mixins.schedulerInterpreterActionsMixin = {
        assignInterpreterAction: function (evt, params) {
            var assignView;
            var modal;
            var bookingId;
            var bookingNumJobs;
            var resource = params.resource;
            var interpreterId = params.resource.id;
            var booking = params.bookingModel;

            if (booking) {
                bookingId = booking.get("id");
                bookingNumJobs = booking.get("numJobs");
            }

            if (bookingId) {
                if (bookingNumJobs > 1) {
                    assignView = new $.common.RecurringBookingGroupAssignView({
                        model: booking,
                        // options for assign
                        "interpreter.id": interpreterId,
                        "ignoreAssignment": true
                    });

                    modal = new Backbone.BootstrapModal({
                        title: "Recurring Job Assignment",
                        content: assignView,
                        okText: "Assign",
                        cancelText: "Cancel"
                    });

                    modal.on('ok', function () {
                        Backbone.trigger("saveBooking", bookingId, resource.id);
                    });
                    modal.open();
                } else {
                    modal = new Backbone.BootstrapModal({
                        content: "You are about to assign job #" + bookingId + " to the interpreter " + resource.title + ".",
                        okText: "Save",
                        cancelText: "Cancel",
                        title: "Assign Interpreter"
                    });

                    modal.on('ok', function () {
                        booking.assignWithCheck({
                            "interpreter.id": interpreterId,
                            "ignoreAssignment": true
                        });
                        Backbone.trigger("saveBooking", bookingId, resource.id);
                    });
                    modal.open();
                }
            } else {
                modal = new Backbone.BootstrapModal({
                    content: "Please select a booking to assign an interpreter to.",
                    okText: "Close",
                    cancelText: "",
                    title: "Select a Booking"
                });
                modal.open();
            }

        },

        viewOffersAction: function (evt) {
            var id = this.model.id;
            var fullContact = $.core.Contact.findOrCreate({
                id: id
            });

            fullContact.fetch({
                success: function (model, response) {
                    $("#modalContainer").modal("show");
                    var jobOffersCollection = new $.core.JobOfferCollection();
                    var jobOffersView = new $.common.JobOffersForContactView({
                        el: $("#modalContainer"),
                        contactId: id,
                        contactName: model.get("displayName"),
                        collection: jobOffersCollection
                    });
                    jobOffersView.render();
                },
                error: function (model, response) {
                    handleActionError({
                        message: "An error was encountered retrieving the contact. Please contact the administrator if the problem persists."
                    });
                }
            });
        }
    };

    /**
     * mixin actions for bulk commands on jobs
     *
     * @type {{sendOffers: $.app.mixins.interpreterJobBulkActionsMixin.sendOffers, validateSelection: $.app.mixins.interpreterJobBulkActionsMixin.validateSelection}}
     */
    var interpreterJobBulkActionsMixin = $.app.mixins.interpreterJobBulkActionsMixin = {

        sendOffers: function (evt) {
            evt.preventDefault();
            // Return if validation fails
            if (!this.validateSelection()) {
                return true;
            }

            var view = new $.common.BulkSendOfferConfirmActionView({
                grid: this.parentView.grid,
                querySelect: this.parentView.$el.find(".selectAll").is(":checked"),
                isCheckedAll: this.parentView.$el.find(".selectAll").is(":checked"),
                selectedModels: this.parentView.grid.getSelectedModels(),
                totalRecords: this.parentView.grid.collection.state.totalRecords,
                type: "job"
            });
            view.render();
        },

        sendCustomerNewJobEmail: function (evt) {
            evt.preventDefault();
            // Return if validation fails
            if (!this.validateSelection()) {
                return true;
            }

            var view = new $.common.BulkSendEmailDigestView({
                grid: this.parentView.grid,
                querySelect: this.parentView.$el.find(".selectAll").is(":checked"),
                isCheckedAll: this.parentView.$el.find(".selectAll").is(":checked"),
                selectedModels: this.parentView.grid.getSelectedModels(),
                totalRecords: this.parentView.grid.collection.state.totalRecords,
                eventType: 'BULK_SEND_EMAIL_DIGEST',
                emailType: 'bookingNew',
                title: 'Customer New Job',
                type: "job"
            });
            view.render();
        },

        sendJobStatusUpdateEmails: function (evt) {
            evt.preventDefault();
            // Return if validation fails
            if (!this.validateSelection()) {
                return true;
            }

            var view = new $.common.JobStatusUpdateEmailView({
                grid: this.parentView.grid,
                querySelect: this.parentView.$el.find(".selectAll").is(":checked"),
                isCheckedAll: this.parentView.$el.find(".selectAll").is(":checked"),
                selectedModels: this.parentView.grid.getSelectedModels(),
                totalRecords: this.parentView.grid.collection.state.totalRecords,
                type: "job"
            });
        },

        sendConfirmationEmails: function (evt) {
            evt.preventDefault();
            // Return if validation fails
            if (!this.validateSelection()) {
                return true;
            }

            var that = this;

            var view = new $.common.BulkConfirmationOptionsNoDateFiltersView({
                querySelect: this.parentView.$el.find(".selectAll").is(":checked"),
                isCheckedAll: this.parentView.$el.find(".selectAll").is(":checked"),
                selectedModels: this.parentView.grid.getSelectedModels(),
                totalRecords: this.parentView.grid.collection.state.totalRecords
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });

            modal.open();

            var isCheckedAll = this.parentView.$el.find(".selectAll").is(":checked");
            var selectedModels = this.parentView.grid.getSelectedModels();

            modal.listenTo(view, 'bulkConfirm', function (options) {

                var dummyCollection;

                var bulkProps = {
                    eventType: "BULK_CONFIRM_EMAIL",
                    notifyCustomers: options.notifyCustomers,
                    notifyInterpreters: options.notifyInterpreters,
                    update: "dummy"
                };

                if (isCheckedAll) {
                    dummyCollection = new $.visit.v2.InterpreterVisitCollection(that.parentView.grid.collection);
                    bulkProps.filters = that.parentView.grid.collection.queryParams.filters;
                } else {
                    dummyCollection = new $.visit.v2.InterpreterVisitCollection(selectedModels);
                }
                dummyCollection.save(bulkProps).done(function (response) {
                    popupHandleSuccess({}, response);
                }).fail(function (response) {
                    popupHandleError({}, response);
                });
                modal.close();
            });
        },

        confirmJobs: function (evt) {
            evt.preventDefault();
            // Return if validation fails
            if (!this.validateSelection()) {
                return true;
            }

            var view = new $.common.BulkConfirmJobsActionView({
                grid: this.parentView.grid,
                querySelect: this.parentView.$el.find(".selectAll").is(":checked"),
                isCheckedAll: this.parentView.$el.find(".selectAll").is(":checked"),
                selectedModels: this.parentView.grid.getSelectedModels(),
                totalRecords: this.parentView.grid.collection.state.totalRecords,
                type: "job"
            });
            view.render();
        },

        validateSelection: function () {
            var isCheckedAll = this.parentView.$el.find(".selectAll").is(":checked");
            var selectedModels = this.parentView.grid.getSelectedModels();

            // Check for at least one selection only if all is not selected
            if (!isCheckedAll) {
                if (!selectedModels || selectedModels.length === 0) {
                    popupHandleActionError({
                        message: "Please select at least one job or the \"All jobs (with current filters applied)\" checkbox."
                    });
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
    };

    var ivrCallActionsMixin = $.app.mixins.ivrCallActionsMixin = {

        viewDetails: function (evt) {
            evt.preventDefault();

            var view = new $.common.IvrCallDetailsView({
                model: this.model
            });
            view.render();
        }
    };

    var contactWorkerActionsMixin = $.app.mixins.contactWorkerActionsMixin = {

        viewDetails: function (evt) {
            evt.preventDefault();

            var view = new $.common.ContactWorkerView({
                model: this.model
            });
            view.render();
        },

        makeAvailable: function (evt) {
            evt.preventDefault();

            this.model.makeAvailable({
                successHandler: handleSuccess,
                errorHandler: handleError
            });
        },

        makeUnavailable: function (evt) {
            evt.preventDefault();

            this.model.makeUnavailable({
                successHandler: handleSuccess,
                errorHandler: handleError
            });
        },

        editAttributes: function (evt) {
            evt.preventDefault();

            var view = new $.common.ContactWorkerEditView({
                model: this.model
            });
            view.render();
        }
    };

    var vriSessionActionsMixin = $.app.mixins.vriSessionActionsMixin = {

        viewHistory: function (evt) {
            evt.preventDefault();

            var view = new $.workers.vrisessions.VriSessionHistoryView({
                model: this.model
            });
            view.render();
        }
    };


    $.app.mixins.subviewContainerMixin = {
        views: {},

        renderSubviews: function () {
            var that = this;
            _.each(this.views, function (subview) {
                if (!subview.hidden) {
                    that.renderSubview(subview);
                }
            });
        },

        renderSubview: function (subview) {
            this.$el.find(subview.selector).html(subview.view.render().el);
            if (_.isFunction(subview.view.delegateCustomEvents)) {
                subview.view.delegateCustomEvents();
            }
            subview.view.delegateEvents();
        }
    };

})(jQuery);
