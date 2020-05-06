/*
 * Copyright (C) 2012 No Good Software, Inc. <conor@nogoodsoftware.com>
 *
 * <copyright notice>
 */
(function ($) {

    // namespace for application configuration models
    $.config = {};

    // model definitions ////////////////////////////////////////////////////////

    // company config
    /*
     $.config.CompanyConfig = Backbone.Model.extend({
     defaults: App.dict.defaults.companyConfig,
     url: function() {
     return this.id ? App.config.context + '/api/company/config/' + this.id : App.config.context + '/api/company/config';
     }
     });
     */

    //customer config
    $.config.CustomerConfig = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.customerConfig,
        url: function () {
            if (this.id) {
                //return App.config.context + '/api/customer/config/' + this.id + '.json';
                return App.config.context + '/api/company/' + App.config.company.id + '/customer/' + this.get("customer.id") + '/config/' + this.id;
            } else {
                return App.config.context + '/api/company/' + App.config.company.id + '/customer/' + this.get("customer.id") + '/config';
            }
            /* else {
             return App.config.context + '/api/customer/config';
             }  */
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'referenceCodes',
            relatedModel: '$.core.ReferenceCodeConfig'
        }, {
            type: Backbone.HasMany,
            key: 'allReferenceCodes',
            relatedModel: '$.core.ReferenceCodeConfig'
        }, {
            type: Backbone.HasMany,
            key: 'criteria',
            relatedModel: '$.config.CustomerCriteriaConfig'
        }],
        validate: function (attrs) {
            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (attrs.bookingCreateFreezeHours === "") {
                err.errors.push({
                    field: "bookingCreateFreezeHours",
                    rejectedValue: "Blank",
                    message: "Please input a amount of time for the booking create freeze period."
                });
            } else {
                attrs.bookingCreateFreezeHours = parseInt(attrs.bookingCreateFreezeHours, 10);
                if (_.isNaN(attrs.bookingCreateFreezeHours)) {
                    err.errors.push({
                        field: "bookingCreateFreezeHours",
                        rejectedValue: "Blank",
                        message: "The booking create freeze period must be a number."
                    });
                }
                if (attrs.bookingCreateFreezeHours < 0) {
                    err.errors.push({
                        field: "bookingCreateFreezeHours",
                        rejectedValue: "Blank",
                        message: "The booking create freeze period must be non negative."
                    });
                }
            }

            if (attrs.bookingEditFreezeHours === "") {
                err.errors.push({
                    field: "bookingEditFreezeHours",
                    rejectedValue: "Blank",
                    message: "Please input a amount of time for the booking edit freeze period."
                });
            } else {
                attrs.bookingEditFreezeHours = parseInt(attrs.bookingEditFreezeHours, 10);
                if (_.isNaN(attrs.bookingEditFreezeHours)) {
                    err.errors.push({
                        field: "bookingEditFreezeHours",
                        rejectedValue: "Blank",
                        message: "The booking edit freeze period must be a number."
                    });
                }
                if (attrs.bookingEditFreezeHours < 0) {
                    err.errors.push({
                        field: "bookingEditFreezeHours",
                        rejectedValue: "Blank",
                        message: "The booking edit freeze period must be non negative."
                    });
                }
            }

            //validate contact types
            $.common.validateCollection(this.get("referenceCodes"), err);
            //validate languages
            $.common.validateCollection(this.get("criteria"), err);

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });



    // criteria configuration for customers
    $.config.CustomerCriteriaConfig = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.customerCriteriaConfig,
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["criteria.id"]) {
                err.errors.push({
                    field: "criteria.id",
                    rejectedValue: "Blank",
                    message: "Please select a criteria or qualification."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // criteria configuration for reference code auto complete
    $.config.AutoCompleteCriteriaConfig = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.autoCompleteCriteriaConfig,
        url: function () {

            var autoCompleteId = this.get("autoComplete.id");

            return this.id ? App.config.context + '/api/referenceCodeAutoComplete/' + autoCompleteId + '/autoCompleteCriteriaConfig/' + this.id : App.config.context + '/api/referenceCodeAutoComplete/' + autoCompleteId + '/autoCompleteCriteriaConfig';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.criteria || !attrs.criteria.id) {
                err.errors.push({
                    field: "criteria",
                    rejectedValue: "Blank",
                    message: "Please select a criteria or qualification."
                });
            }

            if (err.errors.length > 0) {
                return err;
            }
        }
    });

    $.config.AutoCompleteCriteriaConfigCollection = $.core.BaseCollection.extend({
        model: $.config.AutoCompleteCriteriaConfig,
        initialize: function (models, options) {
            this['autoComplete.id'] = options ? options["autoComplete.id"] : null;
        },
        url: function () {

            if (this['autoComplete.id']) {

                return App.config.context + '/api/referenceCodeAutoComplete/' + this['autoComplete.id'] + '/autoCompleteCriteriaConfig';

            } else {

                return App.config.context + '/api/autoCompleteCriteriaConfig';
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

    $.config.AutoCompleteReferenceCodeConfig = Backbone.Model.extend({
        defaults: App.dict.defaults.referenceCodeConfig,
        url: function () {

            var autoCompleteId = this.get("autoComplete.id");

            return this.id ? App.config.context + '/api/referenceCodeAutoComplete/' + autoCompleteId + '/referenceCodeConfig/' + this.id : App.config.context + '/api/referenceCodeAutoComplete/' + autoCompleteId + '/referenceCodeConfig';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "id",
                    rejectedValue: "Blank",
                    message: "Please select a reference code."
                });
            }

            if (err.errors.length > 0) {
                return err;
            }
        }
    });

    $.config.AutoCompleteReferenceCodeConfigCollection = $.core.BaseCollection.extend({
        model: $.config.AutoCompleteReferenceCodeConfig,
        initialize: function (models, options) {
            this['autoComplete.id'] = options ? options["autoComplete.id"] : null;
        },
        url: function () {

            if (this['autoComplete.id']) {

                return App.config.context + '/api/referenceCodeAutoComplete/' + this['autoComplete.id'] + '/referenceCodeConfig';

            } else {

                return App.config.context + '/api/referenceCodeConfig';
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

    // vos template
    $.config.VosTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.vosTemplate,
        url: function () {
            var customerId = this.get("customer.id");
            var companyId = this.get("company.id");

            if (customerId) {
                return this.id ? App.config.context + '/api/customer/' + customerId + '/template/vos/' + this.id : App.config.context + '/api/customer/' + customerId + '/template/vos';
            } else {
                return this.id ? App.config.context + '/api/company/' + companyId + '/template/vos/' + this.id : App.config.context + '/api/company/' + companyId + '/template/vos';
            }
        }
    });

    // Invoice template
    $.config.InvoiceTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.invoiceTemplate,
        url: function () {
            var customerId = this.get("customer.id");
            var companyId = this.get("company.id");

            if (customerId) {
                return this.id ? App.config.context + '/api/customer/' + customerId + '/template/invoice/' + this.id : App.config.context + '/api/customer/' + customerId + '/template/invoice';
            } else {
                return this.id ? App.config.context + '/api/company/' + companyId + '/template/invoice/' + this.id : App.config.context + '/api/company/' + companyId + '/template/invoice';
            }
        }
    });

    // Invoice Credit Memo template
    $.config.InvoiceCreditMemoTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.invoiceCreditMemoTemplate,
        url: function () {
            var companyId = this.get("company.id");
            return this.id ? App.config.context + '/api/company/' + companyId + '/template/invoiceCreditMemo/' + this.id : App.config.context + '/api/company/' + companyId + '/template/invoiceCreditMemo';
        }
    });

    // Payment Template
    $.config.PaymentTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.paymentTemplate,
        url: function () {
            var contactId = this.get("contact.id");
            var companyId = this.get("company.id");

            if (contactId) {
                return this.id ? App.config.context + '/api/contact/' + contactId + '/template/payment/' + this.id : App.config.context + '/api/contact/' + contactId + '/template/payment';
            } else {
                return this.id ? App.config.context + '/api/company/' + companyId + '/template/payment/' + this.id : App.config.context + '/api/company/' + companyId + '/template/payment';
            }
        }
    });

    // Payment Credit Memo template
    $.config.PaymentCreditMemoTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.paymentCreditMemoTemplate,
        url: function () {
            var companyId = this.get("company.id");
            return this.id ? App.config.context + '/api/company/' + companyId + '/template/paymentCreditMemo/' + this.id : App.config.context + '/api/company/' + companyId + '/template/paymentCreditMemo';
        }
    });

    // Customer Quotation template
    $.config.CustomerQuotationTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.customerQuotationTemplate,
        url: function () {
            var companyId = this.get("company.id");
            return this.id ? App.config.context + '/api/company/' + companyId + '/template/customerquotation/' + this.id : App.config.context + '/api/company/' + companyId + '/template/customerquotation';
        }
    });

    // Contact Quotation template
    $.config.ContactQuotationTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.contactQuotationTemplate,
        url: function () {
            var companyId = this.get("company.id");
            return this.id ? App.config.context + '/api/company/' + companyId + '/template/contactquotation/' + this.id : App.config.context + '/api/company/' + companyId + '/template/contactquotation';
        }
    });

    // Contact Quotation template
    $.config.OfferedJobViewTemplate = Backbone.Model.extend({
        defaults: App.dict.defaults.offeredJobViewTemplate,
        url: function () {
            var companyId = this.get("company.id");
            return this.id ? App.config.context + '/api/company/' + companyId + '/template/offeredjobview/' + this.id : App.config.context + '/api/company/' + companyId + '/template/offeredjobview';
        }
    });

    // hierarchy node address
    $.config.HierarchyNodeAddress = Backbone.Model.extend({
        defaults: App.dict.defaults.hierarchyNodeAddress,
        url: function () {

            // /api/hierarchy/${hierarchyId}/node/${nodeId}/location
            var hierarchy = this.get("hierarchy.id");
            var node = this.get("node.id");
            var location = this.get("location.id");

            /*if (node) {
             return App.config.context + '/api/hierarchy/' + hierarchy + '/node/location/' + node;
             } else if (location) {
             return App.config.context + '/api/hierarchy/' + hierarchy + '/node/location/' + this.id;
             } else {

             }*/
            //new object entirely
            return App.config.context + '/api/hierarchy/' + hierarchy + '/node/location';

        }
    });

    // hierarchy node address collection
    $.config.HierarchyNodeAddressCollection = Backbone.Collection.extend({
        model: $.config.HierarchyNodeAddress,
        initialize: function (models, options) {
            this['hierarchy.id'] = options['hierarchy.id'];
            this['node.id'] = options['node.id'];
            this['location.id'] = options['loction.id'];
        },
        url: function () {

            if (this['node.id']) {
                return App.config.context + '/api/hierarchy/' + this["hierarchy.id"] + '/node/' + this["node.id"] + '/location';
            } else {
                return App.config.context + '/api/company/' + this["hierarchy.id"] + '/location/' + this["location.id"] + '/node';
            }
        },
        fetch: preFetchInjectFilter
    });




    // collections ////////////////////////////////////////////////////////


})(jQuery);
