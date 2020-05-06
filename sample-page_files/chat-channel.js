(function ($) { //@ sourceURL=app/view/chat/chat-channel.js

    var MESSAGES_PAGE_SIZE = 100;
    var ENTER_KEY_CODE = 13;

    $.chat = _.extend($.chat || {}, {
        channel: {
            views: {},
            models: {}
        }
    });
    $.chat.channel.models.MessageModel = $.core.BaseModel.extend({});
    $.chat.channel.models.MessageCollectionModel = $.core.BaseCollection.extend({
        model: $.chat.channel.models.MessageModel,

        initialize: function (models, options) {
            this.models = models;
            this.channel = options.channel;
            this.getLastConsumedMessageIndex = options.getLastConsumedMessageIndex;
        },

        fetchPreviousStarted: function () {
            this.fetching = true;
            this.trigger("fetching-previous");
        },

        fetchPreviousEnded: function () {
            this.fetching = false;
            this.trigger("fetched-previous");
        },

        fetchNextStarted: function () {
            this.fetching = true;
            this.trigger("fetching-next");
        },

        fetchNextEnded: function () {
            this.fetching = false;
            this.trigger("fetched-next");
        },

        /**
         *
         * @param index Index until to get messages to
         * @param callback
         * @param extra This allows to load messages after index. Useful for loading unread messages.
         */
        fetchPreviousPage: function (index, callback, extra) {
            var that = this;

            if (!extra) {
                extra = 0;
            }

            if (!this.fetching) {
                this.fetchPreviousStarted();
                this.channel
                    .getMessages(MESSAGES_PAGE_SIZE + extra, index - 1 + extra)
                    .then(function (messages) {
                        messages.items
                            .filter(function (m) {
                                return m && m.body.trim().length > 0;
                            })
                            .forEach(function (m) {
                                var msg = m.state;
                                msg.type = "MESSAGE";
                                that.add(msg);
                            });

                        that.fetchPreviousEnded();
                        that.resetSeparators();
                        that.trigger("ready");

                        if (_.isFunction(callback)) {
                            callback({
                                lowerIndex: messages.items.length > 0 ? messages.items[0].state.index : 0,
                                upperIndex: messages.items.length > 0 ? messages.items[messages.items.length - 1].state.index : 0
                            });
                        }
                    });
            }
        },

        fetchNextPage: function (index, callback) {
            var that = this;

            if (!this.fetching) {
                this.fetchNextStarted();
                this.channel
                    .getMessages(MESSAGES_PAGE_SIZE, index, "forward")
                    .then(function (messages) {
                        messages.items
                            .filter(function (m) {
                                return m && m.body.trim().length > 0;
                            })
                            .forEach(function (m) {
                                var msg = m.state;
                                msg.type = "MESSAGE";
                                that.add(msg);
                            });

                        that.fetchNextEnded();
                        that.resetSeparators();
                        that.trigger("ready");

                        if (_.isFunction(callback)) {
                            callback({
                                lowerIndex: messages.items[0].state.index,
                                upperIndex: messages.items[messages.items.length - 1].state.index
                            });
                        }
                    });
            }
        },

        resetSeparators: function () {
            var messageModels = this.models.filter(function (m) {
                return m.get("type") === "MESSAGE";
            });
            this.reset();

            var previousDate;
            var unreadIndex = this.getLastConsumedMessageIndex();
            var unreadAdded = false;

            var modelsWithSeparators = [];
            messageModels.forEach(function (msg) {
                if (!previousDate || previousDate.getDate() !== new Date(msg.get("timestamp")).getDate()) {
                    modelsWithSeparators.push({
                        date: new Date(msg.get("timestamp")),
                        index: msg.get("index"),
                        type: "DATE_SEPARATOR"
                    });
                    previousDate = new Date(msg.get("timestamp"));
                }

                if (!unreadAdded && msg.get("index") > unreadIndex) {
                    unreadAdded = true;
                    modelsWithSeparators.push({
                        type: "UNREAD_SEPARATOR",
                        index: msg.get("index")
                    });
                }

                msg.type = "MESSAGE";
                modelsWithSeparators.push(msg);
            });

            this.add(modelsWithSeparators);
        },

        comparator: function (m1, m2) {
            if (m1.get("index") !== m2.get("index")) {
                return m1.get("index") - m2.get("index");
            } else {

                if (m1.get("type") === "MESSAGE") {

                    if (m2.get("type") === "DATE_SEPARATOR") {
                        return 1;
                    } else if (m2.get("type") === "UNREAD_SEPARATOR") {
                        return 1;
                    }

                } else if (m1.get("type") === "DATE_SEPARATOR") {

                    if (m2.get("type") === "MESSAGE") {
                        return -1;
                    } else if (m2.get("type") === "UNREAD_SEPARATOR") {
                        return -1;
                    }

                } else {

                    return 1;

                }

            }
        }

    });

    $.chat.channel.views.IsTypingView = $.app.ItemView.extend({
        template: "chat/channel/typing",
        serializeData: function () {
            return {
                obj: this.model.toJSON(),
                mapping: $.chat.mappingModel.mapping || {}
            };
        }
    });

    $.chat.channel.views.UsersTypingView = $.app.CollectionView.extend({
        itemView: $.chat.channel.views.IsTypingView,
        initialize: function () {
            _.bindAll(this, "typingStartedHandler", "typingEndedHandler");
            this.collection = new Backbone.Collection([]);
        },
        typingStartedHandler: function (member) {
            var that = this;
            this.$el.show();

            // Make sure we got the mapping before showing who is writing
            $.chat.mappingModel.updateMappings([member.state.identity], {
                success: function () {
                    // avoid adding the same member more than once
                    that.removeMemberFromUserIsTypingCollection(member);
                    that.collection.add({
                        user: member.state.identity
                    });
                }
            });
        },

        removeMemberFromUserIsTypingCollection: function (member) {
            var model = this.collection.findWhere({
                user: member.state.identity
            });
            this.collection.remove(model);
        },

        typingEndedHandler: function (member) {
            this.removeMemberFromUserIsTypingCollection(member);

            if (this.collection.length === 0) {
                this.$el.hide();
            }
        }
    });

    $.chat.channel.views.AskNicknameView = $.app.ItemView.extend({
        el: $("#modalContainer"),
        template: "chat/channel/ask-nickname",
        events: {
            "click .cmd-widget-accept": "accept",
            "click .cmd-widget-close": "cancel",
            "change input": "synchModel"
        },

        initialize: function (options) {
            var that = this;
            this.acceptCallback = options.onAccept;
            this.cancelCallback = options.onCancel;
            this.model = new Backbone.Model();
            this.$el.on("hide", function () {
                that.close();
            });
        },

        accept: function () {
            this.acceptCallback(this.model);
            this.$el.modal("hide");
        },

        cancel: function () {
            this.cancelCallback();
            this.$el.modal("hide");
        },

        onRender: function () {
            this.$el.modal({
                backdrop: "static"
            });
        }
    });

    $.chat.channel.views.SendMessageView = $.app.ItemView.extend({
        template: "chat/channel/sendmessage",
        events: {
            "click .send-new-message": "sendMessage",
            "keypress .new-message-text": "onKeyPressed",
            "keyup .new-message-text": "onKeyUp"
        },

        initialize: function (options) {
            this.model = new Backbone.Model();
        },

        twilioChatReady: function (channel) {
            this.channel = channel;
            // console.log("twilio channel udpated");
        },

        sendMessage: function (ev) {
            var that = this;
            var isInvitedUser = !$.chat.me.user;
            var timestamp = new Date().getTime();
            var message = this.model.get("text");

            if (isInvitedUser && !this.model.get("nickname")) {
                new $.chat.channel.views.AskNicknameView({
                    onAccept: function (model) {
                        new $.core.TwilioIdentityMappingModel()
                            .registerInvited({
                                data: JSON.stringify({
                                    companyUuid: $.chat.me.company.uuid,
                                    friendlyName: model.get("nickname")
                                }),
                                success: function (tim) {
                                    var nickname = that.model.get("text");
                                    that.model.set("nickname", nickname);
                                    that._onRegistrationOk(tim, nickname, timestamp);
                                }
                            });
                    },
                    onCancel: function () {
                        that.trigger("onNewNicknameCanceled");
                    }
                }).render();
            } else {
                that._sendMessage(message, timestamp);
            }

            if (message && message.trim().length > 0) {
                that.trigger("messageSent", {
                    body: message,
                    author: $.chat.me.identity,
                    timestamp: timestamp
                });
            }
        },

        _sendMessage: function (message, timestamp) {
            if (message && message.trim().length > 0) {
                this.channel.sendMessage(message, {
                    timestamp: timestamp
                });
                this.$el.find(".new-message-text").val("");
                this.model.set("text", null);
            }
        },

        _onRegistrationOk: function (tim, message, timestamp) {
            var that = this;
            $.chat.me = tim;
            new $.core.TwilioTokensModel()
                .getChatToken({
                    data: {
                        identity: tim.identity
                    },
                    success: function (tokenModel) {
                        $.chat.helpers
                            .getClient()
                            .shutdown()
                            .then(function () {
                                Twilio.Chat.Client
                                    .create(tokenModel.get("jwt"))
                                    .then(function (client) {
                                        $.chat.helpers.getClient = function () {
                                            return client;
                                        };
                                        that.trigger("onNewNickname", message);
                                        client
                                            .getChannelByUniqueName(that.channel.uniqueName)
                                            .then(function (channel) {
                                                that.channel = channel;
                                                that.trigger("onNewChannelInstance", channel);
                                                that.channel
                                                    .join()
                                                    .then(function () {
                                                        var message = that.model.get("text");
                                                        that._sendMessage(message, timestamp);
                                                    });
                                            });
                                    })
                                    .catch(function (error) {
                                        console.log("Error updating token", error);
                                    });
                            });
                    }
                });
        },

        newNicknameApplied: function () {
            this.channel.sendMessage("newNicknameApplied");
            this.$el.find(".new-message-text").val("");
        },

        onKeyPressed: function (ev) {
            if (ev.which === ENTER_KEY_CODE) {
                return false;
            }
        },

        onKeyUp: function (ev) {
            this.synchModel(ev);
            this.channel.typing();

            // send messages when pressing enter key
            if (ev.which === ENTER_KEY_CODE) {
                if (this.model.get("text").trim()) {
                    this.sendMessage();
                }
            }
        }
    });

    $.chat.channel.views.SendingMessageView = $.app.ItemView.extend({
        template: "chat/channel/sending-message",
        initialize: function (options) {
            this.model = options.model;
        },
        serializeData: function () {
            return {
                messageId: this.model.cid,
                mapping: $.chat.mappingModel.mapping || {},
                obj: _.extend(this.model.toJSON(), {
                    "msg_date": new Date(this.model.toJSON().timestamp).toISOString()
                })
            };
        },
        onRender: function () {
            this.formatElements();
            this.removeWrappingDiv();
        },
        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        }
    });

    $.chat.channel.views.MessageView = $.app.ItemView.extend({
        template: "chat/channel/message",
        onRender: function () {
            this.formatElements();
            this.removeWrappingDiv();
        },
        serializeData: function () {
            return {
                obj: _.extend(this.model.toJSON(), {
                    "msg_date": this.model.toJSON().timestamp.toISOString()
                }),
                mapping: $.chat.mappingModel.mapping || {},
                identity: $.chat.me.identity
            };
        },
        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        }
    });

    $.chat.channel.views.ConversationWrapperView = $.app.ItemView.extend({
        events: {
            "click .btn-to-bottom": "scrollToBottom"
        },
        template: "chat/channel/conversation-wrapper",
        initialize: function (options) {
            this.parentSelector = options.parentSelector;
        },
        onRender: function () {
            this.removeWrappingDiv();
            new $.chat.channel.views.ConversationView({
                collection: this.collection,
                el: this.parentSelector + " .chat-messages"
            }).render();
            // new $.chat.channel.views.SendingMessageView({
            //     el: this.parentSelector + " .sending-message"
            // }).render();
            var that = this;
            var messagesEl = this.$el.find(".chat-messages");
            messagesEl.scroll(function (ev) {
                that.trigger("handleInfiniteScroll", ev);
            });
            messagesEl.scroll(_.debounce(function (ev) {
                that.trigger("handleLastReadMessage", ev);
            }, 250));
            messagesEl.scroll(_.debounce(function (ev) {
                that.trigger("handleScrollToBottomButton", ev);
            }, 250));
        },
        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },
        showUpperSpinner: function () {
            this.$el.find(".spinner-upper").show();
        },
        hideUpperSpinner: function () {
            this.$el.find(".spinner-upper").hide();
        },
        showLowerSpinner: function () {
            this.$el.find(".spinner-lower").show();
        },
        hideLowerSpinner: function () {
            this.$el.find(".spinner-lower").hide();
        },
        scrollToBottom: function () {
            this.trigger("scrollToBottom");
        },
        showScrollToBottomButton: function () {
            this.$el.find(".btn-to-bottom").show();
        },
        hideScrollToBottomButton: function () {
            this.$el.find(".btn-to-bottom").hide();
        }
    });

    $.chat.channel.views.DateSeparatorView = $.app.ItemView.extend({
        template: "chat/channel/date-separator",
        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },
        onRender: function () {
            this.removeWrappingDiv();
            this.formatElements();
        },
        serializeData: function () {
            return {
                obj: _.extend(this.model.toJSON(), {
                    "msg_date": this.model.get("date").toISOString()
                })
            };
        }
    });

    $.chat.channel.views.UnreadSeparatorView = $.app.ItemView.extend({
        template: "chat/channel/unread-separator"
    });

    $.chat.channel.views.ConversationView = $.app.CompositeView.extend({
        template: "chat/channel/conversation",
        buildItemView: function (item) {
            switch (item.get("type")) {
            case "DATE_SEPARATOR":
                return new $.chat.channel.views.DateSeparatorView({
                    model: item
                });
            case "UNREAD_SEPARATOR":
                return new $.chat.channel.views.UnreadSeparatorView();
            case "SENDING_MESSAGE":
                return new $.chat.channel.views.SendingMessageView({
                    model: item
                });
            default:
                return new $.chat.channel.views.MessageView({
                    model: item
                });
            }
        }
    });

    $.chat.channel.views.ChannelMainView = $.app.LayoutView.extend({
        template: "chat/channel/main",
        regions: {
            sendmessage: ".send-message-view",
            conversation: ".conversation-view",
            userstyping: ".user-is-typing-view"
        },

        initialize: function (options) {
            _.bindAll(this,
                "messageAddedHandler",
                "handleInfiniteScroll",
                "handleLastReadMessage",
                "handleScrollToBottomButton",
                "newNickname",
                "scrollToUnread"
            );
            this.model = new Backbone.Model({
                lowerIndex: Number.MAX_SAFE_INTEGER,
                upperIndex: 0
            });
            this.attributes = options.attributes;
            this.channelModel = options.channel;
            this.parentSelector = options.parentSelector;
            this.showImmediately = options.showImmediately;
            this.tim = options.tim;
            this.create = options.create;

            this.connectToChannel();
        },

        onBeforeClose: function () {
            if (this.channel) {
                this.channel.removeListener("messageAdded", this.messageAddedHandler);
                this.channel.removeListener("typingStarted", this.usersTypingView.typingStartedHandler);
                this.channel.removeListener("typingEnded", this.usersTypingView.typingEndedHandler);
            }
        },

        scrollToShowSendindMessageView: function () {
            var that = this;
            var messagesEl = this.$el.find(".chat-messages");
            var stickToBottom = true;

            // if (messagesEl) {
            //     var scrollHeight = messagesEl[0].scrollHeight;
            //     var scrollTop = messagesEl.scrollTop();
            //     var height = messagesEl.height();
            //     stickToBottom = scrollTop + height === scrollHeight;
            // }

            if (stickToBottom && messagesEl) {
                that.$el
                    .find(".chat-messages")
                    .animate({
                        scrollTop: that.$el.find(".chat-messages").get(0).scrollHeight
                    }, 1000, "swing");
            }
        },

        handleScrollAndTriggerUnreadStatus: function (message) {
            var that = this;
            var messagesEl = that.$el.find(".chat-messages");
            var stickToBottom = true;

            if (messagesEl) {
                var scrollHeight = messagesEl[0].scrollHeight;
                var scrollTop = messagesEl.scrollTop();
                var height = messagesEl.height();
                stickToBottom = scrollTop + height === scrollHeight;
            }

            var toRemove = this.messages.models.filter(function (model) {
                return model.attributes.type === "SENDING_MESSAGE" &&
                    message.attributes &&
                    model.get("timestamp") === message.attributes.timestamp;
            });

            toRemove.forEach(function (model) {
                that.$el.find("#message-" + model.cid).remove();
            });

            that.messages.add(new Backbone.Model(message.state));
            that.model.set("messageCount", that.model.get("messageCount") + 1);
            that.model.set("upperIndex", message.index);

            if (stickToBottom && messagesEl) {
                that.$el
                    .find(".chat-messages")
                    .animate({
                        scrollTop: that.$el.find(".chat-messages").get(0).scrollHeight
                    }, 1000, "swing", function () {
                        that.updateUnconsumedCount(message);
                    });
            } else {
                this.updateUnconsumedCount(message);
            }
        },

        updateUnconsumedCount: function (message) {
            var that = this;
            if (this.visible && this.isIndexInViewPort(message.index)) {
                this.channel
                    .advanceLastConsumedMessageIndex(message.index)
                    .then(function (unread) {
                        that.model.set("lastConsumedMessageIndex", message.index);
                        that.trigger("unconsumedMessageCountUpdate", unread);
                    });
            } else {
                this.channel
                    .getUnconsumedMessagesCount()
                    .then(function (unread) {
                        that.trigger("unconsumedMessageCountUpdate", $.chat.helpers.sanitizeUnread(
                            that.model.get("messageCount"),
                            unread
                        ));
                    });
            }
        },

        messageAddedHandler: function (message) {
            var that = this;

            if (message.body && message.body.trim().length > 0) {
                $.chat.mappingModel.updateMappings([message.state.author], {
                    success: function () {

                        if (message.author === $.chat.me.identity) {
                            that.channel
                                .setAllMessagesConsumed()
                                .then(function () {
                                    that.handleScrollAndTriggerUnreadStatus(message);
                                });
                        } else {
                            that.handleScrollAndTriggerUnreadStatus(message);
                        }
                    }
                });
            }
        },

        initListeners: function (channel) {
            var that = this;
            this.listenTo(this.messages, "ready", function () {
                that.conversationWrapperView.render();
            });
            this.listenTo(this.messages, "fetching-previous", function () {
                that.conversationWrapperView.showUpperSpinner();
            });
            this.listenTo(this.messages, "fetched-previous", function () {
                that.conversationWrapperView.hideUpperSpinner();
            });
            this.listenTo(this.messages, "fetching-next", function () {
                that.conversationWrapperView.showLowerSpinner();
            });
            this.listenTo(this.messages, "fetched-next", function () {
                that.conversationWrapperView.hideLowerSpinner();
            });

            channel.on("messageAdded", this.messageAddedHandler);
            channel.on("typingStarted", this.usersTypingView.typingStartedHandler);
            channel.on("typingEnded", this.usersTypingView.typingEndedHandler);

            return channel;
        },

        updateModel: function (channel) {
            var that = this;
            this.model.set("lastConsumedMessageIndex", channel.state.lastMessage ? channel.state.lastConsumedMessageIndex || -1 : -1);
            this.model.set("messageCount", channel.state.lastMessage ? channel.state.lastMessage.index + 1 : 0);

            channel
                .getUnconsumedMessagesCount()
                .then(function (unread) {
                    that.model.set("unreadMessageCount", unread);
                    that.trigger("unconsumedMessageCountUpdate", unread === null ? Math.max(that.model.get("messageCount") - 1, 0) : unread);

                    var index = channel.state.lastConsumedMessageIndex || 0;

                    that.fetchPreviousPage(index + 1, function (indexes) {
                        that.model.set("upperIndex", Math.max(that.model.get("upperIndex"), indexes.upperIndex));
                        that.model.set("lowerIndex", Math.min(that.model.get("lowerIndex"), indexes.lowerIndex));
                        that.scrollToIndex(index);
                    }, Math.min(unread || that.model.get("messageCount"), MESSAGES_PAGE_SIZE));
                });
        },

        scrollToUnread: function (callback) {
            var conversationView = this.$el.find(".chat-messages");
            var offset = conversationView.height() / 4;
            var lastConsumedMessageIndex = this.model.get("lastConsumedMessageIndex");
            lastConsumedMessageIndex = (!lastConsumedMessageIndex || lastConsumedMessageIndex === -1) ? 1 : this.model.get("lastConsumedMessageIndex");
            this.scrollToIndex(lastConsumedMessageIndex, offset, callback);
        },

        getChatClient: function () {
            return new Promise(function (res, rej) {
                if ($.chat.helpers.getClient()) {
                    res($.chat.helpers.getClient());
                } else {
                    // chat client may not be created yet if it is not enabled in the company config
                    $.chat.mappingModel.register({
                        success: function (tim) {
                            $.chat.me = tim;
                            new $.core.TwilioTokensModel().getChatToken({
                                data: {
                                    identity: App.config.userData.uuid
                                },
                                success: function (model) {
                                    Twilio.Chat.Client
                                        .create(model.get("jwt"))
                                        .then(function (client) {
                                            $.chat.helpers.getClient = function () {
                                                return client;
                                            };

                                            res(client);
                                        })
                                        .catch(function (error) {
                                            rej(error);
                                        });
                                },
                                error: function (error) {
                                    rej(error);
                                }
                            });
                        },
                        error: function (error) {
                            rej(error);
                        }
                    });
                }
            });
        },

        obtainChannel: function () {
            var that = this;
            return new Promise(function (res, rej) {
                that.getChatClient()
                    .then(function (client) {
                        client
                            .createChannel({
                                uniqueName: that.channelModel.get("uniqueName"),
                                friendlyName: that.channelModel.get("friendlyName"),
                                attributes: {
                                    sideAUuid: that.channelModel.get("sideAUuid"),
                                    sideBUuid: that.channelModel.get("sideBUuid"),
                                    type: that.channelModel.get("type")
                                }
                            })
                            .then(function (newChannel) {
                                that.trigger("channelCreated", newChannel);
                                res(newChannel);
                            })
                            .catch(function (error) {
                                // the channel already existed, so we connect to it
                                res($.chat.helpers.getClient().getChannelByUniqueName(that.channelModel.get("uniqueName")));
                            });
                    })
                    .catch(function (err) {
                        rej(err);
                    });
            });
        },

        createOrGetChannel: function () {
            var that = this;

            return new Promise(function (resolve, reject) {
                if (that.create) {
                    that.obtainChannel()
                        .then(function (channel) {
                            // in vri / opi sessions user may still need to join the chat channel
                            channel
                                .join()
                                .then(function (c) {
                                    // this is needed in vri / opi for correct unread count
                                    c
                                        .advanceLastConsumedMessageIndex(0)
                                        .then(function () {
                                            resolve(c);
                                        });
                                })
                                .catch(function (error) {
                                    console.log('error advancing last consumed index:', error);
                                    resolve(channel);
                                });
                        })
                        .catch(function (error) {
                            console.log('Error obtaining channel', error);
                            reject(error);
                        });
                } else {
                    resolve($.chat.helpers.getClient().getChannelByUniqueName(that.channelModel.get("uniqueName")));
                }
            });
        },

        connectToChannel: function () {
            var that = this;

            this.createOrGetChannel()
                .then(function (channel) {
                    // if user is interpreter or customer and this is an internal company chat, make sure to invite all
                    // internal users
                    // var interpreterOrCustomer = $.common.isInterpreter() || $.common.isCustomer();
                    // var companyChannel = channel.attributes.type === $.chat.constants.type.COMPANY_INTERPRETER
                    //     || channel.attributes.type === $.chat.constants.type.COMPANY_REQUESTOR;

                    channel
                        .getMembers()
                        .then(function (members) {

                            // var identities = members.map(function (m) {
                            //     return m.identity;
                            // });

                            // if (interpreterOrCustomer && companyChannel) {
                            //     $.chat.mappingModel.internalUsersIdentities({
                            //         success: function (collection) {
                            // var invites = collection.models.filter(function (mapping) {
                            //     return identities.indexOf(mapping.get("identity")) === -1;
                            // });

                            // invites.forEach(function (mapping) {
                            //     channel
                            //         .invite(mapping.get("identity"))
                            //         .then(function () {
                            // send invitation
                            // })
                            // })
                            // }
                            // });
                            // }

                            var twilioIdentites = Array
                                .from(members)
                                .map(function (it) {
                                    return it.identity;
                                });

                            $.chat.mappingModel.updateMappings(twilioIdentites, {
                                success: function () {
                                    that.messages = new $.chat.channel.models.MessageCollectionModel([], {
                                        channel: channel,
                                        getLastConsumedMessageIndex: function () {
                                            return that.model.get("lastConsumedMessageIndex");
                                        }
                                    });

                                    if (that.showImmediately) {
                                        that.listenToOnce(that.messages, "fetched-previous", function () {
                                            _.defer(function () {
                                                that.show();
                                            });
                                        });
                                    }
                                    that.channel = channel;

                                    that.buildView();
                                    that.initListeners(channel);
                                    that.updateModel(channel);

                                    that.sendMessageView.twilioChatReady(channel);
                                }
                            });
                        })
                        .catch(function (error) {
                            console.log("could not get channel members. error: ", error);
                        });
                });
        },

        // need to remove the wrapping div to make the flex layout work
        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },

        buildView: function () {
            this.sendMessageView = new $.chat.channel.views.SendMessageView();
            this.conversationWrapperView = new $.chat.channel.views.ConversationWrapperView({
                collection: this.messages,
                parentSelector: this.parentSelector
            });
            this.listenTo(this.conversationWrapperView, "scrollToBottom", this.scrollToBottom);
            this.listenTo(this.conversationWrapperView, "handleInfiniteScroll", this.handleInfiniteScroll);
            this.listenTo(this.conversationWrapperView, "handleLastReadMessage", this.handleLastReadMessage);
            this.listenTo(this.conversationWrapperView, "handleScrollToBottomButton", this.handleScrollToBottomButton);
            this.listenTo(this.sendMessageView, "onNewNickname", this.newNickname);
            this.listenTo(this.sendMessageView, "onNewNicknameCanceled", this.newNicknameCanceled);
            this.listenTo(this.sendMessageView, "onNewChannelInstance", this.newChannelInstance);
            this.listenTo(this.sendMessageView, "messageSent", this.messageSent);
            this.usersTypingView = new $.chat.channel.views.UsersTypingView();

            this.conversation.show(this.conversationWrapperView);
            this.sendmessage.show(this.sendMessageView);
            this.userstyping.show(this.usersTypingView);
        },

        messageSent: function (params) {
            var that = this;
            this.messages.add(new Backbone.Model({
                type: "SENDING_MESSAGE",
                timestamp: params.timestamp,
                body: params.body,
                author: params.author
            }));
            _.defer(function () {
                that.scrollToShowSendindMessageView();
            });
        },

        newNickname: function (message) {
            this.sendMessageView.newNicknameApplied();
        },

        newNicknameCanceled: function () {
            var that = this;
            var toRemove = this.messages.models.filter(function (model) {
                return model.attributes.type === "SENDING_MESSAGE";
            });

            toRemove.forEach(function (model) {
                that.$el.find("#message-" + model.cid).remove();
            });
        },

        newChannelInstance: function (channel) {
            this.channel = channel;
            this.initListeners(channel);
        },

        scrollToIndex: function (index, offset, callback) {
            var el = this.$el.find(".chat-messages");
            var elAtIndex = el
                .find(".message-container")
                .toArray()
                .filter(function (element) {
                    return index === $(element).data("index");
                })[0];

            if (elAtIndex) {
                this.$el
                    .find(".chat-messages")
                    .animate({
                        scrollTop: elAtIndex.offsetTop - offset
                    }, 100, "swing", !callback ? function () {} : callback);
            }
        },

        scrollToBottom: function () {
            var that = this;

            if (this.model.get("upperIndex") === this.model.get("lastConsumedMessageIndex")) {
                this.$el
                    .find(".chat-messages")
                    .animate({
                        scrollTop: this.$el
                            .find(".chat-messages")
                            .get(0).scrollHeight
                    }, 1000);

            } else {
                this.model.set("lowerIndex", Number.MAX_SAFE_INTEGER);
                this.model.set("upperIndex", 0);
                this.messages.reset();
                this.fetchPreviousPage(this.channel.state.lastMessage.index + 1, function (indexes) {
                    that.model.set("lowerIndex", indexes.lowerIndex);
                    that.model.set("upperIndex", indexes.upperIndex);
                });
            }

            this.channel.setAllMessagesConsumed().then(function () {
                that.model.get("lastConsumedMessageIndex", that.messages.at(that.messages.length - 1).get("index"));
                that.trigger("unconsumedMessageCountUpdate", 0);
            });
        },

        handleInfiniteScroll: function (ev) {
            var SPINNER_HEIGHT = 71;
            var that = this;
            var conversationEl = $(ev.target);
            var scroll;

            if (conversationEl.scrollTop() === 0) {

                // got to get only the element id string so that we get the updated position after fetching previous
                // results
                var firstRenderedMsgId = this.$el
                    .find(".message-container")
                    .first()
                    .attr("id");

                this.fetchPreviousPage(this.model.get("lowerIndex"), function (indexes) {
                    var firstRenderedMsg = that.$el
                        .find(".chat-messages")
                        .find("#" + firstRenderedMsgId);
                    scroll = firstRenderedMsg.position().top - SPINNER_HEIGHT;
                    that.$el
                        .find(".chat-messages")
                        .scrollTop(scroll);
                    that.model.set("upperIndex", Math.max(that.model.get("upperIndex"), indexes.upperIndex));
                    that.model.set("lowerIndex", Math.min(that.model.get("lowerIndex"), indexes.lowerIndex));
                });

            } else if (((conversationEl.scrollTop() + conversationEl.get(0).offsetHeight) === conversationEl.get(0).scrollHeight)) {

                scroll = conversationEl.scrollTop() + SPINNER_HEIGHT;

                this.fetchNextPage(this.model.get("upperIndex") + 1, function (indexes) {
                    that.$el
                        .find(".chat-messages")
                        .scrollTop(scroll);
                    that.model.set("upperIndex", Math.max(that.model.get("upperIndex"), indexes.upperIndex));
                    that.model.set("lowerIndex", Math.min(that.model.get("lowerIndex"), indexes.lowerIndex));
                });

            }
        },

        lastIndexInViewPort: function () {
            var el = this.$el.find(".conversation-view");
            var height = el.innerHeight() + 51;
            var lastIndex = Math.max.apply(
                null,
                el
                .find(".message-container")
                .toArray()
                .filter(function (element) {
                    return $(element).position().top > 0 && ($(element).position().top + $(element).find(".message").height()) <= height;
                })
                .map(function (element) {
                    return $(element).data("index");
                })
            );
            return lastIndex;
        },

        isIndexInViewPort: function (index) {
            var isTypingViewHeight = 25;
            var height = this.$el
                .find(".conversation-view")
                .innerHeight();
            var el = this.$el.find(".chat-messages");
            var isIndexInViewPort = el
                .find("#msg-" + index)
                .toArray()
                .filter(function (element) {
                    return $(element).position().top > 0 && ($(element).position().top + $(element).find(".message").height() - isTypingViewHeight) < height;
                })
                .length > 0;
            return isIndexInViewPort;
        },

        handleLastReadMessage: function (ev) {
            var that = this;
            var index = this.lastIndexInViewPort(ev);

            var previousLastConsumedMessageIndex = this.channel.lastConsumedMessageIndex;
            if (index > this.model.get("lastConsumedMessageIndex")) {
                this.channel
                    .advanceLastConsumedMessageIndex(index)
                    .then(function (unread) {
                        that.model.set("lastConsumedMessageIndex", index);
                        that.trigger("unconsumedMessageCountUpdate", unread === null ? that.model.get("messageCount") : unread);
                    });
            }
        },

        handleScrollToBottomButton: function (ev) {
            if ((this.lastIndexInViewPort(ev) + 1) < this.model.get("messageCount")) {
                this.conversationWrapperView.showScrollToBottomButton();
            } else {
                this.conversationWrapperView.hideScrollToBottomButton();
            }
        },

        onRender: function () {
            this.removeWrappingDiv();
        },

        fetchPreviousPage: function (index, callback, extra) {
            if (index > 0) {
                this.messages.fetchPreviousPage(index, callback, extra);
            }
        },

        fetchNextPage: function (index, callback) {
            if (index < this.model.get("messageCount")) {
                this.messages.fetchNextPage(index, callback);
            }
        },

        advanceLastConsumedMessage: function () {
            var that = this;
            var lastIndex = this.lastIndexInViewPort();

            if (this.channel) {
                this.channel
                    .advanceLastConsumedMessageIndex(lastIndex ? Number(lastIndex) : 0)
                    .then(function (unread) {
                        that.model.set("lastConsumedMessageIndex", lastIndex);
                        that.trigger("unconsumedMessageCountUpdate", $.chat.helpers.sanitizeUnread(
                            that.model.get("messageCount"),
                            unread
                        ));
                    });
            }
        },

        show: function () {
            var that = this;
            this.visible = true;
            this.$el.show();

            if (this.channel) {
                this.channel
                    .getMessagesCount()
                    .then(function (count) {
                        that.model.set("messageCount", count);
                        that.scrollToUnread(function () {
                            that.advanceLastConsumedMessage();
                        });
                    });
            }
        },

        hide: function () {
            this.visible = false;
            this.$el.hide();
        }

    });

})(jQuery);
