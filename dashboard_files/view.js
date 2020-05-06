/*
 * Copyright (C) 2012 Interpreter Intelligence <support@interpreterintelligence.com>
 *
 * <copyright notice>
 *
 *
 */

(function ($) { //# sourceURL=app/common/view.js
    /* enable strict mode */
    "use strict";

    if (!$.app) $.app = {};

    Backbone.Marionette.Renderer.render = function (template, data) {
        if (!JST[template]) {
            console.log("Template missing: " + template);
        }
        return JST[template](_.extend(data, this.templateHelpers));
    };

    // base view for application views
    $.app.BaseView = Backbone.View.extend($.app.mixins.commonAppMixin);
    $.app.LayoutView = Backbone.Marionette.Layout.extend($.app.mixins.commonAppMixin);
    $.app.CollectionView = Backbone.Marionette.CollectionView.extend($.app.mixins.commonAppMixin);
    $.app.CompositeView = Backbone.Marionette.CompositeView.extend($.app.mixins.commonAppMixin);
    $.app.ItemView = Backbone.Marionette.ItemView.extend($.app.mixins.commonAppMixin);

    $.app.SimplePaginatorView = $.app.ItemView.extend({
        template: "app/simplepaginator/show",

        events: {
            "click .next": "next",
            "click .previous": "previous"
        },

        collectionEvents: {
            "sync": "setState"
        },

        setState: function () {
            if (this.collection.hasNext()) {
                this.$(".next").removeClass("disabled");
            } else {
                this.$(".next").addClass("disabled");
            }

            if (this.collection.hasPrevious()) {
                this.$(".previous").removeClass("disabled");
            } else {
                this.$(".previous").addClass("disabled");
            }
        },

        next: function () {
            var that = this;
            if (this.collection.hasNext()) {
                this.collection.getNextPage({
                    success: function () {
                        that.trigger("paginator:next", that.collection);
                    }
                });
            }
            this.setState();
            return false;
        },

        previous: function () {
            var that = this;
            if (this.collection.hasPrevious()) {
                this.collection.getPreviousPage({
                    success: function () {
                        that.trigger("paginator:previous", that.collection);
                    }
                });
            }
            this.setState();
            return false;
        }
    });

    $.app.CompositePaginatorView = $.app.CompositeView.extend({
        template: "app/compositepaginator/show",

        events: {
            "click .next": "next",
            "click .previous": "previous"
        },

        collectionEvents: {
            "sync": "setState"
        },

        setState: function () {
            if (this.collection.hasNext()) {
                this.$(".next").removeClass("disabled");
            } else {
                this.$(".next").addClass("disabled");
            }

            if (this.collection.hasPrevious()) {
                this.$(".previous").removeClass("disabled");
            } else {
                this.$(".previous").addClass("disabled");
            }
        },

        filterList: function (e) {
            var that = this;
            var filterElement = e ? e.currentTarget : this.$el.find(".active");
            //jquery val causes error with tinyMCE

            if (filterElement.name === "typeFilter") {
                // change what button is active
                $(e.currentTarget).closest("#filter-controls").find("button").removeClass("active");
                $(filterElement).addClass("active");
            }

            //setup filters
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", App.config.company.id);
            if (typeof this.override !== 'undefined') {
                filtersJSON = addOrUpdateFilter(filtersJSON, "override", "eq", this.override);
            }
            //if there's a filter
            var filter = this.$el.find("#filter").val();
            if (filter && filter.length > 0) {
                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", filter);
            }

            filtersJSON = this.getExtendedFilters(filtersJSON);

            if (filter.length > 2 || filter.length === 0) {

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

            return filters;
        },

        getSortParams: function () {

            return null;

        },

        next: function () {
            if (this.collection.hasNext()) {
                this.collection.getNextPage();
            }
            this.setState();
            return false;
        },

        previous: function () {
            if (this.collection.hasPrevious()) {
                this.collection.getPreviousPage();
            }
            this.setState();
            return false;
        }
    });

    // base view for list of items that can be paged and filteres
    // TODO refactor this to use a SimplePaginator and a SimpleFilter component
    $.app.FilterablePageableBaseView = $.app.BaseView.extend({

        initialize: function () {

            _.bindAll(this, "render", "renderItem", "filterList"); // to solve the this issue

            this.model.bind('reset', this.render);
            this.model.bind('sync', this.render, this);
            this.model.bind('change', this.render);
            this.model.bind('add', this.renderItem);

            this.$el.find(this.elListName).addClass('curtain');
        },

        render: function () {

            // clear existing
            this.$el.find(this.elListName + " li").remove();

            var that = this;
            _.each(this.model.models, function (item) {
                that.renderItem(item);
            }, this);

            this.$el.find(this.elListName).removeClass('curtain');

            if (this.model.hasNext()) {
                this.$(".next").removeClass("disabled");
            } else {
                this.$(".next").addClass("disabled");
            }

            if (this.model.hasPrevious()) {
                this.$(".previous").removeClass("disabled");
            } else {
                this.$(".previous").addClass("disabled");
            }
        },

        filterList: function (e) {

            var that = this;
            var filterElement = e.currentTarget;
            //var filter = $(filterElement).val();
            //jquery val causes error with tinyMCE
            var filter = e.currentTarget.value;

            //setup filters
            var filtersJSON = {
                groupOp: "AND",
                rules: []
            };

            filtersJSON = addOrUpdateFilter(filtersJSON, "company.id", "eq", App.config.company.id);
            //if there's a filter
            if (filter) {
                filtersJSON = addOrUpdateFilter(filtersJSON, "name", "bw", filter);
            }

            if (filterElement.className === "customerFilter") {
                filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", "1");
            } else if (filterElement.className === "contactFilter") {
                filtersJSON = addOrUpdateFilter(filtersJSON, "active", "eq", "true");
            }

            filtersJSON = this.getExtendedFilters(filtersJSON);

            if (filter.length > 2 || filter.length === 0) {

                clearTimeout($.data(filterElement, 'timer'));
                var wait = setTimeout(function () {
                    //that.$("li").remove();
                    that.$el.find(this.elListName + " li").remove();

                    that.model.queryParams.filters = JSON.stringify(filtersJSON);
                    that.model.getFirstPage(_.extend({
                        error: defaultFetchOptions.error
                    }, {
                        data: {
                            filters: JSON.stringify(filtersJSON)
                        }
                    }));
                    //that.model.getFirstPage(_.extend(defaultFetchOptions, {data: { }}));
                }, 500);
                $(filterElement).data('timer', wait);
            }
        },

        getExtendedFilters: function (filters) {

            return filters;
        },

        next: function () {

            if (this.model.hasNext()) {
                this.model.getNextPage();
            }

        },
        previous: function () {

            if (this.model.hasPrevious()) {
                this.model.getPreviousPage();
            }

        }

    });
})(jQuery);
