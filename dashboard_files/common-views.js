/*
 * Copyright (C) 2013 Interpreter Intelligence, Inc. <support@interpreterintelligence.com>
 *
 * <copyright notice>
 *
 */

(function ($) { //# sourceURL=app/view/common-views.js

    /* enable strict mode */
    "use strict";

    // namespace for common views
    $.common = $.common || {};


    // 11/15/18 CP - why is this needed here?
    var filtersJSON = {
        groupOp: "AND",
        rules: []
    };

    $.common.bookingAdapter = function (start, end, callback) {
        filtersJSON = addOrUpdateFilter(filtersJSON, "expectedStartDate", "ge", start.toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
        filtersJSON = addOrUpdateFilter(filtersJSON, "expectedStartDate", "le", end.toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);

        $.ajax({
            url: App.config.context + '/api/company/' + App.config.company.id + '/booking',
            dataType: 'json',
            data: {
                filters: JSON.stringify(filtersJSON),
                rows: 1000
            },
            success: function (doc) {
                var events = [];

                events = initializeCalendarEvents(doc);

                callback(events);
            }
        });
    };




    // views ////////////////////////////////////////////////////////

    $.common.Template = $.app.BaseView.extend({
        tagName: "div",

        className: "common",

        initialize: function () {
            _.bindAll(this, "render", "renderRateZoneGroupSummary", "filterRateZoneGroups"); // to solve the this issue
            this.model.bind('reset', this.render);
            this.model.bind('change', this.render);
            this.model.bind('add', this.renderRateZoneGroupSummary);
        },

        events: {
            'keyup #filter': 'filterRateZoneGroups'
        },

        render: function () {

            //reset the list view
            this.$('ul#rateZoneGroups > li').remove();
            this.model.each(this.renderRateZoneGroupSummary);
            return $(this.el).html();
        },

        filterRateZoneGroups: filterList,

        renderRateZoneGroupSummary: function (item) {
            var rateZoneGroupSummaryView = new $.ratezone.RateZoneGroupSummaryView({
                model: item
            });
            this.$('ul#rateZoneGroups').append($(rateZoneGroupSummaryView.render().el));
        }
    });

    // basics view for created by / date, last modified by / date
    $.common.BasicsView = $.app.ItemView.extend({

        tagName: "div",

        className: "basics",

        template: "common/basics/show",

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            //this.render();
        },

        onRender: function () {

            if (this.options.dateFormat == 'UTC') {
                this.formatElements();
            }

            return this;
        }

    });

    // basics view for booking information
    $.common.BookingBasicsView = $.app.ItemView.extend({

        tagName: "div",

        className: "basics",

        template: "common/bookingbasics/show",

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            //this.render();
        },

        onRender: function () {

            this.formatElements();

            return this;
        }

    });

    // recurring group confirm view for updates to booking in recurring group
    $.common.RecurringBookingGroupUpdateView = $.app.BaseView.extend({

        template: JST["common/recurringbookinggroup/update"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.render();
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click .close": "cancel",
            "click #cancel": "cancel",
            "click #save": "save"
        },

        render: function () {

            //render the view
            $(this.el).html(this.template(_.extend({
                model: this.model.toJSON()
            }, this.templateHelpers)));

            $(this.el).modal('show');

            return this;
        },

        cancel: function (evt) {

            $(this.el).modal('hide');
            // unbind events
            $(this.el).undelegate('#cancel', 'click');
            $(this.el).undelegate('#save', 'click');
        }
    });

    // recurring group confirm view for updates to booking in recurring group
    $.common.RecurringBookingGroupAssignView = $.app.ItemView.extend({

        template: "common/recurringbookinggroup/assign",

        initialize: function (options) {
            _.bindAll(this, 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);

            // bind to ok event on modal dialog
            this.on('ok', this.doAssign, this);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel"
        },

        doAssign: function (v) {
            this.model.assign({
                "interpreter.id": this.options["interpreter.id"],
                "ignoreAssignment": this.options.ignoreAssignment,
                "applyTo": this.model.get("applyTo"),
                "ignoreConflict": this.model.get("ignoreConflict")
            });
        }
    });

    // display phone number
    $.common.NumberView = $.app.BaseView.extend({

        tagName: "div",

        className: "number",

        template: JST["common/number/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);

            //used for cleaning up relations
            this.model.view = this;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click #deleteNumber': 'deleteNumber'
        },

        render: function () {
            //render the view
            $(this.el).html(this.template(_.extend(
                this.model.toJSON(),
                _.omit(this.options, "model", "collection"),
                this.templateHelpers
            )));

            this.callbacks(this.el, this.model);

            return this;
        },

        deleteNumber: function () {

            //remove the number from the collection
            this.collection.remove(this.model);
            //remove the view
            this.remove();
        }

    });

    // display email address
    $.common.EmailView = $.app.BaseView.extend({

        tagName: "div",

        className: "email",

        template: JST["common/email/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);

            //used for cleaning up relations
            this.model.view = this;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click #deleteEmail': 'deleteEmail'
        },

        render: function () {

            //render the view
            $(this.el).html(this.template(_.extend(
                this.model.toJSON(),
                _.omit(this.options, "model", "collection"),
                this.templateHelpers
            )));

            this.callbacks(this.el, this.model);

            return this;
        },

        deleteEmail: function () {

            //remove the email from the collection
            this.collection.remove(this.model);
            //remove the view
            this.remove();
        }

    });

    // display Intuit OAuth 2 Buttons and login status
    $.common.OAuth2LoginStatusView = $.app.ItemView.extend({
        tagName: "div",
        className: "oauthLoginStatus",
        template: 'common/oauth2/show',
        initialize: function (options) {
            _.bindAll(this, 'render');
        },
        events: {
            'click .clickReceivableLogin': 'clickReceivableLogin',
            'click .clickPayableLogin': 'clickPayableLogin'
        },
        onRender: function () {
            return this;
        },
        clickReceivableLogin: function () {
            location.href = App.config.context + "/api/oauth2/connect?providerKey=qborecv";
        },
        clickPayableLogin: function () {
            location.href = App.config.context + "/api/oauth2/connect?providerKey=qbopay";
        }
    });

    // display address
    $.common.AddressView = $.app.BaseView.extend({

        tagName: "div",

        className: "address",

        template: JST['common/address/show'],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'deleteAddress', 'validateAddress', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);

            //used for cleaning up relations
            this.model.view = this;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .deleteAddress': 'deleteAddress',
            'click .validateAddress': 'validateAddress'

        },

        render: function () {

            //render the view
            $(this.el).html(this.template(_.extend(
                this.model.toJSON(),
                _.omit(this.options, "model", "collection"),
                this.templateHelpers
            )));

            //show popover if validation has failed
            // there's a slight chance this won't be rendered in the right order
            if (this.model.get("showPopover")) {

                this.$("[name=addrEntered]").popover($.common.popOverOptions());
                this.$("[name=addrEntered]").popover('enable');
                this.$("[name=addrEntered]").data('popover').options.title = this.model.get("popoverTitle");
                this.$("[name=addrEntered]").data('popover').options.content = this.model.get("popoverContent");
                this.$("[name=addrEntered]").popover('show');

            } else {

                this.$("[name=addrEntered]").popover('enable');

            }

            this.callbacks(this.el, this.model);

            return this;
        },

        deleteAddress: function () {

            //remove the address from the collection
            this.collection.remove(this.model);
            //remove the view
            this.remove();
        },

        validateAddress: function () {
            var addrEntered = this.model.get("addrEntered");
            var result = validateAddressWithBackbone(this /* view */ , App.config.company.config.countryCode, true /* strip line feeds */ );
        }

    });

    // display extended address
    $.common.AddressExtendedView = $.app.BaseView.extend({
        tagName: "div",

        className: "row-fluid addressExtended",


        template: JST['common/addressextended/show'],

        initialize: function (options) {
            //unbind all events from element
            $(this.el).unbind();

            _.bindAll(this, 'render', 'synchModel', 'deleteAddress', 'validateAddress', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click #deleteAddress': 'deleteAddress',
            'click #validateAddress': 'validateAddress',
            'change .addrEntered': 'invalidateAddress',
            'click #parentLocationX': 'clearParent',
            'click #parentLocationDD': 'selectParent'
        },

        render: function () {
            //render the view
            $(this.el).html(this.template(_.extend({
                obj: this.model.toJSON()
            }, this.templateHelpers)));

            //show popover if validation has failed
            // there's a slight chance this won't be rendered in the right order
            if (this.model.get("showPopover")) {
                this.$("[name=addrEntered]").popover($.common.popOverOptions());
                this.$("[name=addrEntered]").popover('enable');
                this.$("[name=addrEntered]").data('popover').options.title = this.model.get("popoverTitle");
                this.$("[name=addrEntered]").data('popover').options.content = this.model.get("popoverContent");
                this.$("[name=addrEntered]").popover('show');

            } else {

                this.$("[name=addrEntered]").popover('enable');

            }

            if (this.options.hideParent) {
                this.$(".parentLocation").hide();
            }

            if (this.options.showClient) {

                var that = this;
                this.searchModel = new $.customer.CustomerClient();
                this.searchModel.set("customer.id", this.model.get("customer.id"));
                this.searchElement = that.$el.find("#search-client-customer");
                $.common.generateAutoComplete(this.searchElement, {
                    url: "/api/client",
                    idAttr: 'id',
                    displayAttr: 'name',
                    attrToSet: 'id',
                    searchProperty: 'name',
                    otherProperties: [{
                        "field": "customer.id",
                        "op": "eq",
                        "data": this.model.get("customer.id")
                    }]
                }, this.searchModel, function (id, params, ui) {
                    that.model.set("client", {
                        id: ui.item.id,
                        name: ui.item.value
                    });
                });

            } else {
                this.$el.find("#client-container").hide();
            }


            var model = this.model;

            if (!this.options.hideParent) {

                // TODO: this autocomplete has a dependency on $.customer.app.getCustomer() which will not always
                // TODO: be available. Need to pass the dependency as a context. This is a similar issue for
                // TODO: the select parent method
                $.common.generateAutoComplete($("#parentLocation-select"), {
                    url: "/api/address",
                    idAttr: 'id',
                    displayAttr: 'displayLabel',
                    attrToSet: 'parent',
                    searchProperty: 'name',
                    otherProperties: [{
                        "field": "customer.id",
                        "op": "eq",
                        "data": function (m) {
                            return $.customer.app.getCustomer().id;
                        }
                    }]
                }, this.model);

                /*
                // setup autocomplete
                this.$("#parentLocation-select").autocomplete({
                    source: App.config.context + "/customer/addressesAutocomplete?nd=" + (new Date()).getTime() + "&customer.id=" + $.customer.app.getCustomer().id,
                    search: function (event, ui) {
                        $("#parentLocation-select").autocomplete("option", "source", App.config.context + "/customer/addressesAutocomplete?nd=" + (new Date()).getTime() + "&customer.id=" + $.customer.app.getCustomer().id);
                    },
                    delay: 250,
                    cacheLength: 1,
                    /* ie fix * /
                    highlight: true,
                    minLength: 2,
                    select: function (event, ui) {

                        model.set({
                            "parent.id": ui.item.id,
                            "parent.label": ui.item.label
                        }, {
                            silent: true
                        });

                        $(this).val(ui.item.label).change();
                    }
                });
                */
            }

            this.callbacks(this.el, this.model);
            this.showSecured();

            return this;
        },

        deleteAddress: function () {
            //destroy if service location, else remove from collection.
            if (this.model.get("isServiceLocation")) {
                this.model.destroy();
            } else {
                this.collection.remove(this.model);
            }

            //remove the view
            this.remove();
        },

        validateAddress: function () {

            validateAddressWithBackbone(this, App.config.company.config.countryCode, true /* strip line feeds */ );

        },

        invalidateAddress: function () {

            this.model.set({
                "validated": false,
                "valid": false
            });

            this.render();
        },

        clearParent: function (e) {
            this.$("#parentLocation-select").val('').change();
            this.model.unset("parent.id", {
                silent: true
            });
            this.model.unset("parent.label", {
                silent: true
            });
            e.preventDefault();
        },

        selectParent: function (e) {
            e.preventDefault();

            this.$(".autocompletePopup").hide();

            this.$("#parentLocations-popup .popupBody div").html("<div><img src='" + App.config.context + "/images/loader-circle.gif'> Loading ...</div>");

            this.$("#parentLocations-popup").show();
            //alert(JSON.stringify(this.model));

            var model = this.model;
            var that = this;

            // TODO: this ajax has a dependency on $.customer.app.getCustomer() which will not always
            // TODO: be available. Need to pass the dependency as a context. This is a similar issue for
            // TODO: the autocomplete method above
            // setup autocomplete
            $.ajax({
                url: App.config.context + '/company/addresses',
                dataType: 'html',
                data: {
                    // our hypothetical feed requires UNIX timestamps
                    "company.id": App.config.company.id,
                    "customer.id": $.customer.app.getCustomer().id,
                    "name": this.$("#parentLocation-select").val()
                },
                success: function (doc) {

                    that.$("#parentLocations-popup .popupBody div").html(doc);

                    $(".popupBlock li").hover(function () {

                        that.$(".popupHeader span").text($(this).text());
                    });

                    $(".popupBlock li").click(function () {
                        //alert(this);

                        that.$("#parentLocation-select").val($(this).text()).change();
                        that.$("#parentLocations-popup").hide();
                        model.set({
                            "parent.id": $(this).attr('id'),
                            "parent.label": $(this).text()
                        }, {
                            silent: true
                        });

                    });
                }
            });

            $(document).on('click', function (evt) {
                that.$("#parentLocations-popup").hide();
            });

            e.stopPropagation();

        }

    });

    $.common.AddressSublocationView = $.app.ItemView.extend({

        className: 'sublocation',

        template: 'common/address/sublocation',

        initialize: function (options) {

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click #save': 'saveSublocation'
        },

        onRender: function () {

            return this;
        },

        saveSublocation: function (evt) {

            //this.model.save(null, popupFetchOptions);

            this.model.save(null, {
                success: function (model, response) {

                    popupHandleSuccess(model, response);

                    setTimeout(function () {

                        // close popup if it's popup
                        if (parent && parent.$.fn && parent.$.fn.colorbox) {
                            parent.$.fn.colorbox.close();
                        }

                    }, 1000);

                },
                error: popupHandleError
            });

            evt.stopPropagation();
        }

    });

    // company service view
    $.common.CompanyServiceView = $.app.ItemView.extend({

        tagName: "div",

        template: 'common/companyservice/show',

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'deleteService', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .deleteService': 'deleteService'
        },

        onRender: function () {


        },

        deleteService: function () {

            //remove the service from the collection
            this.collection.remove(this.model);
            //remove the view
            this.remove();
        }
    });

    $.common.ServicesView = $.app.ItemView.extend({

        template: "common/services/show",


        events: {
            "click .widget-add-service": "addService"
        },

        onRender: function () {

            _.each(this.model.get("services").models, function (m) {
                this.renderService(m, this.model.get("services"));
            }, this);

            return this;
        },

        renderService: function (service, services) {
            var serviceView = new $.common.CompanyServiceView({
                model: service,
                collection: services
            });
            serviceView.render();
            this.$el.find(".services").append(serviceView.el);
        }
    });

    // display client
    $.common.ClientView = $.app.ItemView.extend({

        tagName: "div",

        className: "client",

        template: 'common/client/show',

        initialize: function (options) {

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        onRender: function () {
            this.callbacks(this.el, this.model);
            this.delegateEvents();
        }
    });

    $.common.LanguageMappingReadView = $.app.BaseView.extend({

        tagName: "div",

        className: "languageMapping",

        template: JST["user/profile/personalinformation/languageShow"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {},

        render: function () {
            //render the view (need to access "." properties)
            $(this.el).html(this.template(_.extend({
                obj: this.model.toJSON()
            }, _.omit(this.options, "model", "collection"), this.templateHelpers)));

            if (this.model.id) {
                this.$("#iso").colorbox({
                    iframe: false,
                    href: App.config.context + "/language/summary/" + this.model.get("language.iso639_3Tag"),
                    title: this.model.get("language")
                });
            }
            return this;
        }
    });

    $.common.ContactTypeReadView = $.app.BaseView.extend({
        tagName: "div",

        className: "contactType",

        template: JST["user/profile/personalinformation/contactTypeShow"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        render: function () {
            //render the view
            $(this.el).html(this.template(_.extend(
                this.model.toJSON(),
                _.omit(this.options, "model", "collection"),
                this.templateHelpers
            )));
            return this;
        }
    });

    // display contact person view
    $.common.CustomerContactView = $.app.BaseView.extend({

        tagName: "div",

        className: "contact span12",

        template: JST['common/customercontact/show'],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'deleteContact', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .deleteContact': 'deleteContact'
        },

        render: function () {
            //render the view
            $(this.el).html(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));

            this.callbacks(this.el, this.model);

            return this;
        },

        deleteContact: function () {
            //remove the address from the collection
            //this.collection.remove(this.model);
            this.model.destroy();
            //remove the view
            this.remove();
        }

    });

    // display change history
    $.common.AuditView = $.app.BaseView.extend({

        tagName: "div",

        className: "history",

        template: JST["common/audit/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'exportChanges');
            this.model.bind('change', this.render);
        },

        events: {
            "click .exportChanges": 'exportChanges'
        },

        render: function () {

            //render the view
            $(this.el).html(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));
            this.showSecured();
            return this;
        },
        exportChanges: function (evt) {
            window.location = App.config.context + this.model.get("downloadURL") + '?format=' + $(evt.srcElement).data("format");
        }

    });

    // display document list
    $.common.DocumentListView = $.app.BaseView.extend({

        tagName: "ul",

        className: "thumbnails documents span12",

        initialize: function (options) {
            _.bindAll(this, 'render', 'renderDocument');
            this.model.bind('reset', this.render);
            this.model.bind('add', this.renderDocument);
            //this.model.bind('remove', this.renderDocument);

            if (this.options.contactPhotoId) {
                this.contactPhotoId = this.options.contactPhotoId;
            }

            if (this.options.disableDelete) {
                this.disableDelete = this.options.disableDelete;
            }

            if (this.options.disableEdit) {
                this.disableEdit = this.options.disableEdit;
            }
        },

        events: {

        },

        render: function () {

            //render the view
            //$(this.el).append("about to render documents");
            this.model.each(this.renderDocument);

            return this;
        },

        renderDocument: function (document) {

            var documentView;

            if (this.contactPhotoId) {
                documentView = new $.common.DocumentView({
                    model: document,
                    collection: this.model,
                    contactPhotoId: this.contactPhotoId,
                    disableDelete: this.disableDelete
                });
            } else {
                documentView = new $.common.DocumentView({
                    model: document,
                    collection: this.model,
                    disableDelete: this.disableDelete
                });
            }
            documentView.render();
            $(this.el).append(documentView.el);

            return this;
        }

    });

    // display document
    // have viewer installed: https://chrome.google.com/webstore/detail/nnbmlagghjjcbdhgmkedmbmedengocbn
    $.common.DocumentView = $.app.BaseView.extend({

        tagName: "li",

        className: "document row-fluid",

        template: JST["common/document/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'deleteDocument', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.model.on('change', this.render, this);

            if (this.options.disableDelete) {
                this.disableDelete = this.options.disableDelete;
            }

            if (this.options.disableEdit) {
                this.disableEdit = this.options.disableEdit;
            }
        },

        events: {

            'click #deleteDocument': 'deleteDocument',
            'click #editDocument': 'editDocument'

        },

        render: function () {

            $(this.el).empty();

            //render the view
            $(this.el).append(this.template(_.extend({
                obj: this.model.toJSON()
            }, this.templateHelpers)));

            if (this.model.get("isBinary")) {
                $(this.el).find(".view").colorbox({
                    iframe: true,
                    innerWidth: App.config.popups.doc.width,
                    innerHeight: App.config.popups.doc.height
                });
            } else {
                if (this.model.get("isHtml")) {
                    $(this.el).find(".view").colorbox({
                        iframe: false
                    });
                } else {
                    $(this.el).find(".view").colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.doc.width,
                        innerHeight: App.config.popups.doc.height
                    });
                }
            }

            this.callbacks(this.el, this.model);
            this.showSecured();
            return this;
        },

        deleteDocument: function () {

            // check if the contact photo id matches the id trying to be deleted. if so send an error to user telling them to remove the photo from the general information tab, otherwise delete the document
            if (this.options.contactPhotoId && (this.options.contactPhotoId == this.model.id)) {
                handleError({}, {
                    status: 'ERROR',
                    message: 'Interpreter photograph must be deleted from the general information tab.',
                    actual: "Interpreter photograph must be deleted from the general information tab.",
                    errors: []
                });
            } else {
                var that = this;

                this.model.destroy({
                    success: function () {
                        //remove the document from the collection
                        that.collection.remove(that.model);
                        //remove the view
                        that.remove();
                    },
                    error: popupFetchOptions.error
                });

            }
        },

        editDocument: function () {
            var that = this;

            var view = new $.common.EditDocumentView({
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
            });
        }

    });

    /*
     *
     * TODO: composite view / collection view below to replace documenlistview / document view above
     */
    $.common.DocumentItemView = $.app.ItemView.extend({

        tagName: "div",

        template: 'common/document/document',

        events: {

            'click #deleteDocument': 'deleteDocument'

        },

        onRender: function () {

            if (this.model.get("isBinary")) {
                $(this.el).find(".view").colorbox({
                    iframe: true,
                    innerWidth: App.config.popups.doc.width,
                    innerHeight: App.config.popups.doc.height
                });
            } else {
                if (this.model.get("isHtml")) {
                    $(this.el).find(".view").colorbox({
                        iframe: false
                    });
                } else {
                    $(this.el).find(".view").colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.doc.width,
                        innerHeight: App.config.popups.doc.height
                    });
                }
            }

            this.callbacks(this.el, this.model);
            this.showSecured();

            return this;
        },

        deleteDocument: function () {

            //remove the document from the collection
            //this.collection.remove(this.model);
            this.model.destroy({
                wait: true,
                error: popupFetchOptions.error
            });
            //remove the view
            //this.remove();
        }

    }); // end document view

    // documents view
    $.common.DocumentsView = $.app.CompositeView.extend({

        template: "common/document/documents",

        itemView: $.common.DocumentItemView,

        itemViewContainer: ".documents",

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, {
                title: this.options.title
            });

        },

        events: {
            'click .addDocument': 'addDocument'
        },

        onRender: function () {
            if (this.options.hideProgress) {
                this.$el.find(".progress").hide();
            }
            var opts = _.isFunction(this.options.options) ? this.options.options() : this.options.options;

            if (opts.parentEntityId) {
                this.collection.fetch();
            }
        },

        addDocument: function (evt) {
            var that = this;

            var opts = _.isFunction(this.options.options) ? this.options.options() : this.options.options;

            // show file type dialog if document type not specified
            if (!opts.documentType) {
                opts.showFileType = true;
            }

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
                that.collection.add(document);
                modal.close();

            });
        }

    });

    // vos template
    $.common.VosTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "vosTemplate",

        template: JST["common/vostemplate/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {

            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the VoS template prior to previewing it"
                });
                return;
            }
            var title = "VoS Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/vosPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });


    // Invoice template
    $.common.InvoiceTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "invoiceTemplate",

        template: JST["common/invoicetemplate/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {

            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the Invoice template prior to previewing it"
                });
                return;
            }
            var title = "Invoice Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/invoicePreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });

    // Invoice Credit Memo template
    $.common.InvoiceCreditMemoTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "invoiceCreditMemoTemplateView",

        template: JST["common/creditmemo/invoice/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {
            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the Invoice Credit Memo template prior to previewing it"
                });
                return;
            }
            var title = "Invoice Credit Memo Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/invoiceCreditMemoPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });

    // Payment template
    $.common.PaymentTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "paymentTemplate",

        template: JST["common/paymenttemplate/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {

            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the Payment template prior to previewing it"
                });
                return;
            }
            var title = "Payment Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/paymentPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });


    // Payment Credit Memo template
    $.common.PaymentCreditMemoTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "paymentCreditMemoTemplateView",

        template: JST["common/creditmemo/payment/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {
            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the Payment Credit Memo template prior to previewing it"
                });
                return;
            }
            var title = "Payment Credit Memo Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/paymentCreditMemoPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });

    // vos template
    $.common.VosTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "vosTemplate",

        template: JST["common/vostemplate/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {

            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the VoS template prior to previewing it"
                });
                return;
            }
            var title = "VoS Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/vosPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });

    // Customer Quotation template
    $.common.CustomerQuotationTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "customerQuotationTemplate",

        template: JST["common/customerquotationtemplate/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {

            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the Customer Quotation template prior to previewing it"
                });
                return;
            }
            var title = "Customer Quotation Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/customerQuotationPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });

    // Contact Quotation template
    $.common.ContactQuotationTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "contactQuotationTemplate",

        template: JST["common/contactquotationtemplate/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {

            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the Contact Quotation template prior to previewing it"
                });
                return;
            }
            var title = "Contact Quotation Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/contactQuotationPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });

    // Contact Quotation template
    $.common.OfferedJobViewTemplateView = $.app.BaseView.extend({

        tagName: "div",

        className: "offeredJobViewTemplateView",

        template: JST["common/offeredjobviewtemplate/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveTemplate', 'previewTemplate');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveTemplate": "saveTemplate",
            "click #previewTemplate": "previewTemplate"
        },

        render: function () {
            //unbind all events from tag
            this.model.off('change', this.render);
            this.model.unbind();

            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            var that = this;
            //inintialize any editors
            this.$('.wysiwyg').tinymce({
                // Location of TinyMCE script
                script_url: App.config.context + '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme: "advanced",
                force_br_newlines: "true",
                force_p_newlines: "false",
                forced_root_block: '', // Needed for 3.x
                remove_linebreaks: "true",
                apply_source_formatting: "false",
                convert_newlines_to_brs: "false",
                onchange_callback: function (inst) {
                    that.synchModelWysiwyg(inst, that.model);
                },
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
                // Theme options
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "bullist,numlist,|,outdent,indent,blockquote,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                //theme_advanced_resizing : false,
                width: '100%',
                theme_advanced_resizing: true,
                theme_advanced_resizing_use_cookie: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: false
            });

            return this;
        },

        saveTemplate: function () {

            //get the value from mce editor
            var body = this.$('.wysiwyg').tinymce().getContent();
            this.model.set({
                body: body
            });
            this.model.save([], defaultFetchOptions);
        },

        previewTemplate: function () {

            var id = this.model.id;

            if (!id) {
                handleActionError({
                    message: "Please save the Offered Job View template prior to previewing it"
                });
                return;
            }
            var title = "Offered Job View Preview";

            $.colorbox({
                iframe: true,
                innerWidth: App.config.popups.doc.width,
                innerHeight: App.config.popups.doc.height,
                open: true,
                href: App.config.context + '/admin/offeredJobViewPreview/' + id,
                returnFocus: false,
                title: title
            });

        }

    });

    $.common.CustomerConfigSnippetView = $.app.BaseView.extend({

        tagName: "div",

        className: "customerSnippet",

        template: JST['customer/config/snippet/show'],

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        render: function () {


            $(this.el).find("#inner").remove();
            //render the view
            $(this.el).html("<div id='inner'>" + this.template(_.extend(this.model.toJSON(), this.templateHelpers)) + "</div>");

            this.callbacks(this.el, this.model, this);

            return this;
        }

    });

    $.common.CompanyConfigSnippetView = $.app.BaseView.extend({

        tagName: "div",

        className: "snippet",

        template: JST['company/config/snippet/show'],

        initialize: function (options) {


            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('sync', this.render);
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        render: function () {
            //render the view
            $(this.el).html(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));

            this.callbacks(this.el, this.model, this);

            return this;
        }

    });

    $.common.ReferenceCodeConfigBasicsView = $.app.ItemView.extend({

        template: "common/reference/edit/show",

        initialize: function () {
            _.extend(this, $.app.mixins.subviewContainerMixin);

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click #saveReferenceCodeConfig': 'saveReferenceCodeConfig'
        },

        saveReferenceCodeConfig: function () {
            this.model.save(null, {
                success: function (args) {
                    popupFetchOptions.success(args);
                },
                error: popupFetchOptions.error
            });
        },

        onRender: function () {
            if (this.options.disableCustomerSpecific) {
                this.$el.find("#customerSpecific").attr('checked', 'checked');
                this.$el.find("#customerSpecific").attr('disabled', 'disabled');

                this.model.set({
                    "customerSpecific": true
                });
            }
        }
    });

    // display criteria config view
    $.common.AutoCompleteCriteriaView = $.app.ItemView.extend({

        tagName: "div",

        className: "row-fluid",

        template: 'common/reference/autocomplete/criteria/show',

        autoCompleteQualificationTemplate: 'common/reference/autocomplete/criteria/qualification',

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid', 'deleteAutoCompleteCriteriaConfig');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .deleteAutoCompleteCriteriaConfig': 'deleteAutoCompleteCriteriaConfig'
        },

        deleteAutoCompleteCriteriaConfig: function () {
            this.collection.remove(this.model);
            this.remove();
        }
    });

    // display criteria config view
    $.common.AutoCompleteQualificationView = $.app.ItemView.extend({

        tagName: "div",

        className: "row-fluid",

        template: 'common/reference/autocomplete/criteria/qualification',

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid', 'deleteAutoCompleteQualification');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .deleteAutoCompleteQualification': 'deleteAutoCompleteQualification'
        },

        deleteAutoCompleteQualification: function () {
            this.collection.remove(this.model);
            this.remove();
        }
    });

    $.common.AutoCompleteReferenceCodeConfigView = $.app.ItemView.extend({

        tagName: "div",

        className: "row-fluid",

        template: 'common/reference/autocomplete/referencecodeconfig/show',

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid', 'deleteAutoCompleteReferenceCodeConfig');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .deleteAutoCompleteReferenceCodeConfig': 'deleteAutoCompleteReferenceCodeConfig'
        },

        deleteAutoCompleteReferenceCodeConfig: function () {
            this.collection.remove(this.model);
            this.remove();
        }
    });

    $.common.AutoCompleteEditView = $.app.ItemView.extend({

        template: 'common/reference/autocomplete/edit/show',

        initialize: function () {

            //hack to unbind old views
            $(this.el).unbind();

            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid', 'addAutoCompleteCriteria', 'addAutoCompleteQualification', 'renderAutoCompleteCriteria', 'addAutoCompleteReferenceCodeConfig', 'renderAutoCompleteReferenceCodeConfig');
            //this.model.bind('add:criteria', this.renderAutoCompleteCriteria);
            // this.model.bind('sync', this.render);
            // this.model.bind('sync', function() {
            //     // ensure that the model is in the collection. really only relevant for new fields
            //     this.collection.add(this.model);
            // }, this);
            // this.model.bind('sync', function() {
            //     this.loadAutoCompleteDependencies();
            // }, this)
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #saveAutoComplete": "saveAutoComplete",
            "click #newAutoComplete": "newAutoComplete",
            "click #addAutoCompleteCriteria": "addAutoCompleteCriteria",
            "click #addAutoCompleteQualification": "addAutoCompleteQualification",
            "click #addAutoCompleteReferenceCodeConfig": "addAutoCompleteReferenceCodeConfig"
        },

        modelEvents: {
            "error": "popupError",
            "invalid": "popupInvalid",
            "sync": function () {
                //this.render();
                // ensure that the model is in the collection. really only relevant for new fields
                this.collection.add(this.model);
                this.loadAutoCompleteDependencies();
            }
        },

        onRender: function () {

            $("#auto-complete-details").empty();
            $("#auto-complete-details").html(this.el);
            this.loadAutoCompleteDependencies();
        },

        addAutoCompleteCriteria: function () {
            var that = this;
            var criteria = this.model.get("criteria");
            var crit = new $.config.AutoCompleteCriteriaConfig({
                "company.id": App.config.company.id,
                "criteria": {
                    "type": {
                        "id": App.dict.criteriaType.criteria.id
                    }
                },
                "required": true,
                "autoComplete.id": that.model.id ? that.model.id : ""
            });
            criteria.add(crit);
            that.renderAutoCompleteCriteria(crit, criteria);
        },

        addAutoCompleteQualification: function () {
            var that = this;
            //add the qualification to the collection
            var criteria = this.model.get("criteria");
            var crit = new $.config.AutoCompleteCriteriaConfig({
                "company.id": App.config.company.id,
                "criteria": {
                    "type": {
                        "id": App.dict.criteriaType.qualification.id
                    }
                },
                "required": true,
                "autoComplete.id": that.model.id ? that.model.id : ""
            });
            criteria.add(crit);
            that.renderAutoCompleteCriteria(crit, criteria);
        },

        addAutoCompleteReferenceCodeConfig: function () {
            var that = this;
            //add the qualification to the collection
            var rcConfigs = this.model.get("referenceCodeConfigs");
            if (_.isUndefined(rcConfigs)) {
                // ensure collection is initialized
                rcConfigs = new Backbone.Collection();
                this.model.set("referenceCodeConfigs", rcConfigs);
            }
            var rcConfig = new $.config.AutoCompleteReferenceCodeConfig({
                "company.id": App.config.company.id,
                "required": true,
                "autoComplete.id": that.model.id ? that.model.id : ""
            });
            rcConfigs.add(rcConfig);
            that.renderAutoCompleteReferenceCodeConfig(rcConfig, rcConfigs);
        },

        renderAutoCompleteCriteria: function (crit, criteria) {

            var criteriaView;

            if (crit.get("criteria") && crit.get("criteria").type.id === App.dict.criteriaType.criteria.id) {
                criteriaView = new $.common.AutoCompleteCriteriaView({
                    model: crit,
                    collection: criteria
                });
                criteriaView.render();
                this.$el.find("#autoCompleteCriteria").append(criteriaView.el);
            } else {
                criteriaView = new $.common.AutoCompleteQualificationView({
                    model: crit,
                    collection: criteria
                });
                criteriaView.render();
                this.$el.find("#autoCompleteQualifications").append(criteriaView.el);
            }
        },

        renderAutoCompleteReferenceCodeConfig: function (rcConfig, rcConfigs) {

            var rcConfigView = new $.common.AutoCompleteReferenceCodeConfigView({
                model: rcConfig,
                collection: rcConfigs
            });
            rcConfigView.render();
            this.$el.find("#autoCompleteReferenceCodeConfigs").append(rcConfigView.el);
        },

        saveAutoComplete: function () {
            this.model.save(null, {
                success: function (args) {
                    popupFetchOptions.success(args);
                },
                error: popupFetchOptions.error
            });
        },

        // this method loads the criteria and secondary reference fields
        // at render time and only for autocomplete where the ID is present
        // i.e. it's not a new autocomplete value
        loadAutoCompleteDependencies: function () {

            var that = this;

            // only load dependencies when the autocomplete has a valid ID
            if (!this.model.id) {
                return;
            }

            // render is called on sync and when a value is initially clicked.
            // load the criteria config from the URL returned. the issue is the
            // "criteria" attribute is set to be a collection. Need to revisit.
            // a bit of hack to replace the "uri" of the collection with a collection
            // itself
            var criteriaUri = this.model.get("criteria");
            var criteriaCollection = new $.config.AutoCompleteCriteriaConfigCollection(null, {
                "autoComplete.id": this.model.id
            });
            // overwrite the collection, with the collection about to be loaded
            this.model.set("criteria", criteriaCollection);

            // clear out the html elements
            this.$el.find("#autoCompleteCriteria").empty();
            this.$el.find("#autoCompleteQualifications").empty();

            // alternatively set the url
            criteriaCollection.fetch({
                success: function (coll, response) {
                    // add all items from the collection
                    _.each(coll.models, function (m) {
                        that.renderAutoCompleteCriteria(m, criteriaCollection);
                    }, this);
                },
                error: function (model, response) {

                }
            });

            // same as above
            var referenceCodeConfigsUri = this.model.get("referenceCodeConfigs");
            var rcConfigCollection = new $.config.AutoCompleteReferenceCodeConfigCollection(null, {
                "autoComplete.id": this.model.id
            });
            // overwrite the collection, with the collection about to be loaded
            this.model.set("referenceCodeConfigs", rcConfigCollection);

            // clear out the html elements
            this.$el.find("#autoCompleteReferenceCodeConfigs").empty();

            // alternatively set the url
            rcConfigCollection.fetch({
                success: function (coll, response) {
                    // add all items from the collection
                    _.each(coll.models, function (m) {
                        that.renderAutoCompleteReferenceCodeConfig(m, rcConfigCollection);
                    }, this);
                },
                error: function (model, response) {

                }
            });

        },

        newAutoComplete: function (evt) {
            var that = this;
            //deselect list item
            $("ul").find("li.selected").removeClass("selected");

            var autoComplete = new $.core.ReferenceCodeAutoCompleteModel({
                company: {
                    id: App.config.company.id
                },
                config: {
                    id: that.model.get("config").id
                }
            });

            var currentAutoComplete = new $.common.AutoCompleteEditView({
                model: autoComplete,
                collection: this.collection
            });

            currentAutoComplete.render();

            //don't bubble event
            return false;

        }
    });

    $.common.AutoCompleteListItemView = $.app.ItemView.extend({
        tagName: "li",

        className: "autoComplete",

        template: 'common/reference/autocomplete/listitem/show',

        events: {
            "click": "getAutoCompleteDetails"
        },

        modelEvents: {
            "sync": "render"
        },

        initialize: function () {

        },

        getAutoCompleteDetails: function (evt) {
            var that = this;
            this.$el.parent("ul").find("li.selected").removeClass("selected");
            this.$el.addClass("selected");

            var currAutoCompleteView = new $.common.AutoCompleteEditView({
                model: that.model,
                collection: this.collection
            });

            currAutoCompleteView.render();
        }

    });

    $.common.AutoCompleteListView = $.app.CompositePaginatorView.extend({

        template: 'common/reference/autocomplete/list/show',

        events: {
            'keyup #filterAutoComplete': 'filterList',
            'click li.previous_a': 'previous',
            'click li.next_a': 'next'
        },

        setState: function () {
            if (this.collection.hasNext()) {
                this.$(".next_a").removeClass("disabled");
            } else {
                this.$(".next_a").addClass("disabled");
            }

            if (this.collection.hasPrevious()) {
                this.$(".previous_a").removeClass("disabled");
            } else {
                this.$(".previous_a").addClass("disabled");
            }
        },

        filterList: function (e) {

            var that = this;

            var filterElement = e ? e.currentTarget : this.$el.find(".active");

            //setup filters
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", App.config.company.id);
            filtersJSON = addOrUpdateFilter(filtersJSON, "config.id", "eq", that.model.id);

            //if there's a filter
            var filter = this.$el.find("#filterAutoComplete").val();
            if (filter && filter.length > 0) {
                filtersJSON = addOrUpdateFilter(filtersJSON, "value", "bw", filter);
            }

            filtersJSON = this.getExtendedFilters(filtersJSON);

            if (filter.length >= 1 || filter.length === 0) {
                clearTimeout($.data(filterElement, 'timer'));
                var wait = setTimeout(function () {

                    that.collection.queryParams.filters = JSON.stringify(filtersJSON);

                    var sortParams = that.getSortParams();

                    if (sortParams) {
                        that.collection.queryParams.sidx = sortParams.sidx;
                        that.collection.queryParams.sord = sortParams.sord;
                    }

                    that.collection.getFirstPage(_.extend({
                        error: defaultFetchOptions.error
                    }, {
                        data: {
                            filters: JSON.stringify(filtersJSON)
                        }
                    }));
                }, 500);
                $(filterElement).data('timer', wait);
            }
        },

        getExtendedFilters: function (filters) {
            var that = this;

            filters = addOrUpdateFilter(filters, "company.id", "eq", App.config.company.id);
            filters = addOrUpdateFilter(filters, "config.id", "eq", that.model.id);

            return filters;
        },

        onShow: function () {

            this.filterList(null);

        },

        initialize: function () {

        },

        getSortParams: function () {

            return {
                sidx: "value",
                sord: "asc"
            };
        },

        itemViewOptions: function () {
            return {
                collection: this.collection
            };
        },

        itemView: $.common.AutoCompleteListItemView,

        itemViewContainer: '#auto-complete-values'

    });

    $.common.AutoCompleteMainLayoutView = $.app.LayoutView.extend({

        template: "common/reference/autocomplete/mainlayout/show",

        initialize: function () {

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        regions: {
            autocomplete: "#auto-complete-control",
            details: "#auto-complete-details"
        },

        onRender: function () {
            var that = this;
            this.autoCompleteCollection = new $.core.ReferenceCodeAutoCompleteCollection();

            var listView = new $.common.AutoCompleteListView({
                model: that.model,
                collection: this.autoCompleteCollection
            });
            this.autocomplete.show(listView);

        },

        onShow: function () {
            var that = this;

            var m = new $.core.ReferenceCodeAutoCompleteModel({
                company: {
                    id: App.config.company.id
                },

                config: {
                    id: that.model.id
                }
            });

            var currentAutoComplete = new $.common.AutoCompleteEditView({
                model: m,
                collection: this.autoCompleteCollection
            });

            currentAutoComplete.render();
        }
    });

    $.common.ReferenceCodeConfigMainLayoutView = $.app.LayoutView.extend({

        template: "common/reference/mainlayout/show",

        initialize: function () {

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);

            this.$el.on('hidden', function () {
                // clear the wider modal class when view is hidden (closed)
                if (this.classList.contains("modal-wide")) {
                    this.classList.remove("modal-wide");
                }
            });

            this.views = {
                basicsView: new $.common.ReferenceCodeConfigBasicsView({
                    model: this.model,
                    disableCustomerSpecific: this.options.disableCustomerSpecific
                }),
                autoCompleteView: new $.common.AutoCompleteMainLayoutView({
                    model: this.model
                })
            };
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        modelEvents: {
            "change:selectField": "toggleAutoComplete",
            "change:enableDropdown": "toggleAutoComplete"
        },

        regions: {
            basics: ".region-basics",
            autoComplete: ".region-auto-complete"
        },

        onRender: function () {

            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal();
            $modalEl.addClass("modal-wide");
            // remove calendar modal class (clashing css)
            $modalEl.removeClass("calendar-view-modal");

            this.basics.show(this.views.basicsView);
            this.autoComplete.show(this.views.autoCompleteView);

            this.toggleAutoComplete();

            this.callbacks(this.el, this.model, this);
        },

        toggleAutoComplete: function (evt) {
            if (this.model.get("selectField") || this.model.get("enableDropdown")) {
                // show autocomplete tab
                this.$(".auto-complete-tab-header").show();
            } else {
                this.$(".auto-complete-tab-header").hide();
            }
        }

    });

    $.common.ReferenceCodeConfigView = $.app.BaseView.extend({

        tagName: "div",

        className: "referenceCode",

        template: JST['common/reference/config'],

        initialize: function (options) {

            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid', 'deleteReferenceCodeConfig');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.model.bind('rmv', this.deleteReferenceCodeConfig);

            this.model.view = this;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .deleteReferenceCodeConfig': 'deleteReferenceCodeConfig',
            'click .editReferenceCodeConfig': 'editReferenceCodeConfig'
        },

        editReferenceCodeConfig: function () {
            var that = this;

            //$("#modalContainer").modal("show");
            var editView = new $.common.ReferenceCodeConfigMainLayoutView({
                //el: $("#modalContainer"),
                model: that.model,
                disableCustomerSpecific: this.options.disableCustomerSpecific
            });
            editView.render();
        },

        render: function () {

            //render the view
            $(this.el).html(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));

            this.callbacks(this.el, this.model);

            if (this.options.disableCustomerSpecific) {
                this.$el.find("#customerSpecific").attr('checked', 'checked');
                this.$el.find("#customerSpecific").attr('disabled', 'disabled');

                this.model.set({
                    "customerSpecific": true
                });
            }


            return this;
        },

        deleteReferenceCodeConfig: function () {

            //remove the address from the collection
            this.collection.remove(this.model);
            //remove the view
            this.remove();
        }

    });

    $.common.QueryFiltersAppliedView = $.app.ItemView.extend({
        template: 'common/querycomponent/queryFiltersApplied',

        modelEvents: {
            "change:filters": "render"
        },

        initialize: function (options) {
            var filters = _.isObject(options.filters) ?
                options.filters :
                JSON.parse(options.filters || null);

            this.model = new Backbone.Model();
            this.model.set("filters", filters);
            this.model.set("stringSelector", options.stringSelector || "#queryFiltersApplied");
        },

        onRender: function () {
            var filterBuilder = new $.filterbuilder.init(this.model.get("filters"));
            var filtersHtml = filterBuilder.getReadableQuery();
            if (filtersHtml) {
                this.$el.show()
                    .find(this.model.get("stringSelector"))
                    .html(filtersHtml);
            } else {
                this.$el.hide();
            }
        }
    });

    /*
     * ======================= Widget section ==========================
     * these views are adaptors between DropdownAutocomplete.
     *
     * TODO: seems like these should be possible to consolidate into dropdownautocomplete
     */
    $.common.widget = $.common.widget || {};

    $.common.widget.BillingCustomerView = $.app.ItemView.extend({
        template: 'common/widget/billing-customer',

        modelEvents: {
            "change:billingCustomer": "render"
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;

            // enabled if customer set
            var companyConfig = this.options.frameConfig.get("companyConfig");
            var customer = this.model.get("billingCustomer");
            var customerConfig = this.options.frameConfig.get("billingCustomerConfig");
            var pinCode = this.model.get("pinCode");
            var pinCodeLoaded = (pinCode && pinCode !== "");
            var customerCreateEnabled = $.app.mixins.templateHelpersMixin.hasRole("comp") ? true : customerConfig ? customerConfig.customerCreateEnabled : false;
            var enabled = (companyConfig.requirePINJobCreate && pinCode) || !companyConfig.requirePINJobCreate ? true : false;
            var isView = this.options.frameConfig.get("isView");

            var that = this;
            var newCustomer = new $.core.Customer({
                "company.id": App.config.company.id,
                "status.id": App.dict.customerStatus.active.id
            });

            if (this.model.get("billingCustomer")) {
                newCustomer = $.core.Customer.findOrCreate({
                    id: this.model.get("billingCustomer").id
                });
            }

            var customerView = new $.common.CustomerQuickAddView({
                el: $("#modalContainer"),
                model: newCustomer,
                parentView: this
            });

            var buId = getSelectedBusinessUnitId();
            this.views = {
                customerDD: {
                    selector: ".billing-customer .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("billingCustomer"),
                        ui: {
                            placeholder: "Type, select or create new customer",
                            inputClassName: "billing-customer-select",
                            inputName: "billingCustomer",
                            popupHeader: "Bill To Customer",
                            labelField: "displayName",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var clients = new $.core.CustomerCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };


                                // filter customer by term
                                // TODO: do an OR search with accounting reference here
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "status.nameKey", "eq", "active");
                                // TODO: pass in busines unit (if needed)

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                                clients.setSorting("name", "asc");
                                clients.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(clients, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("name"),
                                        label: m.get("name") + (m.get("accountingReference") ? " (" + m.get("accountingReference") + ")" : ""),
                                        specialInstructions: {
                                            "company": m.get("companySpecialInstructions"),
                                            "customer": m.get("customerSpecialInstructions"),
                                            "contact": m.get("contactSpecialInstructions")
                                        }
                                    };
                                });
                            }
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/customers',
                                data: {
                                    "businessUnit": buId
                                }
                            }
                        },
                        create: {
                            modal: {
                                view: customerView,
                                model: newCustomer
                            },
                            disabled: !customerCreateEnabled
                        },
                        disabledInputs: pinCodeLoaded
                    })
                }
            };


            this.listenTo(this.views.customerDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        name: data.name, // always want to use the name to avoid updating customer name on save
                        displayName: data.label || data.name, // the edit customer popup does not return label
                        specialInstructions: data.specialInstructions
                    };
                    if (data.config) {
                        if (typeof data.config === "string") {
                            modelStub.config = {
                                id: data.config
                            };
                        } else if (typeof data.config === "object") {
                            modelStub.config = data.config;
                        }
                    }
                }
                this.model.set("billingCustomer", modelStub);
                // remove error classes
                this.$(this.views.customerDD.selector).closest(".control-group").removeClass("error");
            });

            this.$(this.views.customerDD.selector).html(this.views.customerDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.CustomerView = $.app.ItemView.extend({
        template: 'common/widget/customer',

        modelEvents: {
            "change:customer": "render"
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;

            // enabled if customer set
            var companyConfig = this.options.frameConfig.get("companyConfig");
            var customer = this.model.get("customer");
            var customerConfig = this.options.frameConfig.get("customerConfig");
            var pinCode = this.model.get("pinCode");
            var pinCodeLoaded = (pinCode && pinCode !== "");
            var customerCreateEnabled = $.app.mixins.templateHelpersMixin.hasRole("comp") ? true : customerConfig ? customerConfig.customerCreateEnabled : false;
            var enabled = (companyConfig.requirePINJobCreate && pinCode) || !companyConfig.requirePINJobCreate ? true : false;
            var isView = this.options.frameConfig.get("isView");

            var that = this;
            var newCustomer = new $.core.Customer({
                "company.id": App.config.company.id,
                "status.id": App.dict.customerStatus.active.id
            });

            if (this.model.get("customer")) {
                newCustomer = $.core.Customer.findOrCreate({
                    id: this.model.get("customer").id
                });
            }

            var customerView = new $.common.CustomerQuickAddView({
                el: $("#modalContainer"),
                model: newCustomer,
                parentView: this
            });

            var buId = getSelectedBusinessUnitId();
            this.views = {
                customerDD: {
                    selector: ".customer .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("customer"),
                        ui: {
                            placeholder: "Type, select or create new customer",
                            inputClassName: "customer-select",
                            inputName: "customer",
                            popupHeader: "Customer",
                            labelField: "displayName",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var clients = new $.core.CustomerCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };


                                // filter customer by term
                                // TODO: do an OR search with accounting reference here
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "status.nameKey", "eq", "active");
                                // TODO: pass in busines unit (if needed)

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                                clients.setSorting("name", "asc");
                                clients.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(clients, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("name"),
                                        label: m.get("name") + (m.get("accountingReference") ? " (" + m.get("accountingReference") + ")" : ""),
                                        specialInstructions: {
                                            "company": m.get("companySpecialInstructions"),
                                            "customer": m.get("customerSpecialInstructions"),
                                            "contact": m.get("contactSpecialInstructions")
                                        }
                                    };
                                });
                            }
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/customers',
                                data: {
                                    "businessUnit": buId
                                }
                            }
                        },
                        create: {
                            modal: {
                                view: customerView,
                                model: newCustomer
                            },
                            disabled: !customerCreateEnabled
                        },
                        disabledInputs: pinCodeLoaded
                    })
                }
            };


            this.listenTo(this.views.customerDD.view, "change", function (data) {
                var modelStub;
                var consumerElement = $(".consumer-select");
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        name: data.name, // always want to use the name to avoid updating customer name on save
                        displayName: data.label || data.name, // the edit customer popup does not return label
                        specialInstructions: data.specialInstructions
                    };
                    if (data.config) {
                        if (typeof data.config === "string") {
                            modelStub.config = {
                                id: data.config
                            };
                        } else if (typeof data.config === "object") {
                            modelStub.config = data.config;
                        }
                    }
                }
                consumerElement.prop('disabled', modelStub === null);
                this.model.set("consumer", null);
                this.model.set("customer", modelStub);
                // remove error classes
                this.$(this.views.customerDD.selector).closest(".control-group").removeClass("error");
            });

            this.$(this.views.customerDD.selector).html(this.views.customerDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.ClientView = $.app.ItemView.extend({
        template: 'common/widget/client',

        modelEvents: {
            "change:client": "render",
            "change:customer": "render"
        },

        initialize: function () {
            this.options.frameConfig.bind('change:customerConfig', this.render);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;

            // enabled if customer set
            var companyConfig = this.options.frameConfig.get("companyConfig");
            var customer = this.model.get("customer");
            var client = this.model.get("client");
            var customerId = customer ? customer.id : "";
            var customerConfig = this.options.frameConfig.get("customerConfig");
            var pinCode = this.model.get("pinCode");
            var pinCodeLoaded = (pinCode && pinCode !== "");
            var clientCreateEnabled = false;
            var enabled = (companyConfig.requirePINJobCreate && pinCode) || !companyConfig.requirePINJobCreate ? true : false;
            var isView = this.options.frameConfig.get("isView");

            var that = this;

            // Create Basic Client Model
            var popUpClient = new $.core.Client({
                "company": App.config.company,
                "customer": customer ? customer : null
            });

            if (customer) {
                // allow client creation... maybe... if allowed?
                clientCreateEnabled = $.app.mixins.templateHelpersMixin.hasRole("comp") ? true : customerConfig ? customerConfig.clientCreateEnabled : false;
                if (client && client.customer) {
                    // check client - customer relationship is correct
                    if (client.customer.id != customer.id) {
                        this.model.set('client', null);
                        client = null;
                    }
                }
            }

            // Update the Client Model
            if (client) {
                popUpClient = $.core.Client.findOrCreate({
                    id: client.id
                });
            }

            var newClientView = new $.common.ClientQuickAddView({
                el: $("#modalContainer"),
                model: popUpClient,
                parentView: this
            });

            var buId = getSelectedBusinessUnitId();
            this.views = {
                clientDD: {
                    selector: ".client .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("client"),
                        ui: {
                            placeholder: "Type, select or create new client",
                            inputClassName: "client-select",
                            inputName: "client",
                            popupHeader: "Client",
                            labelField: "name",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var clients = new $.core.ClientCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                // add customer if it's selected
                                if (model.get("customer") && model.get("customer").id !== "") {
                                    // filter by customer, assumes active
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", model.get("customer").id);
                                } else {
                                    // filter by only active customers
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "customer.status.nameKey", "eq", "active");
                                }
                                // filter client by term
                                // TODO: do an OR search with accounting reference here
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", "true");
                                // TODO: pass in busines unit (if needed)

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                filters = addOrRemoveBusinessUnitFilter(filters, "client");

                                clients.setSorting("name", "asc");
                                clients.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(clients, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("name"),
                                        label: m.get("name") + " (" + (m.get("accountingReference") ? m.get("accountingReference") + " / " : "") + m.get("customer").name + ")",
                                        customer: m.get("customer"),
                                        specialInstructions: {
                                            "company": m.get("companySpecialInstructions"),
                                            "customer": m.get("customerSpecialInstructions"),
                                            "contact": m.get("contactSpecialInstructions")
                                        }
                                    };
                                });
                            }
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/clients',
                                data: {
                                    "clientCustomerBusinessUnit": buId,
                                    "customer.id": customerId
                                }
                            }
                        },
                        create: {
                            modal: {
                                view: newClientView,
                                model: popUpClient
                            },
                            disabled: !clientCreateEnabled
                        },
                        disabledInputs: pinCodeLoaded
                    })
                }
            };


            this.listenTo(this.views.clientDD.view, "change", function (data) {
                var modelStub;
                var clientElement = $(".client-select");
                var specialInstructions;
                if (data.specialInstructions) {
                    specialInstructions = data.specialInstructions;
                } else {
                    specialInstructions = {
                        "company": data.companySpecialInstructions || data.companyspecialinstructions, // the dropdown popup ignores case so need both
                        "customer": data.customerSpecialInstructions || data.customerspecialinstructions, // the dropdown popup ignores case so need both
                        "contact": data.contactSpecialInstructions || data.contactspecialinstructions // the dropdown popup ignores
                    };
                }
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        name: data.name,
                        displayName: data.label,
                        specialInstructions: specialInstructions
                    };

                    /*that.model.set({
                        client: ui.item.client,
                        pinCode: ui.item.pinCode,
                        customer: ui.item.customer
                    });*/

                    //that.options.frameConfig.set("customerConfig", ui.item.customer.config);
                    /*that.render();*/
                    if (data.customer) {
                        if (typeof data.customer === "string") {
                            modelStub.customer = {
                                id: data.customer
                            };
                        } else if (typeof data.customer === "object") {
                            modelStub.customer = data.customer;
                        }
                    }
                }
                //clientElement.prop('disabled', modelStub === null);
                this.model.set("client", modelStub);
                if (modelStub) {
                    // only set customer if model stub is valid (don't clear customer)
                    this.model.set("customer", modelStub.customer);

                }

                // remove error classes
                this.$(this.views.clientDD.selector).closest(".control-group").removeClass("error");
            });

            this.$(this.views.clientDD.selector).html(this.views.clientDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.PinView = $.app.ItemView.extend({
        template: 'common/widget/pin',

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        modelEvents: {
            //"change:pinCode": "render"
        },

        onRender: function () {

            var model = this.model;

            var isView = this.options.frameConfig.get("isView");

            var that = this;

            this.views = {
                pinDD: {
                    selector: ".pin .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.toJSON(), // TODO: this is not really a model! it's expecting a JSON object
                        ui: {
                            placeholder: "Enter Pin Code",
                            inputClassName: "pin-select",
                            inputName: "pinCode",
                            popupHeader: "PIN",
                            labelField: "pinCode",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var filtersJSON = {
                                    groupOp: "AND",
                                    unique: "true",
                                    rules: []
                                };

                                filtersJSON = addOrUpdateFilter(filtersJSON, "pin", "sw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.status.nameKey", "eq", "active");
                                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", "true");
                                if (model.get("customer") && model.get("customer").id !== "") {
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", model.get("customer").id);
                                }

                                $.common.ajaxCallToDropDownComplete(App.config.context + "/api/pin", filtersJSON, response, null, function (m) {
                                    return {
                                        label: m.name + ' (' + (m.accountingReference ? m.accountingReference : "N/A") + ')',
                                        value: m.name + ' (' + (m.accountingReference ? m.accountingReference : "N/A") + ')',
                                        id: m.id,
                                        client: m,
                                        pinCode: m.accountingReference,
                                        customer: m.customer
                                    };
                                });

                            },
                            minLength: App.config.company.config.requirePINMinimumCharacters ? App.config.company.config.requirePINMinimumCharacters : 3
                        },
                        dropdown: {
                            disabled: true
                        },
                        create: {
                            disabled: true
                        },
                        disabledInputs: false
                    })
                }
            };

            this.listenTo(this.views.pinDD.view, "change", function (data) {
                var modelStub;
                var pinElement = $(".pin-select");
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        name: data.name
                    };
                }
                //pinElement.prop('disabled', modelStub === null);
                this.model.set({
                    client: data.client,
                    pinCode: data.pinCode,
                    customer: data.customer,
                    billingCustomer: data.customer
                });

                // remove error classes
                this.$(this.views.pinDD.selector).closest(".control-group").removeClass("error");
            });

            this.$(this.views.pinDD.selector).html(this.views.pinDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.RequestorView = $.app.ItemView.extend({
        template: 'common/widget/requestor',

        modelEvents: {
            "change:requestor": "render"
        },

        initialize: function () {
            this.options.frameConfig.bind('change:customerConfig', this.render);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;

            // enabled if customer set
            var customer = this.model.get("customer");
            var customerConfig = this.options.frameConfig.get("customerConfig");
            var enabled = customer ? true : false;
            var isView = this.options.frameConfig.get("isView");
            var requestorCreateEnabled = $.app.mixins.templateHelpersMixin.hasRole("comp") ? true : customerConfig ? customerConfig.requestorCreateEnabled : false;
            var customRequestor = this.model.get("customRequestor");

            var requestor = new $.core.Requestor({
                enabled: false,
                active: true
            });

            if (this.model.get("requestor")) {
                requestor.set("id", this.model.get("requestor").id);
            }

            var requestorView = new $.common.RequestorQuickAddView({
                model: requestor,
                customerId: customer ? customer.id : null,
                parentView: this
            });

            this.views = {
                requestorDD: {
                    selector: ".requestor .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("requestor"),
                        ui: {
                            placeholder: "Type, select or create new requestor",
                            inputClassName: "requestor-select",
                            popupHeader: "Requestor",
                            inputName: "requestor",
                            labelField: "displayName",
                            otherLabel: customRequestor ? '[Other Requestor]' : null,
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", "true");
                                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", customer.id);

                                //var url = App.config.context + "/api/company/" + App.config.company.id + "/customer/" + customer.id + "/contact?nd=" + (new Date()).getTime();
                                var url = App.config.context + "/api/requestor?nd=" + (new Date()).getTime();
                                $.common.ajaxCallToDropDownComplete(url, filtersJSON, response, null, function (item) {
                                    return {
                                        id: item.id,
                                        label: item.displayName,
                                        value: item.displayName,
                                        email: item.email
                                    };
                                }, {
                                    rows: -1
                                });
                            },
                            allowEmpty: true,
                            allowEmptyAltText: "[Other requestor]"
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/requestors',
                                data: {
                                    "customer.id": (customer ? customer.id : '')
                                }
                            },
                            allowEmpty: true,
                            allowEmptyAltText: "[Other requestor]"
                        },
                        create: {
                            modal: {
                                view: requestorView,
                                model: requestor
                            },
                            disabled: !requestorCreateEnabled
                        },
                        disabledInputs: !enabled
                    })
                }
            };

            var that = this;

            this.listenTo(this.views.requestorDD.view, "change", function (data) {
                var modelStub;
                if (!data.id && data.label) {
                    // We want to catch the case when the "Other requestor" option is selected
                    this.$el.find(".requestor-alt").show();
                } else {
                    this.$el.find(".requestor-alt").hide();
                }
                if (!data.id) {
                    modelStub = null;
                } else {
                    var displayName = data.displayName;
                    if (data.label) {
                        displayName = data.label;
                    }
                    modelStub = {
                        id: data.id,
                        displayName: displayName
                    };
                }
                this.model.set("requestor", modelStub);

                // remove error classes
                this.$(this.views.requestorDD.selector).closest(".control-group").removeClass("error");

                that.trigger("change", data);
            });

            this.listenTo(this.views.requestorDD.view, "render", function () {
                //var requestorModel = this.views.requestorDD.view.model;
                var customRequestor = this.model.get("customRequestor");
                if (customRequestor) {
                    // we want to catch the case when the "custom requestor" option is selected
                    this.$el.find(".requestor-alt").show();
                    this.$el.find(".requestor-select").val("HOLA");
                } else {
                    this.$el.find(".requestor-alt").hide();
                }
            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.requestorDD.selector).html(this.views.requestorDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.BillingLocationView = $.app.ItemView.extend({
        template: 'common/widget/billinglocation',

        modelEvents: {
            "change:billingLocation": "render"
        },

        initialize: function () {
            this.options.frameConfig.bind('change:customerConfig', this.render);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;

            // enabled if customer set
            var customer = this.model.get("billingCustomer");
            var client = this.model.get("client");
            var pinCode = this.model.get("pinCode");
            var customerConfig = this.options.frameConfig.get("customerConfig");
            var enabled = customer ? true : false;
            var isView = this.options.frameConfig.get("isView");
            var locationCreateEnabled = $.app.mixins.templateHelpersMixin.hasRole("comp") ? true : customerConfig ? customerConfig.locationCreateEnabled : false; //customerConfig ? customerConfig.locationCreateEnabled : false;

            this.views = {
                billingLocationDD: {
                    selector: ".billingLocation .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("billingLocation"),
                        ui: {
                            placeholder: "Type, select or create new billing location",
                            inputClassName: "billingLocation-select",
                            labelField: "displayLabel",
                            popupHeader: "Billing Location",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var addresses = new $.core.CustomerAddressCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                // add customer (always pass customer for billing locations)
                                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", model.get("billingCustomer").id);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);

                                // TODO: pass in business unit (if needed)
                                // TODO: pass client if set

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                addresses.setSorting("addrEntered", "asc");
                                addresses.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(addresses, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("displayLabel"),
                                        label: m.get("displayLabel"),
                                        phone: m.get("phone")
                                    };
                                });
                            },
                            data: {
                                "pin": (pinCode ? pinCode : ''),
                                "customer.id": (customer ? customer.id : '')
                            }
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/addresses',
                                data: {
                                    "pin": (pinCode ? pinCode : ''),
                                    "customer.id": (customer ? customer.id : '')
                                }
                            }
                        },
                        create: {
                            colorbox: {
                                title: 'Create New Billing Location',
                                href: App.config.context + '/customer/addressadd?customer.id=' + (customer ? customer.id : '') + '&client.id=' + (client ? client.id : '')
                            },
                            disabled: !locationCreateEnabled
                        },
                        disabledInputs: !enabled
                    })
                }
            };

            this.listenTo(this.views.billingLocationDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        displayLabel: data.label
                    };
                }
                this.model.set("billingLocation", modelStub);

                // remove error classes
                this.$(this.views.billingLocationDD.selector).closest(".control-group").removeClass("error");

            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.billingLocationDD.selector).html(this.views.billingLocationDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.LocationView = $.app.ItemView.extend({
        template: 'common/widget/location',

        modelEvents: {
            "change:customer": "render",
            "change:customLocationPostalCodeValid": "render",
            "change:location": "render"
        },

        initialize: function () {
            this.options.frameConfig.bind('change:customerConfig', this.render);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onBeforeRender: function () {

            this.$(".location-alt").popover('disable').popover('hide');
        },

        onRender: function () {
            var model = this.model;

            // enabled if customer set
            var customer = this.model.get("customer");
            var client = this.model.get("client");
            var location = this.model.get("location");
            var customerConfig = this.options.frameConfig.get("customerConfig");
            var enabled = customer ? true : false;
            var isView = this.options.frameConfig.get("isView");
            var locationCreateEnabled = $.app.mixins.templateHelpersMixin.hasRole("comp") ? true : customerConfig ? customerConfig.locationCreateEnabled : false;
            var customLocation = this.model.get("customLocation");
            var customLocationPostalCode = this.model.get("customLocationPostalCode");

            var address = new $.core.CustomerAddress({
                "company.id": App.config.company.id,
                "customer.id": customer ? customer.id : null,
                "client.id": client ? client.id : null,
                "type.id": App.dict.addressType.service.id,
                "reuse": true
            });

            if (location) {
                address = $.core.CustomerAddress.findOrCreate({
                    id: location.id
                });
                // newlines concatenating in input type text - replace with space
                var formattedDisplayLabel = location.displayLabel.replace(/\n/g, " ");
                location.displayLabel = formattedDisplayLabel;
            }

            var addressView = new $.common.LocationQuickAddView({
                el: $("#modalContainer"),
                model: address,
                parentView: this
            });

            this.views = {
                locationDD: {
                    selector: ".location .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: location,
                        ui: {
                            placeholder: "Type, select or create new location",
                            inputClassName: "location-select",
                            labelField: "displayLabel",
                            inputName: "location",
                            popupHeader: "Location",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var addresses = new $.core.CustomerAddressCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                // add customer (always pass customer for billing locations)
                                filtersJSON = addOrUpdateFilter(filtersJSON, "client.id", "eq", model.get("client").id);

                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", true);
                                // TODO: pass in business unit (if needed)
                                // TODO: pass client if set

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                addresses.setSorting("addrEntered", "asc");
                                addresses.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(addresses, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("displayLabel"),
                                        label: m.get("displayLabel"),
                                        phone: m.get("phone"),
                                        publicNotes: m.get("publicNotes"),
                                        timeZone: m.get("timeZone"),
                                        specialInstructions: {
                                            "company": m.get("companySpecialInstructions"),
                                            "customer": m.get("customerSpecialInstructions"),
                                            "contact": m.get("contactSpecialInstructions")
                                        },
                                        lat: m.get("lat"),
                                        lng: m.get("lng")
                                    };
                                });
                            },
                            data: {
                                "pin": this.model.get("pinCode"),
                                "customer.id": (customer ? customer.id : ''),
                                "client.id": (client ? client.id : ''),
                                "active": true
                            },
                            allowEmpty: true,
                            allowEmptyAltText: "[Other location]"
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/addresses',
                                data: {
                                    "pin": this.model.get("pinCode"),
                                    "customer.id": (customer ? customer.id : ''),
                                    "client.id": (client ? client.id : ''),
                                    "active": true
                                }
                            },
                            allowEmpty: true,
                            allowEmptyAltText: "[Other location]"
                        },
                        create: {
                            modal: {
                                view: addressView,
                                model: address
                            },
                            disabled: !locationCreateEnabled
                        },
                        disabledInputs: !enabled,
                        eventIdentifier: "location",
                        parentView: this
                    })
                }
            };

            this.listenTo(this.views.locationDD.view, "change", function (data) {
                var modelStub;
                var that = this;
                var contactPerson = "";

                if (!data.id && data.label) {
                    // We want to catch the case when the "Other location" option is selected
                    this.$el.find(".location-alt").show();
                } else {
                    this.$el.find(".location-alt").hide();
                }

                if (!data.id) {
                    modelStub = null;
                } else {
                    if (data.timeZone || data.timezone) {
                        this.model.set("timeZone", (data.timeZone || data.timezone));
                    } else { // if the address has a latitude and longitude, the validate using TimeZone API
                        var lat = data.lat;
                        var lng = data.lng;

                        if (lat && lng) {
                            $.ajax({
                                url: "https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + lng + "&timestamp=" + (Math.round((new Date().getTime()) / 1000)).toString() + "&key=" + App.config.google.apiKey
                            }).done(function (response) {
                                if (response.timeZoneId) {
                                    that.model.set("timeZone", response.timeZoneId);
                                }
                            });
                        } else { // If the address is not validated properly, pick time zone from customer
                            var config = this.options.frameConfig.get("customerConfig");
                            if (config && config.timeZone) {
                                this.model.set("timeZone", config.timeZone);
                            } else { // if there is no timezone in customer, pick from company
                                this.model.set("timeZone", App.config.company.config.timeZone);
                            }
                        }
                    }
                    var displayLabel = data.displayLabel;
                    if (data.label) {
                        displayLabel = data.label;
                    }
                    var specialInstructions;
                    if (data.specialInstructions) {
                        specialInstructions = data.specialInstructions;
                    } else {
                        specialInstructions = {
                            "company": data.companySpecialInstructions || data.companyspecialinstructions, // the dropdown popup ignores case so need both
                            "customer": data.customerSpecialInstructions || data.customerspecialinstructions, // the dropdown popup ignores case so need both
                            "contact": data.contactSpecialInstructions || data.contactspecialinstructions // the dropdown popup ignores case so need both
                        };
                    }

                    contactPerson = data["data-contact-person"] || "";

                    modelStub = {
                        id: data.id,
                        displayLabel: displayLabel,
                        publicNotes: (data.publicNotes || data.publicnotes), // the dropdown popup ignores case so need both
                        specialInstructions: specialInstructions,
                        contactPerson: contactPerson
                    };
                }
                this.model.set("location", modelStub);

                // remove error classes
                this.$(this.views.locationDD.selector).closest(".control-group").removeClass("error");
            }, this);

            this.listenTo(this.views.locationDD.view, "render", function () {
                var locationModel = this.views.locationDD.view.model;
                if (locationModel && !locationModel.id && locationModel.displayLabel || (!locationModel && (customLocation || customLocationPostalCode))) {
                    // we want to catch the case when the "custom location" option is selected
                    this.$el.find(".location-alt").show();
                } else {
                    this.$el.find(".location-alt").hide();
                }
            }, this);

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.locationDD.selector).html(this.views.locationDD.view.render().el);


            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.SublocationView = $.app.ItemView.extend({
        template: 'common/widget/sublocation',

        modelEvents: {
            "change:location": "render",
            "change:subLocation": "render"
        },

        initialize: function () {
            this.options.frameConfig.bind('change:customerConfig', this.render);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;

            // enabled if customer set
            var customer = this.model.get("customer");
            var client = this.model.get("client");
            var location = this.model.get("location");
            var customerConfig = this.options.frameConfig.get("customerConfig");
            //var enabled = location && customerConfig && customerConfig.sublocationsEnabled ? true : false;
            var enabled = true;
            var isView = this.options.frameConfig.get("isView");
            var sublocationCreateEnabled = $.app.mixins.templateHelpersMixin.hasRole("comp") ? true : customerConfig ? customerConfig.sublocationCreateEnabled : false;

            var address = new $.core.CustomerAddress({
                "parent.id": location ? location.id : null,
                "company.id": App.config.company.id,
                "customer.id": customer ? customer.id : null,
                "type.id": App.dict.addressType.service.id
            });

            if (this.model.get("subLocation")) {
                address = $.core.CustomerAddress.findOrCreate({
                    id: this.model.get("subLocation").id
                });
            }

            var addressView = new $.common.SublocationQuickAddView({
                el: $("#modalContainer"),
                model: address,
                parentView: this
            });

            this.views = {
                sublocationDD: {
                    selector: ".sublocation .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("subLocation"),
                        ui: {
                            placeholder: "Type, select or create new sublocation",
                            inputClassName: "sublocation-select",
                            labelField: "displayLabel",
                            popupHeader: "Sublocation",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var addresses = new $.core.CustomerAddressCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                // add customer (always pass customer for billing locations)
                                filtersJSON = addOrUpdateFilter(filtersJSON, "parent.id", "eq", location.id);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                // TODO: pass in business unit (if needed)
                                // TODO: pass client if set

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                addresses.setSorting("addrEntered", "asc");
                                addresses.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(addresses, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("displayLabel"),
                                        label: m.get("displayLabel"),
                                        phone: m.get("phone")
                                    };
                                });
                            },
                            data: {
                                "customer.id": (customer ? customer.id : ''),
                                "parent.id": (location ? location.id : '')
                            }
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/addresses',
                                data: {
                                    "customer.id": (customer ? customer.id : ''),
                                    "parent.id": (location ? location.id : '')
                                }
                            }
                        },
                        create: {
                            modal: {
                                view: addressView,
                                model: address
                            },
                            disabled: !sublocationCreateEnabled
                        },
                        disabledInputs: !location,
                        eventIdentifier: "subLocation",
                        parentView: this
                    })
                }
            };

            this.listenTo(this.views.sublocationDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    var displayLabel = data.displayLabel;
                    if (data.label) {
                        displayLabel = data.label;
                    }

                    modelStub = {
                        id: data.id,
                        displayLabel: displayLabel
                    };
                }
                this.model.set("subLocation", modelStub);


                // remove error classes
                this.$(this.views.sublocationDD.selector).closest(".control-group").removeClass("error");
            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.sublocationDD.selector).html(this.views.sublocationDD.view.render().el);

            //if (enabled) {
            if (true) {
                // unhide
                this.$(".sublocation.control-group").show();
            }

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.LanguageView = $.app.ItemView.extend({
        template: 'common/widget/language',

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;
            var that = this;

            var isView = this.options.frameConfig.get("isView");

            this.views = {
                languageDD: {
                    selector: ".language .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("language"),
                        ui: {
                            placeholder: "Type or select a language",
                            inputClassName: "language-select",
                            labelField: "displayName",
                            popupHeader: "Language",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                $.ajax({
                                    url: App.config.context + "/language/listAvailable",
                                    dataType: 'json',
                                    data: {
                                        term: request.term
                                    },
                                    success: function (langs /* response */ , textStatus, jqXHR) {

                                        var results = [];

                                        for (var i = 0; i < langs.length; i++) {

                                            var label = langs[i].label;

                                            if (langs[i].alternates) {
                                                label += " [Alternates: " + langs[i].alternates + "]";
                                            }

                                            results.push({
                                                id: langs[i].id,
                                                label: label,
                                                value: label
                                            });
                                        }

                                        if (results.length === 0) {
                                            results.push({
                                                id: 0,
                                                label: "[No matches. Try an alternative spelling]",
                                                value: "[No matches. Try an alternative spelling]"
                                            });
                                        }

                                        response(results);
                                    }
                                });
                            }
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/language/languages'
                            }
                        },
                        create: {
                            disabled: true
                        }
                    })
                }
            };

            this.listenTo(this.views.languageDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id
                    };
                }
                this.model.set("language", modelStub);

                // remove error classes
                this.$(this.views.languageDD.selector).closest(".control-group").removeClass("error");
            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.languageDD.selector).html(this.views.languageDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    /*
     views to autocomplete dropdown view
     */
    $.common.widget.DropDownItemView = $.app.ItemView.extend({
        template: 'common/dropdownautocomplete/dropdownitem'
    });

    /*
     views to support consumers autocomplete dropdown
     */
    $.common.widget.DropDownConsumersView = $.app.CompositeView.extend({
        template: 'common/dropdownautocomplete/dropdownconsumerlist',
        itemView: $.common.widget.DropDownItemView,
        itemViewContainer: "#dropdown-list"
    });

    /*
     views to support interpreters autocomplete dropdown
     */
    $.common.widget.DropDownInterpretersView = $.app.CompositeView.extend({
        template: 'common/dropdownautocomplete/dropdowninterpreterlist',
        itemView: $.common.widget.DropDownItemView,
        itemViewContainer: "#dropdown-list"
    });

    $.common.widget.ConsumerView = $.app.LayoutView.extend({
        template: 'common/widget/consumer',

        modelEvents: {
            "change:consumer": "render"
        },

        regions: {
            "consumersListRegion": ".consumers-list-container"
        },

        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());
        },

        initialize: function () {
            this.consumersCollection = this.model.get("consumers");
            this.options.frameConfig.bind('change:customerConfig', this.render);
        },

        onRender: function () {
            var customerConfig = this.options.frameConfig.get("customerConfig") ? this.options.frameConfig.get("customerConfig") : null;
            var companyConfig = this.options.frameConfig.get("companyConfig") ? this.options.frameConfig.get("companyConfig") : null;
            if (customerConfig && companyConfig) {
                //this.views.consumer.hidden = !(customerConfig.enableConsumer && companyConfig.enableConsumer);
                this.model.set("validateConsumer", (customerConfig.enableConsumer && companyConfig.enableConsumer));
                if (!(customerConfig.enableConsumer && companyConfig.enableConsumer)) {
                    this.$el.hide();
                } else {
                    this.$el.show();
                }
            }

            var model = this.model;
            var that = this;

            // enabled if customer set
            var customer = this.model.get("customer");
            //var customerConfig = this.options.frameConfig.get("customerConfig");
            var enabled = customer ? true : false;
            var isView = this.options.frameConfig.get("isView");
            var consumerCreateEnabled = _.contains(App.config.userData.roles, "comp") ? _.contains(App.config.userData.roles, "comp") : (customerConfig ? customerConfig.consumerCreateEnabled : false);
            var customConsumer = this.model.get("customConsumer");
            var isInternalUser = _.contains(App.config.userData.roles, "comp");
            var customerSpecific = App.config.company.config.customerSpecificConsumer ? (customerConfig ? customerConfig.customerSpecificConsumer : App.config.company.config.customerSpecificConsumer) : false;
            // Fetch all consumers if customer specific is false
            var ignoreCustomerSpecific = customerSpecific ? false : true;

            // If internal user, set ignore customer specific to true
            if (isInternalUser) {
                ignoreCustomerSpecific = true;
            }

            var consumer = new $.core.Consumer({
                "active": true,
                "company.id": App.config.company.id
            });

            if (this.model.get("consumer")) {
                consumer = $.core.Consumer.findOrCreate({
                    id: this.model.get("consumer").id
                });
                if (isInternalUser) {
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

            var consumerView = new $.common.ConsumerQuickAddView({
                model: consumer,
                customerId: customer ? customer.id : null,
                customerSpecific: customerSpecific,
                parentView: this
            });

            this.views = {
                consumerDD: {
                    selector: ".consumer .controls",
                    view: new $.common.DropdownAutocompleteView({
                        name: (!_.isNull(that.model.get("consumer")) && !_.isUndefined(that.model.get("consumer"))) ? that.model.get("consumer").name : "",
                        model: that.model.get("consumer"),
                        ui: {
                            placeholder: "Type, select a consumer",
                            inputClassName: "consumer-select",
                            inputName: "consumer",
                            popupHeader: "Consumer",
                            labelField: "name",
                            otherLabel: customConsumer ? "[Other Consumer]" : null,
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", that.model.get("company").id);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", true);

                                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", that.model.get("customer").id);

                                if (!customerSpecific || ignoreCustomerSpecific) {
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "ignoreCustomerSpecific", "eq", true);
                                } else {
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "customerSpecific", "eq", customerSpecific);
                                }

                                $.common.ajaxCallToDropDownComplete(App.config.context + '/api/consumer', filtersJSON, response, 'name');
                            },
                            allowEmpty: true,
                            allowEmptyAltText: "[Other consumer]"
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/api/consumer',
                                data: {
                                    filters: function () {
                                        var filtersJSON = {
                                            groupOp: "AND",
                                            rules: []
                                        };

                                        filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", that.model.get("company").id);
                                        filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", $(".consumer-select").val());

                                        filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", that.model.get("customer").id);

                                        if (!customerSpecific || ignoreCustomerSpecific) {
                                            filtersJSON = addOrUpdateFilter(filtersJSON, "ignoreCustomerSpecific", "eq", true);
                                        } else {
                                            filtersJSON = addOrUpdateFilter(filtersJSON, "customerSpecific", "eq", customerSpecific);
                                        }

                                        return JSON.stringify(filtersJSON);
                                    }
                                },
                                onSuccess: function (response, ui) {
                                    var responseJSON = JSON.parse(response);
                                    ui.popupBody.html("");
                                    var dropDownView = new $.common.widget.DropDownConsumersView({
                                        el: ui.popupBody,
                                        collection: new Backbone.Collection(responseJSON.rows)
                                    });

                                    dropDownView.render();
                                }
                            }
                        },
                        create: {
                            modal: {
                                view: consumerView,
                                model: consumer
                            },
                            disabled: !consumerCreateEnabled
                        },
                        disabledInputs: !enabled
                    })
                },
                consumersList: new $.common.ConsumersListView({
                    model: this.model,
                    isView: isView,
                    frameConfig: this.options.frameConfig,
                    collection: this.consumersCollection
                })
            };
            this.listenTo(this.views.consumerDD.view, "change", function (data) {
                var modelStub;

                if (!data.id && data.label) {
                    // We want to catch the case when the "Other requestor" option is selected
                    this.$el.find(".consumer-alt").show();
                } else {
                    this.$el.find(".consumer-alt").hide();
                }

                if (!data.id) {
                    modelStub = null;
                } else {
                    var displayName = data.name;
                    if (data.label) {
                        displayName = data.label;
                    }
                    modelStub = {
                        id: data.id,
                        name: displayName
                    };
                    if ((!_.contains(App.config.userData.roles, ["cont", "cust"]))) {
                        var consumer = $.core.Consumer.findOrCreate({
                            id: data.id
                        });
                        consumer.fetch({
                            success: function (model, response) {
                                that.$el.find(".consumerDetailsContainer").empty();
                                var detailsView = new $.booking.v2.ConsumerDetailsView({
                                    model: consumer,
                                    el: that.$el.find(".consumerDetailsContainer")
                                });
                                detailsView.render();
                                that.consumersListRegion.show(that.views.consumersList);
                            },
                            error: function (model, response) {
                                handleActionError({
                                    message: "An error was encountered retrieving the Consumer. Please contact the administrator if the problem persists."
                                });
                            }
                        });
                    }
                }
                this.model.set("consumer", modelStub);
                // remove error classes
                this.$(this.views.consumerDD.selector).closest(".control-group").removeClass("error");
            });

            this.listenTo(this.views.consumerDD.view, "render", function () {
                var customConsumer = this.model.get("customConsumer");
                if (customConsumer) {
                    this.$el.find(".consumer-alt").show();
                } else {
                    this.$el.find(".consumer-alt").hide();
                }
            });

            this.$(this.views.consumerDD.selector).html(this.views.consumerDD.view.render().el);

            this.consumersListRegion.show(this.views.consumersList);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    // TODO: make widget views reusable and more configurable (to be used in different contexts)
    $.common.widget.PreferredInterpreterView = $.app.ItemView.extend({
        template: 'common/widget/preferredinterpreter',

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        modelEvents: {
            "change:language": "render"
        },

        onRender: function () {
            var model = this.model;
            var that = this;

            var isView = this.options.frameConfig.get("isView");

            this.views = {
                interpreterDD: {
                    selector: ".interpreter .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("preferredInterpreter"),
                        ui: {
                            placeholder: "Type or select an interpreter",
                            inputClassName: "interpreter-select",
                            labelField: "displayName",
                            popupHeader: "Interpreter",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                if (that.model.get("language")) {
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "language.id", "eq", that.model.get("language").id);
                                }
                                filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.contactStatus.active.id);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);

                                $.common.ajaxCallToDropDownComplete(App.config.context + '/api/contact', filtersJSON, response);
                            },
                            allowEmpty: false,
                            allowEmptyAltText: "[Other interpreter]"
                        },
                        dropdown: {
                            disabled: true
                        },
                        create: {
                            disabled: true
                        }
                    })
                }
            };

            this.listenTo(this.views.interpreterDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        description: data.label
                    };
                }
                this.model.set("preferredInterpreter", modelStub);

                // remove error classes
                this.$(this.views.interpreterDD.selector).closest(".control-group").removeClass("error");
            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.interpreterDD.selector).html(this.views.interpreterDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.SpecialInstructionsView = $.app.ItemView.extend({
        template: 'common/widget/specialinstructions',

        initialize: function () {
            if (this.options.frameConfig.get("isView")) {
                this.model.set("isView", true);
            }
        },

        updateSpecialInstructions: function () {
            var companySpecialInstructions = this.model.get("companySpecialInstructions") || "";
            var customerSpecialInstructions = this.model.get("customerSpecialInstructions") || "";
            var contactSpecialInstructions = this.model.get("contactSpecialInstructions") || "";

            // tinyMCE (Edit mode)
            this.$el.find('#companySpecialInstructions').val(companySpecialInstructions);
            this.$el.find('#customerSpecialInstructions').val(customerSpecialInstructions);
            this.$el.find('#contactSpecialInstructions').val(contactSpecialInstructions);

            // <textarea> (Secure)
            this.$el.find('#customerRoleSpecialInstructions').html(customerSpecialInstructions);
            this.$el.find('#contactRoleSpecialInstructions').html(contactSpecialInstructions);

            // tabs (View mode)
            this.$el.find('#company-special-instructions-tab .controls').html(companySpecialInstructions);
            this.$el.find('#customer-special-instructions-tab .controls').html(customerSpecialInstructions);
            this.$el.find('#contact-special-instructions-tab .controls').html(contactSpecialInstructions);
        },

        onRender: function () {
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.InterpreterView = $.app.ItemView.extend({
        template: 'common/widget/interpreter',

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        onRender: function () {
            var model = this.model;
            var that = this;

            var isView = this.options.frameConfig.get("isView");

            this.views = {
                interpreterDD: {
                    selector: ".interpreter",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("interpreter"),
                        ui: {
                            placeholder: "Type or select an interpreter",
                            inputClassName: "interpreter-select",
                            labelField: "displayName",
                            popupHeader: "Interpreter",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", that.model.get("company").id);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                if (that.model.get("language")) {
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "language.id", "eq", that.model.get("language").id);
                                }

                                $.common.ajaxCallToDropDownComplete(App.config.context + '/api/contact', filtersJSON, response);
                            },
                            allowEmpty: false,
                            allowEmptyAltText: "[Other interpreter]"
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/api/contact',
                                data: {
                                    filters: function () {
                                        var filtersJSON = {
                                            groupOp: "AND",
                                            rules: []
                                        };
                                        filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", that.$(".interpreter-select").val());
                                        if (that.model.get("language")) {
                                            filtersJSON = addOrUpdateFilter(filtersJSON, "language.id", "eq", that.model.get("language").id);
                                        }

                                        return JSON.stringify(filtersJSON);
                                    },
                                    rows: -1
                                },
                                onSuccess: function (response, ui) {
                                    var responseJSON = JSON.parse(response);
                                    ui.popupBody.html("");
                                    var dropDownView = new $.common.widget.DropDownInterpretersView({
                                        el: ui.popupBody,
                                        collection: new Backbone.Collection(responseJSON.rows)
                                    });

                                    dropDownView.render();
                                }
                            }
                        },
                        create: {
                            disabled: true
                        },
                        disabledInputs: !this.options.enabled
                    })
                }
            };

            this.listenTo(this.views.interpreterDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        description: data.label
                    };
                }
                this.model.set("interpreter", modelStub);

                // remove error classes
                this.$(this.views.interpreterDD.selector).closest(".control-group").removeClass("error");
            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.interpreterDD.selector).html(this.views.interpreterDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });


    $.common.widget.customer = $.common.widget.customer || {};

    // TODO: these views only have different styling (i.e. no labels etc.). Should consoliate with regular widgets. Much of code from widget.Language etc is copied in
    // specific view for customer dashboard
    $.common.widget.customer.LanguageView = $.app.ItemView.extend({
        template: 'common/widget/customer/language',

        onRender: function () {
            var model = this.model;
            var that = this;

            var isView = false;

            this.views = {
                languageDD: {
                    selector: ".language .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("language"),
                        ui: {
                            placeholder: "Type or select a language",
                            inputClassName: "language-select",
                            labelField: "displayName",
                            popupHeader: "Language",
                            isView: isView
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                $.ajax({
                                    url: App.config.context + "/language/listAvailable",
                                    dataType: 'json',
                                    data: {
                                        term: request.term
                                    },
                                    success: function (langs /* response */ , textStatus, jqXHR) {

                                        var results = [];

                                        for (var i = 0; i < langs.length; i++) {

                                            var label = langs[i].label;

                                            if (langs[i].alternates) {
                                                label += " [Alternates: " + langs[i].alternates + "]";
                                            }

                                            results.push({
                                                id: langs[i].id,
                                                label: label,
                                                value: label,
                                                iso639_3Tag: langs[i].iso639_3Tag,
                                                uuid: langs[i].uuid
                                            });
                                        }

                                        if (results.length === 0) {
                                            results.push({
                                                id: 0,
                                                label: "[No matches. Try an alternative spelling]",
                                                value: "[No matches. Try an alternative spelling]"
                                            });
                                        }

                                        response(results);
                                    }
                                });
                            }
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/language/languages'
                            }
                        },
                        create: {
                            disabled: true
                        }
                    })
                }
            };

            this.listenTo(this.views.languageDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        uuid: data.uuid,
                        iso639_3Tag: data.iso639_3Tag || data["data-iso639_3tag"] // the data-attribute is always lower case, hence 3tag
                    };
                }
                this.model.set("language", modelStub);

                // remove error classes
                this.$(this.views.languageDD.selector).closest(".control-group").removeClass("error");
            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.languageDD.selector).html(this.views.languageDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.widget.customer.CustomerView = $.app.ItemView.extend({
        template: 'common/widget/customer/customer',

        onRender: function () {
            var model = this.model;

            var that = this;

            this.views = {
                customerDD: {
                    selector: ".customer .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("customer"),
                        ui: {
                            placeholder: "[All Customers]",
                            inputClassName: "customer-select",
                            inputName: "customer",
                            popupHeader: "Customer",
                            labelField: "name",
                            isView: false
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var clients = new $.core.CustomerCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                // filter client by term
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.customerStatus.active.id);

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                clients.setSorting("name", "asc");
                                clients.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(clients, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("name"),
                                        label: m.get("name") + " (" + m.get("accountingReference") + ")",
                                        uuid: m.get("uuid")
                                    };
                                });
                            },
                            allowEmpty: false
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/customers'
                            },
                            allowEmpty: false
                        },
                        create: {
                            disabled: true
                        },
                        disabledInputs: false
                    })
                }
            };


            this.listenTo(this.views.customerDD.view, "change", function (data) {
                var modelStub;
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        name: data.label,
                        uuid: data.uuid
                    };
                }
                this.model.set("customer", modelStub);
            });

            this.$(this.views.customerDD.selector).html(this.views.customerDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    // specific view for customer dashboard
    $.common.widget.customer.ClientView = $.app.ItemView.extend({
        template: 'common/widget/customer/client',

        modelEvents: {
            "change:customer": "render"
        },

        onRender: function () {
            var model = this.model;

            var customer = this.model.get("customer");

            var enabled = customer ? true : false;

            var that = this;

            this.views = {
                clientDD: {
                    selector: ".client .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("client"),
                        ui: {
                            placeholder: "[All Clients]",
                            inputClassName: "client-select",
                            inputName: "client",
                            popupHeader: "Client",
                            labelField: "name",
                            isView: false
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var clients = new $.core.ClientCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                // add customer if it's selected
                                if (model.get("customer") && model.get("customer").id !== "") {
                                    filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", model.get("customer").id);
                                }
                                // limit to active clients only
                                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", true);
                                // filter client by term
                                // TODO: do an OR search with accounting reference here
                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                // TODO: pass in busines unit (if needed)

                                var filters = JSON.stringify(filtersJSON, null, "\t");


                                clients.setSorting("name", "asc");
                                clients.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(clients, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("name"),
                                        label: m.get("name") + " (" + m.get("accountingReference") + " / " + m.get("customer").name + ")",
                                        customer: m.get("customer"),
                                        uuid: m.get("uuid")
                                    };
                                });
                            },
                            allowEmpty: false
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/clients',
                                data: {
                                    "customer.id": (customer ? customer.id : '')
                                }
                            },
                            allowEmpty: false
                        },
                        create: {
                            disabled: true
                        },
                        disabledInputs: !enabled
                    })
                }
            };


            this.listenTo(this.views.clientDD.view, "change", function (data) {
                var modelStub;
                var clientElement = $(".client-select");
                if (!data.id) {
                    modelStub = null;
                } else {
                    modelStub = {
                        id: data.id,
                        name: data.name || data.label,
                        uuid: data.uuid
                    };

                    /*that.model.set({
                     client: ui.item.client,
                     pinCode: ui.item.pinCode,
                     customer: ui.item.customer
                     });*/

                    //that.options.frameConfig.set("customerConfig", ui.item.customer.config);
                }
                this.model.set("client", modelStub);
                //that.render();

                // remove error classes
                this.$(this.views.clientDD.selector).closest(".control-group").removeClass("error");
            });

            this.$(this.views.clientDD.selector).html(this.views.clientDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    // specific view for customer dashboard
    $.common.widget.customer.LocationView = $.app.ItemView.extend({
        template: 'common/widget/customer/location',

        modelEvents: {
            "change:client": "render"
        },

        onRender: function () {
            var model = this.model;

            var customer = this.model.get("customer");
            var client = this.model.get("client");

            var enabled = customer ? (client ? true : false) : false;

            this.views = {
                locationDD: {
                    selector: ".location .controls",
                    view: new $.common.DropdownAutocompleteView({
                        model: this.model.get("location"),
                        ui: {
                            placeholder: "[All Locations]",
                            inputClassName: "location-select",
                            labelField: "displayLabel",
                            inputName: "location",
                            popupHeader: "Location",
                            isView: false
                        },
                        autocomplete: {
                            provider: function (request, response) {

                                var addresses = new $.core.CustomerAddressCollection();

                                // local variables
                                var filtersJSON = {
                                    groupOp: "AND",
                                    rules: []
                                };

                                // add customer (always pass customer for billing locations)
                                filtersJSON = addOrUpdateFilter(filtersJSON, "customer.id", "eq", model.get("customer").id);
                                filtersJSON = addOrUpdateFilter(filtersJSON, "client.id", "eq", model.get("client").id);
                                // limit to active clients only
                                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", true);

                                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", request.term);
                                // TODO: pass in business unit (if needed)
                                // TODO: pass client if set

                                var filters = JSON.stringify(filtersJSON, null, "\t");

                                addresses.setSorting("addrEntered", "asc");
                                addresses.queryParams.filters = filters;

                                $.common.collectionCallToDropDownComplete(addresses, response, function (m) {
                                    return {
                                        id: m.id,
                                        name: m.get("displayLabel"),
                                        label: m.get("displayLabel"),
                                        phone: m.get("phone"),
                                        publicNotes: m.get("publicNotes"),
                                        timeZone: m.get("timeZone"),
                                        uuid: m.get("uuid")
                                    };
                                });
                            },
                            allowEmpty: false
                        },
                        dropdown: {
                            ajax: {
                                url: App.config.context + '/company/addresses',
                                data: {
                                    "customer.id": (customer ? customer.id : ''),
                                    "client.id": (client ? client.id : '')
                                }
                            },
                            allowEmpty: false
                        },
                        create: {
                            disabled: true
                        },
                        disabledInputs: !enabled
                    })
                }
            };

            this.listenTo(this.views.locationDD.view, "change", function (data) {
                var modelStub;
                if (!data.id && data.label) {
                    // We want to catch the case when the "Other location" option is selected
                    this.$el.find(".location-alt").show();
                } else {
                    this.$el.find(".location-alt").hide();
                }

                if (!data.id) {
                    modelStub = null;
                } else {
                    if (data.timeZone || data.timezone) {
                        this.model.set("timeZone", (data.timeZone || data.timezone));
                    } else {
                        this.model.set("timeZone", App.config.userData.timeZone);
                    }
                    modelStub = {
                        id: data.id,
                        displayLabel: data.label,
                        publicNotes: (data.publicNotes || data.publicnotes), // the dropdown popup ignores case so need both
                        uuid: data.uuid
                    };
                }
                this.model.set("location", modelStub);

                // remove error classes
                this.$(this.views.locationDD.selector).closest(".control-group").removeClass("error");
            });

            //this.views.requestorDD.view.el = this.$(this.views.requestorDD.selector);
            //this.views.requestorDD.view.render();
            this.$(this.views.locationDD.selector).html(this.views.locationDD.view.render().el);

            // have to reset elements on each render
            this.callbacks(this.el, this.model);
            this.formatElements();
            this.showSecured();
        }
    });

    $.common.CustomerAssociationView = $.app.ItemView.extend({

        tagName: "div",

        template: 'customer/dashboard/association',

        initialize: function (options) {

        },

        events: {

        },

        modelEvents: {
            "change:customer": function () {
                this.model.set({
                    "client": null,
                    "location": null
                });
                this.render();
            },
            "change:client": function () {
                this.model.set({
                    "location": null
                });
                this.render();
            },
            "change:location": function () {
                this.render();
            }
        },

        onRender: function () {

        }

    }); // end association view

    // common dropdown autocomplete view
    $.common.DropdownAutocompleteView = $.app.ItemView.extend({
        template: "common/dropdownautocomplete/show",

        defaults: {
            ui: {
                placeholder: "Type, select or create new",
                clear: "Clear",
                choose: "Choose",
                create: "New",
                inputClassName: "",
                labelField: "name",
                isView: false
            },
            autocomplete: {
                delay: 400,
                cacheLength: 1,
                /* ie fix */
                highlight: true,
                minLength: 2,
                data: {
                    nd: function () {
                        return (new Date()).getTime();
                    }
                }
            },
            create: {
                modal: {
                    view: null,
                    model: null
                },
                disabled: false
            },
            dropdown: {
                ajax: {
                    data: {}
                }
            },
            disabledInputs: false
        },

        ui: {
            autocompleteField: ".input-autocomplete",
            controls: ".widget-controls",
            popup: ".autocompletePopup",
            popupHeader: ".autocompletePopup .popupHeader span",
            popupBody: ".autocompletePopup .popupBody div"
        },

        className: "dropdown-autocomplete",

        initialize: function () {
            this.options = _.merge({}, this.defaults, this.options);
        },

        events: {
            "click .widget-clear:not(.disabled)": "clearAction",
            "click .widget-choose:not(.disabled)": "chooseAction",
            "click .widget-create:not(.disabled)": "createAction",

            "hover .popupBlock li": function (e) {
                var shortText = $(e.currentTarget).text().substring(0, 35).split(" ").slice(0, -1).join(" ") + "...";

                this.ui.popupHeader.text(shortText);
            },

            "click .popupBlock li": function (e) {
                //var data = _.object(_.map(e.currentTarget.attributes, function (elmt) { return [elmt.name, elmt.value] }))
                var contactPerson = $(e.currentTarget).data("contactPerson");
                var data = {
                    label: $(e.currentTarget).text(),
                    name: $(e.currentTarget).text()
                };
                _.each(e.currentTarget.attributes, function (elmt) {
                    data[elmt.name] = elmt.value;
                });

                if (contactPerson) {
                    data.contactPerson = contactPerson;
                }

                this.setValue(data);
            },

            "click .select-custom": function (e) {
                var data = {
                    id: null,
                    label: this.options.dropdown.allowEmptyAltText,
                    value: this.options.dropdown.allowEmptyAltText
                };
                this.setValue(data);
                e.preventDefault();
            }
        },

        clearAction: function () {
            this.setValue("");
            return false;
        },

        chooseAction: function (e) {
            var that = this;
            this.ui.popup.show();

            // create ajax data from merged data objects
            var data = _.extend(this.options.dropdown.ajax.data, {
                // our hypothetical feed requires UNIX timestamps
                "company.id": App.config.company.id,
                "name": that.ui.autocompleteField.val(),
                "allowEmpty": that.options.dropdown.allowEmpty
            });

            // merge ajax object
            var ajx = _.extend(this.options.dropdown.ajax, {
                dataType: 'html',
                success: function (doc) {
                    if (this.onSuccess) {
                        this.onSuccess(doc, that.ui);
                    } else {
                        that.ui.popupBody.html(doc);
                    }
                }
            });

            // overwrite data
            ajx.data = data;

            $.ajax(ajx);

            $(document).one('click', function () {
                that.ui.popup.hide();
            });

            return false;
        },

        createAction: function () {
            var that = this;
            var view = that.options.create.modal.view;
            var mdl = that.options.create.modal.model;

            if (mdl.id) {
                mdl.fetch({
                    success: function (model, response) {
                        view.model = mdl;
                        view.render();
                    },
                    error: function (model, response) {
                        handleActionError({
                            message: "An error was encountered retrieving the model. Please contact the administrator if the problem persists."
                        });
                    }
                });
            } else {
                //this.renderView(view, model);
                view.model = mdl;
                view.render();
            }
        },

        serializeData: function () {
            return _.extend({}, this.model, {
                ui: this.options.ui
            });
        },

        setValue: function (value) {
            if (!value) {
                this.ui.autocompleteField.val("");
                this.trigger("change", value);
                if (this.options.parentView && this.options.eventIdentifier) {
                    this.options.parentView.trigger("clear:" + this.options.eventIdentifier, null);
                }
            } else if (value.label) {
                this.ui.autocompleteField.val(value.label);
                this.trigger("change", value);
                if (this.options.parentView && this.options.eventIdentifier) {
                    this.options.parentView.trigger("change:" + this.options.eventIdentifier, value);
                }
            }
        },

        delegateCustomEvents: function () {
            this.initAutocomplete();
            this.initDropdown();
        },

        onRender: function () {
            this.isRendered = true;

            var buttonCount = 3;

            if (this.options.create.disabled) {
                buttonCount--;
                this.ui.controls.find(".widget-create").remove();
            }

            if (this.options.dropdown.disabled) {
                buttonCount--;
                this.ui.controls.find(".widget-choose").remove();
            }

            if (buttonCount === 2) {
                this.$el.addClass("two-button");
            } else if (buttonCount === 1) {
                this.$el.addClass("one-button");
            }
            if (this.options.disabledInputs) {
                this.disableInputs();
            }

            this.delegateCustomEvents();
        },

        disableInputs: function () {
            this.options.disabledInputs = true;
            if (this.isRendered) {
                this.ui.controls.find("input").attr("disabled", "disabled");
                this.ui.controls.find("a").addClass("disabled");
            }
        },

        enableInputs: function () {
            this.options.disabledInputs = false;
            if (this.isRendered) {
                this.ui.controls.find("input").removeAttr("disabled");
                this.ui.controls.find("a").removeClass("disabled");
            }
        },

        initAutocomplete: function () {
            var data, params, autocompleteSource, parseResponse, that = this;
            this.ui.autocompleteField.autocomplete(_.extend({
                search: function (event, ui) {
                    // Use the source as the base url with a compiled list of paramters
                    // from the options.autocomplete.data array
                    if (_.isFunction(that.options.autocomplete.provider)) {
                        if (that.options.autocomplete.allowEmpty) {
                            autocompleteSource = function (request, response) {
                                parseResponse = function (results) {
                                    results.push({
                                        id: null,
                                        label: that.options.autocomplete.allowEmptyAltText,
                                        value: that.options.autocomplete.allowEmptyAltText
                                    });
                                    response(results);
                                };
                                that.options.autocomplete.provider(request, parseResponse);
                            };
                            that.ui.autocompleteField.autocomplete("option", "source", autocompleteSource);
                        } else {
                            that.ui.autocompleteField.autocomplete("option", "source", that.options.autocomplete.provider);
                        }
                    } else {
                        if (that.options.autocomplete.allowEmpty) {
                            autocompleteSource = function (request, response) {
                                data = that.options.autocomplete.data;
                                data.term = request.term;
                                params = _.map(data, function (value, key, list) {
                                    return key + "=" + (_.isFunction(value) ? value(that) : value);
                                }).join("&");
                                $.ajax({
                                    url: that.options.autocomplete.provider + "?" + params,
                                    dataType: 'json',
                                    success: function (results) {
                                        results.push({
                                            id: null,
                                            label: that.options.autocomplete.allowEmptyAltText,
                                            value: that.options.autocomplete.allowEmptyAltText
                                        });
                                        response(results);
                                    }
                                });
                            };
                            that.ui.autocompleteField.autocomplete("option", "source", autocompleteSource);
                        } else {
                            params = _.map(that.options.autocomplete.data, function (value, key, list) {
                                return key + "=" + (_.isFunction(value) ? value(that) : value);
                            }).join("&");
                            that.ui.autocompleteField.autocomplete("option", "source", that.options.autocomplete.provider + "?" + params);
                        }
                    }
                },
                select: function (event, ui) {
                    that.setValue(ui.item);
                }
            }, this.options.autocomplete));
        },

        initDropdown: function () {}
    });

    $.common.AvailabilityTypeSelectOptionGroup = $.app.ItemView.extend({

        template: "scheduler/availability-type-optgroup",

        onRender: function () {

            var that = this;

            that.$(".availabilityQuickFilters").append("<option></option>");
            that.$(".availabilityQuickFilters").append("<optgroup label='Available'></optgroup>");
            that.$(".availabilityQuickFilters").append("<optgroup label='Unavailable'></optgroup>");

            // add availability types to scheduler legend
            for (var key in App.dict.availabilityType) {
                if (App.dict.availabilityType.hasOwnProperty(key)) {

                    var type = App.dict.availabilityType[key];

                    if (type.available === true) {

                        that.$(".availabilityQuickFilters optgroup[label=Available]").append("<option value='" + type.id + "'>" + type.name + "</option>");

                    } else {

                        that.$(".availabilityQuickFilters optgroup[label=Unavailable]").append("<option value='" + type.id + "'>" + type.name + "</option>");

                    }
                }
            }

            // enable / disable guarantee for interpreters
            if (!$.app.mixins.templateHelpersMixin.isGuaranteeEditable(this.model)) {

                // disable select control for interpreters
                this.$("select.availabilityQuickFilters").attr("disabled", "true");
            }

            if ($.app.mixins.templateHelpersMixin.hasRole("cont")) {

                // disable guarantee and forfeit selection for interpreters
                this.$("select.availabilityQuickFilters option[value='" + App.dict.availabilityType.guarantee.id + "']").attr("disabled", "true");
                this.$("select.availabilityQuickFilters option[value='" + App.dict.availabilityType.forfeit.id + "']").attr("disabled", "true");
            }
        }
    });

    $.common.AvailabilityTypeLegend = $.app.ItemView.extend({

        template: "scheduler/availability-type-legend",

        onRender: function () {

            var that = this;

            // add availability types to scheduler legend
            for (var key in App.dict.availabilityType) {
                if (App.dict.availabilityType.hasOwnProperty(key)) {

                    var type = App.dict.availabilityType[key];

                    if (type.available === true) {

                        that.$(".scheduler-legend-available-container").append("<div><span class='scheduler-legend-availability' style='background-color: " + type.colorHex + "'></span> " + type.name + "</div>");

                    } else {

                        that.$(".scheduler-legend-unavailable-container").append("<div><span class='scheduler-legend-availability' style='background-color: " + type.colorHex + "'></span> " + type.name + "</div>");

                    }
                }
            }
            // convenience to show the legend when debugging
            // that.$("#scheduler-legend").show();
        }
    });


    $.common.PayableItemView = $.app.ItemView.extend({

        tagName: "tr",

        template: 'common/payableitem/show'

    }); // end payable item view


    // common payable items view
    $.common.PayableItemsView = $.app.CompositeView.extend({

        template: "common/payableitems/show",

        itemView: $.common.PayableItemView,

        itemViewContainer: "#payableItems tbody"

    }); // end payable items view

    $.common.CommentView = $.app.ItemView.extend({

        tagName: "div",

        template: 'common/comment/comment',

        initialize: function () {
            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            'click a.markRead': 'markRead'
        },

        modelEvents: {
            'sync': 'render'
        },

        onBeforeRender: function () {

            // clean up about to be phantom tooltips
            this.$("[rel=tooltip]").tooltip('hide');
        },

        onRender: function () {

            this.showSecured();
            this.formatElements();
            this.callbacks(this.$el, this.model);
        },

        markRead: function (evt) {

            this.model.set({
                readStatus: true,
                readBy: App.config.user,
                readDate: new Date()
            });

            this.model.save();
        }

    }); // end comment view

    $.common.CommentEditView = $.app.ItemView.extend({

        tagName: "div",

        template: 'common/comment/edit',

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click .saveComment': 'saveComment'
        },

        saveComment: function (evt) {

            var that = this;

            this.model.save({}, {
                success: function () {

                    // remove view
                    that.remove();
                    that.collection.add(that.model, {
                        at: 0
                    });
                },
                error: popupFetchOptions.error
            });

        }

    }); // end comment view

    // comments view
    $.common.CommentsView = $.app.CompositeView.extend({

        template: "common/comment/comments",

        itemView: $.common.CommentView,

        itemViewContainer: ".comments",

        events: {
            'click .addComment': 'addComment',
            'click .saveComment': 'saveComment'
        },

        modelEvents: {
            "sync": "render"
        },

        onRender: function () {

            if (this.model && this.model.id) {
                this.$el.find(".comments-body").removeClass("hidden");
                this.$el.find("#saveFirstMessage").hide();
                var filter = {
                    groupOp: "AND",
                    rules: []
                };

                filter = addOrUpdateFilter(filter, "parentEntityType", "eq", _.isFunction(this.options.parentEntityType) ? this.options.parentEntityType() : this.options.parentEntityType);
                filter = addOrUpdateFilter(filter, "parentEntityId", "eq", _.isFunction(this.options.parentEntityId) ? this.options.parentEntityId() : this.options.parentEntityId);

                this.collection.queryParams.filters = JSON.stringify(filter, null, "\t");
                this.collection.setSorting("createdDate", 1);

                if (this.options.parentEntityId) {
                    this.collection.fetch();
                }
            } else {
                this.$el.find("#saveFirstMessage").find(".well").html("Please save the " + this.options.display + " before adding a new comment");
            }
        },

        addComment: function (evt) {

            var comment = new $.core.Comment({
                parentEntityType: _.isFunction(this.options.parentEntityType) ? this.options.parentEntityType() : this.options.parentEntityType,
                parentEntityId: _.isFunction(this.options.parentEntityId) ? this.options.parentEntityId() : this.options.parentEntityId,
                company: {
                    id: App.config.company.id
                }
            });

            // inject proper context for save security
            //if (App.config.customer && App.config.customer.id !== "" && App.config.customer.id !== null) {
            if ($.app.mixins.templateHelpersMixin.hasRole("cust")) {
                comment.set({
                    customer: {
                        id: this.model.get("customer") ? this.model.get("customer").id : "" //App.config.customer.id
                    }
                });
            }
            if ($.app.mixins.templateHelpersMixin.hasRole("cont")) {
                comment.set({
                    interpreter: {
                        id: App.config.interpreter.id
                    }
                });
            }

            var commentView = new $.common.CommentEditView({
                model: comment,
                collection: this.collection
            });

            this.$(".newComment").append(commentView.render().el);
            this.$(".newComment [name=body]").focus();
            commentView.delegateEvents();
        }

    }); // end comments view

    $.common.CommentCollectionCountView = $.app.ItemView.extend({

        template: "common/comment/count",

        collectionEvents: {
            "sync": "render"
        },

        onRender: function () {
            var totalCount = this.collection.size();

            var unreadCount = this.collection.where({
                readStatus: null
            }).length;

            this.$("span").prop("title", unreadCount + " of " + totalCount + " Unread");
            this.$("span").html(totalCount);
            if (unreadCount > 0) {
                this.$("span").addClass("badge-warning");
            } else {
                this.$("span").addClass("badge-info");
            }
            this.$("[title]").tooltip({
                placement: "left"
            });
        }

    });

    $.common.CommentCountView = $.app.ItemView.extend({

        template: "common/comment/count",

        onRender: function () {
            var totalCount = this.model.get("total");
            var unreadCount = this.model.get("unread");

            this.$("span").prop("title", unreadCount + " of " + totalCount + " Unread");
            this.$("span").html(totalCount);
            if (unreadCount > 0) {
                this.$("span").addClass("badge-warning");
            } else {
                this.$("span").addClass("badge-info");
            }
            this.$("[title]").tooltip({
                placement: "left"
            });
        }

    });

    $.common.CommentsPopupView = $.app.ItemView.extend({

        template: "common/comment/comments-popup",

        onRender: function () {
            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal();

            var commentsView = new $.common.CommentsView({
                el: this.$("#comments"),
                model: this.model,
                collection: this.collection,
                parentEntityType: function () {
                    return "superBooking";
                },
                parentEntityId: function () {
                    return this.model.get("superBooking").id;
                }.bind(this),
                display: "booking"
            });

            commentsView.render();
            // show edit box on open
            commentsView.addComment();

            //this.callbacks(this.$el, this.model);
            //$("#modalContainer").modal('hide');
        }
    });

    $.common.MoreConsumersView = $.app.LayoutView.extend({

        template: "job/consumer/more-consumers",

        regions: {
            "consumersListRegion": ".more-consumers-list-container",
            "consumerDDRegion": ".more-consumers-dropdown",
        },

        ui: {
            "consumerSelected": ".consumer-select"
        },

        events: {
            "click .widget-edit-primary-consumer": "editPrimaryConsumer"
        },

        initialize: function () {
            this.views = {};

            this.views.consumerDD = {
                selector: ".more-consumers-dropdown",
                view: {}
            };
        },

        /**
         * Check if we have to return from server Customer Specific Consumers only
         * @returns {boolean}
         */
        isCustomerSpecific: function () {
            var customerConfig = this.options.frameConfig.get("customerConfig") || null;
            var companyConfig = this.options.frameConfig.get("companyConfig") || null;
            var companyConfigCustomerSpecificConsumer = companyConfig && companyConfig.customerSpecificConsumer;
            var customerConfigCustomerSpecificConsumer = customerConfig && customerConfig.customerSpecificConsumer;
            return !!(companyConfigCustomerSpecificConsumer && customerConfigCustomerSpecificConsumer);
        },

        /**
         * Check if user can create Consumers.
         * Depends on Customer Config and User role.
         * @returns {boolean}
         */
        isConsumerCreateEnabled: function () {
            var customerConfig = this.options.frameConfig.get("customerConfig") || null;
            var isInternalUser = !!_.contains(App.config.userData.roles, "comp");
            return isInternalUser || !!(customerConfig && customerConfig.consumerCreateEnabled);
        },

        getCreateConfig: function () {
            var selectedCustomer = this.model.get("customer");
            var selectedCustomerId = (selectedCustomer && selectedCustomer.id) || null;
            var selectedConsumers = this.options.collection;
            var lastAdditionalConsumer = (selectedConsumers && selectedConsumers.at(selectedConsumers.length - 1)) || null;

            var newConsumer = new $.core.Consumer({
                "active": true,
                "company.id": App.config.company.id
            });

            var newConsumerView = new $.common.ConsumerQuickAddView({
                model: lastAdditionalConsumer || newConsumer,
                customerId: selectedCustomerId,
                customerSpecific: this.isCustomerSpecific(),
                parentView: this
            });

            return {
                modal: {
                    view: newConsumerView,
                    model: newConsumer
                },
                disabled: !this.isConsumerCreateEnabled()
            };
        },

        getDropDownAjaxConfig: function () {
            var selectedConsumers = this.options.collection;
            return {
                url: App.config.context + '/api/consumer',
                data: {
                    filters: function () {
                        var consumerSelected = this.ui.consumerSelected.val();
                        var filters = this.generateFilters(consumerSelected);
                        return _.isObject(filters) ? JSON.stringify(filters) : "";
                    }.bind(this)
                },
                onSuccess: function (response, ui) {
                    var responseJSON,
                        dropDownView,
                        notSelectedConsumers = [],
                        selectedConsumer = this.model.get("consumer"),
                        selectedConsumersId = selectedConsumers && _.map(_.pluck(selectedConsumers.toJSON(), "id"), function (id) {
                            return parseInt(id) || 0;
                        });

                    if (!response) {
                        return;
                    }

                    if (selectedConsumer && selectedConsumer.id) {
                        selectedConsumersId.push(parseInt(selectedConsumer.id));
                    }

                    responseJSON = JSON.parse(response || null);
                    ui.popupBody.html("");

                    notSelectedConsumers = _.filter(responseJSON.rows, function (consumer) {
                        return !_.contains(selectedConsumersId, consumer.id);
                    }, this);

                    dropDownView = new $.common.widget.DropDownConsumersView({
                        el: ui.popupBody,
                        collection: new Backbone.Collection(notSelectedConsumers)
                    });
                    dropDownView.render();
                }.bind(this)
            };
        },

        generateFilters: function (name) {
            var company = this.model.get("company");
            var companyId = company && company.id;
            var customer = this.model.get("customer");
            var customerId = customer && customer.id;
            var isInternalUser = _.contains(App.config.userData.roles, "comp");
            var customerSpecific = this.isCustomerSpecific();

            // Fetch all consumers if customer specific is false
            var ignoreCustomerSpecific = isInternalUser || !customerSpecific; // If internal user, set ignore customer specific to true

            var filterBuilder = new $.filterbuilder.init({
                groupOp: "AND",
                rules: []
            });

            filterBuilder.add({
                field: "company.id",
                op: "eq",
                data: companyId
            }).add({
                field: "active",
                op: "eq",
                data: true
            });

            if (customerId) {
                filterBuilder.add({
                    field: "customer.id",
                    op: "eq",
                    data: customerId
                });
            }

            if (name) {
                filterBuilder.add({
                    field: "name",
                    op: "bw",
                    data: name
                });
            }

            if (!customerSpecific || ignoreCustomerSpecific) {
                filterBuilder.add({
                    field: "ignoreCustomerSpecific",
                    op: "eq",
                    data: true
                });
            } else {
                filterBuilder.add({
                    field: "customerSpecific",
                    op: "eq",
                    data: customerSpecific
                });
            }

            return filterBuilder.build();
        },

        onRender: function () {
            var isView = this.options.frameConfig.get("isView");
            var selectedConsumers = this.options.collection;
            var lastAdditionalConsumer = (selectedConsumers && selectedConsumers.at(selectedConsumers.length - 1)) || null;
            var selectedConsumer = this.model.get("consumer");
            var $modalEl = $("#modalContainer");

            // If the Consumer is cleared out, then reset the More Consumers list
            if (!selectedConsumer) {
                selectedConsumers.reset();
                lastAdditionalConsumer = null;
            }

            this.views.consumersList = new $.common.ConsumersEditableListView({
                model: this.model,
                isView: isView,
                hideAddMore: true,
                collection: selectedConsumers,
                frameConfig: this.options.frameConfig,
                parentView: this
            });

            this.views.consumerDD.view = new $.common.DropdownAutocompleteView({
                parentView: this,
                name: lastAdditionalConsumer instanceof Backbone.Model ?
                    lastAdditionalConsumer.get("name") : "",
                model: lastAdditionalConsumer,
                ui: {
                    placeholder: "Type, select a consumer",
                    inputClassName: "more-consumers-select",
                    inputName: "more-consumers",
                    popupHeader: "More Consumers",
                    labelField: "more-consumer-name",
                    isView: isView
                },
                autocomplete: {
                    provider: function (request, response) {
                        if (!request || !response) {
                            return;
                        }

                        $.common.ajaxCallToDropDownComplete(
                            App.config.context + '/api/consumer',
                            this.generateFilters(request.term),
                            response,
                            'name'
                        );
                    }.bind(this),
                    allowEmpty: true
                },
                create: this.getCreateConfig(),
                dropdown: {
                    ajax: this.getDropDownAjaxConfig()
                },
                disabledInputs: !selectedConsumer
            });

            this.listenTo(this.views.consumerDD.view, "change", function (data) {
                var selectedConsumer;
                var selectedConsumers = this.options.collection;
                var modelStub = data && data.id ? {
                    id: data.id,
                    name: data.label || data.name
                } : null;

                if (!modelStub) {
                    return;
                }

                selectedConsumer = $.core.Consumer.findOrCreate(modelStub);

                // Update the model so we can edit it when clicking on the Edit icon (DropdownAutocompleteView)
                this.views.consumerDD.view.options.create.modal.model = selectedConsumer;

                // Add the model to the collection (Selected Consumers - this.options.collection)
                selectedConsumers.add(selectedConsumer, {
                    merge: true
                });
            }.bind(this));

            this.consumerDDRegion.show(this.views.consumerDD.view);
            this.consumersListRegion.show(this.views.consumersList);

            $modalEl.html(this.el);
            $modalEl.modal();
        },

        editPrimaryConsumer: function (el) {
            var selectedConsumer = this.model.get("consumer");
            var selectedConsumerId = (selectedConsumer && selectedConsumer.id) || null;
            var selectedCustomer = this.model.get("customer");
            var selectedCustomerId = (selectedCustomer && selectedCustomer.id) || null;
            var consumer = $.core.Consumer.findOrCreate({
                "id": selectedConsumerId,
                "active": true,
                "company.id": App.config.company.id
            });

            var consumerView = new $.common.ConsumerQuickAddView({
                model: consumer,
                customerId: selectedCustomerId,
                customerSpecific: this.isCustomerSpecific(),
                parentView: this
            });
            consumerView.render();
        }
    });

    $.common.ConsumersListItemView = $.app.ItemView.extend({
        template: "common/widget/consumerslistitem",
        tagName: "li",
        className: "consumer-list-item"
    });

    $.common.ConsumersListView = $.app.CompositeView.extend({
        template: "common/widget/consumerslist",
        itemView: $.common.ConsumersListItemView,
        itemViewContainer: ".consumers-list",

        events: {
            "click .widget-more-consumers": "moreConsumers"
        },

        serializeData: function () {
            return _.extend({
                "obj": this.model.toJSON(),
                "hideAddMore": this.options.hideAddMore,
                "isView": this.options.isView
            });
        },

        onRender: function () {
            this.showSecured();
        },

        moreConsumers: function (evt) {
            var view = new $.common.MoreConsumersView({
                model: this.model,
                frameConfig: this.options.frameConfig,
                collection: this.collection
            });
            view.render();
        }
    });

    $.common.ConsumersListEditableItemView = $.common.ConsumersListItemView.extend({
        template: "common/widget/consumerslistitemeditable",

        events: {
            "click .widget-remove-consumer": "removeConsumer",
            "click .widget-edit-consumer": "editConsumer"
        },

        removeConsumer: function (el) {
            this.collection.remove(this.model);
        },

        onConsumerFetchSuccess: function (model, response) {
            var customer = this.options.job.get("customer");
            var customerId = (customer && customer.id) || null;
            var customerConfig = this.options.frameConfig.get("customerConfig") || null;
            var customerSpecific = App.config.company.config.customerSpecificConsumer ? (customerConfig ? customerConfig.customerSpecificConsumer : App.config.company.config.customerSpecificConsumer) : false;
            var consumerView = new $.common.ConsumerQuickAddView({
                model: this.model,
                customerId: customerId,
                customerSpecific: !!customerSpecific,
                parentView: this.options.parentView
            });
            consumerView.render();
        },

        onConsumerFetchError: function (model, response) {
            handleActionError({
                message: "An error was encountered retrieving the Consumer. Please contact the administrator if the problem persists."
            });
        },

        editConsumer: function (el) {
            var consumer = $.core.Consumer.findOrCreate({
                id: this.model.get("id")
            });
            consumer.fetch({
                success: this.onConsumerFetchSuccess.bind(this),
                error: this.onConsumerFetchError.bind(this)
            });
        }
    });

    $.common.ConsumersEditableListView = $.common.ConsumersListView.extend({
        itemView: $.common.ConsumersListEditableItemView,
        itemViewOptions: function () {
            return {
                job: this.model,
                hideAddMore: this.options.hideAddMore,
                isView: this.options.isView,
                collection: this.collection,
                frameConfig: this.options.frameConfig,
                parentView: this.options.parentView
            };
        }
    });

    /**
     * view to manage the display of comments for the jobs in the collection. it's critical that this view
     * does is not rendered directly as the el passed in is that of the container where the jobs are listed
     * e.g. the grid or calendar
     *
     * el: container where the comment counts are saved
     * collection: collection of jobs to lookup comments for
     */
    $.common.CommentCountsManagerView = $.app.ItemView.extend({

        /**
         * el: container where comment count divs are
         * collection: collection of jobs to query comments for
         */
        initialize: function () {

            this.commentCounts = new $.core.CommentCountCollection();

            var filter = {
                groupOp: "AND",
                rules: []
            };

            var parentEntityIds = _.map(this.collection.models, function (m) {
                return m.get("superBooking").id;
            });

            filter = addOrUpdateFilter(filter, "parentEntityType", "eq", "superBooking");
            filter = addOrUpdateFilter(filter, "parentEntityId", "in", parentEntityIds);

            // // grouping comment count
            // var projectionsJSON = {
            //     rules: [{ // group by parent entity id
            //         projectionName: "groupProperty",
            //         field: "parentEntityId",
            //         name: "parentEntityId"
            //     },
            //         { // get max created date for each grouping
            //             projectionName: "max",
            //             field: "createdDate",
            //             name: "createdDate"
            //         },
            //         { // total notifications in each grouping
            //             projectionName: "count",
            //             field: "id",
            //             name: "total"
            //         }
            //     ]
            // };

            this.commentCounts.bind("sync", this.showCommentCounts, this);

            this.commentCounts.queryParams.filters = JSON.stringify(filter, null, "\t");
            // comments.queryParams.projections = JSON.stringify(projectionsJSON);
            this.commentCounts.queryParams.rows = -1;
            this.commentCounts.fetch();
        },

        showCommentCounts: function () {

            var that = this;

            _.each(this.commentCounts.models, function (commentCount) {

                // TODO: how to make sure these get cleaned up when grid / calendar reloads?
                var countView = new $.common.CommentCountView({
                    el: that.$(".comments-count-container-" + commentCount.get("parentEntityId")),
                    model: commentCount
                });
                countView.render();
            });

        }
    });


    $.common.JobActionsView = $.app.ItemView.extend({

        template: "common/actions/job",

        initialize: function () {
            // add job mixins
            _.extend(this, $.app.mixins.visitActionsMixin);

            this.options.frameConfig.bind('change:customerConfig', this.render);
        },

        serializeData: function () {

            var companyConfig = App.dict.defaults.companyConfig;
            return _.extend({
                obj: this.model.toJSON(),
                config: companyConfig
            }, this.options.frameConfig.toJSON());

        },

        events: {
            'click .widget-save': 'saveAction',
            'click .widget-edit': 'editAction',
            'click .widget-create': 'createAction',
            'click .widget-cancel': 'cancelAction',
            'click .widget-clone': 'cloneAction',
            'click .widget-duplicate': 'duplicateAction',
            'click .widget-repeat': 'repeatAction',
            'click .widget-close': 'closeAction',
            'click .widget-delete': 'deleteAction',
            'click .widget-price-quote-visit': 'visitQuotationAction',
            'click .widget-price-quote-superBooking': 'superbookingQuotationAction',
            'click .widget-unlock': 'unlockAction'
        },

        onRender: function () {
            // Calendar Button view
            if (!this.options.frameConfig.get("isNewJob")) {
                var addToCalendarWidgetView = new $.common.AddToCalendarWidgetView({
                    model: this.model
                });
                this.$('.addtocalendar-widget').append(addToCalendarWidgetView.render().$el);
            }
            this.showSecured();
        }
    });

    $.common.InterpreterJobActionsView = $.app.ItemView.extend({

        template: "common/actions/interpreterjob",

        ui: {
            saveButton: '.widget-save'
        },

        initialize: function () {
            // add job mixins
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, this.options.frameConfig.toJSON());

        },

        events: {
            'click .widget-save': 'saveAction',
            'click .widget-edit': 'editJobAction',
            'click .widget-assign': 'assignInterpreterAction',
            'click .widget-unassign': 'unassignInterpreterAction',
            'click .widget-view-offers': 'viewInterpreterOffersAction',
            'click .widget-confirm-customer': 'confirmCustomerAction',
            'click .widget-confirm-interpreter': 'confirmInterpreterAction',
            'click .widget-confirm-requestor': 'confirmRequestorAction',
            'click .widget-send-adhoc-email': 'sendAdHocEmailAction',
            'click .widget-email-new-job': 'emailNewJobAction',
            'click .widget-email-customer-confirmation': 'emailCustomerConfirmationAction',
            'click .widget-email-interpreter-confirmation': 'emailInterpreterConfirmationAction',
            'click .widget-send-adhoc-sms': 'sendAdHocSMSAction',
            'click .widget-resendcofirmation-sms': 'resendConfirmationSMSAction',
            'click .widget-resendreminder-sms': 'resendReminderSMSAction',
            'click .widget-price-quote': 'priceQuoteAction',
            'click .widget-incidentals': 'incidentalsAction',
            'click .widget-close': 'closeAction',
            'click .widget-vos': 'vosAction',
            'click .widget-eSig': 'eSigAction',
            'click .widget-cancel': 'cancelAction',
            'click .widget-decline': 'declineAction',
            'click .widget-delete': 'deleteAction',
            'click .widget-create-interaction': 'createInteractionAction'

        },

        isView: function () {
            return this.options &&
                this.options.frameConfig &&
                this.options.frameConfig instanceof Backbone.Model &&
                this.options.frameConfig.get("isView") === true;
        },

        onRender: function () {
            if (this.isView()) {
                this.ui.saveButton.hide();
            }
            this.showSecured();
        }
    });

    $.common.CalendarJobActionsView = $.app.ItemView.extend({

        template: "common/actions/calendarjob",

        initialize: function () {
            // add job mixins
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
        },

        serializeData: function () {

            var companyConfig = App.dict.defaults.companyConfig;
            return _.extend({
                obj: this.model.toJSON(),
                config: companyConfig
            }, this.options.frameConfig.toJSON());

        },

        events: {
            //   'click .widget-save': 'saveAction',
            //   'click .widget-edit': 'editJobAction',
            'click .widget-assign': 'assignInterpreterAction',
            'click .widget-unassign': 'unassignInterpreterAction',
            'click .widget-view-offers': 'viewInterpreterOffersAction',
            'click .widget-confirm-customer': 'confirmCustomerAction',
            'click .widget-confirm-interpreter': 'confirmInterpreterAction',
            'click .widget-confirm-requestor': 'confirmRequestorAction',
            'click .widget-send-adhoc-email': 'sendAdHocEmailAction',
            'click .widget-email-new-job': 'emailNewJobAction',
            'click .widget-email-customer-confirmation': 'emailCustomerConfirmationAction',
            'click .widget-email-interpreter-confirmation': 'emailInterpreterConfirmationAction',
            'click .widget-send-adhoc-sms': 'sendAdHocSMSAction',
            'click .widget-resendcofirmation-sms': 'resendConfirmationSMSAction',
            'click .widget-resendreminder-sms': 'resendReminderSMSAction',
            'click .widget-price-quote': 'priceQuoteAction',
            'click .widget-incidentals': 'incidentalsAction',
            'click .widget-close': 'closeAction',
            'click .widget-vos': 'vosAction',
            'click .widget-eSig': 'eSigAction',
            'click .widget-cancel': 'cancelAction',
            'click .widget-decline': 'declineAction',
            'click .widget-delete': 'deleteAction',
            'click .widget-create-interaction': 'createInteractionAction',
            'click .widget-create-follow-up': 'cloneAction',
            'click .widget-duplicate': 'duplicateAction',
            'click .widget-make-recurring': 'repeatAction',
            'click .widget-view-more': 'viewMoreAction',
            'click .widget-view-in-full': 'viewFullAction',
            'click .widget-edit-in-full': 'editAction',
            'click .widget-add-vos': 'uploadAction',
            'click .widget-start-video': 'startVideo',
            'click .widget-start-voice': 'startVoice'

        },

        onRender: function () {

            this.showSecured();
        }
    });

    $.common.AddToCalendarWidgetView = $.app.ItemView.extend({
        // Add To Calendar Widget view
        template: "common/calendar/addtocalendar",

        initialize: function () {

        },

        onRender: function () {
            addtocalendar.load();
            this.showSecured();
        }
    });

    $.common.BulkConfirmationOptionsView = $.app.ItemView.extend({
        initialize: function () {
            _.extend(this, $.app.mixins.subviewContainerMixin);
        },

        events: {
            "click #sendConfirmations": "sendConfirmations"
        },

        className: "bulkConfirmation",

        template: "scheduler/bulk/options/sendconfirmation",

        onRender: function () {
            var that = this;

            this.$('.periodStart, .periodEnd').daterangepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                onChange: function (startDate, endDate) {
                    setTimeout(function () {
                        that.updateFilters();
                    }, 100);
                },
                presetRanges: financialAndReportPresets,
                datepickerOptions: {
                    changeMonth: true,
                    changeYear: true
                },
                earliestDate: Date.parse('January 01, 2008'), //earliest date allowed
                latestDate: Date.parse('January 01, 2020') //latest date allowed
            });

            this.$('.periodStart, .periodEnd').change(function () {});

            this.showSecured();
        },

        sendConfirmations: function () {
            var startDate = this.$el.find(".periodStart").val();
            var endDate = this.$el.find(".periodEnd").val();
            var notifyInterpreters = this.$el.find(".notifyInterpreters").prop("checked");
            var notifyCustomers = this.$el.find(".notifyCustomers").prop("checked");
            var groupByConsumer = this.$el.find(".groupByConsumer").prop("checked");

            if (startDate && endDate) {
                var filtersJSON = {
                    groupOp: "AND",
                    rules: []
                };

                filtersJSON = addOrUpdateDateRangeFilter(startDate, endDate, "expectedStartDate", filtersJSON);
                // Exclude end states (closed, cancelled, unfulfilled, nonattendance)
                filtersJSON = addOrUpdateFilter(filtersJSON, "status.ids", "eq", "" + App.dict.bookingStatus['new'].id + "," + App.dict.bookingStatus.open.id + "," + App.dict.bookingStatus.assigned.id + "," + App.dict.bookingStatus.confirmed.id + "," + App.dict.bookingStatus.offered.id + "");

                var filters = JSON.stringify(filtersJSON);

                this.trigger('bulkConfirm', {
                    filters: filters,
                    notifyInterpreters: notifyInterpreters,
                    notifyCustomers: notifyCustomers,
                    groupByConsumer: groupByConsumer
                });
            } else {
                alert("Please select a date range.");
            }
        },

        updateFilters: function () {

        }
    });

    /**
     * view with no date filters and allows caller to specify the filters to use
     */
    $.common.BulkConfirmationOptionsNoDateFiltersView = $.common.BulkConfirmationOptionsView.extend({

        template: "scheduler/bulk/options/sendconfirmationnodatefilters",

        initialize: function (options) {
            this.model = new Backbone.Model();
            this.model.set("isCheckedAll", options.isCheckedAll);
            this.model.set("selectedModels", options.selectedModels);
            this.model.set("totalRecords", options.totalRecords);
        },

        sendConfirmations: function () {
            var notifyInterpreters = this.$el.find(".notifyInterpreters").prop("checked");
            var notifyCustomers = this.$el.find(".notifyCustomers").prop("checked");
            var groupByConsumer = this.$el.find(".groupByConsumer").prop("checked");

            this.trigger('bulkConfirm', {
                notifyInterpreters: notifyInterpreters,
                notifyCustomers: notifyCustomers,
                groupByConsumer: groupByConsumer
            });

        },

        onRender: function () {
            var that = this;

            this.showSecured();
        }
    });

    $.common.BulkSendEmailDigestView = $.app.ItemView.extend({

        initialize: function (options) {
            this.model = new Backbone.Model();
            this.model.set("isCheckedAll", options.isCheckedAll);
            this.model.set("selectedModels", options.selectedModels);
            this.model.set("totalRecords", options.totalRecords);
            this.model.set("title", options.title);
            this.model.set("eventType", options.eventType);
            this.model.set("emailType", options.emailType);
        },

        el: $("#modalContainer"),

        template: "common/bulksendemaildigestaction/show",

        modelEvents: {

        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        onRender: function () {

            this.$el.modal('show');
            //container.html(template({obj: model.toJSON(), options: options}));
            this.callbacks(this.$el, this.model);

            var grid = this.options.grid;
            var querySelect = this.options.querySelect;
            var queryFilters = this.options.grid.collection.queryParams.filters;
            var eventType = this.model.get("eventType");
            var emailType = this.model.get("emailType");
            var jobs;
            var params;

            this.on("ok", function (event) {

                var that = this;

                if (querySelect) {
                    jobs = new $.visit.v2.InterpreterVisitCollection(grid.collection);
                    params = {
                        eventType: eventType,
                        emailType: emailType,
                        filters: queryFilters,
                        update: JSON.stringify({})
                    };
                } else {
                    var selectedModels = grid.getSelectedModels();
                    jobs = new $.visit.v2.InterpreterVisitCollection(selectedModels);
                    params = {
                        eventType: eventType,
                        emailType: emailType
                    };
                }

                jobs.save(params).done(function (response) {
                    that.$el.modal('hide');
                    that.remove();
                    popupHandleSuccess({}, response, {
                        waitForOk: true
                    });
                }).fail(function (response) {
                    that.$el.modal('hide');
                    that.remove(); //call remove to unbind events
                    popupHandleError({}, response);
                });
            });
        }
    });

    $.common.BulkSendOfferConfirmActionView = $.app.ItemView.extend({

        initialize: function (options) {
            this.model = new Backbone.Model();
            this.model.set("isCheckedAll", options.isCheckedAll);
            this.model.set("selectedModels", options.selectedModels);
            this.model.set("totalRecords", options.totalRecords);
        },

        el: $("#modalContainer"),

        template: "common/bulksendofferconfirmaction/show",

        modelEvents: {

        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        onRender: function () {

            this.$el.modal('show');
            //container.html(template({obj: model.toJSON(), options: options}));
            this.callbacks(this.$el, this.model);

            var grid = this.options.grid;
            var querySelect = this.options.querySelect;
            var queryFilters = this.options.grid.collection.queryParams.filters;
            var eventType = "BULK_SEND_OFFER";
            var jobs;
            var params;

            this.on("ok", function (event) {

                var that = this;

                if (querySelect) {
                    jobs = new $.visit.v2.InterpreterVisitCollection(grid.collection);
                    params = {
                        eventType: eventType,
                        filters: queryFilters,
                        update: JSON.stringify({})
                    };
                } else {
                    var selectedModels = grid.getSelectedModels();
                    jobs = new $.visit.v2.InterpreterVisitCollection(selectedModels);
                    params = {
                        eventType: eventType
                    };
                }

                jobs.save(params).done(function (response) {
                    that.$el.modal('hide');
                    that.remove();
                    popupHandleSuccess({}, response, {
                        waitForOk: true
                    });
                }).fail(function (response) {
                    that.$el.modal('hide');
                    that.remove(); //call remove to unbind events
                    popupHandleError({}, response);
                });
            });
        }

    });

    $.common.BulkConfirmJobsActionView = $.app.ItemView.extend({

        initialize: function (options) {
            this.model = new Backbone.Model();
            this.model.set("isCheckedAll", options.isCheckedAll);
            this.model.set("selectedModels", options.selectedModels);
            this.model.set("totalRecords", options.totalRecords);
        },

        el: $("#modalContainer"),

        template: "common/bulkconfirmjobsaction/show",

        modelEvents: {

        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        onRender: function () {

            this.$el.modal('show');
            //container.html(template({obj: model.toJSON(), options: options}));
            this.callbacks(this.$el, this.model);

            var grid = this.options.grid;
            var querySelect = this.options.querySelect;
            var queryFilters = this.options.grid.collection.queryParams.filters;
            var eventType = "BULK_CONFIRM_JOBS";
            var jobs;
            var params;

            this.on("ok", function (event) {

                var that = this;

                if (querySelect) {
                    jobs = new $.visit.v2.InterpreterVisitCollection(grid.collection);
                    params = {
                        eventType: eventType,
                        filters: queryFilters,
                        update: JSON.stringify({})
                    };
                } else {
                    var selectedModels = grid.getSelectedModels();
                    jobs = new $.visit.v2.InterpreterVisitCollection(selectedModels);
                    params = {
                        eventType: eventType
                    };
                }

                jobs.save(params).done(function (response) {
                    that.$el.modal('hide');
                    that.remove();
                    popupHandleSuccess({}, response, {
                        waitForOk: true
                    });
                }).fail(function (response) {
                    that.$el.modal('hide');
                    that.remove(); //call remove to unbind events
                    popupHandleError({}, response);
                });
            });
        }

    });

    $.common.IvrCallDetailsView = $.app.ItemView.extend({

        initialize: function (options) {
            this.$el.on('hidden', function () {
                // clear the wider modal class when view is hidden (closed)
                if (this.classList.contains("modal-wide")) {
                    this.classList.remove("modal-wide");
                }
            });

            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            var callId = this.model.id;

            filtersJSON = addOrUpdateFilter(filtersJSON, "ivrCall.id", "eq", callId);

            this.collection = new $.core.IvrCallStepCollection();
            this.collection.setSorting("createdDate", "asc");
            this.collection.queryParams.filters = JSON.stringify(filtersJSON);

            this.backgridColumns = [{
                name: 'id',
                label: 'ID',
                cell: Backgrid.StringCell,
                editable: false
            }, {
                name: 'createdDate',
                label: 'Created Date',
                cell: $.app.backgrid.DateTimeCell,
                editable: false
            }, {
                name: 'step',
                label: 'Step',
                cell: Backgrid.StringCell,
                editable: false
            }, {
                name: 'digits',
                label: 'Input',
                cell: Backgrid.StringCell,
                editable: false
            }, {
                name: 'retryAttempt',
                label: 'Retry Attempt',
                cell: Backgrid.StringCell,
                editable: false
            }];

            this.grid = new Backgrid.Grid({
                columns: this.backgridColumns,
                collection: this.collection,
                emptyText: "No Call Steps"
            });

            this.paginator = new $.app.backgrid.Paginator({

                collection: this.collection
            });

            this.collection.fetch();
        },

        el: $("#modalContainer"),

        template: "common/ivrcalldetails/show",

        modelEvents: {

        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        onRender: function () {

            this.el.classList.add("modal-wide");
            this.$el.modal('show');
            this.callbacks(this.$el, this.model);

            this.$el.find(".ivr-call-steps").append(this.grid.render().$el);
            this.$el.find(".ivr-call-steps-paginator").append(this.paginator.render().$el);

            var recordingsView = new $.common.IvrCallRecordingsView({
                model: this.model,
                el: this.$(".recordings")
            });
            recordingsView.render();

            this.showSecured();

        }

    });

    $.common.ContactWorkerView = $.app.ItemView.extend({

        initialize: function (options) {
            this.$el.on('hidden', function () {
                // clear the wider modal class when view is hidden (closed)
                if (this.classList.contains("modal-wide")) {
                    this.classList.remove("modal-wide");
                }
            });
        },

        el: $("#modalContainer"),

        template: "common/contactworker/show",

        modelEvents: {

        },

        events: {
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        onRender: function () {

            var that = this;
            var statistics = this.model.get("statistics");

            // statistics is null if we are coming from the workers view
            // we need to initialize the Twilio Worker
            if (!statistics) {
                this.model.initializeWorker();
                statistics = this.model.workerClient.statistics;
            }

            if (statistics) {

                statistics.fetch(
                    // {"Hours":"24"},
                    // {"Minutes":"240"},
                    {
                        StartDate: new Date().addMonths(-1),
                        EndDate: new Date()
                    },
                    function (error, statistics) {
                        if (error) {
                            console.log(error.code);
                            console.log(error.message);
                            return;
                        }
                        var statisticsModel = new Backbone.Model(statistics.cumulative);
                        var statisticsView = new $.common.ContactWorkerStatisticsCumulativeView({
                            model: statisticsModel,
                            el: that.$(".statistics")
                        });
                        statisticsView.render();
                    }
                );
            }

            this.el.classList.add("modal-wide");
            this.$el.modal('show');
            this.callbacks(this.$el, this.model);

            this.showSecured();
        }

    });

    $.common.ContactWorkerStatisticsCumulativeView = $.app.ItemView.extend({

        template: "worker/statistics/cumulative",

        onRender: function () {
            this.formatElements(this.$el, this.model);
        }

    });

    $.common.ContactWorkerStatisticsRealtimeView = $.app.ItemView.extend({

        template: "worker/statistics/cumulative",

        onRender: function () {
            this.formatElements(this.$el, this.model);
        }
    });

    $.common.ContactWorkerEditView = $.app.ItemView.extend({

        initialize: function (options) {},

        el: $("#modalContainer"),

        template: "common/contactworker/edit",

        modelEvents: {

        },

        events: {
            "change textarea": "synchModel",
            "click .widget-save": function (evt) {
                var attributes = this.model.get("attributes");
                if (_.isObject(attributes)) {
                    // just save
                } else {
                    // assume string after modification
                    this.model.set({
                        attributes: JSON.parse(attributes)
                    });
                }
                this.model.addAttributes(this.model.get("attributes"));
                this.$el.modal('hide');
            }
        },

        onRender: function () {

            this.$el.modal('show');
            this.callbacks(this.$el, this.model);

            this.showSecured();
        }

    });

    $.common.JobStatusUpdateEmailView = $.app.ItemView.extend({

        initialize: function (options) {
            if (!this.model) {
                this.model = new $.core.EmailModel();
            }
            this.templates = new $.core.TemplateCollection([], {
                'company.id': App.config.company.id
            });
            var that = this;
            this.templates.fetch({
                success: function (templates, response) {
                    var template = templates.findWhere({
                        nameKey: "jobStatusUpdate"
                    });
                    that.model.set("subject", template.get("subject"));
                    that.model.set("body", template.get("body"));
                    that.render();
                },
                error: popupHandleError
            });
        },

        serializeData: function () {
            return {
                obj: this.model.toJSON()
            };
        },

        template: "common/email/jobstatusupdate",

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "click .cmd-widget-send": function () {
                this.trigger("send");
            }
        },

        onRender: function () {

            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal();

            this.callbacks(this.$el, this.model);

            this.on("send", function (event) {
                var emailParams = {
                    'cc': this.model.get('cc'),
                    'bcc': this.model.get('bcc'),
                    'subject': this.model.get('subject'),
                    'body': this.model.get('body'),
                    'replyTo': this.model.get('replyTo')
                };
                // single job
                if (this.options.jobModel) {
                    this.model.save({
                        'templateNameKey': 'jobStatusUpdate'
                    }).done(function (response) {
                        $("#modalContainer").modal('hide');
                        popupHandleSuccess({}, response, {
                            waitForOk: true
                        });
                    }).fail(function (response) {
                        $("#modalContainer").modal('hide');
                        popupHandleError({}, response);
                    });
                } else {
                    // Bulk
                    var eventType = "BULK_SEND_JOB_STATUS_UPDATE";
                    var jobs;
                    var params;
                    var grid = this.options.grid;
                    var querySelect = this.options.querySelect;
                    var queryFilters = this.options.grid.collection.queryParams.filters;

                    if (querySelect) {
                        jobs = new $.visit.v2.InterpreterVisitCollection(grid.collection);
                        params = {
                            eventType: eventType,
                            filters: queryFilters,
                            update: JSON.stringify({}),
                            emailParams: emailParams
                        };
                    } else {
                        var selectedModels = grid.getSelectedModels();
                        jobs = new $.visit.v2.InterpreterVisitCollection(selectedModels);
                        params = {
                            eventType: eventType,
                            emailParams: emailParams
                        };
                    }
                    jobs.save(params).done(function (response) {
                        $("#modalContainer").modal('hide');
                        popupHandleSuccess({}, response, {
                            waitForOk: true
                        });
                    }).fail(function (response) {
                        $("#modalContainer").modal('hide');
                        popupHandleError({}, response);
                    });
                }
            });
        }
    });

    $.common.AdHocSmsView = $.app.ItemView.extend({

        template: "common/sms/adhoc",

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click .cmd-widget-send": "send",
            "change [name=recipientType]": "loadRecipient",
            "change [name=templateNameKey]": "loadTemplate",
            "keyup [name=body]": "updateSendState",
            "change [name=body]": "updateSendState",
            "keyup [name=recipient]": "updateSendState",
            "change [name=recipient]": "recipientChanged"
        },

        initialize: function (options) {
            var that = this;
            this.templates = new $.core.SmsTemplateCollection([], {
                'company.id': App.config.company.id
            });
            this.interpreterJob = options.interpreterJob;
            this.interpreterJob.fetch({
                success: function () {
                    that.loadParticipants();
                }
            });
        },

        serializeData: function () {
            return {
                obj: this.model.toJSON(),
                templates: this.templates,
                interpreterJob: this.interpreterJob.toJSON(),
                interpreterNumber: !!this.interpreterNumber,
                requestorNumber: !!this.requestorNumber,
                consumerNumber: !!this.consumerNumber
            };
        },

        onRender: function () {
            var $modalEl = $("#modalContainer");
            $modalEl.html(this.el);
            $modalEl.modal();

            this.callbacks(this.$el, this.model);
            this.updateSendState();
            this.delegateEvents();
        },

        loadParticipants: function () {
            var that = this;

            this.interpreter = this.interpreterJob.get("interpreter");
            this.interpreterNumber = this.interpreter && this.interpreter.primaryNumber ? this.interpreter.primaryNumber.parsedNumber : null;

            if (this.interpreterNumber) {
                this.render();
            }

            var requestor = this.interpreterJob.get("requestor");
            if (requestor) {
                this.requestor = new $.core.Requestor({
                    id: requestor.id
                });
                this.requestor.fetch({
                    success: function (model) {
                        that.requestorNumber = model.get("number");
                        that.render();
                    }
                });
            }

            var consumer = this.interpreterJob.get("consumer");
            if (consumer) {
                this.consumer = $.core.Consumer.findOrCreate({
                    id: consumer.id
                });
                this.consumer.fetch({
                    success: function (model) {
                        that.consumerNumber = model.get("phoneNumber");
                        that.render();
                    }
                });
            }
        },

        loadRecipient: function (evt) {
            switch (this.model.get("recipientType")) {
            case "int":
                this.model.set("contact", this.interpreter);
                this.$("[name=recipient]")
                    .val(this.interpreterNumber)
                    .trigger("change");
                break;
            case "cus":
                this.model.set("requestor", this.requestor);
                this.$("[name=recipient]")
                    .val(this.requestorNumber)
                    .trigger("change");
                break;
            case "con":
                this.model.set("consumer", this.consumer);
                this.$("[name=recipient]")
                    .val(this.consumerNumber)
                    .trigger("change");
                break;
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

            this.$("[name=body]")
                .val(template ? template.get("body") : null)
                .trigger('change');
        },

        updateSendState: function () {
            var hasBody = !!this.$el.find("[name='body']").val();
            var hasRecipient = !!this.$el.find("[name='recipient']").val();
            this.$el.find(".cmd-widget-send").attr("disabled", !hasBody || !hasRecipient);
        },

        send: function () {
            this.trigger("send");
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
            this.updateSendState();
        }
    });

    $.common.AdHocEmailView = $.app.ItemView.extend({

        template: "common/email/adhoc",

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click .cmd-widget-send": function () {
                this.trigger("send");
            },
            "change [name=recipientType]": "loadRecipient",
            "change [name=templateNameKey]": "loadTemplate"
        },

        initialize: function (options) {
            this.templates = new $.core.TemplateCollection([], {
                'company.id': App.config.company.id
            });
            this.interpreterJob = options.interpreterJob;
            // TODO: interpreter job is not fully populated when loaded from calendar.
            this.interpreterJob.fetch();
        },

        serializeData: function () {
            return {
                obj: this.model.toJSON(),
                templates: this.templates,
                interpreterJob: this.interpreterJob.toJSON()
            };
        },

        onRender: function () {

            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal();

            this.callbacks(this.$el, this.model);
        },

        loadRecipient: function (evt) {
            var that = this;

            var recipientType = this.model.get("recipientType");

            if (recipientType == "int") {

                var interpreter = this.interpreterJob.get("interpreter");
                if (interpreter) {
                    this.$("[name=recipient]").val(interpreter.primaryEmail ? interpreter.primaryEmail.emailAddress : null).trigger('change');
                    // $.core.Contact.findOrCreate({id: interpreter.id}).fetch({
                    //     success: function(m) {
                    //         that.$("[name=recipient]").val(m.get("primaryEmail") ? m.get("primaryEmail").emailAddress : null).trigger('change');
                    //     }
                    // });
                }

            } else if (recipientType == "cus") {

                var notificationEmail = this.interpreterJob.get("notificationEmail");
                this.$("[name=recipient]").val(notificationEmail).trigger('change');

            } else if (recipientType == "con") {

                var consumer = this.interpreterJob.get("consumer");
                if (consumer) {
                    $.core.Consumer.findOrCreate({
                        id: consumer.id
                    }).fetch({
                        success: function (m) {
                            that.$("[name=recipient]").val(m.get("email")).trigger('change');
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
                "templateId": template.id
            });

            if (template) {
                this.$("[name=body]").val(template.get("body")).trigger('change');
                this.$("[name=subject]").val(template.get("subject") ? template.get("subject") : "Job #" + this.interpreterJob.id).trigger('change');
            }
        }
    });

    $.common.JobModalView = $.app.ItemView.extend({

        template: "booking/bare/bookingbare/show",

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel"
        },

        initialize: function (options) {
            this.model = options.model;
        },

        onRender: function () {

            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal();
            $modalEl.addClass("modal-wide");

            var audit = new $.core.Audit({
                type: "visit"
            });

            var auditView = new $.common.AuditView({
                el: this.$("#history"),
                model: audit
            });

            audit.id = this.model.get("visit").id;
            audit.fetch();
            auditView.render();

            var feedbackView = new $.common.FeedbackView({
                el: this.$("#feedback"),
                model: this.model
            });
            feedbackView.render();

            this.$(".edit_area").editable(function (value, settings) {
                var id = this.id.substr(this.id.indexOf("-") + 1);
                var attribute = this.id.substr(0, this.id.indexOf("-"));
                $.ajax({
                    url: App.config.context + '/booking/updateAjax',
                    dataType: 'json',
                    data: {
                        id: id,
                        value: value,
                        attribute: attribute
                    },
                    success: function (doc) {
                        //alert('all good');
                    },
                    error: function (doc) {
                        // alert("an error occurred verifying the booking.");
                    }
                });
                return (value);
            }, {
                type: 'textarea',
                rows: 1,
                cols: 30,
                cancel: 'Cancel',
                submit: 'OK',
                indicator: '<img src="/images/loader.gif">',
                tooltip: 'Click to edit...',
                onblur: "cancel"
            });

            this.formatElements(this.$el, this.model);

            this.showSecured();

            this.callbacks(this.$el, this.model);
        }
    });

    $.common.IvrCallRecordingView = $.app.CompositeView.extend({

        template: "common/ivrcalldetails/recording",

        onRender: function () {

            this.$(".recording").append("<span class='ivr-container-" + this.model.get("context") + "'></span>");

            var ivrRecording = new $.common.IvrRecordingView({
                model: this.model,
                containerView: this
            });
            ivrRecording.render();
        }

    });

    $.common.IvrCallRecordingsView = $.app.CompositeView.extend({

        initialize: function (options) {

            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            var callId = this.model.id;

            filtersJSON = addOrUpdateFilter(filtersJSON, "callSid", "eq", this.model.get("callSid"));

            this.collection = new $.core.IvrRecordingCollection();
            this.collection.setSorting("createdDate", "asc");
            this.collection.queryParams.filters = JSON.stringify(filtersJSON);

        },

        itemView: $.common.IvrCallRecordingView,

        itemViewContainer: ".recordings",

        template: "common/ivrcalldetails/recordings",

        onRender: function () {
            this.callbacks(this.$el, this.model);

            this.collection.fetch();

            this.showSecured();
        }
    });

    $.common.SchedulerInterpreterActionsView = $.app.ItemView.extend({

        template: "common/actions/schedulerinterpreter",

        initialize: function () {
            // add job mixins
            _.extend(this, $.app.mixins.schedulerInterpreterActionsMixin);
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            });

        },

        events: {
            'click .widget-assign': 'triggerAssignInterpreterAction',
            'click .widget-offers': 'viewOffersAction'
        },

        onRender: function () {
            this.showSecured();
        },

        triggerAssignInterpreterAction: function () {
            this.trigger("assignInterpreter", this.model);
        }
    });

    $.common.BaseRoleView = $.app.ItemView.extend({

        tagName: "div",

        className: "role",

        template: 'common/role/show',

        initialize: function (opts) {

            // the role is the role that can be selected / picked
            this.role = opts.role;
            // the model is the user with the list of authorities

        },

        serializeData: function () {

            return {
                obj: this.model.toJSON(),
                role: this.role
            };
        }
    }); // end base role view

    $.common.CheckboxRoleView = $.common.BaseRoleView.extend({

        tagName: "div",

        className: "role",

        template: 'common/role/checkbox',

        events: {
            'click .role': 'toggleRole'
        },

        toggleRole: function (evt) {

            var changed = evt.currentTarget;
            var $changed = $(changed);
            var name = $changed.attr("name");
            var value = $changed.val();

            var r, role;

            if ($changed.prop("checked")) {

                r = _.find(App.dict.role, function (r) {
                    return r.uuid === value;
                });

                role = $.core.Role.findOrCreate(r);

                this.model.get("authorities").add(role);

                this.model.set({
                    "roleType": role.get("friendlyName")
                });

            } else {

                r = _.find(App.dict.role, function (r) {
                    return r.uuid === value;
                });

                role = $.core.Role.findOrCreate(r);

                this.model.get("authorities").remove(role);

            }
        }

    });

    $.common.RadioRoleView = $.common.BaseRoleView.extend({

        tagName: "div",

        className: "role",

        template: 'common/role/radio',

        events: {
            'click .role': 'toggleRole'
        },

        toggleRole: function (evt) {

            var that = this;

            var changed = evt.currentTarget;
            var $changed = $(changed);
            var name = $changed.attr("name");

            var toAdd = $changed.val();
            /*var toRemove = $("input[name='" + name + "']:not(:checked)");

            _.each(toRemove, function(rmv) {

                var r = _.find(App.dict.role, function(r) { return r.uuid === $(rmv).val(); });

                var role = $.core.Role.findOrCreate(r);

                that.model.get("authorities").remove(role);
            });
            */

            // clear all previous roles
            this.model.get("authorities").reset();

            // add new role
            var r = _.find(App.dict.role, function (r) {
                return r.uuid === toAdd;
            });
            var role = $.core.Role.findOrCreate(r);
            this.model.get("authorities").add(role);
            this.model.set({
                "userType": role.get("friendlyName")
            });

        }

    });

    /**
     * base view for bulk actions on recurring job
     */
    $.common.JobBulkActionsView = $.app.ItemView.extend({

        initialize: function (options) {

            this.model = new Backbone.Model();
            this.jobModel = options.jobModel;
            this.onOk = options.onOk;
            this.cancelNotes = options.cancelNotes;
        },

        el: $("#modalContainer"),

        events: {
            "click .widget-ok": function (evt) {

                var bulkAction = $(evt.currentTarget).data('action') ? $(evt.currentTarget).data('action') : "self";

                // set the bulk update and action
                this.jobModel.set("bulkUpdate", bulkAction !== "self" ? true : false);
                this.jobModel.set("bulkAction", bulkAction);
                this.jobModel.set("cancelNotes", this.cancelNotes);

                this.trigger("ok");
            }
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, {
                job: this.jobModel.toJSON()
            });

        },

        onRender: function () {

            var that = this;

            this.$el.modal('show');
            this.callbacks(this.$el, this.model);

            this.on("ok", function (event) {

                that.onOk();

                that.$el.modal('hide');
                that.remove(); //call remove to unbind events
            });
        }
    });

    $.common.JobBulkEditOptionsView = $.common.JobBulkActionsView.extend({
        template: "common/jobbulkeditoptions/show"
    });

    $.common.JobBulkDeleteOptionsView = $.common.JobBulkActionsView.extend({
        template: "common/jobbulkdeleteoptions/show"
    });

    $.common.JobBulkCancelOptionsView = $.common.JobBulkActionsView.extend({
        template: "common/jobbulkcanceloptions/show"
    });

    /*
     job bulk actions on the grid
     */
    $.common.GridJobBulkActionsView = $.app.ItemView.extend({
        template: "common/actions/jobbulkactions",

        initialize: function (options) {
            // add actions
            _.extend(this, $.app.mixins.interpreterJobBulkActionsMixin);
            this.parentView = options.parentView;
        },

        events: {
            'click .sendOffersCmd': 'sendOffers',
            'click .sendCustomerNewJobCmd': 'sendCustomerNewJobEmail',
            'click .sendJobStatusUpdateCmd': 'sendJobStatusUpdateEmails',
            'click .sendConfirmationsCmd': 'sendConfirmationEmails',
            'click .confirmJobsCmd': 'confirmJobs'
        }
    });

    /**
     * summary view expects a JSON object, not a Backbone.Model.
     */
    $.common.RatePlanSummaryView = $.app.BaseView.extend({

        tagName: "li",

        template: JST['common/rateplansummary/show'],

        languageTierTemplate: JST['common/rateplansummary/languagetier'],

        serviceTierTemplate: JST['common/rateplansummary/servicetier'],

        initialize: function (options) {

            _.bindAll(this, 'render');
            this.association = this.options.association;
            if (this.association) {
                this.activeStartDate = this.association.get("activeStartDate");
                this.activeEndDate = this.association.get("activeEndDate");
            }

        },

        events: {

        },

        render: function () {

            // model is simpy json
            this.$el.append(this.template({
                obj: this.model,
                renderLanguageTier: this.languageTierTemplate,
                renderServiceTier: this.serviceTierTemplate,
                activeStartDate: this.activeStartDate,
                activeEndDate: this.activeEndDate
            }));

            _.each(this.model.languageTiers, function (tier) {
                this.renderLanguageTier(tier);
            }, this);

            return this;
        },

        renderLanguageTier: function (tier) {

            var languageTier = new $.common.LanguageTierSummaryView({
                model: tier
            });
            this.$(".language-tiers").append(languageTier.render().el);
        }

    }); // end rate plan view

    $.common.LanguageTierSummaryView = $.app.BaseView.extend({

        tagName: "span",

        template: JST['common/rateplansummary/languagetier'],

        render: function () {

            // model is simpy json
            this.$el.append(this.template({
                obj: this.model
            }));

            _.each(this.model.languageServices, function (tier) {
                this.renderServiceTier(tier);
            }, this);

            _.each(this.model.premiums, function (tier) {
                this.renderPremiumTier(tier);
            }, this);

            return this;
        },

        renderServiceTier: function (tier) {

            var serviceTier = new $.common.ServiceTierSummaryView({
                model: tier
            });
            this.$(".service-tiers").append(serviceTier.render().el);
        },

        renderPremiumTier: function (tier) {

            var premiumTier = new $.common.PremiumTierSummaryView({
                model: tier
            });
            this.$(".premium-tiers").append(premiumTier.render().el);
        }

    }); // end language tier summary view

    $.common.ServiceTierSummaryView = $.app.BaseView.extend({

        tagName: "span",

        template: JST['common/rateplansummary/servicetier'],

        render: function () {

            // model is simpy json
            this.$el.append(this.template({
                obj: this.model
            }));

            return this;
        }

    }); // end service tier summary view

    $.common.PremiumTierSummaryView = $.app.BaseView.extend({

        tagName: "span",

        template: JST['common/rateplansummary/premiumtier'],

        render: function () {

            // model is simpy json
            this.$el.append(this.template({
                obj: this.model
            }));

            _.each(this.model.premiumServices, function (tier) {
                this.renderServiceTier(tier);
            }, this);


            return this;
        },

        renderServiceTier: function (tier) {

            var serviceTier = new $.common.ServiceTierSummaryView({
                model: tier
            });
            this.$(".service-tiers").append(serviceTier.render().el);
        }

    }); // end premium tier summary view

    $.common.VisitNotesView = $.app.BaseView.extend({

        tagName: "div",

        template: JST['common/visitnotes/show'],

        initialize: function (options) {

            this.model.bind("sync", this.render, this);

        },

        events: {
            'click .saveNotesCmd': 'saveAction'

        },

        render: function () {

            // model is simpy json
            this.$el.html(this.template({
                obj: this.model.toJSON()
            }));

            this.callbacks(this.el, this.model);
            this.showSecured();

            return this;
        },

        saveAction: function (evt) {

            this.model.save(null, defaultFetchOptions);

        }

    }); // end rate plan view

    // verification view
    $.common.VerificationView = $.app.BaseView.extend({

        template: JST['common/verification/show'],

        initialize: function (options) {
            this.vosEnabled = App.config.company.config.vosEnabled && !options.disableVos;
            this.model.bind("sync", this.render, this);
        },

        events: {

        },

        render: function () {

            this.$el.append(this.template({
                obj: this.model.toJSON()
            }));

            // defaults
            var from = {
                w: App.config.signature.displayW,
                h: App.config.signature.displayH
            };
            var to = {
                w: App.config.signature.displayW,
                h: App.config.signature.displayH
            };

            if (this.model.get("hasSignature") && App.config.company.config.eSignatureEnabled) {

                this.$(".sigPad").show();

                from = {
                    w: this.model.get("w"),
                    h: this.model.get("h")
                };

                // convert signature to JSON if not already
                var sig = this.model.get("sig");
                if (typeof sig == 'string' || sig instanceof String) {

                    // II-7721 some signatures are being captured without [] around them. update here as quick fix
                    if (sig.startsWith('{"')) {
                        sig = "[" + sig + "]";
                    }
                    this.model.set({
                        sig: JSON.parse(sig)
                    });
                }

                this.model.set({
                    sigPad: {}
                });
                resetSignature(this.$(".sigWrapper"),
                    this.$('.sigPad'),
                    from,
                    to,
                    false /* draw only (i.e. no typing) */ ,
                    this.model.toJSON() /* sigObj */ );
            }

            if (this.model.get("hasVos") && this.vosEnabled) {

                this.$(".vos").show();
            }

            return this;
        }

    }); // end verification view


    $.common.InlineVerificationView = $.common.VerificationView.extend({
        template: JST['common/verification/inline'],

        render: function () {
            $.common.VerificationView.prototype.render.apply(this, arguments);

            if (this.model.get("hasVos")) {

                this.$(".vos").show();
            }

            if (this.model.get("hasSignature")) {

                this.$(".eSignature").show();
            }

        }
    });

    // messages ==============================================

    $.messages = {};

    $.messages.MessageListItemView = $.app.ItemView.extend({

        tagName: "li",

        className: "message",

        template: "messages/message/show",

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            this.render();
        },

        events: {

        },

        onRender: function () {
            var that = this;

            $(this.el).find(".msg").colorbox({
                html: that.model.get("body"),
                innerWidth: App.config.popups.msgs.width,
                innerHeight: App.config.popups.msgs.height
            });

            return this;
        }
    }); //end message view

    $.messages.ContactMessageListItemView = $.app.ItemView.extend({

        tagName: "li",

        className: "message",

        template: "messages/message/show",

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            this.model.on("markRead", this.markAsRead, this);
            this.model.on("markResolved", this.markAsResolved, this);
            this.render();
        },

        events: {

        },

        onRender: function () {
            var that = this;

            $(this.el).find(".msg").colorbox({
                html: this.model.get("body"),
                innerWidth: App.config.popups.msgs.width,
                innerHeight: App.config.popups.msgs.height,
                onOpen: function () {
                    if (that.model.get("audience.id") == App.dict.messageAudience.custom.id) {
                        that.model.set("messageRead", true);
                        that.model.save();
                    }
                }
            });

            if (this.model.get("audience.id") == App.dict.messageAudience.custom.id) {
                if (this.model.get("messageRead")) {
                    $(this.el).css("background-color", "#FFFFFF");
                }
            }

            return this;
        },

        markAsRead: function () {
            if (this.$el.find(".checkBox").is(':checked')) {
                this.model.set("messageRead", true);
                this.model.save();
            }
        },

        markAsResolved: function () {
            if (this.$el.find(".checkBox").is(':checked')) {
                this.model.set("messageResolved", true);
                this.model.save();
            }
        }

    }); //end message view

    $.messages.MessagesListView = $.app.CompositeView.extend({
        initialize: function () {
            this.paginator = new $.app.SimplePaginatorView({
                collection: this.collection
            });
        },

        template: "messages/message/messages",

        itemView: $.messages.MessageListItemView,

        itemViewContainer: "#inbox",

        onRender: function () {
            var that = this;

            this.collection.on("sync", function (collection, obj) {
                if (that.collection.size() === 0) {
                    that.$el.html("There are no current messages & alerts");
                    that.$el.css({
                        "margin": "auto",
                        "text-align": "center"
                    });
                }
            });

            this.collection.on("add", function (obj) {
                var now = new Date();
                var start = obj.get("dateActive") ? new Date.parseExact(obj.get("dateActive"), App.config.company.config.dateFormat) : now.addDays(-1);
                var end = obj.get("dateInactive") ? new Date.parseExact(obj.get("dateInactive"), App.config.company.config.dateFormat) : now.addDays(1);

                // only show messages within the active date range
                if (start < now) {

                }

                // only feature msgs / alerts for period of time
                if (start < now && now < end && $(".alert-" + obj.get("id")).length === 0) {

                    var alertView = null;
                    //display alert
                    if (obj.get('type.id') == App.dict.messageType.alert.id) {
                        //self rendering
                        alertView = new $.messages.AlertView({
                            el: $("#alerts-container"),
                            model: obj
                        });

                        alertView.$el.addClass("alert-" + obj.get("id"));
                    }

                    //display message
                    if (obj.get('type.id') == App.dict.messageType.message.id) {
                        //self rendering
                        alertView = new $.messages.InfoView({
                            el: $("#messages-container"),
                            model: obj
                        });

                        alertView.$el.addClass("alert-" + obj.get("id"));
                    }
                }
            });

            this.$el.find(".pagination-container").html(this.paginator.render().el);
        }
    });

    $.messages.ContactMessageListView = $.app.CompositeView.extend({
        initialize: function () {
            _.bindAll(this, 'markRead', 'markResolved');

            this.paginator = new $.app.SimplePaginatorView({
                collection: this.collection
            });
        },

        template: "messages/message/customMesseges",

        ui: {},

        itemView: $.messages.ContactMessageListItemView,

        itemViewContainer: "#custom-inbox",

        events: {
            "click #markRead": 'markRead',
            "click #markResolved": 'markResolved'
        },

        markRead: function () {
            var that = this;
            _.each(that.collection.models, function (item) {
                item.trigger("markRead");
            });
        },

        markResolved: function () {
            var that = this;
            _.each(that.collection.models, function (item) {
                item.trigger("markResolved");
            });
        },

        onRender: function () {
            var that = this;

            this.unread = 0;

            this.collection.on("sync", function (collection, obj) {
                if (obj.unread)
                    that.unread = parseInt(obj.unread, 10);

                that.$el.find("#unread").html("(" + that.unread + " unread)");

                if (that.collection.size() === 0) {
                    that.$el.html("There are no custom messages");
                    that.$el.css({
                        "margin": "auto",
                        "text-align": "center"
                    });
                }
            });

            this.collection.on("change:messageRead", function (item) {
                if (item.get('messageRead')) {
                    that.unread--;
                    that.$el.find("#unread").html("(" + that.unread + " unread)");
                }
            });

            this.$el.find(".pagination-container").html(this.paginator.render().el);
        }

    });

    $.messages.AlertView = $.app.BaseView.extend({

        tagName: "ul",

        className: "message list-links",

        template: JST["messages/alert/show"],

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.render();
        },

        events: {

        },

        render: function () {

            this.$el.show();
            this.$el.append(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));

            // attach to id and msg
            $(this.el).find("#msg" + this.model.id + ".msg").colorbox({
                html: this.model.get("body"),
                innerWidth: App.config.popups.msgs.width,
                innerHeight: App.config.popups.msgs.height
            });

            return this;
        }

    }); //end message list view

    $.messages.InfoView = $.app.BaseView.extend({

        tagName: "ul",

        className: "message list-links",

        template: JST["messages/info/show"],

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.render();
        },

        events: {

        },

        render: function () {
            this.$el.show();
            this.$el.append(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));

            // attach to id and msg
            $(this.el).find("#msg" + this.model.id + ".msg").colorbox({
                html: this.model.get("body"),
                innerWidth: App.config.popups.msgs.width,
                innerHeight: App.config.popups.msgs.height
            });

            return this;
        }

    }); //end message list view

    $.common.NotificationItemView = $.app.ItemView.extend({
        template: "common/notificationitem/show",

        onRender: function () {
            this.formatElements();
        }
    });

    $.common.NotificationEmptyView = $.app.ItemView.extend({
        template: "common/notificationempty/show"
    });

    $.common.NotificationListView = $.app.CompositeView.extend({
        initialize: function () {
            this.paginator = new $.app.SimplePaginatorView({
                collection: this.collection
            });
        },

        template: "common/notificationlist/show",

        itemView: $.common.NotificationItemView,

        itemViewContainer: ".list-container",

        emptyView: $.common.NotificationEmptyView,

        onRender: function () {
            this.$el.find(".pagination-container").html(this.paginator.render().el);
        }
    });

    $.common.CalendarView = $.app.LayoutView.extend({
        initialize: function (attr) {
            if (this.options.templateFile) {
                this.template = this.options.templateFile;
            } else {
                this.template = "common/calendar/calendar";
            }
            this.$el.on('hidden', function () {
                // clear the wider modal class when view is hidden (closed)
                if (this.classList.contains("calendar-view-modal")) {
                    this.classList.remove("calendar-view-modal");
                }
            });
            this.booking = this.collection;
            var that = this;
            this.options = attr;
            _.bindAll(this, 'refreshCalendar');
            _.bindAll(this, 'bookingAdapter');
            _.bindAll(this, 'change');
            _.extend(this, $.app.mixins.commonAppMixin);
            this.collection.bind('change', this.change);
            Backbone.on("bookingUpdate", this.refreshCalendar);
            $(window).unload(function () {
                var state = {
                    view: that.$('#calendar').fullCalendar('getView'),
                    date: that.$('#calendar').fullCalendar('getDate').toISOString()
                };
                $.common.save(that.options.key, state);
            });
            var eventBinding = this.options.eventBinding;
            if (eventBinding === "interpreter") {
                this.job = false;
                this.customer = false;
                this.interpreter = true;
                this.language = false;
                this.employmentCategory = false;
            } else if (eventBinding === "customer") {
                this.job = false;
                this.customer = true;
                this.interpreter = false;
                this.language = false;
                this.employmentCategory = false;
            } else if (eventBinding === "job") {
                this.job = true;
                this.customer = false;
                this.interpreter = false;
                this.language = false;
                this.employmentCategory = false;
            } else if (eventBinding === "language") {
                this.job = false;
                this.customer = false;
                this.interpreter = false;
                this.language = true;
                this.employmentCategory = false;
            } else if (eventBinding === "employmentCategory") {
                this.job = false;
                this.customer = false;
                this.interpreter = false;
                this.language = false;
                this.employmentCategory = true;
            }
        },

        events: {
            "click #datePickerImage": "datePickerSelect",
            //"hover .fc-button-legend" :showLegend,
            "contextmenu a#publicCal": "setPublicUrl",
            "click #synchCal": "synchCal",
            "change select[name=calendar-view-type]": "changeView",
            'click #send-confirmations': 'showConfirmationOptions',
            "click .openSideNav": "openSideNav"
        },

        serializeData: function () {
            return {
                "showSidenav": !$.common.isCustomer() && !$.common.isInterpreter(),
                "showFiltersApplied": !$.common.isCustomer() && !$.common.isInterpreter()
            };
        },

        openSideNav: function () {
            $("#mySidenav").css("transform", "translateX(0)");
        },

        showConfirmationOptions: function (evt) {
            evt.preventDefault();

            var that = this;

            var view = new $.common.BulkConfirmationOptionsView();
            var modal = new Backbone.BootstrapModal({
                content: view,
                okText: "Cancel",
                cancelText: ""
            });

            modal.open();

            modal.listenTo(view, 'bulkConfirm', function (options) {
                var dummyCollection = new $.visit.v2.InterpreterVisitCollection();
                dummyCollection.save({
                    eventType: "BULK_CONFIRM_EMAIL",
                    filters: options.filters,
                    notifyCustomers: options.notifyCustomers,
                    groupByConsumer: options.groupByConsumer,
                    notifyInterpreters: options.notifyInterpreters,
                    update: "dummy"
                }).done(function (response) {
                    popupHandleSuccess({}, response);
                }).fail(function (response) {
                    popupHandleError({}, response);
                });
                modal.close();
            });
        },

        changeView: function () {
            switch ($("select[name=calendar-view-type]").val()) {
            case "job":
                this.bookingTab();
                break;
            case "interpreter":
                this.interpreterTab();
                break;
            case "customer":
                this.customerTab();
                break;
            case "language":
                this.languageTab();
                break;
            case "category":
                this.employmentCategoryTab();
                break;
            default:
                break;
            }
        },

        /**
         * handler for adding new booking to collection backing calendar. this event is removed before fetch and added after fetch due to the way the
         * rendering takes place currently. Ideally this would be refactored to render events only through this event handler i.e. as events are added
         * to the collection
         * @param booking
         */
        addBooking: function (booking) {

            this.$('#calendar').fullCalendar('renderEvent', adaptJobModelToCalendarEvent(booking, getAttributeFromModel(booking, "id", "N/A", getJobStatusCssColorFromJobModel(booking))));

        },

        change: function (booking) {
            var event;
            var fcEvent = $('#calendar').fullCalendar('clientEvents', booking.id)[0];

            // may be null
            if (fcEvent) {
                if (this.job === true) {
                    event = adaptJobModelToCalendarEvent(booking, getAttributeFromModel(booking, "id", "N/A"), getJobStatusCssColorFromJobModel(booking));
                } else if (this.interpreter === true) {
                    event = adaptJobModelToCalendarEvent(booking, getAttributeFromModel(booking, "interpreter.displayName", "Unassigned"));
                } else if (this.customer === true) {
                    event = adaptJobModelToCalendarEvent(booking, getAttributeFromModel(booking, "customer.name", "N/A (No Customer)"));
                } else if (this.language === true) {
                    event = adaptJobModelToCalendarEvent(booking, getAttributeFromModel(booking, "language.displayName", "N/A (No Language)"));
                } else if (this.employmentCategory === true) {
                    event = adaptJobModelToCalendarEvent(booking, getAttributeFromModel(booking, "employmentCategory.name", "N/A (No Category)"));
                }
                for (var prop in event) {
                    if (event.hasOwnProperty(prop)) {
                        fcEvent[prop] = event[prop];
                    }
                }
                this.$('#calendar').fullCalendar('updateEvent', fcEvent);
            }
        },

        interpreterTab: function () {
            this.job = false;
            this.customer = false;
            this.interpreter = true;
            this.language = false;
            this.employmentCategory = false;
            var events = adaptJobModelsToCalendarEvents(this.collection.models, "interpreter.displayName", "Unassigned");
            this.$('#calendar').fullCalendar('removeEvents').fullCalendar('removeEventSource', this.$('#calendar').fullCalendar('clientEvents'));
            this.$('#calendar').fullCalendar('addEventSource', events);
        },

        customerTab: function () {
            this.job = false;
            this.customer = true;
            this.interpreter = false;
            this.language = false;
            this.employmentCategory = false;
            var events = adaptJobModelsToCalendarEvents(this.collection.models, "customer.name", "N/A (No Customer)");
            this.$('#calendar').fullCalendar('removeEvents').fullCalendar('removeEventSource', this.$('#calendar').fullCalendar('clientEvents'));
            this.$('#calendar').fullCalendar('addEventSource', events);
        },

        bookingTab: function () {
            this.job = true;
            this.customer = false;
            this.interpreter = false;
            this.language = false;
            this.employmentCategory = false;
            var events = adaptJobModelsToCalendarEvents(this.collection.models, "id", "N/A", getJobStatusCssColorFromJobModel);
            this.$('#calendar').fullCalendar('removeEvents').fullCalendar('removeEventSource', this.$('#calendar').fullCalendar('clientEvents'));
            this.$('#calendar').fullCalendar('addEventSource', events);
        },

        languageTab: function () {
            this.job = false;
            this.customer = false;
            this.interpreter = false;
            this.language = true;
            this.employmentCategory = false;
            var events = adaptJobModelsToCalendarEvents(this.collection.models, "language.displayName", "N/A (No Language)");
            this.$('#calendar').fullCalendar('removeEvents').fullCalendar('removeEventSource', this.$('#calendar').fullCalendar('clientEvents'));
            this.$('#calendar').fullCalendar('addEventSource', events);
        },

        employmentCategoryTab: function () {
            this.job = false;
            this.customer = false;
            this.interpreter = false;
            this.language = false;
            this.employmentCategory = true;
            var events = adaptJobModelsToCalendarEvents(this.collection.models, "employmentCategory.name", "N/A (No Category)");
            this.$('#calendar').fullCalendar('removeEvents').fullCalendar('removeEventSource', this.$('#calendar').fullCalendar('clientEvents'));
            this.$('#calendar').fullCalendar('addEventSource', events);
        },

        bookingAdapter: function (start, end, callback) {
            var filters = new $.filterbuilder
                .init(this.options.searchFilters)
                .update({
                    field: "expectedStartDate",
                    op: "ge",
                    data: start.toString(App.config.company.config.calDateFormat),
                    type: "date",
                    format: App.config.company.config.dateFormat
                })
                .update({
                    field: "expectedStartDate",
                    op: "le",
                    data: end.toString(App.config.company.config.calDateFormat),
                    type: "date",
                    format: App.config.company.config.dateFormat
                })
                .updateAll(this.options.presetFilters)
                .call(businessUnitFilter, ["customer"], this.options.key === "CompanyCalendar")
                .call(businessUnitFilter, ["contact"], this.options.key === "CompanyContactList")
                .toString();

            var bookings = this.collection;
            bookings.queryParams.filters = filters;
            bookings.queryParams.rows = -1;
            bookings.queryParams.fields = 'uuid,company,superBooking,visit,expectedStartDate,expectedEndDate,timeZone,status,bookingMode,language,actualLocation,interpreter,customer,employmentCategory,primaryRef,preventEdit,userEditing,startEditing';

            var that = this;

            // de-register add new for new events being added to collection
            //this.collection.off('add', that.addBooking, that);

            // save the xhr to cancel later if new fetch initiated (e.g. move to different month)
            if (window[this.options.key + 'XHRReq'] && window[this.options.key + 'XHRReq'].readyState > 0 && window[this.options.key + 'XHRReq'].readyState < 4) {

                window[this.options.key + 'XHRReq'].abort();
            }

            window[this.options.key + 'XHRReq'] = bookings.fetch({
                success: function (model, response) {
                    var events = [];
                    // Clear existing events to avoid duplicates
                    that.$('#calendar').fullCalendar('removeEvents').fullCalendar('removeEventSource', that.$('#calendar').fullCalendar('clientEvents'));
                    if (that.job === true) {
                        events = adaptJobModelsToCalendarEvents(bookings.models, "id", "N/A", getJobStatusCssColorFromJobModel);
                    } else if (that.interpreter === true) {
                        events = adaptJobModelsToCalendarEvents(bookings.models, "interpreter.displayName", "Unassigned");
                    } else if (that.customer === true) {
                        events = adaptJobModelsToCalendarEvents(bookings.models, "customer.name", "N/A (No Customer)");
                    } else if (that.language === true) {
                        events = adaptJobModelsToCalendarEvents(bookings.models, "language.displayName", "N/A (No Language)");
                    } else if (that.employmentCategory === true) {
                        events = adaptJobModelsToCalendarEvents(bookings.models, "employmentCategory.name", "N/A (No Category)");
                    }
                    callback(events);

                    var queryFiltersAppliedView = new $.common.QueryFiltersAppliedView({
                        el: that.$el.find("#queryFiltersAppliedView"),
                        filters: that.collection.queryParams.filters || null
                    });

                    queryFiltersAppliedView.render();
                }
            });

        },

        onRender: function () {
            this.showSecured();
            // if view is modal - also needs calendar view modal class
            if (this.el.classList.contains("modal")) {
                this.el.classList.add("calendar-view-modal");
            }
            var that = this;
            var publicUrl = App.config.domain + "/public/cal/" + App.config.userData.uuid + "/calendar.ics?filters=" + encodeURIComponent(JSON.stringify(filtersJSON)) + "&rows=-1&sidx=expectedStartDate&sord=asc";
            this.$el.find(".currentDate").html(new Date().toString(App.config.company.config.dateFormat));
            if (this.options.showExport) {
                this.$el.find("#export-options").show();
            }
            var today;
            var view;
            var day;
            var month;
            var year;
            var defaults = $.common.load(this.options.key);
            if (this.options.date) {
                view = 'agendaDay';
                today = this.options.date;
                day = today.getDate();
                month = today.getMonth();
                year = today.getFullYear();
            } else if (defaults) {
                if (defaults.date && defaults.view) {
                    view = defaults.view.name;
                    var date = Date.parse(defaults.date);
                    day = date.getDate();
                    month = date.getMonth();
                    year = date.getFullYear();
                } else {
                    view = 'agendaDay';
                    today = new Date();
                    day = today.getDate();
                    month = today.getMonth();
                    year = today.getFullYear();
                }
            } else if (this.options.view) {
                view = this.options.view;
                today = new Date();
                day = today.getDate();
                month = today.getMonth();
                year = today.getFullYear();
            } else {
                view = 'agendaDay';
                today = new Date();
                day = today.getDate();
                month = today.getMonth();
                year = today.getFullYear();
            }
            this.$el.find('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                date: day,
                month: month,
                year: year,
                defaultView: view,
                editable: false,
                allDayDefault: false,
                disableDragging: true,
                disableResizing: true,
                firstHour: 9,
                events: this.bookingAdapter,
                eventAfterRender: function (event, element, view) {
                    if (that.job === true) {
                        calendarEventBindings(event, element, view, that.collection, "bookingStatus.id");
                    } else if (that.interpreter === true) {
                        calendarEventBindings(event, element, view, that.collection, "interpreter.id");
                    } else if (that.customer === true) {
                        calendarEventBindings(event, element, view, that.collection, "customer.id");
                    } else if (that.language === true) {
                        calendarEventBindings(event, element, view, that.collection, "language.id");
                    } else if (that.employmentCategory === true) {
                        calendarEventBindings(event, element, view, that.collection, "employmentCategory.id");
                    }
                },
                loading: calendarLoading,
                eventClick: function (calEvent, jsEvent, view) {
                    that.options.selectedEvent = calEvent;
                }

            });

            this.$el.find("#date_picker").datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                changeMonth: true,
                changeYear: true,
                onSelect: function (dateText, inst) {
                    var d = that.$el.find("#date_picker").datepicker("getDate");
                    that.$el.find('#calendar').fullCalendar('gotoDate', d);
                    that.$el.find('#date_picker').datepicker('hide');
                }
            });

            var custom_buttons = $('#legendButton');
            var legend = $("#legend");
            var calendarViewType = $('#calendar-view-type');

            this.$el.find('.fc-header-left').append(custom_buttons, legend, calendarViewType);
            this.$el.find('#legendButton').css('display', 'inline');
            if (this.$el.find('#calendar-view-type').css('display') != "none") {
                this.$el.find('#calendar-view-type').css('display', 'inline');
            }

            this.$el.find('.fc-button-legend').hover(function () {
                //$(this).addClass('fc-state-hover');
                $('#legend').css({
                    'left': '164px'
                });
                $('#legend').show();
            }, function () {
                // $(this).removeClass('fc-state-hover');
                $('#legend').hide();
            });

            this.setPublicUrl();

            this.$el.find("#publicCal").tooltip({
                placement: 'bottom',
                html: true,
                title: 'Public Calendar URL.<br/>Right click on icon and select "Copy Link" or "Copy Link Address" to copy the URL to be used when importing this calendar by URL e.g. Google Calendar<br/><br/>NOTE: This is a public URL, do not share with anyone.'
            });
        },
        datePickerSelect: function () {
            this.$el.find('#date_picker').datepicker('show');
        },

        setPublicUrl: function () {
            var filters = this.collection.queryParams.filters || null;
            // set to existing filters or reset
            filtersJSON = JSON.parse(filters) || {
                groupOp: "AND",
                rules: []
            };
            var publicUrl = App.config.domain + "/public/cal/" + App.config.userData.uuid + "/calendar.ics?filters=" + encodeURIComponent(JSON.stringify(filtersJSON)) + "&rows=-1&sidx=expectedStartDate&sord=asc";
            this.$el.find("a#publicCal").attr("href", publicUrl);
        },

        synchCal: function () {
            var filters = this.collection.queryParams.filters || null;
            var filtersJSON;
            // set to existing filters or reset
            filtersJSON = JSON.parse(filters) || {
                groupOp: "AND",
                rules: []
            };
            filters = JSON.stringify(filtersJSON, null, "\t");

            var url = App.config.context + "/ical/booking.ics?rows=-1&filters=" + encodeURIComponent(filters);
            window.location.href = url;

            return false;
        },

        /**
         * initiate the event to refetch the calendar.
         *
         * @param presetFilters Array of objects with field, op, data
         * @param searchFilters JSON object of search filters to add when fetching events
         *
         * TODO: the presetFilters originate from customer dashboard. Consolidate these with the search filters in future
         */
        refetchCollection: function (presetFilters, searchFilters) {

            this.options.presetFilters = presetFilters || this.options.presetFilters;
            this.options.searchFilters = searchFilters || this.options.searchFilters;

            this.$("#calendar").fullCalendar("refetchEvents");
        },

        refreshCalendar: function (booking) {
            var that = this;
            var bookingModel = $.core.Booking.findOrCreate({
                "id": booking.id
            });
            bookingModel.fetch({
                success: function () {
                    var eventToUpdate = {
                        rows: []
                    }; // An object is created to reuse the initializeCalendarEvents implementation
                    eventToUpdate.rows.push(bookingModel.toJSON());
                    var updatedEvent = initializeCalendarEvents(eventToUpdate);
                    $('#calendar').fullCalendar('removeEvents', booking.id);
                    $('#calendar').fullCalendar('renderEvent', updatedEvent[0]);

                },
                error: function () {
                    handleActionError({
                        message: "An error was encountered retrieving the visit. Please contact the administrator if the problem persists."
                    });
                }
            });
        },

        renderCalendar: function () {
            this.$el.find('#calendar').fullCalendar('render');
        }
    });

    /**
     * popup view for rendering interpreter job when hovering on calendar
     */
    $.common.CalendarJobPopupView = $.app.ItemView.extend({

        template: "common/calendar/jobpopup",

        initialize: function () {
            this.model.bind('change', this.render);
        }
    });


    $.common.BusinessUnitView = $.app.BaseView.extend({

        tagName: "div",

        className: "business-unit",

        template: JST["common/businessunit/show"],

        events: {
            "change select": "triggerReload"
        },

        initialize: function (options) {
            _.bindAll(this, 'render');
        },

        render: function () {

            var bu = App.dict.businessUnit;

            if (!$.isEmptyObject(bu)) {
                $(this.el).html(this.template(_.extend({}, this.templateHelpers)));

                // Loading BU selection from Cookie, if present
                var buCookie = new Prefs({
                    name: 'businessUnit.id'
                });

                var buId;

                // check cookie
                if (buCookie.load()) {

                    //if cookie present load business unit from cookie
                    buId = buCookie.data['businessUnit.id'];
                    this.$el.find("#businessUnit").val(buId);

                } else if (App.config.userData.businessUnit) {

                    // check user business unit association. cookie takes precedence
                    buId = App.config.userData.businessUnit;
                    this.$el.find("#businessUnit").val(buId);

                    if (!this.templateHelpers.hasRole("admin")) {
                        this.$el.find("#businessUnit").hide();
                    }

                }
            }

            return this;
        },

        triggerReload: function () {

            var businessUnit = this.$el.find("#businessUnit").val();

            // Save cookies
            var bu = new Prefs({
                name: 'businessUnit.id',
                data: {
                    'businessUnit.id': businessUnit
                }
            });

            bu.save(new Date().addYears(50), "/"); // never expire

            App.marionette.vent.trigger("businessUnit:change");

        }


    });

    $.common.CompanyPayableItemTypeView = $.app.ItemView.extend({

        events: {

            'click .addPayableItemTypeCmd': 'addPayableItemType'

        },

        initialize: function (opts) {

            var that = this;

            var options = opts || {};

            this.ratePlan = options.ratePlan;

            this.backgridColumns = [
                /*{
                 name: 'id',
                 label: 'ID',
                 editable: false,
                 cell: Backgrid.IntegerCell.extend({
                 orderSeparator: ''
                 })
                 },*/
                {
                    name: "payableItemType",
                    label: "Type",
                    searchName: "payableItemType.id",
                    editable: true,
                    searchable: true,
                    renderable: !options.hidePayableItemType,
                    cell: $.app.backgrid.PayableItemTypeCell
                }, {
                    name: "fixedDescription",
                    label: "Fixed Description",
                    editable: true,
                    searchable: false,
                    renderable: !options.hideFixedDescription,
                    cell: Backgrid.BooleanCell
                }, {
                    name: "description",
                    label: "Description",
                    searchName: "description",
                    op: "bw",
                    editable: true,
                    searchable: true,
                    renderable: !options.hideDescription,
                    cell: Backgrid.StringCell
                }, {
                    name: "ratePlan",
                    label: "Rate Plan",
                    searchName: "ratePlan.name",
                    op: "bw",
                    editable: false,
                    searchable: true,
                    renderable: !options.hideRatePlan,
                    cell: $.app.backgrid.RatePlanCell
                }, {
                    name: "enabled",
                    label: "Enabled",
                    editable: true,
                    searchable: false,
                    renderable: !options.hideEnabled,
                    cell: Backgrid.BooleanCell
                }, {
                    name: "billable",
                    label: "Billable",
                    editable: true,
                    searchable: false,
                    renderable: !options.hideBillable,
                    cell: Backgrid.BooleanCell
                }, {
                    name: "payable",
                    label: "Payable",
                    editable: true,
                    searchable: false,
                    renderable: !options.hidePayableItemType,
                    cell: Backgrid.BooleanCell
                }, {
                    name: "taxable",
                    label: "Taxable",
                    editable: true,
                    searchable: false,
                    renderable: !options.hideTaxable,
                    cell: Backgrid.BooleanCell
                }, {
                    name: "taxName",
                    label: "Tax Name",
                    op: "bw",
                    editable: true,
                    searchable: true,
                    renderable: !options.hideTaxName,
                    cell: Backgrid.StringCell
                }, {
                    name: "taxRate",
                    label: "Tax Rate",
                    editable: true,
                    searchable: false,
                    renderable: !options.hideTaxRate,
                    cell: Backgrid.NumberCell.extend({
                        decimals: 6
                    })
                }, {
                    name: "lastModifiedBy",
                    label: "Modified By",
                    op: "bw",
                    editable: false,
                    searchable: true,
                    renderable: !options.hideLastModifiedBy,
                    cell: Backgrid.StringCell
                }, {
                    name: "lastModifiedDate",
                    label: "Modified",
                    op: "eqd",
                    editable: false,
                    searchable: false,
                    renderable: !options.hideLastModifiedDate,
                    cell: $.app.backgrid.DateTimeCell
                }, {
                    name: "cap",
                    label: "Cap",
                    editable: true,
                    searchable: false,
                    renderable: !options.hideCap,
                    cell: Backgrid.NumberCell.extend({
                        decimals: 4
                    })
                }, {
                    name: "accountsReceivableCode",
                    label: "Receivable code",
                    editable: true,
                    op: "bw",
                    searchable: true,
                    renderable: !options.hideAccountsReceivableCode,
                    cell: Backgrid.StringCell
                }, {
                    name: "accountsPayableCode",
                    label: "Payable code",
                    editable: true,
                    op: "bw",
                    searchable: true,
                    renderable: !options.hideAccountsPayableCode,
                    cell: Backgrid.StringCell
                }, {
                    name: "accountsReceivableTaxCodeReference",
                    label: "AR Tax",
                    editable: true,
                    op: "bw",
                    searchable: true,
                    renderable: !options.hideAccountsReceivableTaxCodeReference,
                    cell: Backgrid.StringCell
                }, {
                    name: "accountsPayableTaxCodeReference",
                    label: "AP Tax",
                    editable: true,
                    op: "bw",
                    searchable: true,
                    renderable: !options.hideAccountsPayableTaxCodeReference,
                    cell: Backgrid.StringCell
                }, {
                    name: "accountsClassification",
                    label: "Ac.CL.",
                    editable: true,
                    op: "bw",
                    searchable: true,
                    renderable: !options.hideAccountsClassification,
                    cell: Backgrid.StringCell
                }, {
                    name: "",
                    label: "",
                    editable: false,
                    searchable: false,
                    renderable: !options.hidePayableItemTypeAction,
                    cell: $.app.backgrid.SaveDeleteActionCell
                }
            ];

            // Set up backgrid! woo!
            this.paginator = new $.app.backgrid.Paginator({
                collection: this.collection
            });
            this.grid = new Backgrid.Grid({
                header: $.app.backgrid.SearchableHeader.extend({
                    name: "services",
                    persistent: false
                }),
                columns: this.backgridColumns,
                collection: this.collection
            });

        },

        onRender: function () {
            this.$el.find('.list-container').html(this.grid.render().el);
            this.$el.find('.list-container').append(this.paginator.render().el);

            this.collection.fetch();
        },

        template: "common/companypayableitemtype/show",

        deletePayableItemType: function (evt) {

            evt.preventDefault();

            var selectedModels = this.grid.getSelectedModels();

            if (!selectedModels || selectedModels.length === 0) {

                handleActionError({
                    message: "Please select at least one service item to delete."
                });

            } else {

                for (var i = 0; i < selectedModels.length; i++) {

                    if (selectedModels[i]) {
                        selectedModels[i].destroy();
                    }
                }

            }

        },

        addPayableItemType: function (evt) {

            evt.preventDefault();

            var cpit = new $.core.CompanyPayableItemTypeModel({
                "company.id": this.model.id
            });

            // set rate plan
            if (this.ratePlan) {
                cpit.set("ratePlan.id", this.ratePlan.id);
            }
            // add new first row
            this.collection.add(cpit, {
                at: 0
            });

        }
    });

    // Base exclusion grid. Receives config.
    $.common.BasePreferencesGrid = function (config) {

        function cellByAttribute(attributeName) {
            return $.app.backgrid.GenericCell.extend({
                formatter: {
                    fromRaw: function (rawData) {
                        return rawData ? rawData[attributeName] : '-';
                    }
                }
            });
        }

        var definedColumns = {
            select: {
                name: "",
                cell: "select-row",
                headerCell: "select-all"
            },
            id: {
                name: "id",
                searchName: "id",
                sortName: "id",
                label: "ID",
                editable: false,
                searchable: true,
                cell: Backgrid.StringCell
            },
            location: {
                name: "address",
                sortName: "address.addrEntered",
                searchName: "address.name",
                op: "bw",
                label: "Location",
                editable: false,
                searchable: true,
                cell: cellByAttribute('addrEntered')
            },
            interpreter: {
                name: "interpreter",
                sortName: "interpreter.name",
                searchName: "interpreter.name",
                op: "bw",
                label: "Interpreter",
                editable: false,
                searchable: true,
                cell: cellByAttribute('displayName')
            },
            consumer: {
                name: "consumer",
                sortName: "consumer.name",
                searchName: "consumer.name",
                op: "bw",
                label: "Consumer",
                editable: false,
                searchable: true,
                cell: cellByAttribute('name')
            },
            client: {
                name: "client",
                sortName: "client.name",
                searchName: "client.displayName",
                label: "Client",
                editable: false,
                searchable: true,
                cell: cellByAttribute('name')
            },
            customer: {
                name: "customer",
                sortName: "customer.name",
                searchName: "customer.name",
                op: "bw",
                label: "Customer",
                editable: false,
                searchable: true,
                cell: cellByAttribute('name')
            },
            language: {
                name: "language",
                searchName: "language",
                op: "bw",
                label: "Language",
                editable: false,
                searchable: true,
                sortable: true,
                cell: Backgrid.StringCell
            },
            notes: {
                name: "note",
                sortName: "note",
                searchName: "note",
                op: "bw",
                label: "Notes",
                editable: false,
                searchable: true,
                cell: Backgrid.StringCell
            },
            remove: {
                name: 'remove',
                label: 'Remove',
                cell: $.app.backgrid.DeleteActionCell,
                editable: false,
                searchable: false
            }
        };

        var defaultColumns = ['select', 'id', 'interpreter', 'language', 'notes', 'remove'];

        return $.app.ItemView.extend({

            template: config.template,

            events: config.events || {},

            ui: {
                grid: '.excluded-grid',
                paginator: '.paginator'
            },

            initialize: function () {
                var that = this;

                _.bindAll(that, 'refresh');
                Backbone.on('refresh', that.refresh);

                that.collection = that.model;
                //that.collection.bind("reset", _.bind(that.render, that));

                that.backgridColumns = [];
                config.columns = config.columns || defaultColumns;
                _.forEach(config.columns, function (column) {
                    that.backgridColumns.push(definedColumns[column]);
                });
            },

            render: function () {
                this.grid = new Backgrid.Grid({
                    header: $.app.backgrid.SearchableHeader.extend({
                        name: config.name,
                        persistent: true
                    }),
                    columns: this.backgridColumns,
                    collection: this.collection,
                    emptyText: config.empty
                });

                this.paginator = new $.app.backgrid.Paginator({
                    collection: this.collection
                });

                $(this.el).html(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));
                this.$el.find(this.ui.grid).append(this.grid.render().$el);
                this.$el.find(this.ui.paginator).append(this.paginator.render().$el);
            },

            refresh: function (dts) {
                this.collection.fetch();
            },

            removeSelected: function (evt) {

                evt.preventDefault();

                var selectedModels = this.grid.getSelectedModels();

                if (!selectedModels || selectedModels.length === 0) {
                    handleActionError({
                        message: "Please select at least one service item to delete."
                    });
                } else {
                    _.forEach(selectedModels, function (model) {
                        model.destroy();
                    });
                }
            }

        });

    };

    $.common.ExclusionAddView = $.app.BaseView.extend({
        tagName: "div",
        addExclusion: function () {
            var that = this;
            that.model.set("note", $(that.notesElementId).val());
            that.model.save([], {
                success: function (model, response) {
                    var modelToAdd = new that.modelToAdd(that.model.attributes);
                    that.model.trigger('save', modelToAdd);
                    that.clear();
                },
                error: function (model, response) {
                    var message = "";
                    _.forEach(JSON.parse(response.responseText).errors,
                        function (item) {
                            message += item.message + "<br/>";
                        });
                    var showErrorContainer = that.errorContainer ? that.errorContainer : "#errorContainer";
                    showError({
                        message: message
                    }, showErrorContainer);
                },
                wait: true
            });
        },
        clear: function () {
            // TODO: This is very ugly
            var parentEntityType = this.model.get('parentEntityType');
            var parentEntityId = this.model.get('parentEntityId');
            this.model.clear();
            this.model.set('parentEntityType', parentEntityType);
            this.model.set('parentEntityId', parentEntityId);
            this.render();
        }
    });

    $.common.generateAutoComplete = function generateAutoComplete(element, config, model, callback, params) {
        element.autocomplete({
            source: function (request, response) {
                var filtersJSON = {
                    groupOp: "AND",
                    rules: []
                };
                filtersJSON = addOrUpdateFilter(filtersJSON, config.searchProperty, "bw", request.term);
                if (config.otherProperties) {
                    //config.otherProperties.forEach(function (element, index, array) {
                    _.forEach(config.otherProperties, function (element, index, array) {
                        if (element.data) {
                            if (_.isFunction(element.data)) {
                                addOrUpdateFilter(filtersJSON, element.field, element.op, element.data(model));
                            } else {
                                addOrUpdateFilter(filtersJSON, element.field, element.op, element.data);
                            }
                        } else if (element.groupOp) {
                            addParsedFilter(filtersJSON, element);
                        }

                    });
                }

                var data = {
                    filters: JSON.stringify(filtersJSON)
                };

                // add sort attributes
                if (config.sortProperty) data.sidx = config.sortProperty;
                if (config.sortDirection) data.sord = config.sortDirection;

                $.ajax({
                    url: App.config.context + config.url + "?nd=" + (new Date()).getTime() + "&term=" + request.term,
                    dataType: 'json',
                    data: data,
                    success: function (elements) {
                        var items = elements.rows ? elements.rows : elements.items ? elements.items : elements;
                        var results = _.map(items, function (item) {
                            if (_.isFunction(config.displayAttr)) {
                                return config.displayAttr(item);
                            } else {
                                var obj;
                                // Tack the Contact number and email if url:"/api/contact"
                                if (config.url == "/api/contact") {
                                    obj = {
                                        id: item[config.idAttr],
                                        label: item[config.displayAttr],
                                        value: item[config.displayAttr],
                                        primaryNumber: item.primaryNumber,
                                        primaryEmail: item.primaryEmail
                                    };
                                } else {
                                    obj = {
                                        id: item[config.idAttr],
                                        label: item[config.displayAttr],
                                        value: item[config.displayAttr]
                                    };
                                }
                                return obj;
                            }
                        });
                        if (results.length === 0) {
                            results.push({
                                id: 0,
                                label: "[No matches. Try an alternative spelling]",
                                value: "[No matches. Try an alternative spelling]"
                            });
                        }
                        response(results);
                    }
                });
            },
            delay: 250,
            cacheLength: 1,
            highlight: true,
            minLength: 2,
            select: function (event, ui) {
                if (callback) {
                    callback(ui.item.id, params, ui);
                } else {
                    if ($(this).hasClass("api-delegate")) { // stub object
                        var obj = {};
                        // assume only applies to drop downs
                        if (ui.item) {
                            if (ui.item.primaryNumber) {
                                obj = {
                                    id: ui.item.id,
                                    name: ui.item.label,
                                    primaryNumber: ui.item.primaryNumber,
                                    primaryEmail: ui.item.primaryEmail
                                };
                            } else {
                                obj = {
                                    id: ui.item.id,
                                    name: ui.item.label
                                };
                            }
                        } else {
                            obj = null;
                        }
                        model.set(config.attrToSet, obj);
                    } else {
                        model.set(config.attrToSet, ui.item.id);
                    }
                }
                $(this).val(ui.item.label).change();
            }
        });
    };

    $.common.ajaxCallToDropDownComplete = function ajaxCallToDropDownComplete(url, filterJson, response, fieldName, rowAdapter, extraParams) {

        var data = {
            filters: JSON.stringify(filterJson),
            sidx: "name",
            sord: "asc"
        };
        if (extraParams) {
            for (var param in extraParams) {
                if (extraParams.hasOwnProperty(param)) {
                    data[param] = extraParams[param];
                }
            }
        }
        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            success: function (data) {
                var results = [];

                var rows = data.rows || data.items; // hack here to support rows and items (apiv2). remove when consolidated

                for (var i = 0; i < rows.length; i++) {

                    if (_.isFunction(rowAdapter)) {
                        results.push(rowAdapter(rows[i]));
                    } else {
                        results.push({
                            id: rows[i].id,
                            label: fieldName ? rows[i][fieldName] : rows[i].displayName,
                            value: fieldName ? rows[i][fieldName] : rows[i].displayName,
                            email: rows[i].email
                        });
                    }
                }

                if (results.length === 0) {
                    results.push({
                        id: 0,
                        label: "[No matches. Try an alternative spelling]",
                        value: "[No matches. Try an alternative spelling]"
                    });
                }

                response(results);
            }
        });
    };

    $.common.collectionCallToDropDownComplete = function collectionCallToDropDownComplete(collection, response, rowAdapter) {

        collection.fetch({
            success: function () {

                // iterate over collection & populate results
                var results = [];

                _.each(collection.models, function (m) {

                    results.push(rowAdapter(m));
                });

                if (results.length === 0) {
                    results.push({
                        id: 0,
                        label: "[No matches. Try an alternative spelling]",
                        value: "[No matches. Try an alternative spelling]"
                    });
                }

                // invoke autocomplete callback
                response(results);

            },
            error: function () {
                /* swallow */
            }
        });

    };

    $.common.AddFileView = $.app.ItemView.extend({
        initialize: function (config) {
            _.extend(this, $.app.mixins.subviewContainerMixin);
            this.model.set('config', config.options);
        },
        events: {},
        className: "addFile",
        template: "common/fileupload/show",
        onRender: function () {
            var that = this;

            uploadOptions.frame_callback = function (document) {
                that.trigger("upload:complete", document);
            };

            this.$el.find('#fileUpload').ajaxForm(uploadOptions);
            this.$el.find("#fileUpload input#isIE").val(jQuery.browser.msie);
            if (!jQuery.browser.msie) {
                this.$el.find("#theFile").customFileInput({
                    button_position: 'right'
                });
            }
        }

    });

    $.common.CriteriaHierarchyView = $.app.BaseView.extend({
        tagName: "div",

        template: JST['common/criteria/criteriaHierarchy/show'],

        initialize: function (options) {
            $(this.el).unbind();
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            //this.model.bind('error', this.error);
            //this.model.bind('invalid', this.invalid);
            this.companyId = options.companyId;
        },

        events: {
            'click .deleteChild': 'deleteChild'
        },

        render: function () {
            this.$el.html(this.template(_.extend({}, this.templateHelpers)));
        },

        deleteChild: function () {
            if (this.model) {
                this.collection.remove(this.model);
            }
            this.remove();
        },

        addChild: function (id, params) {
            params.collection.add($.core.CriteriaChild.findOrCreate({
                id: id
            }));
        },

        shown: function (disable) {
            var name = (this.model) ? this.model.get("name") : "";
            var element = this.$el.find("#search-employment-criteria");
            if (name) {
                element.val(name);
            }
            if (!disable) {
                $.common.generateAutoComplete(element, {
                    url: "/api/company/" + this.companyId + "/criteria",
                    idAttr: 'id',
                    displayAttr: 'name',
                    attrToSet: 'id',
                    searchProperty: 'name',
                    otherProperties: [{
                        "field": "type.id",
                        "op": "in",
                        "data": [App.dict.criteriaType.criteria.id, App.dict.criteriaType.qualification.id]
                    }]
                }, this.model, this.addChild, {
                    collection: this.collection
                });
            } else {
                element.prop('disabled', disable);
            }
        }

    });

    $.common.OutOfOfficeCheckView = $.app.ItemView.extend({
        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.render();
        },
        template: "availability/notavailable/outOfOffice",
        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #out-of-office-check-box": "outOfOfficeCheck"
        },

        onRender: function () {
            $("#out-of-office-check-box").prop("checked", this.model.get("outOfOffice"));
            this.callbacks(this.el, this.model);
            return this;
        },
        outOfOfficeCheck: function () {
            this.model.set("outOfOffice", $("#out-of-office-check-box").prop("checked"));
            Backbone.trigger("outOfOfficeClicked", this.model);
        }
    });

    $.common.ManageAvailabilityView = $.app.ItemView.extend({
        initialize: function () {

            // non available ranges
            this.nonAvailableRangesCollection = new $.core.ContactNonAvailableRangeCollection([], {
                contactId: this.model.id,
                queryParams: {
                    rows: -1
                }
            });

            // availability
            this.availabilityCollection = window.availabilities = new $.core.AvailabilityCollection();

            this.render();
        },
        template: "availability/manage",
        events: {
            "click #save-availability": "saveAvailability"
        },
        saveAvailability: function () {

            // TODO: THIS COULD BE ANOTHER BULK TYPE.
            var availabilities = [];
            this.availabilityCollection.each(function (availability) {
                if ((availability._previousAttributes.offset != availability.attributes.offset) || (availability._previousAttributes.length != availability.attributes.length)) {
                    availabilities.push(availability);
                }
            });
            var length = availabilities.length;
            $.each(availabilities, function (index, availability) {
                if (index == length - 1) {
                    availability.set({
                        sendConfirmation: true
                    });
                }
                availability.save();
            });

            // // from user.profile.js page. no confirmations sent here
            // $("#save-availability").click(function () {
            //     availabilityCollection.each(function (availability) {
            //         availability.save();
            //     });
            // });

        },
        onRender: function () {

            this.nonAvailableRangesCollection.fetch();

            var nonAvailableRangesView = new $.common.ManageAvailabilityRangeCalendarView({
                el: this.$("#contact-non-available-ranges"),
                collection: this.nonAvailableRangesCollection,
                model: this.model
            });
            nonAvailableRangesView.render();

            var availabilityView = new $.common.ManageAvailabilityCalendarView({
                el: this.$("#contact-availability"),
                collection: this.availabilityCollection,
                model: this.model
            });
            availabilityView.render();
            this.availabilityCollection.fetch();

            this.on("active", function () {
                availabilityView.trigger("active");
            });

            // trigger active events to render calendar properly after being initially hidden
            this.$('a[data-toggle="tab"]').on('shown', function (e) {
                if (e.target.hash === "#available") {
                    availabilityView.trigger("active");
                }
                if (e.target.hash === "#contact-not-available") {
                    nonAvailableRangesView.trigger("active");
                }
            });
        }
    });

    /**
     * view to add availability range to interpreter calendar.
     * <p>
     * this is specific dates for which the interpreter is available or not, depending on
     * the type of availability that is set.
     *
     * TODO: bulk save availability, rather than individually which causes individual emails
     */
    $.common.ManageAvailabilityRangeCalendarView = $.app.ItemView.extend({
        initialize: function () {
            var that = this;
            // re-render calendar on pane active to avoid hidden calendar
            this.on("active", function () {
                that.calendar.fullCalendar('render');
            });
        },

        template: "availability/notavailable/nonAvailableRanges",

        events: {
            "click .add-availability-range": "addAvailabilityRange"
        },

        collectionEvents: {
            "add": function (model, collection, options) {
                var that = this;

                // if not saved, call save
                if (!model.get("id")) {
                    model.save({
                        success: function (model, response) {},
                        error: popupHandleError
                    });
                }
                // if range does not have fullCalendarId already then add to calendar
                if (!model.get("_fullCalendarId")) {
                    var event = model.toCalendarEvent();
                    var res = this.calendar.fullCalendar('renderEvent', event, true /* stick on refetch */ );
                    // set fullCalendarId for reference later
                    model.set("_fullCalendarId", event._id);
                }

                // when range saved re-render event
                model.bind("sync", function () {
                    // check we're not rendering a deleted model
                    if (!model.get("deleted")) {
                        var event = model.toCalendarEvent();
                        that.calendar.fullCalendar('removeEvents', model.get("_fullCalendarId"));
                        that.calendar.fullCalendar('renderEvent', event);
                    }
                });
            },
            "remove": function (model, collection, options) {
                this.calendar.fullCalendar('removeEvents', model.get("_fullCalendarId"));
            }
        },
        /**
         * update the availability range after event resize, drop
         * @param evt
         */
        updateAvailabilityRange: function (evt) {

            // lookup model from fullCalendarId
            var model = this.collection.findWhere({
                "_fullCalendarId": evt._id
            });

            // ensure user can modify guarantees
            if ($.app.mixins.templateHelpersMixin.isGuaranteeEditable(model)) {

                model.fromCalendarEvent(evt);

                // save updated range
                model.save({
                    success: function (model, response) {},
                    error: popupHandleError
                });
            }
        },
        /**
         * edit the availability range after after click on event
         * @param evt
         */
        editAvailabilityRange: function (evt) {

            // lookup model from fullCalendarId
            var model = this.collection.findWhere({
                "_fullCalendarId": evt._id
            });

            // view to add new range
            var modalView = new $.common.AvailabilityRangeEditView({
                model: model,
                collection: this.collection
            });
        },
        /**
         * add new availability range
         */
        addAvailabilityRange: function (start, end, allDay) {

            var model;

            if (arguments.length === 3) {

                // user selected range on calendar
                model = new $.core.ContactNonAvailableRange({
                    interpreter: {
                        id: this.model.id
                    },
                    timezone: App.config.userData.timeZone,
                    allDay: false,
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                });

            } else {

                // user clicked on add new
                model = new $.core.ContactNonAvailableRange({
                    interpreter: {
                        id: this.model.id
                    },
                    timezone: App.config.userData.timeZone,
                    allDay: false
                });
            }

            var modalView = new $.common.AvailabilityRangeEditView({
                model: model,
                collection: this.collection
            });
        },
        /**
         * remove the availability range
         * @param evt
         */
        removeAvailabilityRange: function (evt) {

            // retrieve model based on fullCalendarId
            var model = this.collection.findWhere({
                "_fullCalendarId": evt._id
            });

            // ensure user can modify guarantees
            if ($.app.mixins.templateHelpersMixin.isGuaranteeEditable(model)) {
                // delete range if previously saved
                if (model.get("id")) {
                    // hack to let sync listeners know model has been deleted
                    model.set("deleted", true);
                    model.destroy({
                        success: function (model, response) {},
                        error: popupHandleError
                    });
                }
            }
        },
        onRender: function () {
            var view = this;

            // calendar initialized. not rendered until pane the view is within is active
            view.calendar = this.$el.find('.calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultView: 'month',
                selectable: true,
                selectHelper: true,
                /**
                 * triggered when the calendar loads and every time a different date range is displayed.
                 * used to persist the last view and date to the browser to redisplay when the page is
                 * reloaded
                 * @param el
                 */
                viewDisplay: function (el) {
                    if (this.getAttribute("alreadyLoad") === null) {
                        this.setAttribute("alreadyLoad", true);
                    } else if (this.getAttribute("loading") === null) {
                        $.common.saveCalendarInformation('interpreterNonAvailableRange', view.$el.find(".calendar"));
                    }
                },
                /**
                 * triggered when an event is rendered on the calendar
                 * @param event
                 * @param element
                 */
                eventRender: function (event, element) {
                    // display trash icon to delete event
                    element.find(".fc-event-title").append("<a class=\"pull-right delete-event btn btn-mini btn-danger\"><i class=\"icon-trash\"></i></a>");
                },
                /**
                 * triggered when an event is resized
                 * @param evt
                 */
                eventResize: function (evt) {
                    view.updateAvailabilityRange(evt);
                },
                /**
                 * triggered when an event is moved
                 * @param evt
                 */
                eventDrop: function (evt) {
                    view.updateAvailabilityRange(evt);
                },
                /**
                 * triggered when an event is clicked on.
                 * @param evt
                 */
                eventClick: function (event, jsEvent) {
                    // check to see if trash icon deleted
                    if ($(jsEvent.target).closest(".delete-event").length) {
                        view.removeAvailabilityRange(event);
                    } else {
                        view.editAvailabilityRange(event);
                    }
                },
                /**
                 * triggered when portion of calendar selected
                 * @param start
                 * @param end
                 * @param allDay
                 */
                select: function (start, end, allDay) {
                    view.addAvailabilityRange(start, end, allDay);
                },
                editable: true,
                events: []
            });

            // load calendar settings from browser
            $.common.loadCalendarInformation('interpreterNonAvailableRange', this.$el.find(".calendar"));
        }
    });

    /**
     * modal view to add / edit availability range for interpreter availability
     */
    $.common.AvailabilityRangeEditView = $.app.ItemView.extend({
        initialize: function (options) {
            // self rendering
            this.render();
        },
        template: "availability/notavailable/addRanges",
        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .cmd-widget-save": "saveRange",
            "click .cmd-widget-forfeit": "forfeitRange",
            "click #all-day": "allDay"
        },
        modelEvents: {
            "error": "error",
            "invalid": "invalid"
        },
        onRender: function () {
            this.$modalEl = $("#modalContainer");

            this.$modalEl.html(this.el);
            this.$modalEl.modal();

            // show select group
            var availabilityTypeSelectOptionGroup = new $.common.AvailabilityTypeSelectOptionGroup({
                el: this.$(".availability-type-optgroup-container"),
                model: this.model
            });
            availabilityTypeSelectOptionGroup.render();

            if (!$.app.mixins.templateHelpersMixin.isGuaranteeEditable(this.model)) {
                this.$(".cmd-widget-save").addClass("disabled");
                this.$(".cmd-widget-forfeit").addClass("disabled");
            }

            this.callbacks(this.el, this.model);
            this.formatElements();

            return this;
        },
        allDay: function () {
            var checked = this.$("#all-day").prop("checked");

            if (App.config.company.config.isTimeFormat24Hour) {
                $(this.$el).find("#start-time").val('00:00').trigger("change"); //change();
                $(this.$el).find("#end-time").val('23:59').trigger("change"); //change();
            } else {
                $(this.$el).find("#start-time").val('12:00 AM').trigger("change"); //change();
                $(this.$el).find("#end-time").val('11:59 PM').trigger("change"); //change();
            }
            // disable after change to correctly fire events
            $(this.$el).find(".format-time").prop('disabled', checked);
        },
        saveRange: function () {
            var that = this;
            that.model.save([], {
                success: function (model, response) {
                    that.collection.add(model);
                    that.$modalEl.modal('hide');
                },
                error: popupHandleError
            });
        },
        forfeitRange: function () {
            var that = this;
            this.model.set('type', App.dict.availabilityType.forfeit);
            var notes = this.model.get("notes") ? this.model.get("notes") : "";
            notes += "\n\nGuarantee forfeit manually.";
            this.model.set("notes", notes);
            that.model.save([], {
                success: function (model, response) {},
                error: popupHandleError
            });
        }
    });

    /**
     * modal view to add / edit recurring availability for interpreter availability
     *
     * TODO: bulk save availability, rather than individually which causes individual emails
     */
    $.common.ManageAvailabilityCalendarView = $.app.ItemView.extend({
        template: "availability/availabilityedit/show",

        initialize: function (options) {
            var that = this;
            // re-render calendar on pane active to avoid hidden calendar
            this.on("active", function () {
                that.calendar.fullCalendar('render');
            });
            this.timeZone = options.timeZone;
        },

        collectionEvents: {
            "add": function (model, collection, options) {
                var that = this;

                // if not saved, call save
                if (!model.get("id")) {
                    model.save({
                        success: function (model, response) {},
                        error: popupHandleError
                    });
                }

                // if range does not have fullCalendarId already then add to calendar
                if (!model.get("_fullCalendarId")) {

                    // add model to fullCalendar
                    var newEvent = model.toCalendarEvent();
                    this.calendar.fullCalendar('renderEvent', newEvent, true);
                    model.set("_fullCalendarId", newEvent._id);

                }

                // when availability saved re-render event
                model.bind("sync", function () {
                    // check we're not rendering a deleted model
                    if (!model.get("deleted")) {
                        var event = model.toCalendarEvent();
                        that.calendar.fullCalendar('removeEvents', model.get("_fullCalendarId"));
                        that.calendar.fullCalendar('renderEvent', event);
                    }
                });
            },
            "remove": function (model, collection, options) {
                this.calendar.fullCalendar('removeEvents', model.get("_fullCalendarId"));
            }
        },

        /**
         * update the availability after event resize, drop
         * @param evt
         */
        updateAvailability: function (evt) {

            // lookup model from fullCalendarId
            var model = this.collection.findWhere({
                "_fullCalendarId": evt._id
            });

            // ensure user can modify guarantees
            if ($.app.mixins.templateHelpersMixin.isGuaranteeEditable(model)) {
                var event = this.compactEvents(evt);

                // if event is to be added
                if (event) {
                    model.fromCalendarEvent(event);

                    // save updated availability
                    model.save({
                        success: function (model, response) {},
                        error: popupHandleError
                    });
                }
            }
        },
        /**
         * edit the availability after after click on event
         * @param evt
         */
        editAvailability: function (evt) {

            // lookup model from fullCalendarId
            var model = this.collection.findWhere({
                "_fullCalendarId": evt._id
            });

            // view to add new availability
            var modalView = new $.common.AvailabilityEditView({
                model: model,
                collection: this.collection
            });
        },
        /**
         * add new availability
         */
        addAvailability: function (start, end, allDay) {

            var model = new $.core.AvailabilityModel();

            var newEvent = {
                title: '',
                start: start,
                end: end,
                allDay: allDay
            };

            var event = this.compactEvents(newEvent);

            // if event is valid
            if (event) {
                // set fields on model
                model.fromCalendarEvent(newEvent);

                // view to add new availability
                var modalView = new $.common.AvailabilityEditView({
                    model: model,
                    collection: this.collection
                });
            }

            //            this.calendar.fullCalendar('renderEvent', newEvent, true);
            //             //view.setSlots(view.calendar.fullCalendar('clientEvents'));
            //             this.updateAvailability(newEvent);
            //             //view.setSlots(start, end);
            //             this.calendar.fullCalendar('unselect');

            // var model;
            //
            // if (arguments.length === 3) {
            //
            //     // user selected range on calendar
            //     model = new $.core.ContactNonAvailableRange({
            //         interpreter: {
            //             id: this.model.id
            //         },
            //         timezone: App.config.userData.timeZone,
            //         allDay: false,
            //         startDate: start.toISOString(),
            //         endDate: end.toISOString()
            //     });
            //
            // } else {
            //
            //     // user clicked on add new
            //     model = new $.core.ContactNonAvailableRange({
            //         interpreter: {
            //             id: this.model.id
            //         },
            //         timezone: App.config.userData.timeZone,
            //         allDay: false
            //     });
            // }
            //
            // var modalView = new $.common.AvailabilityRangeEditView({
            //     model: model,
            //     collection: this.collection
            // });
        },
        /**
         * remove the availability
         * @param evt
         */
        removeAvailability: function (evt) {

            // retrieve model based on fullCalendarId
            var model = this.collection.findWhere({
                "_fullCalendarId": evt._id
            });

            // ensure user can modify guarantees
            if ($.app.mixins.templateHelpersMixin.isGuaranteeEditable(model)) {
                // delete range if previously saved
                if (model.get("id")) {
                    // hack to let sync listeners know model has been deleted
                    model.set("deleted", true);
                    model.destroy({
                        success: function (model, response) {},
                        error: popupHandleError
                    });
                }
            }
        },

        onRender: function () {

            // show out of office view
            new $.common.OutOfOfficeCheckView({
                el: this.$("#contact-out-of-office"),
                model: this.model
            });

            var view = this;

            // calendar initialized. not rendered until pane the view is within is active
            view.calendar = this.$el.find('.calendar').fullCalendar({
                defaultView: 'agendaWeek',
                header: {
                    left: '',
                    center: '',
                    right: ''
                },
                columnFormat: {
                    week: 'dddd' // Monday
                },
                firstHour: 9,
                lastHour: 17,
                selectable: true,
                selectHelper: true,
                /**
                 * triggered when an event is rendered on the calendar
                 * @param event
                 * @param element
                 */
                eventRender: function (event, element) {
                    // display trash icon to delete event
                    element.find(".fc-event-title").append("<a class=\"pull-right delete-event btn btn-mini btn-danger\"><i class=\"icon-trash\"></i></a>");
                },
                /**
                 * triggered when an event is resized
                 * @param evt
                 */
                eventResize: function (evt) {
                    view.updateAvailability(evt);
                },
                /**
                 * triggered when an event is moved
                 * @param evt
                 */
                eventDrop: function (evt) {
                    view.updateAvailability(evt);
                },
                /**
                 * triggered when an event is clicked on.
                 * @param evt
                 */
                eventClick: function (event, jsEvent) {
                    // check to see if trash icon deleted
                    if ($(jsEvent.target).closest(".delete-event").length) {
                        view.removeAvailability(event);
                    } else {
                        view.editAvailability(event);
                    }
                },
                /**
                 * triggered when portion of calendar selected
                 * @param start
                 * @param end
                 * @param allDay
                 */
                select: function (start, end, allDay) {
                    view.addAvailability(start, end, allDay);
                },
                editable: true,
                allDayDefault: false,
                allDaySlot: true,
                slotMinutes: 15,
                events: []
            });
        },

        /**
         * method to compact all events given a new event. the method checks for containing and
         * overlapping events and removes redundancies.
         * <p>
         * method does not return anything if event itself has been compacted
         */
        compactEvents: function (evt) {

            var allEvents, containingEvent, overlappingEvents, minStart, maxEnd, firstEvent;
            allEvents = this.calendar.fullCalendar('clientEvents');
            // First ignore events that are "inside" another event

            // next check to see if there are any overlapping events
            if (evt.allDay === true) {
                var date = new Date(evt.start.getTime());
                date.setHours(date.getHours() + 23);
                date.setMinutes(date.getMinutes() + 59);
                date.setSeconds(date.getSeconds() + 59);
                // update end date when allDay set
                evt.end = date;
            }

            // TODO: shouldn't this be filter if there are more than 1 containing?
            // find containing event
            containingEvent = _.find(allEvents, function (e) {
                return ((e.start.getTime() < evt.start.getTime()) && (e.end.getTime() > evt.end.getTime()));
            });

            // TODO: this indicates it can be containing or overlapping. but shouldn't we accommodate both?
            if (containingEvent) {
                // remove event if its is inside existing events. effectively ignore this update
                this.calendar.fullCalendar('removeEvents', evt._id);
            } else {
                // find overlapping events
                overlappingEvents = _.filter(allEvents, function (e) {
                    var overlapStart = (e.start.getTime() <= evt.start.getTime()) && (e.end.getTime() >= evt.start.getTime());
                    var overlapEnd = (e.start.getTime() <= evt.end.getTime()) && (e.end.getTime() >= evt.end.getTime());
                    var overlap = (e.start.getTime() >= evt.start.getTime()) && (e.end.getTime() <= evt.end.getTime());
                    return (overlapStart || overlapEnd || overlap) && (e._id !== evt._id);
                });

                if (overlappingEvents.length > 0) {
                    // add current event to overlapping events for further comparison
                    overlappingEvents.push(evt);
                    // get earliest start time
                    minStart = _.min(overlappingEvents, function (e) {
                        return e.start.getTime();
                    }).start;
                    // get latest end time
                    maxEnd = _.max(overlappingEvents, function (e) {
                        return e.end.getTime();
                    }).end;

                    // get first event in overlapping ones
                    firstEvent = overlappingEvents.shift();
                    // update start / end with earliest and latest times
                    firstEvent.start = minStart;
                    firstEvent.end = maxEnd;
                    // update the event
                    this.calendar.fullCalendar('updateEvent', firstEvent);

                    // clear all other overlapping events and delete from back end
                    _.each(overlappingEvents, function (e) {
                        var model = this.collection.findWhere({
                            "_fullCalendarId": e._id
                        });
                        if (model) {
                            model.destroy();
                        } else {
                            this.calendar.fullCalendar('removeEvents', e._id);
                        }
                    }, this);

                    // override event to be returned with first event
                    return firstEvent;
                }

                return evt;
            }
        }
        // ,
        //
        // getSundayMidnight: function () {
        //     var d = new Date();
        //     // get day of month - day of the week to get last Sunday
        //     d.setDate(d.getDate() - d.getDay());
        //     d.setHours(0);
        //     d.setMinutes(0);
        //     d.setSeconds(0);
        //     d.setMilliseconds(0);
        //     return d;
        // },
        //
        // getDuration: function (start, end) {
        //     return (end - start) / 60000 + start.getTimezoneOffset() - end.getTimezoneOffset();
        // },
        //
        // setSlot: function (evt) {
        //     // get date in local time on Sunday midnight
        //     var sundayMidnightLocal = this.getSundayMidnight();
        //     // convert local Sunday midnight to UTC
        //     var sundayMidnightAdjusted = new Date(sundayMidnightLocal.getTime() - (new timezoneJS.Date(new Date(), App.config.userData.timeZone)).getTimezoneOffset() * 60000);
        //     var length;
        //     if (evt.end) {
        //         length = this.getDuration(evt.start, evt.end);
        //     } else {
        //         length = 1440;
        //     }
        //     var offset = (this.getDuration(sundayMidnightAdjusted, evt.start)) % 10080; // 10080 minutes in a week.
        //     if (offset < 0) {
        //         offset = (this.getDuration(sundayMidnightLocal, evt.start)) % 10080; // 10080 minutes in a week.
        //     }
        //     // Try and find the event among our existing backbone models
        //     var model = this.collection.findWhere({
        //         "_fullCalendarId": evt._id
        //     });
        //     if (model) {
        //         model.set({
        //             "length": length,
        //             "offset": offset
        //         });
        //     } else {
        //         this.collection.add({
        //             "_fullCalendarId": evt._id,
        //             "length": length,
        //             "offset": offset
        //         });
        //     }
        // }
    });

    /**
     * modal view to add / edit recurring availability for interpreter availability
     */
    $.common.AvailabilityEditView = $.app.ItemView.extend({
        initialize: function (options) {
            // self rendering
            this.render();
        },

        template: 'availability/availabilityedit/edit',

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .cmd-widget-save": "saveAvailability"
        },

        modelEvents: {
            "error": "error",
            "invalid": "invalid"
        },

        onRender: function () {

            this.$modalEl = $("#modalContainer");

            this.$modalEl.html(this.el);
            this.$modalEl.modal();

            // show select group
            var availabilityTypeSelectOptionGroup = new $.common.AvailabilityTypeSelectOptionGroup({
                el: this.$(".availability-type-optgroup-container"),
                model: this.model
            });
            availabilityTypeSelectOptionGroup.render();

            if (!$.app.mixins.templateHelpersMixin.isGuaranteeEditable(this.model)) {
                this.$(".cmd-widget-save").addClass("disabled");
                this.$(".cmd-widget-forfeit").addClass("disabled");
            }

            this.callbacks(this.el, this.model);
            this.formatElements();
        },

        saveAvailability: function () {
            var that = this;
            that.model.save([], {
                success: function (model, response) {
                    that.collection.add(model);
                    that.$modalEl.modal('hide');
                },
                error: popupHandleError
            });
        }
    });

    $.common.InteractionContactSubView = $.app.ItemView.extend({

        tagName: "div",

        template: "interaction/generaledit/contactsubview/show"

        //onRender: function () {
        //    this.showSecured();
        //    return this;
        //}
    });

    $.common.interactionGeneralEditView = $.app.ItemView.extend({

        tagName: "div",

        className: "interaction",

        template: "interaction/generaledit/show",

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.model.bind('sync', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change #customer": "enableLocation",
            "change #category": "clearSubCategory",
            "change #subCategory": "enableReasons",
            "click .view-jobs": "viewInterpreterJobs"
        },

        modelEvents: {
            "change:interpreter": "renderContactSubView"
        },

        viewInterpreterJobs: function () {
            var terpId = this.model.get("interpreter").id;
            var presetFilters = [{
                field: "interpreters",
                op: "eq",
                data: terpId.toString()
            }];
            var bookings = new $.visit.v2.InterpreterVisitCollection();
            // Check to avoid error if selector not available -unlikely
            if ($('#modalContainer').length !== 0) {
                $("#modalContainer").modal("show");
                var calendarView = new $.common.CalendarView({
                    el: $("#modalContainer"),
                    showExport: true,
                    collection: bookings,
                    key: "InterpreterBookingsPopUp",
                    eventBinding: "job",
                    presetFilters: presetFilters,
                    view: 'month',
                    templateFile: "common/calendar/modalcalendar"
                });
                calendarView.render();
            }
        },

        enableReasons: function () {

            var category = this.model.get("category");
            var subCategory = this.model.get("subCategory");

            if (subCategory !== null && category !== null) {
                if (App.dict.interactionSubCategory.cancelled.id == subCategory.id && App.dict.interactionCategory.sub_status_cancellation.id == category.id) {
                    this.$el.find(".cancellationReason").css("display", "block");
                    this.$el.find(".deactivationReason").css("display", "none");
                    this.model.set({
                        'deactivationReason': null
                    });
                } else if (App.dict.interactionSubCategory.deactivated_sub.id == subCategory.id && App.dict.interactionCategory.deactivated.id == category.id) {
                    this.$el.find(".cancellationReason").css("display", "none");
                    this.$el.find(".deactivationReason").css("display", "block");
                    this.model.set({
                        'cancellationReason': null
                    });
                } else {
                    this.clearReasons();
                }
            } else {
                this.clearReasons();
            }
        },

        clearReasons: function () {
            this.$el.find(".cancellationReason").css("display", "none");
            this.$el.find(".deactivationReason").css("display", "none");
            this.model.set({
                'cancellationReason': null,
                'deactivationReason': null
            });
        },

        clearSubCategory: function () {
            this.model.set({
                'subCategory': null
            });

            this.enableSubCategory();
        },

        enableSubCategory: function () {
            // Clear Sub Category
            if (this.model.isNew()) {
                this.model.set({
                    'subCategory': null
                });
            }

            // Clear cancel and deactivation reasons
            this.enableReasons();

            // Populate subcategory dropdown based on category selection
            var category = this.model.get("category");
            if (category !== null && category !== undefined) {
                // Filter list based on Category Id
                var filteredList = _(App.dict.interactionSubCategory).reject(function (subCategory) {
                    return subCategory.parent.id != category.id;
                });

                // Reduce List so that it can be used by Select Options method.
                var convertedList = filteredList.reduce(function (o, v, i) {
                    o[v.name] = v;
                    return o;
                }, {});

                var selecHtml = $.app.mixins.templateHelpersMixin.selectOptions(convertedList, {
                    selected: (this.model.get('subCategory') ? this.model.get('subCategory').id : ''),
                    noSelection: {
                        id: '',
                        name: '[Choose a Sub Category]'
                    }
                });

                $("#subCategory").html(selecHtml);
                $("#subCategory").attr("disabled", false);
            } else {
                $("#subCategory").attr("disabled", true);
                $("#subCategory").html('<option value="">[Choose a Sub Category]</option>');
            }
        },

        enableLocation: function () {
            if ($("#customer").val()) {
                $("#location").attr("disabled", false);
            } else {
                $("#location").attr("disabled", true);
            }
        },

        toggleReasons: function () {
            if (this.model.get("cancellationReason") !== null && this.model.get("cancellationReason").id !== "") {
                this.$el.find(".cancellationReason").css("display", "block");
            } else {
                this.$el.find(".cancellationReason").css("display", "none");
            }

            if (this.model.get("deactivationReason") !== null && this.model.get("deactivationReason").id !== "") {
                this.$el.find(".deactivationReason").css("display", "block");
            } else {
                this.$el.find(".deactivationReason").css("display", "none");
            }
        },

        renderContactSubView: function () {
            var interpreter = this.model.get("interpreter");
            // Allow for Create New (Interaction) - also uses General Edit View
            if (interpreter) {
                var contactModel = $.core.Contact.findOrCreate({
                    "id": interpreter.id
                });
                var that = this;
                contactModel.fetch({
                    success: function () {
                        that.model.set({
                            "interpreter": contactModel.toJSON()
                        }, {
                            silent: true
                        });
                        var icsv = new $.common.InteractionContactSubView({
                            model: contactModel
                        });
                        that.$(".contact-details").html(icsv.render().el);
                    }
                });
            }
        },

        onRender: function () {
            var that = this;

            this.formatElements();

            // $(this.el).html(this.template(_.extend(this.model.toJSON(), this.templateHelpers)));

            $.common.generateAutoComplete($("#interpreter"), {
                url: "/api/contact",
                idAttr: 'id',
                displayAttr: 'displayName',
                attrToSet: 'interpreter',
                searchProperty: 'name'
            }, this.model);

            // autocomplete list for customer configuration
            $.common.generateAutoComplete($("#customer"), {
                url: "/api/customer",
                idAttr: 'id',
                displayAttr: 'name',
                attrToSet: 'customer',
                searchProperty: 'name',
                otherProperties: [{
                    "field": "status.id",
                    "op": "eq",
                    "data": "1"
                }]
            }, this.model);

            // TODO: this was doing a sublocation search (Conor changed 01/09!) may be an issue?!?
            // autocomplete list for location in customer configuration
            $.common.generateAutoComplete($("#location"), {
                url: "/api/address",
                idAttr: 'id',
                displayAttr: 'displayLabel',
                attrToSet: 'location',
                searchProperty: 'name',
                otherProperties: [{
                    "field": "customer.id",
                    "op": "eq",
                    "data": function (m) {
                        if (m.get("customer.id")) {
                            return m.get("customer.id");
                        } else {
                            return m.get("customer").id;
                        }
                    }
                }]
            }, this.model);

            // autocomplete list for jobs
            $.common.generateAutoComplete($("#job"), {
                url: "/api/company/" + App.config.company.id + "/booking",
                idAttr: 'id',
                displayAttr: 'id',
                attrToSet: 'job',
                searchProperty: 'id'
            }, this.model);

            $.common.generateAutoComplete($("#consumer"), {
                url: "/api/consumer",
                idAttr: 'id',
                displayAttr: 'name',
                attrToSet: 'consumer',
                searchProperty: 'name'
            }, this.model);

            $.common.generateAutoComplete($("#language"), {
                url: "/language/listAvailable",
                idAttr: 'id',
                displayAttr: 'label',
                attrToSet: 'language',
                searchProperty: 'language.description'
            }, this.model);

            this.callbacks(this.el, this.model);

            if (!this.model.isNew()) {
                this.enableSubCategory();
            }
            // Render Contact Sub View with schedule and contact details
            this.renderContactSubView();
            // Make sure that the updated dom is showing the secured elements.
            this.showSecured();

            this.toggleReasons();
            return this;
        }

    });

    $.common.RequestorGeneralEditView = $.app.ItemView.extend({

        tagName: "div",

        className: "requestor",

        template: "requestor/generaledit/show",

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.model.bind('sync', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #addAssociation": "addAssociation",
            "click #generateUsername": "generateUsername"
        },

        generateUsername: function (evt) {
            var firstName = this.model.get("firstName");
            var lastName = this.model.get("lastName");
            if (firstName && lastName) {
                firstName = firstName.trim().toLowerCase();
                lastName = lastName.trim().toLowerCase();
                var userName = firstName + lastName;
                userName = userName.replace(/ /g, "");
                this.model.set("username", userName);
                this.$el.find("#username").val(userName);
            } else {
                handleActionError({
                    message: "First Name and Last Name fields are required to generate usernames."
                });
            }
        },

        onRender: function () {

            var associations = new $.core.CustomerClientLocationCollection({}, {
                'requestor.id': this.model.id
            });
            var associationsView = new $.common.CustomerClientLocationsView({
                el: this.$("#associations"),
                collection: associations,
                requestor: this.model
            });
            associationsView.render();

            if (this.model.id) {
                associations.fetch();
            }

            this.formatElements();

            this.callbacks(this.el, this.model);

            // Make sure that the updated dom is showing the secured elements.
            this.showSecured();

            return this;
        }

    });

    $.common.CustomerClientLocationsView = $.app.BaseView.extend({

        template: JST["requestor/customerclientlocations/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'renderCustomerClientLocation');
            this.collection.bind('add', this.renderCustomerClientLocation);

            this.requestor = this.options.requestor;
        },

        events: {
            'click .model-add': 'add'
        },

        render: function () {
            //render the view
            this.$el.append(this.template({}));
            var requestorId = this.requestor.id;

            if (requestorId === null) {
                this.$el.find(".model-add").attr("disabled", true);
            } else {
                this.$el.find(".model-add").attr("disabled", false);
            }

            return this;
        },

        renderCustomerClientLocation: function (item) {

            var associationView = new $.common.CustomerClientLocationView({
                model: item,
                parentView: this
            });
            this.$(".associations").append(associationView.render().el);

            this.showSecured();

            return this;
        },

        add: function (evt) {
            var onDate;

            var association = new $.core.CustomerClientLocation({
                'requestor': {
                    id: this.requestor.id
                },
                'company': {
                    id: App.config.company.id
                }
            });

            this.collection.add(association);
        }

    });

    $.common.CustomerClientLocationView = $.app.BaseView.extend({

        template: JST["requestor/customerclientlocation/show"],

        initialize: function (options) {
            this.model.bind('invalid', this.invalid, this);
            this.model.bind('error', this.error, this);

            this.parentView = options.parentView;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'click #saveAssociation': 'saveAssociation',
            'click #deleteAssociation': 'deleteAssociation',
            'click #copyAssociation': 'copyAssociation',
            'click .clearCustomer': 'clearCustomer',
            'click .clearClient': 'clearClient',
            'click .clearLocation': 'clearLocation'
        },

        copyAssociation: function () {
            this.parentView.collection.add(this.model.clone());
        },

        clearCustomer: function () {
            this.model.set({
                "customer": null
            }, {
                silent: true
            });

            this.$el.find("#customer").val("");
        },

        clearClient: function () {
            this.model.set({
                "client": null
            }, {
                silent: true
            });

            this.$el.find("#client").val("");
        },

        clearLocation: function () {
            this.model.set({
                "location": null
            }, {
                silent: true
            });

            this.$el.find("#location").val("");
        },

        render: function () {
            var that = this;

            this.$el.html(this.template(_.extend({
                obj: this.model.toJSON()
            }, this.templateHelpers)));

            this.$el.addClass("alert-info");

            $.common.generateAutoComplete(that.$el.find("#customer"), {
                url: "/api/customer",
                idAttr: 'id',
                displayAttr: 'name',
                attrToSet: 'customer',
                searchProperty: 'name',
                otherProperties: [{
                    "field": "status.id",
                    "op": "eq",
                    "data": "1"
                }]
            }, this.model);

            $.common.generateAutoComplete(that.$el.find("#client"), {
                url: "/api/client",
                idAttr: 'id',
                displayAttr: 'name',
                attrToSet: 'client',
                searchProperty: 'name',
                otherProperties: [{
                    "field": "active",
                    "op": "eq",
                    "data": "true"
                }, {
                    "field": "customer.id",
                    "op": "eq",
                    "data": function (m) {
                        return m.get("customer").id;
                    }
                }]
            }, this.model);

            $.common.generateAutoComplete(that.$el.find("#location"), {
                url: "/api/address",
                idAttr: 'id',
                displayAttr: 'displayLabel',
                attrToSet: 'location',
                searchProperty: 'name',
                otherProperties: [{
                    "field": "customer.id",
                    "op": "eq",
                    "data": function (m) {
                        if (m.get("customer.id")) {
                            return m.get("customer.id");
                        } else {
                            return m.get("customer").id;
                        }
                    }
                }]
            }, this.model);

            this.callbacks(this.el, this.model);
            return this;
        },

        saveAssociation: function (evt) {
            this.model.save({}, defaultFetchOptions);
        },

        deleteAssociation: function (evt) {
            this.model.destroy({}, defaultFetchOptions);
            this.remove();
        }

    });

    /*
     * Views for clauses
     * */


    $.common.TextClause = $.app.LayoutView.extend({
        template: "common/clauses/textClause",
        events: {
            "change input": "sync"
        },
        initialize: function (options) {
            this.property = options.filter.get('property');
        },
        onRender: function () {
            this.select = this.$el.find("select");
            this.input = this.$el.find("input");
        },
        getRule: function () {
            return {
                field: this.property,
                op: this.select.find(":selected").val(),
                data: this.input.val()
            };
        }
    });

    $.common.BooleanClause = $.app.LayoutView.extend({
        template: "common/clauses/booleanClause",
        initialize: function (options) {
            this.property = options.filter.get('property');
        },
        onRender: function () {
            this.select = this.$el.find("select");
        },
        getRule: function () {
            return {
                field: this.property,
                op: "eq",
                data: this.select.find(":selected").val()
            };
        }
    });

    $.common.DateClause = $.app.LayoutView.extend({
        template: "common/clauses/dateClause",
        initialize: function (options) {
            this.property = options.filter.get('property');
        },
        onRender: function () {
            this.select = this.$el.find("select");
            this.firstDate = this.$el.find(".firstDate");
            this.secondDate = this.$el.find(".secondDate");

            var that = this;
            this.select.on('change', function () {
                if ($(this).find(":selected").val() == "rank") {
                    that.secondDate.css("display", 'block');
                } else {
                    that.secondDate.css("display", 'none');
                }
            });
            this.$el.find(".date").datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                changeMonth: true,
                changeYear: true,
                yearRange: "-80:+1"
            });
        },
        getRule: function () {
            var op = this.select.find(":selected").val();
            if (op == "rank") {
                return {
                    groupOp: "AND",
                    rules: [{
                        field: this.property,
                        op: 'ged',
                        data: this.firstDate.val(),
                        format: App.config.company.config.dateFormat
                    }, {
                        field: this.property,
                        op: 'led',
                        data: this.secondDate.val(),
                        format: App.config.company.config.dateFormat
                    }]
                };
            } else {
                return {
                    field: this.property,
                    op: op,
                    data: this.firstDate.val(),
                    format: App.config.company.config.dateFormat
                };
            }
        }
    });

    $.common.DateTimeClause = $.app.LayoutView.extend({
        template: "common/clauses/dateTimeClause",
        initialize: function (options) {
            this.property = options.filter.get('property');
        },
        onRender: function () {
            this.select = this.$el.find("select");
            this.firstDate = this.$el.find(".firstDate");
            this.secondDate = this.$el.find(".secondDate");
            this.firstTime = this.$el.find(".firstTime");
            this.secondTime = this.$el.find(".secondTime");

            var that = this;
            this.select.on('change', function () {
                if ($(this).find(":selected").val() == "rank") {
                    that.$el.find(".secondContainer").css("display", 'block');
                } else {
                    that.$el.find(".secondContainer").css("display", 'none');
                }
            });
            this.$el.find(".date").datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                changeMonth: true,
                changeYear: true,
                yearRange: "-80:+1"
            });
            this.$el.find(".format-time").timeEntry({
                spinnerImage: "",
                ampmPrefix: " ",
                defaultTime: new Date().clearTime(), // use current time with time cleared so always defaults to morning
                show24Hours: App.config.company.config.isTimeFormat24Hour
            });
        },
        getRule: function () {
            var op = this.select.find(":selected").val();
            var fD = this.firstDate.datepicker("getDate");
            if (this.firstTime.timeEntry("getTime")) {
                var fT = this.firstTime.timeEntry("getTime");
                fD.setHours(fT.getHours());
                fD.setMinutes(fT.getMinutes());
            }
            fD = fD.toString(App.config.company.config.dateTimeFormat);
            if (op == "rank") {
                var sD = this.secondDate.datepicker("getDate");
                if (this.secondTime.timeEntry("getTime")) {
                    var sT = this.secondTime.timeEntry("getTime");
                    sD.setHours(sT.getHours());
                    sD.setMinutes(sT.getMinutes());
                }
                sD = sD.toString(App.config.company.config.dateTimeFormat);
                return {
                    groupOp: "AND",
                    rules: [{
                        field: this.property,
                        op: 'ged',
                        data: fD,
                        format: App.config.company.config.dateTimeFormat
                    }, {
                        field: this.property,
                        op: 'led',
                        data: sD,
                        format: App.config.company.config.dateTimeFormat
                    }]
                };
            } else {
                return {
                    field: this.property,
                    op: op,
                    data: fD,
                    format: App.config.company.config.dateTimeFormat
                };
            }
        }
    });

    $.common.NumberClause = $.app.LayoutView.extend({
        template: "common/clauses/numberClause",
        initialize: function (options) {
            this.property = options.filter.get('property');
        },
        onRender: function () {
            this.select = this.$el.find("select");
            this.firstNumber = this.$el.find(".firstNumber");
            this.secondNumber = this.$el.find(".secondNumber");

            var that = this;
            this.select.on('change', function () {
                if ($(this).find(":selected").val() == "rank") {
                    that.secondNumber.css("display", 'block');
                } else {
                    that.secondNumber.css("display", 'none');
                }
            });
        },
        getRule: function () {
            var op = this.select.find(":selected").val();
            if (op == "rank") {
                return {
                    groupOp: "AND",
                    rules: [{
                        field: this.property,
                        op: 'ge',
                        data: this.firstNumber.val()
                    }, {
                        field: this.property,
                        op: 'le',
                        data: this.secondNumber.val()
                    }]
                };
            } else {
                return {
                    field: this.property,
                    op: op,
                    data: this.firstNumber.val()
                };
            }
        }
    });

    $.common.OptionClause = $.app.LayoutView.extend({
        template: "common/clauses/optionClause",
        initialize: function (options) {
            this.property = options.filter.get('property');
            this.ops = options.filter.get("ops");
            this.op = options.filter.get("op");
        },
        onRender: function () {
            this.select = this.$el.find("select");

            var that = this;
            _.each(this.ops, function (item) {
                that.$el.find("select").append($('<option>', {
                    value: item,
                    text: item
                }));
            });
        },
        getRule: function () {
            return {
                field: this.property,
                op: this.op,
                data: this.select.find(":selected").val()
            };
        }
    });

    $.common.CompositeClause = $.app.LayoutView.extend({
        template: "common/clauses/compositeClause",
        initialize: function (options) {
            this.property = options.filter.get('property');
            this.subAttributes = options.filter.get('subAttributes');
            this.newClauseView = options.newClauseView;
            this.views = {
                text: $.common.TextClause,
                booleanType: $.common.BooleanClause,
                date: $.common.DateClause,
                number: $.common.NumberClause,
                option: $.common.OptionClause,
                composite: $.common.CompositeClause,
                "float": $.common.NumberClause
            };
        },
        onRender: function () {
            var collection = new Backbone.Collection(this.subAttributes);
            this.clauseView = new this.newClauseView({
                filters: collection
            });
            this.clauseView.render();
            this.$el.find(".extraClauses").append(this.clauseView.el);
        },
        getRule: function () {
            return {
                field: this.property,
                rules: this.clauseView.makeFilter().rules
            };
        }
    });

    $.common.ClauseView = $.app.LayoutView.extend({

        initialize: function (options) {
            this.clauseViews = {
                text: $.common.TextClause,
                booleanType: $.common.BooleanClause,
                date: $.common.DateClause,
                dateTime: $.common.DateTimeClause,
                number: $.common.NumberClause,
                option: $.common.OptionClause,
                composite: $.common.CompositeClause,
                "float": $.common.NumberClause
            };
            this.filters = options.filters;
            this.views = [];
            this.active = true;
        },
        onRender: function () {
            this.childrenList = this.$el.find(".children");
            this.restriction = this.$el.find('.restriction');
            this.childContainer = this.$el.find('.new_child_container');
            this.childView = undefined;
            this.fields = this.$el.find(".fields");
            this.not = this.$el.find(".not");

            var that = this;
            _.each(this.filters.models, function (item) {
                that.$el.find(".fields").append($('<option>', {
                    value: item.get('type'),
                    text: item.get('attribute'),
                    property: item.get("property")
                }));
            });

            this.fields.on("change", function (event) {
                var val = $(this).val();
                if (val == "AND" || val == "OR") {
                    that.childrenList.parent('div').css("display", "block");
                    that.childContainer.css("display", "block");
                    that.restriction.css("display", "none");
                    that.cleanChildren();
                    that.addClauseChild();
                } else {
                    that.childrenList.css("display", "none");
                    that.childContainer.css("display", "none");
                    that.restriction.css("display", "block");
                    var property = $(this).find(":selected").attr("property");
                    val = val == 'custom' ? val + property : val;
                    that.childView = new that.clauseViews[val]({
                        el: that.restriction,
                        filter: that.filters.where({
                            property: property
                        })[0],
                        newClauseView: that.newClauseView
                    });
                    that.childView.render();
                }
            });

            this.$el.find(".new_child").on('click', function () {
                that.addClauseChild();
            });

            this.$el.find(".remove").on('click', function () {
                that.remove();
            });
        },
        addClauseChild: function () {
            this.childrenList.css("display", "block");
            var view = new this.newClauseType({
                filters: this.filters
            });
            view.render();
            this.views[this.views.length] = view;
            this.childrenList.append(view.el);
        },
        cleanChildren: function () {
            this.childrenList.html("");
            this.childView = undefined;
        },
        remove: function () {
            this.$el.remove();
            this.active = false;
        },
        makeFilter: function () {
            var clause;
            if (this.active) {
                if (this.not.find(":selected").val() == "NOT") {
                    clause = {
                        groupOp: "NOT",
                        rules: []
                    };
                    var clauseWithoutNot = this.getClauseWithoutNot();
                    if (clauseWithoutNot)
                        clause.rules[clause.rules.length] = clauseWithoutNot;
                } else {
                    clause = this.getClauseWithoutNot();
                }
            }
            return clause;
        },
        getClauseWithoutNot: function () {
            var clause;
            if (this.fields.find(":selected").val() == "AND" || this.fields.find(":selected").val() == "OR") {
                clause = {
                    groupOp: this.fields.find(":selected").val(),
                    rules: []
                };
                _.each(this.views, function (item) {
                    var childClause = item.makeFilter();
                    if (childClause)
                        clause.rules[clause.rules.length] = childClause;
                });
            } else {
                if (this.childView) {
                    clause = this.childView.getRule();
                }
            }
            return clause;
        }
    });

    $.common.ChangeContactStatusView = $.app.LayoutView.extend({
        template: "common/contact/status/change",
        events: {
            "change input": "synchModel",
            "change select": "synchModel",
            "change textarea": "synchModel",
            "click #change_status_button": "changeStatus"
        },
        onRender: function () {
            this.formatElements();
            $(this.$el).find(".format-time").val('11:59 PM');
            $(this.$el).find(".format-time").val('11:59 PM');
            var that = this;
            this.model.on("change:status.id", function (model, nextStatusId) {
                if (nextStatusId == App.dict.contactStatus.inactive.id) {
                    that.$el.find("#deactivation_reason").css("visibility", "visible");
                } else {
                    that.$el.find("#deactivation_reason").css("visibility", "hidden");
                    that.model.unset("deactivation.id", {
                        silent: true
                    });
                }
            });
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", App.config.company.id);
            filtersJSON = addOrUpdateFilter(filtersJSON, "enabled", "eq", true);
            var collection = new $.core.DeactivationReasonCollection({}, {
                queryParams: {
                    rows: 25,
                    sidx: "lastModifiedDate",
                    sord: "desc",
                    filters: JSON.stringify(filtersJSON)
                }
            });

            collection.fetch({
                success: function (info) {
                    var select = that.$el.find("#deactivation_reason_select");
                    select.html($('<option>', {
                        value: '',
                        text: 'Select one...'
                    }));
                    _.each(collection.models, function (item) {
                        select.append($('<option>', {
                            value: item.get('id'),
                            text: item.get('name')
                        }));

                    });
                }
            });
            this.$el.find("#deactivation_reason").css("visibility", "hidden");
        },
        changeStatus: function () {
            var that = this;
            this.model.save([], {
                success: function (model, response) {
                    that.model.trigger('save', that.model);
                },
                error: function (model, response) {
                    var message = "";
                    _.forEach(JSON.parse(response.responseText).errors,
                        function (item) {
                            if (item.field) {
                                message += item.message + "<br/>";
                            } else {
                                message += item + "<br/>";
                            }

                        });
                    var showErrorContainer = "#statusErrorContainer";
                    showError({
                        message: message
                    }, showErrorContainer);
                },
                wait: true
            });
        }
    });

    $.common.changeContactStatus = function (contactId, contactName, contactStatus, element, toElement, onClose) {
        element.css("width", App.config.popups.portrait.width);
        element.css("height", App.config.popups.portrait.height);
        var changeStatusModel = new $.core.ChangeStatusModel({
            interpreter: {
                id: contactId
            },
            company: {
                id: App.config.company.id
            },
            currentStatus: contactStatus,
            name: contactName
        });
        changeStatusModel.on("save", function () {
            toElement.colorbox.close();
        });
        var changeStatusView = new $.common.ChangeContactStatusView({
            el: element,
            model: changeStatusModel
        });

        changeStatusView.render();
        toElement.colorbox({
            href: "#change_status",
            innerWidth: App.config.popups.portrait.width,
            innerHeight: App.config.popups.portrait.height,
            open: true,
            returnFocus: false,
            inline: true,
            onOpen: function () {
                element.show();
            },
            onClosed: function () {
                element.hide();
                onClose();
                changeStatusView.undelegateEvents();
                changeStatusView.$el.removeData().unbind();
            },
            title: 'Status Change'
        });
    };


    $.common.AttributeView = $.app.ItemView.extend({

        tagName: "div",

        className: "controls span2",

        template: "common/reports/selectattributes/show",

        events: {
            "change .attribute": "changeModel"
        },
        initialize: function () {
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },
        changeModel: function () {
            this.model.set("active", this.$el.find('input').prop("checked"));
        },
        setModel: function (checked) {
            this.model.set("active", checked);
            this.$el.find('input').prop("checked", checked);
        }
    });

    $.common.SelectAttributesView = $.app.CompositeView.extend({

        template: "common/reports/selectattributes/list",

        tagName: "div",

        className: "control-group",

        itemView: $.common.AttributeView,

        itemViewContainer: "#deactivation_reasons",

        initialize: function (options) {
            this.reportRunner = options.reportRunner;
            this.jobsCollection = options.jobsCollection;
        },

        events: {
            'click .widget-unfilled-jobs-report': 'exportUnfilledJobs',
            'click .widget-accruals-jobs-report': 'exportAccrualsJobs',
            'click .widget-consumer-jobs-report': 'exportConsumerJobs',
            'click .widget-billing-prep-report': 'exportBillingPrep',
            'click .widget-incidentals-report': 'exportIncidentals',
            'click .widget-customer-vos-report': 'exportCustomerVos',
            'click .widget-custom-job-report': 'exportCustomJob',
            'click .widget-custom-funded-report': 'exportCustomFunded',
            'click .widget-team-job-report': 'exportTeamJob',
            "click .selectAll": 'selectAll',
            "click .selectNone": 'selectNone'
        },

        exportReport: function () {
            var that = this;
            this.reportRunner.params.fields = "";
            _.each(this.collection.models, function (model) {
                if (model.get("active")) {
                    that.reportRunner.params.fields += model.get("label") + ",";
                }
            });
            this.reportRunner.exprt();
        },

        exportUnfilledJobs: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters
                };

                var url = App.config.context + '/api/export/unfilledJobs';

                // unfilledJobs jobs export
                var unfilledJobs = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                unfilledJobs.exprt();
            }

            this.trigger("ok", {});
        },

        exportAccrualsJobs: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters,
                    fields: "job # (id),created date/time,job date,job time,actual start date,actual start time,actual end date,actual end time,customer,client,location,language,status,cancelled,cancellation reason,booking mode,Include Financial Fields"
                };

                var url = App.config.context + '/api/export/bookings';

                // accrualJobs jobs export
                var accrualsJobs = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                accrualsJobs.exprt();
            }

            this.trigger("ok", {});
        },

        exportConsumerJobs: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters,
                    fields: "job # (id),consumer,expected start date,expected start time,expected end time,location,sub location,interpreter,status,appointment details"
                };

                var url = App.config.context + '/api/export/bookings';

                // consumer Jobs jobs export
                var consumerJobs = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                consumerJobs.exprt();
            }

            this.trigger("ok", {});
        },

        exportBillingPrep: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters,
                    fields: "job # (id),interpreter,client,expected start date,expected start time,expected end time,estimated duration,duration (hrs),actual start time,actual end time,appointment details,consumer,customer,location,requested by,status,cancellation reason,interpreter job notes,mileage,billing notes,job details"
                };

                var url = App.config.context + '/api/export/bookings';

                // billing prep jobs export
                var billingPrep = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                billingPrep.exprt();
            }

            this.trigger("ok", {});
        },

        exportIncidentals: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // to add: mileage, tolls, parking transit
            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters,
                    fields: "job # (id),interpreter last name,interpreter first name,interpreter accounting reference,interpreter employment category,expected start date,cost center,incidentals"
                };

                var url = App.config.context + '/api/export/bookings';

                // billing prep jobs export
                var incidentalsReport = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                incidentalsReport.exprt();
            }
        },

        exportCustomerVos: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // to add: mileage, tolls, parking transit
            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters,
                    fields: "customer,job # (id),expected start date,status,invoice status,vos url"
                };

                var url = App.config.context + '/api/export/bookings';

                // customer vos jobs export
                var customerVos = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                customerVos.exprt();
            }

            this.trigger("ok", {});
        },

        exportTeamJob: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters,
                    fields: "job # (id),expected start date,expected start time,expected end time,estimated duration (hrs),consumer,location,sub location,interpreter team (if applicable),status,appointment details,job details,venue information,vos required,vos url"
                };

                //Expected Duration
                //Team (if applicable)

                //Job Notes,Location Notes,Vos Required,VoS link

                var url = App.config.context + '/api/export/bookings';

                // team jobs export
                var teamJobs = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                teamJobs.exprt();
            }

            this.trigger("ok", {});
        },

        exportCustomJob: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters
                };

                var url = App.config.context + '/api/export/customJob';

                var customJobs = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                customJobs.exprt();
            }

            this.trigger("ok", {});
        },
        exportCustomFunded: function () {

            var format = "xlsx";

            var filtersJSON = JSON.parse(this.jobsCollection.queryParams.filters);
            var filters = this.jobsCollection.queryParams.filters;

            // make sure there is something in the filters before exporting
            if (filtersJSON.rules.length !== 0) {
                var params = {
                    "company.id": App.config.company.id,
                    "export": "all",
                    "rows": -1,
                    "page": 1,
                    "sidx": "expectedStartDate",
                    "sord": "asc",
                    "oper": "excel",
                    "filters": filters
                };

                var url = App.config.context + '/api/export/customfundedreport'; // must match ExportService.reports.customfundedreport

                var customFunded = new $.report.Runner({
                    baseUrl: url,
                    format: format,
                    params: params,
                    asynch: true
                });

                // export
                customFunded.exprt();
            }

            this.trigger("ok", {});
        },

        onRender: function () {
            this.showSecured();
        },

        selectAll: function (evt) {

            // set checked
            this.$("input.attribute").prop("checked", true).change();
        },

        selectNone: function (evt) {

            // set checked off
            this.$("input.attribute").prop("checked", false).change();
        }

    });

    $.common.ExportChangesView = $.app.LayoutView.extend({
        template: "common/reports/user/changes",
        events: {
            "change input": "synchModel",
            "click #export_action": "exportAction"
        },
        onRender: function () {
            this.$el.find(".date").datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                changeMonth: true,
                changeYear: true,
                yearRange: "-80:+1"
            });
            this.model.set("format", "xlsx");
        },
        exportAction: function () {
            var data = {
                contactId: this.model.get("contactId")
            };
            if (!_.isUndefined(this.model.get("from_date")) && !_.isUndefined(this.model.get("to_date"))) {
                var filtersJSON = {
                    groupOp: "AND",
                    rules: [{
                        field: "dateCreated",
                        op: 'ged',
                        data: this.model.get("from_date"),
                        format: 'MM/dd/yy'
                    }, {
                        field: "dateCreated",
                        op: 'led',
                        data: this.model.get("to_date"),
                        format: 'MM/dd/yy'
                    }]
                };
                data.jsonFilters = JSON.stringify(filtersJSON);
            }
            var contacts = new $.report.Runner({
                baseUrl: App.config.context + '/api/export/UserChanges',
                format: this.model.get("format"),
                params: data,
                asynch: true
            });
            contacts.exprt();
            this.trigger("export");
        }
    });

    $.common.ExportWithRangeView = $.app.LayoutView.extend({
        tagName: "div",

        template: "common/reports/export/withRanges",

        el: $("#modalContainer"),

        events: {
            "change input": "synchModel",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            },
            "click .widget-close": function (evt) {
                this.$el.modal('hide');
            }
        },

        initialize: function (options) {
            $(this.el).unbind();
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.reportUrl = options.reportUrl;
        },

        exportAction: function () {
            var that = this;
            if (this.model.isValid()) {
                var data = this.model.get("data");

                data.startDate = this.model.get("from_date");
                data.endDate = this.model.get("to_date");

                var contacts = new $.report.Runner({
                    baseUrl: App.config.context + this.reportUrl,
                    format: this.model.get("format"),
                    params: data,
                    asynch: true
                });
                contacts.exprt();
                this.trigger("export");
                that.$el.modal('hide');

            } else {
                this.invalid(this.model, this.model.validationError);
            }
        },

        onRender: function (options) {
            this.$el.modal('show');
            var that = this;

            this.$el.find(".date").datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                changeMonth: true,
                changeYear: true,
                yearRange: "-80:+10"
            });
            this.model.set("format", "xlsx");

            this.on("ok", function (evt) {
                that.exportAction();
            });

            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();
            return this;
        }
    });

    $.common.InterpreterReassignmentView = $.app.LayoutView.extend({
        template: "common/booking/reassignment"
    });

    /**
     * extracts days, hours, minutes from a duration in milliseconds. the option to combineDaysWithHours
     * is to roll the number of days into the hours.
     *
     * @param duration
     * @param combineDaysWithHours
     * @returns {{days: string, hours: string, minutes: string}}
     */
    $.common.extractDatesInformation = function generateAutoComplete(duration, combineDaysWithHours) {
        var durationInMinutes = duration / (1000 * 60);
        var information = {
            days: 'n/a',
            hours: 'n/a',
            minutes: 'n/a'
        };
        if (isNumber(duration)) {
            information.days = 0 | (durationInMinutes / (60 * 24));
            information.hours = 0 | ((durationInMinutes % (60 * 24)) / 60);
            information.minutes = 0 | ((durationInMinutes % (60 * 24)) % 60);

            if (combineDaysWithHours === true) {
                information.hours = information.hours + (information.days * 24);
                information.days = 0;
            }
        }
        return information;
    };

    $.common.save = function save(key, obj) {
        sessionStorage.setItem(key, JSON.stringify(obj));
    };

    $.common.load = function load(key) {
        return JSON.parse(sessionStorage.getItem(key));
    };

    $.common.saveCalendarInformation = function saveCalendarInformation(prefix, calendar) {
        sessionStorage.setItem(prefix + 'Date', calendar.fullCalendar('getDate').toISOString());
        sessionStorage.setItem(prefix + 'View', calendar.fullCalendar('getView').name);
    };


    $.common.loadCalendarInformation = function loadCalendarInformation(prefix, calendar) {
        if ((sessionStorage.getItem(prefix + 'Date') && sessionStorage.getItem(prefix + 'View')) &&
            (sessionStorage.getItem(prefix + 'View') != calendar.fullCalendar('getView').name ||
                sessionStorage.getItem(prefix + 'Date') != calendar.fullCalendar('getDate').toISOString())) {
            calendar.attr("loading", "true");
            calendar.fullCalendar('gotoDate', Date.parse(sessionStorage.getItem(prefix + 'Date')));
            calendar.fullCalendar('changeView', sessionStorage.getItem(prefix + 'View'));
            calendar.attr("loading", null);
        } else {
            $.common.saveCalendarInformation(prefix, calendar);
        }
    };

    $.common.saveDateRangeInformation = function saveDateRangeInformation(dateRange) {
        sessionStorage.setItem('dateRange', dateRange);
    };

    $.common.removeDateRangeInformation = function removeDateRangeInformation() {
        sessionStorage.removeItem('dateRange');
    };


    $.common.loadDateRangeInformation = function loadDateRangeInformation(dateRange) {
        if (sessionStorage.getItem('dateRange')) {
            var dtsInput = sessionStorage.getItem('dateRange');
            var dts = [];
            if (dtsInput !== undefined && dtsInput !== null && dtsInput !== "") {
                dts = dtsInput.split(" - ");
            }
            var startDate = null;
            var endDate = null;
            var newDate = null;

            if (dts.length == 2) {
                startDate = dts[0];
                endDate = dts[1];
            } else if (dts.length == 1) {
                startDate = dts[0];
                newDate = Date.parseExact(startDate, App.config.company.config.dateFormat);
                newDate.setDate(newDate.getDate() + 1);
                endDate = newDate.toString(App.config.company.config.dateFormat);
            }

            return startDate + ' - ' + endDate;
        } else {
            if (dateRange !== "") {
                $.common.saveDateRangeInformation(dateRange);
                return $.common.loadDateRangeInformation(dateRange);
            }
        }
    };

    $.common.JobSuccessView = $.app.ItemView.extend({
        template: 'common/success/popup/job',

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, {
                options: this.options.options
            });

        },

        onRender: function () {
            this.callbacks(this.el, this.model);
            this.formatElements();
        }
    });

    $.common.PreventEditingView = $.app.ItemView.extend({
        template: "booking/warning/preventEditing"
    });

    $.common.showPreventEditingModal = function collectionCallToDropDownComplete(model) {
        var view = new $.common.PreventEditingView({
            model: model
        });
        var modal = new Backbone.BootstrapModal({
            content: view,
            okText: "OK",
            cancelText: ""
        });
        modal.open();
    };

    $.common.JobFrozenView = $.app.ItemView.extend({
        template: "booking/warning/jobFrozen"
    });

    $.common.showJobFrozenModal = function collectionCallToDropDownComplete(model) {
        var view = new $.common.JobFrozenView({
            model: model
        });
        var modal = new Backbone.BootstrapModal({
            content: view,
            okText: "OK",
            cancelText: ""
        });

        setTimeout(function () {
            modal.close();
            var url = App.config.context + "/job/show/" + model.get("jobContextId");
            window.location.href = url;
        }, 5000);

        modal.on('ok', function () {
            modal.close();
            var url = App.config.context + "/job/show/" + model.get("jobContextId");
            window.location.href = url;
        });

        modal.on('cancel', function () {
            modal.close();
            var url = App.config.context + "/job/show/" + model.get("jobContextId");
            window.location.href = url;
        });

        modal.open();
    };

    // common booking action views appear here
    $.common.BookingCancelView = $.app.ItemView.extend({
        tagName: "div",

        className: "content",

        template: 'booking/cancel/cancelBooking/show',

        el: $("#modalContainer"),

        initialize: function (options) {
            $(this.el).unbind();
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            ///this.model.bind('change', this.render);
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change #cancellationReason": "optionsDefault",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        cancelBooking: function (evt) {
            //evt.stopPropagation();
            var that = this;
            this.model.cancel({}, {
                success: function (model, response) {
                    popupFetchOptions.success(model, response, true /* wait for response */ );
                },
                error: popupFetchOptions.error
            });
            that.$el.modal('hide');
            return false;
        },

        onRender: function () {
            this.$el.modal('show');

            var that = this;
            this.on("ok", function (evt) {
                that.cancelBooking();
            });

            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();
            return this;
        },

        optionsDefault: function () {
            var cancellationReason = App.dict.cancellationReasons[this.model.get("cancellationReason.id")];
            if (cancellationReason.payable) {
                this.$("#payable").val(App.dict.yesNoType.y.id);
                this.model.set("payable.id", App.dict.yesNoType.y.id);
            } else {
                this.$("#payable").val(App.dict.yesNoType.n.id);
                this.model.set("payable.id", App.dict.yesNoType.n.id);
            }
            if (cancellationReason.billable) {
                this.$("#billable").val(App.dict.yesNoType.y.id);
                this.model.set("billable.id", App.dict.yesNoType.y.id);
            } else {
                this.$("#billable").val(App.dict.yesNoType.n.id);
                this.model.set("billable.id", App.dict.yesNoType.n.id);
            }
        }
    });

    $.common.BookingDeclineView = $.app.ItemView.extend({

        tagname: "div",

        classname: "content",

        template: 'booking/decline/declineBooking/show',

        el: $("#modalContainer"),

        initialize: function (options) {
            $(this.el).unbind();
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        declineBooking: function (evt) {
            var that = this;
            this.model.decline({}, {
                success: function (model, response) {
                    that.$el.modal('hide');
                    popupFetchOptions.success(model, response, true /* wait for response */ );
                },
                error: popupFetchOptions.error
            });
            return false;
        },

        onRender: function () {
            this.$el.modal('show');

            var that = this;
            this.on("ok", function (evt) {
                that.declineBooking();
            });

            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();
            return this;
        }
    });

    $.common.VisitCancelView = $.app.ItemView.extend({

        tagname: "div",

        classname: "content",

        template: 'visit/cancelvisit/show',

        el: $("#modalContainer"),

        initialize: function (options) {
            $(this.el).unbind();
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change #cancellationReason": "optionDefault",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        onRender: function () {

            var that = this;
            this.on("ok", function (evt) {
                that.cancelJob();
            });

            this.interpreterJobs = new $.visit.v2.InterpreterVisitCollection();
            var jobDetailsView = new $.common.AssignmentsView({
                el: this.$(".job-details"),
                model: this.model,
                collection: this.interpreterJobs
            });
            jobDetailsView.render();
            this.interpreterJobs.url = this.model.get("interpreterVisits");
            this.interpreterJobs.fetch();
            this.$el.modal('show');
            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();
            return this;
        },

        cancelJob: function (evt) {
            var that = this;

            var jobModel = this.model;
            var cancelNotes = this.$el.find("#notes").val();

            jobModel.set("cancelNotes", cancelNotes);

            // edit existing, check for bulk update
            var numJobs = this.model.get("numJobs");
            if (this.model.get("numJobs") > 1) {
                var bulkCancel = new $.common.JobBulkCancelOptionsView({
                    jobModel: jobModel,
                    cancelNotes: cancelNotes,
                    onOk: function () {
                        jobModel.cancel({}, {
                            success: function (model, response) {
                                that.$el.modal('hide');
                                popupFetchOptions.success(model, response, true /* wait for response */ );
                            },
                            error: popupFetchOptions.error
                        });
                    }
                });
                bulkCancel.render();
            } else {
                this.model.cancel({}, {
                    success: function (model, response) {
                        that.$el.modal('hide');
                        popupFetchOptions.success(model, response, true /* wait for response */ );
                    },
                    error: popupFetchOptions.error
                });
            }

            return false;
        },

        optionDefault: function () {
            var cancellationReason = App.dict.cancellationReasons[this.model.get("cancellationReason.id")];
            if (cancellationReason.payable) {
                this.$("#payable").val(App.dict.yesNoType.y.id);
                this.model.set("payable.id", App.dict.yesNoType.y.id);
            } else {
                this.$("#payable").val(App.dict.yesNoType.n.id);
                this.model.set("payable.id", App.dict.yesNoType.n.id);
            }
            if (cancellationReason.billable) {
                this.$("#billable").val(App.dict.yesNoType.y.id);
                this.model.set("billable.id", App.dict.yesNoType.y.id);
            } else {
                this.$("#billable").val(App.dict.yesNoType.n.id);
                this.model.set("billable.id", App.dict.yesNoType.n.id);
            }
        }
    });

    $.common.InterpreterJobView = $.app.ItemView.extend({

        template: 'visit/cancelvisit/job',


        onRender: function () {
            this.formatElements();
        },

        tagname: "li"

    });

    $.common.AssignmentsView = $.app.CompositeView.extend({


        onRender: function () {

            this.callbacks(this.el, this.model);
        },

        tagname: "div",

        classname: "job-details",

        template: 'visit/cancelvisit/joblist',

        itemView: $.common.InterpreterJobView,

        itemViewContainer: "#job-list"

    });

    $.booking.v2.UnassignView = $.app.ItemView.extend({

        initialize: function () {
            _.extend(this, $.app.mixins.subviewContainerMixin);
            _.bindAll(this, 'render', 'synchModel', 'error');
            this.model.bind('error', this.error);
            var interactionCategory = {};
            var interactionSubCategory = {};
            if (App.dict.interactionCategory.unavailable) {
                interactionCategory = App.dict.interactionCategory.unavailable;
                interactionSubCategory = App.dict.interactionSubCategory.availability_other_obligation;
            }
            this.model.set("category", interactionCategory);
            this.model.set("subCategory", interactionSubCategory);
            this.changeSubCategories();
            this.cancelEnabled = false;
            this.deactivationEnabled = false;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change #category": function (e) {
                this.changeSubCategories();
                this.enableReasons();
            },
            "change #subCategory": "enableReasons",
            "change #createInteraction": "showInteractionOptions",
            "click #unassignAction": "unassign"
        },

        className: "autoCompleteEdit",

        template: "booking/unassign/edit",

        changeSubCategories: function () {
            var subCategories = {};
            for (var key in App.dict.interactionSubCategory) {
                if (App.dict.interactionSubCategory.hasOwnProperty(key)) {
                    if (App.dict.interactionSubCategory[key].parent.id === this.model.get("category").id) {
                        subCategories[key] = App.dict.interactionSubCategory[key];
                    }
                }
            }
            this.model.set("subCategories", subCategories);
            this.render();
        },

        showInteractionOptions: function () {
            if (this.model.get("createInteraction")) {
                this.$el.find('.interaction-options').removeClass("hidden");
            } else {
                this.$el.find('.interaction-options').addClass("hidden");
            }
        },

        onRender: function () {
            if (this.model.get("createInteraction")) {
                this.$el.find('.interaction-options').removeClass("hidden");
            } else {
                this.$el.find('.interaction-options').addClass("hidden");
            }

            return this;
        },

        unassign: function () {
            var that = this;

            var category = that.$el.find("#category").val();
            var subCategory = that.$el.find("#subCategory").val();

            var emailRadios = that.$el.find(".unassignEmail");
            for (var i = 0; i < emailRadios.length; i++) {
                if (emailRadios[i].checked) {
                    var to = emailRadios[i].value;
                    this.model.set('unassignEmail', to);
                }
            }

            if (this.model.get("createInteraction")) {
                if (!category) {
                    alert('Please select a Category');
                    return;
                }
                if (!subCategory) {
                    alert('Please select a Sub Category');
                    return;
                }
            }

            if (that.cancelEnabled) {
                var cancelReason = that.$el.find("#cancellationReason").val();
                if (cancelReason === "") {
                    alert('Please select a Cancellation Reason');
                    return;
                }
            } else if (that.deactivationEnabled) {
                var deactivationReason = that.$el.find("#deactivationReason").val();
                if (deactivationReason === "") {
                    alert('Please select a Deactivation Reason');
                    return;
                }
            }
            that.model.unassign().done(function () {
                that.trigger('unassigned');
            });
        },

        enableReasons: function () {
            var category = this.$el.find("#category").val();
            var subCategory = this.$el.find("#subCategory").val();

            if (subCategory !== null && category !== null) {
                if (App.dict.interactionSubCategory.cancelled.id == subCategory && App.dict.interactionCategory.sub_status_cancellation.id == category) {
                    this.$el.find(".cancellationReason").css("display", "block");
                    this.$el.find(".deactivationReason").css("display", "none");
                    this.model.set({
                        'deactivationReason': null
                    });
                    this.cancelEnabled = true;
                } else if (App.dict.interactionSubCategory.deactivated_sub.id == subCategory && App.dict.interactionCategory.deactivated.id == category) {
                    this.$el.find(".cancellationReason").css("display", "none");
                    this.$el.find(".deactivationReason").css("display", "block");
                    this.model.set({
                        'cancellationReason': null
                    });
                    this.deactivationEnabled = true;
                } else {
                    this.clearReasons();
                }
            } else {
                this.clearReasons();
            }
        },

        clearReasons: function () {
            this.$el.find(".cancellationReason").css("display", "none");
            this.$el.find(".deactivationReason").css("display", "none");
            this.cancelEnabled = false;
            this.deactivationEnabled = false;
            this.model.set({
                'cancellationReason': null,
                'deactivationReason': null
            });
        }

    });

    $.common.VisitRepeatView = $.app.ItemView.extend({
        tagname: "div",

        classname: "content",

        template: 'visit/repeatJob/show',

        el: $("#modalContainer"),

        initialize: function (options) {
            _.extend(this, $.app.mixins.templateHelpersMixin);
            _.bindAll(this, 'render', 'synchModel', 'error', 'invalid');
            $(this.el).unbind();
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.model.set("freq", "WEEKLY");
            this.model.set("endsOn", "AFTER");
            this.model.set("count", 4);
            this.model.set("startOn", this.templateHelpers.formatDate(this.model.get("expectedStartDate"), this.model.get("timeZone")));
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change .wkdays": "daysOfWeek",
            "click .widget-ok": function (evt) {
                this.trigger("ok");
            }
        },

        daysOfWeek: function () {
            if (this.model.get("freq") == "WEEKLY") {
                document.getElementById('byWeekdaySelector').style.display = "block";
            } else {
                document.getElementById('byWeekdaySelector').style.display = "none";
            }
        },

        onRender: function () {
            var dayOfWeek = Date.parseExact(this.templateHelpers.formatDate(this.model.get("expectedStartDate"), this.model.get("timeZone")), App.config.company.config.dateFormat).getDay();

            if (dayOfWeek === 0) {
                this.model.set("#wd_SU", true);
                this.$('#wd_SU').prop('checked', true);
            }
            if (dayOfWeek === 1) {
                this.model.set("#wd_MO", true);
                this.$('#wd_MO').prop('checked', true);
            }
            if (dayOfWeek === 2) {
                this.model.set("#wd_TU", true);
                this.$('#wd_TU').prop('checked', true);
            }
            if (dayOfWeek === 3) {
                this.model.set("#wd_WD", true);
                this.$('#wd_WD').prop('checked', true);
            }
            if (dayOfWeek === 4) {
                this.model.set("#wd_TH", true);
                this.$('#wd_TH').prop('checked', true);
            }
            if (dayOfWeek === 5) {
                this.model.set("#wd_FR", true);
                this.$('#wd_FR').prop('checked', true);
            }
            if (dayOfWeek === 6) {
                this.model.set("#wd_SA", true);
                this.$('#wd_SA').prop('checked', true);
            }
            this.$el.modal('show');

            var that = this;
            this.on("ok", function (evt) {
                that.repeatJob();
            });
            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();
            return this;
        },

        repeatJob: function (evt) {
            var that = this;
            // Convert date to Timezone e.g. "11/02/16 7:00 PM"
            var expectedDateFormatted = this.templateHelpers.formatDateTime(this.model.get("expectedStartDate"), this.model.get("timeZone"), App.config.company.config.dateFormat);
            // Parse the above string back to a date
            var expectedDateParsed = Date.parseExact(expectedDateFormatted, App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat);

            var startOnDate = Date.parseExact(this.$el.find("#startOn").val(), App.config.company.config.dateFormat);
            var startOn = new Date(expectedDateParsed.valueOf());

            // Set the day/month/year from Recurrence starts on in the screen
            startOn.setFullYear(startOnDate.getFullYear());
            startOn.setMonth(startOnDate.getMonth());
            startOn.setDate(startOnDate.getDate());
            this.model.set("startOn", startOn.toISOString());

            this.model.repeat({}, {
                success: function (model, response) {
                    that.$el.modal('hide');
                    popupFetchOptions.success(model, response, true /* wait for response */ );
                    window.location.reload();
                },
                error: popupFetchOptions.error
            });
            return false;
        }

    });

    $.common.ClientQuickAddView = $.app.ItemView.extend({

        tagName: "div",

        className: "category span4",

        template: "common/client/quickadd",

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'saveClient', 'createClient', 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.parentView = this.options.parentView;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .widget-save-client": function (evt) {
                this.trigger("save-client");
            },
            "click .widget-create-client": function (evt) {
                this.trigger("create-client");
            },
            "click .widget-close-client": function (evt) {
                this.off();
            }
        },

        saveClient: function () {
            var that = this;

            if (this.model.id) {
                // show warning if update existing
                var confirmCancel = new $.common.ConfirmCancelClientUpdateView();
                confirmCancel.render();
                confirmCancel.on("confirm", function () {
                    // update existing
                    that.model.save({}, {
                        success: function (model, response) {
                            that.$el.modal('hide');
                            that.parentView.views.clientDD.view.trigger("change", that.model.toJSON());
                            that.off();
                        },
                        error: popupFetchOptions.error /*, error: handleError*/
                    });
                });
            } else {
                // save new
                this.model.save({}, {
                    success: function (model, response) {
                        that.$el.modal('hide');
                        that.parentView.views.clientDD.view.trigger("change", that.model.toJSON());
                        that.off();
                    },
                    error: popupFetchOptions.error /*, error: handleError*/
                });
            }

        },

        createClient: function (evt) {
            var client = new $.core.Client({
                "company.id": App.config.company.id,
                "customer": this.model.get('customer')
            });
            this.off();
            this.model = client;
            this.render();
        },

        onRender: function () {
            // always clear previous on's. to be replaced when view added as html()
            this.off();
            this.$el.modal('show');
            var that = this;
            this.on("save-client", function (evt) {
                that.saveClient();
            });
            this.on("create-client", function (evt) {
                that.createClient();
            });
            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();

            if (!this.model.isNew()) {
                this.$el.find(".widget-create-client").removeClass("hidden");
            }

            return this;
        }

    });

    $.common.CustomerQuickAddView = $.app.ItemView.extend({

        tagName: "div",

        className: "category span4",

        template: "customer/quickadd",

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'renderAddress', 'saveCustomer', 'error', 'invalid', 'createCustomer');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.parentView = this.options.parentView;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #save": "saveCustomer",
            "click .widget-save-customer": function (evt) {
                this.trigger("save-customer");
            },
            "click .widget-close-customer": function (evt) {
                this.off();
            },
            "click .widget-create-customer": function (evt) {
                this.trigger("create-customer");
            }
        },

        createCustomer: function (evt) {
            var customer = new $.core.Customer({
                "company.id": App.config.company.id,
                "status.id": App.dict.customerStatus.active.id
            });
            this.off();
            this.model = customer;
            this.render();
        },

        onRender: function () {
            // always clear previous on's. to be replaced when view added as html()
            this.off();
            this.$el.modal('show');
            var that = this;
            this.on("save-customer", function (evt) {
                that.saveCustomer();
            });

            this.on("create-customer", function (evt) {
                that.createCustomer();
            });

            var address = null;
            var addresses = this.model.get("billingAddresses");

            if (addresses.length > 0) {
                address = addresses.models[0];
                address.set("isBilling", true);
            } else {
                address = new $.core.CustomerAddress({
                    "company.id": App.config.company.id,
                    "type.id": App.dict.addressType.billing.id,
                    "isBilling": true
                });
            }

            addresses.add(address);

            this.renderAddress(address, addresses);

            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();

            this.$el.find("#addressType").val(App.dict.addressType.billing.id);
            this.$el.find("#addressType").prop("disabled", true);

            if (!this.model.isNew()) {
                this.$el.find(".widget-create-customer").removeClass("hidden");
            }

            return this;
        },

        renderAddress: function (address, addresses) {
            var addressView = new $.common.AddressView({
                model: address,
                collection: addresses
            });
            addressView.render();
            this.$el.find("#billingAddresses").append(addressView.el);

            var filteredType = _.filter(App.dict.addressType, function (r) {
                return r.nameKey === "billing";
            });

            var selectHtml = $.app.mixins.templateHelpersMixin.selectOptions(filteredType, {
                noSelection: {
                    id: '',
                    name: '[Choose a Type]'
                }
            });

            this.$el.find("#addressType").html(selectHtml);
        },

        addAddress: function () {

            //add the address to the collection
            var addresses = this.model.get("billingAddresses");
            var address = new $.core.CustomerAddress({
                "company.id": App.config.company.id,
                "type.id": App.dict.addressType.billing.id
            });
            addresses.add(address);
        },

        saveCustomer: function () {
            var that = this;

            if (this.model.id) {
                // show warning if update existing
                var confirmCancel = new $.common.ConfirmCancelCustomerUpdateView();
                confirmCancel.render();
                confirmCancel.on("confirm", function () {
                    // update existing
                    that.model.save({}, {
                        success: function (model, response) {
                            that.$el.modal('hide');
                            that.parentView.views.customerDD.view.trigger("change", that.model.toJSON());
                            that.off();
                        },
                        error: popupFetchOptions.error /*, error: handleError*/
                    });
                });
            } else {
                // save new
                this.model.save({}, {
                    success: function (model, response) {
                        that.$el.modal('hide');
                        that.parentView.views.customerDD.view.trigger("change", that.model.toJSON());
                        that.off();
                    },
                    error: popupFetchOptions.error /*, error: handleError*/
                });
            }
        }
    });

    $.common.RequestorQuickAddView = $.app.ItemView.extend({

        tagName: "div",

        template: "requestor/quickadd",

        initialize: function (options) {
            this.customerId = this.options.customerId;
            this.parentView = this.options.parentView;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #generateUsername": "generateUsername",
            "click .widget-save-requestor": "saveRequestor",
            "click .widget-create-requestor": "createRequestor"
        },

        modelEvents: {
            "error": "error",
            "invalid": "invalid"
        },

        createRequestor: function (evt) {

            // create new requestor & view
            var requestor = new $.core.Requestor({
                enabled: false,
                active: true
            });

            this.model = requestor;
            this.render();
        },

        generateUsername: function (evt) {
            var firstName = this.model.get("firstName");
            var lastName = this.model.get("lastName");
            if (firstName && lastName) {
                firstName = firstName.trim().toLowerCase();
                lastName = lastName.trim().toLowerCase();
                var userName = firstName + lastName;
                userName = userName.replace(/ /g, "");
                this.model.set("username", userName);
                this.$el.find("#username").val(userName);
            } else {
                handleActionError({
                    message: "First Name and Last Name fields are required to generate requestor usernames."
                });
            }
        },

        onRender: function () {

            // unbind all existing events as we're reusing el
            this.unbind();

            // insert content into html and then call .modal().
            // this correctly clears out previous events bound in the el
            this.$modalEl = $("#modalContainer");

            this.$modalEl.html(this.el);
            this.$modalEl.modal();

            // bind events as we're calling render directly and reusing el
            this.delegateEvents();

            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();

            if (!this.model.isNew()) {
                this.$el.find(".widget-create-requestor").removeClass("hidden");
            }

            return this;
        },

        saveRequestor: function () {
            var that = this;
            var reqId = this.model.id;

            if (this.model.id) {
                // show warning if update existing
                var confirmCancel = new $.common.ConfirmCancelRequestorUpdateView();
                confirmCancel.render();
                confirmCancel.on("confirm", function () {
                    // update existing
                    that.model.save({}, {
                        success: function (model, response) {
                            if (reqId === null || reqId === undefined) {
                                var association = new $.core.CustomerClientLocation({
                                    'requestor': {
                                        id: model.id
                                    },
                                    'company': {
                                        id: App.config.company.id
                                    },
                                    'customer': {
                                        id: that.customerId
                                    }
                                });

                                association.save({}, {
                                    success: function (model, response) {
                                        that.$modalEl.modal('hide');
                                        that.parentView.views.requestorDD.view.trigger("change", that.model.toJSON());
                                    },
                                    error: popupFetchOptions.error
                                });
                            } else {
                                that.$modalEl.modal('hide');
                                if (that.parentView.views) {
                                    that.parentView.views.requestorDD.view.trigger("change", that.model.toJSON());
                                }
                            }
                        },
                        error: popupFetchOptions.error /*, error: handleError*/
                    });
                });
            } else {
                // save new
                this.model.save({}, {
                    success: function (model, response) {
                        if (reqId === null || reqId === undefined) {
                            var association = new $.core.CustomerClientLocation({
                                'requestor': {
                                    id: model.id
                                },
                                'company': {
                                    id: App.config.company.id
                                },
                                'customer': {
                                    id: that.customerId
                                }
                            });

                            association.save({}, {
                                success: function (model, response) {
                                    that.$modalEl.modal('hide');
                                    that.parentView.views.requestorDD.view.trigger("change", that.model.toJSON());
                                },
                                error: popupFetchOptions.error
                            });
                        } else {
                            that.$modalEl.modal('hide');
                            if (that.parentView.views) {
                                that.parentView.views.requestorDD.view.trigger("change", that.model.toJSON());
                            }
                        }
                    },
                    error: popupFetchOptions.error /*, error: handleError*/
                });
            }

        }
    });

    $.common.LocationQuickAddView = $.app.BaseView.extend({

        tagName: "div",

        className: "category span4",

        template: JST["common/addressextended/quickadd"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'saveAddress', 'error', 'invalid', 'createLocation');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.parentView = this.options.parentView;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .widget-save-location": function (evt) {
                this.trigger("save-location");
            },
            "click .widget-create-location": function (evt) {
                this.trigger("create-location");
            }
        },

        createLocation: function (evt) {
            var parentModel = this.parentView.model;
            var location = parentModel.get("location");
            var customer = parentModel.get("customer");
            var client = parentModel.get("client");

            var address = new $.core.CustomerAddress({
                "company.id": App.config.company.id,
                "customer.id": customer ? customer.id : null,
                "client.id": client ? client.id : null,
                "type.id": App.dict.addressType.service.id,
                "reuse": true
            });
            this.off();
            this.model = address;
            this.render();
        },

        render: function () {
            // always clear previous on's. to be replaced when view added as html()
            this.off();
            $(this.el).html(this.template(_.extend({
                model: this.model.toJSON()
            }, this.templateHelpers)));

            this.$el.modal('show');
            var that = this;
            this.on("save-location", function (evt) {
                that.saveAddress();
            });

            this.on("create-location", function (evt) {
                that.createLocation();
            });

            var addressView = new $.common.AddressExtendedView({
                model: that.model,
                hideParent: true
            });


            addressView.render();
            this.$el.find("#address").append(addressView.el);
            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();

            if (!this.model.isNew()) {
                this.$el.find(".widget-create-location").removeClass("hidden");
            }

            return this;
        },

        saveAddress: function () {
            var that = this;

            if (this.model.get('valid') === false) {
                return;
            }

            if (this.model.id) {
                // show warning if update existing
                var confirmCancel = new $.common.ConfirmCancelLocationUpdateView();
                confirmCancel.render();
                confirmCancel.on("confirm", function () {
                    // update existing
                    that.model.save({}, {
                        success: function (model, response) {
                            that.$el.modal('hide');
                            if (that.parentView.views) {
                                that.parentView.views.locationDD.view.trigger("change", that.model.toJSON());
                            }
                            that.parentView.trigger("update:location", that.model.toJSON());
                            that.off();
                        },
                        error: popupFetchOptions.error /*, error: handleError*/
                    });
                });
            } else {
                // save new
                this.model.save({}, {
                    success: function (model, response) {
                        that.$el.modal('hide');
                        if (that.parentView.views) {
                            that.parentView.views.locationDD.view.trigger("change", that.model.toJSON());
                        }
                        that.parentView.trigger("create:location", that.model.toJSON());
                        that.off();
                    },
                    error: popupFetchOptions.error /*, error: handleError*/
                });
            }
        }
    });

    $.common.SublocationQuickAddView = $.app.BaseView.extend({

        tagName: "div",

        className: "category span4",

        template: JST["common/address/quickadd"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'synchModel', 'saveAddress', 'error', 'invalid', 'createSublocation');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
            this.parentView = this.options.parentView;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .widget-save-sublocation": function (evt) {
                this.trigger("save-sublocation");
            },
            "click .widget-create-sublocation": function (evt) {
                this.trigger("create-sublocation");
            }
        },

        createSublocation: function (evt) {
            var parentModel = this.parentView.model;
            var location = parentModel.get("location");
            var customer = parentModel.get("customer");

            var address = new $.core.CustomerAddress({
                "parent.id": location ? location.id : null,
                "company.id": App.config.company.id,
                "customer.id": customer ? customer.id : null,
                "type.id": App.dict.addressType.service.id
            });
            this.off();
            this.model = address;
            this.render();
        },

        render: function () {
            // always clear previous on's. to be replaced when view added as html()
            this.off();
            $(this.el).html(this.template(_.extend({
                model: this.model.toJSON()
            }, this.templateHelpers)));

            this.$el.modal('show');
            var that = this;
            this.on("save-sublocation", function (evt) {
                that.saveAddress();
            });

            this.on("create-sublocation", function (evt) {
                that.createSublocation();
            });

            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();

            if (!this.model.isNew()) {
                this.$el.find(".widget-create-sublocation").removeClass("hidden");
            }

            return this;
        },

        saveAddress: function () {
            var that = this;

            if (this.model.id) {
                // show warning if update existing
                var confirmCancel = new $.common.ConfirmCancelSublocationUpdateView();
                confirmCancel.render();
                confirmCancel.on("confirm", function () {
                    // update existing
                    that.model.save({}, {
                        success: function (model, response) {
                            that.$el.modal('hide');
                            that.parentView.views.sublocationDD.view.trigger("change", that.model.toJSON());
                            that.off();
                        },
                        error: popupFetchOptions.error /*, error: handleError*/
                    });
                });
            } else {
                // save new
                this.model.save({}, {
                    success: function (model, response) {
                        that.$el.modal('hide');
                        that.parentView.views.sublocationDD.view.trigger("change", that.model.toJSON());
                        that.off();
                    },
                    error: popupFetchOptions.error /*, error: handleError*/
                });
            }
        }
    });

    $.common.ConsumerQuickAddView = $.app.ItemView.extend({

        tagName: "div",

        template: "consumer/quickadd",

        initialize: function (options) {
            this.customerId = this.options.customerId;
            this.parentView = this.options.parentView;
            this.customerSpecific = this.options.customerSpecific;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .widget-save-consumer": "saveConsumer",
            "click .widget-create-consumer": "createConsumer"
        },

        modelEvents: {
            "error": "error",
            "invalid": "invalid"
        },

        createConsumer: function (evt) {
            var consumer = new $.core.Consumer({
                "company.id": App.config.company.id,
                "active": true
            });
            this.model = consumer;
            this.render();
        },

        onRender: function () {

            // unbind all existing events as we're reusing el
            this.unbind();

            // $(this.el).html(this.template(_.extend({
            //     model: this.model.toJSON()
            // }, this.templateHelpers)));

            this.$("#dateOfBirth").datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                yearRange: "-80:+1"
            });

            this.$("#dateOfInjury").datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                yearRange: "-80:+1"
            });

            // insert content into html and then call .modal().
            // this correctly clears out previous events bound in the el
            this.$modalEl = $("#modalContainer");

            this.$modalEl.html(this.el);
            this.$modalEl.modal();

            // bind events as we're calling render directly and reusing el
            this.delegateEvents();

            this.showSecured();
            this.callbacks(this.$el, this.model);
            this.formatElements();

            if (!this.model.isNew()) {
                this.$el.find(".widget-create-consumer").removeClass("hidden");
            }

            return this;
        },

        saveConsumer: function () {
            var that = this;
            var consumerId = this.model.id;

            if (this.model.id) {
                // show warning if update existing
                var confirmCancel = new $.common.ConfirmCancelConsumerUpdateView();
                confirmCancel.render();
                confirmCancel.on("confirm", function () {
                    // update existing
                    that.model.save({}, {
                        success: function (model, response) {
                            var consumerSuccess = model;
                            if ((consumerId === null || consumerId === undefined) && that.customerSpecific) {
                                var association = new $.common.CustomerConsumer({
                                    'id': model.id,
                                    'company': {
                                        id: App.config.company.id
                                    },
                                    'customer': {
                                        id: that.customerId
                                    }
                                });

                                association.save({}, {
                                    success: function (model, response) {
                                        that.$modalEl.modal('hide');
                                        that.parentView.views.consumerDD.view.trigger("change", consumerSuccess.toJSON());
                                    }
                                });
                            } else {
                                that.$modalEl.modal('hide');
                                if (that.parentView.views) {
                                    that.parentView.views.consumerDD.view.trigger("change", consumerSuccess.toJSON());
                                }
                            }
                        },
                        error: popupFetchOptions.error /*, error: handleError*/
                    });
                });
            } else {
                // save new
                this.model.save({}, {
                    success: function (model, response) {
                        var consumerSuccess = model;
                        if ((consumerId === null || consumerId === undefined) && that.customerSpecific) {
                            var association = new $.common.CustomerConsumer({
                                'id': model.id,
                                'company': {
                                    id: App.config.company.id
                                },
                                'customer': {
                                    id: that.customerId
                                }
                            });

                            association.save({}, {
                                success: function (model, response) {
                                    that.$modalEl.modal('hide');
                                    that.parentView.views.consumerDD.view.trigger("change", consumerSuccess.toJSON());
                                },
                                error: popupFetchOptions.error /*, error: handleError*/
                            });
                        } else {
                            that.$modalEl.modal('hide');
                            if (that.parentView.views) {
                                that.parentView.views.consumerDD.view.trigger("change", consumerSuccess.toJSON());
                            }
                        }
                    },
                    error: popupFetchOptions.error /*, error: handleError*/
                });
            }

        }
    });

    /**
     * confirmation view for updates to entities from booking screen
     * this view must be extended to provide the template
     */
    $.common.ConfirmCancelView = $.app.ItemView.extend({

        events: {
            "click .cmd-widget-confirm": function () {
                this.trigger("confirm");
            }
        },

        onRender: function () {

            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal();
        }
    });

    $.common.ConfirmCancelCustomerUpdateView = $.common.ConfirmCancelView.extend({
        template: "common/confirmcancel/updatecustomer"
    });
    $.common.ConfirmCancelClientUpdateView = $.common.ConfirmCancelView.extend({
        template: "common/confirmcancel/updateclient"
    });
    $.common.ConfirmCancelRequestorUpdateView = $.common.ConfirmCancelView.extend({
        template: "common/confirmcancel/updaterequestor"
    });
    $.common.ConfirmCancelLocationUpdateView = $.common.ConfirmCancelView.extend({
        template: "common/confirmcancel/updatelocation"
    });
    $.common.ConfirmCancelSublocationUpdateView = $.common.ConfirmCancelView.extend({
        template: "common/confirmcancel/updatesublocation"
    });
    $.common.ConfirmCancelConsumerUpdateView = $.common.ConfirmCancelView.extend({
        template: "common/confirmcancel/updateconsumer"
    });

    $.common.CustomerConsumer = Backbone.Model.extend({
        url: function () {
            return App.config.context + "/api/consumer/" + this.get("id") + "/customer/" + this.get("customer").id;
        }
    });

    $.common.JobOffersForContactDashboardView = $.app.ItemView.extend({
        /*
        This is the View for the Interpreter Portal - Offered Table
        The columns are different to admin offers for contact view
        Includes JobOffer ActionCell for Interpreter to use
         */
        template: "common/joboffers/show",

        events: {},

        initialize: function (options) {
            this.backgridColumns = [{
                name: "",
                label: "Action",
                editable: false,
                sortable: false,
                cell: $.app.backgrid.JobOfferActionCell,
                formatterOptions: {
                    length: 5
                }
            }, {
                name: 'id',
                label: 'ID',
                editable: false,
                searchable: true,
                searchName: "job.id",
                sortName: "job.id",
                cell: $.app.backgrid.GenericCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return model.get("job").id;
                        }
                    },
                    toRaw: function (formattedData, model) {
                        if (formattedData) {
                            return formattedData;
                        }
                        return "";
                    }
                },
                formatterOptions: {
                    length: 10,
                    link: {
                        className: 'gridiFramePopup',
                        url: App.config.context + '/interpreter/offer/',
                        context: function (model) {
                            if (model) {
                                var job = model.get("job");
                                if (job && job !== undefined) {
                                    return job.id;
                                }
                            }
                        }
                    }
                }
            }, {
                name: "medium",
                label: "Md.",
                editable: false,
                sortable: false,
                cell: $.app.backgrid.GenericCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (rawData) {
                            if (rawData.id == 1) {
                                return "<span  title='" + rawData.name + "'><i class='icon-envelope'></i></span>";
                            } else if (rawData.id == 2) {
                                return "<span  title='" + rawData.name + "'><i class='icon-mobile-phone'></i></span>";
                            } else if (rawData.id == 3) {
                                return "<span  title='" + rawData.name + "'><i class='icon-phone'></i></span>";
                            } else if (rawData.id == 4) {
                                return "<span  title='" + rawData.name + "'><i class='icon-phone-sign'></i></span>";
                            }
                        } else {
                            // can't return undefined as SelectCellEditor doesn't likey
                            return "N/A";
                        }
                    }
                }
            }, {
                name: "customer",
                sortName: "customer.name",
                searchName: "customer.name",
                op: 'bw',
                label: "Customer",
                editable: false,
                searchable: true,
                filterable: true,
                renderable: options.showCustomerOnOffer,
                cell: $.app.backgrid.CustomerCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return model.get("job").customerDisplayName;
                        }
                    },
                    toRaw: function (formattedData, model) {
                        if (formattedData) {
                            return formattedData;
                        }
                        return "";
                    }
                },
                formatterOptions: {
                    length: 20
                }
            }, {
                name: "actualLocationDisplayLabel",
                sortName: "location.description",
                searchName: "location.description",
                op: "bw",
                label: "Location",
                editable: false,
                searchable: true,
                filterable: true,
                renderable: options.showLocationOnOffer,
                cell: $.app.backgrid.LocationCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return model.get("job").actualLocationDisplayLabel;
                        }
                    },
                    toRaw: function (formattedData, model) {
                        if (formattedData) {
                            return formattedData;
                        }
                        return "";
                    }
                },
                formatterOptions: {
                    length: 30
                }
            }, {
                name: 'expectedStartDate',
                label: 'Start Date',
                editable: false,
                searchable: true,
                searchName: "job.expectedStartDate",
                sortName: "job.expectedStartDate",
                op: "eqd",
                cell: $.app.backgrid.DateCell,
                formatter: {
                    templateHelpers: $.app.mixins.templateHelpersMixin,
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return this.templateHelpers.formatDate(model.get("job").expectedStartDate, model.get("job").timeZone);
                        }
                    },
                    toRaw: function (formattedData, model) {
                        if (formattedData) {
                            return this.templateHelpers.parseDate(formattedData, model.get("job").timeZone);
                        }
                    }
                }
            }, {
                name: 'startTime',
                label: 'Start Time',
                editable: false,
                searchable: false,
                searchName: "job.expectedStartDate",
                sortName: "job.expectedStartDate",
                op: "eqd",
                cell: $.app.backgrid.GenericCell,
                formatter: {
                    templateHelpers: $.app.mixins.templateHelpersMixin,
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return this.templateHelpers.formatTime(model.get("job").expectedStartDate, model.get("job").timeZone);
                        }
                    },
                    toRaw: function (formattedData, model) {
                        if (formattedData) {
                            return this.templateHelpers.parseTime(formattedData, model.get("job").timeZone);
                        }
                    }
                }
            }, {
                name: "expectedDurationHrs",
                label: "Hrs",
                editable: false,
                sortable: false,
                length: 10,
                cell: $.app.backgrid.GenericCell,
                formatterOptions: {
                    whenEmpty: "expectedDurationHrs",
                    whenEmptyShowError: false
                },
                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                    fromRaw: function (rawData, model) {
                        if (model) {
                            var rawValue = model.get("job").expectedDurationHrs;
                            if (rawValue) {
                                var hours = Math.floor(rawValue);
                                var minutes = Math.round((rawValue - hours) * 60);
                                return hours + ":" + (minutes >= 10 ? minutes : "0" + minutes);
                            } else {
                                return null;
                            }
                        }
                    }
                })
            }, {
                name: "language",
                label: "Language",
                editable: false,
                sortable: false,
                cell: $.app.backgrid.LanguageCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return model.get("job").language.iso639_3Tag ? model.get("job").language.iso639_3Tag : model.get("job").language.subtag;
                        }
                    },
                    toRaw: function (formattedData, model) {
                        if (formattedData) {
                            return model.get("job").language;
                        }
                    }
                },
                formatterOptions: {
                    link: {
                        className: 'gridPopup',
                        url: App.config.context + '/language/summary/',
                        context: function (model) {
                            if (model) {
                                var job = model.get("job");
                                if (job && job !== undefined) {
                                    return model.get("job").language ? (model.get("job").language.iso639_3Tag ? model.get("job").language.iso639_3Tag : model.get("job").language.subtag) : null;
                                }
                            }
                        }
                    },
                    tooltip: function (model) {
                        if (model) {
                            var job = model.get("job");
                            if (job && job !== undefined) {
                                return model.get("job").language ? model.get("job").language.description : null;
                            }
                        }
                    }
                }
            }, {
                name: "teamSize",
                label: "Size",
                editable: false,
                sortable: false,
                cell: $.app.backgrid.GenericCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return model.get("job").teamSize;
                        }
                    },
                    toRaw: function (formattedData, model) {
                        if (formattedData) {
                            return model.get("job").teamSize;
                        }
                    }
                }
            }, {
                name: "status",
                label: "Status",
                editable: false,
                sortable: false,
                cell: $.app.backgrid.BookingStatusCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (model) {
                            return model.get("job").status.id.toString();
                        } else {
                            // can't return undefined as SelectCellEditor doesn't likey
                            return "";
                        }
                    },

                    toRaw: function (formattedData, model) {
                        return getStatusById(App.dict.bookingStatus, formattedData);
                    }
                }
            }, {
                name: "availableWhenOffered",
                label: "Avl.",
                editable: false,
                sortable: false,
                length: 10,
                cell: $.app.backgrid.GenericCell,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (rawData === null) {
                            return "N/A";
                        } else if (rawData) {
                            return "Yes";
                        } else {
                            return "No";
                        }
                    }
                }
            }];

            this.grid = new Backgrid.Grid({
                header: $.app.backgrid.SearchableHeader,
                columns: this.backgridColumns,
                collection: this.collection
            });

            this.paginator = new $.app.backgrid.Paginator({
                collection: this.collection
            });
        },

        onRender: function () {
            this.$el.find('.jobOffers-list').html(this.grid.render().el);
            this.$el.find('.jobOffers-list').append(this.paginator.render().el);
        }
    });

    $.common.JobOffersForContactView = $.app.ItemView.extend({
        // View for Booking Job Offers for Interpreter
        // Loads a backgrid table with list and date filters
        // Manage Contacts - View Offers
        template: 'contact/manage/jobOffers',

        events: {},

        initialize: function (options) {
            this.$el.on('hidden', function () {
                // clear the wider modal class when view is hidden (closed)
                if (this.classList.contains("modal-wide")) {
                    this.classList.remove("modal-wide");
                }
            });
            this.contactId = this.options.contactId;
            this.contactName = this.options.contactName;

            _.bindAll(this, 'refresh');

            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", App.config.company.id);
            filtersJSON = addOrUpdateFilter(filtersJSON, "interpreter.id", "eq", this.contactId);

            var jobOffers = this.collection;
            jobOffers.setSorting("job.expectedStartDate", "desc");
            jobOffers.queryParams.filters = JSON.stringify(filtersJSON);

            this.backgridColumns = [{
                name: 'job',
                label: 'Job',
                cell: $.app.backgrid.JobIDCell,
                editable: false,
                formatterOptions: {
                    length: 20
                }
            }, {
                name: 'expectedStartDate',
                label: 'Expected Start Date',
                sortName: 'job.expectedStartDate',
                cell: $.app.backgrid.DateTimeCell,
                editable: false,
                formatterOptions: {
                    length: 30
                }
            }, {
                name: 'status',
                label: 'Job Status',
                cell: $.app.backgrid.BookingStatusCell,
                editable: false,
                sortName: 'job.status',
                formatterOptions: {
                    length: 30
                }
            }, {
                name: 'lastNotificationDate',
                label: 'Last notification date',
                cell: $.app.backgrid.DateTimeCell,
                editable: false
            }, {
                name: 'note',
                label: 'Note',
                cell: Backgrid.StringCell,
                editable: false
            }, {
                name: 'medium',
                label: 'Medium',
                editable: false,
                cell: cellByAttribute('name')
            }, {
                name: 'declined',
                label: 'Offer declined?',
                cell: $.app.backgrid.GenericCell,
                editable: false,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (rawData) {
                            return "Yes";
                        } else {
                            return "No";
                        }
                    }
                },
                formatterOptions: {
                    length: 20
                }
            }, {
                name: 'active',
                label: 'Offer active?',
                cell: $.app.backgrid.GenericCell,
                editable: false,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (rawData) {
                            return "Active";
                        } else {
                            return "Not active";
                        }
                    }
                },
                formatterOptions: {
                    length: 20
                }
            }, {
                name: 'allowDoubleBooking',
                label: 'Allow double booking?',
                cell: $.app.backgrid.BooleanCell,
                editable: false,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (rawData) {
                            return "Yes";
                        } else {
                            return "No";
                        }
                    }
                }
            }, {
                name: 'availableWhenOffered',
                label: 'Available when offered?',
                cell: $.app.backgrid.GenericCell,
                editable: false,
                formatter: {
                    fromRaw: function (rawData, model) {
                        if (rawData === null) {
                            return "N/A";
                        } else if (rawData) {
                            return "Yes";
                        } else {
                            return "No";
                        }
                    }
                }
            }];

            this.grid = new Backgrid.Grid({
                columns: this.backgridColumns,
                collection: this.collection,
                emptyText: "No Job Offers"
            });

            this.paginator = new $.app.backgrid.Paginator({

                collection: this.collection
            });

        },

        onRender: function () {
            var that = this;
            // wider modal required for job offers
            // add custom class - overwrites modal css
            this.el.classList.add("modal-wide");
            // remove calendar modal class (clashing css)
            this.el.classList.remove("calendar-view-modal");
            this.resetDates();
            this.$('.periodStart, .periodEnd').daterangepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                onChange: function (startDate, endDate) {
                    setTimeout(function () {
                        that.refresh();
                    }, 100);
                },
                presetRanges: financialAndReportPresets,
                datepickerOptions: {
                    changeMonth: true,
                    changeYear: true
                },
                earliestDate: Date.parse('January 01, 2008'), //earliest date allowed
                latestDate: Date.parse('January 01, 2020') //latest date allowed
            });

            this.$('.periodStart, .periodEnd').change(function () {});

            this.refresh();
            this.$el.find(".jobOffers-list").append(this.grid.render().$el);
            this.$el.find(".jobOffers-paginator").append(this.paginator.render().$el);
            this.$el.find(".contactName").html(this.contactName);

            this.showSecured();
        },

        refresh: function (dts) {
            var dtsInput = $('.periodStart').val() + ' - ' + $('.periodEnd').val();

            var dateRange = [];
            if (dtsInput !== undefined && dtsInput !== null && dtsInput !== "") {
                dateRange = dtsInput.split(" - ");
            }
            var startDate = null;
            var endDate = null;

            if (dateRange.length === 2) {
                startDate = dateRange[0];
                endDate = dateRange[1];
            } else if (dateRange.length === 1) {
                startDate = dateRange[0];
            }

            var filters;
            var filtersJSON = null;

            // load existing filters if present
            if (this.collection.queryParams.filters) {
                filtersJSON = JSON.parse(this.collection.queryParams.filters);
            } else {
                filtersJSON = {
                    groupOp: "AND",
                    rules: []
                };
            }

            filtersJSON = addOrUpdateDateRangeFilter(startDate ? startDate : dts.periodStart, endDate ? endDate : dts.periodEnd, "expectedStartDate", filtersJSON);

            filters = JSON.stringify(filtersJSON, null, "\t");

            this.collection.setSorting("job.expectedStartDate", "desc");
            this.collection.queryParams.filters = filters;

            this.collection.fetch();
        },

        resetDates: function () {

            this.$(".periodStart").val((new Date()).addDays(-15).toString(App.config.company.config.dateFormat));
            this.$(".periodEnd").val((new Date()).addDays(1).toString(App.config.company.config.dateFormat));

        }
    });

    $.common.JobOffersForJobView = $.app.ItemView.extend({
        // View for Interpreter Job Offers for Job
        // Loads a backgrid table with list
        template: "common/joboffers/show",

        events: {
            "click .resendOffers": "resendOffers"
        },

        resendOffers: function () {
            var selectedModels = this.grid.getSelectedModels();
            var bookingModel = new $.visit.v2.InterpreterVisitModel({
                id: App.config.booking.id
            });
            _.each(selectedModels, function (jobOffer) {
                jobOffer.set("lastNotificationDate", new Date().toISOString());
            });

            var offers = new $.core.JobOfferCollection(selectedModels);
            offers.save();
        },

        initialize: function () {
            this.backgridColumns = [{
                    name: "",
                    cell: "select-row",
                    headerCell: "select-all"
                }, {
                    name: "",
                    label: "Action",
                    editable: false,
                    sortable: false,
                    cell: $.app.backgrid.JobOfferAssignActionCell,
                    formatterOptions: {
                        length: 4
                    }
                }, {
                    name: 'interpreter',
                    label: 'Interpreter',
                    cell: $.app.backgrid.InterpreterCell,
                    editable: false,
                    formatterOptions: {
                        length: 30
                    }
                }, {
                    name: 'accepted',
                    label: 'Offer accepted?',
                    cell: $.app.backgrid.BooleanCell,
                    editable: false,
                    searchable: true,
                    filterable: true,
                    renderable: true,
                    searchName: 'accepted',
                    formatter: {
                        fromRaw: function (rawData, model) {
                            if (rawData) {
                                return "Yes";
                            } else {
                                return "No";
                            }
                        }
                    }
                }, {
                    name: 'lastNotificationDate',
                    label: 'Last notification date',
                    cell: $.app.backgrid.DateTimeCell,
                    editable: false
                }, {
                    name: 'note',
                    label: 'Note',
                    cell: Backgrid.StringCell,
                    editable: false
                }, {
                    name: 'medium',
                    label: 'Medium',
                    editable: false,
                    cell: cellByAttribute('name')
                }, {
                    name: 'declined',
                    label: 'Offer declined?',
                    cell: $.app.backgrid.BooleanCell,
                    editable: false,
                    searchable: true,
                    filterable: true,
                    renderable: true,
                    searchName: 'declined',
                    formatter: {
                        fromRaw: function (rawData, model) {
                            if (rawData) {
                                return "Yes";
                            } else {
                                return "No";
                            }
                        }
                    }
                }, {
                    name: 'active',
                    label: 'Offer active?',
                    cell: $.app.backgrid.BooleanCell,
                    editable: false,
                    searchable: true,
                    filterable: true,
                    renderable: true,
                    searchName: 'active',
                    formatter: {
                        fromRaw: function (rawData, model) {
                            if (rawData) {
                                return "Yes";
                            } else {
                                return "No";
                            }
                        }
                    }
                }, {
                    name: 'allowDoubleBooking',
                    label: 'Allow double booking?',
                    cell: $.app.backgrid.BooleanCell,
                    editable: false,
                    searchable: true,
                    filterable: true,
                    renderable: true,
                    searchName: 'allowDoubleBooking',
                    formatter: {
                        fromRaw: function (rawData, model) {
                            if (rawData) {
                                return "Yes";
                            } else {
                                return "No";
                            }
                        }
                    }
                }, {
                    name: 'availableWhenOffered',
                    label: 'Available when offered?',
                    cell: $.app.backgrid.GenericCell,
                    editable: false,
                    formatter: {
                        fromRaw: function (rawData, model) {
                            if (rawData === null) {
                                return "N/A";
                            } else if (rawData) {
                                return "Yes";
                            } else {
                                return "No";
                            }
                        }
                    }
                }, {
                    name: 'interpreterNotes',
                    label: 'Interpreter Notes',
                    cell: $.app.backgrid.GenericCell,
                    editable: false,
                    formatter: {
                        fromRaw: function (rawData, model) {
                            return rawData ? rawData : '';
                        }
                    }
                }, {
                    name: 'rateSummary',
                    id: 'rateSummary',
                    label: 'Rate',
                    cell: $.app.backgrid.GenericCell,
                    width: 60,
                    fixed: true,
                    align: "center",
                    sortable: false,
                    formatter: {
                        fromRaw: function (rawData, model) {
                            var standardRate = null;
                            var premiumRate = null;
                            var platinumRate = null;

                            var key = App.config.booking["bookingMode.nameKey"]; // must be inperson
                            var rateValues = _.isObject(rawData) && _.isString(key) ? rawData[key] : "";
                            if (!key) {
                                return "summary unavailable";
                            } else if (_.isObject(rateValues)) {
                                standardRate = rateValues.standard;
                                premiumRate = rateValues.premium;
                                platinumRate = rateValues.platinum;
                                return standardRate + " / " + premiumRate + " / " + platinumRate;
                            }
                        }
                    },
                    search: false,
                    editable: false,
                    renderable: _.contains((App.config.company.name).toUpperCase(), "GENEVA")
                }, {
                    name: 'marginSummary',
                    id: 'marginSummary',
                    label: 'Margin',
                    cell: $.app.backgrid.GenericCell,
                    width: 60,
                    fixed: true,
                    align: "center",
                    sortable: false,
                    formatter: {
                        fromRaw: function (rawData, model) {
                            var standardMargin = null;
                            var premiumMargin = null;
                            var platinumMargin = null;

                            var key = App.config.booking["bookingMode.nameKey"]; // must be inperson
                            var rateValues = _.isObject(rawData) && _.isString(key) ? rawData[key] : "";
                            if (!key) {
                                return "summary unavailable";
                            } else if (_.isObject(rateValues)) {
                                standardMargin = rateValues.standard;
                                premiumMargin = rateValues.premium;
                                platinumMargin = rateValues.platinum;
                                return standardMargin + "% / " + premiumMargin + "% / " + platinumMargin + "%";
                            }
                        }
                    },
                    search: false,
                    editable: false,
                    renderable: _.contains((App.config.company.name).toUpperCase(), "GENEVA")
                }

            ];

            var ActionFooter = Backgrid.Footer.extend({
                render: function () {
                    this.el.innerHTML = '<tr><td colspan="8"><button class="btn resendOffers">Resend offers</button><span style="float: right;" class="offer-count"></span></td></tr>';
                    return this;
                }
            });

            this.grid = new Backgrid.Grid({
                header: $.app.backgrid.SearchableHeader.extend({
                    name: 'offers',
                    persistent: true
                }),
                columns: this.backgridColumns,
                collection: this.collection,
                emptyText: "No Job Offers",
                footer: ActionFooter
            });
        },

        onRender: function () {
            var that = this;
            this.$el.find('.jobOffers-list').html(this.grid.render().el);

            this.collection.fetch({
                success: function (collection) {
                    that.$el.find(".offer-count").html("<b>Total Offers: " + collection.length + "</b>");
                }
            });
            this.showSecured();
        }
    });

    $.common.JobOffersForJobModalView = $.app.ItemView.extend({
        // loads a Modal of Job Offers for Job
        // Loads $.common.JobOffersForJobView with list of Interpreter Jobs for Job
        // ManageJobs - View Interpreter Offers
        template: "common/joboffers/modal",

        initialize: function () {
            this.$el.on('hidden', function () {
                // clear the wider modal class when view is hidden (closed)
                if (this.classList.contains("modal-wide")) {
                    this.classList.remove("modal-wide");
                }
            });
        },

        onRender: function () {
            // wider modal required for job offers
            // add custom class - overwrites modal css
            this.el.classList.add("modal-wide");
            var jobOffersTable = new $.common.JobOffersForJobView({
                el: $(".jobOffers-container"),
                collection: this.collection
            });
            jobOffersTable.render();
            this.showSecured();
        }
    });

    function cellByAttribute(attributeName) {
        return $.app.backgrid.GenericCell.extend({
            formatter: {
                fromRaw: function (rawData) {
                    return rawData ? rawData[attributeName] : '-';
                }
            }
        });
    }

    $.common.DailyJobsListView = $.app.BaseView.extend({

        tagName: "div",

        className: "name",

        template: JST["common/daily/jobslist"],

        initialize: function (options) {

            _.bindAll(this, 'render');

            this.collection.bind('sync', this.render);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        render: function () {

            $(this.el).html(this.template(_.extend({
                size: this.collection.size(),
                jobs: this.collection.toJSON()
            }, this.templateHelpers)));
            this.showSecured();

            return this;
        }

    });

    $.common.IvrRecordingView = $.app.ItemView.extend({

        template: "common/ivrrecording/recording",

        tagName: "span",

        initialize: function (options) {
            this.containerView = options.containerView;
            this.job = options.job;
            if (this.job) {
                this.job.bind('change:' + this.model.get("context"), this.render);
            }
        },

        events: {
            "click .play": "play"
        },

        onRender: function () {

            // reset events after remove / rerender
            this.delegateEvents();
            // find context and render
            this.containerView.$(".ivr-container-" + this.model.get("context")).append(this.el);

            this.$("[title]").tooltip({
                placement: "right"
            });
        },

        play: function (evt) {
            var recordingUrl = this.model.get("recordingUrl");
            var sound = new Howl({
                src: [recordingUrl],
                html5: true,
                volume: 1.0
            }).play();
        }
    });

    $.common.EditDocumentView = $.app.ItemView.extend({

        initialize: function () {
            _.extend(this, $.app.mixins.subviewContainerMixin);
            _.bindAll(this, 'synchModel');
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "change radio": "synchModel",
            "click #save": "saveValue"
        },

        className: "autoCompleteEdit",

        template: "common/document/edit",

        saveValue: function (evt) {
            var that = this;

            var docTypeId = that.model.get("type.id");
            var docTypeNameKey = getStatusAttributeById(App.dict.documentType, docTypeId, "nameKey");

            that.model.set("type.nameKey", docTypeNameKey);

            that.model.save().done(function () {
                that.trigger('save');
            }).fail(function () {
                handleActionError({
                    message: "An error was encountered saving the document. Please contact the administrator if the problem persists."
                });
            });
        }

    });

    $.common.AssociationSwitcherView = $.app.ItemView.extend({

        template: "common/association/associationswitcher",

        initialize: function () {

            _.extend(this, $.app.mixins.subviewContainerMixin);

            this.callback = this.options.callback;

            this.views = {
                customer: {
                    selector: '.customer-container',
                    view: new $.common.widget.customer.CustomerView({
                        model: this.model
                    })
                },
                client: {
                    selector: '.client-container',
                    view: new $.common.widget.customer.ClientView({
                        model: this.model
                    })
                },
                location: {
                    selector: '.location-container',
                    view: new $.common.widget.customer.LocationView({
                        model: this.model
                    })
                }
            };
        },

        events: {
            "click .action-refresh": function () {
                if (this.callback && _.isFunction(this.callback)) {
                    this.callback();
                }
            }
        },

        onRender: function () {

            this.renderSubviews();
        }

    });

    $.common.PriceQuoteView = $.app.ItemView.extend({

        initialize: function () {
            _.extend(this, $.app.mixins.subviewContainerMixin);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click #sendQuote": "sendQuote",
            "click #nowDateTime": "setNowDateTime"
        },

        className: "priceQuote",

        template: "common/booking/pricequote/show",

        setNowDateTime: function (evt) {
            this.model.set({
                bookingDate: new Date().toISOString(),
                timeZone: App.config.userData.timeZone,
                company: {
                    id: App.config.company.id
                }
            });

            this.render();
        },

        sendQuote: function (evt) {
            var that = this;

            that.model.save().done(function () {
                that.trigger('save');
            }).fail(function () {
                handleActionError({
                    message: "An error was encountered saving the booking. Please contact the administrator if the problem persists."
                });
            });
        },

        onRender: function () {
            this.formatElements();
            return this;
        }
    });

    $.common.JobUpdateShiftTimesConfirmationView = $.app.ItemView.extend({
        tagName: "div",

        className: "content",

        template: "job/modals/updateshifttimes",

        events: {
            "click #ok-update-shifts": "okAction",
            "change #update-shifts-checkbox": "synchModel"
        },

        okAction: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            // Close MUST be called before checkForBulkUpdate()
            this.close();

            this.options.checkForBulkUpdate();
            return false;
        },

        initialize: function () {
            this.$modalEl = $("#modalContainer");
        },

        onRender: function () {
            this.$modalEl.html(this.el);
            this.$modalEl.modal();

            this.callbacks(this.$el, this.model);
            this.showSecured();
            this.formatElements();
            return this;
        },

        onClose: function () {
            this.$modalEl.modal('hide');
        }
    });

    $.common.BookingCustomerRatePlanView = $.app.ItemView.extend({

        template: "common/booking/rateplan/customer/show",

        initialize: function () {

            // mixin actions to get assign action
            _.extend(this, $.app.mixins.visitActionsMixin);

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .clearCustomer": "clearCustomer"
        },

        clearCustomer: function () {
            this.model.set({
                "customerRatePlan": null
            });

            this.$el.find("#customerRatePlan").val("");
        },

        refreshPage: function () {
            var that = this;

            if (this.model.hasChanged("customerRatePlan")) {
                if (this.options.refresh) {
                    this.model.save({}, {
                        success: function (model, response) {
                            var url = App.config.context + "/booking/quote/" + that.model.get("jobContextId");
                            window.location.href = url;
                        },
                        error: popupHandleError
                    });
                }
            }
        },

        onRender: function () {
            var that = this;

            that.callbacks(that.el, that.model);
            that.formatElements();

            $.common.generateAutoComplete(that.$el.find("#customerRatePlan"), {
                url: "/api/company/rateplan",
                idAttr: 'id',
                displayAttr: 'name',
                attrToSet: 'customerRatePlan',
                searchProperty: 'name',
                otherProperties: [{
                    "field": "active",
                    "op": "eq",
                    "data": "true"
                }, {
                    "field": "override",
                    "op": "eq",
                    "data": "false"
                }, {
                    "field": "type.id",
                    "op": "eq",
                    "data": "2"
                }]
            }, that.model);

            that.listenTo(that.model, 'change', that.refreshPage);
        }
    });

    $.common.BookingAppliedRatePlanView = $.app.ItemView.extend({

        template: "common/booking/rateplan/applied/show",

        initialize: function () {

            // mixin actions to get assign action
            _.extend(this, $.app.mixins.visitActionsMixin);

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        onRender: function () {
            var that = this;

            that.callbacks(that.el, that.model);
            that.formatElements();
        }
    });

    $.common.BookingContactRatePlanView = $.app.ItemView.extend({

        template: "common/booking/rateplan/contact/show",

        initialize: function () {

            // mixin actions to get assign action
            _.extend(this, $.app.mixins.visitActionsMixin);

            _.bindAll(this, 'error', 'invalid');
            this.model.bind('error', this.error);
            this.model.bind('invalid', this.invalid);
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .clearContact": "clearContact"
        },

        clearContact: function () {
            this.model.set({
                "contactRatePlan": null
            });

            this.$el.find("#contactRatePlan").val("");
        },

        refreshPage: function () {
            var that = this;

            if (this.model.hasChanged("contactRatePlan")) {
                if (this.options.refresh) {
                    this.model.save({}, {
                        success: function (model, response) {
                            var url = App.config.context + "/booking/quote/" + that.model.get("jobContextId");
                            window.location.href = url;
                        },
                        error: popupHandleError
                    });
                }
            }
        },

        onRender: function () {
            var that = this;

            that.callbacks(that.el, that.model);
            that.formatElements();

            $.common.generateAutoComplete(that.$el.find("#contactRatePlan"), {
                url: "/api/company/rateplan",
                idAttr: 'id',
                displayAttr: 'name',
                attrToSet: 'contactRatePlan',
                searchProperty: 'name',
                otherProperties: [{
                    "field": "active",
                    "op": "eq",
                    "data": "true"
                }, {
                    "field": "override",
                    "op": "eq",
                    "data": "false"
                }, {
                    "field": "type.id",
                    "op": "eq",
                    "data": "1"
                }]
            }, that.model);

            that.listenTo(that.model, 'change', that.refreshPage);
        }
    });

    $.common.EditRatePlanAssociationView = $.app.ItemView.extend({

        initialize: function () {
            _.extend(this, $.app.mixins.subviewContainerMixin);
        },

        events: {
            "click #save": "saveValue"
        },

        className: "ratePlanAssociationEdit",

        template: "common/rateplanassociation/edit",

        saveValue: function (evt) {
            var that = this;
            var activeStartDate = that.$el.find("#activeStartDate").val();
            var activeEndDate = that.$el.find("#activeEndDate").val();

            if (activeStartDate && activeEndDate && Date.parse(activeStartDate) >= Date.parse(activeEndDate)) {
                alert("Start date must be before end date.");
                return;
            }

            that.model.set({
                activeStartDate: that.$el.find("#activeStartDate").val(),
                activeEndDate: that.$el.find("#activeEndDate").val()
            });

            that.model.save().done(function () {
                that.trigger('save');
            }).fail(function () {
                popupHandleActionError({
                    message: "Rate Plan active dates can't overlap. An active rate plan already exists for the given date range."
                });
            });
        },

        onRender: function () {
            dateSearchInit(this.$el.find(".date"));
        }

    });

    $.common.ActiveRatePlansContainer = $.app.BaseView.extend({
        tagname: "div",

        template: JST["common/rateplancontainer/list"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'renderActiveRatePlanView');
            this.collection.bind('add', this.renderActiveRatePlanView);
            this.customer = this.options.customer;
            this.contact = this.options.contact;
        },

        renderActiveRatePlanView: function (item) {
            var ratePlanView = new $.common.ActiveRatePlanView({
                model: item,
                parentView: this,
                association: item
            });

            this.$(".active-rateplans").append(ratePlanView.render().el);

            this.showSecured();

            return this;
        },

        render: function () {
            this.$el.append(this.template({}));
            return this;
        }
    });

    $.common.ActiveRatePlanView = $.app.BaseView.extend({

        template: JST["common/rateplancontainer/item"],

        initialize: function (options) {
            this.model.bind('invalid', this.invalid, this);
            this.model.bind('error', this.error, this);

            this.parentView = options.parentView;
            this.association = options.association;
        },

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel"
        },

        render: function () {
            var that = this;
            this.$el.html(this.template(_.extend({
                obj: this.model.toJSON()
            }, this.templateHelpers)));

            var view = new $.common.RatePlanSummaryView({
                el: that.$el.find(".rateplan"),
                model: that.model.get('ratePlan'),
                association: that.association
            });
            view.render();

            this.callbacks(this.el, this.model);
            return this;
        }

    });

    // feedback view - rating & comments
    $.common.FeedbackView = $.app.ItemView.extend({
        template: JST['booking/feedback/show'],

        render: function () {
            //render the view
            this.$el.html(this.template(this.model.toJSON()));

            this.callbacks(this.el, this.model);

            var that = this;

            //initialize rating
            this.$("#rating").raty({
                path: App.config.context + '/js/raty/jquery.raty-1.3.2/img/',
                half: true,
                start: that.model.get("averageRating") ? that.model.get("averageRating") : 0,
                size: 24,
                starHalf: 'star-half-big.png',
                starOff: 'star-off-big.png',
                starOn: 'star-on-big.png',
                hintList: ['bad', 'poor', 'regular', 'good', 'excellent'],
                noRatedMsg: 'not rated yet',
                number: 5,
                click: function (score) {
                    $.ajax({
                        url: App.config.context + '/rateable/rate/' + that.model.id,
                        dataType: 'html',
                        data: {
                            type: 'booking',
                            xhr: true,
                            rating: score,
                            active: true
                        },
                        success: function (doc) {
                            var avg = doc.substring(0, doc.indexOf(","));

                            that.$("#rating-scr").html("(" + avg + "/5)");
                            that.model.set({
                                averageRating: avg
                            }, {
                                silent: true
                            });
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log("ERROR");
                        }
                    });
                }
            });

            var comments = new $.core.CommentCollection([], {
                parentEntityType: "superBooking",
                parentEntityId: !this.model.isNew() ? this.model.get("superBooking").id : null
            });
            var commentsView = new $.common.CommentsView({
                el: this.$("#comments"),
                model: this.model,
                collection: comments,
                parentEntityType: function () {
                    return "superBooking";
                },
                parentEntityId: function () {
                    return that.model.get("superBooking").id;
                },
                display: "booking"
            });

            commentsView.render();

            return this;
        }
    });

})(jQuery);
