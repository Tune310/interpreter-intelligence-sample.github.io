/*
 * Copyright (C) 2012 Interpreter Intelligence <support@interpreterintelligence.com>
 *
 * <copyright notice>
 */

(function ($) { //@ sourceURL=app/view/company.dashboard.js
    /* enable strict mode */
    "use strict";

    // namespace for views and local methods
    if (!$.booking) $.booking = {};
    $.booking.dashboard = {};
    $.booking.dashboard.frame = {};

    // views (local) ////////////////////////////////////////////////////////

    $.booking.dashboard.ImportantUpdatesView = $.app.BaseView.extend({


        template: JST['company/dashboard/important-updates'],

        initialize: function () {

        },

        render: function () {

            // the model backing this view is NOT a proper backbone model
            this.$el.append(this.template(this.model));
            return this;
        }
    });


    $.booking.dashboard.UnassignedBookingsView = $.app.BaseView.extend({


        template: JST['company/dashboard/unassigned-jobs'],

        initialize: function () {

        },

        render: function () {

            // the model backing this view is NOT a proper backbone model
            this.$el.append(this.template(this.model));
            return this;
        }
    });

    // models (local) ////////////////////////////////////////////////////////

    // router ////////////////////////////////////////////////////////

    $.booking.dashboard.Router = Backbone.Router.extend({

        routes: {}
    });

    // application frame


    $.booking.dashboard.frame.bootstrap = function () {

        // local variables

        // initialize the application frame
        // @param obj optional primary object the frame is interacting with (maybe prepopulated and passed from gsp page)
        // @param options optional options (name / value object) passed to the frame
        $.booking.dashboard.frame.init = function (obj, options) {

            if (options.totalPendingEvents) {

                // the model passed here is not a proper backbone model.
                var updates = new $.booking.dashboard.ImportantUpdatesView({
                    model: {
                        total: options.totalPendingEvents
                    },
                    el: $("#important-updates-container")
                });
                updates.render();

            }

            if (options.totalUnassignedBookings) {

                // the model passed here is not a proper backbone model.
                var unassigned = new $.booking.dashboard.UnassignedBookingsView({
                    model: {
                        total: options.totalUnassignedBookings,
                        days: App.config.company.config.unassignedWindow
                    },
                    el: $("#unassigned-bookings-container")
                });
                unassigned.render();

            }

            var messageCollection = new $.core.MessageCollection({}, {
                'company.id': App.config.company.id
            });
            var messages = new $.messages.MessagesListView({
                el: $(".inbox-container"),
                collection: messageCollection
            });

            messageCollection.getFirstPage();
            messages.render();

            // TODO: pick these up from company configuration
            var pageLoaded = new Date();
            var gridRefreshInterval = 300000;
            var hoursSince = App.config.company.config.newJobsWindow;

            // depends on common elements
            $.app.common.bootstrap();

            $.booking.dashboard.UnconfirmedView = $.app.ItemView.extend({
                template: 'company/dashboard/unconfirmed-table',
                tagname: 'td',
                backgridColumns: $.app.common.backgrid.jobColumns,
                backgridRow: $.app.backgrid.HighlightInvalidUpdatedRows,
                fetchCollection: function (options) {
                    var hoursSince = App.config.company.config.newJobsWindow;

                    // pick up existing filters if set (undefined throws error so set to null)
                    var filters = this.collection.queryParams.filters || null;
                    var filtersJSON;

                    // set to existing filters or reset
                    filtersJSON = JSON.parse(filters) || {
                        groupOp: "AND",
                        rules: []
                    };

                    var dt = $("#calendar").datepicker('getDate');

                    if (dt === undefined || dt === null) {
                        dt = new Date();
                    }

                    filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.bookingStatus.assigned.id);
                    // since 24 hours ago
                    filtersJSON = addOrUpdateFilter(filtersJSON, "assignmentDate", "le", dt.addDays(-1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
                    filters = JSON.stringify(filtersJSON, null, "\t");
                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");
                    this.name = "UnconfirmedBookings";
                    this.persistent = true;

                    this.collection.setSorting("expectedStartDate");
                    this.collection.queryParams.filters = filters;
                    if (options.refetch) {
                        this.collection.getFirstPage();
                    }
                },

                initialize: function (options) {
                    this.collection = new $.visit.v2.InterpreterVisitCollection();
                    this.fetchCollection(options);
                    var unconfirmed = jQuery.extend(true, {}, this.backgridColumns);
                    var unconfirmedCols = [];
                    unconfirmedCols.push(unconfirmed.action);
                    unconfirmedCols.push(unconfirmed.checkbox);
                    unconfirmedCols.push(unconfirmed.id);
                    unconfirmedCols.push(unconfirmed.expectedStartDate);
                    unconfirmedCols[2].direction = "ascending";
                    unconfirmedCols.push(unconfirmed.expectedStartTime);
                    unconfirmedCols.push(unconfirmed.customer);
                    unconfirmedCols.push(unconfirmed.location);
                    unconfirmedCols.push(unconfirmed.status);
                    unconfirmedCols.push(unconfirmed.interpreter);
                    unconfirmedCols.push(unconfirmed.teamSize);
                    unconfirmedCols.push(unconfirmed.refs);
                    unconfirmedCols.push(unconfirmed.requirement);
                    unconfirmedCols.push(unconfirmed.bookingMode);
                    for (var i = 0; i < unconfirmedCols.length; i++) {
                        unconfirmedCols[i].defaultColumn = true;
                    }

                    var key = "Unconfirmed";
                    this.filterableGrid = new $.app.backgrid.FilterableColumnGrid({
                        el: this.$el,
                        key: key,
                        columns: this.backgridColumns,
                        row: this.backgridRow,
                        defaultColumns: unconfirmedCols,
                        name: this.name,
                        persistent: this.persistent,
                        collection: this.collection
                    });
                },

                onRender: function () {
                    this.filterableGrid.render();
                    this.jobBulkActions = new $.common.GridJobBulkActionsView({
                        parentView: this.filterableGrid,
                        el: this.$(".job-bulk-actions")
                    });
                    this.jobBulkActions.render();
                    this.showSecured();
                }

            });

            $.booking.dashboard.OffersView = $.app.ItemView.extend({
                template: 'company/dashboard/offers-table',
                tagname: 'td',
                backgridColumns: $.app.common.backgrid.jobColumns,
                backgridRow: $.app.backgrid.HighlightInvalidUpdatedRows,
                fetchCollection: function (options) {
                    var hoursSince = App.config.company.config.newJobsWindow;

                    // pick up existing filters if set (undefined throws error so set to null)
                    var filters = this.collection.queryParams.filters || null;
                    var filtersJSON;

                    // set to existing filters or reset
                    filtersJSON = JSON.parse(filters) || {
                        groupOp: "AND",
                        rules: []
                    };

                    var dt = $("#calendar").datepicker('getDate');

                    filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.bookingStatus.offered.id);
                    // since 24 hours ago
                    filtersJSON = addOrUpdateFilter(filtersJSON, "jobOffers.createdDate", "le", dt.addDays(-1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
                    filters = JSON.stringify(filtersJSON, null, "\t");
                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                    this.name = "OfferedBookings";
                    this.persistent = true;

                    this.collection.setSorting("expectedStartDate");
                    this.collection.queryParams.filters = filters;
                    if (options.refetch) {
                        this.collection.getFirstPage();
                    }
                },

                initialize: function (options) {
                    this.collection = new $.visit.v2.InterpreterVisitCollection();
                    this.fetchCollection(options);
                    var offers = jQuery.extend(true, {}, this.backgridColumns);
                    var offerCols = [];
                    offerCols.push(offers.action);
                    offerCols.push(offers.checkbox);
                    offerCols.push(offers.id);
                    offerCols.push(offers.expectedStartDate);
                    offerCols[2].direction = "ascending";
                    offerCols.push(offers.expectedStartTime);
                    offerCols.push(offers.customer);
                    offerCols.push(offers.location);
                    offerCols.push(offers.status);
                    offerCols.push(offers.teamSize);
                    offerCols.push(offers.refs);
                    offerCols.push(offers.requirement);
                    offerCols.push(offers.bookingMode);
                    for (var i = 0; i < offerCols.length; i++) {
                        offerCols[i].defaultColumn = true;
                    }

                    var key = "Offers";
                    this.filterableGrid = new $.app.backgrid.FilterableColumnGrid({
                        el: this.$el,
                        key: key,
                        columns: this.backgridColumns,
                        row: this.backgridRow,
                        defaultColumns: offerCols,
                        name: this.name,
                        persistent: this.persistent,
                        collection: this.collection
                    });
                },

                onRender: function () {
                    this.filterableGrid.render();
                    this.jobBulkActions = new $.common.GridJobBulkActionsView({
                        parentView: this.filterableGrid,
                        el: this.$(".job-bulk-actions")
                    });
                    this.jobBulkActions.render();
                    this.showSecured();
                }

            });

            $.booking.dashboard.PriorityBookingView = $.app.ItemView.extend({
                template: 'company/dashboard/priority-table',
                tagname: 'td',
                backgridColumns: $.app.common.backgrid.jobColumns,
                backgridRow: $.app.backgrid.HighlightInvalidUpdatedRows,
                fetchCollection: function (options) {
                    var hoursSince = App.config.company.config.newJobsWindow;

                    // pick up existing filters if set (undefined throws error so set to null)
                    var filters = this.collection.queryParams.filters || null;
                    var filtersJSON;

                    // set to existing filters or reset
                    filtersJSON = JSON.parse(filters) || {
                        groupOp: "AND",
                        rules: []
                    };

                    var dt = new Date();

                    filtersJSON = addOrUpdateFilter(filtersJSON, "expectedStartDate", "ge", dt.addHours(parseInt(App.config.company.config.priorityMinus, 10) * -1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
                    // filter for priority bookings
                    filtersJSON = addOrUpdateFilter(filtersJSON, "expectedStartDate", "le", dt.addHours(parseInt(App.config.company.config.priorityPlus, 10)).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);

                    filters = JSON.stringify(filtersJSON, null, "\t");
                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                    this.name = "PriorityBookings";
                    this.persistent = true;

                    this.collection.setSorting("expectedStartDate");
                    this.collection.queryParams.filters = filters;
                    if (options.refetch) {
                        this.collection.getFirstPage();
                    }
                },

                initialize: function (options) {
                    this.collection = new $.visit.v2.InterpreterVisitCollection();
                    this.fetchCollection(options);
                    var priority = jQuery.extend(true, {}, this.backgridColumns);
                    var priorCols = [];
                    priorCols.push(priority.action);
                    priorCols.push(priority.checkbox);
                    priorCols.push(priority.id);
                    priorCols.push(priority.due);
                    priorCols.push(priority.expectedStartTime);
                    priorCols[2].direction = "ascending";
                    priorCols.push(priority.customer);
                    priorCols.push(priority.location);
                    priorCols.push(priority.status);
                    priorCols.push(priority.interpreter);
                    priorCols.push(priority.teamSize);
                    priorCols.push(priority.requirement);
                    priorCols.push(priority.bookingMode);
                    for (var i = 0; i < priorCols.length; i++) {
                        priorCols[i].defaultColumn = true;
                    }

                    var key = "Priority";
                    this.filterableGrid = new $.app.backgrid.FilterableColumnGrid({
                        el: this.$el,
                        key: key,
                        columns: this.backgridColumns,
                        row: this.backgridRow,
                        defaultColumns: priorCols,
                        name: this.name,
                        persistent: this.persistent,
                        collection: this.collection
                    });
                },

                onRender: function () {
                    this.filterableGrid.render();
                    this.jobBulkActions = new $.common.GridJobBulkActionsView({
                        parentView: this.filterableGrid,
                        el: this.$(".job-bulk-actions")
                    });
                    this.jobBulkActions.render();
                    this.showSecured();
                }

            });

            $.booking.dashboard.DiaryBookingView = $.app.ItemView.extend({
                template: 'company/dashboard/diary-table',
                tagname: 'td',
                backgridColumns: $.app.common.backgrid.jobColumns,
                backgridRow: $.app.backgrid.HighlightInvalidUpdatedRows,
                events: {
                    "click .printDailyCmd": "printDaily"
                },
                fetchCollection: function (options) {
                    // pick up existing filters if set (undefined throws error so set to null)
                    var filters = this.collection.queryParams.filters || null;
                    var filtersJSON;

                    // set to existing filters or reset
                    filtersJSON = JSON.parse(filters) || {
                        groupOp: "AND",
                        rules: []
                    };

                    this.dt = $("#calendar").datepicker('getDate');

                    filtersJSON = addOrUpdateFilter(filtersJSON, "expectedStartDate", "eq", this.dt.toString(App.config.company.config.dateFormat), "date", App.config.company.config.dateFormat);

                    filters = JSON.stringify(filtersJSON, null, "\t");
                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");
                    this.name = "DiaryBookings";
                    this.persistent = true;

                    this.collection.setSorting("expectedStartDate");
                    this.collection.queryParams.filters = filters;
                    if (options.refetch) {
                        this.collection.getFirstPage();
                    }
                },

                initialize: function (options) {
                    this.collection = new $.visit.v2.InterpreterVisitCollection();
                    this.fetchCollection(options);
                    var diary = jQuery.extend(true, {}, this.backgridColumns);
                    var diaryCols = [];
                    diaryCols.push(diary.action);
                    diaryCols.push(diary.checkbox);
                    diaryCols.push(diary.id);
                    diaryCols.push(diary.expectedStartTime);
                    diaryCols[2].direction = "ascending";
                    diaryCols.push(diary.customer);
                    diaryCols.push(diary.location);
                    diaryCols.push(diary.status);
                    diaryCols.push(diary.interpreter);
                    diaryCols.push(diary.teamSize);
                    diaryCols.push(diary.refs);
                    diaryCols.push(diary.requirement);
                    diaryCols.push(diary.bookingMode);

                    for (var i = 0; i < diaryCols.length; i++) {
                        diaryCols[i].defaultColumn = true;
                    }

                    var key = "Diary";

                    this.filterableGrid = new $.app.backgrid.FilterableColumnGrid({
                        el: this.$el,
                        key: key,
                        columns: this.backgridColumns,
                        row: this.backgridRow,
                        defaultColumns: diaryCols,
                        name: this.name,
                        persistent: this.persistent,
                        collection: this.collection
                    });

                    // register call to get comments on collection sync
                    this.collection.bind("sync", this.getComments, this);
                },

                getComments: function (source) {

                    // ensure source event is from collection, not a model within collection
                    if (source === this.collection) {
                        new $.common.CommentCountsManagerView({
                            el: this.$el, // container where the comment counts are saved
                            collection: this.collection // collection of jobs to lookup comments for
                        });
                    }
                },

                onRender: function () {
                    this.filterableGrid.render();
                    this.jobBulkActions = new $.common.GridJobBulkActionsView({
                        parentView: this.filterableGrid,
                        el: this.$(".job-bulk-actions")
                    });
                    this.jobBulkActions.render();
                    this.showSecured();
                    var dateText = this.dt.toString(App.config.company.config.dateFormat);
                    this.$(".currentDate").html(dateText);
                },

                printDaily: function (evt) {
                    var url = App.config.context + "/company/daily?";

                    var date = this.dt.toString(App.config.company.config.dateFormat);
                    url += "&date=" + date;

                    $.colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.app.width,
                        innerHeight: App.config.popups.app.height,
                        open: true,
                        href: url,
                        returnFocus: false,
                        title: 'Daily Jobs View'
                    });
                }
            });

            $.booking.dashboard.NewBookingsView = $.app.ItemView.extend({
                template: 'company/dashboard/table',
                tagname: 'td',
                backgridColumns: $.app.common.backgrid.jobColumns,
                backgridRow: $.app.backgrid.HighlightInvalidUpdatedRows,
                fetchCollection: function (options) {
                    var hoursSince = App.config.company.config.newJobsWindow;

                    // pick up existing filters if set (undefined throws error so set to null)
                    var filters = this.collection.queryParams.filters || null;
                    var filtersJSON;

                    // set to existing filters or reset
                    filtersJSON = JSON.parse(filters) || {
                        groupOp: "AND",
                        rules: []
                    };

                    filtersJSON = addOrUpdateFilter(filtersJSON, "status.ids", "eq", "" + App.dict.bookingStatus['new'].id + "," + App.dict.bookingStatus.open.id + "");
                    filtersJSON = addOrUpdateFilter(filtersJSON, "createdDate", "ge", (new Date()).addHours(hoursSince * -1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
                    filtersJSON = addOrUpdateFilter(filtersJSON, "createdDate", "le", (new Date()).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
                    filters = JSON.stringify(filtersJSON, null, "\t");
                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                    this.name = "NewBookings";
                    this.persistent = true;

                    this.collection.setSorting("expectedStartDate");
                    this.collection.queryParams.filters = filters;
                    if (options.refetch) {
                        this.collection.getFirstPage().done(function () {
                            $(".new-bookings-count").text(newBooking.collection.length);
                            if (newBooking.collection.length > 0) {
                                $("#new-bookings-container").fadeIn(500);
                            }
                        });
                    }
                },

                initialize: function (options) {

                    this.collection = new $.visit.v2.InterpreterVisitCollection();
                    this.fetchCollection(options);
                    var col = jQuery.extend(true, {}, this.backgridColumns);
                    var newCols = [];
                    newCols.push(col.action);
                    newCols.push(col.checkbox);
                    newCols.push(col.id);
                    newCols.push(col.expectedStartDate);
                    newCols.push(col.expectedStartTime);
                    newCols[2].direction = "ascending";
                    newCols.push(col.customer);
                    newCols.push(col.teamSize);
                    newCols.push(col.languageCode);
                    newCols.push(col.language);
                    newCols.push(col.bookingMode);
                    for (var i = 0; i < newCols.length; i++) {
                        newCols[i].defaultColumn = true;
                    }
                    var key = "New";

                    this.filterableGrid = new $.app.backgrid.FilterableColumnGrid({
                        el: this.$el,
                        key: key,
                        columns: this.backgridColumns,
                        row: this.backgridRow,
                        defaultColumns: newCols,
                        name: this.name,
                        persistent: this.persistent,
                        collection: this.collection
                    });

                    this.collection.getFirstPage().done(function () {
                        $(".new-bookings-count").text(newBooking.collection.length);
                    });
                },

                onRender: function () {
                    this.filterableGrid.render();
                    this.jobBulkActions = new $.common.GridJobBulkActionsView({
                        parentView: this.filterableGrid,
                        el: this.$(".job-bulk-actions")
                    });
                    this.jobBulkActions.render();
                    this.showSecured();
                }

            });
            //$(".msg").colorbox();

            var date = new Date().toString(App.config.company.config.dateFormat);
            $(".currentDate").html(date);
            // current date
            $('#calendar').datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                showOtherMonths: true,
                inline: true,
                onSelect: function (dateText, inst) {

                    $(".currentDate").html(dateText);
                    // set refetch to true, for diary set the collection to 0 so that the date change refreshes the diary tab
                    if ($("a[href=#new-tab]").parent().hasClass('active')) {
                        options.refetch = true;
                        newBooking.fetchCollection(options);
                    } else if ($("a[href=#diary-tab]").parent().hasClass('active')) {
                        options.refetch = true;
                        diary.collection.length = 0;
                        diary.fetchCollection(options);
                    } else if ($("a[href=#offers-tab]").parent().hasClass('active')) {
                        options.refetch = true;
                        offers.fetchCollection(options);
                    } else if ($("a[href=#unconfirmed-tab]").parent().hasClass('active')) {
                        options.refetch = true;
                        unconfirmed.fetchCollection(options);
                    }

                }
            });
            $('#calendar').datepicker('setDate', date);

            $("#bookingJumpBtn").click(function () {
                if (!$("#bookingJump").val()) {
                    $("#bookingJump").focus();
                    $("#bookingJump").css("border-color", "red");
                } else {
                    document.location.href = App.config.context + "/job/show/" + $("#bookingJump").val();
                }
            });

            // fill rate report setup
            // fill rate
            var fillRate = new $.report.Runner({
                baseUrl: App.config.context + '/report/fillRate',
                format: 'json',
                params: {
                    startDate: (new Date()).addDays(-14).toString(App.config.company.config.dateFormat),
                    endDate: (new Date()).addDays(14).toString(App.config.company.config.dateFormat),
                    "company.id": App.config.company.id
                }
            });

            new $.report.ReportView({
                model: fillRate,
                el: $('#fill-rate'),
                title: 'Fill Rate (-2/+2 Weeks)',
                report: google.visualization.ColumnChart,
                reportOptions: {
                    height: 200,
                    title: '14 Day (Review & Outlook)',
                    isStacked: 'percent',
                    colors: ['#5295C4', '#FC3020', '#FEBB68'],
                    annotations: {
                        alwaysOutside: true,
                        highContrast: true,
                        textStyle: {
                            fontName: 'Arial, Helvetica, sans-serif',
                            fontSize: 12,
                            bold: false,
                            italic: false,
                            color: '#000',
                            // auraColor: '#d799ae',
                            opacity: 1
                        },
                        boxStyle: {}
                    }
                },
                decorator: function (data) {

                    // Set columns in a data view.
                    var fillRateView = new google.visualization.DataView(data);
                    fillRateView.setColumns([0, 1, 2, 3, {
                        calc: function (dataTable, row) {
                            return dataTable.getValue(row, 1) + dataTable.getValue(row, 2) + dataTable.getValue(row, 3);
                        },
                        type: "number",
                        role: "annotation"
                    }]);

                    return fillRateView;
                }
            });

            fillRate.fetch();

            var newBooking = new $.booking.dashboard.NewBookingsView({
                el: $(".bookings-container")
            });
            newBooking.render();

            var diary = new $.booking.dashboard.DiaryBookingView({
                el: $(".diary-container")
            });
            var priority = new $.booking.dashboard.PriorityBookingView({
                el: $(".priority-container")
            });
            var offers = new $.booking.dashboard.OffersView({
                el: $(".offers-container")
            });
            var unconfirmed = new $.booking.dashboard.UnconfirmedView({
                el: $(".unconfirmed-container")
            });
            var smsinbox = new $.company.dashboard.smsinbox.views.SmsInboxView({
                el: $(".sms-inbox-container")
            });

            $("a[href=#new-tab]").one('shown', function (e) {
                options.refetch = true;
                newBooking.fetchCollection(options);
            });
            $("a[href=#priority-tab]").one('shown', function (e) {
                priority.render();
                options.refetch = true;
                priority.fetchCollection(options);
            });
            $("a[href=#diary-tab]").one('shown', function (e) {
                diary.render();
                options.refetch = true;
                diary.fetchCollection(options);
            });
            $("a[href=#offers-tab]").one('shown', function (e) {
                offers.render();
                options.refetch = true;
                offers.fetchCollection(options);
            });
            $("a[href=#unconfirmed-tab]").one('shown', function (e) {
                unconfirmed.render();
                options.refetch = true;
                unconfirmed.fetchCollection(options);
            });
            $("a[href=#sms-inbox-tab]").one('shown', function (e) {
                smsinbox.render();
                options.refetch = true;
                // smsinbox.fetchCollection(options);
            });

            //recent events
            $.ajax({
                url: App.config.context + '/report/recentEvents',
                dataType: 'json',
                data: {
                    "company.id": App.config.company.id
                },
                beforeSend: function () {
                    //$(".loader").show();
                    $("#recent-activity").addClass("curtain");
                },
                complete: function () {
                    //$(".loader").hide();
                    $("#recent-activity").removeClass("curtain");
                },
                success: function (doc) {

                    if (doc.length !== 0) {
                        for (var i = 0; i < doc.length; i++) {

                            $("#recent-activity ul").append("<li><b>" + _.escape(doc[i].createdDate) + "</b>: <a href='" + App.config.context + "/" + doc[i].controller + "/show/" + doc[i].entityId + "'>" + _.escape(doc[i].eventMsg) + "</a> (" + _.escape(doc[i].initiator) + ")</li>");

                        }
                    } else {

                        $("#recent-activity ul").remove();
                        $("#recent-activity").append('<div style="margin: auto; text-align: center;">You have no recent activity</div>');

                    }
                    //alert("wow");
                },
                error: function () {

                    //alert("failed to load chart.");

                }
            });

            App.marionette.vent.on("businessUnit:change", function () {
                if ($("a[href=#new-tab]").parent().hasClass('active')) {
                    options.refetch = true;
                    newBooking.fetchCollection(options);
                } else if ($("a[href=#priority-tab]").parent().hasClass('active')) {
                    options.refetch = true;
                    priority.fetchCollection(options);
                } else if ($("a[href=#diary-tab]").parent().hasClass('active')) {
                    options.refetch = true;
                    diary.fetchCollection(options);
                } else if ($("a[href=#offers-tab]").parent().hasClass('active')) {
                    options.refetch = true;
                    offers.fetchCollection(options);
                } else if ($("a[href=#unconfirmed-tab]").parent().hasClass('active')) {
                    options.refetch = true;
                    unconfirmed.fetchCollection(options);
                } else if ($("a[href=#sms-inbox-tab]").parent().hasClass('active')) {
                    options.refetch = true;
                    // smsinbox.fetchCollection(options);
                }

            });


            //set the refresh interval
            setInterval(function () {
                //show last refresh
                options.refetch = true;
                $("#refreshSince").html("New Jobs (since " + (new Date()).addHours(hoursSince * -1).toString(App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat) + " (refreshed every " + (gridRefreshInterval / 1000 / 60) + " mins)");
                newBooking.fetchCollection(options);
            }, gridRefreshInterval);


        }; // end init

        // functions specific to the frame that are to be called after rendering are included here
        // @params el the dom element to invoke the callbacks on
        // @params model the model attached to the dom element (for registering common callbacks)
        $.booking.dashboard.frame.callbacks = function (el, model, view) {

            // call common callbacks
            view.callbacks(el, model);

        }; // end callbacks

        /**
         * initialize the date search element on the grid
         *
         * TODO: this should be global and reused across all grids
         *
         * @param elem
         */
        $.booking.dashboard.frame.dateSearchInit = function (elem) {

            $(elem).datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                showOtherMonths: true
            });
            $(elem).change(function () {
                $('#booking-list')[0].triggerToolbar();
            });

        };

    }; // end bootstrap

})(jQuery);
