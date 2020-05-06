/*
 * Copyright (C) 2013 Interpreter Intelligence, Inc. <support@interpreterintelligence.com>
 *
 * <copyright notice>
 *
 */

(function ($) { //# sourceURL=app/core.js

    /* enable strict mode */
    "use strict";


    // Should this be here? Probably not, since everything else is namespaced with core.
    // But I don't know where else to put it.
    if (!$.app) $.app = {};
    $.app.mixins = $.app.mixins || {};

    // A mixin to deal with the Backbone consequences of having stub objects for 1-1 associations.
    // In particular:
    // 1. If we're assigning a new subobject (e.g. changing the bookingMode from face to face (id:1) to video
    // (id:3) on a booking) we should PUT just the id of the subobject and not the remaining properties.
    // 2. If we're assigning null to a subobject, set an object {id:""} instead of null. (TODO: hmm, this is tricky:
    // need to figure out whether the attribute in question is complex or not)
    $.app.mixins.stubObjectModelMixin = {

        toJSON: function (options) {

            var model = this;

            var attributes;

            if (this instanceof Backbone.RelationalModel) {
                attributes = Backbone.RelationalModel.prototype.toJSON.call(this, options);
            } else {
                attributes = Backbone.Model.prototype.toJSON.call(this, options);
            }

            // replace null stub objects with id: "" so clean binding can take place at the backend
            _.each(attributes, function (value, key) {
                // Entities represent 1-1 associations. They are loaded as subobject stubs
                // in the json api, and in turn in the backbone model
                //console.log(value, key);
                if (model.entities && (_.indexOf(model.entities, key) !== -1)) {
                    // set a stripped down version of this on syncModel
                    //console.log("Set strpped version:", value, key);
                    if (value && value.id) {

                        // TODO: is this really necessary?
                        // TODO: the id will already be set
                        // TODO: removing this to avoid the change event
                        attributes[key] = {
                            id: value.id
                        };
                        if (value.name) {
                            attributes[key].name = value.name;
                        }
                        if (value.displayName) {
                            attributes[key].displayName = value.displayName;
                        }
                        if (value.description) {
                            attributes[key].description = value.description;
                        }
                        if (value.unitDescription) {
                            attributes[key].unitDescription = value.unitDescription;
                        }
                        if (value.displayLabel) {
                            attributes[key].displayLabel = value.displayLabel;
                        }
                        if (value.primaryNumber) {
                            attributes[key].primaryNumberLabel = value.primaryNumber.parsedNumber;
                        }
                        if (value.primaryEmail) {
                            attributes[key].primaryEmailLabel = value.primaryEmail.emailAddress;
                        }
                        if (value.uuid) {
                            attributes[key].uuid = value.uuid;
                        }
                        // only exclude value if undefined. this allows us to pass on null safely to the views
                        if (!_.isUndefined(value.timeZone)) {
                            attributes[key].timeZone = value.timeZone;
                        }

                    } else {
                        attributes[key] = {
                            id: ""
                        };
                    }

                    // strip out conflicting legacy ids and values
                    delete attributes[key + ".id"];
                    delete attributes[key + ".name"];
                    delete attributes[key + ".nameKey"];

                    // for each entity
                } else if (model.associations && (_.indexOf(model.associations, key) !== -1)) {

                    // Associations represent 1 to many associations. They are loaded as string
                    // URLs in the json api, and in turn in the backbone model

                    // For now, skip over these. One idea is to check if this is an array, and
                    // if so POST/PUT these after a successful sync of the main model.

                    //delete attributes[key];
                }
            });

            // console.log(attributes);

            return attributes;
        }
    };

    $.app.mixins.jobStateMixin = {
        cancel: function (attrs, options) {
            var status = new $.core.JobCancelState({}, {
                job: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        createFollowUp: function (attrs, options) {
            var status = new $.core.JobFollowUpState({}, {
                job: this
            });
            return status.save(attrs, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, {
                        waitForOk: true
                    } /* wait for response */ );
                },
                error: popupFetchOptions.error
            });
        },

        duplicate: function (attrs, options) {
            var status = new $.core.JobDuplicateState({}, {
                job: this
            });
            return status.save(attrs, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, {
                        waitForOk: true
                    });
                },
                error: popupFetchOptions.error
            });
        },
        repeat: function (attrs, options) {
            var status = new $.core.JobRepeatState({}, {
                job: this
            });
            var that = this;
            return status.save(attrs, options);
        }
    };

    $.app.mixins.interpreterVisitStateMixin = {

        verify: function (attrs, options) {

            // new status
            var status = new $.core.BookingVerifiedState({}, {
                booking: this
            });

            return status.save(attrs, options || defaultFetchOptions);
        },

        createFollowUp: function (attrs, options) {
            var status = new $.core.JobFollowUpState({}, {
                job: this
            });
            return status.save(attrs, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, {
                        waitForOk: true
                    } /* wait for response */ );
                },
                error: popupFetchOptions.error
            });
        },

        cancel: function (attrs, options) {
            var status = new $.core.BookingCancelState({}, {
                booking: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        close: function (attrs, options) {
            var status = new $.core.BookingCloseState({}, _.extend({
                booking: this
            }, options));
            var that = this;
            return status.save(attrs, options);
        },

        decline: function (attrs, options) {
            var status = new $.core.BookingDeclineState({}, {
                booking: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        unverify: function () {

            // little bit of a bogus status
            var status = new $.core.BookingUnverifiedState({}, {
                booking: this
            });

            return status.save(null, defaultFetchOptions);
        },

        saveState: function (props) {
            // little bit of a bogus status
            var status = new $.core.BookingAssignState(props || {}, {
                booking: this
            });

            return status.save(null, {
                success: function (model, response) {
                    $("#mileage").val('');
                    Backbone.trigger("savedBookingState");
                    popupFetchOptions.success(model, response, true /* wait for response */ );
                },
                error: popupFetchOptions.error
            });
        },

        assign: function (props) {
            var interpreterId = props["interpreter.id"];
            var mileageFieldValue = $("#mileage").val();
            var mileage = $.isNumeric(mileageFieldValue) ? mileageFieldValue : "";
            var jobIdValue = $("#id").val();

            if ($.isNumeric(jobIdValue)) {
                props["job.id"] = jobIdValue;
            }

            if (interpreterId !== null && interpreterId !== undefined && mileage === "") {
                this.calculateDistance(props);
            } else {
                // Mileage entered by the user
                props.mileage = mileage;
                this.saveState(props);
            }

        },

        calculateDistance: function (props) {
            var that = this;
            var interpreterId = props["interpreter.id"];
            var jobId = props["job.id"];
            var start, end = "";
            var isValid = true;

            var contact = $.core.Contact.findOrCreate({
                id: interpreterId
            });

            contact.fetch().done(function () {
                var primaryAddress = contact.get("primaryAddress");
                if (primaryAddress !== null && primaryAddress !== undefined) {
                    start = primaryAddress.addrEntered.replace(/\n/g, " ");
                    start = start.replace(/\r/g, " ");
                } else {
                    isValid = false;
                }

                var interpreterJob = new $.visit.v2.InterpreterVisitModel({
                    id: jobId
                });

                // fetch the job
                // TODO: remove this when have direct access to the model
                interpreterJob.fetch().done(function () {
                    var actualLocation = interpreterJob.get("location");

                    if (actualLocation !== null && actualLocation !== undefined) {
                        end = actualLocation.addrEntered.replace(/\n/g, " ");
                        end = end.replace(/\r/g, " ");
                    } else {
                        isValid = false;
                    }

                    if (isValid) {
                        var service = new google.maps.DistanceMatrixService();
                        service.getDistanceMatrix({
                            origins: [start],
                            destinations: [end],
                            travelMode: google.maps.TravelMode.DRIVING,
                            unitSystem: google.maps.UnitSystem.METRIC
                        }, function (response, status) {
                            that.callback(response, status, props);
                        });
                    } else {
                        that.saveState(props);
                    }
                });
            }).fail(function () {
                handleActionError({
                    message: "An error was encountered retrieving the contact. Please contact the administrator if the problem persists."
                });
            });
        },

        callback: function (response, status, props) {
            var responseStatus = response.rows[0].elements[0].status;
            var distance;

            if (responseStatus == "OK") {
                distance = response.rows[0].elements[0].distance.value;

                distance = distance / 1000;

                if (App.config.company.config["distanceUnits.id"] == 2) {
                    distance = distance / 1.609344;
                }

                //Round decimal
                distance = +distance.toFixed(2);

                if (!App.config.company.config.mileageOneWay) {
                    distance = distance * 2;
                }
            }

            props.mileage = distance;

            var state = new $.core.BookingAssignState(props || {}, {
                booking: this
            });

            return state.save(null, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, true /* wait for response */ );
                },
                error: popupFetchOptions.error
            });
        },

        assignWithCheck: function (props) {
            if (this.get("status") && this.get("status").nameKey == "assigned" && this.get("interpreter")) {
                var that = this;
                var view = new $.common.InterpreterReassignmentView({
                    model: this
                });
                var modal = new Backbone.BootstrapModal({
                    content: view,
                    okText: "Continue",
                    cancelText: "Cancel"
                });

                modal.on('ok', function () {
                    modal.close();
                    that.set("ignoreConflict", true);
                    props.ignoreConflict = true;
                    that.assign(props);
                });

                modal.on('cancel', function () {
                    modal.close();
                });

                modal.open();
            } else {
                return this.assign(props);
            }
        },

        unassign: function (props) {

            // little bit of a bogus status
            var status = new $.core.BookingUnassignState(props || {}, {
                booking: this
            });

            return status.save(null, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, {
                        waitForOk: true,
                        onHidden: function () {
                            parent.$.fn.colorbox.close();
                        }
                    });
                },
                error: popupFetchOptions.error
            });
        },

        confirmRequestor: function (props) {

            // little bit of a bogus status
            var status = new $.core.BookingConfirmRequestorState(props || {}, {
                booking: this
            });

            return status.save(null, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, {
                        waitForOk: true
                    });
                },
                error: popupFetchOptions.error
            });
        },

        confirmCustomer: function (props) {

            // little bit of a bogus status
            var status = new $.core.BookingConfirmCustomerState(props || {}, {
                booking: this
            });

            return status.save(null, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, {
                        waitForOk: true
                    });
                },
                error: popupFetchOptions.error
            });
        },

        confirmInterpreter: function (props) {

            // little bit of a bogus status
            var status = new $.core.BookingConfirmInterpreterState(props || {}, {
                booking: this
            });

            return status.save(null, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, {
                        waitForOk: true
                    });
                },
                error: popupFetchOptions.error
            });
        }
    };

    /*
    $.app.mixins.jobOfferStateMixin = {

        viewOffer: function () {
            var job = this.get("job");
            if (job) {
                var jobId = job.id;
                if (jobId) {
                    $.colorbox({
                        iframe: true,
                        open: true,
                        innerWidth: App.config.popups.cal.width,
                        innerHeight: App.config.popups.cal.height,
                        href: App.config.context + '/interpreter/offer/' + jobId,
                        returnFocus: false,
                        title: 'Offer Details',
                        onCleanup: function () {

                        }
                    });
                }
            }
        },

        accept: function (attrs, options) {

            var status = new $.core.JobOfferAcceptedState({}, {
                jobOffer: this
            });

            return status.save(null, options || popupFetchOptions);
        },

        decline: function (attrs, options) {
            var status = new $.core.JobOfferDeclinedState({}, {
                jobOffer: this
            });

            return status.save(null, options || popupFetchOptions);
        }
    };*/

    $.app.mixins.jobOfferStateMixin = {

        viewOffer: function () {
            var job = this.get("job");
            if (job) {
                var jobId = job.id;
                if (jobId) {
                    $.colorbox({
                        iframe: true,
                        open: true,
                        innerWidth: App.config.popups.cal.width,
                        innerHeight: App.config.popups.cal.height,
                        href: App.config.context + '/interpreter/offer/' + jobId,
                        returnFocus: false,
                        title: 'Offer Details',
                        onCleanup: function () {

                        }
                    });
                }
            }
        },

        accept: function (attrs, options) {
            var ignoreConflict = false;

            if (attrs) {
                if (attrs.ignoreConflict) {
                    ignoreConflict = attrs.ignoreConflict;
                }
            }
            var status = new $.core.JobOfferAcceptedState({}, {
                jobOffer: this,
                ignoreConflict: ignoreConflict
            });

            return status.save({
                ignoreConflict: ignoreConflict
            }, options || popupFetchOptions);
        },

        decline: function (attrs, options) {
            var status = new $.core.JobOfferDeclinedState({}, {
                jobOffer: this
            });

            return status.save(null, options || popupFetchOptions);
        }
    };


    $.app.mixins.videoSessionActionMixin = {

        cancel: function (attrs, options) {
            var status = new $.core.VideoSessionCancelAction({
                reason: attrs.reason
            }, {
                videoSession: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        close: function (attrs, options) {
            console.log("VideoSess close. attrs", attrs);
            var status = new $.core.VideoSessionCloseAction({}, {
                videoSession: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        start: function (attrs, options) {
            var status = new $.core.VideoSessionStartAction({}, {
                videoSession: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        assign: function (attrs, options) {
            var status = new $.core.VideoSessionAssignAction({}, {
                videoSession: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        rate: function (attrs, options) {
            var status = new $.core.VideoSessionRateAction({}, {
                videoSession: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        request: function (attrs, options) {
            var status = new $.core.VideoSessionRequestAction({
                language: attrs.language
            }, {
                videoSession: this
            });
            return status.save(attrs, options);
        },

        disconnect: function (attrs, options) {
            console.log("VideoSess Disconnect");
            var status = new $.core.VideoSessionDisconnectAction({}, {
                videoSession: this
            });
            var that = this;
            return status.save(attrs, options);
        }
    };

    $.app.mixins.ivrCallActionMixin = {

        cancel: function (attrs, options) {
            console.log("IVR cancel. attrs", attrs);
            var status = new $.core.IvrCallCancelAction({
                reason: attrs.reason
            }, {
                ivrCall: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        close: function (attrs, options) {
            console.log("IVR close. attrs", attrs);
            var status = new $.core.IvrCallCloseAction({}, {
                ivrCall: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        assign: function (attrs, options) {
            console.log("IVR assign. attrs", attrs);
            var status = new $.core.IvrCallAssignAction({}, {
                ivrCall: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        rate: function (attrs, options) {
            console.log("IVR rate. attrs", attrs);
            var status = new $.core.IvrCallRateAction({}, {
                ivrCall: this
            });
            var that = this;
            return status.save(attrs, options);
        },

        request: function (attrs, options) {
            console.log("IVR request. attrs", attrs);
            var status = new $.core.IvrCallRequestAction({
                language: attrs.language
            }, {
                ivrCall: this
            });
            return status.save(attrs, options);
        },

        disconnect: function (attrs, options) {
            console.log("IVR disconnect. attrs", attrs);
            var status = new $.core.IvrCallDisconnectAction({}, {
                ivrCall: this
            });
            return status.save(attrs, options);
        }
    };

    //    FIXME: BULK MECHANISM
    $.app.mixins.bulkCollection = {
        save: function (options) {
            options = options ? _.clone(options) : {};
            console.log("Bulk updating collection");
            var collectionModel = new Backbone.Model();
            var collection = this;
            collectionModel.url = collection.url + "_bulk";
            if (options.update && options.filters) {
                collectionModel.isNew = function () {
                    return false;
                };
                collectionModel.set("update", options.update);
                collectionModel.set("filters", options.filters);
            } else {
                collectionModel.isNew = function () {
                    return options.post ? true : false;
                };
                collectionModel.set("payload", _.map(collection.models, function (model) {
                    //return model.attributes;
                    return model.toJSON();
                }));
            }

            // TODO: this should not have these hard coded here.
            // TODO: must pick up whatever is passed
            collectionModel.set("eventType", options.eventType);
            collectionModel.set("ignoreLockedStatus", options.ignoreLockedStatus);
            collectionModel.set("update", options.update);
            collectionModel.set("deleteFrom", options.deleteFrom);
            collectionModel.set("invoiceableOnly", options.invoiceableOnly);
            collectionModel.set("includeVos", options.includeVos);
            collectionModel.set("payableOnly", options.payableOnly);
            collectionModel.set("mergePdf", options.mergePdf);
            collectionModel.set("regeneratePdf", options.regeneratePdf);
            collectionModel.set("notifyInterpreters", options.notifyInterpreters);
            collectionModel.set("notifyCustomers", options.notifyCustomers);
            collectionModel.set("groupByConsumer", options.groupByConsumer);
            collectionModel.set("emailParams", options.emailParams);
            if (options.emailType) {
                collectionModel.set("emailType", options.emailType);
            }
            // If the fields value is set, then only these fields should be returned.
            // If it is not set then all default fields will be returned.
            // Note 1: that in some cases not all fields are included by default.
            // Note 2: The controller may ignore this field altogether if it has not implemented it.
            if (options.fields) {
                collectionModel.set("fields", options.fields);
            }
            return collectionModel.save()
                .done(function (response) {
                    if (options.reset) {
                        collection.reset(response);
                    } else {
                        collection.set(response);
                    }
                })
                .fail(function () {
                    // TODO use handleErrors
                    console.log("Job offer bulk saved failed");
                });
        }
    };

    var beforeSaveMixin = $.app.mixins.beforeSaveMixin = {

        save: function (key, val, options) {
            this.beforeSave(key, val, options);
            return Backbone.Model.prototype.save.call(this, key, val, options);
        },

        beforeSave: function (key, val, options) {
            if (typeof tinyMCE !== "undefined") {
                //console.log("Updating wysiwyg fields");
                tinyMCE.triggerSave();
            }
        }

    };

    // namespace for core application models
    $.core = {};
    $.core.BaseModel = Backbone.Model.extend(beforeSaveMixin);
    $.core.BaseRelationalModel = Backbone.RelationalModel.extend(beforeSaveMixin);
    // model definitions ////////////////////////////////////////////////////////

    $.core.JoOfferState = $.core.BaseModel.extend({

        initialize: function (attributes, options) {
            this.id = options.jobOffer.id;
            // set the booking model
            this.jobOffer = options.jobOffer;
            this.ignoreConflict = options.ignoreConflict;

            // bind to event handlers
            this.listenTo(this, 'error', this.handleError);
            this.listenTo(this, 'invalid', this.handleError);
            this.listenTo(this, 'sync', this.handleSuccess);
        },

        url: function () {
            // id must always be present
            return App.config.context + '/api/jobOffer/' + this.id + '/status';
        },

        // override save to pull in required attributes from booking
        save: function (key, val, options) {
            // collect attributes before saving
            this.collectAttributes(key, val, options);
            return Backbone.Model.prototype.save.call(this, key, val, options);
        },

        handleError: function (model, response) {
            console.log("error", model, response);
            this.jobOffer.trigger('invalid', this.jobOffer, response);
        },

        handleSuccess: function (model, response) {
            console.log("success", model, response);
            // refetch the jobOffer to ensure the status is picked up correctly
            this.jobOffer.fetch();
        },

        handleChange: function () {
            console.log("change", arguments);
        }
    });

    $.core.JobOfferAcceptedState = $.core.JoOfferState.extend({
        collectAttributes: function () {
            this.set({
                action: "accept"
            });
        }
    });

    $.core.JobOfferDeclinedState = $.core.JoOfferState.extend({
        collectAttributes: function () {
            this.set({
                action: "decline"
            });
        }
    });

    $.core.JobState = $.core.BaseModel.extend({

        initialize: function (attributes, options) {
            this.id = options.job.id;
            this.job = options.job;

            this.listenTo(this, 'error', this.handleError);
            this.listenTo(this, 'invalid', this.handleError);
            this.listenTo(this, 'sync', this.handleSuccess);
        },

        url: function () {
            return App.config.context + '/api/job/' + this.id + '/status';
        },

        save: function (attrs, options) {
            this.collectAttributes(attrs, options);
            return Backbone.Model.prototype.save.call(this, attrs, options);
        },

        handleError: function (model, response) {
            console.log("error", model, response);
            this.job.trigger('invalid', this.job, response);
        },

        handleSuccess: function (model, response) {
            console.log("success", model, response);
            this.job.fetch({
                success: function (job) {
                    Backbone.trigger("jobUpdate", job);
                }
            });
        },
        handleChange: function () {
            console.log("change", arguments);
        }
    });

    $.core.BookingState = $.core.BaseModel.extend({

        initialize: function (attributes, options) {
            this.id = options.booking.id;
            // set the booking model
            this.booking = options.booking;
            // set the additional options passed for later reference
            this.options = options;

            // bind to event handlers
            this.listenTo(this, 'error', this.handleError);
            this.listenTo(this, 'invalid', this.handleError);
            this.listenTo(this, 'sync', this.handleSuccess);
        },

        url: function () {
            if (!App.config.isLoggedIn) {
                // currently only close available on public controller
                return App.config.context + '/public/' + App.config.company.uuid + '/status/' + this.booking.get("uuid");
            } else {
                // id must always be present
                return App.config.context + '/api/booking/' + this.id + '/status';
            }
        },

        // override save to pull in required attributes from booking
        save: function (attrs, options) {
            // collect attributes before saving
            this.collectAttributes(attrs, options);
            return Backbone.Model.prototype.save.call(this, attrs, options);
        },

        handleError: function (model, response) {
            this.booking.trigger('invalid', this.booking, response);
        },

        handleSuccess: function (model, response) {
            // refetch the booking to ensure the status is picked up correctly
            this.booking.fetch({
                success: function (booking) {
                    Backbone.trigger("bookingUpdate", booking);
                }
            });

        },

        handleChange: function () {
            console.log("change", arguments);
        }
    });

    $.core.BookingVerifiedState = $.core.BookingState.extend({

        collectAttributes: function () {

            this.set({
                action: "verify",
                actualStartDate: this.booking.get("actualStartDate"),
                actualEndDate: this.booking.get("actualEndDate"),
                status: this.booking.get("status"),
                invoiceStatus: this.booking.get("invoiceStatus"),
                paymentStatus: this.booking.get("paymentStatus")
            });

            if (this.booking.get("slaReportingEnabled")) {

                this.set({
                    timeInterpreterDepartedOutbound: this.booking.get("timeInterpreterDepartedOutbound"),
                    timeInterpreterArrivedOutbound: this.booking.get("timeInterpreterArrivedOutbound"),
                    timeInterpreterDepartedInbound: this.booking.get("timeInterpreterDepartedInbound"),
                    timeInterpreterArrivedInbound: this.booking.get("timeInterpreterArrivedInbound")
                });
            }

        },

        validate: function (attrs) {

            // do validation
            attrs = this.booking.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "Please save the booking before verifying"
                });
            }

            // booking must be in an end state to verify
            if (attrs.status.id !== App.dict.bookingStatus.closed.id && attrs.status.id !== App.dict.bookingStatus.declined.id && attrs.status.id !== App.dict.bookingStatus.cancelled.id && attrs.status.id !== App.dict.bookingStatus.nonattendance.id) {

                err.errors.push({
                    field: "status",
                    rejectedValue: "Invalid",
                    message: "Booking status must be either Closed, Cancelled, Unfulfilled or Non-Attendance to be properly verified"
                });
            }

            if (!attrs.invoiceStatus) {

                err.errors.push({
                    field: "invoiceStatus",
                    rejectedValue: "Invalid",
                    message: "Invoice status is required."
                });
            }

            if (!attrs.paymentStatus) {

                err.errors.push({
                    field: "paymentStatus",
                    rejectedValue: "Invalid",
                    message: "Payment status is required."
                });
            }

            // closed status
            if (attrs.status.id === App.dict.bookingStatus.closed.id && (!attrs.actualStartDate || !Date.parse(attrs.actualStartDate))) {
                err.errors.push({
                    field: "actualStartDate",
                    rejectedValue: "Blank",
                    message: "Actual start date is required and must be a valid date."
                });
            }

            if (attrs.status.id === App.dict.bookingStatus.closed.id && (!attrs.actualEndDate || !Date.parse(attrs.actualStartDate))) {
                err.errors.push({
                    field: "actualEndDate",
                    rejectedValue: "Blank",
                    message: "Actual end date is required and must be a valid date."
                });
            }

            if (attrs.status.id === App.dict.bookingStatus.closed.id && (attrs.actualStartDate && attrs.actualEndDate && Date.parse(attrs.actualStartDate) > Date.parse(attrs.actualEndDate))) {
                err.errors.push({
                    field: "actualEndDate",
                    rejectedValue: "Invalid",
                    message: "Start date must be before end date."
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.BookingOfferedState = $.core.BookingState.extend({
        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);
            this.offers = options.offers;
        },

        collectAttributes: function () {
            this.set({
                action: "offered",
                offers: this.offers
            });
        }
    });

    $.core.BookingUnverifiedState = $.core.BookingState.extend({
        collectAttributes: function () {
            this.set({
                action: "unverify"
            });
        }
    });

    $.core.BookingConfirmInterpreterState = $.core.BookingState.extend({

        collectAttributes: function () {

            this.set({
                action: "confirm-interpreter",
                interpreter: this.booking.get("interpreter") ? this.booking.get("interpreter").id : (this.booking.get("interpreter.id") ? this.booking.get("interpreter.id") : null),
                id: this.booking.get("id")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.booking.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "Please save the booking before confirming"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.JobFollowUpState = $.core.JobState.extend({
        collectAttributes: function () {
            this.set({
                action: "clone",
                id: this.job.get("id")
            });
        }
    });

    $.core.JobDuplicateState = $.core.JobState.extend({
        collectAttributes: function () {
            this.set({
                action: "duplicate",
                id: this.job.get("id")
            });
        }
    });

    $.core.JobRepeatState = $.core.JobState.extend({
        initialize: function (attributes, options) {
            $.core.JobState.prototype.initialize.call(this, attributes, options);

            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);
        },

        collectAttributes: function () {
            this.set({
                action: "repeat",
                id: this.job.get("id"),
                "company.id": App.config.company.id,
                "endsOn": this.job.get("endsOn"),
                "freq": this.job.get("freq"),
                "count": parseInt(this.job.get("count"), 10),
                "endOn": this.job.get("endOn"),
                "startOn": this.job.get("startOn")
            });

            if ($("select[name='freq']").val() === "WEEKLY") {
                var bd = "";
                if ($("#wd_SU:checked").val()) {
                    bd += "SU,";
                }
                if ($("#wd_MO:checked").val()) {
                    bd += "MO,";
                }
                if ($("#wd_TU:checked").val()) {
                    bd += "TU,";
                }
                if ($("#wd_WD:checked").val()) {
                    bd += "WE,";
                }
                if ($("#wd_TH:checked").val()) {
                    bd += "TH,";
                }
                if ($("#wd_FR:checked").val()) {
                    bd += "FR,";
                }
                if ($("#wd_SA:checked").val()) {
                    bd += "SA,";
                }
                if (bd.length > 0) {
                    bd = bd.substring(0, bd.length - 1);
                }
                $("#byDay").prop("disabled", "");

                this.set("byDay", bd);
            } else {
                $("#byDay").prop("disabled", "disabled");
            }

        },

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.freq) {
                err.errors.push({
                    field: "freq",
                    rejectedValues: "Blank",
                    message: "You must select an option: Weekly, Monthly or Daily"
                });
            }

            if (!attrs.endsOn) {
                err.errors.push({
                    field: "endsOn",
                    rejectedValues: "Blank",
                    message: "You must select an option for the 'Ends:' field"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }
    });

    $.core.JobCancelState = $.core.JobState.extend({

        initialize: function (attributes, options) {
            $.core.JobState.prototype.initialize.call(this, attributes, options);

            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);
        },

        collectAttributes: function () {
            this.set({
                action: "cancel",
                "cancellationReason.id": this.job.get("cancellationReason.id"),
                "payable.id": this.job.get("payable.id"),
                "billable.id": this.job.get("billable.id"),
                "notes": this.job.get("cancelNotes"),
                "noemail": this.job.get("noemail"),
                "bulkUpdate": this.job.get("bulkUpdate"),
                "bulkAction": this.job.get("bulkAction")
            });
        },

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["cancellationReason.id"]) {
                err.errors.push({
                    field: "cancellationReason.id",
                    rejectedValues: "Blank",
                    message: "You must select a reason to cancel this job"
                });
            }
            if (err.errors.length > 0) {
                return err;
            }
            if (!attrs["payable.id"]) {
                var pay = App.dict.cancellationReasons[this.job.get("cancellationReason.id")];
                this.set("payable.id", pay["payableStatus.id"]);
            }
            if (!attrs["billable.id"]) {
                var bill = App.dict.cancellationReasons[this.job.get("cancellationReason.id")];
                this.set("billable.id", bill["billableStatus.id"]);
            }
            if (!attrs.noemail) {
                this.set("noemail", false);
            } else {
                // do nothing
            }
        }
    });

    $.core.BookingCancelState = $.core.BookingState.extend({

        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);

            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);

        },

        collectAttributes: function () {
            this.set({
                action: "cancel",
                "cancellationReason.id": this.booking.get("cancellationReason.id"),
                "payable.id": this.booking.get("payable.id"),
                "billable.id": this.booking.get("billable.id"),
                "notes": this.booking.get("notes"),
                "noemail": this.booking.get("noemail")
            });
        },

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["cancellationReason.id"]) {
                err.errors.push({
                    field: "cancellationReason.id",
                    rejectedValue: "Blank",
                    message: "You must select a reason to cancel this job"
                });
            }
            if (err.errors.length > 0) {
                return err;
            }
            if (!attrs["payable.id"]) {
                err.errors.push({
                    field: "payable.id",
                    rejectedValue: "Blank",
                    message: "You must select Yes or No for field: Payable"
                });
            }
            if (!attrs["billable.id"]) {
                err.errors.push({
                    field: "billable.id",
                    rejectedValue: "Blank",
                    message: "You must select Yes or No for field: Billable"
                });
            }
            if (!attrs.noemail) {
                this.set("noemail", false);
            }
            // call invalid in errors and return
            else {
                // do nothing
            }
        }
    });

    $.core.BookingDeclineState = $.core.BookingState.extend({
        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);

            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);
        },

        collectAttributes: function () {
            this.set({
                action: "decline",
                "unfulfilledReason.id": this.booking.get("unfulfilledReason.id"),
                "notes": this.booking.get("notes"),
                "noemail": this.booking.get("noemail")
            });
        },

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["unfulfilledReason.id"]) {
                err.errors.push({
                    field: "unfulfilledReason.id",
                    rejectedValue: "Blank",
                    message: "You must select a reason to unfulfill this job"
                });
            }
            if (!attrs.noemail) {
                this.set("noemail", false);
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }
    });

    $.core.BookingCloseState = $.core.BookingState.extend({
        // defaults: {
        //     sig: "[]"
        // },
        // url: function () {
        //     //regular save
        //     return App.config.context + '/api/company/' + App.config.company.id + '/booking/' + this.id + '/close';
        // },
        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);
            //debugger;
            // TODO: these cause errors when used on mobile. want to remove dependency
            // bind error / invalid to fetch options
            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);

        },

        collectAttributes: function () {

            this.set({
                action: "close",
                id: this.booking.get("id"),
                actualStartDate: this.booking.get("actualStartDate"),
                actualEndDate: this.booking.get("actualEndDate"),
                contactArrivalDate: this.booking.get("contactArrivalDate"),
                contactLateMins: this.booking.get("contactLateMins"),
                consumerCount: this.booking.get("consumerCount"),
                assignmentDate: this.booking.get("assignmentDate"),
                timeInterpreterArrivedOutbound: this.booking.get("timeInterpreterArrivedOutbound"),
                timeInterpreterDepartedOutbound: this.booking.get("timeInterpreterDepartedOutbound"),
                timeInterpreterArrivedInbound: this.booking.get("timeInterpreterArrivedInbound"),
                timeInterpreterDepartedInbound: this.booking.get("timeInterpreterDepartedInbound"),
                isCancelled: this.booking.get("isCancelled"),
                cancellationReason: {
                    id: this.booking.get("cancellationReason") ? this.booking.get("cancellationReason").id : "" // TODO: change this to v2 APIs
                },
                "payable.id": this.booking.get("payable.id"), // TODO: change this to v2 APIs
                "billable.id": this.booking.get("billable.id"), // TODO: change this to v2 APIs
                closingNotes: this.booking.get("closingNotes"),
                vos: this.booking.get("vos"),
                vosOffline: this.booking.get("vosOffline"),
                signatureShown: this.booking.get("signatureShown"),
                signer: this.booking.get("signer"),
                signatureWidth: this.booking.get("signatureWidth"),
                signatureHeight: this.booking.get("signatureHeight"),
                signatureRaw: this.booking.get("signatureRaw"),
                signatureHash: this.booking.get("signatureHash"),
                incidentals: this.booking.get("incidentals"),
                refs: this.booking.get("refs"),
                disclaimerShown: this.booking.get("disclaimerShown"),
                disclaimerAccepted: this.booking.get("disclaimerAccepted"),
                disclaimerAcceptedInitials: this.booking.get("disclaimerAcceptedInitials"),
                disclaimerAcceptedDate: this.booking.get("disclaimerAcceptedDate"),
                isMobile: this.booking.get("isMobile")
            });
        },

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];
            var isInterpreter = (_.indexOf(App.config.userData.roles, "cont") > -1 && App.config.interpreter.id !== null) ? true : false;

            // for comparison
            var now = new Date();

            // configuration options
            var enableContactArrivalDate = this.options.companyConfig.get("enableContactArrivalDate");
            var enableContactLateTimeTracking = this.options.companyConfig.get("enableContactLateTimeTracking");
            var slaReportingEnabled = this.options.customerConfig.get("slaReportingEnabled");
            var enableTimeTracking = this.options.customerConfig.get("enableTimeTracking");
            var consumerCountEnabled = this.options.customerConfig.get("consumerCountEnabled");
            var vosRequired = this.options.customerConfig.get("vosRequired") && this.options.companyConfig.get("vosRequired");
            var eSignatureRequired = this.options.customerConfig.get("esignatureRequired") && this.options.companyConfig.get("eSignatureEnabled");
            var eSignatureGracePeriod = this.options.companyConfig.get("eSignatureGracePeriod");
            var enableCancelCheck = this.options.companyConfig.get("enableCancelCheck");
            var enableJustificationOnChangeStartTime = this.options.companyConfig.get("enableJustificationOnChangeStartTime");
            var isMobile = attrs.isMobile;
            // esignature required?
            // vos required?


            // *******************
            // validate fields
            if (enableContactArrivalDate || attrs.debug) {
                if (!attrs.contactArrivalDate) {
                    err.errors.push({
                        field: "contactArrivalDateDate",
                        rejectedValue: "Blank",
                        message: "The arrival date is required."
                    });
                    err.errors.push({
                        field: "contactArrivalDateTime",
                        rejectedValue: "Blank",
                        message: "The arrival time is required."
                    });
                }
            }

            if (enableContactLateTimeTracking || attrs.debug) {
                if (!attrs.contactLateMins) {
                    err.errors.push({
                        field: "contactLateMins",
                        rejectedValue: "Blank",
                        message: "The number of minutes late arrival is required."
                    });
                }
            }

            if (!attrs.actualStartDate) {
                err.errors.push({
                    field: "actualStartDateDate",
                    rejectedValue: "Blank",
                    message: "The start date is required."
                });
                err.errors.push({
                    field: "actualStartDateTime",
                    rejectedValue: "Blank",
                    message: "The start time is required."
                });
            }

            if (!attrs.actualEndDate) {
                err.errors.push({
                    field: "actualEndDateDate",
                    rejectedValue: "Blank",
                    message: "The end date is required."
                });
                err.errors.push({
                    field: "actualEndDateTime",
                    rejectedValue: "Blank",
                    message: "The end time is required."
                });
            }

            if (slaReportingEnabled || enableTimeTracking || attrs.debug) {
                if (!attrs.assignmentDate) {
                    err.errors.push({
                        field: "assignmentDateDate",
                        rejectedValue: "Blank",
                        message: "The assignment date is required."
                    });
                    err.errors.push({
                        field: "assignmentDateTime",
                        rejectedValue: "Blank",
                        message: "The assignment time is required."
                    });
                }

                if (!attrs.timeInterpreterDepartedOutbound) {
                    err.errors.push({
                        field: "timeInterpreterDepartedOutboundDate",
                        rejectedValue: "Blank",
                        message: "The outbound departed date is required."
                    });
                    err.errors.push({
                        field: "timeInterpreterDepartedOutboundTime",
                        rejectedValue: "Blank",
                        message: "The outbound departed time is required."
                    });
                }

                if (!attrs.timeInterpreterArrivedOutbound) {
                    err.errors.push({
                        field: "timeInterpreterArrivedOutboundDate",
                        rejectedValue: "Blank",
                        message: "The outbound arrival date is required."
                    });
                    err.errors.push({
                        field: "timeInterpreterArrivedOutboundTime",
                        rejectedValue: "Blank",
                        message: "The outbound arrival time is required."
                    });
                }
            }

            if (enableTimeTracking || attrs.debug) {
                if (!attrs.timeInterpreterDepartedInbound) {
                    err.errors.push({
                        field: "timeInterpreterDepartedInboundDate",
                        rejectedValue: "Blank",
                        message: "The inbound departed date is required."
                    });
                    err.errors.push({
                        field: "timeInterpreterDepartedInboundTime",
                        rejectedValue: "Blank",
                        message: "The inbound departed time is required."
                    });
                }

                if (!attrs.timeInterpreterArrivedInbound) {
                    err.errors.push({
                        field: "timeInterpreterArrivedInboundDate",
                        rejectedValue: "Blank",
                        message: "The inbound arrival date is required."
                    });
                    err.errors.push({
                        field: "timeInterpreterArrivedInboundTime",
                        rejectedValue: "Blank",
                        message: "The inbound arrival time is required."
                    });
                }
            }

            if (consumerCountEnabled || attrs.debug) {
                if (!attrs.consumerCount && _.isNaN(parseInt(attrs.consumerCount, 10))) {
                    err.errors.push({
                        field: "consumerCount",
                        rejectedValue: "Blank",
                        message: "The number of consumers interpreted for is required."
                    });
                }
            }

            // *******************
            // additional business rules validation logic

            // check arrival time before start time
            if (enableContactArrivalDate &&
                attrs.contactArrivalDate &&
                (Date.fromISOString(attrs.contactArrivalDate) > Date.fromISOString(attrs.actualStartDate))
            ) {
                err.errors.push({
                    field: "contactArrivalDate",
                    rejectedValue: "Blank",
                    message: "The arrival date cannot be after the start date."
                });
            }

            // check end time after start time
            if (attrs.actualStartDate &&
                attrs.actualEndDate &&
                (Date.fromISOString(attrs.actualEndDate) < Date.fromISOString(attrs.actualStartDate))
            ) {
                err.errors.push({
                    field: "actualEndDate",
                    rejectedValue: "Blank",
                    message: "The end date cannot be before the start date."
                });
            }

            // check actual start time before expected
            if (enableJustificationOnChangeStartTime && attrs.expectedStartDate &&
                attrs.actualStartDate &&
                (Date.fromISOString(attrs.actualStartDate) < Date.fromISOString(attrs.expectedStartDate)) &&
                (!attrs.closingNotes || attrs.closingNotes.length < 15) // at least 15 characters
            ) {
                err.errors.push({
                    field: "closingNotes",
                    rejectedValue: "Blank",
                    message: "You have indicated that the job started before the expected start time. Please enter a sufficient justification for this in the closing notes."
                });
            }

            // // II-6977 remove this validation check based on feedback from multiple customers
            // // actual end time after expected
            // if (attrs.expectedEndDate &&
            //     attrs.actualEndDate &&
            //     (Date.fromISOString(attrs.actualEndDate) > Date.fromISOString(attrs.expectedEndDate)) &&
            //     (!attrs.closingNotes || attrs.closingNotes.length < 15) // at least 15 characters
            // ) {
            //     err.errors.push({
            //         field: "closingNotes",
            //         rejectedValue: "Blank",
            //         message: "You have indicated that the job ended after the expected end time. Please enter a sufficient justification for this in the closing notes."
            //     });
            // }

            if (slaReportingEnabled || enableTimeTracking || attrs.debug) {
                // check assignment date before start date
                if (attrs.assignmentDate &&
                    attrs.actualStartDate &&
                    (Date.fromISOString(attrs.assignmentDate) > Date.fromISOString(attrs.actualStartDate))
                ) {
                    err.errors.push({
                        field: "assignmentDate",
                        rejectedValue: "Blank",
                        message: "The assignment must be before the start date."
                    });
                }

                // check outbound departure after assignment date
                if (attrs.timeInterpreterDepartedOutbound &&
                    attrs.assignmentDate &&
                    (Date.fromISOString(attrs.assignmentDate) > Date.fromISOString(attrs.timeInterpreterDepartedOutbound))
                ) {
                    err.errors.push({
                        field: "timeInterpreterDepartedOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound departure date must be after the assignment date."
                    });
                }

                // check outbound departure before start date
                if (attrs.timeInterpreterDepartedOutbound &&
                    attrs.actualStartDate &&
                    (Date.fromISOString(attrs.actualStartDate) < Date.fromISOString(attrs.timeInterpreterDepartedOutbound))
                ) {
                    err.errors.push({
                        field: "timeInterpreterDepartedOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound departure date must be before the start date."
                    });
                }

                // check outbound arrival after departure date
                if (attrs.timeInterpreterArrivedOutbound &&
                    attrs.timeInterpreterDepartedOutbound &&
                    (Date.fromISOString(attrs.timeInterpreterDepartedOutbound) > Date.fromISOString(attrs.timeInterpreterArrivedOutbound))
                ) {
                    err.errors.push({
                        field: "timeInterpreterDepartedOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound arrival date must be after the outbound departure date."
                    });
                }

                // check outbound arrival before start date
                if (attrs.timeInterpreterArrivedOutbound &&
                    attrs.actualStartDate &&
                    (Date.fromISOString(attrs.actualStartDate) < Date.fromISOString(attrs.timeInterpreterArrivedOutbound))
                ) {
                    err.errors.push({
                        field: "timeInterpreterDepartedOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound arrival date must be before the start date."
                    });
                }

            }

            if (enableTimeTracking || attrs.debug) {
                // check inbound departure date after end date
                if (attrs.timeInterpreterDepartedInbound &&
                    attrs.actualEndDate &&
                    (Date.fromISOString(attrs.timeInterpreterDepartedInbound) < Date.fromISOString(attrs.actualEndDate))
                ) {
                    err.errors.push({
                        field: "timeInterpreterDepartedInbound",
                        rejectedValue: "Blank",
                        message: "The inbound departure date must be after the end date."
                    });
                }

                // check inbound departure date before arrival
                if (attrs.timeInterpreterArrivedInbound &&
                    attrs.timeInterpreterDepartedInbound &&
                    (Date.fromISOString(attrs.timeInterpreterArrivedInbound) < Date.fromISOString(attrs.timeInterpreterDepartedInbound))
                ) {
                    err.errors.push({
                        field: "timeInterpreterArrivedInbound",
                        rejectedValue: "Blank",
                        message: "The inbound arrival date must be after the departure date."
                    });
                }
            }

            // cancellation information
            if ((enableCancelCheck && attrs.isCancelled && (!attrs.cancellationReason || (attrs.cancellationReason && !attrs.cancellationReason.id))) || attrs.debug) {
                err.errors.push({
                    field: "cancellationReason",
                    rejectedValues: "Blank",
                    message: "You must select a reason to cancel this job"
                });
            }

            if (attrs.signatureShown) {
                // esignature signer
                if (eSignatureRequired && !attrs.signer) {
                    err.errors.push({
                        field: "signer",
                        rejectedValue: "Blank",
                        message: "The Authorised Signatory is required."
                    });
                }

                // esignature
                if (eSignatureRequired && !attrs.signatureRaw) {
                    err.errors.push({
                        field: "signatureRaw",
                        rejectedValue: "Blank",
                        message: "A signature is required."
                    });
                }

                if (isInterpreter) {
                    // Do not allow interpreters submit eSignature after configured eSignature grace period
                    if (eSignatureGracePeriod && eSignatureGracePeriod > 0) {
                        var edt = Date.fromISOString(attrs.actualEndDate);
                        if (edt.addMinutes(eSignatureGracePeriod) < now) {
                            err.errors.push({
                                field: "actualEndDate",
                                rejectedValue: "Blank",
                                message: "It is too late to close job with eSignature. Please upload the VoS form using the interpreter portal."
                            });
                        }
                    }
                }
            }

            // vos
            // ensure vos or submit offline is checked unless esignature is required and on mobile
            if (vosRequired && (!attrs.vos && !attrs.vosOffline) && !(eSignatureRequired && isMobile)) {
                err.errors.push({
                    field: "vos",
                    rejectedValue: "Blank",
                    message: "The verification of service document is required to be uploaded, or you must check the box to submit offline."
                });
                err.errors.push({
                    field: "vosOffline",
                    rejectedValue: "Blank",
                    message: "The verification of service document is required to be uploaded, or you must check the box to submit offline."
                });
            }

            if (isInterpreter) {
                // jobs can only be closed for a start and end time before now
                var dt = Date.fromISOString(attrs.actualStartDate);

                if (dt > now) {
                    err.errors.push({
                        field: "actualStartDate",
                        rejectedValue: "Blank",
                        message: "You are trying to close a job which has not started yet. you can only close a job after the start date/time has passed."
                    });
                }

                dt = Date.fromISOString(attrs.actualEndDate);

                if (dt > now) {
                    err.errors.push({
                        field: "actualEndDate",
                        rejectedValue: "Blank",
                        message: "You are trying to close a job for time in the future. you can only close a job after the end date/time has passed."
                    });
                }
            }

            // disclaimer
            if (attrs.disclaimerShown) {
                if (!attrs.disclaimerAcceptedInitials) {
                    err.errors.push({
                        field: "disclaimerAcceptedInitials",
                        rejectedValue: "Blank",
                        message: "You must enter your initials when accepting the disclaimer before you can proceed."
                    });
                }

                if (!attrs.disclaimerAccepted) {
                    err.errors.push({
                        field: "disclaimerAccepted",
                        rejectedValue: "Blank",
                        message: "You must accept the disclaimer before you can proceed."
                    });
                }
            }

            // validate incidentals (if embedded)
            if (this.get("incidentals") instanceof Backbone.Collection) {
                $.common.validateCollection(this.get("incidentals"), err);
            }

            // validate refs (if embedded)
            if (this.get("refs") instanceof Backbone.Collection) {
                $.common.validateCollection(this.get("refs"), err);
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    $.core.BookingAssignState = $.core.BookingState.extend({

        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);

            // bind error / invalid to fetch options
            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);

        },

        collectAttributes: function () {

            this.set({
                action: "assign",
                id: this.booking.get("id")
            });
        },

        validate: function (attrs) {

            // do validation
            //attrs = this.booking.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "You must select a job to assign this interpreter"
                });
            }

            if (!attrs["interpreter.id"]) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "You must select an interpreter to assign to this job"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.BookingUnassignState = $.core.BookingState.extend({

        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);
            // bind error / invalid to fetch options
            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);

        },

        collectAttributes: function () {
            var cancelReason = this.booking.get("cancellationReason");
            var deactivationReason = this.booking.get("deactivationReason");

            if (cancelReason) {
                this.set({
                    "cancellationReason.id": cancelReason ? cancelReason.id : null
                });
            }

            if (deactivationReason) {
                this.set({
                    "deactivationReason.id": deactivationReason ? deactivationReason.id : null
                });
            }

            var to = this.booking.get("unassignEmail");
            if (to) {
                this.set({
                    "unassignEmail": to ? to : null
                });
            }

            this.set({
                action: "unassign",
                id: this.booking.get("id"),
                createInteraction: this.booking.get("createInteraction"),
                "category.id": this.booking.get("category").id,
                "subCategory.id": this.booking.get("subCategory").id,
                description: this.booking.get("description")
            });
        },

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "You must select a job to unassign this interpreter"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.BookingConfirmRequestorState = $.core.BookingState.extend({

        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);

            // bind error / invalid to fetch options
            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);

        },

        collectAttributes: function () {

            this.set({
                action: "confirm-requestor",
                id: this.booking.get("id")
            });
        },

        validate: function (attrs) {

            // do validation
            //attrs = this.booking.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "You must select a job to confirm this requestor"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.BookingConfirmCustomerState = $.core.BookingState.extend({

        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);

            // bind error / invalid to fetch options
            this.bind('error', popupFetchOptions.error);
            this.bind('invalid', popupFetchOptions.error);

        },

        collectAttributes: function () {

            this.set({
                action: "confirm-customer",
                customer: this.booking.get("customer") ? this.booking.get("customer").id : null,
                id: this.booking.get("id")
            });
        },

        validate: function (attrs) {

            // do validation
            //attrs = this.booking.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "You must select a job to confirm this requestor"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    // contact (interpreter or translator)
    $.core.Contact = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.contact,
        url: function () {
            return this.id ? App.config.context + '/api/contact/' + this.id : App.config.context + '/api/contact';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'contactTypes',
            relatedModel: '$.core.ContactType'
        }, {
            type: Backbone.HasMany,
            key: 'languageMappings',
            relatedModel: '$.core.ContactLanguageMapping'
        }, {
            type: Backbone.HasMany,
            key: 'eligibilities',
            relatedModel: '$.core.EmploymentEligibility'
        }, {
            type: Backbone.HasMany,
            key: 'qualifications',
            relatedModel: '$.core.Qualification'
        }, {
            type: Backbone.HasMany,
            key: 'criteriaHierarchy',
            relatedModel: '$.core.EmploymentEligibility'
        }, {
            type: Backbone.HasMany,
            key: 'numbers',
            relatedModel: '$.core.ContactNumber'
        }, {
            type: Backbone.HasMany,
            key: 'emails',
            relatedModel: '$.core.ContactEmail'
        }, {
            type: Backbone.HasMany,
            key: 'addresses',
            relatedModel: '$.core.ContactAddress'
        }, {
            type: Backbone.HasMany,
            key: 'services',
            relatedModel: '$.core.CompanyService'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.firstName) {
                err.errors.push({
                    field: "firstName",
                    rejectedValue: "Blank",
                    message: "First name is required."
                });
            }
            if (!attrs.lastName) {
                err.errors.push({
                    field: "lastName",
                    rejectedValue: "Blank",
                    message: "Last name is required."
                });
            }
            if (!attrs["gender.id"] && !(attrs.gender && attrs.gender.id)) {
                err.errors.push({
                    field: "gender.id",
                    rejectedValue: "Blank",
                    message: "You must select the gender."
                });
            }
            if (!attrs["employmentCategory.id"] && !(attrs.employmentCategory && attrs.employmentCategory.id)) {
                err.errors.push({
                    field: "employmentCategory.id",
                    rejectedValue: "Blank",
                    message: "Please select the category of employment (see Employment Status & Eligibility tab)."
                });
            }
            if (!attrs["assignmentTier.id"] && !(attrs.assignmentTier && attrs.assignmentTier.id)) {
                err.errors.push({
                    field: "assignmentTier.id",
                    rejectedValue: "Blank",
                    message: "Please select the assignment tier (see Employment Status & Eligibility tab)."
                });
            }
            if (this.get("numbers").length === 0) {
                err.errors.push({
                    field: "numbers",
                    rejectedValue: "Empty",
                    message: "Please add at least one number."
                });
            }
            if (this.get("addresses").length === 0) {
                err.errors.push({
                    field: "addresses",
                    rejectedValue: "Empty",
                    message: "Please add at least one address."
                });
            }
            if (this.get("emails").length === 0) {
                err.errors.push({
                    field: "emails",
                    rejectedValue: "Empty",
                    message: "Please add at least one email."
                });
            }
            if (this.get("languageMappings").length === 0) {
                err.errors.push({
                    field: "languageMappings",
                    rejectedValue: "Empty",
                    message: "Please add at least one language."
                });
            }
            //validate contact types
            $.common.validateCollection(this.get("contactTypes"), err);
            //validate languages
            $.common.validateCollection(this.get("languageMappings"), err);
            //validate employment eligibilities
            $.common.validateCollection(this.get("eligibilities"), err);
            //validate qualifications
            $.common.validateCollection(this.get("qualifications"), err);
            //validate numbers
            $.common.validateCollection(this.get("numbers"), err);
            //validate emails
            $.common.validateCollection(this.get("emails"), err);
            //validate addresses
            $.common.validateCollection(this.get("addresses"), err);
            //validate contact services
            $.common.validateCollection(this.get("services"), err);

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // customer
    $.core.Customer = $.core.BaseRelationalModel.extend({
        /*sync: function(method, model, options) {
         model.trigger('syncing', model, options);
         Backbone.Model.prototype.sync.apply(this, arguments);
         },*/
        defaults: App.dict.defaults.customer,
        url: function () {
            return this.id ? App.config.context + '/api/customer/' + this.id : App.config.context + '/api/customer';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'customerCategories',
            relatedModel: '$.core.CustomerCategory'
        }, {
            type: Backbone.HasMany,
            key: 'contacts',
            relatedModel: '$.core.CustomerContact'
        }, {
            type: Backbone.HasMany,
            key: 'consumers',
            relatedModel: '$.core.Consumer'
        }, {
            type: Backbone.HasMany,
            key: 'numbers',
            relatedModel: '$.core.CustomerNumber'
        }, {
            type: Backbone.HasMany,
            key: 'emails',
            relatedModel: '$.core.CustomerEmail'
        }, {
            type: Backbone.HasMany,
            key: 'billingAddresses',
            relatedModel: '$.core.CustomerAddress'
        }, {
            type: Backbone.HasMany,
            key: 'addresses',
            relatedModel: '$.core.CustomerAddress'
        }, {
            type: Backbone.HasMany,
            key: 'services',
            relatedModel: '$.core.CompanyService'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "You must enter a customer name."
                });
            }
            if (!attrs["contractType.id"]) {
                err.errors.push({
                    field: "contractType.id",
                    rejectedValue: "Blank",
                    message: "Please select a contract type status."
                });
            }
            if (!attrs["status.id"]) {
                err.errors.push({
                    field: "status.id",
                    rejectedValue: "Blank",
                    message: "Please select a customer status."
                });
            }


            //validate billing addresses
            var billAddrs = this.get("billingAddresses");
            $.common.validateCollection(billAddrs, err);
            if (!billAddrs || billAddrs.models.length === 0) {
                err.errors.push({
                    field: "billingAddresses",
                    rejectedValue: "Blank",
                    message: "You must enter at least one billing address."
                });
            }
            //validate addresses
            $.common.validateCollection(this.get("addresses"), err);
            //validate emails
            $.common.validateCollection(this.get("emails"), err);
            //validate numbers
            $.common.validateCollection(this.get("numbers"), err);
            //validate contacts
            $.common.validateCollection(this.get("contacts"), err);
            //validate customer categories
            $.common.validateCollection(this.get("customerCategories"), err);
            //validate customer services
            $.common.validateCollection(this.get("services"), err);


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // Consumer
    $.core.Consumer = $.core.BaseRelationalModel.extend({

        defaults: App.dict.defaults.consumer,
        url: function () {
            return this.id ? App.config.context + '/api/consumer/' + this.id : App.config.context + '/api/consumer';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'criteria',
            relatedModel: '$.core.ConsumerCriteria'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.firstName) {
                err.errors.push({
                    field: "firstName",
                    rejectedValue: "Blank",
                    message: "First Name is required."
                });
            }
            if (!attrs.lastName) {
                err.errors.push({
                    field: "lastName",
                    rejectedValue: "Blank",
                    message: "Last Name is Required"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.ConsumerCriteria = $.core.BaseRelationalModel.extend({
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id || attrs.id === "") {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "Invalid criteria selected."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    // Interaction
    $.core.Interaction = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "category",
                "company",
                "outcome",
                "status",
                "communicationType",
                "subStatusCancellation",
                "type",
                "customer",
                "job",
                "interpreter",
                "location",
                "consumer",
                "cancellationReason",
                "deactivationReason",
                "language",
                "actionGroup"
            ];
        },

        defaults: App.dict.defaults.interaction,
        url: function () {
            return this.id ? App.config.context + '/api/interaction/' + this.id : App.config.context + '/api/interaction';
        },
        idAttribute: 'id',

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.interpreter) {
                err.errors.push({
                    field: "interpreter",
                    rejectedValue: "Blank",
                    message: "Interpreter is required."
                });
            }
            if (!attrs.category) {
                err.errors.push({
                    field: "category",
                    rejectedValue: "Blank",
                    message: "Category is required"
                });
            }
            if (!attrs.subCategory) {
                err.errors.push({
                    field: "subCategory",
                    rejectedValue: "Blank",
                    message: "Subcategory is required"
                });
            }
            if (!attrs.status) {
                err.errors.push({
                    field: "status",
                    rejectedValue: "Blank",
                    message: "Status is required"
                });
            }
            if (attrs.subCategory && attrs.subCategory.id == App.dict.interactionSubCategory.cancelled.id) {
                if (!attrs.cancellationReason) {
                    err.errors.push({
                        field: "cancellationReason",
                        rejectedValue: "Blank",
                        message: "Cancellation Reason is required"
                    });
                }
            }
            if (attrs.subCategory && attrs.subCategory.id == App.dict.interactionSubCategory.deactivated_sub.id) {
                if (!attrs.deactivationReason) {
                    err.errors.push({
                        field: "deactivationReason",
                        rejectedValue: "Blank",
                        message: "Deactivation Reason is required"
                    });
                }
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    // Requestor
    $.core.Requestor = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "company",
                "primaryCompany",
                "customer",
                "interpreter",
                "contact",
                "defaultLocation",
                "businessUnit"
            ];
        },

        defaults: App.dict.defaults.requestor,
        url: function () {
            return this.id ? App.config.context + '/api/requestor/' + this.id : App.config.context + '/api/requestor';
        },
        idAttribute: 'id',

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.username) {
                err.errors.push({
                    field: "username",
                    rejectedValue: "Blank",
                    message: "A username is required"
                });
            }
            if (!attrs.firstName) {
                err.errors.push({
                    field: "firstName",
                    rejectedValue: "Blank",
                    message: "A first name is required"
                });
            }
            if (!attrs.lastName) {
                err.errors.push({
                    field: "lastName",
                    rejectedValue: "Blank",
                    message: "A last name is required"
                });
            }
            if (!attrs.number) {
                err.errors.push({
                    field: "number",
                    rejectedValue: "Blank",
                    message: "A phone number is required"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.CustomerClientLocation = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.customerClientLocation,
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "company",
                "requestor",
                "customer",
                "client",
                "location"
            ];
        },
        url: function () {

            var prefix = App.config.context + '/api';
            var url;

            // booking associated with incidental
            var requestorId = this.get("requestor") ? this.get("requestor").id : null;
            if (requestorId) {

                prefix += '/requestor/' + requestorId;

            }
            if (this.id) {

                url = prefix + '/customerClientLocation/' + this.id;

            } else {

                url = prefix + '/customerClientLocation';
            }
            return url;
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (!attrs.customer || !attrs.customer.id) {
                err.errors.push({
                    field: "customer",
                    rejectedValue: "Blank",
                    message: "Customer is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // Client
    $.core.Client = $.core.BaseRelationalModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "company",
                "customer",
                "businessUnit"
            ];
        },
        defaults: App.dict.defaults.client,
        url: function () {
            return this.id ? App.config.context + '/api/client/' + this.id : App.config.context + '/api/client';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.customer && !attrs.customer.id) {
                err.errors.push({
                    field: "customer",
                    rejectedValue: "Blank",
                    message: "Customer is required."
                });
            }
            if (!attrs.customer && !attrs.customer.id) {
                err.errors.push({
                    field: "company",
                    rejectedValue: "Blank",
                    message: "Company is required"
                });
            }
            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Name is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // company (agency)
    $.core.Company = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.company,
        url: function () {
            return this.id ? App.config.context + '/api/company/' + this.id : App.config.context + '/api/company';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasOne,
            key: 'config',
            relatedModel: '$.core.CompanyConfig'
        }, {
            type: Backbone.HasMany,
            key: 'numbers',
            relatedModel: '$.core.CompanyNumber'
        }, {
            type: Backbone.HasMany,
            key: 'emails',
            relatedModel: '$.core.CompanyEmail'
        }, {
            type: Backbone.HasMany,
            key: 'addresses',
            relatedModel: '$.core.CompanyAddress'
        }, {
            type: Backbone.HasMany,
            key: 'services',
            relatedModel: '$.core.CompanyService'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Company name cannot be blank."
                });
            }

            //validate config
            //attrs.config.validate(config.attributes);

            //validate numbers
            $.common.validateCollection(this.get("numbers"), err);
            //validate emails
            $.common.validateCollection(this.get("emails"), err);
            //validate addresses
            $.common.validateCollection(this.get("addresses"), err);

            //validate config
            $.common.validateChild(this.get("config"), err);


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },
        clone: function () {

            // call clone on backbone relational
            var cl = Backbone.RelationalModel.prototype.clone.apply(this);

            // strip uuid
            cl.attributes.uuid = null;
            cl.unset("config.id");

            cl.set("config", new Backbone.Collection());

            // clone each the relational model
            var companyConfig = this.get("config");

            var clonedConfig = companyConfig.clone();

            // strip uuid and config id = null to prevent argument type mismatch
            clonedConfig.attributes.uuid = null;
            clonedConfig.attributes.id = "";

            // set the config on company to be the clonedConfig values
            cl.set("config", clonedConfig);

            return cl;

        }
    });

    //customer config
    $.core.CompanyConfig = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.companyConfig,

        url: function () {

            if (this.id) {
                return App.config.context + '/api/company/config/' + this.id;
            } else if (this.get("company.id")) {
                return App.config.context + '/api/company/' + this.get("company.id") + '/config';
            } else {
                return App.config.context + '/api/company/config';
            }
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'referenceCodes',
            relatedModel: '$.core.ReferenceCodeConfig'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.currencyCode) {
                err.errors.push({
                    field: "currencyCode",
                    rejectedValue: "Blank",
                    message: "Please select a currency."
                });
            }
            if (!attrs["distanceUnits.id"]) {
                err.errors.push({
                    field: "distanceUnits.id",
                    rejectedValue: "Blank",
                    message: "Please select a distance units."
                });
            }
            if (!attrs.timeZone) {
                err.errors.push({
                    field: "timeZone",
                    rejectedValue: "Blank",
                    message: "Please select a time zone."
                });
            }
            if (!attrs.locale) {
                err.errors.push({
                    field: "timeZone",
                    rejectedValue: "Blank",
                    message: "Please select a time zone."
                });
            }
            if (!attrs.logoUri) {
                err.errors.push({
                    field: "logoUri",
                    rejectedValue: "Blank",
                    message: "Please enter the URL for the company logo."
                });
            }
            if (!attrs.iconUri) {
                err.errors.push({
                    field: "logoUri",
                    rejectedValue: "Blank",
                    message: "Please enter the URL for the company icon."
                });
            }

            if (!attrs.daysPrior || (attrs.daysPrior && !isNumber(attrs.daysPrior)) || (isNumber(attrs.daysPrior) && attrs.daysPrior < 0)) {
                err.errors.push({
                    field: "daysPrior",
                    rejectedValue: "Blank",
                    message: "Please enter a number greater than zero."
                });
            }

            if (!attrs.interactionOverdueHrs) {
                err.errors.push({
                    field: "interactionOverdueHrs",
                    rejectedValue: "Blank",
                    message: "Please enter number of hours for interaction overdue."
                });
            }

            if (attrs.enableContactArrivalDate && attrs.enableContactLateTimeTracking) {
                err.errors.push({
                    field: "enableContactArrivalDate",
                    rejectedValue: "Invalid",
                    message: "Arrival Time and Late Time cannot be configured together."
                });
                err.errors.push({
                    field: "enableContactLateTimeTracking",
                    rejectedValue: "Invalid",
                    message: "Arrival Time and Late Time cannot be configured together."
                });
            }

            var validHour = function (str) {
                return (/^[0-9]+$/).test(str);
            };

            var jobOffersReminderHoursValid = _.every(_.map(attrs.jobOfferReminderHours.split(','), function (str) {
                return str.trim();
            }), validHour);
            if (!jobOffersReminderHoursValid) {
                err.errors.push({
                    field: "jobOfferReminderHours",
                    rejectedValue: "Invalid",
                    message: "Please enter a comma separated list of hours"
                });
            }

            //validate contact types
            $.common.validateCollection(this.get("referenceCodes"), err);

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact numbers for company
    $.core.CompanyNumber = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.number,
        url: function () {

            var companyId = this.get("company.id");

            return this.id ? App.config.context + '/api/company/' + companyId + '/number/' + this.id : App.config.context + '/api/company/' + companyId + '/number';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.parsedNumber || attrs.parsedNumber === "") {
                err.errors.push({
                    field: "parsedNumber",
                    rejectedValue: "Blank",
                    message: "Please enter a number."
                });
            }

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Please select a number type."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact emails for company
    $.core.CompanyEmail = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.email,
        url: function () {

            var companyId = this.get("company.id");

            return this.id ? App.config.context + '/api/company/' + companyId + '/email/' + this.id : App.config.context + '/api/company/' + companyId + '/email';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.emailAddress || attrs.emailAddress === "") {
                err.errors.push({
                    field: "emailAddress",
                    rejectedValue: "Blank",
                    message: "Please enter an email address."
                });
            }

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Please select an email type."
                });
            }


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact addresses for company
    $.core.CompanyAddress = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.address,
        url: function () {

            var companyId = this.get("company.id");

            return this.id ? App.config.context + '/api/company/' + companyId + '/address/' + this.id : App.config.context + '/api/company/' + companyId + '/address';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "The address type cannot be blank."
                });
            }
            if (!attrs.valid) {
                err.errors.push({
                    field: "addrEntered",
                    rejectedValue: "Blank",
                    message: "The street address cannot be blank and must be a valid address."
                });
            }
            if (isNaN(attrs.lat) || attrs.lat < -90 || attrs.lat > 90) {
                err.errors.push({
                    field: "addrEntered",
                    rejectedValue: "Not Valid",
                    message: "The calculated latitude is not valid. Please revalidate the address."
                });
            }
            if (isNaN(attrs.lng) || attrs.lng < -180 || attrs.lng > 180) {
                err.errors.push({
                    field: "addrEntered",
                    rejectedValue: "Not Valid",
                    message: "The calculated longitude is not valid. Please revalidate the address."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.CompanyService = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.companyService,
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.service || !attrs.service.id || attrs.service.id === "") {
                err.errors.push({
                    field: "service",
                    rejectedValue: "Blank",
                    message: "The service type cannot be blank."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact type for contact (interpreter)
    $.core.ContactType = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.contactType,
        url: function () {

            var contactId = this.get("contact.id");

            return this.id ? App.config.context + '/api/contact/' + contactId + '/type/' + this.id : App.config.context + '/api/contact/' + contactId + '/type';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id || attrs.id === "") {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "Please select a contact type."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact language mappings for contact (interpreter)
    $.core.ContactLanguageMapping = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.languageMapping,
        url: function () {

            var contactId = this.get("contact.id");

            return this.id ? App.config.context + '/api/contact/' + contactId + '/language/' + this.id : App.config.context + '/api/contact/' + contactId + '/language';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["language.id"] || attrs["language.id"] === "") {
                err.errors.push({
                    field: "language-select",
                    rejectedValue: "Blank",
                    message: "Please select a language from the drop down."
                });
            }
            if (!attrs.rating || attrs.rating === "") {
                err.errors.push({
                    field: "rating",
                    rejectedValue: "Blank",
                    message: "Please select a rating from the drop down."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact numbers for contact (interpreter)
    $.core.ContactNumber = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.number,
        url: function () {

            var contactId = this.get("contact.id");

            return this.id ? App.config.context + '/api/contact/' + contactId + '/number/' + this.id : App.config.context + '/api/contact/' + contactId + '/number';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.parsedNumber || attrs.parsedNumber === "") {
                err.errors.push({
                    field: "parsedNumber",
                    rejectedValue: "Blank",
                    message: "Please enter a number."
                });
            }

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Please select a number type."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact emails for contact (interpreter)
    $.core.ContactEmail = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.email,
        url: function () {

            var contactId = this.get("contact.id");

            return this.id ? App.config.context + '/api/contact/' + contactId + '/email/' + this.id : App.config.context + '/api/contact/' + contactId + '/email';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.emailAddress || attrs.emailAddress === "") {
                err.errors.push({
                    field: "emailAddress",
                    rejectedValue: "Blank",
                    message: "Please enter an email address."
                });
            }

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Please select an email type."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact addresses for contact (interpreter)
    $.core.ContactAddress = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.address,
        url: function () {

            var contactId = this.get("contact.id");

            return this.id ? App.config.context + '/api/contact/' + contactId + '/address/' + this.id : App.config.context + '/api/contact/' + contactId + '/address';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "The address type cannot be blank."
                });
            }
            if (!attrs.valid) {
                err.errors.push({
                    field: "addrEntered",
                    rejectedValue: "Blank",
                    message: "The street address cannot be blank and must be a valid address."
                });
            }
            if (isNaN(attrs.lat) || attrs.lat < -90 || attrs.lat > 90) {
                err.errors.push({
                    field: "addrEntered",
                    rejectedValue: "Not Valid",
                    message: "The calculated latitude is not valid. Please revalidate the address."
                });
            }
            if (isNaN(attrs.lng) || attrs.lng < -180 || attrs.lng > 180) {
                err.errors.push({
                    field: "addrEntered",
                    rejectedValue: "Not Valid",
                    message: "The calculated longitude is not valid. Please revalidate the address."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    // customer category (market segment)
    $.core.CustomerCategory = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.customerCategory,
        url: function () {

            var customerId = this.get("customer.id");

            return this.id ? App.config.context + '/api/customer/' + customerId + '/category/' + this.id : App.config.context + '/api/customer/' + customerId + '/category';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id || attrs.id === "") {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "Please select a category."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // customer contact person
    $.core.CustomerContact = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.contactPerson,
        url: function () {

            var customerId = this.get("customer.id");

            return this.id ? App.config.context + '/api/company/' + App.config.company.id + '/customer/' + customerId + '/contact/' + this.id : App.config.context + '/api/company/' + App.config.company.id + '/customer/' + customerId + '/contact';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.firstName || attrs.firstName === "") {
                err.errors.push({
                    field: "firstName",
                    rejectedValue: "Blank",
                    message: "The first name cannot be blank."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact numbers for customer
    $.core.CustomerNumber = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.number,
        url: function () {

            var customerId = this.get("customer.id");

            return this.id ? App.config.context + '/api/customer/' + customerId + '/number/' + this.id : App.config.context + '/api/customer/' + customerId + '/number';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.parsedNumber || attrs.parsedNumber === "") {
                err.errors.push({
                    field: "parsedNumber",
                    rejectedValue: "Blank",
                    message: "Please enter a number."
                });
            }

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Please select a number type."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact emails for customer
    $.core.CustomerEmail = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.email,
        url: function () {

            var customerId = this.get("customer.id");

            return this.id ? App.config.context + '/api/customer/' + customerId + '/email/' + this.id : App.config.context + '/api/customer/' + customerId + '/email';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.emailAddress || attrs.emailAddress === "") {
                err.errors.push({
                    field: "emailAddress",
                    rejectedValue: "Blank",
                    message: "Please enter an email address."
                });
            }

            if (!attrs["type.id"] || attrs["type.id"] === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Please select an email type."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // contact addresses for customer
    $.core.CustomerAddress = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.address,
        initialize: function (attributes, options) {

            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.entities = [
                "client"
            ];
        },
        url: function () {

            var url = App.config.context + '/api';

            var customerId = this.get("customer.id");

            if (!customerId && this.get("customer")) {
                customerId = this.get("customer").id;
            }

            if (customerId) {
                url += '/customer/' + customerId + '/address';
            } else {
                url += '/address';
            }
            return this.id ? url + '/' + this.id : url;
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            // if full address (no parent)
            if (!attrs["parent.id"]) {

                if ((!attrs["type.id"] || attrs["type.id"] === "") && !attrs.isBilling && !attrs.isServiceLocation) {
                    err.errors.push({
                        field: "type.id",
                        rejectedValue: "Blank",
                        message: "The address type cannot be blank."
                    });
                } else if (attrs.isBilling && attrs["type.id"] != App.dict.addressType.billing.id) {
                    err.errors.push({
                        field: "type.id",
                        rejectedValue: "Blank",
                        message: "The address can be only of type Billing."
                    });
                } else if (attrs.isServiceLocation && attrs["type.id"] != App.dict.addressType.service.id) {
                    err.errors.push({
                        field: "type.id",
                        rejectedValue: "Blank",
                        message: "The address can be only of type Service Location."
                    });
                }
                if (!attrs.addrEntered) {
                    err.errors.push({
                        field: "addrEntered",
                        rejectedValue: "Blank",
                        message: "The street address cannot be blank and must be a valid address."
                    });
                }
                if (!attrs.valid && (typeof google != "undefined") /* enforce check if google available */ ) {
                    err.errors.push({
                        field: "addrEntered",
                        rejectedValue: "Blank",
                        message: "The street address cannot be blank and must be a valid address."
                    });
                }
                if (isNaN(attrs.lat) || attrs.lat < -90 || attrs.lat > 90) {
                    err.errors.push({
                        field: "addrEntered",
                        rejectedValue: "Not Valid",
                        message: "The calculated latitude is not valid. Please revalidate the address."
                    });
                }
                if (isNaN(attrs.lng) || attrs.lng < -180 || attrs.lng > 180) {
                    err.errors.push({
                        field: "addrEntered",
                        rejectedValue: "Not Valid",
                        message: "The calculated longitude is not valid. Please revalidate the address."
                    });
                }
            } else {
                // sublocation
                if (!attrs.description && !attrs.preamble) {
                    err.errors.push({
                        field: "preamble",
                        rejectedValue: "Blank",
                        message: "Sublocations must have either a description or a place name."
                    });
                }

            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // audit history
    $.core.Audit = $.core.BaseModel.extend({
        url: function () {
            var type = this.get("type");

            return App.config.context + '/api/audit/' + type + '/' + this.id;
        }
    });

    // contact employment eligibility (employment eligibility)
    // TODO: still used for Contact relationship. Migrate to v2.
    $.core.EmploymentEligibility = $.core.BaseRelationalModel.extend({ //Backbone.Model.extend({//Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.employmentEligibility,
        initialize: function () {

        },
        url: function () {
            return this.id ? App.config.context + '/api/employmentEligibility/' + this.id : App.config.context + '/api/employmentEligibility';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["criteria.id"] || (attrs["criteria.id"] === "")) {
                err.errors.push({
                    field: "criteria.id",
                    rejectedValue: "Blank",
                    message: "Please select an employment criteria."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.v2 = $.core.v2 || {};
    $.core.v2.EmploymentEligibility = $.core.BaseModel.extend({ //Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.employmentEligibility,
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "interpreter",
                "company",
                "type",
                "criteria",
                "language",
                "state"
            ];
        },
        url: function () {
            return this.id ? App.config.context + '/api/employmentEligibility/' + this.id : App.config.context + '/api/employmentEligibility';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!(attrs.criteria && attrs.criteria.id) || (attrs.criteria && attrs.criteria.id === "")) {
                err.errors.push({
                    field: "criteria.id",
                    rejectedValue: "Blank",
                    message: "Please select an employment criteria."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    // contact qualification (employment eligibility)
    $.core.Qualification = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.qualification,
        url: function () {

            var contactId = this.get("contact.id");
            if (!this.id) {
                this.model.set("interpreter.id", contactId);
            }

            return this.id ? App.config.context + '/api/contact/' + contactId + '/qualification/' + this.id : App.config.context + '/api/contact/' + contactId + '/qualification';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["criteria.id"] || attrs["criteria.id"] === "") {
                err.errors.push({
                    field: "criteria.id",
                    rejectedValue: "Blank",
                    message: "Please select a qualification."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // general employment criteria (hr criteria)
    $.core.Criteria = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.criteria,
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "company",
                "active",
                "enforcementPolicy",
                "type"
            ];
        },
        url: function () {

            var companyId = this.get("company").id;

            return this.id ? App.config.context + '/api/company/' + companyId + '/criteria/' + this.id : App.config.context + '/api/company/' + companyId + '/criteria';

        },
        relations: [{
            type: Backbone.HasMany,
            key: 'criteriaChildren',
            relatedModel: '$.core.CriteriaChild'
        }],
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name || attrs.name === "") {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Please enter the criteria name."
                });
            }
            if (!attrs.description || attrs.description === "") {
                err.errors.push({
                    field: "description",
                    rejectedValue: "Blank",
                    message: "Please enter a description."
                });
            }
            if (!attrs.type || attrs.type === "") {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Please select a criteria type."
                });
            }
            if (!attrs.enforcementPolicy || attrs.enforcementPolicy === "") {
                err.errors.push({
                    field: "enforcementPolicy.id",
                    rejectedValue: "Blank",
                    message: "Please select an enforcement policy."
                });
            }
            if (!attrs.active || attrs.active === "") {
                err.errors.push({
                    field: "active.id",
                    rejectedValue: "Blank",
                    message: "Please specify whether the criteria is active."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    $.core.BookingFinance = $.core.BaseModel.extend({
        url: function () {
            return App.config.context + '/api/company/' + App.config.company.id + '/booking/' + this.get("bookingId") + '/contact/' + this.get("interpreterId") + '/finance';
        }
    });

    // booking
    $.core.Booking = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.booking,
        url: function () {


            if (this.id && this.get("action")) {

                //if it's state changing action on the booking
                var action = this.get("action");

                //can elaborate on this
                return App.config.context + '/booking/manager/close/' + this.id;

            } else {

                //regular save
                return this.id ? App.config.context + '/api/company/' + App.config.company.id + '/booking/' + this.id : App.config.context + '/api/company/' + App.config.company.id + '/booking';
            }
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'refs',
            relatedModel: '$.core.BookingReference'
        }, {
            type: Backbone.HasMany,
            key: 'requirements',
            relatedModel: '$.core.BookingCriteria'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["customer.id"]) {
                err.errors.push({
                    field: "customer-select",
                    rejectedValue: "Blank",
                    message: "You must select a customer."
                });
            }
            if (!attrs["billingLocation.id"]) {
                err.errors.push({
                    field: "billingLocation-select",
                    rejectedValue: "Blank",
                    message: "You must select the location requesting service."
                });
            }
            //used to be free text requestor field
            if (!attrs["requestor.id"]) {
                err.errors.push({
                    field: "requestor-select",
                    rejectedValue: "Blank",
                    message: "Please select or create a new requestor."
                });
            }
            /*if (!attrs["requestedBy"]) {
             err.errors.push({field: "requestedBy", rejectedValue: "Blank", message: "Please enter the requestor."});
             }*/
            if (!attrs["location.id"]) {
                err.errors.push({
                    field: "location-select",
                    rejectedValue: "Blank",
                    message: "You must select the service location."
                });
            }
            if (!attrs.timeZone) {
                err.errors.push({
                    field: "timeZone",
                    rejectedValue: "Blank",
                    message: "The time zone cannot be blank."
                });
            }
            if (attrs.bookingDate === undefined) {
                err.errors.push({
                    field: "bookingDateField",
                    rejectedValue: "Incorrect Format",
                    message: "Please enter the booking date in the correct " + App.config.company.config.dateFormat + " format."
                });
            } else if (!attrs.bookingDate) {
                err.errors.push({
                    field: "bookingDateField",
                    rejectedValue: "Blank",
                    message: "The booking date is required."
                });
                err.errors.push({
                    field: "bookingTime",
                    rejectedValue: "Blank",
                    message: "The booking time is required."
                });
            }
            if (!attrs["bookingMode.id"]) {
                err.errors.push({
                    field: "bookingMode.id",
                    rejectedValue: "Blank",
                    message: "The interpretation type is required."
                });
            }
            if (!attrs["language.id"]) {
                err.errors.push({
                    field: "language-select",
                    rejectedValue: "Blank",
                    message: "You must select the language."
                });
            }
            if (attrs.expectedStartDate === undefined) {
                err.errors.push({
                    field: "startDate",
                    rejectedValue: "Incorrect Format",
                    message: "Please enter the start date in the correct " + App.config.company.config.dateFormat + " format."
                });
            } else if (!attrs.expectedStartDate) {
                err.errors.push({
                    field: "startDate",
                    rejectedValue: "Blank",
                    message: "The start date is required."
                });
                err.errors.push({
                    field: "startTime",
                    rejectedValue: "Blank",
                    message: "The start time is required."
                });
            }
            if (attrs.expectedDurationHrs) {
                if (isNaN(attrs.expectedDurationHrs)) {
                    err.errors.push({
                        field: "expectedDurationHrs",
                        rejectedValue: "Blank",
                        message: "Please enter a number for duration. (e.g.) 2.5 for 2 hours 30 minutes"
                    });
                }
            }
            if (!attrs.expectedEndDate) {
                err.errors.push({
                    field: "endDate",
                    rejectedValue: "Blank",
                    message: "The end date is required."
                });
                err.errors.push({
                    field: "endTime",
                    rejectedValue: "Blank",
                    message: "The end time is required."
                });
                err.errors.push({
                    field: "expectedDurationHrs",
                    rejectedValue: "Blank",
                    message: "Please specify the duration."
                });
            }

            var dt;

            if (attrs.slaReportingEnabled || attrs.timeTrackingEnabled) {
                var outboundDeparture = attrs.timeInterpreterDepartedDateOutbound + " " + attrs.timeInterpreterDepartedTimeOutbound;
                var outboundArrival = attrs.timeInterpreterArrivedDateOutbound + " " + attrs.timeInterpreterArrivedTimeOutbound;

                dt = Date.parseExact(outboundDeparture, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterDepartedDateOutbound",
                        rejectedValue: "Formatting",
                        message: "The departed date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterDepartedTimeOutbound",
                        rejectedValue: "Blank",
                        message: "The departed time may be improperly formatted."
                    });
                }

                dt = Date.parseExact(outboundArrival, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterArrivedDateOutbound",
                        rejectedValue: "Formatting",
                        message: "The arrival date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterArrivedTimeOutbound",
                        rejectedValue: "Blank",
                        message: "The arrival time may be improperly formatted."
                    });
                }
            }

            if (attrs.timeTrackingEnabled) {
                var inboundDeparture = attrs.timeInterpreterDepartedDateInbound + " " + attrs.timeInterpreterDepartedTimeInbound;
                var inboundArrival = attrs.timeInterpreterArrivedDateInbound + " " + attrs.timeInterpreterArrivedTimeInbound;

                dt = Date.parseExact(inboundDeparture, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterDepartedDateInbound",
                        rejectedValue: "Formatting",
                        message: "The inbound departed date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterDepartedTimeInbound",
                        rejectedValue: "Blank",
                        message: "The inbound departed time may be improperly formatted."
                    });
                }

                dt = Date.parseExact(inboundArrival, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterArrivedDateInbound",
                        rejectedValue: "Formatting",
                        message: "The inbound arrival date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterArrivedTimeInbound",
                        rejectedValue: "Blank",
                        message: "The inbound arrival time may be improperly formatted."
                    });
                }
            }

            //validate references
            $.common.validateCollection(this.get("refs"), err);
            //validate requirements
            $.common.validateCollection(this.get("requirements"), err);

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },
        isClosed: function () {

            var status = this.get("status.id");

            if (App.dict.bookingStatus.closed.id === status || App.dict.bookingStatus.cancelled.id === status || App.dict.bookingStatus.nonattendance.id === status || App.dict.bookingStatus.declined.id === status) {
                return true;
            }
        },
        isOpen: function () {

            var status = this.get("status.id");

            if (App.dict.bookingStatus['new'].id == status || App.dict.bookingStatus.open.id == status || App.dict.bookingStatus.offered.id == status.id || App.dict.bookingStatus.assigned.id == status || App.dict.bookingStatus.confirmed.id == status) {
                return true;
            }
        }
    });

    // booking
    // TODO: remove this entirely. replaced with BookingCloseState
    // TODO: this can be fully removed and replaced with BookingStatus
    // TODO to retrieve the status at closing
    $.core.BookingClose = $.core.BaseRelationalModel.extend({
        defaults: {
            sig: "[]"
        },
        url: function () {
            //regular save
            return App.config.context + '/api/company/' + App.config.company.id + '/booking/' + this.id + '/close';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];
            var isInterpreter = (_.indexOf(App.config.userData.roles, "cont") > -1 && App.config.interpreter.id !== null) ? true : false;

            if (App.config.company.config.enableContactArrivalDate) {
                if (!attrs.arrivalDate) {
                    err.errors.push({
                        field: "arrivalDate",
                        rejectedValue: "Blank",
                        message: "The arrival date is required."
                    });
                }

                if (!attrs.arrivalTime) {
                    err.errors.push({
                        field: "arrivalTime",
                        rejectedValue: "Blank",
                        message: "The arrival time is required."
                    });
                }
            }

            if (!attrs.startDate) {
                err.errors.push({
                    field: "startDate",
                    rejectedValue: "Blank",
                    message: "The start date is required."
                });
            }

            if (!attrs.endDate) {
                err.errors.push({
                    field: "endDate",
                    rejectedValue: "Blank",
                    message: "The end date is required."
                });
            }

            if (!attrs.startTime) {
                err.errors.push({
                    field: "startTime",
                    rejectedValue: "Blank",
                    message: "The start time is required."
                });
            }

            if (!attrs.endTime) {
                err.errors.push({
                    field: "endTime",
                    rejectedValue: "Blank",
                    message: "The end time is required."
                });
            }

            if (!attrs.signer && attrs.eSignatureRequired) {
                err.errors.push({
                    field: "signer",
                    rejectedValue: "Blank",
                    message: "The Authorised Signatory is required."
                });
            }


            var actualStart = attrs.startDate + " " + attrs.startTime;
            var actualEnd = attrs.endDate + " " + attrs.endTime;
            // set the actuals
            this.set({
                actualStartDate: actualStart,
                actualEndDate: actualEnd
            }, {
                silent: true
            });

            var dt = Date.parseExact(actualEnd, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

            if (!dt) {

                err.errors.push({
                    field: "endDate",
                    rejectedValue: "Formatting",
                    message: "The end date may be improperly formatted."
                });

                err.errors.push({
                    field: "endTime",
                    rejectedValue: "Blank",
                    message: "The end time may be improperly formatted."
                });
            }

            dt = Date.parseExact(actualStart, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

            if (!dt) {

                err.errors.push({
                    field: "startDate",
                    rejectedValue: "Formatting",
                    message: "The start date may be improperly formatted."
                });

                err.errors.push({
                    field: "startTime",
                    rejectedValue: "Blank",
                    message: "The start time may be improperly formatted."
                });
            }

            if (isInterpreter) {
                // Do not allow interpreters close bookings beyond the expectedStartDate
                var now = new Date();
                if (dt > now) {
                    err.errors.push({
                        field: "startTime",
                        rejectedValue: "Blank",
                        message: "You are trying to close a job which has not started yet. you can only close a job after the start date/time has passed."
                    });
                }

                if (attrs.eSignatureRequired) {
                    // Do not allow interpreters submit eSignature after configured eSignature grace period
                    if (attrs.eSignatureGracePeriod && attrs.eSignatureGracePeriod > 0) {
                        var edt = Date.parseExact(actualEnd, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);
                        if (edt.addMinutes(attrs.eSignatureGracePeriod) < now) {
                            err.errors.push({
                                field: "endTime",
                                rejectedValue: "Blank",
                                message: "It is too late to close job with eSignature. Please upload the VoS form using the interpreter portal."
                            });

                        }
                    }
                }
            }

            if (attrs.slaReportingEnabled || attrs.timeTrackingEnabled) {
                if (!attrs.assignmentDateDate) {
                    err.errors.push({
                        field: "assignmentDateDate",
                        rejectedValue: "Blank",
                        message: "The assignment date is required."
                    });
                }

                if (!attrs.assignmentDateTime) {
                    err.errors.push({
                        field: "assignmentDateTime",
                        rejectedValue: "Blank",
                        message: "The assignment time is required."
                    });
                }

                if (!attrs.timeInterpreterDepartedDateOutbound) {
                    err.errors.push({
                        field: "timeInterpreterDepartedDateOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound departed date is required."
                    });
                }

                if (!attrs.timeInterpreterDepartedTimeOutbound) {
                    err.errors.push({
                        field: "timeInterpreterDepartedTimeOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound departed time is required."
                    });
                }

                if (!attrs.timeInterpreterArrivedDateOutbound) {
                    err.errors.push({
                        field: "timeInterpreterArrivedDateOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound arrival date is required."
                    });
                }

                if (!attrs.timeInterpreterArrivedTimeOutbound) {
                    err.errors.push({
                        field: "timeInterpreterArrivedTimeOutbound",
                        rejectedValue: "Blank",
                        message: "The outbound arrival time is required."
                    });
                }

                var assignmentDate = attrs.assignmentDateDate + " " + attrs.assignmentDateTime;

                this.set({
                    assignmentDate: assignmentDate
                }, {
                    silent: true
                });

                dt = Date.parseExact(assignmentDate, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "assignmentDateDate",
                        rejectedValue: "Formatting",
                        message: "The assignment date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "assignmentDateTime",
                        rejectedValue: "Blank",
                        message: "The assignment time may be improperly formatted."
                    });
                }

                var outboundDeparture = attrs.timeInterpreterDepartedDateOutbound + " " + attrs.timeInterpreterDepartedTimeOutbound;
                var outboundArrival = attrs.timeInterpreterArrivedDateOutbound + " " + attrs.timeInterpreterArrivedTimeOutbound;

                this.set({
                    timeInterpreterDepartedOutbound: outboundDeparture,
                    timeInterpreterArrivedOutbound: outboundArrival
                }, {
                    silent: true
                });

                dt = Date.parseExact(outboundDeparture, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterDepartedDateOutbound",
                        rejectedValue: "Formatting",
                        message: "The departed date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterDepartedTimeOutbound",
                        rejectedValue: "Blank",
                        message: "The departed time may be improperly formatted."
                    });
                }

                dt = Date.parseExact(outboundArrival, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterArrivedDateOutbound",
                        rejectedValue: "Formatting",
                        message: "The arrival date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterArrivedTimeOutbound",
                        rejectedValue: "Blank",
                        message: "The arrival time may be improperly formatted."
                    });
                }
            }

            if (attrs.isCancelled && !attrs["cancellationReason.id"]) {
                err.errors.push({
                    field: "cancellationReason.id",
                    rejectedValues: "Blank",
                    message: "You must select a reason to cancel this job"
                });
            }

            if (attrs.timeTrackingEnabled) {
                if (!attrs.timeInterpreterDepartedDateInbound) {
                    err.errors.push({
                        field: "timeInterpreterDepartedDateInbound",
                        rejectedValue: "Blank",
                        message: "The inbound departed date is required."
                    });
                }

                if (!attrs.timeInterpreterDepartedTimeInbound) {
                    err.errors.push({
                        field: "timeInterpreterDepartedTimeInbound",
                        rejectedValue: "Blank",
                        message: "The inbound departed time is required."
                    });
                }

                if (!attrs.timeInterpreterArrivedDateInbound) {
                    err.errors.push({
                        field: "timeInterpreterArrivedDateInbound",
                        rejectedValue: "Blank",
                        message: "The inbound arrival date is required."
                    });
                }

                if (!attrs.timeInterpreterArrivedTimeInbound) {
                    err.errors.push({
                        field: "timeInterpreterArrivedTimeInbound",
                        rejectedValue: "Blank",
                        message: "The inbound arrival time is required."
                    });
                }

                var inboundDeparture = attrs.timeInterpreterDepartedDateInbound + " " + attrs.timeInterpreterDepartedTimeInbound;
                var inboundArrival = attrs.timeInterpreterArrivedDateInbound + " " + attrs.timeInterpreterArrivedTimeInbound;

                this.set({
                    timeInterpreterDepartedInbound: inboundDeparture,
                    timeInterpreterArrivedInbound: inboundArrival
                }, {
                    silent: true
                });

                dt = Date.parseExact(inboundDeparture, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterDepartedDateInbound",
                        rejectedValue: "Formatting",
                        message: "The inbound departed date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterDepartedTimeInbound",
                        rejectedValue: "Blank",
                        message: "The inbound departed time may be improperly formatted."
                    });
                }

                dt = Date.parseExact(inboundArrival, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (!dt) {

                    err.errors.push({
                        field: "timeInterpreterArrivedDateInbound",
                        rejectedValue: "Formatting",
                        message: "The inbound arrival date may be improperly formatted."
                    });

                    err.errors.push({
                        field: "timeInterpreterArrivedTimeInbound",
                        rejectedValue: "Blank",
                        message: "The inbound arrival time may be improperly formatted."
                    });
                }
            }

            if (attrs.consumerCountEnabled) {
                if (attrs.consumerCount === null || attrs.consumerCount === "" || typeof (attrs.consumerCount) === "undefined") {
                    err.errors.push({
                        field: "consumerCount",
                        rejectedValue: "Blank",
                        message: "The number of consumers is required."
                    });
                }
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    // recurring booking
    $.core.RecurringBookingGroup = $.core.Booking.extend({
        defaults: {
            'applyTo': 'this'
        },
        url: function () {

            // if update is only to single booking
            if (this.get('applyTo') == 'this') {

                return $.core.RecurringBookingGroup.__super__.initialize.apply(this, arguments);

            } else {

                // assumes id and booking instance is always present
                return App.config.context + '/api/company/' + App.config.company.id + '/booking/' + this.id + '/recurring/' + this.booking.id;
            }

        }
    });

    // template
    $.core.EmailTemplate = $.core.BaseModel.extend({
        defaults: App.dict.defaults.template,
        url: function () {
            var companyId = this.get("company.id");
            return this.id ? App.config.context + '/api/company/' + companyId + '/template/email/' + this.id : App.config.context + '/api/company/' + companyId + '/template/email';
        }
    });

    $.core.SmsTemplate = $.core.BaseModel.extend({
        defaults: App.dict.defaults.smsTemplate,
        url: function () {
            var companyId = this.get("company.id");
            return this.id ? App.config.context + '/api/company/' + companyId + '/template/sms/' + this.id : App.config.context + '/api/company/' + companyId + '/template/sms';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.body) {
                err.errors.push({
                    field: "body",
                    rejectedValue: "Blank",
                    message: "SMS template body cannot be blank. Please enter some template text."
                });
            }

            // validation is on dynamic text, so can only warn user and assume they preview correctly
            if (attrs.body && attrs.body.length > 160 && !attrs.ignoreSmsBodyLength) {

                err.code = 413;
                err.status = 413;
                err.message = "SMS template body with dynamic text is over the 160 character limit for SMS messages.<br/><br/>Please be sure to preview the template and ensure the <strong>final text</strong> is less than the required 160 characters.<br/><br/>Messages over 160 characters will <strong>NOT</strong> be sent.";

                return err;
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }

    });

    $.core.EmailModel = Backbone.Model.extend({
        urlRoot: App.config.context + '/api/email'
    });

    $.core.SmsModel = Backbone.Model.extend({
        urlRoot: App.config.context + '/api/sms'
    });

    // booking reference
    $.core.BookingReference = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.bookingReference,
        url: function () {
            var bookingId = this.get("booking.id");
            return this.id ? App.config.context + '/api/booking/' + bookingId + '/reference/' + this.id : App.config.context + '/api/booking/' + bookingId + '/reference';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasOne,
            key: 'config',
            relatedModel: '$.core.ReferenceCodeConfig'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Reference name cannot be blank."
                });
            }
            if (!attrs.ref) {

                // include ref field name in error if present
                if (attrs.name) {
                    err.errors.push({
                        field: "ref",
                        rejectedValue: "Blank",
                        message: "Reference [" + attrs.name + "] cannot be blank."
                    });
                } else {
                    err.errors.push({
                        field: "ref",
                        rejectedValue: "Blank",
                        message: "Reference cannot be blank."
                    });
                }
            }

            //if the reference is from configured field, check validation
            if (attrs.config) {
                var config = attrs.config;

                //check for instance of here to avoid JS error after save
                if (config instanceof Backbone.RelationalModel && config.get("regEx")) {
                    ///^([a-z0-9]{5,})$/.test('abc1');
                    var regEx = new RegExp(config.get("regEx"));

                    //test the value entered
                    if (!regEx.test(attrs.ref)) {
                        err.errors.push({
                            field: "ref",
                            rejectedValue: "Invalid reference",
                            message: "The reference you entered is not valid."
                        });
                    }
                }
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // reference code configuration for customers
    $.core.ReferenceCodeConfig = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.referenceCodeConfig,
        url: function () {
            return this.id ? App.config.context + '/api/referenceCodeConfig/' + this.id : App.config.context + '/api/referenceCodeConfig';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.label) {
                err.errors.push({
                    field: "label",
                    rejectedValue: "Blank",
                    message: "Please enter the reference field label."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });



    // booking requirement
    $.core.BookingCriteria = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.bookingCriteria,
        url: function () {
            var bookingId = this.get("booking.id");
            return this.id ? App.config.context + '/api/booking/' + bookingId + '/requirement/' + this.id : App.config.context + '/api/booking/' + bookingId + '/requirement';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["criteria.id"]) {
                err.errors.push({
                    field: "criteria.id",
                    rejectedValue: "Blank",
                    message: "A requirement must be selected."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // message sent in the system
    $.core.Message = $.core.BaseModel.extend({
        defaults: App.dict.defaults.message,
        url: function () {
            return this.id ? App.config.context + '/api/company/' + App.config.company.id + '/message/' + this.id : App.config.context + '/api/company/' + App.config.company.id + '/message';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.title) {
                err.errors.push({
                    field: "title",
                    rejectedValue: "Blank",
                    message: "The title must be entered."
                });
            }
            if (!attrs["type.id"]) {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Message type is required"
                });
            }
            if (!attrs["audience.id"]) {
                err.errors.push({
                    field: "audience.id",
                    rejectedValue: "Blank",
                    message: "Audience is required"
                });
            }
            if (!attrs.dateInactive) {
                err.errors.push({
                    field: "dateInactive",
                    rejectedValue: "Blank",
                    message: "In active date is required"
                });
            }
            if (!attrs.dateActive) {
                err.errors.push({
                    field: "dateActive",
                    rejectedValue: "Blank",
                    message: "Active date is required"
                });
            }
            if (!attrs.summary) {
                err.errors.push({
                    field: "summary",
                    rejectedValue: "Blank",
                    message: "Summary is required."
                });
            }
            if (!attrs.body) {
                err.errors.push({
                    field: "body",
                    rejectedValue: "Blank",
                    message: "The message body cannot be blank."
                });
            }
            if (!attrs.target && attrs["audience.id"] == 5 && !attrs.id) {
                err.errors.push({
                    field: "audience.id",
                    rejectedValue: "Blank",
                    message: "Messages for Custom Audience can't be created from here. Please visit Manage Contacts page to send custom messages."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.ContactMessage = $.core.BaseModel.extend({
        url: function () {
            return App.config.context + '/api/company/' + App.config.company.id + '/contact/' + App.config.interpreter.id + '/contactMessage/' + this.get("id");
        }
    });

    // holiday for an agency
    $.core.Holiday = $.core.BaseModel.extend({
        defaults: App.dict.defaults.holiday,
        url: function () {
            return this.id ? App.config.context + '/api/company/' + this.get("company.id") + "/holiday/" + this.id : App.config.context + '/api/company/' + this.get("company.id") + "/holiday";
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Holiday name is required."
                });
            }
            if (!attrs.date) {
                err.errors.push({
                    field: "date",
                    rejectedValue: "Blank",
                    message: "Holiday date is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // cancellation reason for an agency
    $.core.CancellationReason = $.core.BaseModel.extend({
        defaults: App.dict.defaults.cancellationReason,
        url: function () {
            return this.id ? App.config.context + '/api/company/' + this.get("company.id") + "/cancellation/" + this.id : App.config.context + '/api/company/' + this.get("company.id") + "/cancellation";
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Cancellation reason is required."
                });
            }
            if (!attrs.description) {
                err.errors.push({
                    field: "date",
                    rejectedValue: "Blank",
                    message: "Cancellation reason description is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // unfulfilled reason for an agency
    $.core.UnfulfilledReason = $.core.BaseModel.extend({
        defaults: App.dict.defaults.unfulfilledReason,
        url: function () {
            return this.id ? App.config.context + '/api/unfulfilledReason/' + this.id : App.config.context + '/api/unfulfilledReason';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Unfulfilled reason is required."
                });
            }
            if (!attrs.description) {
                err.errors.push({
                    field: "description",
                    rejectedValue: "Blank",
                    message: "Unfulfilled reason description is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // Action Group for an agency
    $.core.ActionGroup = $.core.BaseModel.extend({
        defaults: App.dict.defaults.actionGroup,
        url: function () {
            return this.id ? App.config.context + '/api/company/' + this.get("company.id") + "/actiongroup/" + this.id : App.config.context + '/api/company/' + this.get("company.id") + "/actiongroup";
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Action group is required."
                });
            }
            if (!attrs.description) {
                err.errors.push({
                    field: "date",
                    rejectedValue: "Blank",
                    message: "Action group description is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // cancellation reason for an agency
    $.core.BusinessUnit = $.core.BaseModel.extend({
        defaults: App.dict.defaults.businessUnit,
        url: function () {
            return this.id ? App.config.context + '/api/businessUnit/' + this.id : App.config.context + '/api/businessUnit';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Business unit name is required."
                });
            }
            if (!attrs.description) {
                err.errors.push({
                    field: "date",
                    rejectedValue: "Blank",
                    message: "Business unit description is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // document
    $.core.Document = $.core.BaseModel.extend({
        defaults: App.dict.defaults.document,
        url: function () {

            var parentType = this.get("parentEntityType");
            var parentId = this.get("parentEntityId");
            var baseUrl = App.config.context + '/api/company/' + App.config.company.id + '/' + parentType + '/' + parentId + '/document';

            return this.id ? baseUrl + '/' + this.id : baseUrl;
        }
    });

    // report
    $.core.Report = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.report,
        url: function () {

            var baseUrl = App.config.context + '/api/company/' + App.config.company.id + '/report';

            return this.id ? baseUrl + '/' + this.id : baseUrl;
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasOne,
            key: 'document',
            relatedModel: '$.core.Document'
        }]
    });

    // role
    $.core.Role = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.role,
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // user object
    $.core.User = $.core.BaseRelationalModel.extend({ //Backbone.Model.extend({
        sync: function (method, model, options) {

            // TODO: this is a mix of relational model and new JSON API.
            // TODO: would like to generalize this to not have to do in
            // TODO: specific case like this.
            if (!model.get("customer")) {
                model.set("customer", {
                    id: ""
                });
            }
            if (!model.get("interpreter")) {
                model.set("interpreter", {
                    id: ""
                });
            }
            if (!model.get("defaultLocation")) {
                model.set("defaultLocation", {
                    id: ""
                });
            }
            if (!model.get("company")) {
                model.set("company", {
                    id: ""
                });
            }
            if (!model.get("primaryCompany")) {
                model.set("primaryCompany", {
                    id: ""
                });
            }
            if (!model.get("businessUnit")) {
                model.set("businessUnit", {
                    id: ""
                });
            }

            return Backbone.sync.call(this, method, model, options);
        },
        defaults: App.dict.defaults.user,
        url: function () {
            return this.id ? App.config.context + '/api/user/' + this.id : App.config.context + '/api/user';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'authorities',
            relatedModel: '$.core.Role'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                if (!attrs.password) {
                    err.errors.push({
                        field: "password",
                        rejectedValue: "Blank",
                        message: "Please create a password"
                    });
                }
                if (attrs.password && !(attrs.passwordConfirm)) {
                    err.errors.push({
                        field: "passwordConfirm",
                        rejectedValue: "Blank",
                        message: "Please confirm your password."
                    });
                }
                if (attrs.password && (attrs.password !== attrs.passwordConfirm)) {
                    err.errors.push({
                        field: "password",
                        rejectedValue: "Blank",
                        message: "Passwords do not match."
                    });
                }
            } else {
                if (attrs.password && !(attrs.passwordConfirm)) {
                    err.errors.push({
                        field: "passwordConfirm",
                        rejectedValue: "Blank",
                        message: "Please confirm your password."
                    });
                }
                if (attrs.password && (attrs.password !== attrs.passwordConfirm)) {
                    err.errors.push({
                        field: "password",
                        rejectedValue: "Blank",
                        message: "Passwords do not match."
                    });
                }
            }
            var roles = this.get("authorities").models;
            var i;
            var systemAdmin;
            var interpreter;
            for (i = 0; i < roles.length; i++) {
                if (roles[i].get("id") == 1) {
                    systemAdmin = true;
                }
                if (roles[i].get("id") == 6) {
                    interpreter = true;
                }
            }
            if (!systemAdmin) {
                if (!attrs.company || !(attrs.company.id)) {
                    err.errors.push({
                        field: "company",
                        rejectedValue: "Blank",
                        message: "A company is required"
                    });
                }
                if (!attrs.primaryCompany || !(attrs.primaryCompany.id)) {
                    err.errors.push({
                        field: "primaryCompany",
                        rejectedValue: "Blank",
                        message: "A primary company is required"
                    });
                }
            }
            if (roles.length === 0) {
                err.errors.push({
                    field: "authorities",
                    rejectedValue: "Blank",
                    message: "Please select a role for this user"
                });
            }
            if (interpreter) {
                if (!attrs.interpreter || !(attrs.interpreter.id)) {
                    err.errors.push({
                        field: "interpreterList",
                        rejectedValue: "Blank",
                        message: "Please select an interpreter"
                    });
                }
            }
            if (!attrs.username) {
                err.errors.push({
                    field: "username",
                    rejectedValue: "Blank",
                    message: "A username is required"
                });
            }
            if (!attrs.firstName) {
                err.errors.push({
                    field: "firstName",
                    rejectedValue: "Blank",
                    message: "A first name is required"
                });
            }
            if (!attrs.lastName) {
                err.errors.push({
                    field: "lastName",
                    rejectedValue: "Blank",
                    message: "A last name is required"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },
        isInternal: function () {

            var role = _.find(this.get("authorities").models, function (m) {
                return m.get("friendlyName") == "Internal";
            });

            return role ? true : false;

        },
        isCustomer: function () {

            var role = _.find(this.get("authorities").models, function (m) {
                return m.get("friendlyName") == "Customer";
            });

            return role ? true : false;

        },
        isInterpreter: function () {

            var role = _.find(this.get("authorities").models, function (m) {
                return m.get("friendlyName") == "Interpreter";
            });

            return role ? true : false;

        }
    });

    // invoice
    //$.core.Invoice = $.core.BaseRelationalModel.extend({
    $.core.Invoice = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "customer",
                "company",
                "document"
            ];
        },

        defaults: App.dict.defaults.invoice,
        url: function () {
            //return this.id ? App.config.context + '/api/company/' + App.config.company.id + '/invoice/' + this.id : App.config.context + '/api/company/' + App.config.company.id + '/invoice';
            return this.id ? App.config.context + '/api/invoice/' + this.id : App.config.context + '/api/invoice';
        },
        /*
         idAttribute: 'id',
         relations: [{
         type: Backbone.HasMany,
         key: 'payableItems',
         relatedModel: '$.core.PayableItem'
         }],
         */
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            // validate payable items
            $.common.validateCollection(this.get("receivables"), err);


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.InvoiceCreditMemo = $.core.Invoice.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "customer",
                "company",
                "document",
                "parent"
            ];
        },

        defaults: App.dict.defaults.invoiceCreditMemo,
        url: function () {
            //return this.id ? App.config.context + '/api/company/' + App.config.company.id + '/invoice/' + this.id : App.config.context + '/api/company/' + App.config.company.id + '/invoice';
            return this.id ? App.config.context + '/api/invoiceCreditMemo/' + this.id : App.config.context + '/api/invoiceCreditMemo';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // payment
    //$.core.Payment = Backbone.RelationalModel.extend({
    $.core.Payment = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "interpreter",
                "company",
                "document"
            ];
        },
        defaults: App.dict.defaults.payment,
        url: function () {
            //return this.id ? App.config.context + '/api/company/' + App.config.company.id + '/invoice/' + this.id : App.config.context + '/api/company/' + App.config.company.id + '/invoice';
            return this.id ? App.config.context + '/api/payment/' + this.id : App.config.context + '/api/payment';
        },
        /*idAttribute: 'id',
         relations: [{
         type: Backbone.HasMany,
         key: 'payables',
         relatedModel: '$.core.PayableItem'
         }],*/
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            // validate payable items
            $.common.validateCollection(this.get("payables"), err);


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // paymentCreditMemo
    $.core.PaymentCreditMemo = $.core.Payment.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "interpreter",
                "company",
                "document",
                "parent"
            ];
        },

        defaults: App.dict.defaults.paymentCreditMemo,
        url: function () {
            //return this.id ? App.config.context + '/api/company/' + App.config.company.id + '/payment/' + this.id : App.config.context + '/api/company/' + App.config.company.id + '/payment';
            return this.id ? App.config.context + '/api/paymentCreditMemo/' + this.id : App.config.context + '/api/paymentCreditMemo';
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // payable item
    //$.core.PayableItem = Backbone.RelationalModel.extend({
    $.core.PayableItem = $.core.BaseModel.extend({
        defaults: App.dict.defaults.payableItem,
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "rateType",
                "payment",
                "invoice"
            ];

        },
        urlRoot: App.config.context + "/api/payableItem/",
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (_.isUndefined(attrs.unitCost) || isNaN(attrs.unitCost)) {

                err.errors.push({
                    field: "unitCost",
                    rejectedValue: "Not a number",
                    message: "Please enter a number for the unit cost"
                });
            }

            if (_.isUndefined(attrs.quantity) || isNaN(attrs.quantity)) {

                err.errors.push({
                    field: "quantity",
                    rejectedValue: "Not a number",
                    message: "Please enter a number for the quantity"
                });
            }

            if (!attrs.description) {

                err.errors.push({
                    field: "description",
                    rejectedValue: "Required",
                    message: "Please enter a description"
                });
            }

            if (!attrs.type || !attrs.type.id) {

                err.errors.push({
                    field: "type",
                    rejectedValue: "Required",
                    message: "Please select a type"
                });
            }

            if (attrs.type && attrs.type.id == App.dict.payableItemType.serviceint.id) {

                if (!attrs.rateType || !attrs.rateType.id) {

                    err.errors.push({
                        field: "rateType",
                        rejectedValue: "Required",
                        message: "Please select a rate type"
                    });
                }

            }

            if (!attrs.onDate || !Date.fromISOString(attrs.onDate)) {

                err.errors.push({
                    field: "onDate",
                    rejectedValue: "Required",
                    message: "Please select a date"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    // incidental
    $.core.Incidental = $.core.BaseRelationalModel.extend({
        defaults: _.omit(App.dict.defaults.incidental, "class"),
        initialize: function () {
            this.entities = [
                "booking",
                "receipt"
            ];

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        },
        url: function () {

            var prefix = App.config.context + '/api';
            var url;

            // booking associated with incidental
            var bookingId = this.get("booking") ? this.get("booking").id : null;
            if (bookingId) {

                prefix += '/booking/' + bookingId;

            }
            if (this.id) {

                url = prefix + '/incidental/' + this.id;

            } else {

                url = prefix + '/incidental';
            }
            return url;
        },
        idAttribute: 'id',
        /**
         * method to set onDate and clockTimeIn on incidental if not set. this method needs
         * to be called explicitly
         * @param job
         */
        setDefaults: function (job) {
            var onDate;
            var defaultClockTimeIn;
            // set the default start time for clock incidentals
            var start, end, durationHours;

            if (job.get("uri")) {
                // assume new api
                // set the date the incidental takes place
                onDate = Date.fromISOString(job.get('expectedStartDate')); // Date.parseExact(job.get('expectedStartDate'), "yyyy-MM-ddTHH:mm:ssZ");

                if (job.get("actualStartDate") && job.get("actualEndDate")) {
                    start = Date.fromISOString(job.get('actualStartDate')); // Date.parseExact(job.get('actualStartDate'), "yyyy-MM-ddTHH:mm:ssZ");
                    end = Date.fromISOString(job.get('actualEndDate')); // Date.parseExact(job.get('actualEndDate'), "yyyy-MM-ddTHH:mm:ssZ");
                    durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                } else {
                    start = Date.fromISOString(job.get('expectedStartDate')); //Date.parseExact(job.get('expectedStartDate'), "yyyy-MM-ddTHH:mm:ssZ");
                    end = Date.fromISOString(job.get('expectedEndDate')); // Date.parseExact(job.get('expectedEndDate'), "yyyy-MM-ddTHH:mm:ssZ");
                    durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                }
                // if outside 4.5 hours
                if (durationHours > 4.5) {
                    defaultClockTimeIn = start.addHours(4.5);
                } else {
                    defaultClockTimeIn = end;
                }
            } else {
                onDate = Date.parseExact(job.get('expectedStartDate'), App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

                if (job.get("actualStartDate") && job.get("actualEndDate")) {
                    start = Date.parseExact(job.get('actualStartDate'), App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);
                    end = Date.parseExact(job.get('actualEndDate'), App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);
                    durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                } else {
                    start = Date.parseExact(job.get('expectedStartDate'), App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);
                    end = Date.parseExact(job.get('expectedEndDate'), App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);
                    durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                }
                // if outside 4.5 hours
                if (durationHours > 4.5) {
                    defaultClockTimeIn = start.addHours(4.5);
                } else {
                    defaultClockTimeIn = end;
                }
            }

            this.set({
                onDate: onDate.toISOString(),
                clockTimeIn: defaultClockTimeIn.toISOString(),
                expectedStartDate: start.toISOString(), // include here for useful defaults during rendering
                expectedEndDate: end.toISOString(), // include here for useful defaults during rendering
                timeZone: job.get("timeZone") // include here for useful defaults during rendering
            });
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if ((!attrs.quantity || isNaN(attrs.quantity)) && (attrs.type && (attrs.type.name !== "Clock (Hours)" && attrs.type.name !== "Meal Break (Hours)"))) {

                err.errors.push({
                    field: "quantity",
                    rejectedValue: "Not a number",
                    message: "Please enter a number for the quantity"
                });
            }

            if (!attrs.description) {

                err.errors.push({
                    field: "description",
                    rejectedValue: "Required",
                    message: "Please enter a description"
                });
            }

            if (!attrs.type || !attrs.type.id) {

                err.errors.push({
                    field: "type",
                    rejectedValue: "Required",
                    message: "Please select a type"
                });
            }

            if (attrs.type && (attrs.type.name === "Clock (Hours)" || attrs.type.name === "Meal Break (Hours)")) {

                if (!attrs.clockTimeIn || !Date.parse(attrs.clockTimeIn)) {
                    err.errors.push({
                        field: "clockTimeInDate",
                        rejectedValue: "Blank",
                        message: "In time is required and must be a valid date."
                    });
                    err.errors.push({
                        field: "clockTimeInTime",
                        rejectedValue: "Blank",
                        message: "In time is required and must be a valid date."
                    });
                }

                if (!attrs.clockTimeOut || !Date.parse(attrs.clockTimeOut)) {
                    err.errors.push({
                        field: "clockTimeOutDate",
                        rejectedValue: "Invalid",
                        message: "Out time is required and must be a valid date."
                    });
                    err.errors.push({
                        field: "clockTimeOutTime",
                        rejectedValue: "Invalid",
                        message: "Out time is required and must be a valid date."
                    });
                }

                if (attrs.clockTimeIn && attrs.clockTimeOut && Date.parse(attrs.clockTimeIn) >= Date.parse(attrs.clockTimeOut)) {
                    err.errors.push({
                        field: "clockTimeOutDate",
                        rejectedValue: "Invalid",
                        message: "In time must be before Out time."
                    });
                    err.errors.push({
                        field: "clockTimeOutTime",
                        rejectedValue: "Invalid",
                        message: "In time must be before Out time."
                    });
                }
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // incidental
    $.core.AvailabilityType = $.core.BaseRelationalModel.extend({
        //defaults: App.dict.defaults.incidental,
        initialize: function () {
            this.entities = [
                "company"
            ];

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        },
        url: function () {

            var url;

            if (this.id) {

                url = App.config.context + '/api/availabilityType/' + this.id;

            } else {

                url = App.config.context + '/api/availabilityType';
            }
            return url;
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // region
    $.core.Region = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.region,
        url: function () {

            var prefix = App.config.context + '/api';
            var url;

            if (this.id) {

                url = prefix + '/region/' + this.id;

            } else {

                url = prefix + '/region';
            }
            return url;
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (!attrs.name) {

                err.errors.push({
                    field: "name",
                    rejectedValue: "Region Name",
                    message: "Please enter a name for the region"
                });
            }

            if (!attrs.company || !attrs.company.id) {

                err.errors.push({
                    field: "company",
                    rejectedValue: "Company",
                    message: "Company is a required field"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // TODO update this to a relational model (Company won't validate since it's a short object.
    // Is that a problem?)
    $.core.Organization = $.core.BaseModel.extend({});

    $.core.Comment = $.core.BaseModel.extend({
        defaults: App.dict.defaults.comment,
        initialize: function () {

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "interpreter",
                "customer"
            ];

        },
        urlRoot: App.config.context + "/api/comment/",
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (!attrs.body) {

                err.errors.push({
                    field: "body",
                    rejectedValue: "Body cannot be blank",
                    message: "Please enter the comment body"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });


    // collections ////////////////////////////////////////////////////////

    // base collection for pagination supporting current parameters
    $.core.BaseCollection = Backbone.PageableCollection.extend({

        // Any `state` or `queryParam` you override in a subclass will be merged with
        // the defaults in `Backbone.PageableCollection` 's prototype.
        state: {

            // You can use 0-based or 1-based indices, the default is 1-based.
            // You can set to 0-based by setting ``firstPage`` to 0.
            firstPage: 1,

            // Set this to the initial page index if different from `firstPage`. Can
            // also be 0-based or 1-based.
            currentPage: 1,

            // Required under server-mode
            totalRecords: 25,

            order: -1
        },

        // You can configure the mapping from a `Backbone.PageableCollection#state`
        // key to the query string parameters accepted by your server API.
        queryParams: {

            // `Backbone.PageableCollection#queryParams` converts to ruby's
            // will_paginate keys by default.
            currentPage: "page",
            pageSize: "rows",
            sortKey: "sidx",
            order: "sord"
        },

        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            // pageSize must be > 0
            return {
                currentPage: resp.page,
                firstPage: 1,
                lastPage: resp.total,
                pageSize: (queryParams.rows === -1 ? (resp.records === 0 ? 25 : resp.records) : queryParams.rows),
                totalPages: resp.total,
                totalRecords: resp.records
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.rows;
        },

        getFirstPage: function (opt) {
            if (opt) {
                opt.reset = true;
            } else {
                opt = {
                    reset: true
                };
            }

            return this.getPage("first", opt);
        }
    });

    // employment eligibility popup on the manage contact page
    $.core.EmploymentEligibilityCollection = $.core.BaseCollection.extend({
        model: $.core.EmploymentEligibility,
        url: App.config.context + "/api/employmentEligibility",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }

    });

    $.core.v2.EmploymentEligibilityCollection = $.core.BaseCollection.extend({
        model: $.core.v2.EmploymentEligibility,
        url: App.config.context + "/api/employmentEligibility",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }

    });

    $.core.ReferenceCodeConfigCollection = $.core.BaseCollection.extend({
        model: $.core.ReferenceCodeConfig,
        url: function () {
            return App.config.context + '/api/referenceCodeConfig';
        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.CommentCollection = $.core.BaseCollection.extend({
        model: $.core.Comment,
        url: App.config.context + "/api/comment",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.CommentCountCollection = $.core.CommentCollection.extend({
        url: App.config.context + "/api/comment/commentCount"
    });

    $.core.v2.HierarchyCollection = $.core.BaseCollection.extend({
        model: $.core.v2.EmploymentEligibility,
        url: App.config.context + "/api/employmentEligibility",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    // contacts collection
    $.core.ContactCollection = $.core.BaseCollection.extend({
        model: $.core.Contact,
        url: App.config.context + '/api/contact'
    });

    $.core.CustomerCollection = $.core.BaseCollection.extend({
        model: $.core.Customer,
        url: App.config.context + '/api/customer'
    });

    $.core.ConsumerCollection = $.core.BaseCollection.extend({
        model: $.core.Consumer,
        url: App.config.context + '/api/consumer'
    });

    $.core.CompanyCollection = Backbone.Collection.extend({
        model: $.core.Company,
        url: App.config.context + '/api/company',
        fetch: function (options) {
            options = options || {};
            options.data = options.data || {};
            options.data.rows = options.rows;
            options.data.filters = JSON.stringify(options.filters);

            return Backbone.Collection.prototype.fetch.call(this, options);
        }
    });

    $.core.BookingCollection = $.core.BaseCollection.extend({
        model: $.core.Booking,
        url: function () {
            return App.config.context + '/api/company/' + App.config.company.id + '/booking';
        }
    });

    $.core.IncidentalCollection = $.core.BaseCollection.extend({
        model: $.core.Incidental,
        initialize: function (models, options) {
            this['booking.id'] = options ? options["booking.id"] : null;
        },
        url: function () {

            if (this['booking.id']) {

                return App.config.context + '/api/booking/' + this['booking.id'] + '/incidental';

            } else {

                return App.config.context + '/api/incidental';
            }

        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.AvailabilityTypeCollection = $.core.BaseCollection.extend({
        model: $.core.AvailabilityType,

        url: function () {

            return App.config.context + '/api/availabilityType';

        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.CustomerClientLocationCollection = $.core.BaseCollection.extend({
        model: $.core.CustomerClientLocation,
        initialize: function (models, options) {
            this['requestor.id'] = options ? options["requestor.id"] : null;
        },
        url: function () {

            if (this['requestor.id']) {

                return App.config.context + '/api/requestor/' + this['requestor.id'] + '/customerClientLocation';

            } else {

                return App.config.context + '/api/customerClientLocation';
            }
        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.ClientCollection = $.core.BaseCollection.extend({
        model: $.core.Client,
        url: function () {
            return App.config.context + '/api/client';
        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },
        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.InvoiceCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },
        model: $.core.Invoice,
        url: App.config.context + "/api/invoice/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.InvoiceCreditMemoCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },
        model: $.core.InvoiceCreditMemo,
        url: App.config.context + "/api/invoiceCreditMemo/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.PaymentCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },
        model: $.core.Payment,
        url: App.config.context + "/api/payment/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.PaymentCreditMemoCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },
        model: $.core.PaymentCreditMemo,
        url: App.config.context + "/api/paymentCreditMemo/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    // payable items
    $.core.PayableItemCollection = $.core.BaseCollection.extend({
        model: $.core.PayableItem,
        initialize: function (models, options) {

            if (options) {
                this.parentEntityType = options.parentEntityType;
                this.parentEntityId = options.parentEntityId;
            }
        },
        url: function () {

            if (this.parentEntityType && this.parentEntityId) {
                return App.config.context + '/api/' + this.parentEntityType + '/' + this.parentEntityId + '/payableItem';
            } else {
                // default url
                return App.config.context + '/api/payableItem';
            }
        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    // general employment criteria (hr criteria)
    $.core.CriteriaCollection = Backbone.Collection.extend({
        model: $.core.Criteria,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
        },
        url: function () {

            var companyId = this["company.id"];

            return App.config.context + '/api/company/' + companyId + '/criteria';

        },
        fetch: preFetchInjectFilter
    });

    // customer address collection
    $.core.CustomerAddressCollection = $.core.BaseCollection.extend({
        model: $.core.CustomerAddress,
        initialize: function (models, options) {
            //this['customer.id'] = options['customer.id'];
            //this['parent.id'] = options['parent.id'];
        },
        url: function () {
            var url = App.config.context + '/api/address?';
            return url;
        }
    });

    // document collection
    $.core.DocumentCollection = Backbone.Collection.extend({
        model: $.core.Document,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
            this.parentEntityType = options.parentEntityType;
            this.parentEntityId = options.parentEntityId;
        },
        url: function () {

            return App.config.context + '/api/company/' + this["company.id"] + '/' + this.parentEntityType + '/' + this.parentEntityId + '/document';

        },
        fetch: preFetchInjectFilter
    });

    // report collection
    $.core.ReportCollection = Backbone.Collection.extend({
        model: $.core.Document,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
            if (options) {
                this['customer.id'] = options["customer.id"];
            }
        },
        url: function () {

            if (this["customer.id"]) {

                return App.config.context + '/api/company/' + this["company.id"] + '/customer/' + this["customer.id"] + '/report';

            } else {

                return App.config.context + '/api/company/' + this["company.id"] + '/report';
            }

        },
        fetch: preFetchInjectFilter
    });

    $.core.QualificationCollection = Backbone.Collection.extend({
        model: $.core.Qualification,
        url: function () {

            var contactId = this.get("contact.id");

            return '/api/contact/' + contactId + '/qualification';
        },
        fetch: preFetchInjectFilter
    });

    $.core.SmsTemplateCollection = Backbone.Collection.extend({
        model: $.core.SmsTemplate,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
        },
        url: function () {
            var companyId = this["company.id"];

            return this.id ? App.config.context + '/api/company/' + companyId + '/template/sms/' + this.id : App.config.context + '/api/company/' + companyId + '/template/sms';
        },
        fetch: preFetchInjectFilter
    });

    $.core.TemplateCollection = Backbone.Collection.extend({
        model: $.core.EmailTemplate,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
        },
        url: function () {

            var companyId = this["company.id"];
            return App.config.context + '/api/company/' + companyId + '/template/email';
        },
        fetch: preFetchInjectFilter
    });

    $.core.BackboneMessageCollection = Backbone.Collection.extend({
        model: $.core.Message,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
            this.audience = options.audience;
            this.audienceId = options['audience.id'];
            this.listAll = options.listAll ? "/" + options.listAll : "";
        },
        url: function () {
            if (this.audience) {
                return App.config.context + '/api/company/' + this["company.id"] + '/' + this.audience + '/' + this.audienceId + '/message';
            } else {
                return App.config.context + '/api/company/' + this["company.id"] + '/message' + this.listAll;
            }
        }
    });

    // message collection
    $.core.MessageCollection = $.core.BaseCollection.extend({
        model: $.core.Message,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
            this.audience = options.audience;
            this.audienceId = options['audience.id'];
            this.listAll = options.listAll ? "/" + options.listAll : "";
        },
        url: function () {
            if (this.audience) {
                return App.config.context + '/api/company/' + this["company.id"] + '/' + this.audience + '/' + this.audienceId + '/message';
            } else {
                return App.config.context + '/api/company/' + this["company.id"] + '/message' + this.listAll;
            }
        },

        state: {
            firstPage: 1,
            currentPage: 1,
            totalRecords: 25,
            pageSize: 5,
            order: -1,
            unread: 0
        },

        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize,
                unread: resp.unread
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.ContactMessageCollection = $.core.BaseCollection.extend({
        model: $.core.ContactMessage,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
            this.audience = options.audience;
            this.audienceId = options['audience.id'];
        },

        url: function () {
            return App.config.context + '/api/company/' + this["company.id"] + '/contactMessage';
        },

        state: {
            firstPage: 1,
            currentPage: 1,
            totalRecords: 25,
            pageSize: 5,
            order: -1,
            unread: 0
        },

        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize,
                unread: resp.unread
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    // holiday collection
    $.core.HolidayCollection = Backbone.Collection.extend({
        model: $.core.Holiday,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
        },
        url: function () {

            return App.config.context + '/api/company/' + this["company.id"] + '/holiday';
        },
        fetch: preFetchInjectFilter
    });

    // cancellation reason collection
    $.core.CancellationReasonCollection = Backbone.Collection.extend({
        model: $.core.CancellationReason,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
        },
        url: function () {

            return App.config.context + '/api/company/' + this["company.id"] + '/cancellation';
        },
        fetch: preFetchInjectFilter
    });

    // unfulfilled reason collection
    $.core.UnfulfilledReasonCollection = Backbone.Collection.extend({
        model: $.core.UnfulfilledReason,
        url: function () {

            return App.config.context + '/api/unfulfilledReason';
        },
        fetch: preFetchInjectFilter
    });

    // action group collection
    $.core.ActionGroupCollection = Backbone.Collection.extend({
        model: $.core.ActionGroup,
        initialize: function (models, options) {
            this['company.id'] = App.config.company.id;
        },
        url: function () {

            return App.config.context + '/api/company/' + this["company.id"] + '/actiongroup';
        },
        fetch: preFetchInjectFilter
    });

    $.core.BusinessUnitCollection = $.core.BaseCollection.extend({
        model: $.core.BusinessUnit,
        url: App.config.context + "/api/businessUnit",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.UserCollection = $.core.BaseCollection.extend({ //Backbone.Collection.extend({

        model: $.core.User,
        url: App.config.context + '/api/user',

        /*initialize: function(options) {

         options || (options = {});
         this.rows = (options.rows ? options.rows : 25);
         this.filters = (options.filters ? options.filters : {});
         },*/
        fetch: preFetchInjectFilter,
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.OrganizationCollection = $.core.BaseCollection.extend({
        model: $.core.Organization,
        url: App.config.context + '/api/organization',
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    // regions
    $.core.RegionCollection = $.core.BaseCollection.extend({
        model: $.core.Region,
        url: App.config.context + '/api/region',
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });


    // =======================================
    // v2-api
    if (!$.booking) $.booking = {};
    if (!$.booking.v2) $.booking.v2 = {};
    if (!$.visit) $.visit = {};
    if (!$.visit.v2) $.visit.v2 = {};

    // **** Models      ****
    // mixin the booking state interface
    //$.booking.v2.BookingModel = Backbone.Model.extend($.app.mixins.BookingStateMixin);

    $.core.JobOfferModel = $.core.BaseModel.extend({
        initialize: function () {
            _.extend(this, $.app.mixins.jobOfferStateMixin);
        },

        urlRoot: App.config.context + "/api/joboffer/",

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];
        }
    });

    $.booking.v2.BookingModel = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "bookingMode",
                "bookingType",
                "location",
                "subLocation",
                "billingLocation",
                "locationOneOffAddress",
                "company",
                "customer",
                "billingCustomer",
                "client",
                "requestor",
                "language",
                "genderRequirement"
            ];

            // Associations represent 1 to many associations. They are loaded as string
            // URLs in the json api, and in turn in the backbone model
            this.associations = [
                "bookings",
                "refs",
                "requirements"
            ];
        },

        urlRoot: App.config.context + "/api/superBooking/",

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.customer || !attrs.customer.id) {
                err.errors.push({
                    field: "customer-select",
                    rejectedValue: "Blank",
                    message: "You must select a customer."
                });
            }
            //used to be free text requestor field
            if ((!attrs.requestor || !attrs.requestor.id) && !attrs.customRequestor) {
                if (attrs.requestor && attrs.requestor.label) {
                    err.errors.push({
                        field: "customRequestor",
                        rejectedValue: "Blank",
                        message: "Please input a custom new requestor."
                    });
                } else {
                    err.errors.push({
                        field: "requestor-select",
                        rejectedValue: "Blank",
                        message: "Please select or create a new requestor."
                    });
                }
            }
            if (!attrs.language || !attrs.language.id) {
                err.errors.push({
                    field: "language-select",
                    rejectedValue: "Blank",
                    message: "You must select the language."
                });
            }
            if ((!attrs.location || !attrs.location.id) && !attrs.customLocation) {
                if (attrs.location && attrs.location.label) {
                    err.errors.push({
                        field: "customLocation",
                        rejectedValue: "Blank",
                        message: "You must input the custom service location."
                    });
                } else {
                    err.errors.push({
                        field: "location-select",
                        rejectedValue: "Blank",
                        message: "You must select the service location."
                    });
                }
            }
            if (!attrs.billingLocation || !attrs.billingLocation.id) {
                err.errors.push({
                    field: "billingLocation-select",
                    rejectedValue: "Blank",
                    message: "You must select the location requesting service."
                });
            }
            if (!attrs.bookingMode || !attrs.bookingMode.id) {
                err.errors.push({
                    field: "bookingMode",
                    rejectedValue: "Blank",
                    message: "The interpretation type is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },

        isClosed: function () {
            var status = this.get("status");

            if (status && status.id) {
                if (App.dict.bookingStatus.closed.id === status.id || App.dict.bookingStatus.cancelled.id === status.id || App.dict.bookingStatus.nonattendance.id === status.id || App.dict.bookingStatus.declined.id === status.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        isOpen: function () {
            var status = this.get("status");

            if (status && status.id) {
                if (App.dict.bookingStatus['new'].id == status.id || App.dict.bookingStatus.open.id == status.id || App.dict.bookingStatus.offered.id == status.id || App.dict.bookingStatus.assigned.id == status.id || App.dict.bookingStatus.confirmed.id == status.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    });

    // **** Models       ****
    $.visit.v2.InterpreterVisitModel = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
            _.extend(this, $.app.mixins.interpreterVisitStateMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "interpreter",
                "paymentStatus",
                "invoiceStatus",
                "language",
                "cancellationReason",
                "customerRatePlan",
                "contactRatePlan",
                "visit"
            ];
        },

        urlRoot: App.config.context + "/api/booking/",

        parse: function (resp, xhr) {
            // TODO: why is this necessary? seems to read and set the same value. guess is that it's needed on financial review page
            var attrs = resp;
            if (this.get("bookingDate")) {
                attrs.bookingDate = this.get("bookingDate");
            }
            return attrs;
        },

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            /*
             if (!attrs.expectedStartDate) {
             err.errors.push({
             field: "startDate",
             rejectedValue: "Blank",
             message: "The start date is required."
             });
             err.errors.push({
             field: "startTime",
             rejectedValue: "Blank",
             message: "The start time is required."
             });
             }
             */

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },

        isClosed: function () {
            var status = this.get("status");

            if (status && status.id) {
                if (App.dict.bookingStatus.closed.id === status.id || App.dict.bookingStatus.cancelled.id === status.id || App.dict.bookingStatus.nonattendance.id === status.id || App.dict.bookingStatus.declined.id === status.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        isOpen: function () {
            var status = this.get("status");

            if (status && status.id) {
                if (App.dict.bookingStatus['new'].id == status.id || App.dict.bookingStatus.open.id == status.id || App.dict.bookingStatus.offered.id == status.id || App.dict.bookingStatus.assigned.id == status.id || App.dict.bookingStatus.confirmed.id == status.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    });

    /**
     * extended object to provide custom validation for closing.
     *
     * TODO: how to avoid bad data here overwriting the good data if the close does not go through
     */
    $.visit.v2.InterpreterVisitCloseModel = $.core.BaseModel.extend({

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            /*
             if (!attrs.expectedStartDate) {
             err.errors.push({
             field: "startDate",
             rejectedValue: "Blank",
             message: "The start date is required."
             });
             err.errors.push({
             field: "startTime",
             rejectedValue: "Blank",
             message: "The start time is required."
             });
             }
             */

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },

        isClosed: function () {
            var status = this.get("status");

            if (status && status.id) {
                if (App.dict.bookingStatus.closed.id === status.id || App.dict.bookingStatus.cancelled.id === status.id || App.dict.bookingStatus.nonattendance.id === status.id || App.dict.bookingStatus.declined.id === status.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        isOpen: function () {
            var status = this.get("status");

            if (status && status.id) {
                if (App.dict.bookingStatus['new'].id == status.id || App.dict.bookingStatus.open.id == status.id || App.dict.bookingStatus.offered.id == status.id || App.dict.bookingStatus.assigned.id == status.id || App.dict.bookingStatus.confirmed.id == status.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    });


    $.booking.v2.VisitModel = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "status",
                "superBooking",
                "company",
                "cancellationReason"
            ];

            this.associations = [
                "interpreterVisits"
            ];
        },
        urlRoot: App.config.context + "/api/visit/",

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.timeZone) {
                err.errors.push({
                    field: "timeZone",
                    rejectedValue: "Blank",
                    message: "The time zone cannot be blank."
                });
            }
            if (attrs.bookingDate === undefined) {
                err.errors.push({
                    field: "bookingDate",
                    rejectedValue: "Incorrect Format",
                    message: "Please enter the booking date in the correct " + App.config.company.config.dateFormat + " format."
                });
            } else if (!attrs.bookingDate) {
                err.errors.push({
                    field: "bookingDate",
                    rejectedValue: "Blank",
                    message: "The booking date is required."
                });
                err.errors.push({
                    field: "bookingTime",
                    rejectedValue: "Blank",
                    message: "The booking time is required."
                });
            }
            if (attrs.expectedStartDate === undefined) {
                err.errors.push({
                    field: "expectedStartDate",
                    rejectedValue: "Incorrect Format",
                    message: "Please enter the start date in the correct " + App.config.company.config.dateFormat + " format."
                });
            } else if (!attrs.expectedStartDate) {
                err.errors.push({
                    field: "expectedStartDate",
                    rejectedValue: "Blank",
                    message: "The start date is required."
                });
                err.errors.push({
                    field: "expectedStartTime",
                    rejectedValue: "Blank",
                    message: "The start time is required."
                });
            }
            if (!attrs.expectedEndDate) {
                err.errors.push({
                    field: "expectedDurationHrs",
                    rejectedValue: "Blank",
                    message: "Please specify the duration."
                });
                err.errors.push({
                    field: "expectedDurationHrs",
                    rejectedValue: "Blank",
                    message: "Please enter a number for duration. (e.g.) 2.5 for 2 hours 30 minutes"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.IvrCallModel = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "job",
                "company"
            ];

            // Associations represent 1 to many associations. They are loaded as string
            // URLs in the json api, and in turn in the backbone model
            this.associations = [];
        },

        urlRoot: App.config.context + "/api/ivrCall/",

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.IvrCallStepModel = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "ivrCall",
                "company"
            ];

            // Associations represent 1 to many associations. They are loaded as string
            // URLs in the json api, and in turn in the backbone model
            this.associations = [];
        },

        urlRoot: App.config.context + "/api/ivrCallStep/",

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.IvrCallSessionModel = $.core.BaseModel.extend({
        idAttribute: 'session',

        initialize: function (attributes, options) {
            _.extend(this, $.app.mixins.ivrCallActionMixin);
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.companyUuid = options ? options.companyUuid : null;
            this.entities = ["job"];
            this.associations = [];
        },

        urlRoot: function () {
            debugger;
            // TODO: make consistent with videoSessionModel
            if (this.companyUuid) {
                return App.config.context + "/api/" + this.companyUuid + "/ivrCall";
            } else {
                return App.config.context + "/api/ivrCall";
            }
        },

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            }
        },

        /**
         * return session identifier to be used to connect
         * @returns {*}
         */
        getSessionIdentifier: function () {
            return this.get("session");
        }
    });

    $.core.IvrCallAction = $.core.BaseModel.extend({

        idAttribute: "session",

        initialize: function (attributes, options) {

            $.core.BaseModel.prototype.initialize.call(this, attributes, options);

            this.session = options.ivrCall.session;
            // set the booking model
            this.ivrCall = options.ivrCall;

            // bind to event handlers
            this.listenTo(this, 'error', this.handleError);
            this.listenTo(this, 'invalid', this.handleError);
            this.listenTo(this, 'sync', this.handleSuccess);
        },

        urlRoot: function () {
            // id must always be present
            return App.config.context + '/api/ivrCall';
        },

        // override save to pull in required attributes from booking
        save: function (attrs, options) {
            // collect attributes before saving
            this.collectAttributes(attrs, options);
            return Backbone.Model.prototype.save.call(this, attrs, options);
        },

        handleError: function (model, response) {
            console.log("error", model, response);
            this.ivrCall.trigger('invalid', this.ivrCall, response);
        },

        handleSuccess: function (model, response) {
            console.log("success", model, response);
            // refetch the booking to ensure the status is picked up correctly
            this.ivrCall.fetch();
        },

        handleChange: function () {
            console.log("change", arguments);
        }
    });

    $.core.IvrCallCancelAction = $.core.IvrCallAction.extend({

        collectAttributes: function () {

            this.set({
                action: "cancel",
                reason: this.attributes.reason,
                session: this.ivrCall.get("session"),
                company: this.ivrCall.get("company")
            });
            // TODO: why do we have to set this here?
            this.ivrCall.set("reason", this.attributes.reason);
        },

        validate: function (attrs) {

            // do validation
            attrs = this.ivrCall.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the voice session before canceling"
                });
            }

            if (!attrs.reason) {
                err.errors.push({
                    field: "reason",
                    rejectedValue: "Blank",
                    message: "A reason is required to cancel the voice session."
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.IvrCallCloseAction = $.core.IvrCallAction.extend({

        collectAttributes: function () {

            this.set({
                action: "close",
                session: this.ivrCall.get("session"),
                company: this.ivrCall.get("company")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.ivrCall.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the voice session before closing"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.IvrCallAssignAction = $.core.IvrCallAction.extend({

        collectAttributes: function () {

            this.set({
                action: "assign",
                session: this.ivrCall.get("session"),
                company: this.ivrCall.get("company")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.ivrCall.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the voice session before closing"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.IvrCallRateAction = $.core.IvrCallAction.extend({

        collectAttributes: function () {

            this.set({
                action: "rate",
                score: this.ivrCall.get("score"),
                comments: this.ivrCall.get("comments"),
                session: this.ivrCall.get("session"),
                company: this.ivrCall.get("company")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.ivrCall.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the voice session before closing"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.IvrCallRequestAction = $.core.IvrCallAction.extend({

        collectAttributes: function () {

            this.set({
                action: "request",
                reason: this.attributes.reason,
                session: this.ivrCall.get("session"),
                company: this.ivrCall.get("company")
            });
        },

        validate: function (attrs) {}

    });

    $.core.IvrCallDisconnectAction = $.core.IvrCallAction.extend({

        collectAttributes: function () {

            this.set({
                action: "disconnect",
                reason: this.attributes.reason,
                session: this.ivrCall.get("session"),
                company: this.ivrCall.get("company")
            });
        },

        validate: function (attrs) {}

    });

    $.core.TwilioTaskRouterEventCollectionModel = $.core.BaseCollection.extend({
        initialize: function (models, options) {
            this.sessionUuid = options.sessionUuid;
            this.queryParams.sord = "desc";
            this.queryParams.sidx = "timestampMs";
            this.companyUuid = options ? options.companyUuid : null;
        },
        url: function () {
            return App.config.context + "/api/" + this.companyUuid + "/videoSession/" + this.sessionUuid + "/twilio-events";

        },
        model: function (attrs, options) {
            return new Backbone.Model(attrs, options);
        },

        parseRecords: function (resp, options) {
            return resp.events;
        },

        comparator: function (model) {
            return model.get("timestampMs");
        }
    });

    $.core.TwilioTokensModel = $.core.BaseModel.extend({

        getVideoToken: function (opts) {
            new $.core.TwilioVideoTokenModel().fetch(opts);
        },

        getVoiceToken: function (opts) {
            new $.core.TwilioVoiceTokenModel().fetch(opts);
        },

        getChatToken: function (opts) {
            new $.core.TwilioChatTokenModel().fetch(opts);
        }

    });

    $.core.TwilioVideoTokenModel = $.core.BaseModel.extend({
        url: App.config.context + "/api/twilio/tokens/video"
    });

    $.core.TwilioVoiceTokenModel = $.core.BaseModel.extend({
        url: App.config.context + "/api/twilio/tokens/voice"
    });

    $.core.TwilioChatTokenModel = $.core.BaseModel.extend({
        url: App.config.context + "/api/twilio/tokens/chat"
    });

    $.core.TwilioChatChannelModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/twilio/chat-channels",

        factory: function (attrs) {
            new $.core.TwilioChatChannelFactoryModel().fetch({
                data: attrs.data,
                success: function (model) {
                    attrs.success(new $.core.TwilioChatChannelModel(model.attributes));
                }
            });
        },

        touch: function (attrs) {
            new $.core.TwilioChatChannelTouchAction({
                id: this.id
            }).save();
        },

        fetchByUniqueName: function (uniqueName) {
            var model = this;
            this.fetch({
                data: {
                    filters: new $.filterbuilder
                        .init()
                        .add({
                            field: 'uniqueName',
                            op: 'eq',
                            data: uniqueName
                        })
                        .toString()
                },
                success: function (resp) {
                    if (!model.set(model.parse(resp.get("items")[0]))) return false;
                    model.trigger('sync', model, resp);
                }
            });
        }
    });

    $.core.TwilioChatChannelCollection = $.core.BaseCollection.extend({
        model: $.core.TwilioChatChannelModel,
        url: App.config.context + "/api/twilio/chat-channels",
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.TwilioChatChannelFactoryModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/twilio/chat-channels/factory"
    });

    $.core.TwilioChatChannelTouchAction = $.core.BaseModel.extend({
        url: function () {
            return App.config.context + "/api/twilio/chat-channels/" + this.id + "/touch";
        },

        initialize: function (options) {
            this.id = options.id;
        }
    });

    $.core.TwilioIdentityMappingModel = $.core.BaseModel.extend({

        urlRoot: function () {
            return App.config.context + "/api/twilio/identity-mapping";
        },

        register: function (opts) {
            var options = {
                url: this.urlRoot() + "/" + App.config.userData.uuid,
                type: 'POST'
            };
            _.extend(options, opts);
            return Backbone.sync.call(this, null, this, options);
        },

        registerInvited: function (opts) {
            var options = {
                url: this.urlRoot() + "/invited/" + this.uuidv4(),
                type: 'POST',
                contentType: "application/json; charset=utf-8"
            };
            _.extend(options, opts);
            return Backbone.sync.call(this, null, this, options);
        },

        uuidv4: function () {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            });
        },

        updateMappings: function (uuids, options) {
            var that = this;

            var diff = _.filter(uuids, function (uuid) {
                return Object.keys(that.mapping || {}).indexOf(uuid) === -1;
            });

            if (diff.length > 0) {
                var action = new $.core.TwilioIdentityMappingMapAction();
                return action.fetch({
                    data: {
                        uuids: diff.join(",")
                    },
                    success: function (mapping) {
                        that.mapping = _.extend((that.mapping || {}), mapping.toJSON());

                        if (options && options.success) {
                            options.success(that.mapping);
                        }
                    }
                });
            } else {
                if (options && options.success) {
                    options.success(this.mapping);
                }
            }
        },

        internalUsersIdentities: function (options) {
            new $.core.TwilioIdentityMappingGetInternalUsersAction()
                .fetch({
                    success: function (identity) {
                        if (options && options.success) {
                            options.success(identity);
                        }
                    }
                });
        }

    });

    $.core.TwilioIdentityMappingMapAction = $.core.BaseModel.extend({

        urlRoot: function () {
            return App.config.context + "/api/twilio/identity-mapping/identities-map";
        }

    });

    $.core.TwilioIdentityMappingGetInternalUsersAction = Backbone.Collection.extend({
        url: App.config.context + "/api/twilio/identity-mapping/internal-user-mappings",
        model: $.core.TwilioIdentityMappingModel
    });

    /**
     * model to encapsulate on demand remote request for vri / opi
     */
    $.core.OnDemandRemoteRequestModel = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [];
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.language || !attrs.language.id || !attrs.language.iso639_3Tag) {
                err.errors.push({
                    field: "language",
                    rejectedValue: "Blank",
                    message: "The language is required."
                });
            }

            if (!attrs.customer || !attrs.customer.id || !attrs.customer.uuid) {
                err.errors.push({
                    field: "customer",
                    rejectedValue: "Blank",
                    message: "The customer is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.VideoSessionModel = $.core.BaseModel.extend({

        idAttribute: 'session',

        initialize: function (attributes, options) {

            this.companyUuid = options ? options.companyUuid : null;
            this.createRoom = options ? options.createRoom : null;

            // this.videoUserType = options.videoUserType;
            console.log("VideoSession model init. opts", options);

            _.extend(this, $.app.mixins.videoSessionActionMixin);

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "job" //,
                //"company"
            ];

            // Associations represent 1 to many associations. They are loaded as string
            // URLs in the json api, and in turn in the backbone model
            this.associations = [];
        },

        urlRoot: function () {
            //App.config.context + "/api/e13471ba-db27-4615-86ff-fe70e7d87cc8/videoSession/";
            return App.config.context + "/api/" + this.companyUuid + "/videoSession/";
        },

        url: function () {
            var url = this.urlRoot();

            if (this.id) {
                url += this.id;
            }

            if (this.createRoom) {
                url += "?createRoom=" + this.createRoom;
            }

            return url;
        },

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },

        /**
         * return session identifier to be used to connect the room.
         *
         * in the case of vri the session identifier is the team session rather than the
         * session itself, which is unique per interpreter.
         *
         * @returns {*}
         */
        getSessionIdentifier: function () {
            // always use team session uuid for video
            if (!this.get("teamSession")) {
                console.log("WARNING. teamSession is null");
            }
            return this.get("teamSession");
        }
    });

    // models to support state transitions
    $.core.VideoSessionAction = $.core.BaseModel.extend({

        idAttribute: "session",

        initialize: function (attributes, options) {

            $.core.BaseModel.prototype.initialize.call(this, attributes, options);

            this.session = options.videoSession.session;
            // set the booking model
            this.videoSession = options.videoSession;

            // bind to event handlers
            this.listenTo(this, 'error', this.handleError);
            this.listenTo(this, 'invalid', this.handleError);
            this.listenTo(this, 'sync', this.handleSuccess);
        },

        urlRoot: function () {
            // id must always be present
            return App.config.context + '/api/' + this.videoSession.get("company") + '/videoSession/status';
        },

        // override save to pull in required attributes from booking
        save: function (attrs, options) {
            console.log("VideoSessionAction.save attrs:", attrs);
            console.log("VideoSessionAction.save options:", options);
            // collect attributes before saving
            this.collectAttributes(attrs, options);
            return Backbone.Model.prototype.save.call(this, attrs, options);
        },

        handleError: function (model, response) {
            console.log("error", model, response);
            this.videoSession.trigger('invalid', this.videoSession, response);
        },

        handleSuccess: function (model, response) {
            console.log("success", model, response);
            // refetch the booking to ensure the status is picked up correctly
            this.videoSession.fetch();
        },

        handleChange: function () {
            console.log("change", arguments);
        }
    });

    $.core.VideoSessionCancelAction = $.core.VideoSessionAction.extend({

        collectAttributes: function () {

            this.set({
                action: "cancel",
                reason: this.attributes.reason,
                session: this.videoSession.get("session"),
                company: this.videoSession.get("company")
            });
            // TODO: why do we have to set this here?
            this.videoSession.set("reason", this.attributes.reason);
        },

        validate: function (attrs) {

            // do validation
            attrs = this.videoSession.attributes;
            console.log("CancelAction. attrs:", attrs);

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the video session before canceling"
                });
            }

            if (!attrs.reason) {
                err.errors.push({
                    field: "reason",
                    rejectedValue: "Blank",
                    message: "A reason is required to cancel the video session."
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.VideoSessionCloseAction = $.core.VideoSessionAction.extend({

        collectAttributes: function () {

            this.set({
                action: "close",
                session: this.videoSession.get("session"),
                company: this.videoSession.get("company")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.videoSession.attributes;
            console.log("CloseAction. attrs:", attrs);

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the video session before closing"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.VideoSessionStartAction = $.core.VideoSessionAction.extend({

        collectAttributes: function () {

            this.set({
                action: "start",
                session: this.videoSession.get("session"),
                company: this.videoSession.get("company")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.videoSession.attributes;
            console.log("StartAction. attrs:", attrs);

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the video session before starting"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.VideoSessionAssignAction = $.core.VideoSessionAction.extend({

        collectAttributes: function () {

            this.set({
                action: "assign",
                session: this.videoSession.get("session"),
                company: this.videoSession.get("company")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.videoSession.attributes;
            console.log("AssignAction. attrs:", attrs);

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the video session before closing"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.VideoSessionRateAction = $.core.VideoSessionAction.extend({

        collectAttributes: function () {

            this.set({
                action: "rate",
                score: this.videoSession.get("score"),
                comments: this.videoSession.get("comments"),
                session: this.videoSession.get("session"),
                company: this.videoSession.get("company")
            });
        },

        validate: function (attrs) {

            // do validation
            attrs = this.videoSession.attributes;

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.session) {
                err.errors.push({
                    field: "session",
                    rejectedValue: "Blank",
                    message: "Please save the video session before closing"
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        }

    });

    $.core.VideoSessionRequestAction = $.core.VideoSessionAction.extend({

        collectAttributes: function () {

            this.set({
                action: "request",
                reason: this.attributes.reason,
                session: this.videoSession.get("session"),
                company: this.videoSession.get("company")
            });
        },

        validate: function (attrs) {}

    });

    $.core.VideoSessionDisconnectAction = $.core.VideoSessionAction.extend({

        collectAttributes: function () {

            this.set({
                action: "disconnect",
                session: this.videoSession.get("session"),
                company: this.videoSession.get("company")
            });
        },

        validate: function (attrs) {}

    });

    $.core.SavedSearchModel = $.core.BaseModel.extend({
        initialize: function () {
            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "company"
            ];

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
            _.extend(this, $.app.mixins.jobStateMixin);

            this.associations = [];
        },
        urlRoot: App.config.context + "/api/savedSearch/",
        idAttribute: 'id',
        ruleToDescription: function (rule, negation) {
            var desc = rule.friendlyName;

            if (negation) {
                if (rule.type === App.dict.savedsearchmodel.types.booleanType) {
                    desc += ' is not';
                } else {
                    desc += ' does not ' + App.dict.savedsearchmodel.operations[rule.op];
                }
            } else {
                desc += ' ' + App.dict.savedsearchmodel.operations[rule.op];
            }

            desc += ' \"' + rule.data + '\"';
            return desc;
        },
        groupToDescription: function (group) {
            var desc = '';

            if (group.rules) {
                var op = group.groupOp;
                var that = this;

                group.rules.forEach(function (rule, index) {
                    var notOperator = op === App.dict.querycomponent.groupOp.NOT.id;

                    if (rule.rules) {
                        desc += (notOperator ? 'not ' : '') + that.groupToDescription(rule);
                    } else {
                        desc += that.ruleToDescription(rule, notOperator);
                    }

                    if (!notOperator) {
                        desc += index + 1 === group.rules.length ? '' : ' ' + op + ' ';
                    }
                });
            }

            return desc;
        },
        description: function () {
            var filters = this.get('filters');
            var operator = filters.groupOp;
            var description = this.groupToDescription(filters, operator);

            return description.length > 0 ? description.charAt(0).toUpperCase() + description.slice(1).toLowerCase() : '';
        },
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "You must specify a name."
                });
            }

            if (!attrs.endpoint) {
                err.errors.push({
                    field: "endpoint",
                    rejectedValue: "Blank",
                    message: "The saved query must include an endpoint to be valid."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.BookingOfferedState = $.core.BookingState.extend({
        initialize: function (attributes, options) {
            $.core.BookingState.prototype.initialize.call(this, attributes, options);
            this.offers = options.offers;
        },

        collectAttributes: function () {
            this.set({
                action: "offered",
                offers: this.offers
            });
        }
    });

    /**
     * new job model.
     * mix of new json collections and relational collection for refs / requirements
     * @type {*}
     */
    $.core.JobModel = $.core.BaseRelationalModel.extend({ //Backbone.Model.extend({
        initialize: function () {
            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "status",
                "superBooking",
                "company",
                "cancellationReason",
                "unfulfilledReason",
                "customer",
                "billingCustomer",
                "billingLocation",
                "location",
                "subLocation",
                "requestor",
                "bookingMode",
                "genderRequirement",
                "consumer",
                "preferredInterpreter",
                "bookingType",
                "customerRatePlan",
                "contactRatePlan"
            ];

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
            _.extend(this, $.app.mixins.jobStateMixin);

            this.associations = [
                "interpreterVisits",
                "refs",
                "requirements"
            ];
        },
        urlRoot: App.config.context + "/api/visit/",
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'refs',
            relatedModel: '$.booking.v2.ReferenceModel' //'$.core.BookingReference'
        }, {
            type: Backbone.HasMany,
            key: 'requirements',
            relatedModel: '$.booking.v2.RequirementModel' //'$.core.BookingCriteria'
        }, {
            type: Backbone.HasMany,
            key: 'consumers',
            relatedModel: '$.core.Consumer'
        }],
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.customer || !attrs.customer.id) {
                err.errors.push({
                    field: "customer-select",
                    rejectedValue: "Blank",
                    message: "You must select a customer for service."
                });
            }

            if (!attrs.billingCustomer || !attrs.billingCustomer.id) {
                err.errors.push({
                    field: "billing-customer-select",
                    rejectedValue: "Blank",
                    message: "You must select a customer for billing purposes."
                });
            }

            if (!attrs.client || !attrs.client.id) {
                err.errors.push({
                    field: "client-select",
                    rejectedValue: "Blank",
                    message: "You must select a client."
                });
            }

            if (attrs.validateConsumer && (!attrs.consumer && !attrs.customConsumer)) {
                if (!attrs.consumer) {
                    err.errors.push({
                        field: "consumer-select",
                        rejectedValue: "Blank",
                        message: "You must input a consumer ."
                    });
                } else {
                    err.errors.push({
                        field: "customConsumer",
                        rejectedValue: "Blank",
                        message: "Please input other Consumer."
                    });
                }
            }

            //used to be free text requestor field
            if ((!attrs.requestor || !attrs.requestor.id) && !attrs.customRequestor) {
                if (attrs.requestor && attrs.requestor.label) {
                    err.errors.push({
                        field: "customRequestor",
                        rejectedValue: "Blank",
                        message: "Please input a custom new requestor."
                    });
                } else {
                    err.errors.push({
                        field: "requestor-select",
                        rejectedValue: "Blank",
                        message: "Please select or create a new requestor."
                    });
                }
            }
            if (!attrs.language || !attrs.language.id) {
                err.errors.push({
                    field: "language-select",
                    rejectedValue: "Blank",
                    message: "You must select the language."
                });
            }

            if ((!attrs.location || !attrs.location.id) && (!attrs.customLocationPostalCodeValid && (typeof google != "undefined") /* enforce check if google available */ )) {
                if (attrs.location && attrs.location.label) {
                    err.errors.push({
                        field: "customLocation",
                        rejectedValue: "Blank",
                        message: "You must input the custom service location or validate the postal code of the other location."
                    });
                } else {
                    err.errors.push({
                        field: "location-select",
                        rejectedValue: "Blank",
                        message: "You must select the service location or validate the postal code of the other location."
                    });
                }
            }
            if (attrs.sublocationsEnabled && (!attrs.subLocation || !attrs.subLocation.id)) {
                err.errors.push({
                    field: "sublocation-select",
                    rejectedValue: "Blank",
                    message: "You must select the sublocation."
                });
            }
            if (!attrs.billingLocation || !attrs.billingLocation.id) {
                err.errors.push({
                    field: "billingLocation-select",
                    rejectedValue: "Blank",
                    message: "Please ensure the customer has a valid billing address setup on their customer profile. You must select the location requesting service."
                });
            }
            if (!attrs.bookingMode || !attrs.bookingMode.id) {
                err.errors.push({
                    field: "bookingMode",
                    rejectedValue: "Blank",
                    message: "The interpretation type is required."
                });
            }

            if (!attrs.timeZone) {
                err.errors.push({
                    field: "timeZone",
                    rejectedValue: "Blank",
                    message: "The time zone cannot be blank."
                });
            }
            if (attrs.bookingDate === undefined) {
                err.errors.push({
                    field: "bookingDate",
                    rejectedValue: "Incorrect Format",
                    message: "Please enter the booking date in the correct " + App.config.company.config.dateFormat + " format."
                });
            } else if (!attrs.bookingDate) {
                err.errors.push({
                    field: "bookingDate",
                    rejectedValue: "Blank",
                    message: "The booking date is required."
                });
                err.errors.push({
                    field: "bookingTime",
                    rejectedValue: "Blank",
                    message: "The booking time is required."
                });
            }
            if (attrs.expectedStartDate === undefined) {
                err.errors.push({
                    field: "expectedStartDate",
                    rejectedValue: "Incorrect Format",
                    message: "Please enter the start date in the correct " + App.config.company.config.dateFormat + " format."
                });
            } else if (!attrs.expectedStartDate) {
                err.errors.push({
                    field: "expectedStartDate",
                    rejectedValue: "Blank",
                    message: "The start date is required."
                });
                err.errors.push({
                    field: "expectedStartTime",
                    rejectedValue: "Blank",
                    message: "The start time is required."
                });
            }
            if (!attrs.expectedEndDate) {
                err.errors.push({
                    field: "expectedDurationHrs",
                    rejectedValue: "Blank",
                    message: "Please specify the duration."
                });
                err.errors.push({
                    field: "expectedDurationMins",
                    rejectedValue: "Blank",
                    message: "Please select hours and minutes for duration."
                });
            }

            if (attrs.requiredMinimumDuration && attrs.expectedStartDate && attrs.expectedEndDate) {
                // validate that minimum duration is above the required
                var startDate = Date.fromISOString(attrs.expectedStartDate);
                var endDate = Date.fromISOString(attrs.expectedEndDate);
                var differenceMinutes = (endDate - startDate) / 1000 /* milliseconds */ / 60 /* seconds */ ;
                if (differenceMinutes < attrs.requiredMinimumDuration) {
                    err.errors.push({
                        field: "duration", // field name is not specific to avoid highlighting error as the subsequent call updates the duration
                        rejectedValue: "Less Than Required Minimum",
                        message: "The duration of the job must be at least " + attrs.requiredMinimumDuration + " minutes. The duration has been updated accordingly."
                    });

                    // set the expected end date to be at least the minimum
                    endDate = startDate.addMinutes(attrs.requiredMinimumDuration); // * 1000 * 60);
                    this.set({
                        "expectedEndDate": endDate.toISOString()
                    }, {
                        silent: true
                    });
                    this.trigger("updateDuration");
                }
            }

            //validate references
            $.common.validateCollection(this.get("refs"), err);
            //validate requirements
            $.common.validateCollection(this.get("requirements"), err);

            if (err.errors.length > 0) {
                return err;
            } else if (!attrs.ignoreExpectedStartDatePastDate && _.isNull(attrs.id) /* ensure we only check this for new models */ ) {
                var now = new Date();
                var esd = new Date.fromISOString(attrs.expectedStartDate);
                if (now > esd) {
                    err.status = 412;
                    err.code = 412;
                    err.message = "<p>The start date entered is in the past.</p><p>Are you sure you wish to continue?";
                    return err;
                }
            } else {
                //do nothing
            }
        }
    });

    $.core.ReferenceCodeAutoCompleteModel = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.referenceCodeAutoComplete,
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.entities = [
                "company",
                "customer",
                "config"
            ];
        },
        relations: [{
            type: Backbone.HasMany,
            key: 'criteria',
            relatedModel: '$.config.AutoCompleteCriteriaConfig'
        }],
        url: function () {
            return this.id ? App.config.context + '/api/referenceCodeAutoComplete/' + this.id : App.config.context + '/api/referenceCodeAutoComplete';
        },
        idAttribute: 'id',

        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.value) {
                err.errors.push({
                    field: "value",
                    rejectedValue: "Blank",
                    message: "You must specify a value"
                });
            }

            $.common.validateCollection(this.get("criteria"), err);
            $.common.validateCollection(this.get("referenceCodeConfigs"), err);

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    //$.booking.v2.ReferenceModel = Backbone.Model.extend({
    $.booking.v2.ReferenceModel = $.core.BaseRelationalModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.entities = [
                "company",
                "superBooking",
                "config",
                "customer",
                "autoComplete",
                "consumer"
            ];
        },
        urlRoot: App.config.context + "/api/referenceCode/",
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "You must specify a reference name"
                });
            }

            if (!attrs.ref) {
                err.errors.push({
                    field: "ref",
                    rejectedValue: "Blank",
                    message: "You must specify a reference value"
                });
            }

            //if the reference is from configured field, check validation
            if (attrs.config) {
                var config = attrs.config;

                //check for instance of here to avoid JS error after save
                if (config.regEx) {
                    ///^([a-z0-9]{5,})$/.test('abc1');
                    var regEx = new RegExp(config.regEx);

                    //test the value entered
                    if (!regEx.test(attrs.ref)) {
                        err.errors.push({
                            field: "ref",
                            rejectedValue: "Invalid reference",
                            message: "The reference you entered is not valid."
                        });
                    }
                }
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    //$.booking.v2.RequirementModel = Backbone.Model.extend({
    $.booking.v2.RequirementModel = $.core.BaseRelationalModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.entities = [
                "company",
                "superBooking",
                "criteria",
                "config"
            ];
        },
        urlRoot: App.config.context + "/api/bookingCriteria/",
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.criteria || !attrs.criteria.id) {
                // console.log("Criteria is ", attrs.criteria);
                err.errors.push({
                    field: "criteria",
                    rejectedValue: "Blank",
                    message: "You must specify a requirement"
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    $.core.CompanyPayableItemTypeModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/companyPayableItemType/",
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "payableItemType",
                "ratePlan"
            ];

        }
    });

    $.core.VolumePriceTierModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/volumePriceTier/",
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "bookingMode",
                "ratePlan"
            ];

        }
    });

    $.core.PayableItemTypeModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/payableItemType/",
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [];

        }
    });

    $.core.BookingModeModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/bookingMode/",
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [];

        }
    });

    // **** Collections ****
    $.booking.v2.VisitCollection = $.core.BaseCollection.extend({
        model: $.booking.v2.VisitModel,
        url: App.config.context + "/api/visit/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.JobOfferCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.JobOfferModel,
        url: App.config.context + "/api/joboffer/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.booking.v2.BookingCollection = $.core.BaseCollection.extend({
        model: $.booking.v2.BookingModel,
        url: App.config.context + "/api/superBooking/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.visit.v2.InterpreterVisitCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.visit.v2.InterpreterVisitModel,
        url: App.config.context + "/api/booking/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.IvrCallCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.IvrCallModel,

        url: App.config.context + "/api/ivrCall/",

        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.IvrCallStepCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.IvrCallStepModel,

        url: App.config.context + "/api/ivrCallStep/",

        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.VideoSessionCollection = $.core.BaseCollection.extend({
        initialize: function (models, options) {

            this.companyUuid = options ? options.companyUuid : null;

            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.VideoSessionModel,

        //url: App.config.context + "/api/e13471ba-db27-4615-86ff-fe70e7d87cc8/videoSession/",

        url: function () {
            // App.config.context + "/api/e13471ba-db27-4615-86ff-fe70e7d87cc8/videoSession/",
            return App.config.context + "/api/" + this.companyUuid + "/videoSession/";
        },

        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.SavedSearchCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.SavedSearchModel,
        url: App.config.context + "/api/savedSearch/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.DoubleBookingInvoice = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: Backbone.Model,
        url: App.config.context + "/api/invoice/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.DoubleBookingPayment = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: Backbone.Model,
        url: App.config.context + "/api/payment/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.booking.v2.ReferenceCollection = $.core.BaseCollection.extend({
        model: $.booking.v2.ReferenceModel,
        url: App.config.context + "/api/referenceCode/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.ReferenceCodeAutoCompleteCollection = $.core.BaseCollection.extend({
        model: $.core.ReferenceCodeAutoCompleteModel,
        initialize: function (models, options) {
            this['config.id'] = options ? options["config.id"] : null;
        },
        url: function () {

            if (this['config.id']) {

                return App.config.context + '/api/referenceCodeConfig/' + this['config.id'] + '/referenceCodeAutoComplete';

            } else {

                return App.config.context + '/api/referenceCodeAutoComplete';
            }

        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.BookingRequirementsCollection = $.core.BaseCollection.extend({
        model: $.booking.v2.RequirementModel,

        initialize: function (models, options) {
            this.url = options && options.url;
        },

        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.booking.v2.RequirementCollection = $.core.BaseCollection.extend({
        model: $.booking.v2.RequirementModel,
        url: App.config.context + "/api/bookingCriteria/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.NotificationCollection = $.core.BaseCollection.extend({
        initialize: function (models, options) {
            if (options) {
                if (options.parentEntityType) {
                    this.parentEntityType = options.parentEntityType;
                }

                if (options.parentEntityId) {
                    this.parentEntityId = options.parentEntityId;
                }
            }
        },

        url: function () {
            if (this.parentEntityType && this.parentEntityId) {
                return App.config.context + "/api/" + this.parentEntityType + "/" + this.parentEntityId + "/notification";
            } else {
                return App.config.context + "/api/notification";
            }
        },

        state: {
            firstPage: 1,
            currentPage: 1,
            totalRecords: 25,
            pageSize: 5,
            order: -1
        },

        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.CompanyPayableItemTypeCollection = $.core.BaseCollection.extend({
        model: $.core.CompanyPayableItemTypeModel,
        url: App.config.context + "/api/companyPayableItemType/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.VolumePriceTierCollection = $.core.BaseCollection.extend({
        model: $.core.VolumePriceTierModel,
        url: App.config.context + "/api/volumePriceTier/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.PayableItemTypeCollection = $.core.BaseCollection.extend({
        model: $.core.PayableItemTypeModel,
        url: App.config.context + "/api/payableItemType/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.BookingModeCollection = $.core.BaseCollection.extend({
        model: $.core.BookingModeModel,
        url: App.config.context + "/api/bookingMode/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.CompanyServiceCollection = $.core.BaseCollection.extend({
        model: $.core.BookingModeModel,
        url: App.config.context + "/api/companyService/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });


    $.core.AsyncTaskModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/asynctask/",

        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "document"
            ];
        }
    });

    // **** Collection ****
    $.core.AsyncTaskCollection = $.core.BaseCollection.extend({
        model: $.core.AsyncTaskModel,
        url: App.config.context + "/api/asynctask/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.ExclusionModel = $.core.BaseModel.extend({
        urlRoot: function () {
            return App.config.context + "/api/exclusion";
        },
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        }
    });

    $.core.PreferenceModel = $.core.BaseModel.extend({
        urlRoot: function () {
            return App.config.context + "/api/preference";
        },
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        }
    });

    $.core.ExclusionAddModel = $.core.BaseModel.extend({
        initialize: function (models, options) {
            if (options) {
                this.set({
                    parentEntityType: options.parentEntityType,
                    parentEntityId: options.parentEntityId
                });
            }
        },
        url: function () {
            return App.config.context + "/api/" + this.get('parentEntityType') + "/" + this.get('parentEntityId') + "/exclusion";
        }
    });

    $.core.PreferenceAddModel = $.core.BaseModel.extend({
        initialize: function (models, options) {
            if (options) {
                this.set({
                    parentEntityType: options.parentEntityType,
                    parentEntityId: options.parentEntityId
                });
            }
        },
        url: function () {
            return App.config.context + "/api/" + this.get('parentEntityType') + "/" + this.get('parentEntityId') + "/preference";
        }
    });


    $.core.ExclusionCollection = $.core.BaseCollection.extend({
        model: $.core.ExclusionModel,
        initialize: function (models, options) {
            this.parentEntityType = options.parentEntityType;
            this.parentEntityId = options.parentEntityId;
            this.exclusionFilter = options.exclusionFilter;
        },
        url: function () {
            return App.config.context + "/api/" + this.parentEntityType + "/" + this.parentEntityId + "/" + this.exclusionFilter;
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.PreferenceCollection = $.core.ExclusionCollection.extend({
        model: $.core.PreferenceModel
    });


    $.core.AssignmentCriteria = $.core.BaseModel.extend({
        urlRoot: function () {
            return App.config.context + "/api/customer/" + this.get("customer.id") + "/assignmentCriteria";
        },
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        }
    });

    $.core.AssignmentCriteriaAdd = $.core.BaseModel.extend({
        initialize: function (models, options) {
            if (options) {
                this.set({
                    parentEntityType: options.parentEntityType,
                    parentEntityId: options.parentEntityId
                });
            }
        },
        url: function () {
            return App.config.context + "/api/" + this.get('parentEntityType') + "/" + this.get('parentEntityId') + "/assignmentCriteria";
        }
    });

    $.core.AssignmentCriteriaCheck = $.core.BaseModel.extend({
        initialize: function (models, options) {
            if (options) {
                this.customerId = options.customerId;
                this.configId = options.configId;
            }
        },
        url: function () {
            return App.config.context + "/api/customer/" + this.customerId + "/config/" + this.configId + "/enableAssignment";
        }
    });

    $.core.AssignmentCriteriaOperator = $.core.BaseModel.extend({
        initialize: function (models, options) {
            if (options) {
                this.customerId = options.customerId;
                this.configId = options.configId;
            }
        },
        url: function () {
            return App.config.context + "/api/customer/" + this.customerId + "/config/" + this.configId + "/assignmentOperator";
        }
    });

    $.core.AssignmentCriteriaCollection = $.core.BaseCollection.extend({
        model: $.core.AssignmentCriteria,
        initialize: function (models, options) {
            this.parentEntityType = options.parentEntityType;
            this.parentEntityId = options.parentEntityId;
        },
        url: function () {
            return App.config.context + "/api/" + this.parentEntityType + "/" + this.parentEntityId + "/assignmentCriteria";
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.CriteriaChild = $.core.BaseRelationalModel.extend({});

    $.core.InvalidEmploymentEligibilityCollection = $.core.BaseCollection.extend({
        model: $.core.EmploymentEligibility,
        url: function () {
            return App.config.context + "/api/contact/" + App.config.interpreter.id + "/invalidEligibilities";
        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }

    });

    $.core.ContactNonAvailableRange = $.core.BaseModel.extend({
        initialize: function () {
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        },
        url: function () {
            if (this.get("id"))
                return App.config.context + "/api/contact/" + this.get("interpreter").id + "/nonAvailableRange/" + this.get("id");
            else
                return App.config.context + "/api/contact/" + this.get("interpreter").id + "/nonAvailableRange";
        },
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.startDate || !Date.parse(attrs.startDate)) {
                err.errors.push({
                    field: "startDate",
                    rejectedValue: "Blank",
                    message: "Start date is required and must be a valid date."
                });
            }

            if (!attrs.endDate || !Date.parse(attrs.endDate)) {
                err.errors.push({
                    field: "endDate",
                    rejectedValue: "Invalid",
                    message: "End date is required and must be a valid date."
                });
            }

            if (!attrs.type) {
                err.errors.push({
                    field: "type",
                    rejectedValue: "Blank",
                    message: "Type is required."
                });
            }

            if (attrs.startDate && attrs.endDate && Date.parse(attrs.startDate) >= Date.parse(attrs.endDate)) {
                err.errors.push({
                    field: "endDate",
                    rejectedValue: "Invalid",
                    message: "Start date must be before end date."
                });
            }

            // call invalid on error and return
            if (err.errors.length > 0) {
                return err;
            } else {
                // do nothing
            }
        },
        /**
         * convert date UTC to timezone of user
         * TODO: is this necessary? similar function on templateHelpers?
         * @param date
         * @returns {Date}
         */
        getUserDate: function (date) {
            return new Date(date.getTime() - (new timezoneJS.Date(date, App.config.userData.timeZone)).getTimezoneOffset() * 60000);
        },

        /**
         * convert date UTC to timezone of user
         * TODO: is this necessary? similar function on templateHelpers?
         * @param date
         * @returns {Date}
         */
        getDate: function (date) {
            return new Date(date.getTime() + (new timezoneJS.Date(date, App.config.userData.timeZone)).getTimezoneOffset() * 60000);
        },

        /**
         * convert date UTC to timezone of browser
         * TODO: is this necessary? similar function on templateHelpers?
         * @param date
         * @returns {Date}
         */
        getBrowserDate: function (date) {
            return new Date(date.getTime() - (new timezoneJS.Date(date)).getTimezoneOffset() * 60000);
        },

        /**
         * marshall from availability range to calendar event for display
         * NOTE: this is for FullCalendar 1.4. Does not work for 2+
         * @returns {{id: *, title: string, start: (*|Date), end: (*|Date), allDay: *, color: *, type: *}}
         */
        toCalendarEvent: function () {

            var title = this.get("type") ? this.get("type").name : "";
            if (title.length > 0) {
                title += this.get("notes") ? ": " + this.get("notes") : "";
            } else {
                title = this.get("notes") ? this.get("notes") : "";
            }
            if (title.length > 25) {
                title = title.substring(0, 22);
                title += "...";
            }
            return {
                id: this.get("_fullCalendarId"),
                title: title,
                start: this.getUserDate(Date.parse(this.get("startDate"))), //Date.parse(nonAvailableModel.get("startDate")).setTimezone(nonAvailableModel.get("timezone") ? nonAvailableModel.get("timezone") : App.config.userData.timeZone),
                end: this.getUserDate(Date.parse(this.get("endDate"))), //Date.parse(nonAvailableModel.get("endDate")).setTimezone(nonAvailableModel.get("timezone") ? nonAvailableModel.get("timezone") : App.config.userData.timeZone),
                allDay: this.get("allDay"),
                color: this.get("type") ? this.get("type").colorHex : "",
                type: this.get("type")
            };
        },
        /**
         * marshall from calendar event to update model attributes
         * NOTE: this is for FullCalendar 1.4. Does not work for 2+
         * @param event
         */
        fromCalendarEvent: function (event) {
            // set new start date
            if (event.start) {
                this.set("startDate", this.getBrowserDate(this.getDate(event.start)));
            }

            // set new end date
            if (event.end) {
                var endDate;
                if (event.allDay) {
                    endDate = new Date(event.end.getTime());
                    endDate.setSeconds(59);
                    endDate.setMinutes(59);
                    endDate.setHours(23);
                } else {
                    endDate = this.getBrowserDate(this.getDate(event.end));
                }
                this.set("endDate", endDate);
            }
        }
    });

    $.core.ContactNonAvailableRangeCollection = $.core.BaseCollection.extend({
        model: $.core.ContactNonAvailableRange,
        initialize: function (models, options) {
            this.contactId = options.contactId;
        },
        url: function () {
            return App.config.context + "/api/contact/" + this.contactId + "/nonAvailableRange";
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.AvailabilityModel = $.core.BaseModel.extend({
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "type"
            ];
        },
        urlRoot: function () {
            if (App.config.interpreter.id) {
                return App.config.context + '/api/contact/' + App.config.interpreter.id + '/availability';
            } else {
                return App.config.context + '/api/availability';
            }
        },
        /**
         * marshall the model to an event to display on calendar
         * NOTE: this is for FullCalendar 1.4. Does not work for 2+
         */
        toCalendarEvent: function () {

            // get sunday midnight browser time
            var sundayMidnightLocal = this.getSundayMidnight();
            // get sunday midnight in user timezone
            var sundayMidnightAdjusted = new Date(sundayMidnightLocal.getTime() - (new timezoneJS.Date(new Date(), App.config.userData.timeZone)).getTimezoneOffset() * 60000);
            var start;
            // if the offset is not 0, get the adjusted time
            // if it's 0, it means they're in line with the local sunday time and we don't need to adjust
            if (this.get("offset") !== 0) {
                start = new Date(sundayMidnightAdjusted.getTime() + this.get("offset") * 60000);
            } else {
                start = new Date(sundayMidnightLocal.getTime() + this.get("offset") * 60000);
            }
            var weekAdjustment = 0;
            if (start.getTime() < sundayMidnightLocal.getTime()) {
                weekAdjustment = 10080; // minutes in week;
            }
            start = new Date(start.getTime() + (start.getTimezoneOffset() - sundayMidnightAdjusted.getTimezoneOffset() + weekAdjustment) * 60000);
            var end = new Date(start.getTime() + this.get("length") * 60000);
            end = new Date(end.getTime() + (end.getTimezoneOffset() - start.getTimezoneOffset()) * 60000);

            // set title if available
            var title = this.get("type") ? this.get("type").name : "";
            if (title.length > 0) {
                title += this.get("notes") ? ": " + this.get("notes") : "";
            } else {
                title = this.get("notes") ? this.get("notes") : "";
            }
            // truncate title for display
            if (title.length > 25) {
                title = title.substring(0, 22);
                title += "...";
            }
            return {
                id: this.get("_fullCalendarId"),
                title: title,
                start: start,
                end: end,
                allDay: false,
                color: this.get("type") ? this.get("type").colorHex : ""
            };
        },

        /**
         * marshall from a calendar event to a model
         * NOTE: this is for FullCalendar 1.4. Does not work for 2+
         */
        fromCalendarEvent: function (evt) {

            // get date in local time on Sunday midnight
            var sundayMidnightLocal = this.getSundayMidnight();
            // convert local Sunday midnight to UTC
            var sundayMidnightAdjusted = new Date(sundayMidnightLocal.getTime() - (new timezoneJS.Date(new Date(), App.config.userData.timeZone)).getTimezoneOffset() * 60000);
            var length;
            if (evt.end) {
                length = this.getDuration(evt.start, evt.end);
            } else {
                length = 1440;
            }
            var offset = (this.getDuration(sundayMidnightAdjusted, evt.start)) % 10080; // 10080 minutes in a week.
            if (offset < 0) {
                offset = (this.getDuration(sundayMidnightLocal, evt.start)) % 10080; // 10080 minutes in a week.
            }

            this.set({
                "length": length,
                "offset": offset
            });
        },

        /**
         * get date at Sunday midnight
         * @returns {Date}
         */
        getSundayMidnight: function () {
            var d = new Date();
            // get day of month - day of the week to get last Sunday
            d.setDate(d.getDate() - d.getDay());
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        },

        /**
         * get duration in minutes
         * @param start
         * @param end
         * @returns {number}
         */
        getDuration: function (start, end) {
            return (end - start) / 60000 + start.getTimezoneOffset() - end.getTimezoneOffset();
        }
    });

    $.core.AvailabilityCollection = $.core.BaseCollection.extend({
        url: function () {
            return App.config.context + '/api/contact/' + App.config.interpreter.id + '/availability';
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        },

        model: $.core.AvailabilityModel
    });

    $.core.ContactAvailabilityRanges = $.core.BaseModel.extend({
        urlRoot: function () {
            return App.config.context + "/api/customer/" + this.get("customer.id") + "/assignmentCriteria";
        },
        initialize: function () {
            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        }
    });

    $.core.ContactAvailabilityCollection = $.core.BaseCollection.extend({
        model: $.core.ContactAvailabilityRanges,
        url: function () {
            var startDate = this.startDate ? this.startDate.toISOString() : new Date().toISOString();
            var endDate = this.endDate ? this.endDate.toISOString() : startDate;
            if (this.contactId) {
                return App.config.context + '/api/contact/' + this.contactId + '/availabilityRanges?startDate=' + startDate + '&endDate=' + endDate;
            } else {
                return App.config.context + '/api/company/' + this.companyId + '/contactAvailabilityRanges?startDate=' + startDate + '&endDate=' + endDate;
            }
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },
        parseRecords: function (resp, options) {
            return resp.items;
        },
        initialize: function (models, options) {
            this.contactId = options.contactId;
            this.companyId = options.companyId;
        },
        setContactId: function (contactId) {
            this.contactId = contactId;
        },
        setStartDate: function (startDate) {
            this.startDate = startDate;
        },
        setEndDate: function (endDate) {
            this.endDate = endDate;
        }
    });

    $.core.MultipleContactAvailabilityCollection = $.core.BaseCollection.extend({
        model: $.core.AvailabilityModel,
        url: function () {
            return App.config.context + '/api/availability';
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.MultipleContactNonAvailabilityRangeCollection = $.core.BaseCollection.extend({
        model: $.core.ContactNonAvailableRange,
        url: function () {
            return App.config.context + '/api/nonAvailability';
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.ContactAvailabilityFilter = $.core.BaseModel.extend({
        initialize: function () {
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        }
    });

    $.core.ScheduledReport = $.core.BaseRelationalModel.extend({
        //defaults: App.dict.defaults.scheduledReport,
        url: function () {
            return this.id ? App.config.context + '/api/scheduledReport/' + this.id : App.config.context + '/api/scheduledReport/';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasOne,
            key: 'reportInformation',
            relatedModel: '$.core.ReportInformation'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            }
        }
    });

    $.core.ScheduledReportCollection = $.core.BaseCollection.extend({
        model: $.core.ScheduledReport,
        url: function () {
            return App.config.context + '/api/scheduledReport';
        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.ReportInformation = $.core.BaseRelationalModel.extend({
        defaults: App.dict.defaults.reportInformation,

        url: function () {
            return this.id ? App.config.context + '/api/reportInformation/' + this.id : App.config.context + '/api/reportInformation/';
        },
        idAttribute: 'id',

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            }
        }
    });

    $.core.ReportInformationCollection = $.core.BaseCollection.extend({
        model: $.core.ReportInformation,
        url: App.config.context + '/api/reportInformation',
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.DeactivationReason = $.core.BaseModel.extend({
        urlRoot: function () {
            return App.config.context + '/api/company/' + App.config.company.id + "/deactivation/";
        },
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Deactivation reason is required."
                });
            }

            if (err.errors.length > 0) {
                return err;
            }
        }
    });

    $.core.DeactivationReasonCollection = $.core.BaseCollection.extend({
        model: $.core.DeactivationReason,
        initialize: function () {
            this['company.id'] = App.config.company.id;
        },
        url: function () {
            return App.config.context + '/api/company/' + this["company.id"] + '/deactivation';
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.StatusEvent = $.core.BaseModel.extend({
        urlRoot: function () {
            return App.config.context + "/api/interpreter/" + this.get("interpreter").id + "/statusEvent";
        }
    });

    $.core.StatusEventCollection = $.core.BaseCollection.extend({
        model: $.core.StatusEvent,
        initialize: function (options) {
            this.interpreterId = options.interpreterId;
        },
        url: function () {
            return App.config.context + "/api/interpreter/" + this.interpreterId + "/statusEvent";
        },
        parseState: function (resp) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        parseRecords: function (resp) {
            return resp.items;
        }
    });

    $.core.ChangeStatusModel = $.core.BaseModel.extend({
        initialize: function () {
            _.extend(this, $.app.mixins.stubObjectModelMixin);
        },
        url: function () {
            return App.config.context + "/api/interpreter/" + this.get("interpreter").id + "/changeStatus";
        }
    });


    $.core.AttributeSelection = $.core.BaseCollection.extend({
        model: Backbone.Model,
        initialize: function (options) {
            this.onlySQL = options.onlySQL;
        },
        url: function () {
            return App.config.context + '/api/company/' + App.config.company.id + '/booking/export/fields/' + this.onlySQL;
        },
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.Assessment = $.core.BaseModel.extend({
        urlRoot: function () {
            return App.config.context + "/api/assessment/";
        }
    });

    $.core.AssessmentsCollection = $.core.BaseCollection.extend({
        model: $.core.Assessment,
        url: function () {
            return App.config.context + "/api/assessment/";
        },
        parseState: function (resp) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        parseRecords: function (resp) {
            return resp.items;
        }
    });

    $.core.ExportWithRangeModel = $.core.BaseModel.extend({
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.from_date || attrs.from_date === "") {
                err.errors.push({
                    field: "from_date",
                    rejectedValue: "Blank",
                    message: "You must select a From Date."
                });
            }

            if (!attrs.to_date || attrs.to_date === "") {
                err.errors.push({
                    field: "to_date",
                    rejectedValue: "Blank",
                    message: "You must select a To Date."
                });
            }

            if (err.errors.length > 0) {
                return err;
            }
        }
    });

    $.core.IvrRecordingModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/ivrRecording",

        validate: function (attrs) {

        }
    });

    $.core.IvrRecordingCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.IvrRecordingModel,

        url: App.config.context + "/api/ivrRecording/",
        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.ContactWorkerModel = $.core.BaseRelationalModel.extend({ //Backbone.Model.extend({
        initialize: function (attributes, options) {
            this.options = options || {};
            // Entities represent 1-1 associations. They are loaded as subobject stubs
            // in the json api, and in turn in the backbone model
            this.entities = [
                "company",
                "interpreter"
            ];

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);
            _.extend(this, $.app.mixins.jobStateMixin);

            this.associations = [];

            // collection backing availability status widget
            this.availabilityStatusCollection = new Backbone.Collection();
        },
        urlRoot: App.config.context + "/api/contactWorker/",
        idAttribute: 'id',
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },
        initializeWorker: function (options) {

            var that = this;

            // set the options passed in
            _.extend(this.options, options);
            console.log("initializeWorker. options", this.options);

            this.workerClient = new Twilio.TaskRouter.Worker(this.get("workerToken") /* workerToken */ , true, App.config.twilio.activities.idle /* connect */ , null /*WFA_UNAVAILABLE*/ /* disconnect */ , true);

            // register reservation event handlers
            this.workerClient.on("ready", function (worker) {
                LOG("Worker ready.");
                console.log("worker ready", worker);
                that.set({
                    "contact_uri": worker.attributes.contact_uri
                });
                that.setAvailabilityStatus(worker);
                that.trigger("workerReady", worker);
            });
            this.workerClient.on("activity.update", function (worker) {
                LOG("Activity update. Availability: " + worker.available);
                that.setAvailabilityStatus(worker);
                that.trigger("availabilityChanged", worker);
            });
            this.workerClient.on("attributes.update", function (worker) {
                LOG("Attributes update.");
                that.setAvailabilityStatus(worker);
            });
            this.workerClient.on("capacity.update", function (channel) {
                LOG("Capacity update: ", channel);
            });
            this.workerClient.on("reservation.created", function (reservation) {
                that.reservationCreated(reservation);
            });
            this.workerClient.on("reservation.accepted", function (reservation) {
                that.reservationAccepted(reservation);
            });
            this.workerClient.on("reservation.rejected", function (reservation) {
                that.reservationRejected(reservation);
            });
            this.workerClient.on("reservation.timeout", function (reservation) {
                that.reservationTimeout(reservation);
            });
            this.workerClient.on("reservation.canceled", function (reservation) {
                that.reservationCanceled(reservation);
            });
            this.workerClient.on("reservation.rescinded", function (reservation) {
                that.reservationRescinded(reservation);
            });
            this.workerClient.on("reservation.completed", function (reservation) {
                that.trigger("reservationCompleted", reservation);
            });
            this.workerClient.on("token.expired", function () {
                LOG("Worker token expired.");
            });
            this.workerClient.on("connected", function () {
                LOG("Worker connected.");
            });
            this.workerClient.on("disconnected", function () {
                LOG("Worker disconnected.");
            });
            this.workerClient.on("error", function () {
                LOG("Worker websocket error.");
            });

            // make unavailable initially
            //this.makeUnavailable();
            // set blank attributes initially
            // TODO: get either client name, phone number on interpreter profile or phone number entered by terp
            //this.makeAvailable({
            //"contact_uri": "+14152166677"
            //"contact_uri": "client:conor"
            //});

            //
            // setup Twilio client for calls
            // Twilio.Device.setup(this.options.clientToken, {
            // sounds: {
            //     incoming: App.config.context + "/sounds/mystic_call.mp3"//,
            //     // outgoing: 'http://mysite.com/outgoing.mp3',
            //     // dtmf8: 'http://mysite.com/funny_noise.mp3'
            // }
            // });

            // Twilio.Device.audio.incoming( false );

            // Twilio.Device.ready(function (device) {
            // The device is now ready
            // console.log("Twilio.Device is now ready for connections");
            // });

            // Twilio.Device.offline(function (device) {
            // The device is now ready
            // console.log("Twilio.Device is no longer online");
            // });
            // Twilio.Device.incoming(function (connection) {

            // console.log("Twilio.Device incoming call");

            // show incoming call view and make available for later clean up
            // this.incomingCallView = new $.vri.IncomingCallView({
            //     connection: connection,
            //     envContext: that.options.envContext,
            //     company: that.options.company,
            //     companyConfig: that.options.companyConfig
            // });
            // this.incomingCallView.render();
            // });
            // Twilio.Device.cancel(function (connection) {
            // The device is now ready
            // console.log("Twilio.Device cancel");
            // });
            // Twilio.Device.connect(function (connection) {
            // The device is now ready
            // console.log("Twilio.Device connect");
            // });
        },

        setAvailabilityStatus: function (worker) {

            var that = this;

            // update the model with properties
            this.set({
                "available": worker.available,
                "activityName": worker.activityName,
                "workerSid": worker.sid
            });

            //
            // worker.attributes definition
            //
            // attributes: {
            //     "company": "uuid",
            //     "contact_uri": "uri/phone",
            //     "env": "conorp",
            //     "languages": ["iso", "iso"],
            //     "modes": ["phone", "video"]
            // }

            if (worker.attributes && worker.attributes.languages) {

                that.availabilityStatusCollection.reset();

                _.each(worker.attributes.languages, function (language) {

                    // with issue with modes, add both if phone / video enabled
                    _.each(worker.attributes.modes, function (mode) {

                        // hard code to video for now
                        // ignore modes
                        var availabilityStatus = new Backbone.Model({
                            mode: mode,
                            language: {
                                description: language,
                                iso639_3Tag: language
                            },
                            status: "available"
                        });

                        that.availabilityStatusCollection.add(availabilityStatus);
                    });

                });
            }
        },

        makeAvailable: function (callbacks) {
            console.log("makeAvailable. ", this);
            var activity = new $.core.ContactWorkerUpdateAction({
                activitySid: App.config.twilio.activities.idle,
                workerSid: this.get("workerSid") || this.get("sid"),
                contact_uri: this.get("contact_uri"),
                overflowLocationKey: this.overflowLocationKey
            }, callbacks);
            var that = this;
            console.log("cw avail:", activity);
            return activity.save(null, {
                success: function (savedModel) {
                    that.set("available", savedModel.get("available"));
                    that.set("activityName", savedModel.get("activity_name"));
                    that.set("activitySid", savedModel.get("activity_sid"));
                }
            });
        },

        makeUnavailable: function (callbacks) {
            console.log("makeUnAvailable. ", this);
            var activity = new $.core.ContactWorkerUpdateAction({
                activitySid: App.config.twilio.activities.offline,
                workerSid: this.get("workerSid") || this.get("sid"),
                contact_uri: this.get("contact_uri"),
                overflowLocationKey: this.overflowLocationKey
            }, callbacks);
            var that = this;
            console.log("cw unavail:", activity);
            return activity.save(null, {
                success: function (savedModel) {
                    that.set("available", savedModel.get("available"));
                    that.set("activityName", savedModel.get("activity_name"));
                    that.set("activitySid", savedModel.get("activity_sid"));
                }
            });
        },

        /* Only update the Twilio Worker attributes */
        update: function (params, successCallback) {
            var attr = new $.core.ContactWorkerUpdateAction({
                attributes: params.attributes,
                activitySid: params.activitySid,
                workerSid: this.get("workerSid") || this.get("sid"),
                contact_uri: this.get("contact_uri"),
                overflowLocationKey: params.overflowLocationKey
            });
            console.log("cw update:", attr);
            console.log("cw params:", params);
            console.log("cw loc:", this.get("overflowLocationKey"));
            return attr.save(null, {
                success: function (savedModel) {
                    if (_.isFunction(successCallback)) {
                        successCallback(savedModel);
                    }
                }
            });
        },

        addAttributes: function (attributes, successCallback) {
            console.log("addAttributes:", attributes);

            // TODO: move callback to promises
            var workerAttributes = this.worker ? (attributes || this.worker.attributes) : (this.workerClient.attributes || attributes || {});
            // always ensure company is set
            workerAttributes.company = workerAttributes.company || this.options.company.uuid;
            // always ensure env is set
            workerAttributes.env = workerAttributes.env || App.env;

            workerAttributes.languages = workerAttributes.languages || [];
            workerAttributes.modes = workerAttributes.modes || [];
            workerAttributes.overflowLocatinKey = App.env;


            // only add if not already present to avoid dupes
            var lang = workerAttributes.languages.indexOf(attributes.language);
            if (lang === -1) {
                workerAttributes.languages.push(attributes.language);
            }
            var m = workerAttributes.modes.indexOf(attributes.mode);
            if (m === -1) {
                workerAttributes.modes.push(attributes.mode);
            }

            // set contact uri if passed in
            workerAttributes.contact_uri = attributes.contact_uri || workerAttributes.contact_uri;

            // just set attributes
            var props = {
                "Attributes": workerAttributes
            };
            console.log("Twilio ContactWorker Add update props", props);

            var that = this;
            if (this.worker) {
                // the worker is directly loaded on the manage workers page, so updates
                // can be made directly here. verify if we can update the agent page to use this
                // rather than the workerClient
                this.worker.update(props,
                    function (error, worker) {
                        if (error) {
                            console.log(error.code);
                            console.log(error.message);
                            return;
                        }
                        that.set(worker);
                    }
                );
                return;
            }

            this.workerClient.update(props, function (error, worker) {
                if (error) {
                    popupHandleActionError({
                        message: "Error adding attributes to worker: " + error.code + " / " + error.message
                    });
                } else {
                    console.log("Success:", worker, worker.available);

                    if (_.isFunction(successCallback)) {
                        successCallback();
                    }
                }
            });
        },

        removeAttributes: function (attributes, successCallback) {
            console.log("removeAttributes:", attributes);


            // TODO: move these to methods on contact worker with promises
            var workerAttributes = this.worker ? (attributes || this.worker.attributes) : this.workerClient.attributes;
            // always ensure company is set
            workerAttributes.company = workerAttributes.company || this.options.company.uuid;
            // always ensure env is set
            workerAttributes.env = workerAttributes.env || App.env;

            workerAttributes.languages = workerAttributes.languages || [];
            workerAttributes.modes = workerAttributes.modes || [];

            var lang = workerAttributes.languages.indexOf(attributes.language);
            if (lang > -1) {
                workerAttributes.languages.splice(lang, 1);
            }
            var m = workerAttributes.modes.indexOf(attributes.mode);
            if (m > -1) {
                workerAttributes.modes.splice(m, 1);
            }

            // just set attributes
            var props = {
                "Attributes": workerAttributes
            };

            console.log("Twilio ContactWorker Remove update props", props);

            var that = this;
            if (this.worker) {
                // the worker is directly loaded on the manage workers page, so updates
                // can be made directly here. verify if we can update the agent page to use this
                // rather than the workerClient
                this.worker.update(props,
                    function (error, worker) {
                        if (error) {
                            console.log(error.code);
                            console.log(error.message);
                            return;
                        }
                        that.set(worker);
                        //that.trigger('change', that);
                    }
                );
                return;
            }

            this.workerClient.update(props, function (error, worker) {
                if (error) {
                    popupHandleActionError({
                        message: "Error removing attributes from worker: " + error.code + " / " + error.message
                    });
                } else {
                    console.log("Success:", worker, worker.available);

                    // inv
                    if (_.isFunction(successCallback)) {
                        successCallback();
                    }
                }
            });
        },


        reservationCreated: function (reservation) {
            var languageAndMode = reservation.task.attributes.language;
            var mode = languageAndMode.split("_")[1];
            LOG("Reservation created");
            console.log("Reservation created. rez:", reservation);

            var sessionUuid = reservation.task.attributes.videoSessionUuid;

            // add to collection for display
            this.options.reservationsCollection.add(new $.core.ReservationModel(reservation));

            reservation.remember = 'true';

            if (mode === "video") {
                new $.vri.IncomingCallView({
                    reservation: reservation,
                    workerClient: this
                }).render();
            }
        },

        startConferenceView: function (videoSessionModel, reservation) {
            var conferenceView = new $.vri.WorkerConferenceView({
                model: videoSessionModel,
                reservation: reservation,
                identity: this.options.identity,
                token: this.options.vriToken,
                wsToken: this.options.wsToken,
                company: this.options.company,
                companyConfig: this.options.companyConfig,
                routingAttributes: {},
                envContext: this.options.envContext,
                worker: this.workerClient
            });
            conferenceView.render();

            return conferenceView;
        },

        buildVideoSessionAndStartConference: function (reservation) {
            console.log("ENTER buildVideoSessionAndStartConference. res:", reservation);
            var that = this;
            var sessionUuid = reservation.task.attributes.session;
            //            var roomName = reservation.task.attributes.teamSession;
            var jobUuid = reservation.task.attributes.job;
            var languageAndMode = reservation.task.attributes.language;
            var language = languageAndMode.split("_")[0];

            var videoSessionModel = new $.core.VideoSessionModel({
                uuid: sessionUuid,
                jobUuid: jobUuid,
                language: language,
                interpreterUuid: that.get('interpreter').uuid,
                createTwilioRoom: false
            }, {
                companyUuid: that.options.company.uuid
            });
            console.log("Do videoSessionModel.save:", videoSessionModel);

            videoSessionModel.save(null, {
                success: function (model, response) {
                    console.log("VideoSession save success");
                    that.startConferenceView(model, reservation);

                },
                error: function (model, xhr, options) {
                    console.log("Error. video sessionModel. xhr", xhr);
                    var json = JSON.parse(xhr.responseText);
                    popupHandleActionError(json);
                }
            });
        },

        reservationAccepted: function (reservation) {
            var that = this;
            var languageAndMode = reservation.task.attributes.language;
            var mode = languageAndMode.split("_")[1];
            LOG("Reservation accepted.");
            console.log("Reservation accepted.", reservation);

            this.updateReservationModel(reservation);

            var sessionUuid = reservation.task.attributes.session;
            var sessionModel;
            if (mode === "video") {
                sessionModel = new $.core.VideoSessionModel({
                    session: sessionUuid
                }, {
                    companyUuid: this.options.company.uuid
                });
                sessionModel.fetch({
                    success: function (model) {
                        console.log("Found VideoSession", model);

                        // TODO: hide loading icon while assignment is happening

                        // TODO: start conference immediately as assign is slow!
                        // TODO: also m is different model than model and missing methods
                        // that.startConference(model);
                        // show conference
                        // TODO: call static method to join conference, no need to fetch
                        // always join pre-existing conference
                        that.startConferenceView(model, reservation);

                    },
                    error: function (model, xhr, options) {
                        console.log("Error. video sessionModel. xhr", xhr);
                        var json = JSON.parse(xhr.responseText);
                        if (json.code === 400 || json.code === 404) {
                            that.buildVideoSessionAndStartConference(reservation);
                        } else {
                            popupHandleActionError(json);
                        }
                    }
                });
            } else if (mode === "voice") {}


        },
        reservationRejected: function (reservation) {
            LOG("Reservation rejected.");
            console.log("Rez Rejected. rez:", reservation);
            this.updateReservationModel(reservation);
            // see if worker is still available
            // make worker unavailable for X seconds to avoid the call immediately coming through again
        },

        reservationTimeout: function (reservation) {
            LOG("Reservation timeout.");
            console.log("Rez Timeout. rez:", reservation);
            this.updateReservationModel(reservation);
            // close incoming call if opened
            // TODO: should this be added back in?
            // TODO: how is the audio cleared when the reservation timesout?
            if (this.incomingCallView) {
                this.incomingCallView.cleanUp();
            }

            popupHandleActionError({
                message: "The reservation request has timed out. You will be set to <b>offline</b>. Make yourself available again when you are ready to service request. "
            });
        },
        reservationCanceled: function (reservation) {
            LOG("Reservation canceled.");
            console.log("Rez Canceled. rez:", reservation);
            this.updateReservationModel(reservation);
            this.trigger('onReservationCanceled');
            // close incoming call if opened
            // TODO: should this be added back in?
            // TODO: how is the audio cleared when the reservation timesout?
            if (this.incomingCallView) {
                this.incomingCallView.cleanUp();
            }

            popupHandleActionError({
                message: "The reservation request has been cancelled. "
            });
        },

        reservationRescinded: function (reservation) {
            LOG("Reservation rescinded.");
            console.log("Rez Rescinded. rez:", reservation);
            this.trigger('onReservationRescinded');
            this.updateReservationModel(reservation);
            // close incoming call if opened
            // TODO: should this be added back in?
            // TODO: how is the audio cleared when the reservation timesout?
            if (this.incomingCallView) {
                this.incomingCallView.cleanUp();
            }

            popupHandleActionError({
                message: "The reservation request has been rescinded. "
            });
        },

        updateReservationModel: function (reservation) {
            console.log("Update RezModel. rez:", reservation);

            // update the reservation
            var reservationModel = this.options.reservationsCollection.get(reservation.sid);
            reservationModel.set(reservation);
        }
    });

    /*
     * ONLY update the Twililo Worker attributes.
     * Does NOT update DB ContractWorker
     */
    $.core.ContactWorkerAction = $.core.BaseModel.extend({

        urlRoot: App.config.context + "/api/contactWorker/twiliostate",

        initialize: function (attributes, options) {
            options = options || {};
            $.core.BaseModel.prototype.initialize.call(this, attributes, options);
            console.log(" Init ContactWorkerAction", this);

            // bind to event handlers
            this.listenTo(this, 'error', options.errorHandler);
            this.listenTo(this, 'invalid', options.errorHandler);
            this.listenTo(this, 'sync', options.successHandler);
        },

        // override save to pull in required attributes from booking
        save: function (attrs, options) {
            console.log("ContactWorkerAction save:", attrs);
            // collect attributes before saving
            this.collectAttributes(attrs, options);
            return Backbone.Model.prototype.save.call(this, attrs, options);
        }
    });

    $.core.ContactWorkerUpdateAction = $.core.ContactWorkerAction.extend({

        collectAttributes: function () {
            console.log("ContactWorkerUpdateAction :", this.attributes);
            this.set({
                action: "update",
                activitySid: this.attributes.activitySid,
                attributes: this.attributes.attributes,
                workerSid: this.attributes.workerSid,
                company: this.attributes.company,
                contact_uri: this.attributes.contact_uri,
                overflowLocationKey: this.attributes.overflowLocationKey
            });
        }

    });

    $.core.ReservationModel = $.core.BaseModel.extend({
        idAttribute: 'sid'
    });

    $.core.ContactWorkerCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.ContactWorkerModel,

        url: App.config.context + "/api/contactWorker/",

        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

    $.core.IvrCallTemplateModel = $.core.BaseModel.extend({
        urlRoot: App.config.context + "/api/ivrCallTemplate",
        url: function () {
            var url = this.urlRoot;

            if (this.id) {
                url += "/" + this.id;
            }

            if (this.options.data) {
                url += "?" + $.param(this.options.data);
            }

            return url;
        },
        initialize: function (attrs, options) {
            this.options = options;
        },
        validate: function (attrs) {

        }
    });

    $.core.IvrCallStepTemplateModel = $.core.BaseModel.extend({

    });

    $.core.IvrCallTemplateCollection = $.core.BaseCollection.extend({
        initialize: function () {
            // Add save method to collection for bulk updates
            _.extend(this, $.app.mixins.bulkCollection);
        },

        model: $.core.IvrCallTemplateModel,

        url: App.config.context + "/api/ivrCallTemplate/",

        // parse the state from the response
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count,
                totalPages: resp.numPages,
                pageSize: resp.pageSize
            };
        },

        // parse the records from result
        parseRecords: function (resp, options) {
            return resp.items;
        }
    });

})(jQuery);
