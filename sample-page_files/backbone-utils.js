/*
 @ sourceURL=app/backbone-utils.js
 */

/* enable strict mode */
"use strict"; //# sourceURL=app/backbone-utils.js

var submitActions = submitActions || {};

submitActions.disableLinks = function () {
    $('a').css('pointer-events', 'none');
};

submitActions.enableLinks = function () {
    $('a').css('pointer-events', '');
};

submitActions.disableButtons = function () {
    $('button').attr('disabled', true);
    $('.btn').attr('disabled', true);
};

submitActions.enableButtons = function () {
    $('button').removeAttr('disabled');
    $('.btn').removeAttr('disabled');
};

submitActions.disableAll = function () {
    submitActions.disableLinks();
    submitActions.disableButtons();
};

submitActions.enableAll = function () {
    submitActions.enableLinks();
    submitActions.enableButtons();
};

var _handlers = _handlers || {};
_handlers._tplContainer = _handlers._tplContainer || {};

_handlers.stopProcessing = function () {
    var $processing = $('.processing');
    $processing.button('reset');
    $processing.removeClass('processing');
};

_handlers.hideContainers = function () {
    _handlers.stopProcessing();
    _.forEach(arguments, function (container) {
        container.hide();
    });
};

_handlers.showSuccessContainer = function (container, template, model, response, options, isView) {

    if (model.toJSON) {
        // conor 01/16 hack to flag that template is a Backbone.View rather than an actual templat
        // want to migrate all templates to use view
        if (isView) {
            (new template({el: container, model: model, options: options})).render();
        } else {
            container.html(template({obj: model.toJSON(), options: options}));
        }
    } else if (response) {
        container.html(template({obj: response, options: options}));
    } else {
        container.html(template({obj: {}, options: options}));
    }

    // callbacks for formatting / security on container
    $.app.mixins.commonAppMixin.callbacks(container, model);

    return container;
};

_handlers._templates = function() {
    if (_.keys(_handlers._tplContainer).length === 0) {
        _handlers._tplContainer.error = _handlers._tplContainer.error || JST['common/error/container/show'];
        _handlers._tplContainer.errorAction = _handlers._tplContainer.errorAction || JST['common/error/action/show'];
        _handlers._tplContainer.errorPopup = _handlers._tplContainer.errorPopup || JST['common/error/popup/show'];
        _handlers._tplContainer.errorCustomPopup = _handlers._tplContainer.errorPopup || JST['common/error/popup/custom'];
        _handlers._tplContainer.retryPopup = _handlers._tplContainer.retryPopup || JST['common/error/popup/retry/show'];
        _handlers._tplContainer.success = _handlers._tplContainer.success || JST['common/success/container/show'];
        _handlers._tplContainer.successPopup = _handlers._tplContainer.successPopup || JST['common/success/popup/show'];
        _handlers._tplContainer.jobSuccessPopup = _handlers._tplContainer.jobSuccessPopup || $.common.JobSuccessView;
    }
    return _handlers._tplContainer;
};

var handleError = function (model, response, options) {

    /* format of error object */
    /*[
     status: Constants.RESPONSE_ERROR,
     code: HttpServletResponse.SC_BAD_REQUEST,
     message: userMsg,
     actual: errorMsg,
     errors: [field: error.field, rejectedValue: error.rejectedValue, message: errMsg]
     ]*/

    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    // status of 200 in error handler indicates abort
    // status of 0 indicated cancelled request or time out.
    // time outs used to be shown as "error: undefined". with
    // this logic we now miss that! what to do?
    if (response.status === 0 || response.status === 200) {
        // assume request aborted, return silently
        return;
    }

    response = response || {responseText: '{message: "Error message not available. Contact your administrator."}'};
    options = _.defaults(options || {}, defaults);

    // ================= bootstrap messages =================
    var $errorContainer = $("#errorContainer");
    var $successContainer = $("#successContainer");
    _handlers.hideContainers($successContainer, $errorContainer);

    var asJson;

    try {
        if (response.responseText) {
            // authentication required response
            if (response.status == 401 && !App.config.isLoggedIn) {
                window.location.href = window.location.href;
            }
            asJson = eval("(" + response.responseText + ")");
        } else {
            //assumes response is already as JSON
            asJson = response;
        }
    } catch(err) {

        //catch non-json 500 errors from server
        asJson = { status: 'ERROR',
            code: '500',
            message: 'An unexpected exception has occurred. Please retry your request. Contact your administrator if the problem persists',
            actual: 'An unexpected exception has occurred. Please retry your request. Contact your administrator if the problem persists',
            errors: []
        }
    }

    //process response and output message
    $errorContainer.html(_handlers._templates().error(_.extend({obj: asJson}, options)));

    //show success
    $errorContainer.show();

    // scroll to error container
    // -60 to account for menu
    //$('html,body').scrollTop($errorContainer.offset().top - 60, $errorContainer.offset().left);

    _handlers.stopProcessing();

    return true;

};

