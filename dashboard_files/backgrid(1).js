/*
 * Copyright (C) 2012 Interpreter Intelligence <support@interpreterintelligence.com>
 *
 * <copyright notice>
 *
 * js/app/common/backgrid.js
 *
 */
(function ($) { //# sourceURL=js/app/common/backgrid.js

    /* enable strict mode */
    "use strict";

    $.app.backgrid = {};
    $.app.backgrid.mixin = {};


    // custom paginator to support template settings <@ @>, overriding the template
    $.app.backgrid.Paginator = Backgrid.Extension.Paginator.extend({
        template: JST['app/backgrid/paginator/show'],

        events: {
            "click a": "changePage",
            "change .pageSize": "changePageSize",
            "change .currentPage": "jumpPage"
        },

        changePageSize: function (evt) {
            var size = evt.currentTarget.value;
            if (size) {
                // don't call getFirstPage(), setPageSize makes the refetch
                // otherwise causes 2 server calls whenever the page size is changed
                this.collection.setPageSize(parseInt(size, 10));
                //this.collection.getFirstPage();
            }
        },

        jumpPage: function (evt) {
            var changed = evt.currentTarget;
            var page = parseInt($(changed).val(), 10);

            var collection = this.collection;
            var state = collection.state;

            if (_.isNumber(page) && page > 0 && page <= state.lastPage) {
                var pageIndex = +page;
                collection.getPage(state.firstPage === 0 ? pageIndex - 1 : pageIndex);
            } else {
                // do nothing
            }
        },

        /**
         Render the paginator handles inside an unordered list.
         */
        render: function () {
            this.$el.empty();

            this.$el.append(this.template({
                handles: this.makeHandles(),
                state: this.collection.state
            }));

            this.delegateEvents();

            return this;
        }
    });

    /**
     * override select cell editor to provide custom template
     * @type {*}
     */
    $.app.backgrid.SelectCellEditor = Backgrid.SelectCellEditor.extend({
        events: {
            "change": "save"
        },

        /** @property {function(Object, ?Object=): string} template */
        template: _.template('<option value="<@- value @>" <@= selected ? \'selected="selected"\' : "" @>><@- text @></option>')
    });

    /**
     * custom row to generate click event on collection and mark row as selected
     * @type {*}
     */
    $.app.backgrid.ClickableRow = Backgrid.Row.extend({
        events: {
            "click": "onClick"
        },
        onClick: function () {

            // could use App.marionette if assumes marionette will always be used
            if (this.context) {
                Backbone.trigger(this.context + ":rowSelected", this.model);
            } else {
                Backbone.trigger("rowSelected", this.model);
                //this.model.trigger("rowclicked", this.model);
            }

            this.$el.closest(".backgrid").find("tr").removeClass("selected");
            this.$el.addClass("selected");
        }

    });

    $.app.backgrid.InvoiceIdClickableRow = Backgrid.Row.extend({
        events: {
            "click": "onClick"
        },
        onClick: function () {
            var that = this;
            var invoice = new $.core.Invoice({
                id: this.model.get("id")
            });
            invoice.fetch({
                wait: true,
                silent: true,
                success: function (model) {
                    // could use App.marionette if assumes marionette will always be used
                    Backbone.trigger("rowSelected", model);
                    //this.model.trigger("rowclicked", this.model);

                    that.$el.closest(".backgrid").find("tr").removeClass("selected");
                    that.$el.addClass("selected");
                },
                error: handleError
            });
        }

    });

    $.app.backgrid.PaymentIdClickableRow = Backgrid.Row.extend({
        events: {
            "click": "onClick"
        },
        onClick: function () {
            var that = this;
            var invoice = new $.core.Payment({
                id: this.model.get("id")
            });
            invoice.fetch({
                wait: true,
                silent: true,
                success: function (model) {
                    // could use App.marionette if assumes marionette will always be used
                    Backbone.trigger("rowSelected", model);
                    //this.model.trigger("rowclicked", this.model);

                    that.$el.closest(".backgrid").find("tr").removeClass("selected");
                    that.$el.addClass("selected");
                },
                error: handleError
            });
        }

    });

    /**
     * make a list for a select control for back grid based on an object containing the list.
     *
     * @param arrayList object containing the different options
     *
     * @returns string representing the list to show
     */
    $.app.backgrid.makeEditList = function (arrayList) {

        var editList = [];

        // name, vale
        editList.push(["", "all"]);

        var listKeys = keys(arrayList);

        for (var i = 0; i < listKeys.length; i++) {

            editList.push([arrayList[listKeys[i]].name, arrayList[listKeys[i]].id]);
        }

        return editList;
    };

    /**
     *
     * return the html for verified cell based on the value passed in, the JSON representation of the model is also passed
     *
     * @type {*}
     */
    $.app.backgrid.invalidFieldsFormatter = function (val, model) {
        if (val && val.length) {
            var title = "Invalid fields: " + val.join(" ");
            return "<div title='" + title + "' class='field-error'>&nbsp;&nbsp;</div>";
        } else {
            return "<div title='No invalid fields'>&nbsp;&nbsp;</div>";
        }
    };

    /**
     *
     * return the html for verified cell based on the value passed in, the JSON representation of the model is also passed
     *
     * @type {*}
     */
    $.app.backgrid.verifiedFormatter = function (val, model) {
        if (val === true || val === 1) {
            return "<div id='eligible-" + model.id + "' style='cursor: pointer;' class='eligible field-check' title='click to verify booking for payment'>&nbsp;&nbsp;</div>";
        } else {
            return "<div id='eligible-" + model.id + "' style='cursor: pointer;' class='eligible field-error' title='click to verify booking for payment'>&nbsp;&nbsp;</div>";
        }
    };

    /**
     *
     * return the html for comments cell based on the value passed in, the JSON representation of the model is also passed
     *
     * @type {*}
     */
    $.app.backgrid.commentsFormatter = function (val, model) {

        return '<span class="comments-count-container-' + val + '"></span>';
    };

    /**
     *
     * return the html for flagged for finance cell based on the value passed in, the JSON representation of the model is also passed
     *
     * @type {*}
     */
    $.app.backgrid.flagForFinanceFormatter = function (val, model) {

        if (val === true || val === 1) {

            return '<i class="icon-flag" title="Customer or interpreter override specified"></i>';

        } else {

            return '';
        }
    };

    /**
     *
     * return the html for exclude from auto offer cell based on the value passed in, the JSON representation of the model is also passed
     *
     * @type {*}
     */
    $.app.backgrid.excludeFromAutoOfferFormatter = function (val, model) {

        if (val === true || val === 1) {

            return "<div id='eligible-" + model.id + "' style='cursor: pointer;' class='eligible field-check' title='click to verify booking for payment'>&nbsp;&nbsp;</div>";

        } else {

            return '';
        }
    };


    /* **********************************************************
     * Custom cell editors
     */
    $.app.backgrid.DateCellEditor = Backgrid.InputCellEditor.extend({

        events: {
            "change": "saveOrCancel"
        },

        postRender: function (model, column) {

            Backgrid.InputCellEditor.prototype.postRender.apply(this, arguments);

            dateSearchInit(this.$el);

            return this;
        },

        /**
         * override saveOrCancel to pass model to toRaw
         * @param e
         */
        saveOrCancel: function (e) {

            var evt = jQuery.Event("keydown", {
                keyCode: 13
            });
            Backgrid.InputCellEditor.prototype.saveOrCancel.apply(this, [evt]);

        }
    });

    /* **********************************************************
     * Custom rows
     */
    $.app.backgrid.SearchableHeader = Backgrid.Header.extend({
        //proto:$.core.Invoice,
        initialize: function (options) {

            Backgrid.Header.prototype.initialize.apply(this, arguments);

            var that = this;

            // initialize dummy model to back cell
            this.model = new this.collection.model();

            // if search is to be saved across page loads, load from cookie
            if (this.persistent === true) {
                var searchDefaults = new Prefs({
                    name: this.name,
                    data: {}

                });
                // load any previously stored filters
                searchDefaults.load();

                // populate the model with search defaults
                if (searchDefaults.data.model) {
                    this.model.set(searchDefaults.data.model);
                }

                // get saved state
                if (searchDefaults.data.pageSize) {
                    this.collection.state.pageSize = searchDefaults.data.pageSize;
                }
                if (searchDefaults.data.currentPage) {
                    this.collection.state.currentPage = searchDefaults.data.currentPage;
                }
                if (searchDefaults.data.totalRecords) {
                    this.collection.state.totalRecords = searchDefaults.data.totalRecords;
                }

                if (searchDefaults.data.sortKey) {
                    that.collection.state.sortKey = searchDefaults.data.sortKey;
                    that.collection.state.order = searchDefaults.data.order;
                    switch (searchDefaults.data.order) {
                    case 1:
                        this.collection.setSorting(searchDefaults.data.sortKey, "desc");
                        break;
                    case -1:
                        this.collection.setSorting(searchDefaults.data.sortKey);
                        break;
                    case "desc":
                        this.collection.setSorting(searchDefaults.data.sortKey, "desc");
                        break;
                    default:
                        break;
                    }
                }

                // register unload event to save the model state
                //functions to invoke before unloading the window
                $(window).unload(function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();

                    // save search filters
                    var searchDefaults = new Prefs({
                        name: that.name,
                        data: {
                            model: that.model.attributes,
                            pageSize: that.collection.state.pageSize,
                            totalRecords: that.collection.state.totalRecords,
                            /* required to be set by pagable-collection */
                            sortKey: that.collection.state.sortKey ? that.collection.state.sortKey : null,
                            order: that.collection.state.order
                        }
                    });
                    searchDefaults.save(null, App.config.forwardURI);
                });
            }

            // add search row
            this.searchRow = new $.app.backgrid.HeaderSearchRow({
                columns: this.columns,
                model: this.model,
                collection: this.collection,
                name: this.name,
                persistent: this.persistent

            });
            return this;
        },

        /**
         Renders this table head with a single row of header cells.
         */
        render: function () {

            Backgrid.Header.prototype.render.apply(this, arguments);

            this.$el.append(this.searchRow.render().$el);
            this.delegateEvents();
            return this;
        },

        /**
         Clean up this header and its row.

         @chainable
         */
        remove: function () {
            this.searchRow.remove.apply(this.searchRow, arguments);

            return Backgrid.Header.prototype.remove.apply(this, arguments);
        }
    });

    /**
     * formatter for search cell is simple pass through
     */
    $.app.backgrid.SearchCellFormatter = function () {};
    _.extend($.app.backgrid.SearchCellFormatter.prototype, {

        fromRaw: function (rawValue, model) {

            if (_.isUndefined(rawValue)) {
                return "";
            } else {
                return rawValue;
            }
        },
        toRaw: {
            toRaw: function (formattedValue, model) {

                return formattedValue;
            }
        }
    });

    /**
     * mixin for search cell editor
     * @type {*}
     */
    $.app.backgrid.mixin.searchCellEditorMixin = {

        events: {
            'keyup': 'searchOrCancel',
            'change': 'searchOrCancel'
        },

        formatter: $.app.backgrid.SearchCellFormatter,

        searchOrCancel: function (e) {

            var formatter = this.formatter;
            var model = this.model;
            var column = this.column;

            var command = new Backgrid.Command(e);

            e.preventDefault();
            e.stopPropagation();

            var val = this.$el.val();
            var newValue = _.isFunction(formatter.toRaw) ? formatter.toRaw(val, this.model) : val;
            if (_.isUndefined(newValue)) {
                model.trigger("backgrid:error", model, column, val);
            } else {
                var existingValue = model.get(column.get("name"));

                // if values differ, save and trigger search
                if (existingValue !== newValue) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:searched", model, column, this /* cell */ , command);
                }
            }
        }
    };

    /**
     *
     * @type {*}
     */
    $.app.backgrid.mixin.searchCellMixin = {
        tagName: "th",

        formatter: $.app.backgrid.SearchCellFormatter,

        initialize: function (options) {

            var that = this;
            var Cell = this.options.parentCell;
            Cell.prototype.initialize.apply(this, arguments);

            // override the cell formatter to use SearchCellFormatter
            this.formatter = new $.app.backgrid.SearchCellFormatter();

            var editor = this.editor || {
                prototype: {}
            };

            // extend the editor with the filter events
            this.editor = this.editor ? this.editor.extend($.app.backgrid.mixin.searchCellEditorMixin) : null;

            // if the model has a value, add a filter to search row
            var val = _.isFunction(this.formatter.fromRaw) ? this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) : this.model.get(this.column.get("name"));
            if (val) {
                this.options.searchRow.addFilter(this.model, this.column, this, null /* command object */ , true /* skip filter */ );
            }
        },

        /**
         * similar to enter edit mode using search events
         */
        enterSearchMode: function () {

            var model = this.model;
            var column = this.column;

            if (column.get("searchable")) {

                this.currentEditor = new this.editor({
                    column: this.column,
                    model: this.model,
                    formatter: new $.app.backgrid.SearchCellFormatter(),
                    search: true // pass in flag indicating in search mode
                });

                // call edit to ensure edit events are also fired
                model.trigger("backgrid:edit", model, column, this, this.currentEditor);
                model.trigger("backgrid:search", model, column, this, this.currentEditor);

                // Need to redundantly undelegate events for Firefox
                this.undelegateEvents();
                this.$el.empty();
                this.$el.append(this.currentEditor.$el);
                this.currentEditor.render();
                this.$el.addClass("editor");

                // call editing to ensure editing events are also fired
                model.trigger("backgrid:editing", model, column, this, this.currentEditor);
                model.trigger("backgrid:searching", model, column, this, this.currentEditor);

            } else {
                // not searchable so don't show anything in the call
                this.$el.text("");
            }
        },
        render: function () {
            var Cell = this.options.parentCell;
            Cell.prototype.render.apply(this, arguments);

            // enter search mode
            this.enterSearchMode();

            return this;
        }
    };

    $.app.backgrid.HeaderSearchRow = Backgrid.Row.extend({

        initialize: function () {

            Backgrid.Row.prototype.initialize.apply(this, arguments);

            // call timeOutFilter on search so typing in header adds 500ms timeout
            // prevents persistent search page reload from having timeout and making two calls to load results
            this.listenTo(this.model, "backgrid:searched", this.timeOutFilter);

            return this;
        },

        getCurrentFiltersJSON: function () {
            return JSON.parse(this.collection.queryParams.filters || "{}");
        },

        /*
         * override the tag name for search header and make editable
         */
        makeCell: function (column) {

            //var row = this;
            var Cell = column.get("cell");

            var SearchCell = Cell.extend($.app.backgrid.mixin.searchCellMixin);

            return new(SearchCell)({
                column: column,
                model: this.model,
                searchRow: this,
                parentCell: Cell
            });
        },

        filter: function () {

            // save the xhr to cancel later if new fetch initiated (e.g. new search, change in filters)
            if (window[this.options.name + 'XHRReq'] && window[this.options.name + 'XHRReq'].readyState > 0 && window[this.options.name + 'XHRReq'].readyState < 4) {

                window[this.options.name + 'XHRReq'].abort();
            }
            window[this.options.name + 'XHRReq'] = this.collection.getFirstPage({
                error: defaultFetchOptions.error
            });
        },

        timeOutFilter: function (model, column, cell, command, skipFilter) {
            // add timeout to search only if it's a typed filter, not persisted from page reload
            // typed search needs timeout to prevent partial searches being fired right away without the full search string
            var that = this;
            setTimeout(function () {
                that.addFilter(model, column, cell, command, skipFilter);
            }, 250);
        },

        addFilter: function (model, column, cell, command, skipFilter /* flag indicating whether search should be initiated */ ) {

            var formatter = cell.formatter || {};

            // retrieve search value from model or from formatter
            //var searchValue = _.isObject(model.get(column.get("name"))) ? model.get(column.get("name")).search : model.get(column.get("name"));
            var searchValue = _.isFunction(formatter.fromRaw) ? formatter.fromRaw(model.get(column.get("name")), model) : model.get(column.get("name"));

            // set search field name (use index if present, otherwise use name)
            var searchField = column.get("searchName") ? column.get("searchName") : column.get("name");

            var op = column.get("op") ? column.get("op") : "eq";
            //if there's a filter
            if (searchValue && searchValue.length > 1) {
                this.addDebounceFilter(model, column, cell, command, skipFilter, searchField, searchValue, op);
            } else if ((searchValue && isNumber(searchValue))) {
                // searches for things like status.id and bookings.id aren't always over 2 characters, so don't include them in the length filter above.
                this.addDebounceFilter(model, column, cell, command, skipFilter, searchField, searchValue, op);
            } else if (!searchValue) {
                this.removeDebounceFilter(model, column, cell, command, skipFilter, searchField, op);
            }
        },

        addDebounceFilter: function (model, column, cell, command, skipFilter, searchField, searchValue, op) {

            // remove existing filter by name from collection if present. this is to avoid the filters from being
            // in conflict e.g. side bar filters is expectedStartDate between dates, but search header filter is for
            // specific date. if search is initiated from header, then replace all filters from side bar with same name.
            // the removeDebounceFilter removes by field and operator
            this.collection.queryParams.filters = JSON.stringify(removeFilter(this.getCurrentFiltersJSON(), searchField)); // no operator, remove all named

            // set the filter directly on the collection
            this.collection.queryParams.filters = JSON.stringify(addOrUpdateFilter(this.getCurrentFiltersJSON(), searchField, op, searchValue));

            if (_.isUndefined(skipFilter) || skipFilter === false) {
                if (!this.debouncedFilter) {
                    this.debouncedFilter = _.debounce(_.bind(this.filter, this), 750);
                }
                this.debouncedFilter();
            }
        },

        removeDebounceFilter: function (model, column, cell, command, skipFilter, searchField, op) {
            // remove from collection also
            this.collection.queryParams.filters = JSON.stringify(removeFilter(this.getCurrentFiltersJSON(), searchField, op));

            if (_.isUndefined(skipFilter) || skipFilter === false) {
                if (!this.debouncedFilter) {
                    this.debouncedFilter = _.debounce(_.bind(this.filter, this), 750);
                }
                this.debouncedFilter();
            }
        }
    });

    $.app.backgrid.HighlightInvalidUpdatedRows = $.app.backgrid.ClickableRow.extend({
        render: function () {
            $.app.backgrid.HighlightInvalidUpdatedRows.__super__.render.apply(this, arguments);

            if (!this.model.get("valid") && this.model.get("invalidFields").indexOf("vosForm") != -1) {
                if (this.el.classList || this.el.classList !== undefined) {
                    this.el.classList.add("invalid");
                } else {
                    this.el.className += " invalid";
                }
            } else if (this.model.get("unarchivedUpdates")) {
                if (this.el.classList || this.el.classList !== undefined) {
                    this.el.classList.add("updated");
                } else {
                    this.el.className += " updated";
                }
            }
            return this;
        }
    });

    $.app.backgrid.FilterableColumnGrid = Backbone.View.extend({
        initialize: function (options) {
            var defaultCols = this.options.defaultColumns;
            var backgridColumns = jQuery.extend(true, {}, this.options.columns);
            var columns = [];
            var allCols = [];
            for (var key in defaultCols) {
                if (defaultCols.hasOwnProperty(key)) {
                    columns.push(defaultCols[key]);
                    allCols.push(defaultCols[key]);
                }
            }
            for (var prop in backgridColumns) {
                if (backgridColumns.hasOwnProperty(prop)) {
                    allCols.push(backgridColumns[prop]);
                }
            }
            var collection = this.options.collection;

            //Backbone.on("columnChange", collection.fetch());
            var name = this.options.name;
            var persistent = this.options.persistent;
            this.allCols = new Backgrid.Columns(allCols);
            var gridOptions = {
                header: $.app.backgrid.SearchableHeader.extend({
                    name: name,
                    persistent: persistent
                }),
                collection: collection,
                columns: columns,
                emptyText: "No jobs found"
            };
            // customised row passed in or defaults to Backgrid.Row
            if (this.options.row) {
                gridOptions.row = this.options.row;
            }

            this.grid = new Backgrid.Grid(gridOptions);

            this.paginator = new $.app.backgrid.Paginator({
                collection: this.collection,
                goBackFirstOnSort: false
            });

            this.key = this.options.key;
            var grid = this.grid;

            var collect = new Backbone.Collection(grid.columns.models);

            this.filters = new $.app.backgrid.ColumnFiltersView({
                grid: this.grid,
                collection: collect,
                defaultColumns: defaultCols,
                allCols: this.allCols,
                key: this.key
            });
            this.exportView = new $.app.backgrid.ExportView({
                collection: collection
            });

            var that = this;

            this.options.collection.on("backgrid:sort", function (columnName, direction, comparator, collection) {
                var i;
                for (i = 0; i < that.grid.header.row.cells.length; i++) {
                    if (that.grid.header.row.cells[i].column.attributes.sortName != columnName) {
                        that.grid.header.row.cells[i].$el.removeClass("descending");
                        that.grid.header.row.cells[i].$el.removeClass("ascending");
                    }
                }
            });
        },

        render: function () {
            this.$('.grid').append(this.grid.render().$el);
            this.$('.filter').append(this.filters.render().$el);
            this.$('.paginator').append(this.paginator.render().$el);
            if (this.key === "Diary" || this.key === "ManageJobs") {
                this.$('.export').append(this.exportView.render().$el);
            }

            if (this.options.collection.state.sortKey) {
                var i;
                for (i = 0; i < this.grid.header.row.cells.length; i++) {
                    if ((this.grid.header.row.cells[i].column.attributes.sortName == this.options.collection.state.sortKey || this.grid.header.row.cells[i].column.attributes.searchName == this.options.collection.state.sortKey || this.grid.header.row.cells[i].column.attributes.name == this.options.collection.state.sortKey) && this.options.collection.state.sortKey !== null) {
                        switch (this.options.collection.state.order) {
                        case 1:
                            this.grid.header.row.cells[i].$el.addClass("descending");
                            break;
                        case -1:
                            this.grid.header.row.cells[i].$el.addClass("ascending");
                            break;
                        case "desc":
                            this.grid.header.row.cells[i].$el.addClass("descending");
                            break;
                        default:
                            break;
                        }
                    }
                }
            }
        }
    });

    $.app.backgrid.ColumnFilterItemView = $.app.ItemView.extend({
        template: 'company/dashboard/filter',

        onRender: function () {
            this.formatElements();
            this.showSecured();
        }
    });

    $.app.backgrid.ColumnFiltersView = $.app.CompositeView.extend({
        template: 'company/dashboard/select',
        classname: 'list',
        itemView: $.app.backgrid.ColumnFilterItemView,
        itemViewContainer: '.select-list',

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            'change [type="checkbox"]': 'colSelect',
            "click .btn": 'stop',
            "click .preset": 'defaultColumns'
        },

        stop: function () {
            this.$('.dropdown-menu .column').click(function (e) {
                e.stopPropagation();
            });
        },

        colSelect: function () {
            var grid = this.options.grid;
            var columns = this.options.allCols.models; //grid.columns.models;
            var key = this.options.key;
            var saveCols = [];
            for (var i = 0; i < columns.length; i++) {
                if (this.model.get(columns[i].attributes.id) === true) {
                    console.log(columns[i].attributes.id);
                    columns[i].set("renderable", true);
                    if (grid.columns.models[i]) {
                        if ((columns[i].attributes.name == grid.columns.models[i].attributes.name) && (grid.columns.models[i].attributes.defaultColumn)) {
                            grid.columns.models[i].set("renderable", true);
                        }
                    }
                    grid.columns.add(columns[i]);
                    saveCols.push(columns[i].attributes.id);
                } else {
                    columns[i].set("renderable", false);
                    if (grid.columns.models[i]) {
                        if ((columns[i].attributes.name == grid.columns.models[i].attributes.name) && (grid.columns.models[i].attributes.defaultColumn)) {
                            grid.columns.models[i].set("renderable", false);
                        }
                    }
                }
            }
            $.app.common.save(key, saveCols);
        },

        defaultColumns: function () {
            var saveCols = [];
            var key = this.options.key;
            var grid = this.options.grid;
            var allCols = this.options.allCols.models; //grid.columns.models;
            var defaultCols = this.options.defaultColumns;
            for (var j = 0; j < allCols.length; j++) {
                for (var l = 0; l < defaultCols.length; l++) {
                    if (JSON.stringify(allCols[j].attributes.id) === JSON.stringify(defaultCols[l].id)) {
                        console.log(allCols[j].attributes.id);
                        allCols[j].set("renderable", true);
                        grid.columns.models[j].set("renderable", true);
                        this.model.set(allCols[j].attributes.id, true);
                        this.$("#" + allCols[j].attributes.id).attr("checked", true);
                        saveCols.push(allCols[j].attributes.id);
                        break;
                    } else {
                        allCols[j].set("renderable", false);
                        this.model.set(allCols[j].attributes.id, false);
                        this.$("#" + allCols[j].attributes.id).attr("checked", false);
                    }
                }
            }
            console.log(saveCols);
            $.app.common.save(key, saveCols);
        },

        initialize: function () {
            this.model = new Backbone.Model();
            var key = this.options.key;
            var grid = this.options.grid;
            var allCols = this.options.allCols.models; //grid.columns.models;
            var obj = $.app.common.load(key);
            var defaultCols = this.options.defaultColumns;
            if (obj !== null) {
                var cols = JSON.parse(obj);
                for (var i = 0; i < allCols.length; i++) {
                    for (var k = 0; k < cols.length; k++) {
                        if (JSON.stringify(allCols[i].attributes.id) === JSON.stringify(cols[k])) {
                            allCols[i].set("renderable", true);
                            if (grid.columns.models[i]) {
                                if ((allCols[i].attributes.name == grid.columns.models[i].attributes.name) && (grid.columns.models[i].attributes.defaultColumn)) {
                                    grid.columns.models[i].set("renderable", true);
                                }
                            }
                            this.model.set(allCols[i].attributes.id, true);
                            grid.columns.add(allCols[i]);
                            this.$("#" + allCols[i].attributes.id).attr("checked", true);
                            break;
                        } else {
                            allCols[i].set("renderable", false);
                            if (grid.columns.models[i]) {
                                if ((allCols[i].attributes.name == grid.columns.models[i].attributes.name) && (grid.columns.models[i].attributes.defaultColumn)) {
                                    allCols[i].set("renderable", false);
                                    grid.columns.models[i].set("renderable", false);
                                }
                            }
                            this.model.set(allCols[i].attributes.id, false);
                            this.$("#" + allCols[i].attributes.id).attr("checked", false);
                        }
                    }
                }
            } else {
                for (var j = 0; j < allCols.length; j++) {
                    for (var l = 0; l < defaultCols.length; l++) {

                        if (JSON.stringify(allCols[j].attributes.id) === JSON.stringify(defaultCols[l].id)) {
                            allCols[j].set("renderable", true);
                            this.model.set(allCols[j].attributes.id, true);
                            this.$("#" + allCols[j].attributes.id).attr("checked", true);
                            break;
                        } else {
                            allCols[j].set("renderable", false);
                            this.model.set(allCols[j].attributes.id, false);
                            this.$("#" + allCols[j].attributes.id).attr("checked", false);
                        }
                    }
                }
            }
            allCols = _.sortBy(allCols, function (o) {
                return o.attributes.defaultColumn;
            });
            this.options.collection.models = allCols;
        },


        onRender: function () {
            return this;
        }
    });

    $.app.backgrid.ExportView = $.app.ItemView.extend({
        template: 'company/dashboard/export',
        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .exportCmd": 'exportCmd'
        },

        exportCmd: function (evt) {
            var format = $(evt.target).data('format') ? $(evt.target).data('format') : "";
            var collection = this.options.collection;
            var queryFilters = collection.queryParams.filters;

            var params = {
                "company.id": App.config.company.id,
                "export": "all",
                "rows": 2000,
                "page": 1,
                "sidx": "expectedStartDate",
                "oper": "excel",
                "filters": queryFilters
            };

            // booking export
            var bookings = new $.report.Runner({
                baseUrl: App.config.context + '/api/export/bookings',
                format: format,
                params: params,
                asynch: true
            });

            // for fast export use onlySQL:true
            var attributes = new $.core.AttributeSelection({
                onlySQL: false
            });
            attributes.fetch({
                success: function () {
                    var selectAttributesView = new $.common.SelectAttributesView({
                        collection: attributes,
                        reportRunner: bookings,
                        jobsCollection: collection
                    });

                    var modal = new Backbone.BootstrapModal({
                        title: 'Booking export',
                        content: selectAttributesView,
                        cancelText: false
                    });

                    modal.open();

                    modal.on('ok', function () {
                        selectAttributesView.exportReport();
                    });

                    selectAttributesView.on('ok', function () {
                        modal.close();
                    });
                }
            });
        }
    });


    $.app.backgrid.ExpandoCell = Backgrid.Cell.extend({
        render: function () {
            this.$el.empty();
            var new_el = $('<span class="toggle">' + _.escape(this.formatter.fromRaw(this.model.get(this.column.get('name')))) + '</span>');

            this.$el.append(new_el);
            this.delegateEvents();
            return this;
        },

        events: {
            "click .toggle": "toggleDetails"
        },

        toggleDetails: function () {
            /* if there's details data already stored, then we'll remove it */
            if (this.$detailsRow) {
                this.column.get('destroy')(this.$detailsRow.find('td'), this.model, this);
                this.$detailsRow.remove();
                this.$detailsRow = null;
            } else {
                /* build a jquery object for the new row... something like: */
                this.$detailsRow = $('<tr><td colspan="7" class="expando-row"></td></tr>');
                /* plop that new row right after the row where the click was triggered */
                this.$el.closest('tr').after(this.$detailsRow);
                /* this is the magickal part: 'subtable' is a function that takes in the jquery element of the target td, and the
                   model for the row, and it is set when you define your columns.  render the new table in that td using
                   the models data (or whatever else you want to do)
                   */
                this.column.get('create')(this.$detailsRow.find('td'), this.model, this);
            }
        },
        remove: function () {
            if (this.$detailsRow) {
                this.column.get('destroy')(this.$detailsRow.find('td'), this.model, this);
                this.$detailsRow.remove();
                this.$detailsRow = null;
            }
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    $.app.backgrid.CancellationReasonCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.cancellationReasons);
        },
        render: function () {
            this.$el.empty();

            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) || null;
            this.$el.append(cancellationReasonFormatter(formattedValue, {}, this.model.toJSON()));

            this.delegateEvents();
            return this;
        },
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    return rawData.name;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.cancellationReason, formattedData);
            }
        }
    });

    $.app.backgrid.UnfulfilledReasonCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.unfulfilledReasons);
        },
        render: function () {
            this.$el.empty();

            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) || null;
            this.$el.append(cancellationReasonFormatter(formattedValue, {}, this.model.toJSON()));

            this.delegateEvents();
            return this;
        },
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    return rawData.name;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.unfulfilledReason, formattedData);
            }
        }
    });

    $.app.backgrid.GenderCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,
        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.gender);
        },
        render: function () {
            this.$el.empty();

            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) || null;

            this.$el.append(genderSelectFormatter(formattedValue, {}, this.model.toJSON()));

            this.delegateEvents();
            return this;
        },
        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData.name;
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("genderRequirement");
                }
            }
        }
    });

    //$.app.backgrid.BookingStatusCell = $.app.backgrid.SelectCell.extend({
    $.app.backgrid.BookingStatusCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.bookingStatus);
        },
        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) || null;

            this.$el.append(bookingStatusFormatter(formattedValue, {}, this.model.toJSON()));

            this.delegateEvents();
            return this;
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData && rawData.id) {
                    return rawData.id.toString();
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.bookingStatus, formattedData);
            }
        }
    });

    $.app.backgrid.InterpreterLanguageMappingRatingCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return [
                ["", "all"],
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"]
            ];
        }
    });

    $.app.backgrid.BookingModeCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.bookingMode);
        },

        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) || null;

            this.$el.append(bookingModeFormatter(formattedValue, {}, this.model.toJSON()));

            this.delegateEvents();
            return this;
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.bookingMode, formattedData);
            }
        }
    });

    $.app.backgrid.PayableItemTypeCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.payableItemType);
        },

        render: function () {
            this.$el.empty();

            var formattedValue = this.model.get(this.column.get("name")) ? this.model.get(this.column.get("name")).name : null;

            this.$el.append(_.escape(formattedValue));

            this.delegateEvents();
            return this;
        },

        readFromCompany: function (model, column, cell, editor) {
            if (column.get("name") == this.column.get("name")) {
                if (this.model.get("ratePlan.id")) {
                    //copy from companythis
                    var companyPIT = new $.core.CompanyPayableItemTypeCollection();
                    // local variables
                    var filters = {
                        groupOp: "AND",
                        rules: []
                    };

                    filters = addOrUpdateFilter(filters, "ratePlan.id", "eq", "null");
                    filters = addOrUpdateFilter(filters, "company.id", "eq", this.model.get("company.id"));
                    filters = addOrUpdateFilter(filters, "payableItemType.id", "eq", this.model.get("payableItemType").id);

                    companyPIT.queryParams.filters = JSON.stringify(filters, null, "\t");
                    var that = this;
                    companyPIT.fetch({
                        success: function (collection, response) {
                            if (collection.length > 0) {
                                that.model.set({
                                    enabled: true,
                                    description: collection.models[0].get("description"),
                                    billable: collection.models[0].get("billable"),
                                    payable: collection.models[0].get("payable"),
                                    taxable: collection.models[0].get("taxable"),
                                    taxName: collection.models[0].get("taxName"),
                                    taxRate: collection.models[0].get("taxRate"),
                                    cap: collection.models[0].get("cap"),
                                    accountsPayableCode: collection.models[0].get("accountsPayableCode"),
                                    accountsReceivableCode: collection.models[0].get("accountsReceivableCode")
                                });
                            }
                        }
                    });

                }
            }
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData && rawData.id) {
                    return rawData.id.toString();
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.payableItemType, formattedData);
            }
        }
    });

    $.app.backgrid.EmploymentCategoryCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.employmentCategory);
        },

        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) || null;

            this.$el.append(employmentCategoryFormatter(formattedValue, {}, this.model.toJSON()));

            this.delegateEvents();
            return this;
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData && rawData.id) {
                    return rawData.id.toString();
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.employmentCategory, formattedData);
            }
        }
    });

    $.app.backgrid.GenericSelectCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(this.column.get("source"));
        },

        render: function () {
            var attributeValue = this.model.get(this.column.get("name"));
            var attributePath = this.column.get("path");
            var source = this.column.get("source");
            var cssClass = getNestedProp(this.column.attributes, "formatteroptions.cssClass", "");
            var id = this.column.get("id"); // Used to get the cache key in genericCellFormatter

            var formattedValue = attributeValue && _.isEmpty(attributePath) ?
                this.formatter.fromRaw(attributeValue) || null :
                this.formatter.fromRaw(getNestedProp(this.model.attributes, attributePath, null));

            var valueToAppend = genericCellFormatter(formattedValue, {
                "source": source,
                "formatteroptions": {
                    "cacheKey": id,
                    "cssClass": cssClass
                }
            });

            this.$el.empty().append(valueToAppend);

            this.delegateEvents();
            return this;
        },

        formatter: {
            fromRaw: function (rawData) {
                if (rawData && rawData.id) {
                    return rawData.id;
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData) {
                return getStatusAttributeById(this.column.get("source"), formattedData, "name");
            }
        }
    });


    $.app.backgrid.BusinessUnitCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.businessUnit);
        },

        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.formatBusinessUnit(this.model.get(this.column.get("name")), this.model)) || null;

            this.$el.append(_.escape(formattedValue), {}, this.model.toJSON());

            this.delegateEvents();
            return this;
        },

        formatBusinessUnit: function (rawData) {
            if (rawData) {
                return "<div id='" + rawData.id + "' class='' title='" + rawData.description + "'>" + rawData.nameKey + "</div>";
            } else {
                return "";
            }
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData && rawData.id) {
                    return rawData.id.toString();
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.businessUnit, formattedData);
            }
        }
    });

    //$.app.backgrid.InvoiceStatusCell = $.app.backgrid.SelectCell.extend({
    $.app.backgrid.InvoiceStatusCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.invoiceStatus);
        },

        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);

            if (formattedValue) {
                this.$el.append(invoiceStatusFormatter(formattedValue, {}, this.model.toJSON()));
            }

            this.delegateEvents();
            return this;
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData && rawData.id) {
                    return rawData.id.toString();
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.invoiceStatus, formattedData);
            }
        }
    });

    $.app.backgrid.InvalidFieldsCell = Backgrid.Cell.extend({
        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);

            // check for undefined
            if (!_.isUndefined(formattedValue)) {
                this.$el.append($.app.backgrid.invalidFieldsFormatter(formattedValue, this.model.toJSON()));
            }

            this.delegateEvents();
            return this;
        }
    });

    //$.app.backgrid.PaymentStatusCell = $.app.backgrid.SelectCell.extend({
    $.app.backgrid.PaymentStatusCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.paymentStatus);
        },

        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);

            if (formattedValue) {
                this.$el.append(paymentStatusFormatter(formattedValue, {}, this.model.toJSON()));
            }

            this.delegateEvents();
            return this;
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData && rawData.id) {
                    return rawData.id.toString();
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.paymentStatus, formattedData);
            }
        }
    });

    $.app.backgrid.VerifiedCell = Backgrid.Cell.extend({

        render: function () {

            this.$el.empty();

            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);
            if (_.isArray(formattedValue)) {
                // if verified cell is extended from BooleanCell for filtering the boolean is returned in an Array
                formattedValue = _.first(this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model));
            }

            // check for undefined
            if (!_.isUndefined(formattedValue)) {
                this.$el.append($.app.backgrid.verifiedFormatter(formattedValue, this.model.toJSON()));
            }

            this.delegateEvents();
            return this;
        }
    });

    $.app.backgrid.CommentsCell = Backgrid.Cell.extend({

        events: {
            "click span.badge": "showComments"
        },

        render: function () {

            this.$el.empty();

            // comments are stored off superBooking
            if (this.model.get("superBooking")) {
                this.$el.append($.app.backgrid.commentsFormatter(this.model.get("superBooking").id, this.model.toJSON()));
            }

            this.delegateEvents();
            return this;
        },

        showComments: function () {

            if (this.model.get("superBooking")) {

                var comments = new $.core.CommentCollection([], {
                    parentEntityType: "superBooking",
                    parentEntityId: this.model.get("superBooking").id
                });

                var commentsPopupView = new $.common.CommentsPopupView({
                    model: this.model,
                    collection: comments
                });

                commentsPopupView.render();
            }
        }

    });


    $.app.backgrid.BooleanCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            var options = [
                ["", "all"],
                ["Yes", "true"],
                ["No", "false"]
            ];
            return options;
        },
        render: function () {

            this.$el.empty();

            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);

            // check for undefined
            if (!_.isUndefined(formattedValue)) {
                this.$el.append(_.escape(formattedValue), {}, this.model.toJSON());
            }

            this.delegateEvents();
            return this;
        }
    });

    $.app.backgrid.JobOfferExcludeFromCell = Backgrid.Cell.extend({

        render: function () {

            this.$el.empty();

            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);

            // check for undefined
            if (!_.isUndefined(formattedValue)) {
                this.$el.append($.app.backgrid.excludeFromAutoOfferFormatter(formattedValue, this.model.toJSON()));
            }

            this.delegateEvents();
            return this;
        }
    });

    $.app.backgrid.FlagForFinanceCell = Backgrid.Cell.extend({

        render: function () {

            this.$el.empty();

            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);

            // check for undefined
            if (!_.isUndefined(formattedValue)) {
                this.$el.append($.app.backgrid.flagForFinanceFormatter(formattedValue, this.model.toJSON()));
            }

            this.delegateEvents();
            return this;
        }
    });

    /**
     * generic cell which calls format cell to format cell
     *
     * TODO: is it necessary to extend from StringCell? not sure what we're getting
     *
     * @type {*}
     */
    $.app.backgrid.GenericCell = Backgrid.StringCell.extend({

        initialize: function () {
            Backgrid.StringCell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);

            this.listenTo(this.model, "backgrid:edit", this.editMe);
        },

        formatter: new Backgrid.CellFormatter(),

        editMe: function (m, col, cell, editor) {
            this.$("[title]").tooltip("destroy");

            return this;
        },

        render: function () {

            var that = this;

            this.$el.empty();
            var val = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model);
            var html = _.isUndefined(this.cellFormatter) ? this.cellFormatters.genericFormatter.apply(this, [val]) : this.cellFormatters[this.cellFormatter].apply(this, [val]);
            this.$el.html(html);

            // add any popup functionality
            this.$(".gridiFramePopup").colorbox({
                iframe: true,
                innerWidth: App.config.popups.cal.width,
                innerHeight: App.config.popups.cal.height,
                open: false,
                returnFocus: false
            });
            //
            this.$(".gridPopup").colorbox();

            var formatterOptions = this.column.get("formatterOptions") || this.formatterOptions || {};

            // add bootstrap tooltip
            this.$("[title]").tooltip({
                placement: formatterOptions.tooltipPlacement ? formatterOptions.tooltipPlacement : "right"
            });

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        cellFormatters: {
            /*
             * format a back grid cell, supporting various format options:
             * - whenEmpty: value to display when empty
             * - tooltip: the field from model to use as a tooltip or function to execute to get same
             * - length: the length of the field to display (will truncate and show full text in tooltip)
             * - link: a link to wrap the cell contents in
             *     - url: url to use
             *     - context: context parameter to pass, can be a field or a function (model passed as param)
             *    - className: a css class to add to link (defaults to gridPopup if missing)
             *
             */
            genericFormatter: function (val) {
                var formatterOptions = this.column.get("formatterOptions") || this.formatterOptions || {};

                //var val = this.model.get(this.column.get("name"));
                var displayVal = val;
                var missing = false;

                if (!val) {
                    missing = true;
                }

                if (missing) {
                    // get replacement
                    if (formatterOptions.whenEmpty) {
                        // apply fromRaw is value retrieved directly from model
                        displayVal = _.isFunction(formatterOptions.whenEmpty) ? formatterOptions.whenEmpty(this.model) : this.formatter.fromRaw(this.model.get(formatterOptions.whenEmpty), this.model);
                    }
                }

                var title = displayVal;

                if (formatterOptions.tooltip) {
                    // set tooltip
                    title = _.isFunction(formatterOptions.tooltip) ? formatterOptions.tooltip(this.model) : this.model.get(formatterOptions.tooltip);

                    // check for undefined / null return
                    title = title ? title : displayVal;
                }

                // truncate text
                if (displayVal && formatterOptions.length && displayVal.length > formatterOptions.length) {
                    displayVal = displayVal.substring(0, formatterOptions.length - 3) + "&hellip;";
                }

                var html;
                var url;

                //displayVal = this.cellFormatters.wrapLink(formatterOptions, displayVal);

                // if there's a link property
                if (formatterOptions.link) {
                    url = formatterOptions.link.url;
                    // if there's an id to insert
                    if (formatterOptions.link.context) {

                        // get the context value to pass to the link
                        var contextValue = _.isFunction(formatterOptions.link.context) ? formatterOptions.link.context(this.model) : this.model.get(formatterOptions.link.context);
                        if (url.indexOf("{id}") != -1) {
                            // replace the id
                            url = url.replace("{id}", contextValue);
                        } else {
                            // append to end
                            url = url + contextValue;
                        }
                    }

                    // The noLink property is for when we are using the link formatterOption but do not want a href generated
                    // TODO Should really come up with new formatterOption instead of using link at all
                    var href = ' href=' + url;
                    if (formatterOptions.link.noLink) {
                        href = '';
                    }

                    if (formatterOptions.link.className) {
                        displayVal = "<a class='" + formatterOptions.link.className + "'" + href + ">" + (displayVal) + "</a>";
                    } else {
                        displayVal = "<a" + href + ">" + (displayVal) + "</a>";
                    }
                }

                if (missing) {

                    if (displayVal && (_.isUndefined(formatterOptions.whenEmptyShowError) || formatterOptions.whenEmptyShowError === true)) {
                        html = "<span style='color: red; font-weight: bold;' title='" + htmlEscape(title) + "'>" + (displayVal) + "</span>";
                    } else if (displayVal && formatterOptions.whenEmptyShowError === false) {
                        html = "<span title='" + htmlEscape(title) + "'>" + (displayVal) + "</span>";
                    } else {
                        html = "<span class='field-error'>&nbsp;</span>";
                    }
                } else {

                    if (formatterOptions.popoverContent) {

                        html = "<span title='" + htmlEscape(title) + "' class='popover'>" + (displayVal) + "</span>";

                    } else {

                        html = "<span title='" + htmlEscape(title) + "'>" + (displayVal) + "</span>";
                    }

                }

                return html;
            },
            /**
             * surronds the generic formatter with a wrapper showing the type
             * @param val
             */
            bookingModeFormatter: function (val) {

                var mode = this.model.get("bookingMode") || {};

                // call generic formatter
                var html = this.cellFormatters.genericFormatter.apply(this, [val]);

                if (App.dict.bookingMode.phone && mode.id === App.dict.bookingMode.phone.id) {
                    html = "<div class='phone'>" + html + "</div>";
                } else if (App.dict.bookingMode.phoneScheduled && mode.id === App.dict.bookingMode.phoneScheduled.id) {
                    html = "<div class='phone'>" + html + "</div>";
                } else if (App.dict.bookingMode.video3rd && mode.id === App.dict.bookingMode.video3rd.id) {
                    html = "<div class='video'>" + html + "</div>";
                } else if (App.dict.bookingMode.phone3rd && mode.id === App.dict.bookingMode.phone3rd.id) {
                    html = "<div class='phone'>" + html + "</div>";
                } else if (App.dict.bookingMode.inperson && mode.id === App.dict.bookingMode.inperson.id) {
                    html = "<div class='person'>" + html + "</div>";
                } else if (App.dict.bookingMode.opi && mode.id === App.dict.bookingMode.opi.id) {
                    html = "<div class='phone'>" + html + "</div>";
                } else if (App.dict.bookingMode.video && mode.id === App.dict.bookingMode.video.id) {
                    html = "<div class='video'>" + html + "</div>";
                } else if (App.dict.bookingMode.vri && mode.id === App.dict.bookingMode.vri.id) {
                    html = "<div class='video'>" + html + "</div>";
                } else if (App.dict.bookingMode.mr && mode.id === App.dict.bookingMode.mr.id) {
                    html = "<div class='envelope'>" + html + "</div>";
                } else if (App.dict.bookingMode.cmr && mode.id === App.dict.bookingMode.cmr.id) {
                    html = "<div class='envelope'>" + html + "</div>";
                } else if (App.dict.bookingMode.court && mode.id === App.dict.bookingMode.court.id) {
                    html = "<div class='legal'>" + html + "</div>";
                } else if (App.dict.bookingMode.conference && mode.id === App.dict.bookingMode.conference.id) {
                    html = "<div class='group'>" + html + "</div>";
                } else if (App.dict.bookingMode.group && mode.id === App.dict.bookingMode.group.id) {
                    html = "<div class='group'>" + html + "</div>";
                } else if (App.dict.bookingMode.simultaneous && mode.id === App.dict.bookingMode.simultaneous.id) {
                    html = "<div class='group'>" + html + "</div>";
                } else {
                    html = "<div class='generic'>" + html + "</div>";
                }

                return html;
            },

            timeFormatter: function (val) {
                var cellValue = this.cellFormatters.genericFormatter.apply(this, [val]);
                var templateHelpers = $.app.mixins.templateHelpersMixin;
                var expectedStart = this.model.get("expectedStartDate");
                var expectedEnd = this.model.get("expectedEndDate");
                var actualStart = this.model.get("actualStartDate");
                var actualEnd = this.model.get("actualEndDate");
                var timeZone = this.model.get('timeZone');
                if (!actualStart || !actualEnd) {
                    cellValue = "<span title='" + timeZone + "<br/>&#013;Expected: " + templateHelpers.formatTime(expectedStart, timeZone) + " - " + templateHelpers.formatTime(expectedEnd, timeZone) + "' style='display: inline;'>" + val + "</span>";
                } else {
                    cellValue = "<span title='" + timeZone + "<br/>&#013;Expected: " + templateHelpers.formatTime(expectedStart, timeZone) + " - " + templateHelpers.formatTime(expectedEnd, timeZone) + "<br/>&#013;Actual: " + templateHelpers.formatTime(actualStart, timeZone) + " - " + templateHelpers.formatTime(actualEnd, timeZone) + "' style='display: inline;'>" + val + "</span>";
                }
                return cellValue;
            },

            interpreterFormatter: function (val) {
                var cellValue = this.cellFormatters.genericFormatter.apply(this, [val]);
                var mode = this.model.get("interpreter");
                if (mode) {
                    var interpreter;
                    cellValue = "<div>";
                    cellValue += "<a class='gridPopup' href='" + App.config.context + "/contact/numbers/" + (mode.id) + "' title='Contact Details'>";
                    cellValue += htmlEscape(mode.displayName ? mode.displayName : "");
                    cellValue += " <span class='secured secured-comp secured-cont'>(" + htmlEscape(mode.primaryNumber ? mode.primaryNumber.parsedNumber : "") + ") </span>";
                    cellValue += "</a>";
                    cellValue += "(<a class='gridiFramePopup' href='" + App.config.context + "/calendar/interpreter/" + (mode.id) + "/bookings' title='Interpreter Jobs'><span style='display: inline-block; vertical-align: middle;' class='icon ui-icon ui-icon-clock'></span>...</a>)";
                    cellValue += "</div>";
                } else {
                    cellValue = "<div class='field-error'>&nbsp;</div>";
                }
                return cellValue;
            },

            preferredInterpreterFormatter: function (val) {
                var cellValue = this.cellFormatters.genericFormatter.apply(this, [val]);
                var mode = this.model.get("preferredInterpreter");
                if (mode) {
                    cellValue = "<div>";
                    cellValue += "<a class='gridPopup' href='" + App.config.context + "/contact/numbers/" + (mode.id) + "' title='Contact Details'>";
                    cellValue += htmlEscape(mode.displayName ? mode.displayName : "");
                    cellValue += " <span class='secured secured-comp secured-cont'>(" + htmlEscape(mode.primaryNumber ? mode.primaryNumber.parsedNumber : "") + ") </span>";
                    cellValue += "</a>";
                    cellValue += "(<a class='gridiFramePopup' href='" + App.config.context + "/calendar/interpreter/" + (mode.id) + "/bookings' title='Interpreter Jobs'><span style='display: inline-block; vertical-align: middle;' class='icon ui-icon ui-icon-clock'></span>...</a>)";
                    cellValue += "</div>";
                } else {
                    cellValue = "<div class='field-error'>&nbsp;</div>";
                }
                return cellValue;
            },

            customerFormatter: function (val) {

                var mode = this.model.get("customer") || {};

                var cellValue = this.cellFormatters.genericFormatter.apply(this, [val]);
                if (this.model.get("numJobs") && this.model.get("numJobs") > 1) {
                    cellValue = "<a class='gridiFramePopup' href='" + App.config.context + "/calendar/recurring/" + this.model.get("id") + "' title='Recurring Jobs (Booking #" + this.model.get("superBooking").id + ")'><i class='icon-calendar'></i>&nbsp;</a>" + cellValue;
                }
                return cellValue;
            },

            billingCustomerFormatter: function (val) {

                var mode = this.model.get("billingCustomer") || {};

                var cellValue = this.cellFormatters.genericFormatter.apply(this, [val]);
                if (this.model.get("numJobs") && this.model.get("numJobs") > 1) {
                    cellValue = "<a class='gridiFramePopup' href='" + App.config.context + "/calendar/recurring/" + this.model.get("id") + "' title='Recurring Jobs (Booking #" + this.model.get("superBooking").id + ")'><i class='icon-calendar'></i>&nbsp;</a>" + cellValue;
                }
                return cellValue;
            },

            referenceFormatter: function (val) {
                var title = this.model.get("requestedBy");
                var cellValue = this.cellFormatters.genericFormatter.apply(this, [val]);
                //   if (rowObject.hasMoreInfo || rowObject.hasMoreInfo == "true") {

                if (!cellValue) {

                    cellValue = "<div style='text-align: center;'><a href='javascript:openColorBox(" + this.model.get("id") + ")'>more ...</a></div>";

                } else {

                    cellValue = "<a href='javascript:openColorBox(" + this.model.get("id") + ")'>" + cellValue + "</a>";

                }

                /*/ } else {

                 //don't add link to show references
                 cellValue = "<div style='text-align: center;'><div style='text-align: center;'><a href='javascript:openColorBox(" + this.model.get("id") + ")'>add ...</a></div>";

                 } */

                return cellValue;
            },

            /**
             * surronds the generic formatter with a wrapper showing whether the job is currently locked or not
             * @param val
             */
            jobEditingFormatter: function (val) {

                var preventEdit = this.model.get("preventEdit");
                var userEditing = this.model.get("userEditing");
                var startEditing = this.model.get("startEditing");

                // call generic formatter
                var html = this.cellFormatters.genericFormatter.apply(this, [val]);

                if (preventEdit) {
                    html = "<div title='Opened for Edit: " + userEditing + " (" + this.templateHelpers.formatDateTime(startEditing) + ")'><i class='icon-lock'></i> " + html + "</div>";
                }

                return html;
            },

            bookingStatusFormatter: function (val) {

                var status = this.model.get("status") || {};

                return bookingStatusFormatter(status.id, null, null);
            },

            cancellationReasonFormatter: function (val) {
                var reason = this.model.get("cancellationReason") || {};
                return cancellationReasonFormatter(reason.id, null, null);
            },

            wrapLink: function (formatterOptions, displayVal) {

                // if there's a link property
                if (formatterOptions.link) {

                    var url = formatterOptions.link.url;
                    // if there's an id to insert
                    if (formatterOptions.link.context) {

                        // get the context value to pass to the link
                        var contextValue = _.isFunction(formatterOptions.link.context) ? formatterOptions.link.context(this.model) : this.model.get(formatterOptions.link.context);
                        if (url.indexOf("{id}") != -1) {
                            // replace the id
                            url = url.replace("{id}", contextValue);
                        } else {
                            // append to end
                            url = url + contextValue;
                        }
                    }

                    if (formatterOptions.link.className) {
                        displayVal = "<a class='" + formatterOptions.link.className + "' href='" + url + "'>" + displayVal + "</a>";
                    } else {
                        displayVal = "<a class='gridPopup' href='" + url + "'>" + displayVal + "</a>";
                    }
                }

                return displayVal;
            },

            eligibilityFormatter: function (val) {
                var css = 'eligible-warning';
                var title = 'Eligibility warning. Click for details.';

                if (val && (val == 'fail')) {
                    css = 'eligible-fail';
                    title = 'Eligibility failure. Click for details.';
                } else if (val && (val == 'pass')) {
                    css = 'eligible-pass';
                    title = 'Eligible. Click for details.';
                }

                return "<div class='eligible " + css + "'>&nbsp;&nbsp;</a></div>";
            },

            documentFormatter: function (val) {
                return "<a href='javascript:openDocumentColorBox(" + this.model.get("id") + ")'>View  <i class='icon icon-eye-open'></i></a>";
            },

            contactStatusFormatter: function (val) {
                var statusModel = this.model.get("status");

                if (statusModel !== null && statusModel !== undefined) {
                    var statusId = statusModel.id;
                    var status = getStatusById(App.dict.contactStatus, statusId);
                    return status ? status.name : "N/A";
                } else {
                    return "N/A";
                }
            }
        }

    });

    /**
     * shows the UTC date in user timezone
     * @type {*}
     */
    $.app.backgrid.DateCell = $.app.backgrid.GenericCell.extend({

        className: "datetime-cell",

        //templateHelpers: $.app.mixins.templateHelpersMixin,

        editor: $.app.backgrid.DateCellEditor,

        formatter: {

            templateHelpers: $.app.mixins.templateHelpersMixin,

            fromRaw: function (rawData, model) {

                if (rawData) {
                    return this.templateHelpers.formatDate(rawData, model.get("timeZone"));
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return this.templateHelpers.parseDate(formattedData, model.get("timeZone"));
                }
            }

        }
    });

    /**
     * shows the time part of the UTC date in user timezone
     * @type {*}
     */
    $.app.backgrid.TimeCell = $.app.backgrid.GenericCell.extend({
        cellFormatter: "timeFormatter",
        className: "datetime-cell",

        //templateHelpers: $.app.mixins.templateHelpersMixin,

        formatter: {

            templateHelpers: $.app.mixins.templateHelpersMixin,


            fromRaw: function (rawData, model) {
                if (rawData) {
                    return this.templateHelpers.formatTime(rawData, model.get("timeZone"));
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return this.templateHelpers.parseTime(formattedData, model.get("timeZone"));
                }
            }
        },

        formatterOptions: {
            tooltip: function (model) {
                // TODO: this code is never invoked when formatterOptions provided at the cell definition level
                if (model.get("actualStartDate") && model.get("actualEndDate")) {
                    return model.get("timeZone") + "<br />Expected: " + this.templateHelpers.formatTime(model.get("expectedStartDate"), model.get("timeZone")) + " - " + this.templateHelpers.formatTime(model.get("expectedEndDate"), model.get("timeZone")) + "<br/>Actual: " + this.templateHelpers.formatTime(model.get("actualStartDate"), model.get("timeZone")) + " - " + this.templateHelpers.formatTime(model.get("actualEndDate"), model.get("timeZone"));
                } else if (!model.get("actualStartDate") && !model.get("actualEndDate")) {
                    return model.get("timeZone") + "<br />Expected: " + this.templateHelpers.formatTime(model.get("expectedStartDate"), model.get("timeZone")) + " - " + this.templateHelpers.formatTime(model.get("expectedEndDate"), model.get("timeZone"));
                } else {
                    return model.get("timeZone");
                }
            }
        }
    });

    /**
     * shows the time part of the UTC date in the interpreters timezone if they are assigned
     * @type {*}
     */
    $.app.backgrid.InterpreterTimeCell = $.app.backgrid.TimeCell.extend({

        formatter: {

            templateHelpers: $.app.mixins.templateHelpersMixin,

            fromRaw: function (rawData, model) {
                // raw data is ignored and we look up the expectedStartDate directly
                // this is because the name of the column definition needs to differ
                // for display adding / removing purposes.

                // get tz from assigned interpreter or from job itself as fall back
                var tz = model.get("interpreter") ? model.get("interpreter").timeZone : model.get("timeZone");
                return this.templateHelpers.formatTime(model.get("expectedStartDate"), tz);
            }
        }
    });

    /**
     * shows the time part of the UTC date in user timezone
     * @type {*}
     */
    $.app.backgrid.DateTimeCell = $.app.backgrid.GenericCell.extend({

        className: "datetime-cell",

        //templateHelpers: $.app.mixins.templateHelpersMixin,

        formatter: {

            templateHelpers: $.app.mixins.templateHelpersMixin,


            fromRaw: function (rawData, model) {

                if (rawData) {
                    return this.templateHelpers.formatDateTime(rawData, model.get("timeZone"));
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return this.templateHelpers.parseDateTime(formattedData, model.get("timeZone"));
                }
            }
        }
    });

    /**
     * cell definition for interpreter visit id
     * @type {*}
     */
    $.app.backgrid.InterpreterVisitIDCell = $.app.backgrid.GenericCell.extend({
        formatterOptions: {
            link: {
                className: 'gridiFramePopup',
                url: App.config.context + '/booking/bare/',
                context: 'id'
            }
        }
    });

    $.app.backgrid.BookingIDCell = $.app.backgrid.GenericCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
        },
        events: {
            'click .viewMore': 'viewMoreAction'
        },
        className: "IDCell",
        formatterOptions: {
            link: {
                className: 'viewMore',
                noLink: true
            }
        }

    });

    $.app.backgrid.SuperBookingIDCell = $.app.backgrid.GenericCell.extend({
        className: "IDCell",
        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData ? rawData.id : "";
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("superBooking");
                }
            }
        },
        formatterOptions: {
            link: {
                className: 'gridiFramePopup',
                url: App.config.context + '/calendar/bookingCal/',
                context: function (model) {
                    return model.get("superBooking") ? model.get("superBooking").id : "";
                }
            }
        }
    });

    $.app.backgrid.ClientCell = $.app.backgrid.GenericCell.extend({
        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData.displayName;
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("client");
                }
            }
        }
    });
    $.app.backgrid.CustomerCell = $.app.backgrid.GenericCell.extend({
        className: "CustomerCell",
        cellFormatter: "customerFormatter",
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    return rawData.name;
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return model.get("customer");
                }
            }
        },
        formatterOptions: {
            link: {
                className: 'gridiFramePopup',
                url: App.config.context + '/calendar/customer/{id}/bookings/',
                context: function (model) {
                    return model.get("customer") ? model.get("customer").id : null;
                }
            }
            /*,
                        length: 20*/
        }
    });

    $.app.backgrid.BillingCustomerCell = $.app.backgrid.GenericCell.extend({
        className: "CustomerCell",
        cellFormatter: "billingCustomerFormatter",
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    return rawData.name;
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return model.get("billingcustomer");
                }
            }
        },
        formatterOptions: {
            link: {
                className: 'gridiFramePopup',
                url: App.config.context + '/calendar/billingCustomer/{id}/bookings/',
                context: function (model) {
                    return model.get("billingCustomer") ? model.get("billingCustomer").id : null;
                }
            }
            /*,
             length: 20*/
        }
    });

    $.app.backgrid.BillingMethodCell = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.billingMethod);
        },
        render: function () {
            this.$el.empty();
            var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")), this.model) || null;

            this.$el.append(billingMethodFormatter(formattedValue, {}, this.model.toJSON()));

            this.delegateEvents();
            return this;
        },

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData && rawData.id) {
                    return rawData.id.toString();
                } else if (rawData) {
                    return rawData;
                } else {
                    // can't return undefined as SelectCellEditor doesn't likey
                    return "";
                }
            },

            toRaw: function (formattedData, model) {
                return getStatusById(App.dict.billingMethod, formattedData);
            }
        }
    });

    $.app.backgrid.InterpreterCell = $.app.backgrid.GenericCell.extend({
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    return rawData.displayName;
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return model.get("interpreter");
                }
                return "";
            }
        },
        formatterOptions: {
            length: 20
        }
    });

    $.app.backgrid.ConsumerCell = $.app.backgrid.GenericCell.extend({
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {

                    var names = rawData.displayName;

                    // check for additional consumers
                    var consumers = model.get("consumers") || [];

                    _.each(consumers, function (con) {

                        // null check as this can be a list and only matched values returned
                        // earlier indexes in list will be returned as null
                        if (con) {
                            names += " / " + con.name;
                        }

                    });

                    return names;
                }
            }
        }
    });

    $.app.backgrid.JobIDCell = $.app.backgrid.GenericCell.extend({
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    return rawData.id;
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return model.get("job");
                }
                return "";
            }
        },
        formatterOptions: {
            length: 20
        }
    });

    $.app.backgrid.LocationCell = $.app.backgrid.GenericCell.extend({
        cellFormatter: "bookingModeFormatter",
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    if (rawData.displayLabel) {
                        return rawData.displayLabel.replace(/\n/g, ",<br />");
                    } else {
                        return rawData.replace(/\n/g, ",<br />");
                    }
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return model.get("location");
                }
            }
        }
        /*,
                formatterOptions: {
                    length: 20
                }*/
    });

    /**
     * shows the number in currency format
     * @type {*}
     */
    //$.app.backgrid.MoneyCell = Backgrid.NumberCell.extend({
    $.app.backgrid.MoneyCell = $.app.backgrid.GenericCell.extend({

        className: "number-cell",

        formatter: {

            templateHelpers: $.app.mixins.templateHelpersMixin,

            fromRaw: function (rawData, model) {

                if (rawData !== undefined && rawData !== null) {
                    return this.templateHelpers.formatMoney(rawData, null, model.get("currencySymbol"), model.get("currencyCode"));
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return formattedData;
                }
            }

        }
    });

    $.app.backgrid.LanguageCell = $.app.backgrid.GenericCell.extend({
        // className: "language-cell",
        className: "LangCode",

        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData ? rawData : "";
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("language");
                }
            }
        },

        formatterOptions: {
            link: {
                className: 'gridPopup',
                url: App.config.context + '/language/summary/',
                context: function (model) {
                    return model.get("language") ? (model.get("language").iso639_3Tag ? model.get("language").iso639_3Tag : model.get("language").subtag) : null;
                }
            },
            tooltip: function (model) {
                return model.get("language") ? model.get("language").description : null;
            }
        }
    });

    $.app.backgrid.StringTimeCell = $.app.backgrid.GenericCell.extend({
        // className: "language-cell",
        className: "string-time-cell",

        formatterOptions: {
            templateHelpers: $.app.mixins.templateHelpersMixin,

            whenEmptyShowError: false,

            tooltip: function (model) {
                if (model.get("actualStartDate") && model.get("actualEndDate")) {
                    return model.get("timeZone") + "<br />Expected: " + this.templateHelpers.formatTime(model.get("expectedStartDate"), model.get("timeZone")) + " - " + this.templateHelpers.formatTime(model.get("expectedEndDate"), model.get("timeZone")) + "<br/>Actual: " + this.templateHelpers.formatTime(model.get("actualStartDate"), model.get("timeZone")) + " - " + this.templateHelpers.formatTime(model.get("actualEndDate"), model.get("timeZone"));
                } else if (!model.get("actualStartDate") && !model.get("actualEndDate")) {
                    return model.get("timeZone") + "<br />Expected: " + this.templateHelpers.formatTime(model.get("expectedStartDate"), model.get("timeZone")) + " - " + this.templateHelpers.formatTime(model.get("expectedEndDate"), model.get("timeZone"));
                } else {
                    return model.get("timeZone");
                }
            }
        }
    });

    $.app.backgrid.DefaultLanguage = $.app.backgrid.GenericCell.extend({
        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData.displayName;
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("defaultLanguage");
                }
            }
        }
    });
    $.app.backgrid.CompanyLanguageCellEditor = Backgrid.InputCellEditor.extend({

        events: {
            /*"close": "saveOrCancel",
            "change": "saveOrCancel"*/
            //"blur": "saveOrCancel"
        },

        postRender: function (model, column) {

            // call post render on parent to focus cursor
            Backgrid.InputCellEditor.prototype.postRender.apply(this, arguments);

            // don't register if in search row
            if (this.options.search) {

                return;
            }

            var that = this;

            // set up language autocomplete
            this.$el.autocomplete({
                source: App.config.context + "/language/listEnabled",
                select: function (event, ui) {

                    //console.log("select");
                    // set the selected language
                    that.model.set({
                        "language.id": ui.item.id
                    }, {
                        silent: true
                    });
                    $(this).val(ui.item.label);
                    that.saveOrCancel({});

                    return false;
                },
                change: function (event, ui) {
                    //console.log("change");
                },
                search: function (event, ui) {
                    //console.log("search");
                },
                open: function (event, ui) {
                    //console.log("open");
                }
            }).data("autocomplete")._renderItem = function (ul, item) {

                var label = item.label;
                if (item.enabled) {

                    label = "<b>" + label + "</b>";
                }
                var alternates = "";

                if (item.alias) {
                    alternates = item.alias;
                }
                if (item.alternates) {
                    alternates = alternates + " / " + item.alternates;
                }

                if (alternates) {
                    label = label + " [<b>Alternate</b>: " + alternates + "]";
                }
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + label + "</a>")
                    .appendTo(ul);
            };

            return this;
        },

        saveOrCancel: function (e) {

            var formatter = this.formatter;
            var model = this.model;
            var column = this.column;

            var command = new Backgrid.Command(e);
            var blurred = e.type === "blur";

            var val = this.$el.val();
            var newValue = formatter.toRaw(val, this.model);
            if (_.isUndefined(newValue)) {
                model.trigger("backgrid:error", model, column, val);
            } else {
                model.set(column.get("name"), newValue);
                model.trigger("backgrid:edited", model, column, command);
            }

        }
    });

    $.app.backgrid.CompanyLanguageCell = $.app.backgrid.GenericCell.extend({
        className: "language-cell",

        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData.description ? rawData.description : null;
                } else {
                    return "";
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("language");
                }
            }
        },

        formatterOptions: {
            link: {
                className: 'gridPopup',
                url: App.config.context + '/language/summary/',
                context: function (model) {
                    return model.get("language") ? (model.get("language").iso639_3Tag ? model.get("language").iso639_3Tag : model.get("language").subtag) : null;
                }
            },
            tooltip: function (model) {
                return model.get("language") ? model.get("language").description : null;
            }
        },

        editor: $.app.backgrid.CompanyLanguageCellEditor

    });

    $.app.backgrid.PrimaryRefCell = $.app.backgrid.GenericCell.extend({
        cellFormatter: "referenceFormatter",
        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData.name + ": " + rawData.ref;
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("primaryRef");
                }
            }
        }
    });

    $.app.backgrid.ReferenceCell = $.app.backgrid.GenericCell.extend({
        className: "refernece-cell",
        cellFormatter: "referenceFormatter",

        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    if (rawData.length === undefined) {
                        return rawData.name + ": " + rawData.ref;
                    } else {
                        var ref;
                        for (var i = 0; i < rawData.length; i++) {
                            ref = rawData[i] ? rawData[i].name + ": " + rawData[i].ref : "";
                            if (rawData.length > 1 && (ref || ref !== "")) {
                                ref += " (+" + (rawData.length - 1) + " other)";
                                return ref;
                            } else if (ref || ref !== "") {
                                return ref;
                            }
                        }
                    }
                }
            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return model.get("refs");
                }
            }
        }
    });

    $.app.backgrid.RequirementCell = $.app.backgrid.GenericCell.extend({
        className: "requirement-cell",
        formatter: {
            fromRaw: function (rawData, model) {
                if (rawData) {
                    if (rawData.length > 0) {
                        var req = "";
                        for (var i = 0; i < rawData.length; i++) {
                            req += rawData[i] ? rawData[i].criteria.name : "";
                            if (i < rawData.length - 1) {
                                req += " / ";
                            }
                        }
                        return req;
                    } else {
                        return "-";
                    }
                }

            },
            toRaw: function (formattedData, model) {

                if (formattedData) {
                    return model.get("requirements");
                }
            }
        }
    });

    $.app.backgrid.RequestorCell = $.app.backgrid.GenericCell.extend({
        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData.displayLabel;
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("requestor");
                }
            }
        }
    });

    $.app.backgrid.RatePlanCell = $.app.backgrid.GenericCell.extend({
        className: "ratePlan-cell",

        formatter: {
            fromRaw: function (rawData) {
                if (rawData) {
                    return rawData.name ? rawData.name : null;
                }
            },
            toRaw: function (formattedData, model) {
                if (formattedData) {
                    return model.get("ratePlan");
                }
            }
        },

        formatterOptions: {
            length: 10,
            tooltip: function (model) {
                return model.get("ratePan") ? model.get("ratePlan").description : null;
            }
        }
    });


    /**
     *
     * @type {*}
     */
    $.app.backgrid.BillingNotesCell = $.app.backgrid.GenericCell.extend({
        formatterOptions: {
            length: 25,
            whenEmpty: function (model) {
                return "more ...";
            },
            tooltip: function (model) {
                var tip = "";
                if (model.get("requestor")) {
                    tip = "Requestor: " + model.get("requestor").name + "<br/>";
                }
                if (model.get("billingNotes")) {
                    tip += "Billing Notes: " + model.get("billingNotes");
                }

                return tip;
            },
            tooltipPlacement: "left",
            link: {
                className: 'gridiFramePopup',
                url: App.config.context + '/booking/refs/',
                context: 'id'
            }
        }
    });

    $.app.backgrid.NotesCell = $.app.backgrid.GenericCell.extend({
        formatterOptions: {
            length: 25,
            whenEmpty: function (model) {
                return "more...";
            },
            tooltip: function (model) {
                var tip = "";
                // this is an internal only field - secured class does not work inside the tooltip
                if (!App.config.interpreter.id && !App.config.customer.id) {
                    if (model.get("interpreterNotes")) {
                        tip += "Interpreter Notes: " + model.get("interpreterNotes") + "<br/>";
                    }
                }
                if (model.get("visitNotes")) {
                    tip += "Job Notes: " + model.get("visitNotes") + "<br/>";
                }
                if (model.get("visitDetails")) {
                    tip += "Job Details: " + model.get("visitDetails") + "<br/>";
                }
                return tip;
            },
            tooltipPlacement: "left",
            link: {
                className: 'gridiFramePopup',
                url: App.config.context + '/booking/refs/',
                context: 'id'
            }
        }
    });

    $.app.backgrid.AsyncTaskActionCell = Backgrid.StringCell.extend({
        className: "action-cell async-task-action-cell",
        template: JST["app/backgrid/asynctaskactioncell/fromraw"],
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        events: {
            "click .widget-fail": "failAction",
            "click .widget-reset": "resetAction"
        },

        failAction: function (e) {
            if (this.model.get("status") !== "finished") {
                this.model.set("failedDate", new Date().toISOString());
                this.model.save();
            }
            e.preventDefault();
        },

        resetAction: function (e) {

            this.model.set("startedDate", null);
            this.model.set("status", null);
            this.model.set("failedDate", null);
            this.model.set("finishedDate", null);
            this.model.set("progress", 0);
            this.model.set("size", null);
            this.model.save();
            e.preventDefault();
        },

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        }
    });

    $.app.backgrid.BookingActionCell = Backgrid.StringCell.extend({
        className: "action-cell-right",
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
        },

        events: {
            "click .widget-assign": "assignInterpreterAction",
            "click .widget-unassign": "unassignInterpreterAction",
            "click .widget-view-offers": "viewInterpreterOffersAction",

            "click .widget-view-more": "viewMoreAction",
            "click .widget-edit": "editFull",
            "click .widget-view-all": "viewFull",

            "click .widget-confirm-customer": "confirmCustomerAction",
            "click .widget-confirm-interpreter": "confirmInterpreterAction",
            "click .widget-confirm-requestor": "confirmRequestorAction",

            'click .widget-send-adhoc-email': 'sendAdHocEmailAction',
            "click .widget-email-new-job": "emailNewJobAction",
            'click .widget-send-job-status-update-email': 'sendJobStatusUpdateAction',
            'click .widget-email-customer-confirmation': 'emailCustomerConfirmationAction',
            'click .widget-email-interpreter-confirmation': 'emailInterpreterConfirmationAction',
            'click .widget-send-adhoc-sms': 'sendAdHocSMSAction',
            'click .widget-resendcofirmation-sms': 'resendConfirmationSMSAction',
            'click .widget-resendreminder-sms': 'resendReminderSMSAction',

            'click .widget-price-quote': 'priceQuoteAction',
            'click .widget-incidentals': 'incidentalsAction',

            "click .widget-close": "closeAction",
            "click .widget-vos": "vosAction",
            "click .widget-add-vos": "uploadDocument",
            'click .widget-eSig': 'eSigAction',

            "click .widget-cancel": "cancelAction",
            "click .widget-decline": "declineAction",

            "click .widget-clone": "cloneAction",
            "click .widget-duplicate": "duplicateAction",
            "click .widget-repeat": "repeatAction",

            "click .widget-create-interaction": "createInteractionAction",
            "click .widget-delete": "deleteAction",
            "click .widget-start-video": "startVideo",
            "click .widget-start-voice": "startVoice"
        },
        template: JST["app/backgrid/bookingactioncell/show"],

        render: function () {
            this.$el.empty();

            var companyConfig = App.dict.defaults.companyConfig;
            var customer = this.model.get("customer");
            var that = this;

            var html = this.template({
                obj: this.model.toJSON(),
                config: companyConfig
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();

            // if (customer) {
            //     var c = $.core.Customer.findOrCreate({
            //         "id": customer.id
            //     });
            //
            //     c.fetch({
            //         success: function () {
            //             var config = c.get("config");
            //             if (config && !config.jobUpdateEnabled) {
            //                 var el = that.$el.find("#customer-cancel");
            //                 if (el) {
            //                     el.css('visibility', 'hidden');
            //                     el.hide();
            //                 }
            //             }
            //         }
            //     });
            // }

            return this;
        }
    });

    $.app.backgrid.IvrCallActionCell = Backgrid.StringCell.extend({
        className: "action-cell-right",
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.ivrCallActionsMixin);
        },

        events: {
            "click .widget-view-details": "viewDetails"
        },
        template: JST["app/backgrid/ivrcallactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();

            return this;
        }
    });

    $.app.backgrid.ContactWorkerActionCell = Backgrid.StringCell.extend({
        className: "action-cell-right",
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.contactWorkerActionsMixin);
        },

        events: {
            "click .widget-view-details": "viewDetails",
            "click .widget-make-available": "makeAvailable",
            "click .widget-make-unavailable": "makeUnavailable",
            "click .widget-edit-attributes": "editAttributes"
        },
        template: JST["app/backgrid/contactworkeractioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();

            return this;
        }
    });

    $.app.backgrid.VriSessionActionCell = Backgrid.StringCell.extend({
        className: "action-cell-right",
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.vriSessionActionsMixin);
        },
        events: {
            "click .widget-view-history": "viewHistory"
        },
        template: JST["app/backgrid/vrisessionactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();

            return this;
        }
    });

    $.app.backgrid.DueInCell = Backgrid.StringCell.extend({
        template: JST["app/backgrid/duein/show"],

        render: function () {
            var cellValue;
            var now = new Date();

            var timeDiffMs = new Date(this.model.get("expectedStartDate")) - now.getTime();
            var timeDiffMins = timeDiffMs / (1000 * 60);
            var alreadyStarted = false;
            if (timeDiffMins < 0) {
                timeDiffMins = timeDiffMins * -1;
                alreadyStarted = true;
            }
            var hours = Math.floor(timeDiffMins / 60);
            var mins = Math.floor(timeDiffMins % 60);
            var time = padHours(hours) + padMins(mins);

            if (alreadyStarted) {
                cellValue = "started " + time;
            } else {
                cellValue = time;
            }

            this.$el.empty();

            this.$el.append(_.escape(cellValue));

            this.delegateEvents();
            //this.showSecured();

            return this;

        }
    });

    $.app.backgrid.InterpreterVisitActionCell = Backgrid.StringCell.extend({
        className: "action-cell interpreter-visit-action-cell",
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.interpreterVisitActionsMixin);
        },

        events: {
            "click .widget-cancel": "cancelAction",
            "click .widget-close": "closeAction",
            "click .widget-confirm-interpreter": "confirmInterpreterAction",
            "click .widget-confirm-customer": "confirmCustomerAction",
            "click .widget-resendcofirmation-sms": "resendConfirmationSMSAction",
            "click .widget-resendreminder-sms": "resendReminderSMSAction",
            "click .widget-email-new-job": "emailNewJobAction",
            "click .widget-email-customer-confirmation": "emailCustomerConfirmationAction",
            "click .widget-email-interpreter-confirmation": "emailInterpreterConfirmationAction",
            "click .widget-incidentals": "incidentalsAction",
            "click .widget-assign": "assignInterpreterAction",
            "click .widget-unassign": "unassignInterpreterAction",
            "click .widget-delete": "deleteAction",
            "click .widget-decline": "declineAction",
            "click .widget-vos": "vosAction",
            "click .widget-eSig": "eSigAction",
            "click .widget-price-quote": "priceQuoteAction"

        },

        template: JST["app/backgrid/interpretervisitactioncell/fromraw"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();

            if (this.model.get("interpreter") === null) {
                this.$el.find(".widget-resendcofirmation-sms").hide();
                this.$el.find(".widget-resendreminder-sms").hide();
            }

            return this;
        }
    });

    $.app.backgrid.VisitActionCell = Backgrid.StringCell.extend({
        className: "action-cell interpreter-visit-action-cell",
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.visitActionsMixin);
        },

        events: {
            "click .widget-edit": "editAction",
            "click .widget-cancel": "cancelAction",
            "click .widget-close": "closeAction",
            "click .widget-clone": "cloneAction",
            "click .widget-repeat": "repeatAction",
            "click .widget-confirm-interpreter": "confirmInterpreterAction",
            "click .widget-confirm-customer": "confirmCustomerAction",
            "click .widget-assign": "assignInterpreterAction",
            "click .widget-unassign": "unassignInterpreterAction",
            "click .widget-delete": "deleteAction",
            "click .widget-decline": "declineAction",
            "click .widget-vos": "vosAction",
            "click .widget-price-quote": "priceQuoteAction"

        },

        template: JST["app/backgrid/visitactioncell/fromraw"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        }
    });

    $.app.backgrid.VisitFinancialActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
            _.extend(this, $.app.mixins.visitActionsMixin);
        },

        events: {
            "click .widget-edit": "editAction",
            "click .widget-cancel": "cancelAction",
            "click .widget-close": "closeAction",
            "click .widget-clone": "cloneAction",
            "click .widget-repeat": "repeatAction",
            "click .widget-confirm-interpreter": "confirmInterpreterAction",
            "click .widget-confirm-customer": "confirmCustomerAction",
            "click .widget-assign": "assignInterpreterAction",
            "click .widget-unassign": "unassignInterpreterAction",
            "click .widget-delete": "deleteAction",
            "click .widget-decline": "declineAction",
            "click .widget-vos": "vosAction",
            "click .widget-price-quote": "priceQuoteAction"

        },

        template: JST["app/backgrid/visitfinancialactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        }
    });

    $.app.backgrid.SaveDeleteActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        events: {
            "click .widget-delete": "deleteAction",
            "click .widget-save": "saveAction"
        },

        template: JST["app/backgrid/companypayableitemtypeactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        deleteAction: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.destroy(popupFetchOptions);

            return false;
        },

        saveAction: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.save({}, popupFetchOptions);

            return false;
        }
    });

    $.app.backgrid.SaveActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        events: {
            "click .widget-save": "saveAction"
        },

        template: JST["app/backgrid/saveactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        saveAction: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.save({}, popupFetchOptions);

            return false;
        }
    });

    $.app.backgrid.CompanyLanguageActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        events: {
            "click .widget-delete": "deleteLanguage",
            "click .widget-save": "saveLanguage"
        },

        template: JST["app/backgrid/companylanguageactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        deleteLanguage: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.destroy(popupFetchOptions);

            return false;
        },

        saveLanguage: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.set({
                "bind": true
            }, {
                "silent": true
            });
            this.model.save({}, popupFetchOptions);

            return false;
        }
    });

    /**
     * actions for interpreter
     */
    $.app.backgrid.JobOfferActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        events: {
            "click .widget-view-offer": "viewOffer",
            "click .widget-accept-offer": "acceptOffer",
            "click .widget-decline-offer": "declineOffer"
        },

        template: JST["app/backgrid/jobofferactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        viewOffer: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();
            this.model.viewOffer();

            return false;
        },

        acceptOffer: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();
            this.model.accept();

            return true;
        },

        declineOffer: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();
            this.model.decline();

            return true;
        }
    });

    /**
     * action cell for internal users
     */
    $.app.backgrid.JobOfferAssignActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        events: {
            "click .widget-assign-offer": "assignOffer",
            "click .widget-forfeit-guarantee": "forfeitGuarantee"
        },

        template: JST["app/backgrid/jobofferactioncell/assign/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        assignOffer: function (evt) {
            var that = this;
            var jobId = that.model.get("job").id;

            var booking = $.core.Booking.findOrCreate({
                id: jobId
            });

            booking.fetch({
                success: function () {
                    booking.set({
                        "interpreter.id": that.model.get("interpreter").id
                    });

                    var state = new $.core.BookingAssignState({
                        "interpreter.id": that.model.get("interpreter").id
                    }, {
                        id: jobId,
                        booking: booking
                    });

                    return state.save(null, {
                        success: function (model, response) {
                            popupFetchOptions.success(model, response, true /* wait for response */ );
                        },
                        error: popupFetchOptions.error
                    });
                }
            });
        },

        forfeitGuarantee: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();
            //this.model.forfeitGuarantee();
            this.model.decline();

            return true;
        }


    });

    $.app.backgrid.VolumePriceTierActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        events: {
            "click .widget-delete": "deleteAction",
            "click .widget-save": "saveAction"
        },

        template: JST["app/backgrid/volumepricetieractioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                obj: this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        deleteAction: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.destroy(popupFetchOptions);

            return false;
        },

        saveAction: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.save({}, popupFetchOptions);

            return false;
        }
    });

    $.app.backgrid.DeleteActionCell = Backgrid.StringCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);
        },

        tagName: "td style='text-align:center;'",

        events: {
            "click .widget-delete": "deleteAction"
        },

        template: JST["app/backgrid/deleteactioncell/show"],

        render: function () {
            this.$el.empty();

            var html = this.template({
                // TODO: remove first clause. dummy collection.
                obj: this.model && this.model.toJSON()
            });
            this.$el.append(html);

            this.delegateEvents();
            this.showSecured();
            return this;
        },

        deleteAction: function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            this.model.destroy();

            return false;
        }

    });

    $.app.backgrid.EditDeleteActionCell = $.app.backgrid.DeleteActionCell.extend({

        events: {
            "click .widget-delete": "deleteAction",
            "click .widget-edit": "editAction"
        },

        template: JST["common/backgrid/edit_delete_cell"],

        editAction: function () {
            this.model.trigger("edit", this.model);
        }

    });

    $.app.backgrid.AssessmentsPaymentTier = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.paymentTier);
        },

        render: function () {
            this.$el.empty();

            var formattedValue = this.model.get(this.column.get("name")) ? this.model.get(this.column.get("name")).name : null;

            this.$el.append(_.escape(formattedValue));

            this.delegateEvents();
            return this;
        }
    });

    $.app.backgrid.AssessmentsType = Backgrid.SelectCell.extend({
        editor: $.app.backgrid.SelectCellEditor,

        optionValues: function () {
            return $.app.backgrid.makeEditList(App.dict.assessmentType);
        },

        render: function () {
            this.$el.empty();

            var formattedValue = this.model.get(this.column.get("name")) ? this.model.get(this.column.get("name")).name : null;

            this.$el.append(_.escape(formattedValue));

            this.delegateEvents();
            return this;
        }
    });

    $.app.backgrid.TaskSidCell = $.app.backgrid.GenericCell.extend({
        initialize: function () {
            Backgrid.Cell.prototype.initialize.apply(this, arguments);
            _.extend(this, $.app.mixins.commonAppMixin);

        },
        events: {
            'click .viewHistory': 'viewHistory'
        },
        className: "TaskSidCell"
    });

    // Override of Backgrid method to avoid undefined values on selected values
    Backgrid.Grid.prototype.getSelectedModels = function () {
        var selectAllHeaderCell;
        var headerCells = this.header.row.cells;
        for (var i = 0, l = headerCells.length; i < l; i++) {
            var headerCell = headerCells[i];
            if (headerCell instanceof Backgrid.Extension.SelectAllHeaderCell) {
                selectAllHeaderCell = headerCell;
                break;
            }
        }

        var result = [];
        if (selectAllHeaderCell) {
            for (var modelId in selectAllHeaderCell.selectedModels) {
                result.push(this.collection.get(modelId));
            }
        }

        return _.compact(result);
    };

})(jQuery);
