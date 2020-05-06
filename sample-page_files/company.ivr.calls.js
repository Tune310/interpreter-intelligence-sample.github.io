/*
 * Copyright (C) 2012 No Good Software, Inc. <support@interpreterintelligence.com>
 *
 * <copyright notice>
 */
(function ($) { //@ sourceURL=app/view/company.booking.manage.js
    /* enable strict mode */
    "use strict";

    // namespace for financial consolidate
    if (!$.ivr) $.ivr = {};
    if (!$.ivr.calls) $.ivr.calls = {};
    $.ivr.calls.frame = {};

    // **** Views       ****
    $.ivr.calls.MainLayoutView = $.app.LayoutView.extend({

        template: "ivr/calls/mainlayout/show",

        backgridColumns: $.app.common.backgrid.ivrCallColumns,
        backgridRow: $.app.backgrid.ClickableRow,

        fetchCollection: function (options) {
            // pick up existing filters if set (undefined throws error so set to null)
            var filters = this.collection.queryParams.filters || null;
            var filtersJSON;

            // set to existing filters or reset
            filtersJSON = JSON.parse(filters) || {
                groupOp: "AND",
                rules: []
            };

            this.collection.setSorting("createdDate", "desc");
            this.collection.queryParams.filters = filters;
        },

        initialize: function (options) {

            this.collection = new $.core.IvrCallCollection();
            this.fetchCollection(options);

            this.name = "ivr-calls-list";
            this.persistent = true;

            var calls = jQuery.extend(true, {}, this.backgridColumns);
            var callsCols = [];
            callsCols.push(calls.action);
            callsCols.push(calls.id);
            //callsCols.push(calls.callSid);
            callsCols.push(calls.createdDate);
            callsCols.push(calls.createdTime);
            callsCols[1].direction = "descending";
            callsCols.push(calls.status);
            callsCols.push(calls.callStatus);
            callsCols.push(calls.callDuration);
            callsCols.push(calls.currentStep);
            callsCols.push(calls.operatorReason);
            callsCols.push(calls.job);
            callsCols.push(calls.customer);
            callsCols.push(calls.client);
            callsCols.push(calls.language);

            for (var i = 0; i < callsCols.length; i++) {
                callsCols[i].defaultColumn = true;
            }

            var key = "Calls";

            this.filterableGrid = new $.app.backgrid.FilterableColumnGrid({
                el: this.$el,
                key: key,
                columns: this.backgridColumns,
                row: this.backgridRow,
                defaultColumns: callsCols,
                name: this.name,
                persistent: this.persistent,
                collection: this.collection
            });
        },

        events: {

        },

        modelEvents: {


        },

        collectionEvents: {


        },

        regions: {

        },

        onRender: function () {

            this.filterableGrid.render();

            this.collection.getFirstPage();

            this.showSecured();
        }
    });


    // **** Bootstrap   ****
    $.ivr.calls.bootstrap = function (options) {

        $.ivr.calls.frame = {};

        App.marionette.addRegions({
            "mainRegion": "#main-region"
        });


        var main = new $.ivr.calls.MainLayoutView();

        $.ivr.calls.frame.init = function (options) {

            // render main layout
            App.marionette.mainRegion.show(main);

        };
    };
})(jQuery);