var handleSuccess = function(model, response) {
    console.log(response)

    var $errorContainer = $("#errorContainer");
    var $successContainer = $("#successContainer");
    _handlers.hideContainers($successContainer, $errorContainer);

    _handlers
        .showSuccessContainer($successContainer, _handlers._templates().success, model, response)
        .show();

    // -60 to account for menu
    //$('html,body').scrollTop($successContainer.offset().top - 60, $successContainer.offset().left);

    _handlers.stopProcessing();

};

/**
 * error handler for user interactions in real time
 */
var handleActionError = function(options) {
    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    options = _.defaults(options || {}, defaults);

    var $errorContainer = $("#errorContainer");
    var $successContainer = $("#successContainer");
    _handlers.hideContainers($successContainer, $errorContainer);

    //process response and output message
    $errorContainer.html(_handlers._templates().errorAction(options));

    //show success
    $errorContainer.show();

    _handlers.stopProcessing();

    // -60 to account for menu
    //$('html,body').scrollTop($("#errorContainer").offset().top - 60, $("#errorContainer").offset().left);
    $('html,body').scrollTop(0, 0);

    return true;

};

var showError = function(options,errorContainer,successContainer) {
    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    options = _.defaults(options || {}, defaults);

    $(errorContainer).hide();
    $(successContainer).hide();


    //handler for bootstrap template (TODO: only parse template once)
    var errorTemplate = JST['common/error/action/show'];

    //process response and output message
    $(errorContainer).html(errorTemplate(options));

    //show success
    $(errorContainer).show();

    //change button back to normal
    $('.processing').button('reset');
    $('.processing').removeClass('processing');

    // -60 to account for menu
    //$('html,body').scrollTop($("#errorContainer").offset().top - 60, $("#errorContainer").offset().left);
    $('html,body').scrollTop(0, 0);

    //linger for 1 second
    //setTimeout(function() { $("#errorContainer").fadeOut(500);}, 1000);

    return true;

};

/**
 * error handler for user interactions in real time
 */
var popupHandleActionError = function(err) {

    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    var options = _.defaults(options || {}, defaults);

    var $successContainer = $("#successContainer");
    var $errorContainer = $("#errorContainer");
    _handlers.hideContainers($successContainer, $errorContainer);

    //catch non-json 500 errors from server
    var asJson = { status: 'ERROR',
        code: '400',
        message: err.message,
        actual: err.message,
        errors: []
    };

    //process response and output message
    var $popupErrorContainer = $("#popupErrorContainer");
    $popupErrorContainer.html(_handlers._templates().errorPopup(_.extend({obj: asJson}, options)));
    $popupErrorContainer.modal('show');

    _handlers.stopProcessing();

    //linger for 1 second
    //setTimeout(function() { $("#errorContainer").fadeOut(500);}, 1000);

    return true;

};

//default settings when invoking fetch
var defaultFetchOptions = {
    success: handleSuccess,
    error: handleError
};

