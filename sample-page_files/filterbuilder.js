(function ($) { //@ sourceURL=app/component/filterbuilder.js
    /* enable strict mode */
    'use strict';

    $.filterbuilder = {

        /**
         * Initializes with a base filter.
         * @param initFilters Optional parameter. Will default to {groupOp: 'AND', rules: []} if not (or null) provided
         */
        init: function Builder(initFilters) {

            var apply = true;
            var builders = [this];

            var filters = initFilters || {
                groupOp: 'AND',
                rules: []
            };

            this._setBuilders = function (newbuilders) {
                builders = newbuilders;
            };

            /**
             * Adds a filter to the base filter rules.
             * @param filter The rule to be added
             * @param condition An optional parameter to indicate whether or not the rule should be applied
             * @param name The filter name helps the remove method to identify the rule
             * @returns {$.filterbuilder}
             */
            this.add = function (filter, condition, name) {
                filters.rules = filters.rules || [];
                condition = condition === undefined ? true : condition;
                filter = _.extend(filter, {
                    name: name
                });

                if (condition) {

                    filters.rules.push(filter);
                }

                return builders[builders.length - 1];
            };

            /**
             * Calls add() on each rule
             * @param rules Filters to be added
             * @returns {$.filterbuilder}
             */
            this.addAll = function (rules) {
                if (rules) {
                    var that = this;
                    rules.forEach(function (rule) {
                        that.add(rule);
                    });
                }
                return builders[builders.length - 1];
            };

            /**
             *
             * @param rule Rule object with the following properties: op, field, data, type, friendlyName
             * @returns {*}
             */
            this.addRule = function (rule) {
                filters.rules = filters.rules || [];
                filters.rules.push({
                    op: rule.op,
                    field: rule.field,
                    data: rule.data,
                    type: rule.type,
                    friendlyName: rule.friendlyName,
                    name: rule.name
                });

                return builders[builders.length - 1];
            };

            /**
             *
             * @param groupOp Group object with the following properties: groupOp. Method done() should be called after
             * finishing the group construction
             * @param name The filter name helps the remove method to identify the rule
             * @deprecated Prefer using nested filterbuilder instances as it provides more legible code
             * Example: instead of new $.filterbuilder.init().addGroup()....done().build()
             *                 use new $.filterbuilder.init().add(
             *                      new $.filterbuilder.init().build()
             *                 ).build();
             * @returns {*}
             */
            this.addGroup = function (groupOp, apply, name) {
                var nestedFb = new $.filterbuilder.init({
                    groupOp: groupOp,
                    rules: [],
                    name: name
                });
                nestedFb._setBuilders(builders);
                nestedFb.apply = apply !== false;

                filters.rules = filters.rules || [];

                builders.push(nestedFb);

                return nestedFb;
            };

            /**
             * Closes a previously opened group and returns the parent builder
             * @returns {*}
             */
            this.done = function () {
                var currentBuilder = builders[builders.length - 1];
                builders.splice(-1, 1);
                var parentBuilder = builders[builders.length - 1];

                if (currentBuilder.apply) {
                    var filter = currentBuilder._build();
                    parentBuilder.add(filter, true, filter.name);
                }

                return parentBuilder;
            };

            /**
             * Tries to find the given filter based on field and operation. If found it is updated, if not it will be added.
             * @param filter
             * @param condition An optional parameter to indicate whether or not the rule should be applied
             * @returns {$.filterbuilder}
             */
            this.update = function (filter, condition) {
                condition = condition === undefined ? true : condition;

                if (condition) {
                    var match = _.find(filters.rules, function (rule) {
                        return rule.op === filter.op && rule.field === filter.field;
                    });

                    if (match) {
                        match.data = filter.data;
                        if (filter.friendlyName) {
                            match.friendlyName = filter.friendlyName;
                        } else {
                            delete match.friendlyName;
                        }
                        if (filter.range) {
                            match.range = filter.range;
                        } else {
                            delete match.range;
                        }
                        if (filter.format) {
                            match.format = filter.format;
                        } else {
                            delete match.format;
                        }
                    } else {
                        builders[builders.length - 1].add(filter);
                    }
                }

                return builders[builders.length - 1];
            };

            /**
             * Calls update() on each rule.
             * @param rules Array of rules
             * @returns {$.filterbuilder}
             */
            this.updateAll = function (rules) {
                if (rules) {
                    var that = builders[builders.length - 1];
                    rules.forEach(function (rule) {
                        that.update(rule);
                    });
                }
                return builders[builders.length - 1];
            };

            /**
             * Removes the given rule based on field and operation.
             * @param filter The rule to be removed
             * @param condition An optional parameter to indicate whether or not the rule should be applied
             * @returns {$.filterbuilder}
             */
            this.remove = function (filter, condition) {
                condition = condition === undefined ? true : condition;

                if (condition && filters.rules) {
                    filters.rules = filters.rules.filter(function (rule) {
                        return !(rule.op === filter.op && rule.field === filter.field);
                    });
                }

                return builders[builders.length - 1];
            };

            this._removeFromRules = function (filters, name) {
                var i = (filters || 0).length;

                while (i--) {
                    if (filters[i].name === name) {
                        filters.splice(i, 1);
                    }
                }
            };

            this._removeByName = function (filters, name) {
                this._removeFromRules(filters, name);

                var that = this;
                (filters || []).forEach(function (filter) {
                    that._removeByName(filter.rules, name);
                });
            };

            /**
             * Removes all the rules and groups matching the given name, starting from current filterbuilder level
             * @param name
             * @returns {$.filterbuilder}
             */
            this.removeByName = function (name, condition) {
                condition = condition === undefined ? true : condition;

                if (condition) {
                    this._removeByName(filters.rules, name);
                }

                return builders[builders.length - 1];
            };

            /**
             * Calls remove() on each rule.
             * @param rules Array of rules
             * @returns {$.filterbuilder}
             */
            this.removeAll = function (rules) {
                var that = builders[builders.length - 1];
                if (rules) {
                    rules.forEach(function (rule) {
                        that.remove(rule);
                    });
                }
                return builders[builders.length - 1];
            };

            /**
             * Calls the provided function
             * @param callback The function to be called
             * @param args The arguments of the callback function. The first one is a reference to this filterbuilder
             * @param condition An optional parameter to indicate whether or not the function should be called
             * @returns {$.filterbuilder}
             */
            this.call = function (callback, args, condition) {
                condition = condition === undefined ? true : condition;

                if (condition) {
                    args.unshift(builders[builders.length - 1]);
                    callback.apply(builders[builders.length - 1], args);
                }

                return builders[builders.length - 1];
            };

            this._build = function () {
                return filters;
            };

            /**
             * Builds the filters array.
             * @returns {*|{groupOp: string, rules: Array}}
             */
            this.build = function () {
                if (builders.length > 1) {
                    throw "Could not build filter. There are unclosed groups.";
                }
                return filters;
            };

            /**
             *
             * @returns {string} String representation of the filters json
             */
            this.toString = function () {
                return JSON.stringify(builders[builders.length - 1].build());
            };

            /**
             * Transforms Filters Object into a human-friendly string.
             *
             * @returns {string}
             */
            this.getReadableQuery = function () {
                var root = this.build();
                var dictBookingStatus = App.dict.bookingStatus;
                var rulesToHide = $.common.isAdmin() ? [] : [
                    "client.id",
                    "customer.id",
                    "location.id",
                    "interpreters",
                    "superBooking.id",
                    "employmentCategory.id",
                    "company.id",
                    "languageMappings.rating"
                ];

                if (_.isEmpty(root) || !_.isObject(root)) {
                    return "";
                }

                function getGroupOp(filter) {
                    return filter.groupOp || "";
                }

                function getRuleType(rule) {
                    return rule.type || "";
                }

                function getRuleField(rule) {
                    return rule.field || "";
                }

                function getRuleFriendlyName(rule) {
                    return rule.friendlyName || "";
                }

                function getRuleData(rule) {
                    return rule.data;
                }

                function getRuleName(rule) {
                    return getRuleFriendlyName(rule) || getRuleField(rule);
                }

                function getRuleOp(rule) {
                    if (getRuleType(rule) === "booleanType") {
                        return "eq";
                    }
                    return rule.op || "";
                }

                function getFriendlyOp(rule) {
                    var ruleOp = getRuleOp(rule);
                    var opMap = {
                        "eq": "equal to", // "EQUAL TO",
                        "eqw": "equal to", // "EQUAL TO",
                        "eqd": "equal to", // "EQUAL TO",
                        "le": "less or equal to", // "LESS THAN",
                        "led": "less or equal to", // "LESS THAN",
                        "ge": "greater or equal to", // "GREATER THAN",
                        "ged": "greater or equal to", // "GREATER THAN",
                        "sw": "starts with", // "STARTS WITH",
                        "ew": "ends with", // "ENDS WITH",
                        "bw": "contains" // "CONTAINS"
                    };

                    return opMap[ruleOp] || "";
                }

                function getFriendlyStatusNames(statusIds) {
                    var ids = statusIds.split(",");
                    var statusNames = [];

                    _.each(ids, function (statusId) {
                        var statusName = getFriendlyStatusName(parseInt(statusId, 10));
                        if (statusName) {
                            statusNames.push(statusName);
                        }
                    });

                    return statusNames.join(" AND ") || "";
                }

                function getFriendlyStatusName(statusId) {
                    var friendlyStatusName = "";
                    var statusObj = _.find(dictBookingStatus, function (bookingStatus) {
                        return bookingStatus.id === statusId;
                    });

                    if (statusId === "all") {
                        friendlyStatusName = "status equal to all";
                    } else if (statusObj && statusObj.name) {
                        friendlyStatusName = "status equal to " + statusObj.name;
                    }

                    return friendlyStatusName;
                }

                function getRules(filter) {
                    return filter.rules || [];
                }

                function getEmploymentEligibilityState(id) {
                    var stateFound = _.find(App.dict.employmentEligibilityStates, function (state) {
                        return state.id === parseInt(id, 10);
                    });

                    return stateFound.name || "";
                }

                function getFriendlyEligibility(data) {
                    var friendlyData = [];

                    if (data.criteriaName) {
                        friendlyData.push("criteria: " + data.criteriaName);
                    }
                    if (data.languageName) {
                        friendlyData.push("language: " + data.languageName);
                    }
                    if (data.state) {
                        friendlyData.push("state: " + getEmploymentEligibilityState(data.state));
                    }
                    if (data.stateDateSince) {
                        friendlyData.push("since: " + data.stateDateSince);
                    }
                    if (data.stateDateSince) {
                        friendlyData.push("until: " + data.stateDateUntil);
                    }

                    return "Eligibility (" + friendlyData.join(", ") + ")";
                }

                function getFriendlyRule(rule) {
                    switch (getRuleName(rule)) {
                    case "status.id":
                        return getFriendlyStatusName(getRuleData(rule));
                    case "status.ids":
                        return getFriendlyStatusNames(getRuleData(rule));
                    case "Eligibility":
                        return getFriendlyEligibility(getRuleData(rule));
                    default:
                        return getRuleName(rule) + " " + getFriendlyOp(rule) + " " + getRuleData(rule) + " ";
                    }
                }

                function isGroup(rule) {
                    return typeof rule.groupOp === "string" &&
                        rule.groupOp !== "";
                }

                function removeHiddenRulesFromGroupRules(groupRules) {
                    return _.filter(groupRules, function (rule) {
                        return _.indexOf(rulesToHide, getRuleName(rule)) === -1;
                    });
                }

                function makeGroupFriendly(group) {
                    var finalHtml = "";
                    var groupOp = getGroupOp(group);
                    var groupRulesCleaned = removeHiddenRulesFromGroupRules(getRules(group));

                    _.each(groupRulesCleaned, function (rule, index, groupRulesCleaned) {
                        var ruleHtml = "";

                        ruleHtml += isGroup(rule) ?
                            "(" + makeGroupFriendly(rule) + ") " :
                            getFriendlyRule(rule);

                        finalHtml += index < groupRulesCleaned.length - 1 ?
                            ruleHtml + " " + groupOp + " " :
                            ruleHtml; // Do not add AND, OR, NOT at the end
                    });

                    return finalHtml.trim();
                }

                return makeGroupFriendly(root);
            };

        }

    };

})(jQuery);
