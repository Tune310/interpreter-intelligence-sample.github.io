/*
 * Copyright (C) 2012 No Good Software, Inc. <conor@nogoodsoftware.com>
 *
 * <copyright notice>
 */
/*
//@ sourceURL=js/app/report.js
 */

(function ($) {
    /* enable strict mode */
    "use strict";

    // report namespace
    if (!$.report) $.report = {};
    $.report.Runner = function (options, callback) {
        this.baseUrl = options.baseUrl;
        this.format = options.format;
        this.params = options.params;
        this.asynch = options.asynch ? options.asynch : false;
        this.views = [];

        $.report.Runner.prototype.fetch = function (opts) {
            var that = this;

            opts = opts || {};
            // pick up data attributes passed in
            var data = opts.data || {};

            $.ajax({
                url: that.baseUrl + "." + that.format,
                dataType: that.format,
                //data: that.params,
                data: _.extend(that.params, data),
                beforeSend: function (jqXhr, settings) {
                    _.each(that.views, function (view) {
                        $(view.el).addClass("curtain");
                    });
                },
                complete: function (jqXhr, textStatus) {
                    _.each(that.views, function (view) {
                        $(view.el).removeClass("curtain");
                    });

                },
                success: function (doc, textStatus, jqXHR) {
                    var data = new google.visualization.DataTable();

                    for (var i = 0; i < doc.cols.length; i++) {
                        data.addColumn(doc.cols[i][1], doc.cols[i][0]);
                    }

                    data.addRows(doc.rows.length);

                    //loop over rows
                    for (i = 0; i < doc.rows.length; i++) {
                        //loop over columns
                        for (var j = 0; j < doc.cols.length; j++) {
                            data.setValue(i, j, doc.rows[i][j]);
                        }
                    }

                    // invoke callback on each view
                    _.each(that.views, function (view) {
                        view.callback(data);
                    });
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    //alert("failed to load chart.");
                    handleError({}, jqXhr);
                }
            });
        };

        // export is a reserved word
        $.report.Runner.prototype.exprt = function (options) {
            var defaults = {
                dataType: "json",
                beforeSend: function (jqXhr, settings) {},
                complete: function (jqXhr, textStatus) {},
                success: function (doc, textStatus, jqXHR) {
                    var title = doc.status === 200 ? 'In Progress ...' : 'Warning';
                    new Backbone.BootstrapModal({
                        title: title,
                        content: new $.report.AsynchDownloadView({
                            model: doc
                        }),
                        cancelText: false
                    }).open();
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    //alert("failed to load chart.");
                    handleError({}, jqXhr);
                }
            };

            options = _.defaults(options || {}, defaults);

            if (this.asynch === true) {
                var that = this;

                // pass asynch parameter
                $.extend(this.params, {
                    asynch: true,
                    format: (options.format ? options.format : that.format)
                });

                $.ajax({
                    url: that.baseUrl + "." + (options.format ? options.format : that.format),
                    dataType: options.dataType,
                    data: that.params,
                    beforeSend: options.beforeSend,
                    complete: options.complete,
                    success: options.success,
                    error: options.error
                });
            } else {
                window.location.href = this.baseUrl + "." + (options.format ? options.format : this.format) + "?" + $.param(this.params);
            }
        };

        // TODO: use custom event
        $.report.Runner.prototype.addListener = function (view) {
            this.views.push(view);
        };
    };

    // views ////////////////////////////////////////////////////////

    // report view
    $.report.ReportView = $.app.BaseView.extend({
        tagName: "div",

        className: "report",

        template: JST["report/report/show"],

        events: {
            'click #csv': 'exprt',
            'click #xlsx': 'exprt',
            'click #refresh': 'refresh'
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'callback', 'exprt', 'refresh');

            // add view to listen to report data
            options.model.addListener(this);

            // render the report
            this.render();
        },

        render: function () {
            //render the view
            $(this.el).html(this.template({
                title: this.options.title
            }));

            return this;
        },

        refresh: function (evt) {
            this.options.model.fetch({
                data: {
                    refresh: true
                }
            });

            //don't bubble event to avoid children bubbling up to parent
            evt.stopPropagation();
            return false;
        },

        exprt: function (evt) {
            // get export format
            var fmt = $(evt.currentTarget).attr('id');
            this.options.model.exprt({
                format: fmt
            });

            //don't bubble event to avoid children bubbling up to parent
            evt.stopPropagation();
            return false;
        },

        callback: function (dataTable) {
            var options = this.options.reportOptions;

            if (this.options.pageOptions) {
                options = $.extend(options, this.options.pageOptions);
                var total = dataTable.getNumberOfRows();
                var pageCnt = Math.ceil(total / options.pageSize);
                this.$('#caption #pageCnt').html(pageCnt);
                this.$('#pagination').show();
            }

            // apply any formatters if specified
            if (this.options.formatter) {
                this.options.formatter(dataTable);
            }

            var data = dataTable;

            // if there is a data decorator, apply this to data table
            if (this.options.decorator) {
                data = this.options.decorator(dataTable);
            }

            //var table = new google.visualization.Table(this.$("#report-container")[0]);
            //var type = 'google.visualization.Table';
            //var table = new window[type](this.$("#report-container")[0]);
            var report = new this.options.report(this.$("#report-container")[0]);

            var that = this;

            google.visualization.events.addListener(report, 'page', function (e) {
                that.$('#caption #pageNum').html(e.page + 1);

                options.startPage = e.page;
                report.draw(data, options);
            });

            google.visualization.events.addListener(report, 'ready', function (evt) {
                $(".gridPopup").colorbox();
            });
            google.visualization.events.addListener(report, 'sort', function (evt) {
                $(".gridPopup").colorbox();
            });

            report.draw(data, options);

            // invoke any additional subscribers
            if (this.options.subscriber) {
                this.options.subscriber(dataTable);
            }
        }
    });

    // report asynchronous view
    $.report.AsynchDownloadView = $.app.BaseView.extend({
        tagName: "div",

        className: "report",

        template: JST['report/asynchdownload/show'],

        initialize: function (options) {
            _.bindAll(this, 'render');
            this.render();
        },

        render: function () {
            $(this.el).html(this.template(this.model));
            return this;
        }
    });

    // display report list
    $.report.ReportListView = $.app.BaseView.extend({
        tagName: "ul",

        className: "thumbnails reports",

        initialize: function (options) {
            _.bindAll(this, 'render', 'renderReport', 'filter');
            this.model.bind('reset', this.render);
            this.model.bind('add', this.renderReport);
        },

        events: {},

        render: function () {
            this.model.each(this.renderReport);
            return this;
        },

        renderReport: function (report) {
            var reportView = new $.report.CustomReportView({
                model: report,
                collection: this.model
            });
            reportView.render();
            $(this.el).append(reportView.el);

            return this;
        },

        filter: function (yr, mth) {
            $("#reports .thumbnail").hide();

            var filtered = this.model.filter(function (report) {
                if (yr && mth) {
                    if (report.get('year') == yr && report.get('month') == mth) {
                        $("#reports .thumbnail." + mth + "." + yr).show();
                        return true;
                    }
                } else if (yr) {
                    if (report.get('year') == yr) {
                        $("#reports .thumbnail." + yr).show();
                        return true;
                    }
                } else if (mth) {
                    if (report.get('month') == mth) {
                        $("#reports .thumbnail." + mth).show();
                        return true;
                    }
                } else {
                    $("#reports .thumbnail").show();
                    //return full list
                    return true;
                }
            });
        }
    });

    // display report
    $.report.CustomReportView = $.app.BaseView.extend({
        tagName: "li",

        className: "report span5",

        template: JST["report/customreport/show"],

        initialize: function (options) {
            _.bindAll(this, 'render', 'deleteReport', 'synchModel');
            this.model.bind('error', this.error);
        },

        events: {
            'click #deleteReport': 'deleteReport'
        },

        render: function () {
            $(this.el).append(this.template({
                obj: this.model.toJSON()
            }));

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

            return this;
        },

        deleteReport: function () {
            //remove the document from the collection
            this.collection.remove(this.model);
            this.model.destroy();
            //remove the view
            this.remove();
        }
    });

    // models (local) ////////////////////////////////////////////////////////

    // router ////////////////////////////////////////////////////////

    // application frame
})(jQuery);
