(function ($) { //@ sourceURL=app/component/querycomponent.js
    /* enable strict mode */
    'use strict';

    $.querycomponent = {};

    $.querycomponent.models = {};
    $.querycomponent.models.Rule = Backbone.Model.extend({});
    $.querycomponent.models.Rules = Backbone.Collection.extend({
        model: $.querycomponent.models.Rule
    });
    $.querycomponent.models.Group = Backbone.Model.extend({
        defaults: {
            groupOp: 'AND'
        },

        initialize: function () {
            this.set('rules', new $.querycomponent.models.Rules(this.get('rules')));
        },

        expandRanges: function (rules) {
            var newRules = [];
            rules.forEach(function (rule) {

                if (rule.op === 'range') {
                    var newRule = {
                        field: rule.field,
                        range: true,
                        type: rule.type,
                        friendlyName: rule.friendlyName
                    };
                    var firstRule = _.extend(newRule, {
                        op: (rule.type === 'number' || rule.type === 'float') ? 'ge' : 'ged',
                        data: rule.data
                    });
                    var secondRule = _.extend(
                        _.clone(newRule), {
                            op: (rule.type === 'number' || rule.type === 'float') ? 'le' : 'led',
                            data: rule.rangeEnd
                        });

                    newRules.push({
                        groupOp: 'AND',
                        rules: [firstRule, secondRule]
                    });
                } else {
                    newRules.push(rule);
                }
            });

            return newRules;
        },

        joinDateTimeValues: function (rules) {
            var newRules = [];

            rules.forEach(function (rule) {
                if (rule.type === 'dateTime') {
                    newRules.push({
                        field: rule.field,
                        op: rule.op,
                        type: rule.type,
                        data: rule.rangeStart + ' ' + rule.rangeStartTime,
                        rangeEnd: rule.rangeEnd + ' ' + rule.rangeEndTime,
                        format: 'MM/dd/yy h:mm a'
                    });
                } else {
                    newRules.push(rule);
                }
            });

            return newRules;
        },

        toJSON: function () {
            var values = JSON.parse(JSON.stringify(this.attributes));
            var rules = this.joinDateTimeValues(values.rules);
            values.rules = this.expandRanges(rules);
            return values;
        }

        // object to encapsulate filters
        // this will also be used in other code
        // to build up filters programmatically.
        // will replace addOrUpdateFilter(), addOrUpdateDateRangeFilter(),
        // addParsedFilter(), updateFilter(), mergeFilter(), removeFilter(),
        // mergeFilters() methods in custom-app.js
    });
    $.querycomponent.models.Filters = Backbone.Collection.extend({
        initialize: function (options) {
            this.customUrl = options.url;
        },
        url: function () {
            return this.customUrl;
        }
    });
    $.querycomponent.models.SavedSearchModel = $.core.SavedSearchModel.extend({
        sync: function (method, model, options) {
            if (method === 'create' || method === 'update' || method === 'patch') {
                var copy = model.clone();
                copy.attributes.filters = JSON.stringify(model.attributes.filters);
                Backbone.sync(method, copy, options);
            } else {
                Backbone.sync(method, model, options);
            }
        },
        parse: function (data) {
            if (data.filters) {
                data.filters = JSON.parse(data.filters);
            }

            return data;
        }
    });
    $.querycomponent.models.SavedSearchCollection = $.core.SavedSearchCollection.extend({
        model: $.querycomponent.models.SavedSearchModel
    });

    $.querycomponent.helpers = {};
    $.querycomponent.helpers.ViewHelper = {
        addDatepicker: function ($el) {
            $el.datepicker({
                dateFormat: App.config.company.config.jsDateFormat,
                shortYearCutoff: 99,
                changeMonth: true,
                changeYear: true
            });
        },

        addTimeInput: function ($el) {

            $el.timeEntry({
                spinnerImage: "",
                ampmPrefix: " ",
                defaultTime: new Date().clearTime(), // use current time with time cleared so always defaults to morning
                show24Hours: App.config.company.config.isTimeFormat24Hour
            });
        },

        applyRangeStyles: function ($selectContainer, $firstInputContainer, $secondInputContainer) {
            $selectContainer.addClass('span4').removeClass('span5');
            $firstInputContainer.addClass('span4').removeClass('span7');
            $firstInputContainer.find('input').first().attr('placeholder', 'from');
            $secondInputContainer.addClass('span4').removeClass('hidden');
            $secondInputContainer.find('input').first().attr('placeholder', 'to');
        },

        removeRangeStyles: function ($selectContainer, $firstInputContainer, $secondInputContainer) {
            $selectContainer.addClass('span5').removeClass('span4');
            $firstInputContainer.addClass('span7').removeClass('span4');
            $firstInputContainer.find('input').first().attr('placeholder', '');
            $secondInputContainer.addClass('hidden').removeClass('span4');
            $secondInputContainer.find('input').first().attr('placeholder', '');
        },

        setRangeStyles: function (model, $selectContainer, $firstInputContainer, $secondInputContainer) {
            if ('range' === model.get('op')) {
                $.querycomponent.helpers.ViewHelper
                    .applyRangeStyles($selectContainer, $firstInputContainer, $secondInputContainer);
            } else {
                $.querycomponent.helpers.ViewHelper
                    .removeRangeStyles($selectContainer, $firstInputContainer, $secondInputContainer);
            }
        }
    };
    $.querycomponent.helpers.ModelsHelper = {
        adaptRules: function (rules) {
            var newRules = [];

            rules.forEach(function (rule) {
                if (rule.type === 'dateTime') {
                    var rangeStartSplitted = rule.data.split(' ');
                    var rangeStart = rangeStartSplitted[0];
                    var rangeStartTime = rangeStartSplitted[1] + ' ' + rangeStartSplitted[2];

                    var rangeEndSplitted = rule.rangeEnd ? rule.rangeEnd.split(' ') : null;
                    var rangeEnd = rule.rangeEnd ? rangeEndSplitted[0] : null;
                    var rangeEndTime = rule.rangeEnd ? rangeEndSplitted[1] + ' ' + rangeEndSplitted[2] : null;

                    newRules.push({
                        field: rule.field,
                        op: 'range',
                        date: rangeStart,
                        time: rangeStartTime,
                        rangeEnd: rangeEnd,
                        rangeEndTime: rangeEndTime,
                        type: rule.type,
                        friendlyName: rule.friendlyName
                    });
                } else {
                    newRules.push(rule);
                }
            });

            return newRules;
        },
        buildRangeRule: function (rule) {
            return {
                field: rule.rules[0].field,
                op: 'range',
                data: rule.rules[0].data,
                rangeEnd: rule.rules[1].data,
                type: rule.rules[0].type,
                friendlyName: rule.rules[0].friendlyName
            };
        },
        buildRulesModel: function (rules) {
            var that = this;
            var rulesModel = new $.querycomponent.models.Rules();
            var adaptedRules = this.adaptRules(rules);

            adaptedRules.forEach(function (rule) {
                var isRangeGroup = rule.rules && rule.rules.length === 2 && rule.rules[0].range;

                if (isRangeGroup) {
                    rulesModel.add(that.buildRangeRule(rule));
                } else {
                    rulesModel.add(rule.rules ? that.buildGroupModel(rule) : new $.querycomponent.models.Rule(rule));
                }
            });
            return rulesModel;
        },
        buildGroupModel: function (clauses) {
            var groupModel = new $.querycomponent.models.Group(clauses);
            groupModel.set('rules', this.buildRulesModel(clauses.rules));
            return groupModel;
        }
    };

    $.querycomponent.views = {};
    $.querycomponent.views.NotSupportedClauseView = $.app.ItemView.extend({
        template: 'common/querycomponent/notSupportedClause'
    });
    $.querycomponent.views.BooleanClauseView = $.app.ItemView.extend({
        template: 'common/querycomponent/booleanClause',
        events: {
            'change select': 'synchModel'
        },
        onRender: function () {
            this.$el.find('select').val(this.model.get('data'));
            this.setSelect(this.el, this.model, 'data');
            this.callbacks(this.$el, this.model);
        }
    });
    $.querycomponent.views.DateClauseView = $.app.ItemView.extend({
        events: {
            'change select': 'operationChanged'
        },
        template: 'common/querycomponent/dateClause',
        onRender: function () {
            $.querycomponent.helpers.ViewHelper.addDatepicker(this.$el.find('.rangeStart .dp').first());
            $.querycomponent.helpers.ViewHelper.addDatepicker(this.$el.find('.rangeEnd .dp').first());
            $.querycomponent.helpers.ViewHelper.setRangeStyles(
                this.model,
                this.$el.find('.selectContainer'),
                this.$el.find('.rangeStart'),
                this.$el.find('.rangeEnd')
            );

            this.setSelect(this.el, this.model, 'op');
            this.callbacks(this.$el, this.model);
        },
        operationChanged: function (ev) {
            this.synchModel(ev);
            $.querycomponent.helpers.ViewHelper.setRangeStyles(
                this.model,
                this.$el.find('.selectContainer'),
                this.$el.find('.rangeStart'),
                this.$el.find('.rangeEnd')
            );
        }
    });
    $.querycomponent.views.DateTimeClauseView = $.app.ItemView.extend({
        template: 'common/querycomponent/dateTimeClause',
        events: {
            'change select': 'operationChanged',
            'change input': 'synchModel'
        },
        onRender: function () {
            $.querycomponent.helpers.ViewHelper.addDatepicker(this.$el.find('.rangeStart .dp').first());
            $.querycomponent.helpers.ViewHelper.addDatepicker(this.$el.find('.rangeEnd .dp').first());
            $.querycomponent.helpers.ViewHelper.addTimeInput(this.$el.find('.rangeStart .time-format').first());
            $.querycomponent.helpers.ViewHelper.addTimeInput(this.$el.find('.rangeEnd .time-format').first());
            $.querycomponent.helpers.ViewHelper.setRangeStyles(
                this.model,
                this.$el.find('.selectContainer'),
                this.$el.find('.rangeStart'),
                this.$el.find('.rangeEnd')
            );

            this.setSelect(this.el, this.model, 'op');
            this.callbacks(this.$el, this.model);
        },
        operationChanged: function (ev) {
            this.synchModel(ev);
            $.querycomponent.helpers.ViewHelper.setRangeStyles(
                this.model,
                this.$el.find('.selectContainer'),
                this.$el.find('.rangeStart'),
                this.$el.find('.rangeEnd')
            );
        },
        serializeData: function () {
            var json = {
                obj: this.model.toJSON().obj
            };
            return json;
        }
    });
    $.querycomponent.views.NumberClauseView = $.app.ItemView.extend({

        template: 'common/querycomponent/numberClause',
        events: {
            'change input': 'synchModel',
            'change select': 'operationChanged'
        },

        onRender: function () {
            $.querycomponent.helpers.ViewHelper.setRangeStyles(
                this.model,
                this.$el.find('.selectContainer'),
                this.$el.find('.rangeStart'),
                this.$el.find('.rangeEnd')
            );

            this.setSelect(this.el, this.model, 'op');
            this.callbacks(this.$el, this.model);
        },
        operationChanged: function (ev) {
            this.synchModel(ev);
            $.querycomponent.helpers.ViewHelper.setRangeStyles(
                this.model,
                this.$el.find('.selectContainer'),
                this.$el.find('.rangeStart'),
                this.$el.find('.rangeEnd')
            );
        }
    });
    $.querycomponent.views.OptionClauseView = $.app.ItemView.extend({
        template: 'common/querycomponent/optionClause',
        events: {
            'change select': 'synchModel'
        },
        initialize: function (options) {
            this.opts = options.options.map(function (item) {
                return {
                    name: item,
                    id: item
                };
            });
            this.model.set('op', 'eqw');
        },
        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, {
                opts: this.opts
            });
        },
        onRender: function () {
            this.setSelect(this.el, this.model, 'op');
            this.setSelect(this.el, this.model, 'data');
            this.callbacks(this.$el, this.model);
        }
    });
    $.querycomponent.views.TextClauseView = $.app.ItemView.extend({
        template: 'common/querycomponent/textClause',
        events: {
            'change input': 'synchModel',
            'change select': 'synchModel'
        },
        onRender: function () {
            this.$el.find('input').val(this.model.get('data'));
            this.setSelect(this.el, this.model, 'op');
            this.callbacks(this.$el, this.model);
        }
    });
    $.querycomponent.views.ClauseView = $.app.ItemView.extend({

        template: 'common/querycomponent/clause',
        events: {
            'click .remove': 'removeRule',
            'change input': 'synchModel',
            'change select': 'selected',
            'change .fields': 'createClauseView'
        },

        selected: function (ev) {
            this.synchModel(ev);

            var selectedModel = this.findSelectedModel();
            var type = selectedModel.get('type');

            this.model.set('friendlyName', _.find(this.opts, function (item) {
                return item.id === ev.target.value;
            }).name);
            this.model.set('data', null);
            // this.model.set('op', App.dict.querycomponent.defaults.operation[type]);
            this.model.set('type', type);
        },

        initialize: function (options) {
            this.filters = options.filters;
            this.views = {
                booleanType: $.querycomponent.views.BooleanClauseView,
                date: $.querycomponent.views.DateClauseView,
                dateTime: $.querycomponent.views.DateTimeClauseView,
                number: $.querycomponent.views.NumberClauseView,
                option: $.querycomponent.views.OptionClauseView,
                text: $.querycomponent.views.TextClauseView,
                eligibility: $.querycomponent.views.EligibilityView,
                "float": $.querycomponent.views.NumberClauseView
            };
            this.opts = this.filters.models.map(function (m) {
                return {
                    name: m.get('attribute'),
                    id: m.get('property')
                };
            });
        },

        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, {
                opts: this.opts
            });
        },

        removeRule: function (ev) {
            this.remove();
            this.model.destroy();
            ev.stopPropagation();
        },

        onRender: function () {
            this.setSelect(this.el, this.model, 'field');
            this.setSelect(this.el, this.model, 'op');
            this.callbacks(this.$el, this.model);

            if (this.model.get('field')) {
                this.createClauseView();
            }
        },

        findSelectedModel: function () {
            var that = this;
            return _.find(this.filters.models, function (f) {
                return that.model.get('field') === f.get('property');
            });
        },

        createClauseView: function () {
            var selectedModel = this.findSelectedModel();

            // if that filter doesn't exists in filters response
            if (!selectedModel) {
                return;
            }

            var viewName = selectedModel.get('type');
            var Template = this.views[viewName] ? this.views[viewName] : $.querycomponent.views.NotSupportedClauseView;
            var view = new Template({
                el: this.$el.find('.clause-container'),
                options: viewName !== "eligibility" ? selectedModel.get('ops') : this.model.get("data"),
                model: this.model
            });
            view.render();
        }

    });
    $.querycomponent.views.GroupView = $.app.CompositeView.extend({

        tagName: 'ul',
        template: 'common/querycomponent/group',
        itemViewContainer: '.qc-clauses',
        events: {
            'click .remove': 'removeGroup',
            'click .addRule': 'addRule',
            'click .addGroup': 'addGroup',
            'change select': 'operationChanged',
            'change input': 'synchModel'
        },

        collectionEvents: {
            'add': 'applyAnchorsVisibilityClasses',
            'remove': 'applyAnchorsVisibilityClasses'
        },

        initialize: function (options) {
            this.filters = options.filters;
            this.collection = this.model.get('rules');
            this.hideRemove = options.hideRemove;
        },

        buildItemView: function (item, ItemViewType, itemViewOptions) {
            var view;
            if (item instanceof $.querycomponent.models.Rule) {
                view = new $.querycomponent.views.ClauseView({
                    model: item,
                    filters: this.filters
                });
            } else if (item instanceof $.querycomponent.models.Group) {
                view = new $.querycomponent.views.GroupView({
                    model: item,
                    filters: this.filters
                });
                this.listenTo(view, 'updateActionsVisibility', function () {
                    if (this.model.get('groupOp') === 'NOT' && this.model.get('rules').length === 1) {
                        var addGroupAnchor = this.$el.find('.addGroup').last();
                        addGroupAnchor.removeClass('hidden');
                    }
                });
            }

            return view;
        },

        removeGroup: function (ev) {
            this.collection.remove(this.model);
            this.trigger('updateActionsVisibility', null);
            this.model.destroy();
            ev.stopPropagation();
        },

        addRule: function (ev) {
            this.collection.add(new $.querycomponent.models.Rule());
            ev.stopPropagation();
        },

        addGroup: function (ev) {
            this.collection.add(new $.querycomponent.models.Group());
            ev.stopPropagation();
        },

        applyAnchorsVisibilityClasses: function () {
            var rulesCount = this.getRulesCount();
            var groupsCount = this.getGroupsCount();
            var addRuleAnchor = this.$el.find('.addRule').last();
            var addGroupAnchor = this.$el.find('.addGroup').last();

            if (this.model.get('groupOp') === 'NOT') {
                if (rulesCount > 0 || groupsCount > 0) {
                    addRuleAnchor.addClass('hidden');
                } else {
                    addRuleAnchor.removeClass('hidden');
                }

                if (rulesCount + groupsCount > 0) {
                    addGroupAnchor.addClass('hidden');
                } else {
                    addGroupAnchor.removeClass('hidden');
                }
            } else {
                addGroupAnchor.removeClass('hidden');
                addRuleAnchor.removeClass('hidden');
            }
        },

        onRender: function () {
            if (this.hideRemove) {
                this.$el.find('.remove').first().remove();
            }
            this.setSelect(this.el, this.model, 'groupOp');
            this.callbacks(this.$el, this.model);
            this.applyAnchorsVisibilityClasses();
            this.applyBorderColor();
        },

        operationChanged: function (ev) {
            var previousModel = this.model.clone();

            if (ev.target.value === 'NOT' && (this.getRulesCount() > 1 || this.getGroupsCount() > 1)) {
                this.model.set('groupOp', previousModel.get('groupOp'));
                this.$el.find('select').first().val(this.model.get('groupOp'));
            }

            this.synchModel(ev);
            this.applyBorderColor();
            this.applyAnchorsVisibilityClasses();
        },

        getRulesCount: function () {
            return JSON.parse(JSON.stringify(this.model.get('rules')))
                .filter(function (rule) {
                    return rule.rules === undefined;
                })
                .length;
        },

        getGroupsCount: function () {
            return this.model.get('rules').length - this.getRulesCount();
        },

        applyBorderColor: function () {
            this.$el
                .find('.qc-group')
                .first()
                .removeClass('and or not')
                .addClass(this.model.get('groupOp').toLowerCase());
        }

    });
    $.querycomponent.views.EligibilityView = $.app.ItemView.extend({

        template: 'common/querycomponent/employmentEligibilityClause',

        events: {
            'change input.dp, select': 'fieldChanged' // cannot use 'synchModel' here, as data must be an object
        },

        initialize: function (options) {
            var innerOptions = options.options || {};
            this.property = this.model.attributes.field;
            this.model.set('data', new Backbone.Model({
                "id": innerOptions.id || null, // criteriaId
                "languageId": innerOptions.languageId || null,
                "state": innerOptions.state || "",
                "criteriaName": innerOptions.criteriaName || "",
                "languageName": innerOptions.languageName || "",
                "stateDateSince": innerOptions.stateDateSince || "",
                "stateDateUntil": innerOptions.stateDateUntil || ""
            }));
        },

        onRender: function () {
            var that = this;
            var dataModel = this.model.get('data');

            var stateValue = dataModel.get('state');
            var criteriaName = dataModel.get('criteriaName');
            var languageName = dataModel.get('languageName');
            var stateDateSinceValue = dataModel.get('stateDateSince');
            var stateDateUntilValue = dataModel.get('stateDateUntil');

            this.setSelected(".state", stateValue);
            this.callbacks(this.$el, this.model);

            $.common.generateAutoComplete(this.$el.find(".criteriaId"), {
                url: "/api/company/" + App.config.company.id + "/criteria",
                idAttr: 'id',
                displayAttr: 'name',
                attrToSet: 'criteriaId',
                searchProperty: 'name',
                sortProperty: 'name',
                sortDirection: 'asc'
            }, this.model, function (id, params, ui) {
                that.setData({
                    'id': id,
                    'criteriaName': ui.item.label
                });
            });

            if (criteriaName) {
                this.$el.find(".criteriaId").val(criteriaName);
            }

            $.common.generateAutoComplete(this.$el.find(".languageId"), {
                url: "/language/listAvailable",
                idAttr: 'id',
                displayAttr: 'label',
                attrToSet: 'languageId',
                searchProperty: 'language.description'
            }, this.model, function (id, params, ui) {
                that.setData({
                    'languageId': id,
                    'languageName': ui.item.label
                });
            });

            if (languageName) {
                this.$el.find(".languageId").val(languageName);
            }

            $.querycomponent.helpers.ViewHelper.addDatepicker(this.$el.find('.stateDateSince.dp').first());

            if (stateDateSinceValue) {
                this.$el.find(".stateDateSince.dp").val(stateDateSinceValue);
            }

            $.querycomponent.helpers.ViewHelper.addDatepicker(this.$el.find('.stateDateUntil.dp').first());

            if (stateDateUntilValue) {
                this.$el.find(".stateDateUntil.dp").val(stateDateUntilValue);
            }
        },

        setSelected: function (selector, value) {
            var finalSelector,
                $select;

            if (!selector) {
                return;
            }

            finalSelector = value ?
                selector + " option[value=" + value + "]" :
                selector + " option:first";

            $select = this.$el.find(finalSelector);

            if ($select.length === 0) {
                return;
            }

            $select.prop("selected", "selected")
                .attr("selected", "selected");

            this.setData({
                "state": $select.val()
            });
        },

        setData: function (obj) {
            this.model.get('data').set(obj);
        },

        getUpdatedProp: function (domElm) {
            var updatedProp = {};
            updatedProp[domElm.name] = domElm.value;
            return updatedProp;
        },

        fieldChanged: function (ev) {
            ev.stopPropagation(); // prevent bubbling. Do not delete this.
            this.setData(this.getUpdatedProp(ev.target));
        }
    });
    $.querycomponent.views.SavedSearchItemView = $.app.ItemView.extend({
        template: 'common/querycomponent/savedSearch',
        events: {
            'click .saved-search': 'searchClicked',
            'click .remove': 'removeSavedSearch'
        },
        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, {
                title: this.model.description()
            });
        },
        removeSavedSearch: function () {
            this.model.destroy();
        },
        searchClicked: function (ev) {
            var searchQueryModel = this.buildSearchModel(this.model);
            this.trigger('searchSelected', searchQueryModel);
        },
        onRender: function () {
            // remove wrapping div for css styles
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },
        buildSearchModel: function (loadedSearchModel) {
            var model = loadedSearchModel.clone();
            var filtersModel = $.querycomponent.helpers.ModelsHelper.buildGroupModel(model.get('filters'));
            model.set('filters', filtersModel);
            return model;
        }
    });
    $.querycomponent.views.SavedSearchCollectionView = $.app.CompositePaginatorView.extend({
        template: 'common/querycomponent/savedSearchs',
        itemView: $.querycomponent.views.SavedSearchItemView,
        onAfterItemAdded: function (itemView) {
            this.listenTo(itemView, 'searchSelected', function (payload) {
                this.trigger('searchSelected', payload);
            });
        },
        initialize: function (options) {
            this.collection = options.collection;
        },
        appendHtml: function (collectionView, itemView, index) {
            collectionView.$('.saved-searchs-container').append(itemView.el);
        },
        events: {
            'click li.previous': 'previous',
            'click li.next': 'next'
        }
    });
    $.querycomponent.views.MainView = $.app.ItemView.extend({

        template: 'common/querycomponent/main',
        events: {
            'click .search': 'search',
            'click .save-button': 'save',
            'click .clear-search': 'clear',
            'keyup .search-name': 'inputChange',
            'change input': 'synchModel',
            'click .close-modal': 'close'
        },

        runBuilder: function (rules, fb) {
            var that = this;
            rules.forEach(function (rule) {
                if (rule.rules) {
                    var newFb = fb.addGroup(rule.groupOp);
                    that.runBuilder(rule.rules, newFb);
                    newFb.done();
                } else {
                    fb.addRule(rule);
                }
            });
        },

        search: function (ev) {
            var queryFilters = JSON.parse(JSON.stringify(this.model.attributes));

            var filtersModel = queryFilters.filters;
            var fb = new $.filterbuilder.init({
                groupOp: filtersModel.groupOp,
                rules: []
            });
            this.runBuilder(filtersModel.rules, fb);
            queryFilters.filters = fb.build();

            this.onSearch(queryFilters);
            this.lastQueryFilters = queryFilters;
            this.close();
        },

        onRender: function () {
            var $modalEl = $("#modalContainer");
            $modalEl.html(this.el);
            $modalEl.modal('show');
            $modalEl.addClass('modal-large');

            var that = this;
            this.filters = new $.querycomponent.models.Filters({
                url: this.filtersUrl
            });
            this.filters.fetch({
                success: function () {
                    new $.querycomponent.views.GroupView({
                        model: that.model.get('filters'),
                        el: that.$('.qc-clauses'),
                        filters: that.filters,
                        hideRemove: true
                    }).render();
                }
            });

            this.savedSearchsView = new $.querycomponent.views.SavedSearchCollectionView({
                el: this.$el.find('#saved-searchs'),
                collection: this.savedSearchCollection
            });
            this.savedSearchsView.render();
            this.listenTo(this.savedSearchsView, 'searchSelected', function (payload) {
                this.model = payload;
                this.render();
                this.$el.find('.save-button').prop('disabled', false);
            });

            this.callbacks(this.$el, this.model);
            this.delegateEvents();
        },

        initialize: function (options) {
            var filters = options.filters || options.currentFilters;
            this.onSearch = options.onSearch;
            this.model = new $.querycomponent.models.SavedSearchModel({
                name: null,
                filters: filters ? $.querycomponent.helpers.ModelsHelper.buildGroupModel(filters) : new $.querycomponent.models.Group(),
                endpoint: options.endpoint,
                company: {
                    id: App.config.company.id
                },
                /* page: 1,
                rows: 25, */
                sidx: 'createdDate',
                sord: 'asc'
            });
            this.filtersUrl = App.config.context + options.endpoint + '/filters';

            var fb = new $.filterbuilder.init({
                groupOp: "AND",
                rules: [{
                    field: "endpoint",
                    op: "eqw",
                    data: options.endpoint
                }]
            });
            this.savedSearchCollection = new $.querycomponent.models.SavedSearchCollection();
            this.savedSearchCollection.state.pageSize = 5;
            this.savedSearchCollection.queryParams.filters = JSON.stringify(fb.build());
            this.savedSearchCollection.fetch();
        },

        save: function () {
            var that = this;
            this.model.save({}, {
                success: function () {
                    that.savedSearchCollection.reset();
                    that.savedSearchCollection.fetch({});
                }
            });
        },

        clear: function () {
            this.model.set('id', null);
            this.model.set('name', null);
            this.model.set('filters', new $.querycomponent.models.Group());
            this.render();
        },

        inputChange: function (ev) {
            this.$el.find('.save-button').prop('disabled', ev.target.value.length === 0);
        },

        close: function () {
            var $modalEl = $("#modalContainer");
            $modalEl.removeClass('modal-large');
            $modalEl.modal('hide');
            this.remove();
        }
    });

    /**
     * @param options.endpoint:
     * @param options.onSearch: callback function to be called when search button is hit
     */
    $.querycomponent.init = function (options) {
        return new $.querycomponent.views.MainView({
            endpoint: options.endpoint,
            onSearch: options.onSearch,
            filters: options.filters
        });
    };

})(jQuery);
