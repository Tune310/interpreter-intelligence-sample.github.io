/*
 * Copyright (C) 2012 No Good Software, Inc. <conor@nogoodsoftware.com>
 *
 * <copyright notice>
 */

(function ($) { //# sourceURL=app/finance.js

    /* enable strict mode */
    "use strict";

    // namespace for financial models
    $.finance = {};

    // model definitions ////////////////////////////////////////////////////////

    // segments making up rate zone
    $.finance.RateZoneSegment = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.rateZoneSegment,
        url: function () {
            return this.id ? App.config.context + '/api/company/zone/segment/' + this.id : App.config.context + '/api/company/zone/segment';
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["day.id"] && !attrs.date) {
                err.errors.push({
                    field: "day.id",
                    rejectedValue: "Blank",
                    message: "Select either a specific day or date"
                });
                err.errors.push({
                    field: "date",
                    rejectedValue: "Blank",
                    message: "Select either a specific day or date"
                });
            }
            if (!attrs.allDay && !(attrs.startHour && attrs.startMinute && attrs.endHour && attrs.endMinute)) {
                err.errors.push({
                    field: "allDay",
                    rejectedValue: "Blank",
                    message: "Select either all day or enter a specific time."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // zones making up a group
    $.finance.RateZone = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.rateZone,
        url: function () {
            return this.id ? App.config.context + '/api/company/zone/' + this.id : App.config.context + '/api/company/zone';
        },
        //urlRoot: App.config.context + '/api/company/zone',
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'segments',
            relatedModel: '$.finance.RateZoneSegment',
            reverseRelation: {
                key: 'rateZone.id',
                includeInJSON: 'id'
            }
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
                    message: "Rate zone name is required"
                });
            }
            if (!attrs.description) {
                err.errors.push({
                    field: "description",
                    rejectedValue: "Blank",
                    message: "Rate zone description is required."
                });
            }

            if (attrs.overnightNightEnabled) {

                if (!attrs.overnightName) {
                    err.errors.push({
                        field: "overnightName",
                        rejectedValue: "Blank",
                        message: "Overnight rate zone name is required"
                    });
                }
                if (!attrs.overnightDescription) {
                    err.errors.push({
                        field: "overnightDescription",
                        rejectedValue: "Blank",
                        message: "Overnight rate zone description is required."
                    });
                }

                if (!attrs.nightName) {
                    err.errors.push({
                        field: "nightName",
                        rejectedValue: "Blank",
                        message: "Night rate zone name is required"
                    });
                }
                if (!attrs.nightDescription) {
                    err.errors.push({
                        field: "nightDescription",
                        rejectedValue: "Blank",
                        message: "Night rate zone description is required."
                    });
                }
            }

            if (!attrs["type.id"]) {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Rate zone type is required."
                });
            }

            var segs = this.get("segments");

            /*
            if (!segs || segs.models.length === 0) {
                err.errors.push({field: "segments", rejectedValue: "Blank", message: "You must enter at least one rate zone segment."});
            }
            */

            //validate ratezones
            $.common.validateCollection(this.get("segments"), err);

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

            cl.set("segments", new Backbone.Collection());

            // clone each of the relational models
            var segments = this.get("segments");
            _.each(segments.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("segments").push(c);
            });

            return cl;

        }
    });

    // complete definition of rate zones
    $.finance.RateZoneGroup = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.rateZoneGroup,
        url: function () {
            return this.id ? App.config.context + '/api/company/group/zone/' + this.id : App.config.context + '/api/company/group/zone';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'zones',
            relatedModel: '$.finance.RateZone',
            reverseRelation: {
                key: 'rateZoneGroup.id',
                includeInJSON: 'id'
            }
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
                    message: "Rate zone group name is required"
                });
            }
            if (!attrs.description) {
                err.errors.push({
                    field: "description",
                    rejectedValue: "Blank",
                    message: "Please enter a description."
                });
            }

            //validate config
            //attrs.config.validate(config.attributes);
            var zs = this.get("zones");

            if (!zs || zs.models.length === 0) {
                err.errors.push({
                    field: "zones",
                    rejectedValue: "Blank",
                    message: "You must enter at least one rate zone."
                });
            }
            //validate ratezones
            $.common.validateCollection(this.get("zones"), err);

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

            cl.set("zones", new Backbone.Collection());

            // clone each of the relational models
            var zones = this.get("zones");
            _.each(zones.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("zones").push(c);
            });

            return cl;

        }
    });

    // customer:rate zone group
    $.finance.CustomerRateZoneGroup = Backbone.Model.extend({
        defaults: App.dict.defaults.customerRateZoneGroup,
        url: function () {
            var baseUrl;
            var rpUrl;

            if (this.get("customer")) {
                baseUrl = App.config.context + '/api/customer/' + this.get("customer").id + '/ratezone';
            } else {
                baseUrl = App.config.context + '/api/customer/ratezone';
            }
            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });

    // contact:rate zone group
    $.finance.ContactRateZoneGroup = Backbone.Model.extend({
        defaults: App.dict.defaults.contactRateZoneGroup,
        url: function () {
            var baseUrl;
            var rpUrl;

            if (this.get("contact")) {
                baseUrl = App.config.context + '/api/contact/' + this.get("contact").id + '/ratezone';
            } else {
                baseUrl = App.config.context + '/api/contact/ratezone';
            }
            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });

    // rate plan model
    $.finance.RatePlan = Backbone.RelationalModel.extend({

        initialize: function (attributes, options) {

            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.entities = [
                "company"
            ];

        },

        defaults: App.dict.defaults.ratePlan,
        url: function () {
            return this.id ? App.config.context + '/api/company/rateplan/' + this.id : App.config.context + '/api/company/rateplan';
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'cancelFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'deductions',
            relatedModel: '$.finance.Deduction'
        }, {
            type: Backbone.HasMany,
            key: 'miscellaneousFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'languageTiers',
            relatedModel: '$.finance.LanguageTier'
        }, {
            type: Backbone.HasMany,
            key: 'regions',
            relatedModel: '$.finance.RatePlanRegion'
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
                    message: "Rate plan name is required"
                });
            }
            if (!attrs.description) {
                err.errors.push({
                    field: "description",
                    rejectedValue: "Blank",
                    message: "Please enter a description."
                });
            }
            if (!attrs["type.id"]) {
                err.errors.push({
                    field: "type.id",
                    rejectedValue: "Blank",
                    message: "Rate plan type is required."
                });
            }
            if ((!attrs.mileage && attrs.mileage != "0") || !isNumber(attrs.mileage)) {
                err.errors.push({
                    field: "mileage",
                    rejectedValue: "Blank",
                    message: "Mileage is required and must be a number."
                });
            }
            if ((!attrs.mileageThreshold && attrs.mileageThreshold != "0") || !isNumber(attrs.mileageThreshold)) {
                err.errors.push({
                    field: "mileageThreshold",
                    rejectedValue: "Blank",
                    message: "Mileage threshold is required and must be a number."
                });
            }
            if (attrs.minMileage && !isNumber(attrs.minMileage)) {
                err.errors.push({
                    field: "minMileage",
                    rejectedValue: "Blank",
                    message: "Minimum mileage threshold must be a number."
                });
            }
            if (attrs.maxMileage && !isNumber(attrs.maxMileage)) {
                err.errors.push({
                    field: "maxMileage",
                    rejectedValue: "Blank",
                    message: "Maximum mileage threshold must be a number."
                });
            }

            if ((!attrs.unitIncInPerson && attrs.unitIncInPerson == "0") || !isNumber(attrs.unitIncInPerson)) {
                err.errors.push({
                    field: "unitIncInPerson",
                    rejectedValue: "Blank",
                    message: "Unit increment in person must be a number greater than zero."
                });
            }
            if (App.config.company.config.phoneEnabled) {
                if ((!attrs.unitIncPhone && attrs.unitIncPhone == "0") || !isNumber(attrs.unitIncPhone)) {
                    err.errors.push({
                        field: "unitIncPhone",
                        rejectedValue: "Blank",
                        message: "Unit increment phone must be a number greater than zero."
                    });
                }
            }

            if (App.config.company.config.videoEnabled) {
                if ((!attrs.unitIncVideo && attrs.unitIncVideo == "0") || !isNumber(attrs.unitIncVideo)) {
                    err.errors.push({
                        field: "unitIncVideo",
                        rejectedValue: "Blank",
                        message: "Unit increment video must be a number greater than zero."
                    });
                }
            }


            //validate fees
            $.common.validateCollection(this.get("cancelFees"), err);
            //validate language tiers
            $.common.validateCollection(this.get("languageTiers"), err);
            //validate deductions
            $.common.validateCollection(this.get("deductions"), err);
            //validate miscellaneous fees
            $.common.validateCollection(this.get("miscellaneousFees"), err);
            //validate regions
            $.common.validateCollection(this.get("regions"), err);


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

            cl.set("cancelFees", new Backbone.Collection());

            // clone each of the relational models
            var cancelFees = this.get("cancelFees");
            _.each(cancelFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("cancelFees").push(c);
            });

            cl.set("deductions", new Backbone.Collection());

            var deductions = this.get("deductions");
            _.each(deductions.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("deductions").push(c);
            });

            cl.set("miscellaneousFees", new Backbone.Collection());

            // clone each of the relational models
            var miscellaneousFees = this.get("miscellaneousFees");
            _.each(miscellaneousFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("miscellaneousFees").push(c);
            });

            cl.set("languageTiers", new Backbone.Collection());

            var languageTiers = this.get("languageTiers");
            _.each(languageTiers.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("languageTiers").push(c);
            });

            cl.set("regions", new Backbone.Collection());

            var regions = this.get("regions");
            _.each(regions.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("regions").push(c);
            });

            return cl;

        }
    });

    // fee model
    $.finance.Fee = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.fee,
        url: function () {
            /* no individual save */
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["feeType.id"]) {
                err.errors.push({
                    field: "feeType.id",
                    rejectedValue: "Blank",
                    message: "Fee type is required"
                });
            }

            if (!attrs["chargeType.id"]) {
                err.errors.push({
                    field: "chargeType.id",
                    rejectedValue: "Blank",
                    message: "Charge type is required."
                });
            }

            // validation for non rate based fee
            if (attrs["chargeType.id"] != App.dict.chargeType.rate.id) {

                if ((!attrs.chargeRate || !isNumber(attrs.chargeRate))) {
                    err.errors.push({
                        field: "chargeRate",
                        rejectedValue: "Blank",
                        message: "Charge rate is required and must be a number."
                    });
                }

            } else if (attrs["chargeType.id"] == App.dict.chargeType.rate.id) {

                // fees where "rate" is selected for fee type, must either have the charge rate or rate zone set
                if (!attrs["rateZone.id"] && (!attrs.chargeRate || !isNumber(attrs.chargeRate))) {

                    err.errors.push({
                        field: "chargeRate",
                        rejectedValue: "Blank",
                        message: "Either fee rate or rate zone must be selected for this fee type. Charge rate is required and must be a number."
                    });

                    err.errors.push({
                        field: "rateZone.id",
                        rejectedValue: "Blank",
                        message: "Either fee rate or rate zone must be selected for this fee type. Rate zone is required."
                    });
                }
            }

            if ((attrs["feeType.id"] == App.dict.feeType.misc.id || attrs["feeType.id"] == App.dict.feeType.custom.id) && (!attrs.name)) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Fee name is required."
                });
            }

            if (attrs["feeType.id"] != App.dict.feeType.misc.id && attrs["feeType.id"] != App.dict.feeType.custom.id && (!isNumber(attrs.period) && attrs.period != '0')) {
                err.errors.push({
                    field: "period",
                    rejectedValue: "Blank",
                    message: "Period in hours is required and must be a number."
                });
            }

            if (attrs["feeType.id"] != App.dict.feeType.misc.id && attrs["feeType.id"] != App.dict.feeType.custom.id && !attrs["periodRule.id"]) {
                err.errors.push({
                    field: "periodRule.id",
                    rejectedValue: "Blank",
                    message: "Period rule is required."
                });
            }

            if (attrs["feeType.id"] != App.dict.feeType.misc.id && attrs["feeType.id"] != App.dict.feeType.custom.id && (!attrs.precedence || !isNumber(attrs.precedence))) {
                err.errors.push({
                    field: "precedence",
                    rejectedValue: "Blank",
                    message: "Precedence is required and must be a number."
                });
            }

            if (attrs["feeType.id"] == App.dict.feeType.custom.id) {
                if (!attrs["customizedFeeTemplate.id"]) {
                    err.errors.push({
                        field: "customizedFeeTemplate.id",
                        rejectedValue: "Blank",
                        message: "Custom Fee Template is required."
                    });
                }

                if (attrs["customizedFeeTemplate.id"]) {
                    var customizedTemplate = App.dict.customizedFeeTemplate[attrs["customizedFeeTemplate.id"]];
                    var templateParams = customizedTemplate.parameters;
                    var counter = 1;

                    if (templateParams) {
                        var params = templateParams.split(",");
                        _.each(params, function (param) {
                            var paramName = "parameter" + counter;
                            if (!attrs[paramName]) {
                                err.errors.push({
                                    field: paramName,
                                    rejectedValue: "Blank",
                                    message: param.trim() + " is required"
                                });
                            }
                            counter++;
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

    // fee model
    $.finance.Deduction = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.deduction,
        url: function () {
            alert("helpfee"); /* no individual save */
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.name) {
                err.errors.push({
                    field: "name",
                    rejectedValue: "Blank",
                    message: "Name is required"
                });
            }
            if (!attrs["chargeType.id"]) {
                err.errors.push({
                    field: "chargeType.id",
                    rejectedValue: "Blank",
                    message: "Deduction type is required."
                });
            }
            if ((!attrs.chargeRate || !isNumber(attrs.chargeRate))) {
                err.errors.push({
                    field: "chargeRate",
                    rejectedValue: "Blank",
                    message: "Deduction rate is required and must be a number."
                });
            }

            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // language tier model
    $.finance.LanguageTier = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.languageTier,
        url: function () {
            alert("here"); /* no individual save */
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'premiums',
            relatedModel: '$.finance.PremiumTier'
        }, {
            type: Backbone.HasMany,
            key: 'rushFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'miscellaneousFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'cancelFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'languages',
            relatedModel: '$.finance.Language'
        }, {
            type: Backbone.HasMany,
            key: 'languageServices',
            relatedModel: '$.finance.ServiceTier'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.baseTier) {

                // at least one language
                var ls = this.get("languages") || attrs.languages; // after save, validate is called with JSON so collection is not present
                if (!ls || (_.isArray(ls) && ls.length === 0) || (!_.isUndefined(ls.models) && ls.models.length === 0)) {
                    err.errors.push({
                        field: "languages",
                        rejectedValue: "Blank",
                        message: "You must enter at least one language."
                    });
                }

                //validate languages
                $.common.validateCollection(this.get("languages"), err);

            }

            // validate cancel fees
            $.common.validateCollection(this.get("cancelFees"), err);
            // validate rush fees
            $.common.validateCollection(this.get("rushFees"), err);
            // validate miscellaneous fees
            $.common.validateCollection(this.get("miscellaneousFees"), err);
            // validate premiums
            $.common.validateCollection(this.get("premiums"), err);
            // validate services
            $.common.validateCollection(this.get("languageServices"), err);


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },
        clone: function () {

            // NOTE: the languages relation is copied rather than cloned to get the desired behavior of copying the rate plan

            // call clone on backbone relational
            var cl = Backbone.RelationalModel.prototype.clone.apply(this);

            cl.set("languages", new Backbone.Collection());

            // clone each of the relational models
            var languages = this.get("languages");
            _.each(languages.models, function (m) {

                // push same language
                cl.get("languages").push(m);
            });

            cl.set("cancelFees", new Backbone.Collection());

            var cancelFees = this.get("cancelFees");
            _.each(cancelFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("cancelFees").push(c);
            });

            cl.set("rushFees", new Backbone.Collection());

            var rushFees = this.get("rushFees");
            _.each(rushFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("rushFees").push(c);
            });

            cl.set("miscellaneousFees", new Backbone.Collection());

            var miscFees = this.get("miscellaneousFees");
            _.each(miscFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("miscellaneousFees").push(c);
            });

            cl.set("premiums", new Backbone.Collection());

            var premiums = this.get("premiums");
            _.each(premiums.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("premiums").push(c);
            });

            cl.set("languageServices", new Backbone.Collection());

            var languageServices = this.get("languageServices");
            _.each(languageServices.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("languageServices").push(c);
            });


            return cl;
        }
    });

    // language model on language tier
    $.finance.Language = Backbone.RelationalModel.extend({
        defaults: {
            id: null
        },
        url: function () {
            /* no individual save */
        },
        idAttribute: 'id',
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs.id) {
                err.errors.push({
                    field: "language-select",
                    rejectedValue: "Blank",
                    message: "Language required"
                });
            }


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // rate plan - region association
    $.finance.RatePlanRegion = Backbone.RelationalModel.extend({
        defaults: {
            id: null
        },
        url: function () {
            /* no individual save */
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
                    message: "Region is required"
                });
            }


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        }
    });

    // premium tier model
    $.finance.PremiumTier = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.premiumTier,
        url: function () {
            alert("premium tier"); /* no individual save */
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'rushFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'miscellaneousFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'cancelFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'premiumServices',
            relatedModel: '$.finance.ServiceTier'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["criteria.id"]) {
                err.errors.push({
                    field: "criteria.id",
                    rejectedValue: "Blank",
                    message: "Premium criteria is required"
                });
            }

            // validate cancel fees
            $.common.validateCollection(this.get("cancelFees"), err);
            // validate rush fees
            $.common.validateCollection(this.get("rushFees"), err);
            // validate miscellaneous fees
            $.common.validateCollection(this.get("miscellaneousFees"), err);
            // validate services
            $.common.validateCollection(this.get("premiumServices"), err);


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },

        clone: function () {

            // NOTE: the fees relation is copied rather than cloned to get the desired behavior of copying the rate plan

            // call clone on backbone relational
            var cl = Backbone.RelationalModel.prototype.clone.apply(this);

            cl.set("rushFees", new Backbone.Collection());

            var rushFees = this.get("rushFees");
            _.each(rushFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("rushFees").push(c);
            });

            cl.set("miscellaneousFees", new Backbone.Collection());

            var miscFees = this.get("miscellaneousFees");
            _.each(miscFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("miscellaneousFees").push(c);
            });

            cl.set("cancelFees", new Backbone.Collection());

            var cancelFees = this.get("cancelFees");
            _.each(cancelFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("cancelFees").push(c);
            });

            cl.set("premiumServices", new Backbone.Collection());

            var premiumServices = this.get("premiumServices");
            _.each(premiumServices.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("premiumServices").push(c);
            });

            return cl;
        }
    });

    $.finance.ServiceTier = Backbone.RelationalModel.extend({
        defaults: App.dict.defaults.serviceTier,
        url: function () {
            alert("service tier"); /* no individual save */
        },
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'rushFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'miscellaneousFees',
            relatedModel: '$.finance.Fee'
        }, {
            type: Backbone.HasMany,
            key: 'cancelFees',
            relatedModel: '$.finance.Fee'
        }],
        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red on the form and try again.";
            err.errors = [];

            if (!attrs["service.id"] || attrs["service.id"] === "") {
                err.errors.push({
                    field: "service",
                    rejectedValue: "Blank",
                    message: "Service type is required"
                });
            }
            if (((!attrs.standard && attrs.standard !== 0) || !isNumber(attrs.standard))) {
                err.errors.push({
                    field: "standard",
                    rejectedValue: "Blank",
                    message: "Standard rate is required and must be a number."
                });
            }
            if (!(attrs.minHoursStandard && isNumber(attrs.minHoursStandard) && attrs.minHoursStandard > 0)) {
                err.errors.push({
                    field: "minHoursStandard",
                    rejectedValue: "Blank",
                    message: "Minimum duration standard is required and must be a number greater than zero."
                });
            }
            if (((!attrs.premium && attrs.premium !== 0) || !isNumber(attrs.premium))) {
                err.errors.push({
                    field: "premium",
                    rejectedValue: "Blank",
                    message: "Premium is required and must be a number."
                });
            }
            if (!(attrs.minHoursPremium && isNumber(attrs.minHoursPremium) && attrs.minHoursPremium > 0)) {
                err.errors.push({
                    field: "minHoursPremium",
                    rejectedValue: "Blank",
                    message: "Minimum hours premium is required and must be a number greater than zero."
                });
            }
            if (!(attrs.platinum && isNumber(attrs.platinum)) && attrs.platinum !== 0) {
                err.errors.push({
                    field: "platinum",
                    rejectedValue: "Not a Number",
                    message: "Platinum must be a number."
                });
            }
            if (!(attrs.minHoursPlatinum && isNumber(attrs.minHoursPlatinum) && attrs.minHoursPlatinum > 0)) {
                err.errors.push({
                    field: "minHoursPlatinum",
                    rejectedValue: "Not a Number",
                    message: "Minimum hours platinum must be a number greater than zero."
                });
            }

            // TODO: add validation for the following
            // // if base rates enabled
            // standardBaseRate(nullable: true)
            // premiumBaseRate(nullable: true)
            // platinumBaseRate(nullable: true)

            // // if night / overnight enabled
            // standardOvernight(nullable: true)
            // standardNight(nullable: true)
            // premiumOvernight(nullable: true)
            // premiumNight(nullable: true)
            // platinumOvernight(nullable: true)
            // platinumNight(nullable: true)

            // // if travel rates enabled
            // travelStandard(nullable: true)
            // travelPremium(nullable: true)
            // travelPlatinum(nullable: true)

            // // if pass through rates enabled
            // passThroughStandard(nullable: true)
            // passThroughPremium(nullable: true)
            // passThroughPlatinum(nullable: true)

            // // if cliffs enabled
            // cliffMinsStandard(nullable: true)
            // cliffRateStandard(nullable: true)
            // cliffMinsPremium(nullable: true)
            // cliffRatePremium(nullable: true)
            // cliffMinsPlatinum(nullable: true)
            // cliffRatePlatinum(nullable: true)

            if (attrs.splitMinimumDuration) {
                if (!(attrs.tieredMinHoursStandard && isNumber(attrs.tieredMinHoursStandard) && attrs.tieredMinHoursStandard > 0)) {
                    err.errors.push({
                        field: "tieredMinHoursStandard",
                        rejectedValue: "Blank",
                        message: "Tiered minimum hours standard is required and must be a number greater than zero."
                    });
                }
                if (!(attrs.tieredMinHoursPremium && isNumber(attrs.tieredMinHoursPremium) && attrs.tieredMinHoursPremium > 0)) {
                    err.errors.push({
                        field: "tieredMinHoursPremium",
                        rejectedValue: "Blank",
                        message: "Tiered minimum hours premium is required and must be a number greater than zero."
                    });
                }
                if (!(attrs.tieredMinHoursPlatinum && isNumber(attrs.tieredMinHoursPlatinum) && attrs.tieredMinHoursPlatinum > 0)) {
                    err.errors.push({
                        field: "tieredMinHoursPlatinum",
                        rejectedValue: "Blank",
                        message: "Tiered minimum hours platinum must be a number greater than zero."
                    });
                }
            }

            if (attrs.billingIncrementOverride) {
                if ((!attrs.unitInc && attrs.unitInc != "0") || !isNumber(attrs.unitInc)) {
                    err.errors.push({
                        field: "unitInc",
                        rejectedValue: "Blank",
                        message: "Unit increment."
                    });
                }
            }

            if (attrs.mileageOverride) {
                if ((!attrs.mileage && attrs.mileage != "0") || !isNumber(attrs.mileage)) {
                    err.errors.push({
                        field: "mileage",
                        rejectedValue: "Blank",
                        message: "Mileage is required and must be a number."
                    });
                }
                if ((!attrs.mileageThreshold && attrs.mileageThreshold != "0") || !isNumber(attrs.mileageThreshold)) {
                    err.errors.push({
                        field: "mileageThreshold",
                        rejectedValue: "Blank",
                        message: "Mileage threshold is required and must be a number."
                    });
                }
                if (attrs.minMileage && !isNumber(attrs.minMileage)) {
                    err.errors.push({
                        field: "minMileage",
                        rejectedValue: "Blank",
                        message: "Minimum mileage threshold must be a number."
                    });
                }
                if (attrs.maxMileage && !isNumber(attrs.maxMileage)) {
                    err.errors.push({
                        field: "maxMileage",
                        rejectedValue: "Blank",
                        message: "Maximum mileage threshold must be a number."
                    });
                }
            }

            // validate cancel fees
            $.common.validateCollection(this.get("cancelFees"), err);
            // validate rush fees
            $.common.validateCollection(this.get("rushFees"), err);
            // validate miscellaneous fees
            $.common.validateCollection(this.get("miscellaneousFees"), err);


            if (err.errors.length > 0) {
                return err;
            } else {
                //do nothing
            }
        },

        clone: function () {

            // NOTE: the fees relation is copied rather than cloned to get the desired behavior of copying the rate plan

            // call clone on backbone relational
            var cl = Backbone.RelationalModel.prototype.clone.apply(this);

            cl.set("rushFees", new Backbone.Collection());

            var rushFees = this.get("rushFees");
            _.each(rushFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("rushFees").push(c);
            });

            cl.set("miscellaneousFees", new Backbone.Collection());

            var miscFees = this.get("miscellaneousFees");
            _.each(miscFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("miscellaneousFees").push(c);
            });

            cl.set("cancelFees", new Backbone.Collection());

            var cancelFees = this.get("cancelFees");
            _.each(cancelFees.models, function (m) {

                var c = m.clone();
                // strip uuid
                c.attributes.uuid = null;

                // push a clone of m
                cl.get("cancelFees").push(c);
            });

            return cl;
        }
    });

    // contact rate plan association
    $.finance.ContactRatePlan = Backbone.Model.extend({
        defaults: App.dict.defaults.contactRatePlan,

        initialize: function (attributes, options) {

            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.entities = [
                "contact",
                "ratePlan",
                "company"
            ];

        },

        idAttribute: 'id',

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (!attrs.ratePlan) {

                err.errors.push({
                    field: "ratePlan",
                    rejectedValue: "Rate Plan cannot be blank",
                    message: "Please enter the Rate Plan"
                });
            }

            if (err.errors.length > 0) {
                return err;
            }
        },

        url: function () {
            var baseUrl = App.config.context + "/api/contactrateplan";
            var rpUrl;
            if (this.get("contact")) {
                if (this.get("booking")) {
                    baseUrl = App.config.context + '/api/contactrateplans/' + this.get("contact").id + '/booking/' + this.get("booking").id + '/rateplan';
                }
            }

            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });

    // customer rate plan association
    $.finance.CustomerRatePlan = Backbone.Model.extend({
        defaults: App.dict.defaults.customerRatePlan,

        initialize: function (attributes, options) {

            _.extend(this, $.app.mixins.stubObjectModelMixin);

            this.entities = [
                "customer",
                "ratePlan",
                "company"
            ];

        },

        idAttribute: 'id',

        validate: function (attrs) {

            var err = {};
            err.code = 400;
            err.message = "One or more required fields are missing. Please correct the errors in red and try again.";
            err.errors = [];

            if (!attrs.ratePlan) {

                err.errors.push({
                    field: "ratePlan",
                    rejectedValue: "Rate Plan cannot be blank",
                    message: "Please enter the Rate Plan"
                });
            }

            if (attrs.activeStartDate && attrs.activeEndDate && Date.parse(attrs.activeStartDate) >= Date.parse(attrs.activeEndDate)) {
                err.errors.push({
                    field: "endDate",
                    rejectedValue: "Invalid",
                    message: "Start date must be before end date."
                });
            }

            if (err.errors.length > 0) {
                return err;
            }
        },

        url: function () {
            var baseUrl = App.config.context + "/api/customerrateplan";
            var rpUrl;
            if (this.get("customer")) {
                if (this.get("booking")) {
                    baseUrl = App.config.context + '/api/customerrateplans/' + this.get("customer").id + '/booking/' + this.get("booking").id + '/rateplan';
                }
            }

            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });

    /**
     * extend from close state model to re-use validation
     */
    $.finance.FinancedItemModel = $.core.BookingCloseState.extend({

        urlRoot: App.config.context + "/api/booking/finance",

        url: function () {
            if (!App.config.isLoggedIn) {
                return App.config.context + '/public/' + App.config.company.uuid + '/finance/' + this.get("uuid");
            } else {
                // id must always be present
                return App.config.context + '/api/booking/finance/' + this.id;
            }
        },

        initialize: function (attributes, options) {
            $.core.BookingCloseState.prototype.initialize.call(this, attributes, options);

            // Indicates that this is a newfangled model using objects with complex attributes
            _.extend(this, $.app.mixins.stubObjectModelMixin);

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

        handleSuccess: function (model, response) {
            // noop
        }

        // TODO: fetch calls reload on interpreterJob? not ideal.
    });


    // collections ////////////////////////////////////////////////////////

    // rate plan collection
    $.finance.RatePlanCollection = $.core.BaseCollection.extend({
        model: $.finance.RatePlan,
        url: App.config.context + '/api/company/rateplan'
    });

    // rate zone group collection
    $.finance.RateZoneGroupCollection = $.core.BaseCollection.extend({
        url: App.config.context + '/api/company/group/zone',
        model: $.finance.RateZoneGroup
    });

    // rate zone collection
    $.finance.RateZoneCollection = Backbone.Collection.extend({
        model: $.finance.RateZone,
        url: App.config.context + '/api/company/zone',
        fetch: preFetchInjectFilter
    });

    // rate zone segment collection
    $.finance.RateZoneSegmentCollection = Backbone.Collection.extend({
        model: $.finance.RateZoneSegment,
        url: App.config.context + '/api/company/zone/segment',
        fetch: preFetchInjectFilter
    });

    //customer:rate zone group collection
    $.finance.CustomerRateZoneGroupCollection = $.core.BaseCollection.extend({
        model: $.finance.CustomerRateZoneGroup,
        url: function () {
            var baseUrl;
            var rpUrl;

            if (this.get("customer")) {
                baseUrl = App.config.context + '/api/customer/' + this.get("customer").id + '/ratezone';
            } else {
                baseUrl = App.config.context + '/api/customer/ratezone';
            }
            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });

    // contact:rate zone group collection
    $.finance.ContactRateZoneGroupCollection = $.core.BaseCollection.extend({
        model: $.finance.ContactRateZoneGroup,
        url: function () {
            var baseUrl;
            var rpUrl;

            if (this.get("contact")) {
                baseUrl = App.config.context + '/api/contact/' + this.get("contact").id + '/ratezone';
            } else {
                baseUrl = App.config.context + '/api/contact/ratezone';
            }
            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });

    $.finance.ContactRatePlans = $.core.BaseCollection.extend({
        model: $.finance.ContactRatePlan,
        initialize: function (models, options) {
            this.contact = options ? options.contact : null;
            this.ratePlan = options ? options.ratePlan : null;
            this.activePlans = options ? options.activePlans : null;
        },
        url: function () {
            var baseUrl;
            var rpUrl;

            baseUrl = App.config.context + '/api/contactrateplan';

            if (this.contact) {
                if (this.activePlans) {
                    return App.config.context + '/api/contactrateplans/' + this.contact.id + '/activerateplans';
                } else {
                    return App.config.context + '/api/contactrateplans/' + this.contact.id + '/rateplan';
                }
            } else if (this.ratePlan) {
                baseUrl = App.config.context + '/api/contact/rateplan';
            }
            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });

    $.finance.CustomerRatePlans = $.core.BaseCollection.extend({
        model: $.finance.CustomerRatePlan,
        initialize: function (models, options) {
            this.customer = options ? options.customer : null;
            this.ratePlan = options ? options.ratePlan : null;
            this.activePlans = options ? options.activePlans : null;
        },
        url: function () {
            var baseUrl;
            var rpUrl;

            baseUrl = App.config.context + '/api/customerrateplan';

            if (this.customer) {
                if (this.activePlans) {
                    return App.config.context + '/api/customerrateplans/' + this.customer.id + '/activerateplans';
                } else {
                    return App.config.context + '/api/customerrateplans/' + this.customer.id + '/rateplan';
                }
            } else if (this.ratePlan) {
                baseUrl = App.config.context + '/api/customer/rateplan';
            }
            if (this.id) {
                rpUrl = '/' + this.id;
            } else {
                rpUrl = '';
            }

            return baseUrl + rpUrl;
        }
    });


})(jQuery);
