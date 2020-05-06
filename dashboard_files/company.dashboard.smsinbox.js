(function ($) { //@ sourceURL=app/view/company.dashboard.smsinbox.js

    'use strict';

    var SMS_POLL_INTERVAL_MS = 60000;

    $.company = {};
    $.company.dashboard = {};
    $.company.dashboard.smsinbox = {};
    $.company.dashboard.smsinbox.helpers = {
        toE164: function (value) {
            if (value) {
                return value.replace(/[^0-9|\+]/g, "");
            }

            return null;
        },
        JOB_AUTOCOMPLETE_CONFIG: {
            url: "/api/company/" + App.config.company.id + "/booking",
            idAttr: 'id',
            displayAttr: function (item) {
                return {
                    id: item.id,
                    label: item.id + " - " + item["customer.label"] + " (" + item["language.label"] + ") "
                };
            },
            attrToSet: 'job',
            searchProperty: 'id'
        },
        CREATED_DATE_FILTER: {
            field: "createdDate",
            op: "ge",
            data: new Date().addDays(-1 * App.config.smsinbox.daysWindow).toString(App.config.company.config.dateFormat),
            type: "date",
            format: App.config.company.config.dateFormat
        },
        notificationModelFromSmsModel: function (smsModel) {
            var contact = smsModel.get("contact");
            var associations = [];

            if (contact) {
                associations = [{
                    contact: contact
                }];
            }

            return new Backbone.Model({
                body: smsModel.get("body"),
                e164From: $.company.dashboard.smsinbox.helpers.toE164(App.config.company.config.smsNumber),
                e164To: $.company.dashboard.smsinbox.helpers.toE164(smsModel.get("recipient")),
                parentEntityId: smsModel.get("jobId"),
                parentEntityType: "booking",
                createdDate: moment().utc().format(),
                associations: associations
            });
        },
        resolveJobName: function (booking) {
            return booking.id + " - " + booking.customer.displayName + " (" + booking.language.displayName + ")";
        },
        resolveInterpreterName: function (contact) {
            if (contact.displayName) {
                return contact.displayName;
            } else if (contact.name) {
                return contact.name + " (" + contact.id + ")";
            }
        }
    };
    $.company.dashboard.smsinbox.views = {};

    $.company.dashboard.smsinbox.views.JobSelectorModalView = $.app.ItemView.extend({
        template: "company/dashboard/job-selector",
        events: {
            "click .accept": "accept",
            "keyup #job": "inputChanged",
            "click .cmd-widget-clear-job": "clearJob"
        },
        initialize: function () {
            this.model = new Backbone.Model();
        },
        onRender: function () {
            var that = this;

            var $modalEl = $("#modalContainer");
            $modalEl.html(this.el);
            $modalEl.modal();

            $.common.generateAutoComplete(
                $("#job"),
                $.company.dashboard.smsinbox.helpers.JOB_AUTOCOMPLETE_CONFIG,
                this.model,
                function (jobId) {
                    that.model.set("job", jobId);
                    that.$el.find(".accept").prop("disabled", false);
                    that.$el.find("input").prop("disabled", true);
                }
            );
        },
        accept: function (ev) {
            this.trigger('onJobSelected', this.model);
            var $modalEl = $("#modalContainer");
            $modalEl.modal("hide");
            this.remove();
        },
        clearJob: function (ev) {
            this.model.set("job", null);
            this.$el.find("input").val("");
            this.$el.find("input").prop("disabled", false);
            this.$el.find(".accept").prop("disabled", true);
        }
    });

    $.company.dashboard.smsinbox.views.SmsMessageView = $.app.ItemView.extend({
        template: 'company/dashboard/sms-message',
        onRender: function () {
            this.formatElements();

            this.$el.find(".sms-message-from").tooltip({
                placement: "left"
            });

            this.$el.find(".sms-message-to").tooltip({
                placement: "right"
            });
        },
        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, {
                user: App.config.user,
                smsE164: $.company.dashboard.smsinbox.helpers.toE164(App.config.company.config.smsNumber),
                fromName: this.resolveFromName(),
                toName: this.resolveToName()
            });
        },
        resolveFromName: function () {
            var associations = this.model.get("associations");
            var na = associations.find(function (na) {
                return na.contact;
            });
            return na ? $.company.dashboard.smsinbox.helpers.resolveInterpreterName(na.contact) : this.model.get("e164From");
        },
        resolveToName: function () {
            var associations = this.model.get("associations");
            var na = associations.find(function (na) {
                return na.contact;
            });
            return na ? $.company.dashboard.smsinbox.helpers.resolveInterpreterName(na.contact) : this.model.get("e164To");
        }
    });

    $.company.dashboard.smsinbox.views.SmsNoMessagesView = $.app.ItemView.extend({
        template: 'company/dashboard/sms-inbox-no-messages'
    });

    $.company.dashboard.smsinbox.views.SmsMessagesView = $.app.CompositeView.extend({
        template: 'company/dashboard/sms-messages',
        itemView: $.company.dashboard.smsinbox.views.SmsMessageView,
        events: {
            "change input": "synchModel",
            "change select": "synchModel",
            "click #send": "send",
            "change [name=body]": "synchModel",
            "keyup [name=body]": "updateFieldsState",
            "keyup [name=recipient]": "recipientKeyUp",
            "change [name=recipient]": "recipientChanged",
            "change [name=templateNameKey]": "loadTemplate",
            "change [name=recipientType]": "loadRecipient",
            "click .cmd-widget-clear-job": "clearJob"
        },

        initialize: function (options) {
            _.extend(this, $.app.mixins.templateHelpersMixin);
            _.bindAll(this, "checkForNewMessages");

            var that = this;

            this.templates = new $.core.SmsTemplateCollection([], {
                'company.id': App.config.company.id
            });
            this.templates.fetch({
                success: function () {
                    that.renderTemplateOptions();
                }
            });
            this.model = new $.core.SmsModel();
            this.collection = options.collection;
            this.groupingModel = options.groupingModel;
            this.booking = options.booking;

            if (this.booking) {
                var jobName = $.company.dashboard.smsinbox.helpers.resolveJobName(this.booking);
                that.updateFieldsState();
                that.loadParticipants(jobName);
            } else if (this.groupingModel && this.groupingModel.get("e164To")) {
                this.model.set("fixedRecipient", true);
            }

            this.newMessagesCheckInterval = setInterval(this.checkForNewMessages, SMS_POLL_INTERVAL_MS);
        },

        onBeforeClose: function () {
            clearInterval(this.newMessagesCheckInterval);
        },

        checkForNewMessages: function () {
            if (this.collection) {
                var previousLastMessageTimestamp = this.lastMessageTimestamp(this.collection);
                var that = this;
                this.collection.fetch({
                    success: function (collection) {
                        var currentLastSmsTimestamp = that.lastMessageTimestamp(collection);

                        if (currentLastSmsTimestamp > previousLastMessageTimestamp) {
                            that.collection.reset(collection.models);
                            that.scrollToBottom();
                        }
                    }
                });
            }
        },

        lastMessageTimestamp: function (collection) {
            var timestamps = collection
                .models
                .map(function (model) {
                    return new Date(model.get("createdDate")).getTime();
                });
            return [].slice.apply(timestamps); // equivalent for ES 6 spread operator
        },

        appendHtml: function (collectionView, itemView, index) {
            collectionView.$('.sms-messages').prepend(itemView.el);
        },

        serializeData: function () {
            var name = null;

            if (this.groupingModel) {
                if (this.groupingModel.get('booking.id')) {
                    name = "Job #" + this.groupingModel.get('booking.id') + " - " + this.groupingModel.get("customerName") + " (" + this.groupingModel.get("languageName") + ")";
                } else if (this.groupingModel.get('e164To')) {
                    name = this.groupingModel.get('e164To');
                } else {
                    name = this.groupingModel.get('createdBy');
                }
            }

            return _.extend({
                obj: this.model.toJSON()
            }, {
                name: name,
                templates: this.templates,
                interpreterNumber: !!this.interpreterNumber,
                requestorNumber: !!this.requestorNumber,
                consumerNumber: !!this.consumerNumber
            });
        },

        send: function (ev) {
            var that = this;
            var contact = this.resolveContact();

            this.model.set("jobId", this.booking.id);
            this.model.set("contact", contact);

            this.model.save({}, {
                success: function () {
                    that.$el.find("[name=body]").val("");
                    that.$el.find("[name=body]").focus();
                }
            });

            var notificationModel = $.company.dashboard.smsinbox.helpers.notificationModelFromSmsModel(this.model);
            this.collection.add(notificationModel);
            this.render();

            return false;
        },

        resolveContact: function () {
            if (this.groupingModel.get("e164To")) {
                return this.groupingModel.get("contact");
            } else {
                return this.model.get("contact");
            }
        },

        resolveRecipient: function () {
            if (this.groupingModel && this.groupingModel.get("e164To")) {
                return this.groupingModel.get("e164To");
            }

            return null;
        },

        setupJobAutocomplete: function () {
            var that = this;
            $.common.generateAutoComplete(
                this.$el.find("#job"),
                $.company.dashboard.smsinbox.helpers.JOB_AUTOCOMPLETE_CONFIG,
                this.model,
                function (jobId) {
                    that.interpreterJob = new $.visit.v2.InterpreterVisitModel({
                        id: jobId
                    });
                    that.interpreterJob.fetch({
                        success: function (m) {
                            that.booking = m.toJSON();
                            var jobName = $.company.dashboard.smsinbox.helpers.resolveJobName(that.booking);

                            if (!that.groupingModel.get("e164To")) {
                                that.loadParticipants(jobName);
                            }

                            that.updateFieldsState();
                        }
                    });
                }
            );

            if (this.booking) {
                this.$el.find("#job").val($.company.dashboard.smsinbox.helpers.resolveJobName(this.booking));
            }
        },

        renderTemplateOptions: function () {
            var optionTemplate = _.template('<option <@ if (selected) { @> selected="selected" <@ } @> value="<@-value@>"><@-display@></option>');
            var list = this.templates.toJSON();
            list.unshift({
                value: null,
                name: "[Load Template]"
            });

            this.$el.find("[name=templateNameKey]").empty();

            var that = this;
            list.forEach(function (elmt) {
                that.$el.find("[name=templateNameKey]").append(optionTemplate({
                    selected: null,
                    value: elmt.nameKey,
                    display: elmt.name
                }));
            });
        },

        onRender: function () {
            this.renderTemplateOptions(this.templates);
            this.setSelect(this.el, this.model, 'action');

            if (!this.interpreterJob) {
                this.model.set("recipient", this.resolveRecipient());
                this.$el.find("[name=recipient]").val(this.model.get("recipient"));
            }

            this.setupJobAutocomplete();
            this.updateFieldsState();
            this.scrollToBottom();
        },

        scrollToBottom: function () {
            var scroll = this.$el.find('.sms-messages')[0] ? this.$el.find('.sms-messages')[0].scrollHeight : 0;
            this.$el.find('.sms-messages').scrollTop(scroll);
        },

        focusNewMessage: function () {
            this.$el.find("input[name=message]").focus();
        },

        getTemplate: function () {
            return _.isEmpty(this.collection) ? 'company/dashboard/sms-inbox-no-messages' : 'company/dashboard/sms-messages';
        },

        loadRecipient: function (evt) {
            var that = this;

            var recipientType = this.model.get("recipientType");

            if (recipientType === "int") {

                var interpreter = this.booking.interpreter;
                if (interpreter) {
                    this.model.set("contact", interpreter);
                    this.interpreterNumber = this.resolveInterpreterNumber(interpreter);
                    this.$("[name=recipient]")
                        .val(this.interpreterNumber)
                        .trigger('change');
                }

            } else if (recipientType === "cus") {

                var requestor = this.booking.requestor;
                if (requestor) {
                    this.model.set("requestor", this.requestor);
                    new $.core.Requestor({
                        id: requestor.id
                    }).fetch({
                        success: function (m) {
                            that.requestorNumber = m.get("number");
                            that.$("[name=recipient]").val(that.requestorNumber).trigger('change');
                        }
                    });
                }

            } else if (recipientType === "con") {

                var consumer = this.booking.consumer;
                if (consumer) {
                    this.model.set("consumer", this.consumer);
                    $.core.Consumer.findOrCreate({
                        id: consumer.id
                    }).fetch({
                        success: function (m) {
                            that.consumerNumber = m.get("phoneNumber");
                            that.$("[name=recipient]").val(that.consumerNumber).trigger('change');
                        }
                    });
                }

            } else {
                this.$("[name=recipient]").val("").trigger('change');
            }
        },

        loadTemplate: function (evt) {
            var templateNameKey = this.model.get("templateNameKey");
            var template = this.templates.findWhere({
                nameKey: templateNameKey
            });
            this.model.set({
                "templateId": template ? template.id : null
            });

            this.$("[name=body]").val(template ? template.get("body") : "").trigger('change');
        },

        resolveViewType: function () {
            var viewType;

            if (this.groupingModel) {
                if (this.groupingModel.get("booking.id")) {
                    viewType = "job";
                } else if (this.groupingModel.get("createdBy")) {
                    viewType = "sender";
                } else if (this.groupingModel.get("recipient")) {
                    viewType = "interpreter";
                }
            }

            return viewType;
        },

        recipientKeyUp: function () {
            this.updateFieldsState();
        },

        recipientChanged: function (ev) {
            var selfOriginatedEvent = ev.srcElement === ev.currentTarget;
            var sameValue = this.interpreterNumber === ev.target.value;
            var recipientValueModified = selfOriginatedEvent || !sameValue;

            if (recipientValueModified) {
                if (ev.target.value !== this.interpreterNumber) {
                    this.model.set("contact", null);
                }
                if (ev.target.value !== this.requestorNumber) {
                    this.model.set("requestor", null);
                }
                if (ev.target.value !== this.consumerNumber) {
                    this.model.set("consumer", null);
                }
            }
            this.updateFieldsState();
        },

        updateFieldsState: function () {
            var viewType = this.resolveViewType();

            var hasBody = this.$el.find("[name='body']").val();
            var hasRecipient = this.$el.find("[name='recipient']").val();
            var hasJob = !!this.booking;

            this.$el.find("#send").prop("disabled", !hasBody || !hasRecipient || !hasJob);
            this.$el.find("#job").prop("disabled", hasJob);

            if (viewType === "job" || !hasJob) {
                this.$el.find(".cmd-widget-clear-job").addClass("hidden");
            } else {
                this.$el.find(".cmd-widget-clear-job").removeClass("hidden");
            }
        },

        clearJob: function (ev) {
            this.$el.find("#job").val(null);
            this.booking = null;
            this.updateFieldsState();
            ev.preventDefault();
        },

        resolveInterpreterNumber: function (interpreter) {
            var number;

            if (interpreter) {
                if (interpreter.primaryNumber) {
                    number = interpreter.primaryNumber.parsedNumber;
                } else {
                    number = interpreter.primaryNumberLabel;
                }
            }

            return number;
        },

        loadParticipants: function (jobName) {
            var that = this;

            this.interpreter = this.booking.interpreter;
            this.interpreterNumber = this.resolveInterpreterNumber(this.interpreter);

            var requestor = this.booking.requestor;
            if (requestor) {
                this.requestor = new $.core.Requestor({
                    id: requestor.id
                });
                this.requestor.fetch({
                    success: function (model) {
                        that.requestorNumber = model.get("number");
                        that.render();
                        that.$el.find("#job").val(jobName);
                        that.updateFieldsState();
                    }
                });
            }

            var consumer = this.booking.consumer;
            if (consumer) {
                this.consumer = $.core.Consumer.findOrCreate({
                    id: consumer.id
                });
                this.consumer.fetch({
                    success: function (model) {
                        that.consumerNumber = model.get("phoneNumber");
                        that.render();
                        that.$el.find("#job").val(jobName);
                        that.updateFieldsState();
                    }
                });
            }
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView = $.app.ItemView.extend({
        template: 'company/dashboard/sms-sidebar-item',
        initialize: function (options) {
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
            this.model = new Backbone.Model({});
            this.notificationModel = options[0].notificationModel;
            this.listenTo(this.notificationModel, 'onSelected', this.selectItem);
        },
        events: {
            "click a.itemdata": "itemClicked",
            "click #viewinterpreterschedule": "viewInterpretersSchedule",
            "click #assigntojob": "assignToJob",
            "click .widget-view-more": "viewMoreAction"
        },
        onRender: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
            this.formatElements();
        },
        itemClicked: function (ev) {
            this.trigger('onItemClicked', this.notificationModel);
            this.selectItem();
        },
        selectItem: function () {
            this.$el.parent().children().removeClass("active");
            this.$el.addClass("active");
        },
        viewInterpretersSchedule: function (ev) {
            var jobModel = this.notificationModel.get("job");
            var interpreterId = jobModel.get("interpreter.id");
            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.cal.width,
                innerHeight: App.config.popups.cal.height,
                open: false,
                returnFocus: false,
                title: 'Interpreter Bookings',
                href: App.config.context + '/calendar/interpreter/' + interpreterId + '/bookings'
            });
        },
        assignToJob: function (ev) {
            var jobModel = this.notificationModel.get("job");
            var jobId = jobModel.get("id");
            var interpreterId = jobModel.get("interpreter.id");
            var interpreterJob = new $.visit.v2.InterpreterVisitModel({
                id: jobId
            });
            interpreterJob.assign({
                "job.id": jobId,
                "interpreter.id": interpreterId,
                "ignoreAssignment": true
            });
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarItemBaseJobView = $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.extend({
        initialize: function () {
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
            $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.prototype.initialize.call(this, arguments);

            this.model = new $.visit.v2.InterpreterVisitModel({
                id: this.notificationModel.get("booking.id")
            });
        },
        serializeData: function () {
            var json = this.notificationModel.toJSON();
            return {
                obj: _.extend(json, {
                    title: json["booking.id"] + " - " + json.customerName
                })
            };
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarItemBaseInterpreterView = $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.extend({
        initialize: function () {
            $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.prototype.initialize.call(this, arguments);
        },
        onRender: function () {
            $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.prototype.onRender.call(this, arguments);
            this.$el.find(".actions-dropdown").hide();
        },
        serializeData: function () {
            var json = this.notificationModel.toJSON();
            return {
                obj: _.extend(json, {
                    title: json.contact ? $.company.dashboard.smsinbox.helpers.resolveInterpreterName(json.contact) : json.e164To
                })
            };
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarItemBaseSenderView = $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.extend({
        initialize: function () {
            $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.prototype.initialize.call(this, arguments);
        },
        onRender: function () {
            $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView.prototype.onRender.call(this, arguments);
            this.$el.find(".actions-dropdown").hide();
        },
        serializeData: function () {
            var json = this.notificationModel.toJSON();
            return {
                obj: _.extend(json, {
                    title: json.createdBy
                })
            };
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarBaseView = $.app.CollectionView.extend({
        initialize: function () {
            var that = this;
            this.collection = new $.core.NotificationCollection();
            this.collection.queryParams.rows = 10;
            this.collection.queryParams.page = 1;
            this.collection.queryParams.sidx = "createdDate";
            this.collection.queryParams.sord = "desc";
            this.collection.on('sync', function () {
                that.trigger('doneLoading', that);
            });
        },
        onAfterItemAdded: function (viewInstance) {
            this.listenTo(viewInstance, 'onItemClicked', this.itemClicked);
        },
        itemClicked: function (itemModel) {
            this.trigger('onItemClicked', itemModel);
        },
        refreshFilteredCollection: function () {
            this.fetchGroupedCollection(this.groupBy);
        },
        filterCollection: function (filter) {
            this.filter = filter;
            this.fetchGroupedCollection(this.groupBy);
        },
        fetchGroupedCollection: function (groupBy) {
            this.$el.empty();
            this.groupBy = groupBy;
            var filters = new $.filterbuilder
                .init()
                .add({
                    field: "type.id",
                    op: "eq",
                    data: App.dict.notificationType.sms.id
                })
                .add($.company.dashboard.smsinbox.helpers.CREATED_DATE_FILTER)
                .add({
                    field: "parentEntityType",
                    op: "eq",
                    data: "booking"
                })
                .add(this.filter, !!this.filter)
                .toString();

            // query component for grouping
            var projectionsJSON = {
                rules: [{ // group by parent entity id
                        projectionName: "groupProperty",
                        field: groupBy,
                        name: groupBy
                    },
                    { // get max created date for each grouping
                        projectionName: "max",
                        field: "createdDate",
                        name: "createdDate"
                    },
                    { // total notifications in each grouping
                        projectionName: "count",
                        field: "id",
                        name: "total"
                    },
                    { // job: additional fields to include
                        projectionName: "property",
                        field: "customer.name",
                        name: "customerName"
                    },
                    { // job: additional fields to include
                        projectionName: "property",
                        field: "language.iso639_3Tag",
                        name: "languageCode"
                    },
                    { // job: additional fields to include
                        projectionName: "property",
                        field: "language.description",
                        name: "languageName"
                    },
                    { // job: additional fields to include
                        projectionName: "property",
                        field: "associations.booking",
                        name: "booking"
                    },
                    {
                        projectionName: "property",
                        field: "associations.contact",
                        name: "contact"
                    }
                ]
            };

            //projections.rules.push({"projectionName": "count", field: "id", name: "unread"}); // no way to easily get unread at the moment
            // specify additional fields (non-grouped) to return
            // projectionsJSON.rules.push({"projectionName": "property", field: "field-name"});

            this.collection.queryParams.filters = filters;
            this.collection.queryParams.projections = JSON.stringify(projectionsJSON);
            this.collection.queryParams.rows = -1;
            this.collection.fetch();
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarSendersView = $.company.dashboard.smsinbox.views.SmsSidebarBaseView.extend({
        itemView: $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView,
        buildItemView: function (item, ItemViewType, itemViewOptions) {
            return new $.company.dashboard.smsinbox.views.SmsSidebarItemBaseSenderView(
                _.extend({
                    notificationModel: item
                }, itemViewOptions)
            );
        },
        initialize: function () {
            $.company.dashboard.smsinbox.views.SmsSidebarBaseView.prototype.initialize.call(this, arguments);
            this.filter = new $.filterbuilder
                .init()
                .add({
                    field: "e164From",
                    op: "eqw",
                    data: $.company.dashboard.smsinbox.helpers.toE164(App.config.company.config.smsNumber)
                })
                .addGroup("NOT")
                .add({
                    field: "createdBy",
                    op: "eq",
                    data: "javaassist~class"
                })
                .done()
                .build();
        },
        onRender: function () {
            this.fetchGroupedCollection("createdBy");
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarInterpretersView = $.company.dashboard.smsinbox.views.SmsSidebarBaseView.extend({
        itemView: $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView,
        buildItemView: function (item, ItemViewType, itemViewOptions) {
            return new $.company.dashboard.smsinbox.views.SmsSidebarItemBaseInterpreterView(
                _.extend({
                    notificationModel: item
                }, itemViewOptions)
            );
        },
        initialize: function () {
            $.company.dashboard.smsinbox.views.SmsSidebarBaseView.prototype.initialize.call(this, arguments);
            this.filter = new $.filterbuilder
                .init()
                .addGroup("NOT")
                .add({
                    field: "e164To",
                    op: "eqw",
                    data: $.company.dashboard.smsinbox.helpers.toE164(App.config.company.config.smsNumber)
                })
                .done()
                .build();
        },
        onRender: function () {
            this.fetchGroupedCollection("e164To");
        }
    });

    $.company.dashboard.smsinbox.views.SmsSidebarJobsView = $.company.dashboard.smsinbox.views.SmsSidebarBaseView.extend({
        itemView: $.company.dashboard.smsinbox.views.SmsSidebarItemBaseView,
        buildItemView: function (item, ItemViewType, itemViewOptions) {
            return new $.company.dashboard.smsinbox.views.SmsSidebarItemBaseJobView(
                _.extend({
                    notificationModel: item
                }, itemViewOptions)
            );
        },
        initialize: function () {
            $.company.dashboard.smsinbox.views.SmsSidebarBaseView.prototype.initialize.call(this, arguments);
        },
        onRender: function () {
            this.fetchGroupedCollection("booking.id");
        }
    });

    $.company.dashboard.smsinbox.views.SmsInboxHeaderView = $.app.ItemView.extend({
        template: 'company/dashboard/sms-inbox-header',
        events: {
            'change select': 'changeView',
            'change input': 'synchModel',
            'click .sms-search': 'search',
            'click .widget-send-adhoc-sms': 'sendAdHocSms',
            'click .btn-refresh': 'refresh'
        },
        sendAdHocSms: function (ev) {
            var modalView = new $.company.dashboard.smsinbox.views.JobSelectorModalView();
            modalView.render();
            this.listenTo(modalView, "onJobSelected", this.onJobSelected);
        },
        onJobSelected: function (jobModel) {
            var that = this;
            var bookingModel = new $.visit.v2.InterpreterVisitModel({
                id: jobModel.get("job")
            });
            bookingModel.fetch({
                success: function (model) {
                    var sms = new $.core.SmsModel({
                        jobId: jobModel.get("job")
                    });
                    var adHocSmsView = new $.common.AdHocSmsView({
                        model: sms,
                        interpreterJob: model
                    });
                    adHocSmsView.render();
                    adHocSmsView.on("send", function () {
                        sms.save({}, {
                            success: function () {
                                // var jsonFilter = that.buildSearchFilter();
                                // that.trigger('onSearch', jsonFilter);
                                that.trigger("adhocSmsSent", sms);
                                $("#modalContainer").modal('hide');
                                popupFetchOptions.success(arguments);
                            },
                            error: popupFetchOptions.error
                        });
                    });
                }
            });
        },
        changeView: function (ev) {
            this.synchModel(ev);
            this.trigger('groupingChanged', this.model.get('group'));
        },
        initialize: function () {
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
            this.model = new Backbone.Model();
        },
        buildSearchFilter: function () {
            var searchstring = this.model.get('searchstring');
            var jsonFilter = searchstring ? {
                groupOp: 'OR',
                rules: [{
                        field: 'e164To',
                        op: 'bw',
                        data: searchstring
                    },
                    {
                        field: 'parentEntityId',
                        op: 'bw',
                        data: searchstring
                    },
                    {
                        field: 'e164From',
                        op: 'bw',
                        data: searchstring
                    }
                ]
            } : null;
            return jsonFilter;
        },
        search: function (ev) {
            var jsonFilter = this.buildSearchFilter();
            this.trigger('onSearch', jsonFilter);
            return false;
        },
        refresh: function (ev) {
            this.trigger('refreshInbox');
            return false;
        }
    });

    $.company.dashboard.smsinbox.views.SmsInboxView = $.app.LayoutView.extend({
        template: 'company/dashboard/sms-inbox',
        selectedView: 'job',
        regions: {
            header: '#header',
            sidebar: '#sidebar',
            messages: '#messages'
        },
        initialize: function () {
            this.sidebarGroupingView = {
                'job': $.company.dashboard.smsinbox.views.SmsSidebarJobsView,
                'interpreter': $.company.dashboard.smsinbox.views.SmsSidebarInterpretersView,
                'sender': $.company.dashboard.smsinbox.views.SmsSidebarSendersView
            };
        },
        refreshView: function () {
            var sidebarRegion = this.regionManager.get("sidebar");
            if (sidebarRegion) {
                sidebarRegion.currentView.refreshFilteredCollection();
            }
        },
        onRender: function () {
            var headerView = new $.company.dashboard.smsinbox.views.SmsInboxHeaderView();
            this.listenTo(headerView, 'refreshInbox', this.refreshView);
            this.listenTo(headerView, 'groupingChanged', this.selectView);
            this.listenTo(headerView, 'onSearch', this.search);
            this.listenTo(headerView, 'adhocSmsSent', this.adHocSmsSent);

            this.header.show(headerView);
            this.messages.show(new $.company.dashboard.smsinbox.views.SmsMessagesView({}));

            this.selectView(this.selectedView);
        },
        doneLoading: function (sidebarView) {
            if (sidebarView.collection !== null && sidebarView.collection.size() > 0) {
                this.selectConversation(sidebarView.collection.first());
            }
        },
        selectView: function (groupBy) {
            this.selectedView = groupBy;
            this.sidebarView = new this.sidebarGroupingView[groupBy]({
                el: $("#sidebarcontainer")
            });
            this.listenTo(this.sidebarView, 'onItemClicked', this.selectConversation);
            this.listenTo(this.sidebarView, 'doneLoading', this.doneLoading);

            this.sidebar.show(this.sidebarView);
        },
        requestMessages: function (filters, selectedModel, booking) {
            var that = this;
            var notificationCollection = new $.core.NotificationCollection();
            notificationCollection.queryParams.filters = filters.toString();
            notificationCollection.queryParams.rows = -1;
            notificationCollection.queryParams.fields = "e164From,e164To,createdDate,body,associations,contact,parentEntityId";
            notificationCollection.queryParams.embedded = "associations";
            notificationCollection.comparator = function (model) {
                return -1 * new Date(model.get("createdDate")).getTime();
            };
            notificationCollection.fetch({
                success: function () {
                    that.messagesView.scrollToBottom();
                    that.messagesView.focusNewMessage();
                }
            });

            this.messagesView = new $.company.dashboard.smsinbox.views.SmsMessagesView({
                collection: notificationCollection,
                groupingModel: selectedModel,
                booking: booking
            });
            this.messages.show(this.messagesView);
        },
        buildJobFilters: function (selectedModel) {
            var filters = new $.filterbuilder
                .init()
                .add($.company.dashboard.smsinbox.helpers.CREATED_DATE_FILTER)
                // .add({
                //     field: "parentEntityId",
                //     op: "eq",
                //     data: selectedModel.get("booking.id")
                // })
                // filter should be on association table. how are other filters impacted??
                .add({
                    field: "booking.id",
                    op: "eq",
                    data: selectedModel.get("booking.id")
                })
                .add({
                    field: "type.id",
                    op: "eq",
                    data: App.dict.notificationType.sms.id
                });
            return filters;
        },
        buildSenderFilters: function (selectedModel, idsFilter) {
            var filters = new $.filterbuilder
                .init()
                .add($.company.dashboard.smsinbox.helpers.CREATED_DATE_FILTER)
                .add({
                    field: "type.id",
                    op: "eq",
                    data: App.dict.notificationType.sms.id
                })
                .addGroup("OR")
                .addGroup("AND")
                .add({
                    field: "createdBy",
                    op: "eqw",
                    data: selectedModel.get("createdBy")
                })
                .add(idsFilter)
                .done()
                .addGroup("AND")
                .add({
                    field: "e164To",
                    op: "eqw",
                    data: $.company.dashboard.smsinbox.helpers.toE164(App.config.company.config.smsNumber)
                })
                .add(idsFilter)
                .done()
                .done();
            return filters;
        },
        buildInterpreterFilters: function (selectedModel) {
            var filters = new $.filterbuilder
                .init()
                .add($.company.dashboard.smsinbox.helpers.CREATED_DATE_FILTER)
                .addGroup("NOT")
                .add({
                    field: "parentEntityId",
                    op: "eq",
                    data: "null"
                })
                .done()
                .addGroup("OR")
                .addGroup("AND")
                .add({
                    field: "e164From",
                    op: "eqw",
                    data: $.company.dashboard.smsinbox.helpers.toE164(App.config.company.config.smsNumber)
                })
                .add({
                    field: "e164To",
                    op: "eqw",
                    data: selectedModel.get("e164To")
                })
                .done()
                .addGroup("AND")
                .add({
                    field: "e164From",
                    op: "eqw",
                    data: selectedModel.get("e164To")
                })
                .add({
                    field: "e164To",
                    op: "eqw",
                    data: $.company.dashboard.smsinbox.helpers.toE164(App.config.company.config.smsNumber)
                })
                .done()
                .done();
            return filters;
        },
        buildBookingIdsFilter: function (idsModelCollection) {
            var idsFilter = new $.filterbuilder
                .init({
                    groupOp: "OR",
                    rules: []
                });

            idsModelCollection
                .map(function (v) {
                    return v.get("id");
                })
                .filter(function (v) {
                    return v;
                })
                .forEach(function (id) {
                    idsFilter.add({
                        field: "booking.id",
                        op: "eq",
                        data: id
                    });
                });

            return idsFilter;
        },
        selectConversation: function (selectedModel) {
            selectedModel.trigger("onSelected");

            var that = this;

            if (selectedModel.get("booking.id")) {
                var jobFilters = this.buildJobFilters(selectedModel);
                this.requestMessages(jobFilters, selectedModel, selectedModel.get("booking"));
            } else if (selectedModel.get("createdBy")) {

                var nc = new $.core.NotificationCollection();
                nc.queryParams.projections = JSON.stringify({
                    rules: [{
                        projectionName: "distinct",
                        field: "booking.id",
                        name: "id"
                    }]
                });
                nc.queryParams.filters = new $.filterbuilder
                    .init()
                    .add({
                        field: "createdBy",
                        op: "eqw",
                        data: selectedModel.get("createdBy")
                    })
                    .toString();
                nc.queryParams.rows = 999;
                nc.fetch({
                    success: function (m) {
                        var idsFilter = that.buildBookingIdsFilter(m).build();
                        var senderFilters = that.buildSenderFilters(selectedModel, idsFilter);
                        that.requestMessages(senderFilters, selectedModel, null);
                    }
                });

            } else {
                var interpreterFilters = this.buildInterpreterFilters(selectedModel);
                this.requestMessages(interpreterFilters, selectedModel, null);
            }
        },
        search: function (jsonfilter) {
            var sidebarRegion = this.regionManager.get("sidebar");

            if (sidebarRegion) {
                sidebarRegion.currentView.filterCollection(jsonfilter);
            }
        },
        adHocSmsSent: function (smsModel) {
            // check that there are messages shown to add to.
            if (this.messagesView) {

                var sameJob = this.messagesView.groupingModel.get("booking.id") === smsModel.get("jobId");
                var sameInterpreter = this.messagesView.groupingModel.get("e164To") === $.company.dashboard.smsinbox.helpers.toE164(smsModel.get("recipient"));
                var sameSender = this.messagesView.groupingModel.get("createdBy") === App.config.user;
                var shouldAddToCollection = sameJob || sameInterpreter || sameSender;

                if (shouldAddToCollection) {
                    var notificationModel = $.company.dashboard.smsinbox.helpers.notificationModelFromSmsModel(smsModel);
                    this.messagesView.collection.add(notificationModel);
                    this.messagesView.render();
                }
            }
        }
    });

})(jQuery);