var popupHandleError = function(model, response, options) {

    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    options = _.defaults(options || {}, defaults);

    var $successContainer = $("#successContainer");
    var $errorContainer = $("#errorContainer");
    _handlers.hideContainers($successContainer, $errorContainer);

    var asJson;

    try {
        if (response.responseText) {
            // authentication required response
            if (response.status == 401 && !App.config.isLoggedIn) {
                window.location.href = window.location.href;
            }
            asJson = eval("(" + response.responseText + ")");
        } else {
            //assumes response is already as JSON
            asJson = response;
        }
    } catch(err) {

        //catch non-json 500 errors from server
        asJson = { status: 'ERROR',
            code: '500',
            message: 'An unexpected exception has occurred. Please retry your request. Contact your administrator if the problem persists',
            actual: 'An unexpected exception has occurred. Please retry your request. Contact your administrator if the problem persists',
            errors: []
        }
    }

    //handler for bootstrap template (TODO: only parse template once)
    var errorTemplate = _handlers._templates().errorPopup;//

    if(response.status == 409) {
        errorTemplate = _handlers._templates().retryPopup;
        options.header = "Conflict!";
        options.cmdParam = "ignoreConflict";
        options.retryButtonText = "Continue (Ignore Conflict)"
    }
    if(response.status == 412) {
        errorTemplate = _handlers._templates().retryPopup;
        options.header = "Warning!";
        options.cmdParam = "ignoreExpectedStartDatePastDate";
        options.retryButtonText = "Continue";
    }
    if(response.status == 413) {
        errorTemplate = _handlers._templates().retryPopup;
        options.header = "Warning!";
        options.cmdParam = "ignoreSmsBodyLength";
        options.retryButtonText = "Continue";
    }
    if(response.status == 416) {
        errorTemplate = _handlers._templates().retryPopup;
        options.header = "Warning!";
        options.cmdParam = "ignoreNumInterpretersWarning";
        options.retryButtonText = "Continue";
    }

    //process response and output message
    var $popupErrorContainer = $("#popupErrorContainer");
    $popupErrorContainer.html(errorTemplate(_.extend({obj: asJson}, options)));
    $popupErrorContainer.modal('show');

    $( "#retry" ).click(function() {
        $('#popupErrorContainer').modal('hide');
        if (options.cmdParam) {
            switch (options.cmdParam) {
                case 'ignoreConflict':
                    model.set({"ignoreConflict":true}, {silent:true});
                    break;
                case 'ignoreExpectedStartDatePastDate':
                    model.set({"ignoreExpectedStartDatePastDate":true}, {silent:true});
                    break;
                case 'ignoreSmsBodyLength':
                    model.set({"ignoreSmsBodyLength":true}, {silent:true});
                    break;
                case 'ignoreNumInterpretersWarning':
                    model.set({"ignoreNumInterpretersWarning":true}, {silent:true});
                    break;
            }
        }
        model.save({}, {success: function(model, response) {
            if (model.get("jobContextId")) {
                History.pushState(null, "Booking # " + model.get("superBooking").id, App.config.context + "/job/edit/" + model.get("jobContextId"));
            }
            popupFetchOptions.success(model, response, options);

            // clear any conflict warnings for subsequent saves
            model.unset("ignoreConflict", {silent:true});
            model.unset("ignoreExpectedStartDatePastDate", {silent:true});
            model.unset("ignoreSmsBodyLength", {silent:true});
            model.unset("ignoreNumInterpretersWarning", {silent:true});

        }, error: function(model, response) {
                popupFetchOptions.error(model, response, options);
            }
        });
    });

    return true;
};

var popupHandleCustomerError = function(message){

    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    var options = _.defaults(options || {}, defaults);

    var $successContainer = $("#successContainer");
    var $errorContainer = $("#errorContainer");
    _handlers.hideContainers($successContainer, $errorContainer);

    var asJson = {message: message};
    var $popupErrorContainer = $("#popupErrorContainer");
    $popupErrorContainer.html(JST['common/error/popup/custom'](_.extend({obj: asJson}, options)));
    $popupErrorContainer.modal('show');
};

