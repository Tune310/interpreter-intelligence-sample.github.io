(function ($) { //@ sourceURL=app/component/sidenav.js
    /* enable strict mode */
    'use strict';

    $.sidenav = {};

    $.sidenav.models = {};

    $.sidenav.views = {};

    $.sidenav.views.MainView = $.app.ItemView.extend({

        getTemplate: function () {
            return this.options.jst;
        },

        events: {
            'click .closebtn': 'closeNav',
            'click .allJobs': 'fetchAllJobs',
            'click .newJobs': 'fetchNewJobs',
            'click .unconfirmedGreaterThan24': 'fetchUnconfirmedGreaterThan24',
            'click .offersGreaterThan24': 'fetchOffersGreaterThan24',
            'click .unassignedJobs': 'fetchUnassignedJobs',
            'click .myJobs': 'fetchMyJobs',
            'click .querycomponent': 'showQueryComponent'
        },

        onRender: function () {
            var that = this;

            this.$('#dateRange').daterangepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                onClose: function () {

                    setTimeout(function () {
                        that.$("#calendar").datepicker('setDate', null);
                        $.common.saveDateRangeInformation($("#dateRange").val());

                        that.callback(null);
                        // options.refetch = true;
                        // jobs.fetchCollection(options);
                        //
                        // console.log($("#dateRange").val());
                    }, 100);
                },
                presetRanges: bookingPresets,
                datepickerOptions: {
                    changeMonth: true,
                    changeYear: true,
                    showOtherMonths: true,

                    // dateFormat: App.config.company.config.jsDateFormat,
                    // showOtherMonths: true,
                    // changeMonth: true,
                    // changeYear: true,
                    //showOtherMonths: true,
                    selectOtherMonths: true
                },
                earliestDate: Date.parse('January 01, 1970'), //earliest date allowed
                latestDate: Date.parse('January 01, 2030') //latest date allowed
            });
            this.dt = new Date();
            this.date = new Date().toString(App.config.company.config.dateFormat);
            this.$(".currentDate").html(this.date);
            this.$(".currentDate").html(this.dt);
            // current date
            this.$('#calendar').datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                showOtherMonths: true,
                changeMonth: true,
                changeYear: true,
                selectOtherMonths: true,
                inline: true,
                onSelect: function (dateText, inst) {
                    $.common.saveDateRangeInformation(dateText);
                    that.$(".currentDate").html(dateText);

                    that.$("#dateRange").val("");

                    that.callback(null);
                    // options.refetch = true;
                    // jobs.fetchCollection(options);
                }
            });
            this.$('#calendar').datepicker('setDate', null);

            this.$('#clearRange').on('click', function () {
                that.$(".currentDate").html("");
                that.$("#dateRange").val("");
                $.common.removeDateRangeInformation();

                that.$("#dateRange").val('');
                that.$(".currentDate").html('<br/>&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;');
                $.common.removeDateRangeInformation();

                that.callback(null /* no search filters */ , {
                    clearRange: true
                });
            });

        },

        initialize: function (options) {
            this.callback = options.callback;
            this.options = options;

            var that = this;

            // set up query component search
            this.search = function (value) {
                that.saveSearch(value.filters);
                that.callback(value.filters);
            };
        },

        closeNav: function () {
            $("#mySidenav").css("transform", "translateX(-282px)");
        },

        // @TODO: Use $.filterbuilder rather than addOrUpdateFilter
        fetchAllJobs: function () {
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            this.saveSearch(filtersJSON);

            this.callback(filtersJSON, {
                "activeTab": "jobs-tab"
            });
        },

        // @TODO: Use $.filterbuilder rather than addOrUpdateFilter
        fetchNewJobs: function () {

            var hoursSince = App.config.company.config.newJobsWindow;

            // set to existing filters or reset
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "status.ids", "eq", "" + App.dict.bookingStatus['new'].id + "," + App.dict.bookingStatus.open.id + "");
            filtersJSON = addOrUpdateFilter(filtersJSON, "createdDate", "ged", (new Date()).addHours(hoursSince * -1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
            filtersJSON = addOrUpdateFilter(filtersJSON, "createdDate", "led", (new Date()).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
            this.saveSearch(filtersJSON);

            this.callback(filtersJSON, {
                "activeTab": "jobs-tab"
            });
        },

        // @TODO: Use $.filterbuilder rather than addOrUpdateFilter
        fetchUnconfirmedGreaterThan24: function () {

            // set to existing filters or reset
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.bookingStatus.assigned.id);
            // since 24 hours ago
            filtersJSON = addOrUpdateFilter(filtersJSON, "assignmentDate", "led", this.dt.addDays(-1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
            this.saveSearch(filtersJSON);

            this.callback(filtersJSON, {
                "activeTab": "jobs-tab"
            });
        },

        // @TODO: Use $.filterbuilder rather than addOrUpdateFilter
        fetchOffersGreaterThan24: function () {

            // set to existing filters or reset
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.bookingStatus.offered.id);
            // since 24 hours ago
            filtersJSON = addOrUpdateFilter(filtersJSON, "jobOffers.createdDate", "led", this.dt.addDays(-1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
            this.saveSearch(filtersJSON);

            this.callback(filtersJSON, {
                "activeTab": "jobs-tab"
            });
        },

        // @TODO: Use $.filterbuilder rather than addOrUpdateFilter
        fetchUnassignedJobs: function () {
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "status.ids", "eq", "" + App.dict.bookingStatus['new'].id + "," + App.dict.bookingStatus.open.id + "," + App.dict.bookingStatus.offered.id + "");
            this.saveSearch(filtersJSON);

            this.callback(filtersJSON, {
                "activeTab": "jobs-tab"
            });
        },

        // @TODO: Use $.filterbuilder rather than addOrUpdateFilter
        fetchMyJobs: function () {

            // set to existing filters or reset
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "createdBy", "bw", App.config.user);
            this.saveSearch(filtersJSON);

            this.callback(filtersJSON, {
                "activeTab": "jobs-tab"
            });
        },

        saveSearch: function (filters) {
            filters = removeFilter(filters, "expectedStartDate", "ged", "");
            filters = removeFilter(filters, "expectedStartDate", "led", "");
            this.currentFilters = filters;
        },

        showQueryComponent: function () {
            new $.querycomponent.init({
                endpoint: this.options.endpoint,
                onSearch: this.search
            }).render();
        }
    });

    /**
     * @param options.el: selector to put the component in
     * @param options.endpoint: end point for query component
     * @param options.callback: callback function to be called when any filters applied
     * @param options.jst: template to use for side nav
     */
    $.sidenav.init = function (options) {
        new $.sidenav.views.MainView({
            el: options.el,
            endpoint: options.endpoint,
            callback: options.callback,
            jst: options.jst
        }).render();
    };

})(jQuery);
