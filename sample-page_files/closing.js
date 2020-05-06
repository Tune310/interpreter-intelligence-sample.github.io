(function ($) { //@ sourceURL=app/component/closing.js
    /* enable strict mode */
    'use strict';

    $.closing = {};

    $.closing.models = {};
    $.closing.helpers = {};
    $.closing.views = {};


    $.closing.views.MainView = $.app.ItemView.extend({

        template: 'booking/close/main',

        events: {
            'click .widget-next': 'showSignature',
            'click .widget-previous': 'showDetails',
            'click .widget-help': 'showHelp',
            'click .widget-ok': 'closeConfirm',
            'click .widget-cancel': 'cancel'
        },

        initialize: function (options) {

            // TODO: rename incidentals collection to be more specific
            // setup incidentals
            if (options.incidentalsJson) {
                // pick up from Json passed in
                this.collection = new $.core.IncidentalCollection(options.incidentalsJson);
                this.collection['booking.id'] = this.model.id;
            } else {
                // fetch from server
                this.collection = new $.core.IncidentalCollection();
                this.collection['booking.id'] = this.model.id;
                // load the incidentals
                this.collection.fetch();
            }

            // create new empty refs
            this.refs = new $.booking.v2.ReferenceCollection();

            var addRefs = function (rccac) {

                // loop over each config and create reference code from that
                // similar code in job.js
                _.each(rccac.toJSON(), function (r) {
                    //rcConfigsAtClosing.each(function(r, index){

                    var newRef;

                    if (r.defaultValue === null || r.selectField) {
                        newRef = new $.booking.v2.ReferenceModel({
                            config: r,
                            name: r.label,
                            customer: this.model.get("customer"),
                            ref: "",
                            company: this.model.get("company")
                        });
                    } else {
                        newRef = new $.booking.v2.ReferenceModel({
                            config: r,
                            name: r.label,
                            customer: this.model.get("customer"),
                            ref: r.defaultValue,
                            company: this.model.get("company")
                        });
                    }
                    this.refs.add(newRef);
                }, this);

                // call transition after all references loaded
                this.transition();
            };

            var rcConfigsAtClosing;

            // setup refs
            if (options.rcConfigsAtClosingJson) {

                // pick up from Json passed in
                rcConfigsAtClosing = new $.core.ReferenceCodeConfigCollection(options.rcConfigsAtClosingJson);

                addRefs.call(this, rcConfigsAtClosing);

            } else {

                // fetch config from server and setup refs
                // references to be collected at closing
                rcConfigsAtClosing = new $.core.ReferenceCodeConfigCollection();

                // TODO: how to build up using filterbuilder?
                var filtersJson = {
                    "groupOp": "AND",
                    "rules": [{
                        "groupOp": "OR",
                        "rules": [{
                            "groupOp": "AND",
                            "rules": [{
                                "op": "null",
                                "field": "customer.id"
                            }, {
                                "op": "eq",
                                "field": "collectAtClosing",
                                "data": "true"
                            }]
                        }, {
                            "groupOp": "AND",
                            "rules": [{
                                "op": "eq",
                                "field": "customer.id",
                                "data": this.model.get("customer").id
                            }, {
                                "op": "eq",
                                "field": "collectAtClosing",
                                "data": "true"
                            }]
                        }]
                    }, {
                        "op": "ne",
                        "field": "disabled",
                        "data": "true"
                    }]
                };

                var that = this;

                rcConfigsAtClosing.queryParams.filters = JSON.stringify(filtersJson);
                rcConfigsAtClosing.queryParams.sord = 'asc';
                rcConfigsAtClosing.queryParams.sidx = 'customer.id';
                rcConfigsAtClosing.queryParams.rows = -1;
                rcConfigsAtClosing.fetch({
                    success: function () {

                        addRefs.call(that, rcConfigsAtClosing);
                        // // loop over each config and create reference code from that
                        // // similar code in job.js
                        // _.each(rcConfigsAtClosing.toJSON(), function (r) {
                        //     //rcConfigsAtClosing.each(function(r, index){
                        //
                        //     var newRef;
                        //
                        //     if (r.defaultValue === null || r.selectField) {
                        //         newRef = new $.booking.v2.ReferenceModel({
                        //             config: r,
                        //             name: r.label,
                        //             customer: this.model.get("customer"),
                        //             ref: "",
                        //             company: this.model.get("company")
                        //         });
                        //     } else {
                        //         newRef = new $.booking.v2.ReferenceModel({
                        //             config: r,
                        //             name: r.label,
                        //             customer: this.model.get("customer"),
                        //             ref: r.defaultValue,
                        //             company: this.model.get("company")
                        //         });
                        //     }
                        //     this.refs.add(newRef);
                        //
                        // }, that);
                    }
                });

            }

            // mark as no fetch so that the incidentals view does not refresh each time
            this.collection.noFetch = true;

            // clear out the values to be re-entered
            this.model.unset("contactArrivalDate");
            this.model.unset("contactLateMins");
            this.model.unset("actualStartDate");
            this.model.unset("actualEndDate");

            // set necessary defaults
            // whether times are pre-populated
            if (options.companyConfig.get("enableBlankStartTimeClosing") === false) {
                this.model.set("contactArrivalDate", this.model.get("actualStartDate") || this.model.get("expectedStartDate"));
                this.model.set("actualStartDate", this.model.get("actualStartDate") || this.model.get("expectedStartDate"));
                this.model.set("actualEndDate", this.model.get("actualEndDate") || this.model.get("expectedEndDate"));
            }

            // assume on time arrival
            if (options.companyConfig.get("enableContactLateTimeTracking") === true) {
                // set to "0" as 0 evaluates to false in the jst for rendering
                this.model.set("contactLateMins", "0");
            }

            // whether sla reporting or time tracking are enabled
            if (options.customerConfig.get("slaReportingEnabled") === true || options.customerConfig.get("enableTimeTracking") === true) {
                // TODO: set these if they are fully pre-populated on view
                //assignmentDate
                //timeInterpreterDepartedOutbound
                //timeInterpreterArrivedOutbound
            }

            // whether time tracking enabled
            if (options.customerConfig.get("enableTimeTracking") === true) {
                // TODO: set these if they are fully pre-populated on view
                //timeInterpreterDepartedInbound
                //timeInterpreterArrivedInbound
            }

        },

        onRender: function () {
            var $modalEl = $("#modalContainer");
            $modalEl.html(this.el);
            $modalEl.modal('show');
            $modalEl.addClass('modal-wide');

            this.start();
        },

        start: function () {

            // check to see if job already closed for non-internal user
            if (this.model.get("status").id === App.dict.bookingStatus.closed.id &&
                !_.contains(App.config.userData.roles, "comp")) {

                this.showAlreadyClosed();
            } else {

                this.showDetails();
                // this.showSummary();
            }
        },

        transition: function () {
            // no-op
        },

        showDetails: function () {
            var that = this;
            var detailsView = new $.closing.views.CloseDetailsView({
                mainView: this,
                model: this.model,
                collection: this.collection,
                refs: this.refs,
                companyConfig: this.options.companyConfig,
                customerConfig: this.options.customerConfig,
                companyPayableItemTypesAvailableMap: this.options.companyPayableItemTypesAvailableMap,
                debug: this.options.debug
                /*,
                                el: this.$(".closing-container")  */
            });

            // clear existing view
            if (this.currentView) {
                this.currentView.undelegateEvents();
                this.currentView.$el.empty();
                this.currentView.remove();
            }
            this.currentView = detailsView;
            //this.currentView.render();
            // debounce this as the wysiwyg does not get rendered a second time without a delay
            this.$(".closing-container").html(this.currentView.render().el);

            this.$(".details-actions").show();
            this.$(".summary-actions").hide();
            this.$(".help-actions").hide();

            // invoke any required functionality after the transition
            setTimeout(function () {
                that.transition();
            }, 100);

        },

        showSignature: function () {

            // pass through to summary for normal closing regardless if signature enabled or not
            // current signature is only supported on mobile
            this.showSummary();
        },

        showSummary: function () {

            // customer and internal users go directly to confirmation page
            if (_.contains(App.config.userData.roles, "cust") || _.contains(App.config.userData.roles, "comp")) {
                this.closeConfirm();
            } else {

                //financedItem.set("incidentals", this.collection);
                this.model.set("incidentals", this.collection); // set on model as this is invoked from FinancedItemModel
                this.model.set("refs", this.refs); // set on model as this is invoked from FinancedItemModel

                var financedItem = new $.finance.FinancedItemModel(this.model.attributes, {
                    booking: this.model,
                    companyConfig: this.options.companyConfig,
                    customerConfig: this.options.customerConfig
                });

                if (financedItem.isValid()) {

                    var that = this;
                    financedItem.save({}, {
                        //financedItem.fetch({
                        success: function () {

                            var payableItems = financedItem.get("payableItems");

                            var payableItemsCollection = new Backbone.Collection(payableItems);

                            //
                            if (that.options.companyConfig.get("disclaimerEnabled")) {
                                // flag that the disclaimer will be shown so it can be later validated
                                that.model.set("disclaimerShown", true);
                                // TODO: should we clear out existing disclaimer information
                                that.model.unset("disclaimerAccepted");
                                that.model.unset("disclaimerAcceptedDate");
                                that.model.unset("disclaimerAcceptedInitials");
                            }
                            // set the incidentals collected on the model
                            that.model.set("incidentals", that.collection.toJSON());
                            that.model.set("refs", that.refs.toJSON());

                            // get financial
                            var summaryView = new $.closing.views.CloseSummaryView({
                                collection: payableItemsCollection,
                                model: that.model,
                                companyConfig: that.options.companyConfig,
                                customerConfig: that.options.customerConfig,
                                debug: that.options.debug
                                /*,
                                                            el: that.$(".closing-container")  */
                            });

                            // clear existing view
                            if (that.currentView) {
                                that.currentView.undelegateEvents();
                                that.currentView.$el.empty();
                                that.currentView.remove();
                            }
                            that.currentView = summaryView;
                            //that.currentView.render();
                            that.$(".closing-container").html(that.currentView.render().el);
                            //that.$(".closing-container").html(summaryView.render().el);
                            that.$(".details-actions").hide();
                            that.$(".summary-actions").show();
                            that.$(".help-actions").hide();

                            // TODO: breaks separation between mobile and www!
                            $('.ui-dialog').dialog('close');

                            // invoke any required functionality after the transition
                            that.transition();
                        }
                    });

                }
            }
        },

        closeConfirm: function () {

            var that = this;

            // previous call, would have reset the incidentals back to uri
            // set the incidentals collected on the model
            that.model.set("incidentals", that.collection);
            that.model.set("refs", that.refs);

            this.model.close({}, {
                success: function () {

                    var confirmationView = new $.closing.views.CloseConfirmationView({
                        model: that.model,
                        companyConfig: that.options.companyConfig,
                        customerConfig: that.options.customerConfig,
                        debug: that.options.debug
                        /*,
                                                el: that.$(".closing-container")  */
                    });

                    // clear existing view
                    if (that.currentView) {
                        that.currentView.undelegateEvents();
                        that.currentView.$el.empty();
                        that.currentView.remove();
                    }
                    that.currentView = confirmationView;
                    //that.currentView.render();
                    that.$(".closing-container").html(that.currentView.render().el);
                    that.$(".details-actions").hide();
                    that.$(".summary-actions").hide();
                    that.$(".help-actions").hide();
                    that.$(".help").hide();

                    // invoke any required functionality after the transition
                    that.transition();
                },
                companyConfig: that.options.companyConfig,
                customerConfig: that.options.customerConfig
            });
        },

        showAlreadyClosed: function () {

            var alreadyClosedView = new $.closing.views.AlreadyClosedView({
                //el: this.$(".closing-container"),
                model: this.model
            });

            // clear existing view
            if (this.currentView) {
                this.currentView.undelegateEvents();
                this.currentView.$el.empty();
                this.currentView.remove();
            }
            this.currentView = alreadyClosedView;
            //that.currentView.render();
            this.$(".closing-container").html(this.currentView.render().el);
            this.$(".details-actions").hide();
            this.$(".summary-actions").hide();
            this.$(".help-actions").hide();
            this.$(".help").hide();

            // invoke any required functionality after the transition
            this.transition();
        },

        showHelp: function () {

            var helpView = new $.closing.views.CloseHelpView({
                model: this.options.companyConfig
                //el: this.$(".closing-container")
            });

            // clear existing view
            if (this.currentView) {
                this.currentView.undelegateEvents();
                this.currentView.$el.empty();
                this.currentView.remove();
            }
            this.currentView = helpView;
            //this.currentView.render();
            this.$(".closing-container").html(this.currentView.render().el);
            this.$(".details-actions").hide();
            this.$(".summary-actions").hide();
            this.$(".help-actions").show();

            // invoke any required functionality after the transition
            this.transition();
        },

        // TODO: how to properly remove the view! closing the modal, does not close this parent view
        onClose: function () {
            var $modalEl = $("#modalContainer");
            $modalEl.removeClass('modal-large');
            $modalEl.modal('hide');
            this.remove();
        },

        cancel: function (evt) {
            evt.preventDefault();
            // close view properly. do any further clean-up in here
            this.close();
        }
    });

    $.closing.views.CloseDetailsView = $.app.ItemView.extend({

        template: 'booking/close/details',

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change input[type=file]": "getFile"
        },

        modelEvents: {
            "error": "error",
            "invalid": "invalid",
            "change:isCancelled": "toggleCancellationReason",
            "change:cancellationReason": "updateCancellationReason",
            "change:vosOffline": "toggleVosOffline"
        },

        getFile: function (evt) {

            var that = this;
            var file = this.$("#vos").prop("files")[0];

            if (file) {
                // file attributes
                var fileObj = {
                    contents: null,
                    // lastModified
                    // lastModifiedDate
                    name: file.name,
                    size: file.size,
                    type: file.type
                    // webkitRelativePath
                };

                var reader = new FileReader();
                //reader.readAsText(file, "UTF-8");
                reader.readAsArrayBuffer(file);
                reader.onload = function (evt) {

                    var ab = evt.target.result;
                    var dView = new Uint8Array(ab); //Get a byte view
                    var arr = Array.prototype.slice.call(dView); //Create a normal array
                    var arr1 = arr.map(function (item) {
                        return String.fromCharCode(item); //Convert
                    });
                    var contents = window.btoa(arr1.join('')); //Form a string


                    fileObj.contents = contents;
                    that.model.set("vos", fileObj);
                    console.log(evt.target.result);
                };
                reader.onerror = function (evt) {
                    console.log("error reading file");
                };
            }

            // <input type="file" id="vos" name="vos" file-model="vos" multiple/>
        },

        serializeData: function () {

            return {
                obj: this.model.toJSON(),
                companyConfig: this.options.companyConfig.toJSON(),
                customerConfig: this.options.customerConfig.toJSON(),
                debug: this.options.debug // show all optional fields for testing
            };
        },

        onRender: function () {

            // reset the disclaimer flag whenever this view is rendered
            this.model.set("disclaimerShown", false);
            this.model.set("signatureShown", false);

            var that = this;
            // delay callbacks as tinymce does not render the second time the view
            // is rendered. adding delay allows it to render correctly
            var debounce = _.debounce(function () {
                that.callbacks(that.$el, that.model);
                that.formatElements();

                // incidentals rendered after the callbacks / formatElements to avoid
                // them being applied twice to the incidentals
                // show incidentals
                var incidentalsView = new $.common.IncidentalsInlineView({
                    el: that.$("#incidentals"),
                    collection: that.collection,
                    companyPayableItemTypesAvailableMap: that.options.companyPayableItemTypesAvailableMap,
                    booking: that.model // TODO: rename to job
                });
                incidentalsView.render();

            }, 50);
            debounce();

            // render documents
            var documents = new $.core.DocumentCollection([], {
                parentEntityType: "booking",
                parentEntityId: this.model.id
            });
            var documentsView = new $.common.DocumentsView({
                el: this.$("#documents"),
                model: this.model,
                hideProgress: true,
                collection: documents,
                options: function () {
                    return {
                        parentEntityId: that.model.id,
                        parentEntityClass: 'com.ngs.id.model.Booking',
                        parentEntityType: "booking"
                    };
                },
                title: "Additional Documents"
            });

            documentsView.render();

            var frameConfig = new Backbone.Model({
                companyConfig: this.options.companyConfig,
                customerConfig: this.options.customerConfig,
                interpreterJob: this.options.interpreterJob,
                customerNotes: this.options.customerNotes,
                jobCreateEnabled: this.options.jobCreateEnabled,
                jobUpdateEnabled: this.options.jobUpdateEnabled,
                enableAllServices: this.options.enableAllServices,
                isView: this.options.isView,
                originalVisitId: this.options.originalVisitId,
                createOrigin: this.options.createOrigin,
                jobContextId: this.options.jobContextId,
                preventEditing: this.options.preventEditing,
                user: this.options.user
            });

            // delay refs view as "previous" causes rendering issues when references present
            var debounce2 = _.debounce(function () {
                var refsView = new $.common.RefsView({
                    el: that.$("#references"),
                    model: that.model,
                    collection: that.options.refs,
                    frameConfig: frameConfig
                });

                // show refs container if refs to be entered. two scenarios: refs preloaded;
                // refs fetched. want to show them in both cases
                if (that.options.refs.size() > 0) {
                    that.$(".references-container").removeClass("hidden");
                }
                that.options.refs.on("add", function () {
                    that.$(".references-container").removeClass("hidden");
                });

                refsView.render();

            }, 50);
            debounce2();

            // add nicer file input
            if (jQuery().customFileInput) {
                this.$("#vos").customFileInput({
                    button_position: 'right'
                });
            }
        },

        toggleCancellationReason: function () {
            if (this.model.get("isCancelled") === true) {
                this.$('.cancellationReason-container').show();
                this.updateCancellationReason();
            } else {
                this.$('.cancellationReason-container').hide();
                this.updateCancellationReason();
            }
        },

        updateCancellationReason: function () {

            if (this.model.get("isCancelled")) {
                // ensure isCancelled checkbox set
                if (this.model.get("cancellationReason") && this.model.get("cancellationReason").id) {
                    var cancellationReason = App.dict.cancellationReasons[this.model.get("cancellationReason").id];
                    if (cancellationReason.payable) {
                        this.model.set("payable.id", App.dict.yesNoType.y.id);
                    } else {
                        this.model.set("payable.id", App.dict.yesNoType.n.id);
                    }
                    if (cancellationReason.billable) {
                        this.model.set("billable.id", App.dict.yesNoType.y.id);
                    } else {
                        this.model.set("billable.id", App.dict.yesNoType.n.id);
                    }
                }
            } else {
                // clear billable / payable
                this.model.set("payable.id", "");
                this.model.set("billable.id", "");
            }
        },

        toggleVosOffline: function () {
            if (this.model.get("vosOffline") === true) {
                this.$('.vosOffline-warning-container').show();
            } else {
                this.$('.vosOffline-warning-container').hide();
            }
        }
    });

    $.closing.views.CloseSummaryItemView = $.app.ItemView.extend({

        template: 'booking/close/summary-item',

        tagName: 'tr'

    });

    $.closing.views.CloseSummaryView = $.app.CompositeView.extend({

        template: 'booking/close/summary',

        itemView: $.closing.views.CloseSummaryItemView,

        itemViewContainer: ".summary-items",

        events: {
            "click .widget-accept-disclaimer": "acceptDisclaimer",
            "change input": "synchModel"
        },

        modelEvents: {
            "error": "error",
            "invalid": "invalid"
        },

        initialize: function (options) {

            if (options.companyConfig.get("disclaimerEnabled") || this.options.debug) {
                this.model.set("disclaimerShown", true);
            }

            // unset the associated variables for later validation
            this.model.unset("disclaimerAccepted");
            this.model.unset("disclaimerAcceptedInitials");
            this.model.unset("disclaimerAcceptedDate");
        },

        serializeData: function () {

            return {
                obj: this.model.toJSON(),
                companyConfig: this.options.companyConfig.toJSON(),
                customerConfig: this.options.customerConfig.toJSON(),
                debug: this.options.debug // show all optional fields for testing
            };
        },

        onRender: function () {

            this.callbacks(this.$el, this.model);
            this.formatElements();
        },

        acceptDisclaimer: function () {
            var $agreeBtn = this.$(".widget-accept-disclaimer");

            if (!$agreeBtn.hasClass('active')) {
                // for www
                $agreeBtn.addClass('active');
                // for mobile
                $agreeBtn.parent("div").addClass('ui-btn-down-c');
                $agreeBtn.parent("div").addClass('ui-disabled');

                this.model.set("disclaimerAccepted", true);
                this.model.set("disclaimerAcceptedDate", new Date().toISOString());
            }
        }
    });

    $.closing.views.CloseConfirmationView = $.app.ItemView.extend({

        template: 'booking/close/confirmation'
    });

    $.closing.views.CloseHelpView = $.app.ItemView.extend({

        template: 'booking/close/help'
    });

    $.closing.views.AlreadyClosedView = $.app.ItemView.extend({

        template: 'booking/close/alreadyclosed'
    });

    /**
     *
     * job Backbone.Model or JSON to create model from
     *
     * @param options
     */
    $.closing.init = function (options) {

        var debug = options.debug;

        var job;
        var companyConfig;
        var customerConfig;
        var companyPayableItemTypesAvailableMap;
        var incidentalsJson;
        var rcConfigsAtClosingJson;

        // use the model passed in or create new one from the JSON
        if (options.job instanceof Backbone.Model) {
            job = options.job;
        } else {
            job = new $.visit.v2.InterpreterVisitModel(options.job);
        }

        // see if incidentals were passed in
        incidentalsJson = options.incidentals;
        rcConfigsAtClosingJson = options.rcConfigsAtClosing;

        // check for cpits for public incidentals view
        if (options.cpits) {
            companyPayableItemTypesAvailableMap = {};
            _.each(options.cpits, function (type) {
                companyPayableItemTypesAvailableMap[type.payableItemType.name] = type;
            });
        }

        // these caches are to store the mapping between company and customer
        // and their configs. the issue is that we load the config from an indirect
        // parameters e.g. customer.id and when this is loaded a second time
        // backbone relational throws an error as multiple objects with the same id
        // are added to the store. the workaround for now is to cache this mapping
        // locally until we can deprecate backbone relational
        window.companyConfigCache = window.companyConfigCache || {};
        window.customerConfigCache = window.customerConfigCache || {};

        // ensure the necessary configurations are fully loaded before rendering
        // company (should always be present)
        if (options.companyConfig) {
            if (options.companyConfig instanceof Backbone.Model) {
                companyConfig = options.companyConfig;
            } else {
                companyConfig = $.core.CompanyConfig.findOrCreate(options.companyConfig);
            }
        } else {
            // load from job
            companyConfig = $.core.CompanyConfig.findOrCreate({
                "company.id": job.get("company").id
            });

            // company config should always be passed in
            //companyConfig.fetch({
            //    async: false
            //});

            // store the mapping for next lookup
            //window.companyConfigCache[job.get("company").id] = companyConfig.id;
        }

        // customer (should only be present in public closing process)
        // from within application, will need to be loaded
        if (options.customerConfig) {
            if (options.customerConfig instanceof Backbone.Model) {
                customerConfig = options.customerConfig;
            } else {
                customerConfig = $.config.CustomerConfig.findOrCreate(options.customerConfig);
            }
        } else {
            if (window.customerConfigCache[job.get("customer").id]) {
                // load from job
                customerConfig = $.config.CustomerConfig.findOrCreate({
                    "id": window.customerConfigCache[job.get("customer").id]
                });
            } else {
                // load from job
                customerConfig = $.config.CustomerConfig.findOrCreate({
                    "customer.id": job.get("customer").id
                });
            }

            // load customer config if it hasn't been passed in
            customerConfig.fetch({
                async: false
            });

            // store the mapping for next lookup
            window.customerConfigCache[job.get("customer").id] = customerConfig.id;

        }

        job.set({
            debug: debug
        });

        return new $.closing.views.MainView({
            model: job,
            incidentalsJson: incidentalsJson,
            rcConfigsAtClosingJson: rcConfigsAtClosingJson,
            companyConfig: companyConfig,
            customerConfig: customerConfig,
            companyPayableItemTypesAvailableMap: companyPayableItemTypesAvailableMap,
            debug: debug
        });
    };

})(jQuery);
