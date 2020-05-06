/*
 * Copyright (C) 2013 Interpreter Intelligence, Inc. <support@interpreterintelligence.com>
 *
 * <copyright notice>
 *
 */

(function ($) { //# sourceURL=app/view/common-shared-views.js

    // views shared between www and mobile
    // moved from common-views.js for use in mobile also.

    /* enable strict mode */
    "use strict";

    // TODO: refactor namespace

    $.common = $.common || {};

    $.common.validateCollection = function (coll, err) {

        if (coll && coll.models) {

            _.each(coll.models, function (m) {

                var e = m.validate(m.attributes);
                if (e) {
                    m.trigger("invalid", m, e);
                    //add the errors but change "field" as the error class is applied at the top level based on name
                    for (var i = 0; i < e.errors.length; i++) {
                        err.errors.push({
                            field: "child\\: " + e.errors[i].field,
                            rejectedValue: e.errors[i].rejectedValue,
                            message: e.errors[i].message
                        });
                    }
                    //err.errors = err.errors.concat(e.errors);
                }

            });
        }
    };

    $.common.validateChild = function (m, err) {

        var e = m.validate(m.attributes);
        if (e) {
            m.trigger("invalid", m, e);
            //add the errors but change "field" as the error class is applied at the top level based on name
            for (var i = 0; i < e.errors.length; i++) {
                err.errors.push({
                    field: "child: " + e.errors[i].field,
                    rejectedValue: e.errors[i].rejectedValue,
                    message: e.errors[i].message
                });
            }
            //err.errors = err.errors.concat(e.errors);
        }
    };

    $.common.isInterpreter = function () {
        return _.indexOf(App.config.userData.roles, "cont") > -1 &&
            !_.isEmpty(App.config.interpreter.id);
    };

    $.common.isCustomer = function () {
        return _.indexOf(App.config.userData.roles, "cust") > -1 &&
            !_.isEmpty(App.config.customer.id);
    };

    $.common.isAgency = function () {
        return _.indexOf(App.config.userData.roles, "comp") > -1 &&
            !_.isEmpty(App.config.company.id);
    };

    $.common.isFina = function () {
        return _.indexOf(App.config.userData.roles, "fina") > -1 &&
            !_.isEmpty(App.config.company.id);
    };

    $.common.isAdmin = function () {
        return _.indexOf(App.config.userData.roles, "admin") > -1 &&
            !_.isEmpty(App.config.company.id);
    };

    /**
     * Returns the options to be used for popovers
     * @returns {{placement: placement, trigger: string}}
     */
    $.common.popOverOptions = function () {
        return {
            trigger: "hover",
            placement: function (context, source) {
                var position = $(source).position();
                if (position.left > 515) {
                    return "left";
                }
                if (position.left < 515) {
                    return "right";
                }
                if (position.top < 110) {
                    return "bottom";
                }
                return "top";
            }
        };
    };

    $.common.RefView = $.app.ItemView.extend({

        initialize: function (options) {
            _.extend(this, $.app.mixins.subviewContainerMixin);
            this.state = "reference";
            this.autoCompleteModel = null;
            this.jobModel = options.jobModel;

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON(),
                config: this.model.get("config") || {}
            }, this.options.frameConfig.toJSON());
        },

        autocomplete: {
            delay: 250,
            cacheLength: 1,
            highlight: true,
            minLength: 2,
            data: {
                nd: function () {
                    return (new Date()).getTime();
                }
            }
        },

        className: "control-group",

        getTemplate: function () {

            if (this.options.frameConfig.get("isView")) {
                return "job/ref/refshow";
            } else {
                if (this.state === "reference") {
                    return "job/ref/ref";
                } else {
                    return "job/ref/refconsumer";
                }
            }
        },

        events: {
            //"change input": "saveReference",
            "click .widget-delete": "deleteReference",
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .widget-approve": "approveReference",
            "click .widget-create": "createConsumer",
            "click .widget-clear": "clearConsumer",
            "click .widget-edit": "editAutoComplete",
            "change #ac_dropdown": "updateDDValue"
        },

        ui: {
            valueField: ".widget-ref-value"
        },

        modelEvents: {
            // TODO: highlight stuff, etc.
            /*"invalid": function (model, error, options) {
                this.invalid(model, error);
            }*/
            "change:autoComplete": "clearAutoCompleteDependencies"
        },

        // on change of autocomplete, remove any dependencies
        clearAutoCompleteDependencies: function () {

            var prev = this.model.previous("autoComplete");
            var curr = this.model.get("autoComplete");

            // check for previous, and that the current is not the same as
            // the previous, which happens after save
            if ((prev && prev.id && curr && curr.id !== prev.id) || (prev && prev.id && !curr)) {
                var requirements = this.jobModel.get("requirements");
                var toRemove = [];
                // test for instance of collection to determine if we're on the job create page
                // or the closing process. the requirements are ignored during closing process
                if (requirements instanceof Backbone.Collection) {
                    _.each(requirements.models, function (m) {

                        if (m.get("dependent") === "autoComplete" && m.get("dependentId") === prev.id) {
                            toRemove.push(m);
                        }
                    });
                    requirements.remove(toRemove);
                }


                var refs;
                toRemove = [];

                // the code to retrieve from jobModel is used on the job create screen
                // however, this is a different type when the references are submitted
                // during the closing process. in this case we use the collection passed
                // into the view. however, however the job create page should / could
                // use the same collection rather than the jobModel.
                if (refs instanceof Backbone.Collection) {
                    // on jobModel
                    refs = this.jobModel.get("refs");
                } else {
                    // on collection passed in
                    refs = this.collection;
                }

                _.each(refs.models, function (m) {

                    if (m.get("dependent") === "autoComplete" && m.get("dependentId") === prev.id) {
                        toRemove.push(m);
                    }
                });
                refs.remove(toRemove);
            }
            //console.log("clearAutoCompleteDependencies", prev, curr);
        },

        editAutoComplete: function (e) {
            var that = this;
            var autoCompleteModel = this.model.get("autoComplete");
            if (autoCompleteModel) {
                var id = autoCompleteModel.id;
                if (id) {
                    that.autoCompleteModel = $.core.ReferenceCodeAutoCompleteModel.findOrCreate({
                        id: id
                    });
                    that.autoCompleteModel.fetch({
                        success: function (model, response) {
                            var view = new $.booking.v2.EditAutoCompleteView({
                                model: that.autoCompleteModel
                            });

                            var modal = new Backbone.BootstrapModal({
                                content: view,
                                okText: "Cancel",
                                cancelText: ""
                            });

                            modal.open();

                            modal.listenTo(view, 'save', function () {
                                modal.close();
                            });

                            that.listenTo(that.autoCompleteModel, 'change', that.updateRefValue);
                        },
                        error: function (model, response) {
                            handleActionError({
                                message: "An error was encountered retrieving the Reference Code AutoComplete. Please contact the administrator if the problem persists."
                            });
                        }
                    });
                }

            } else {
                alert("Please save and approve the new value before editing it.");
            }
        },

        updateRefValue: function (evt) {
            this.model.set({
                ref: this.autoCompleteModel.get("value"),
                referenceValue: this.autoCompleteModel.get("value"),
                autoComplete: this.autoCompleteModel
            });

            this.$el.find(".widget-ref-value").val(this.autoCompleteModel.get("value"));
        },

        updateDDValue: function (e) {
            var that = this;

            var thisDom = this.$el.find("#ac_dropdown");
            var selectedId = thisDom.val();

            var selectedText = thisDom.find("option:selected").text();

            if (selectedId !== "") {
                var autoComplete = $.core.ReferenceCodeAutoCompleteModel.findOrCreate({
                    id: selectedId
                });

                autoComplete.fetch({
                    success: function (model, response) {
                        that.model.set({
                            "ref": selectedText,
                            "referenceValue": selectedText,
                            "autoComplete": autoComplete
                        });
                        that.setValue(selectedText);

                        // load any configuration for the autocomplete (this returns a collection!!!!)
                        var criteria = autoComplete.get("criteria");
                        var criteriaCollection = new $.config.AutoCompleteCriteriaConfigCollection(null, {
                            "autoComplete.id": autoComplete.id
                        });
                        // alternatively set the url
                        criteriaCollection.fetch({
                            success: function (coll, response) {
                                // add all items from the collection
                                _.each(coll.models, function (m) {

                                    var reqs = that.jobModel.get("requirements");

                                    // the code to retrieve from jobModel is used on the job create screen
                                    // however, this is a different type when the references are submitted
                                    // during the closing process. in this case we ignore the dependent
                                    // requirements as they should not be being set during the closing process
                                    if (reqs instanceof Backbone.Collection) {
                                        // on jobModel
                                        reqs.add({
                                            company: {
                                                id: App.config.company.id
                                            },
                                            criteria: m.get("criteria"),
                                            dependent: "autoComplete", // what this is a dependent of
                                            dependentId: autoComplete.id, // id of the autocomplete
                                            required: m.get("required")
                                            // customer setting
                                        });
                                    }
                                });
                            },
                            error: function (model, response) {

                            }
                        });

                        // load any configuration for the autocomplete (this returns a collection!!!!)
                        var rcConfigs = autoComplete.get("referenceCodeConfigs");
                        var rcConfigCollection = new $.config.AutoCompleteReferenceCodeConfigCollection(null, {
                            "autoComplete.id": autoComplete.id
                        });
                        // alternatively set the url
                        rcConfigCollection.fetch({
                            success: function (coll, response) {
                                // add all items from the collection
                                _.each(coll.models, function (m) {

                                    var ref = new $.booking.v2.ReferenceModel({
                                        company: that.jobModel.get("company"),
                                        customer: that.jobModel.get("customer"),
                                        config: m.toJSON(),
                                        name: m.get("label"),
                                        dependent: "autoComplete", // what this is a dependent of
                                        dependentId: autoComplete.id // id of the autocomplete
                                        // customer setting
                                    });
                                    var refs = that.jobModel.get("refs");

                                    // the code to retrieve from jobModel is used on the job create screen
                                    // however, this is a different type when the references are submitted
                                    // during the closing process. in this case we use the collection passed
                                    // into the view. however, however the job create page should / could
                                    // use the same collection rather than the jobModel.
                                    if (refs instanceof Backbone.Collection) {
                                        // on jobModel
                                        refs.add(ref);
                                    } else {
                                        // on collection passed in
                                        that.collection.add(ref);
                                    }
                                });
                            },
                            error: function (model, response) {

                            }
                        });
                    },
                    error: function (model, response) {
                        handleActionError({
                            message: "An error was encountered retrieving the Reference Code AutoComplete. Please contact the administrator if the problem persists."
                        });
                    }
                });

            } else {
                that.model.set({
                    "ref": null,
                    "autoComplete": null
                });
                that.setValue("");
            }
        },

        createConsumer: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            var customerId = this.model.get("customer").id;
            var href = App.config.context + '/consumer/quickadd';
            var config = this.model.get("config");
            var that = this;

            if (config !== null && config !== undefined) {
                if (config.customerSpecific) {
                    href = href + '?customerId=' + customerId;
                }
            }

            if (this.options.frameConfig && this.options.frameConfig.get("customerConfig") || _.contains(App.config.userData.roles, "comp")) {
                if (this.options.frameConfig.get("customerConfig").consumerCreateEnabled || _.contains(App.config.userData.roles, "comp")) {
                    $.colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.doc.width,
                        innerHeight: App.config.popups.doc.height,
                        open: true,
                        href: href,
                        returnFocus: false,
                        title: "Create New Consumer",
                        onClose: that.clearConsumer()
                    });
                }
            }
        },

        clearConsumer: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            this.setValue("");
            this.model.set({
                "consumer": null,
                "ref": ""
            });

            // Clear out Consumer Details Div
            this.$el.find(".consumerDetailsContainer").empty();
        },

        saveReference: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.set("ref", this.ui.valueField.val());

            if (this.model.isValid()) {
                this.ui.valueField.closest(".control-group").removeClass("error");
            }
        },

        deleteReference: function (e) {
            //e.preventDefault();
            //e.stopPropagation();
            //this.model.destroy();
            this.collection.remove(this.model);
        },

        approveReference: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if ((_.contains(App.config.userData.roles, "comp"))) {
                var that = this;
                if (that.model.get("approved") === false) {
                    that.model.set({
                        "approved": true
                    });
                    //that.model.urlRoot = that.model.collection.url;
                    that.model.urlRoot = App.config.context + "/api/superBooking/" + that.model.get("superBooking").id + "/referenceCode";
                    that.model.save().done(function () {
                        that.ui.valueField.closest('.control-group').removeClass('amber');
                        that.$el.find(".widget-approve").attr("disabled", "disabled");
                    }).fail(function () {
                        handleActionError({
                            message: "An error was encountered approving the reference code. Please contact the administrator if the problem persists."
                        });
                    });
                }
            }
        },

        initAutocomplete: function () {
            var that = this;
            var config = that.model.get("config");

            var source = function (request, response) {
                var filtersJSON = {
                    groupOp: "AND",
                    unique: "true",
                    rules: []
                };

                var search = function (refs, textStatus, jqXHR) {
                    var results = [];

                    for (var i = 0; i < refs.items.length; i++) {
                        results.push({
                            label: refs.items[i].value,
                            value: refs.items[i].value,
                            id: refs.items[i].id
                        });
                    }

                    if (config.allowFreeText || (_.contains(App.config.userData.roles, "comp"))) {
                        var alreadyInList = false;

                        for (var j = 0; j < results.length; j++) {
                            if (results[j].value.toLowerCase() === request.term.toLowerCase()) {
                                alreadyInList = true;
                            }
                        }

                        if (results.length > 0 && !alreadyInList) {
                            results.push({
                                label: "[Add this as a new reference value] : " + request.term,
                                value: request.term,
                                approved: false
                            });
                        }
                    }


                    if (results.length === 0) {
                        if (config.allowFreeText || (_.contains(App.config.userData.roles, "comp"))) {
                            results.push({
                                label: "[Add this as a new reference value] : " + request.term,
                                value: request.term,
                                other: true,
                                approved: false
                            });
                        } else {
                            results.push({
                                label: "[No matches. Try an alternative spelling]",
                                value: "[No matches. Try an alternative spelling]",
                                noMatch: true
                            });
                        }
                    }
                    response(results);
                };

                filtersJSON = addOrUpdateFilter(filtersJSON, "value", "bw", request.term);
                filtersJSON = addOrUpdateFilter(filtersJSON, "config.id", "eq", config.id);


                $.ajax({
                    // add sort order and criteria
                    url: App.config.context + "/api/referenceCodeAutoComplete/",
                    dataType: 'json',
                    data: {
                        filters: JSON.stringify(filtersJSON),
                        rows: -1
                    },
                    success: search
                });
            };

            this.ui.valueField.autocomplete(_.extend({
                search: function (event, ui) {
                    that.ui.valueField.autocomplete("option", "source", source);
                },
                select: function (event, ui) {
                    event.preventDefault();

                    if (ui.item.id !== null && ui.item.id !== undefined) {
                        var autoComplete = $.core.ReferenceCodeAutoCompleteModel.findOrCreate({
                            id: ui.item.id
                        });

                        autoComplete.fetch({
                            success: function (model, response) {
                                that.model.set({
                                    "ref": ui.item.value,
                                    "referenceValue": ui.item.value,
                                    "approved": true,
                                    "autoComplete": autoComplete
                                });
                                that.setValue(ui.item);
                            },
                            error: function (model, response) {
                                handleActionError({
                                    message: "An error was encountered retrieving the Reference Code AutoComplete. Please contact the administrator if the problem persists."
                                });
                            }
                        });
                    } else {
                        if (ui.item.noMatch !== undefined && ui.item.noMatch) {
                            that.model.set({
                                "ref": null,
                                "approved": false
                            });
                            that.setValue("");
                        } else {
                            that.model.set({
                                "ref": ui.item.value,
                                "referenceValue": ui.item.value,
                                "approved": false,
                                "autoComplete": null
                            });
                            that.setValue(ui.item);
                        }

                    }
                },
                change: function (event, ui) {
                    if (ui.item === null || ui.item === undefined) {
                        that.model.set({
                            "ref": null,
                            "approved": false
                        });
                        that.setValue("");
                    }
                }
            }, this.autocomplete));
        },

        onRender: function () {
            var config = this.model.get("config");

            var that = this;

            if (config !== null && config !== undefined) {
                if (config.enableDropdown) {

                    var filtersJSON = {
                        groupOp: "AND",
                        rules: []
                    };

                    var displayDD = function (refs, textStatus, jqXHR) {
                        var results = [];

                        var optionsHtml = "<option value=''>[Choose a value]</option>";

                        for (var i = 0; i < refs.items.length; i++) {
                            results.push({
                                label: refs.items[i].value,
                                value: refs.items[i].value,
                                id: refs.items[i].id
                            });

                            optionsHtml += "<option value='" + refs.items[i].id + "'>" + _.escape(refs.items[i].value) + "</option>";
                        }

                        that.$el.find("#ac_dropdown").append(optionsHtml);

                        if (that.model.get("autoComplete")) {
                            // if there is an autocomplete try and set it
                            var autoComplete = that.model.get("autoComplete");

                            if (autoComplete) {
                                that.$el.find("#ac_dropdown").val(that.model.get("autoComplete").id);
                            }
                        }

                    };

                    filtersJSON = addOrUpdateFilter(filtersJSON, "config.id", "eq", config.id);

                    $.ajax({
                        // add sort order and criteria
                        url: App.config.context + "/api/referenceCodeAutoComplete/",
                        dataType: 'json',
                        data: {
                            filters: JSON.stringify(filtersJSON),
                            rows: -1
                        },
                        success: displayDD
                    });
                } else if (config.selectField) {
                    this.initAutocomplete();
                    if (_.contains(App.config.userData.roles, "comp")) {
                        var autoComplete = this.model.get("autoComplete");

                        this.$el.find(".widget-edit").removeAttr("disabled");

                        if (this.model.get("approved") === false) {
                            if (autoComplete === undefined || autoComplete === null) {
                                this.ui.valueField.closest('.control-group').addClass('amber');
                                this.$el.find(".widget-approve").removeAttr("disabled");
                            }
                        }
                    }

                } else if (config.consumerEnabled && this.state !== "consumer") {
                    this.state = "consumer";

                    this.render();
                    this.initConsumerAutocomplete();

                    if (this.options.frameConfig && this.options.frameConfig.get("customerConfig") || _.contains(App.config.userData.roles, "comp")) {
                        if (this.options.frameConfig.get("customerConfig").consumerCreateEnabled || _.contains(App.config.userData.roles, "comp")) {
                            this.$el.find(".widget-create").removeAttr("disabled");
                        }
                    }

                    var consumerObj = this.model.get("consumer");

                    if (consumerObj !== null && consumerObj !== undefined) {

                        var consumer = $.core.Consumer.findOrCreate({
                            id: consumerObj.id
                        });

                        if ((!_.contains(App.config.userData.roles, "cont"))) {
                            consumer.fetch({
                                success: function (model, response) {
                                    that.$el.find(".consumerDetailsContainer").empty();
                                    var detailsView = new $.booking.v2.ConsumerDetailsView({
                                        model: consumer,
                                        el: that.$el.find(".consumerDetailsContainer")
                                    });
                                    detailsView.render();
                                },
                                error: function (model, response) {
                                    handleActionError({
                                        message: "An error was encountered retrieving the Consumer. Please contact the administrator if the problem persists."
                                    });
                                }
                            });
                        }
                    }
                }
            }

            this.callbacks(this.$el, this.model);

        },

        setValue: function (value) {
            if (!value) {
                this.ui.valueField.val("");
            } else if (value.value) {
                this.ui.valueField.val(value.value);
            }
            this.trigger("change", value);
        },

        initConsumerAutocomplete: function () {
            var that = this;
            var config = that.model.get("config");
            var customerId = that.model.get("customer").id;
            var isCustomerSpecific = config.customerSpecific;
            var isInternalUser = _.contains(App.config.userData.roles, "comp");
            var ignoreCustomerSpecific = config.customerSpecific ? false : true;

            if (isInternalUser) {
                ignoreCustomerSpecific = true;
            }

            var source = function (request, response) {
                var filtersJSON = {
                    groupOp: "AND",
                    rules: []
                };

                var search = function (consumers, textStatus, jqXHR) {
                    var results = [];
                    for (var i = 0; i < consumers.rows.length; i++) {
                        results.push({
                            label: consumers.rows[i].name,
                            value: consumers.rows[i].name,
                            id: consumers.rows[i].id
                        });
                    }

                    if (results.length === 0) {
                        results.push({
                            label: "[No matches. Try an alternative spelling]",
                            value: "[No matches. Try an alternative spelling]",
                            noMatch: true
                        });
                    }
                    response(results);
                };

                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", customerId);
                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", true);

                // If at company level and customer specific checked, display only customer specific.
                // If at company level and customer specific not checked, display company and customer specific.
                // If at customer level, display only customer specific.

                if (!isCustomerSpecific || ignoreCustomerSpecific) {
                    filtersJSON = addOrUpdateFilter(filtersJSON, "ignoreCustomerSpecific", "eq", true);
                } else if (isCustomerSpecific && config["customer.id"] === null) {
                    filtersJSON = addOrUpdateFilter(filtersJSON, "customerSpecific", "eq", isCustomerSpecific);
                } else if (isCustomerSpecific) {
                    filtersJSON = addOrUpdateFilter(filtersJSON, "customerSpecific", "eq", isCustomerSpecific);
                }

                $.ajax({
                    // add sort order and criteria
                    url: App.config.context + "/api/consumer/",
                    dataType: 'json',
                    data: {
                        filters: JSON.stringify(filtersJSON)
                    },
                    success: search
                });
            };

            this.ui.valueField.autocomplete(_.extend({
                search: function (event, ui) {
                    that.ui.valueField.autocomplete("option", "source", source);
                },
                select: function (event, ui) {
                    event.preventDefault();

                    if (ui.item.id !== null && ui.item.id !== undefined) {
                        var consumer = $.core.Consumer.findOrCreate({
                            id: ui.item.id
                        });
                        if ((!_.contains(App.config.userData.roles, "cont"))) {
                            consumer.fetch({
                                success: function (model, response) {
                                    that.model.set({
                                        "ref": ui.item.value,
                                        "referenceValue": ui.item.value,
                                        "consumer": consumer
                                    });
                                    that.setValue(ui.item);

                                    that.$el.find(".consumerDetailsContainer").empty();

                                    var detailsView = new $.booking.v2.ConsumerDetailsView({
                                        model: consumer,
                                        el: that.$el.find(".consumerDetailsContainer")
                                    });

                                    detailsView.render();
                                },
                                error: function (model, response) {
                                    handleActionError({
                                        message: "An error was encountered retrieving the Consumer. Please contact the administrator if the problem persists."
                                    });
                                }
                            });
                        }
                    } else {
                        if (ui.item.noMatch !== undefined && ui.item.noMatch) {
                            that.model.set({
                                "consumer": null
                            });
                            that.setValue("");

                            that.$el.find(".consumerDetailsContainer").empty();
                        }
                    }
                },
                change: function (event, ui) {
                    if (ui.item === null || ui.item === undefined) {
                        that.model.set({
                            "ref": null,
                            "consumer": null
                        });
                        that.setValue("");
                        that.$el.find(".consumerDetailsContainer").empty();
                    }
                }
            }, this.autocomplete));
        }

    });

    $.common.RefsView = $.app.CompositeView.extend({

        initialize: function (options) {
            this.collection.on('reset', this.render, this);
            this.itemViewOptions = {
                collection: this.collection,
                jobModel: this.model,
                companyConfig: this.options.companyConfig,
                frameConfig: this.options.frameConfig
            };
        },

        events: {
            "click .widget-new-ref": "newRef"
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        modelEvents: {

        },

        newRef: function () {

            var ref = new $.booking.v2.ReferenceModel({
                company: this.model.get("company"),
                customer: this.model.get("customer")
            });
            this.collection.add(ref);
        },

        onRender: function () {
            /*if (this.collection.url) {
                this.collection.fetch();
            }*/
        },

        tagName: "section",

        template: "job/ref/refs",

        className: "booking booking-additional booking-additional-references",

        itemView: $.common.RefView,

        itemViewContainer: ".booking-additional-references-list"
    });

    $.common.IncidentalView = $.app.ItemView.extend({

        template: 'common/incidental/show',

        initialize: function (options) {
            this.model.bind('invalid', this.invalid, this);
            this.model.bind('error', this.error, this);
            this.model.bind('sync', this.render, this);
            this.booking = options.booking;
            this.companyPayableItemTypesAvailableMap = options.companyPayableItemTypesAvailableMap;
            this.refresh = options.refresh;

            var cpitMap = this.companyPayableItemTypesAvailableMap;

            if (!this.model.get("incidentalsAvailable")) {
                var incidentalsAvailable = {};
                for (var k in cpitMap) {
                    if (cpitMap.hasOwnProperty(k)) {
                        incidentalsAvailable[k] = cpitMap[k].payableItemType;
                    }
                }
                this.model.set("incidentalsAvailable", incidentalsAvailable);
            }

            if (this.model.get("type") && cpitMap[this.model.get("type").name]) {
                this.model.set("unitDescription", cpitMap[this.model.get("type").name].unitDescription);
            }
            // if the type is not in the available list, add it (this supports the case
            // where the incidental was added before being disabled)
            if (this.model.get("type") && !cpitMap[this.model.get("type").name]) {
                if (this.model.get("incidentalsAvailable")) {
                    this.model.get("incidentalsAvailable")[this.model.get("type").name] = this.model.get("type");
                }
            }

            if (this.model.get("type") && cpitMap[this.model.get("type").name] && cpitMap[this.model.get("type").name].fixedDescription) {
                this.model.set("descriptionLocked", true);
            }
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change input[type=file]": "getFile",
            'click #saveIncidental': 'save',
            'click #deleteIncidental': 'deleteIncidental',
            'click #addReceipt': 'addReceipt',
            'click #deleteReceipt': 'deleteReceipt',
            'click #viewReceipt': 'viewReceipt',
            'change #type': 'changeType'
        },

        modelEvents: {
            "change:clockTimeIn": "setDuration",
            "change:clockTimeOut": "setDuration"
        },

        getFile: function () {

            var that = this;
            var file = this.$("#receiptObj").prop("files")[0];

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
                    that.model.set("receiptObj", fileObj);
                };
                reader.onerror = function (evt) {
                    console.log("error reading file");
                };
            }

        },

        onRender: function () {

            // if (this.model.get("unitDescription")) {
            //     this.$el.find("#quantityLabel").text(this.model.get("unitDescription"));
            // }

            // this.$el.addClass("alert");
            // if (this.model.get("createdBy") != this.model.get("lastModifiedBy")) {
            //     this.$el.addClass("alert-warning");
            // } else {
            //     this.$el.addClass("alert-info");
            // }

            // Manually set date in case of old model (not new api)
            if (this.booking.get("uri") === undefined) {
                this.model.set("clockTimeIn", this.booking.get("expectedStartDate"));
                this.model.set("clockTimeOut", this.booking.get("expectedEndDate"));
            }

            this.callbacks(this.el, this.model);
            this.showSecured();
            this.formatElements();

            // // add nicer file input
            // this.$("#receiptObj").customFileInput({
            //     button_position: 'right'
            // });
            return this;
        },

        save: function (evt) {
            var that = this;

            this.model.save(null, {
                success: function (args) {
                    if (that.refresh) {
                        that.booking.fetch();
                    }
                    popupFetchOptions.success(args);
                },
                error: popupFetchOptions.error
            });
        },

        deleteIncidental: function (evt) {
            var that = this;
            this.model.destroy({}, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, true /* wait for response */ );
                    that.booking.fetch();
                },
                error: popupFetchOptions.error
            });

            this.remove();
        },

        changeType: function (evt) {
            var cpitMap = this.companyPayableItemTypesAvailableMap;

            var selected = cpitMap[this.model.get("type").name];

            if (selected.unitDescription) {
                this.model.set("unitDescription", selected.unitDescription);
            }
            // set default
            if (selected.fixedDescription) {
                this.model.set("description", selected.description);
                this.model.set("descriptionLocked", true);
            } else {
                this.model.set("description", this.model.get("type").name);
                this.model.set("descriptionLocked", false);
            }

            this.model.set("isBillable", selected.billable || false);
            this.model.set("isPayable", selected.payable || false);
            this.render();

            if (selected.payableItemType.name === "Clock (Hours)") {
                if (!this.model.get("clockTimeIn")) {
                    this.$el.find("#clockTimeInDate").val(this.templateHelpers.formatDate(this.booking.get("expectedStartDate"), this.booking.get("timeZone")));
                }

                if (!this.model.get("clockTimeOut")) {
                    this.$el.find("#clockTimeOutDate").val(this.templateHelpers.formatDate(this.booking.get("expectedStartDate"), this.booking.get("timeZone")));
                }
            }
        },

        addReceipt: function (evt) {
            var that = this;

            var opts = {
                parentEntityType: "incidental",
                parentEntityClass: "com.ngs.id.model.Incidental",
                parentEntityId: that.model.id,
                showFileType: false,
                documentType: App.dict.documentType.receipt.id
            };

            var view = new $.common.AddFileView({
                model: that.model,
                options: opts
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });
            modal.open();
            modal.listenTo(view, 'upload:complete', function (document) {
                that.model.set("receipt", document);
                that.model.save();
                modal.close();
            });
        },

        deleteReceipt: function () {

            // should the document itself be deleted? can only be done after successful save
            this.model.set("receipt", null);
            this.model.save();
        },

        viewReceipt: function () {

            if (this.model.get("receipt")) {
                // open colorbox programmatically

                // FQPath is the field name when embedded. After document save it is fQPath!
                $.colorbox({
                    iframe: true,
                    innerWidth: App.config.popups.doc.width,
                    innerHeight: App.config.popups.doc.height,
                    open: true,
                    href: App.config.context + "/" + (this.model.get("receipt").fQPath || this.model.get("receipt").FQPath),
                    returnFocus: false,
                    title: "Incidental Receipt"
                });
            }

            return false;
        },

        setDuration: function () {

            if (this.model.get('clockTimeIn') && this.model.get('clockTimeOut')) {
                var start = Date.fromISOString(this.model.get('clockTimeIn'));
                var end = Date.fromISOString(this.model.get('clockTimeOut'));
                var durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                this.model.set("durationHours", durationHours);
            }
        }
    }); // end incidental view

    $.common.IncidentalsView = $.app.CompositeView.extend({

        template: "common/incidentals/show",

        initialize: function (options) {

            this.booking = this.options.booking;
            //Refetching is currently enabled in financial consolidated screen only.
            this.refresh = this.options.refresh;
            // passed in or populated by xhr call
            if (options.companyPayableItemTypesAvailableMap) {

                this.companyPayableItemTypesAvailableMap = options.companyPayableItemTypesAvailableMap;

            } else {

                this.companyPayableItemTypesAvailableMap = {};

                var that = this;

                // load the list of incidental types enabled for this job
                var payableItemTypes = new $.core.CompanyPayableItemTypeCollection();
                payableItemTypes.url = App.config.context + "/api/companyPayableItemType/jobItems/" + this.options.booking.id;
                payableItemTypes.fetch({
                    success: function (types) {
                        // turn the types into a map for easy access
                        _.each(types.models, function (type) {
                            that.companyPayableItemTypesAvailableMap[type.get("payableItemType").name] = type.toJSON();
                        });

                        // this check is a work around to avoid fetching incidentals each time the
                        // incidental list is shown. this issue arose on the closing screen where
                        // the user can page back / forth between screens and the incidentals won't
                        // have been saved. Want to skip the refetch there as it clears what was previously
                        // added by the user. Want to re-visit this flow in general to avoid this special
                        // case. Currently we fetch the incidentals here as we want the available incidental
                        // list to be loaded before we start rendering the each incidental view,
                        // otherwise the "type" dropn down will be empty. Need to revisit the workflow
                        // around this.
                        if (!that.collection.noFetch) {
                            // only fetch actual incidentals after available map loaded
                            that.collection.fetch();
                        }
                    }
                });
            }
        },

        events: {
            'click .model-add': 'add',
            'click .getMileage': 'getMileage',
            'click .cmd-add-mileage-to': 'addMileageTo',
            'click .cmd-add-mileage-from': 'addMileageFrom'
        },

        itemViewOptions: function () {
            return {
                booking: this.booking,
                collection: this.collection,
                companyPayableItemTypesAvailableMap: this.companyPayableItemTypesAvailableMap,
                refresh: this.refresh,
                parent: this
            };
        },

        itemView: $.common.IncidentalView,

        itemViewContainer: '.incidentals',

        add: function (evt) {
            // incidental
            var incidental = new $.core.Incidental({
                'booking': {
                    id: this.booking.id
                },
                'company': {
                    id: App.config.company.id
                }
            });
            incidental.setDefaults(this.booking);

            this.collection.add(incidental);
        },

        getMileage: function (evt) {

            var url = App.config.context + "/address/directions?";
            var end = this.booking.get('actualLocation').addrEntered ? this.booking.get('actualLocation').addrEntered.replace('\n', ' ').replace('\r', ' ') : "";

            var contactId = this.booking.get('interpreter') ? this.booking.get('interpreter').id : "";

            if (contactId === "") {
                alert("No interpreter assigned.");
                return;
            }

            var contact = $.core.Contact.findOrCreate({
                'id': contactId
            });

            contact.fetch().done(function () {
                var start = contact.get('primaryAddress').addrEntered ? contact.get('primaryAddress').addrEntered.replace('\n', ' ').replace('\r', ' ') : "";

                var addressList = contact.get('addresses');

                url = url + "start=" + start + "&end=" + end;

                if (addressList.size() > 1) {
                    url = url + "&warn=Multiple Addresses Found for Interpreter! Please Verify the correct starting location!";
                }

                $.colorbox({
                    iframe: true,
                    innerWidth: 1000,
                    innerHeight: 800,
                    open: true,
                    href: url,
                    returnFocus: false,
                    title: 'Mileage'
                });

            }).fail(function () {
                handleActionError({
                    message: "An error was encountered retrieving the contact. Please contact the administrator if the problem persists."
                });
            });
        },

        addMileageTo: function () {

            // incidental
            var incidental = new $.core.Incidental({
                'booking': {
                    id: this.booking.id
                },
                'company': {
                    id: App.config.company.id
                },
                type: App.dict.payableItemType.mileage,
                description: "Mileage To",
                "descriptionLocked": true
            });
            incidental.setDefaults(this.booking);

            this.collection.add(incidental);

        },

        addMileageFrom: function () {

            // incidental
            var incidental = new $.core.Incidental({
                'booking': {
                    id: this.booking.id
                },
                'company': {
                    id: App.config.company.id
                },
                type: App.dict.payableItemType.mileage,
                description: "Mileage From",
                "descriptionLocked": true
            });
            incidental.setDefaults(this.booking);

            this.collection.add(incidental);

        }
    }); // end incidentals list view

    $.common.IncidentalInlineView = $.common.IncidentalView.extend({

        // override the regular incidental addReceipt
        addReceipt: function (evt) {
            // invoke file input dialog
            this.$("#receiptObj").click();
        },

        // override the regular incidental delete
        deleteIncidental: function (evt) {

            this.collection.remove(this.model);

            //this.remove();
        },

        template: "common/incidental/inline"
    });

    $.common.IncidentalsInlineView = $.common.IncidentalsView.extend({

        template: "common/incidentals/inline",

        itemView: $.common.IncidentalInlineView
    });

})(jQuery);