var popupHandleSuccess = function(model, response, options, waitForOk, returnUrl) {

    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    options = _.defaults(options || {}, defaults);

    var $successContainer = $("#successContainer");
    var $errorContainer = $("#errorContainer");
    _handlers.hideContainers($successContainer, $errorContainer);

    var $popupSuccessContainer = $("#popupSuccessContainer");

    var hideSuccessContainer = _.debounce(function () {
        $popupSuccessContainer.modal('hide')
    }, 2000);

    $popupSuccessContainer.on('shown', function () {
        // hide after 2000ms
        if (!options.waitForOk) {
            hideSuccessContainer();
        }
    });

    $popupSuccessContainer.on('hidden', function () {
        if (_.isFunction(options.onHidden)) {
            options.onHidden();
        }
    });

    _handlers
        .showSuccessContainer($popupSuccessContainer, _handlers._templates()[options.template] || _handlers._templates().successPopup, model, response, options, options.template)
        .modal('show');

};

// success and error functions
var popupFetchOptions = {
    success: popupHandleSuccess,
    error: popupHandleError
};


var filterList = function(e) {

    var that = this;
    var filterElement = e.currentTarget;
    //var filter = $(filterElement).val();
    //jquery val causes error with tinyMCE
    var filter = e.currentTarget.value;

    //setup filters
    var filtersJSON = {
        groupOp: "AND",
        rules: []
    };

    filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", "${company.id}");
    //if there's a filter
    if (filter) {
        filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", filter);
    }

    if (filter.length > 2 || filter.length === 0) {

        clearTimeout($.data(filterElement, 'timer'));
        var wait = setTimeout(function() {
            //that.$("li").remove();
            that.$el.find("#customers li").remove();
            that.model.getFirstPage(_.extend(defaultFetchOptions, {data: {filters: JSON.stringify(filtersJSON) }}));
        }, 500);
        $(filterElement).data('timer', wait);
    }
};

var filterListBypass = function(e) {
    var that = this;
    var filterElement = e.currentTarget;
    var filter = $(filterElement).val();

    //setup filters
    var filtersJSON = {
        groupOp: "AND",
        rules: []
    };

    //if there's a filter
    if (filter) {
        filtersJSON = addOrUpdateFilter(filtersJSON, "name", "eq", filter);
    }

    if (filter.length > 2) {

        clearTimeout($.data(filterElement, 'timer'));
        var wait1 = setTimeout(function () {
            that.$("li").remove();
            that.model.fetch({rows: 25, filters: filtersJSON, bypass: true}, defaultFetchOptions);
        }, 500);
        $(filterElement).data('timer', wait1);

    } else if (filter.length === 0) {

        clearTimeout($.data(filterElement, 'timer'));
        var wait2 = setTimeout(function () {
            that.$("li").remove();
            that.model.fetch({rows: 25, filters: filtersJSON, bypass: true}, defaultFetchOptions);
        }, 500);
        $(filterElement).data('timer', wait2);

    }

};

var preFetchInjectFilter = function(options) {

    options = options || {};

    //add required field
    if (!options.filters) {
        options.filters = {
            groupOp: "AND",
            rules: []
        };
    }

    /*if (!options.bypass) {
        addOrUpdateFilter(options.filters, "company.id", "eq", App.config.company.id);
    }*/

    options.data = options.data || {};
    options.data.rows = options.rows;
    options.data.sidx = options.sidx;
    options.data.sord = options.sord;
    options.data.filters = JSON.stringify(options.filters);

    return Backbone.Collection.prototype.fetch.call(this, options);
};

var fetchFilter = function(options) {
    options = options || {};

    return Backbone.Collection.prototype.fetch.call(this, options);
};

// Initializing Marionette Application
// Please do not re-initialize it anywhere else.
App.marionette = App.marionette || (Backbone.Marionette ? new Backbone.Marionette.Application() : null);

var oldBackboneSync = Backbone.sync;

// Override Backbone.Sync
Backbone.sync = function( method, model, options ) {
    if ( method === 'delete' ) {
        if ( options.data ) {
            // properly formats data for back-end to parse
            options.data = JSON.stringify(options.data);
        }
        // transform all delete requests to application/json
        options.contentType = 'application/json';
    }
    return oldBackboneSync.apply(this, [method, model, options]);
};
