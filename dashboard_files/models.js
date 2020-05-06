/*
 * Copyright (C) 2013 Interpreter Intelligence, Inc. <support@interpreterintelligence.com>
 *
 * app/models.js
 * <copyright notice>
 */

/* TODO: enable strict mode */
//"use strict";

/*
 * NOTE: model object assocations cannot have null in request. Caused parse / binding issue
 * for command object.
 *
 */


/*var User = Backbone.Model.extend({
    defaults: App.dict.defaults.user,
    url: function () {
        return this.id ? App.config.context + '/api/user/' + this.id : App.config.context + '/api/user';
    }
});

var Users = Backbone.Collection.extend({
    model: User,
    url: App.config.context + '/api/user',

    fetch: function (options) {
        options = options || {};
        options.data = options.data || {};
        options.data.rows = options.rows;
        options.data.filters = JSON.stringify(options.filters);

        return Backbone.Collection.prototype.fetch.call(this, options);
    }
});*/

var Message = Backbone.Model.extend({
    defaults: App.dict.defaults.message,
    url: function () {
        return this.id ? App.config.context + '/api/message/' + this.id : App.config.context + '/api/message';
    }
});

var Messages = Backbone.Collection.extend({
    model: Message,
    url: App.config.context + '/api/message',

    fetch: function (options) {
        options = options || {};
        options.data = options.data || {};
        options.data.rows = options.rows;
        options.data.filters = JSON.stringify(options.filters);

        return Backbone.Collection.prototype.fetch.call(this, options);
    }
});
