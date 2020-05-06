(function ($) { //@ sourceURL=app/view/chat/chat.js

    $.chat = _.extend($.chat || {}, {
        views: {},
        models: {},
        helpers: {
            getClient: function () {},
            sanitizeUnread: function (count, unconsumed) {
                if (count === 1 && unconsumed === 1) {
                    return 0;
                } else {
                    return unconsumed;
                }
            }
        },
        constants: {
            type: {
                COMPANY_INTERPRETER: "COMPANY_INTERPRETER",
                COMPANY_REQUESTOR: "COMPANY_REQUESTOR"
            }
        },
        mappingModel: new $.core.TwilioIdentityMappingModel(),
        me: {}
    });

    $.chat.views.ChatHeaderView = $.app.ItemView.extend({
        template: "chat/chat-header-item",
        events: {
            "click .cmd-widget-open-chat": "openChat"
        },

        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },

        openChat: function () {
            this.trigger("openChat", this.model);
        },

        onRender: function () {
            this.formatElements();
        },

        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, {
                friendlyName: this.resolveFriendlyName(),
                icon: this.resolveIcon(),
                type: this.resolveTypeLabel()
            });
        },

        resolveIcon: function () {
            var isCompanyInterpreterChat = this.model.get("type") === $.chat.constants.type.COMPANY_INTERPRETER;
            var isCompanyRequestorChat = this.model.get("type") === $.chat.constants.type.COMPANY_REQUESTOR;

            if (($.common.isInterpreter() || $.common.isCustomer()) && (isCompanyInterpreterChat || isCompanyRequestorChat)) {
                return "icon-group";
            } else {
                return "icon-user";
            }
        },

        resolveTypeLabel: function () {
            if ($.common.isInterpreter() || $.common.isCustomer()) {
                return undefined;
            } else {
                return this.model.get("type") === $.chat.constants.type.COMPANY_INTERPRETER ? "INTERPRETER" : "REQUESTOR";
            }
        },

        resolveFriendlyName: function () {
            if (App.config.userData.uuid === this.model.get("sideAUuid")) { // check if current user is one of the sides of the conversation
                return this.model.get("labelB");
            } else if (App.config.userData.uuid === this.model.get("sideBUuid")) {
                return this.model.get("labelA");
            } else if (App.config.company.uuid === this.model.get("sideAUuid")) { // check if current user represents the company
                return this.model.get("labelB");
            } else if (App.config.company.uuid === this.model.get("sideBUuid")) {
                return this.model.get("labelA");
            }
        }
    });

    $.chat.views.ChatHeaderCollectionView = $.app.CollectionView.extend({
        itemView: $.chat.views.ChatHeaderView,
        template: "chat/chat-header-collection",
        initialize: function (params) {
            this.collection = params.collection;
        },
        buildItemView: function (item, ItemViewType, itemViewOptions) {
            var options = _.extend({
                model: item
            }, itemViewOptions);
            var view = new ItemViewType(options);
            this.listenTo(view, "openChat", function (chatHeaderModel) {
                this.trigger("openChat", chatHeaderModel);
            });
            return view;
        }
    });

    $.chat.views.ChatConversationViews = $.app.ItemView.extend({
        template: "chat/chat-conversations",

        initialize: function (params) {
            _.bindAll(this, "openConversation");
            this.collection = params.collection;
            this.model = new Backbone.Model({
                ui: {}
            });
        },

        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },

        onRender: function () {
            this.removeWrappingDiv();
            var that = this;
            var dropdownView = new $.common.DropdownAutocompleteView({
                el: this.$el.find(".contact-dropdown"),
                ui: {
                    placeholder: "Type, select a contact",
                    inputName: "contact",
                    popupHeader: "Interpreter",
                    labelField: "name",
                    edit: false
                },
                autocomplete: {
                    provider: function (request, response) {
                        var contactFilters = new $.filterbuilder
                            .init()
                            .add({
                                op: "eq",
                                field: "status.id",
                                data: App.dict.contactStatus.active.id
                            })
                            .add({
                                op: "bw",
                                field: "name",
                                data: request.term
                            })
                            .toString();

                        var requestorFilters = new $.filterbuilder
                            .init()
                            .add({
                                op: "eq",
                                field: "active",
                                data: true
                            })
                            .add({
                                op: "bw",
                                field: "name",
                                data: request.term
                            })
                            .toString();

                        $.when(
                            $.ajax({
                                url: App.config.context + '/api/contact',
                                dataType: 'json',
                                data: {
                                    filters: contactFilters,
                                    sidx: "name",
                                    sord: "asc"
                                }
                            }),
                            $.ajax({
                                url: App.config.context + '/api/requestor',
                                dataType: 'json',
                                data: {
                                    filters: requestorFilters,
                                    sidx: "name",
                                    sord: "asc"
                                }
                            })
                        ).done(function (contacts, requestors) {
                            response(
                                _.union(
                                    contacts[0].rows.map(function (item) {
                                        return {
                                            id: item.id,
                                            label: item.displayName + " (int)",
                                            value: item.uuid,
                                            type: "INTERPRETER"
                                        };
                                    }),
                                    requestors[0].rows.map(function (item) {
                                        return {
                                            id: item.id,
                                            label: item.displayName + " (req)",
                                            value: item.uuid,
                                            type: "REQUESTOR"
                                        };
                                    })
                                ).sort(function (a, b) {
                                    if (a.label < b.label) {
                                        return -1;
                                    }
                                    if (a.label > b.label) {
                                        return 1;
                                    }
                                    return 0;
                                })
                            );
                        });
                    }
                },
                create: {
                    disabled: true
                },
                dropdown: {
                    disabled: true
                }
            });
            this.listenTo(dropdownView, "change", this.openConversation);

            dropdownView.render();

            this.chatHeaderCollectionView = new $.chat.views.ChatHeaderCollectionView({
                el: this.$el.find(".chat-headers-container"),
                collection: this.collection
            });
            this.listenTo(this.chatHeaderCollectionView, "openChat", function (twilioChatChannelModel) {
                that.chatHeaderCollectionView.close();
                that.trigger("openChat", twilioChatChannelModel);
            });
            this.listenTo(this.chatHeaderCollectionView, "unreadCountUpdated", function (unread) {
                that.trigger("unreadCountUpdated", unread);
            });
        },

        openConversation: function (data) {
            this.trigger("chatParticipantSelected", data);
        }
    });

    $.chat.views.ChatChannelActions = $.app.ItemView.extend({
        template: "chat/chat-channel-actions",
        events: {
            "click .cmd-widget-back": "hideConversation",
            "click .cmd-widget-hide": "hideChatPanel"
        },

        hideConversation: function () {
            this.trigger("hideConversation");
        },

        hideChatPanel: function () {
            this.trigger("hideChatPanel");
        },

        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },

        onRender: function () {
            this.removeWrappingDiv();
        }
    });

    $.chat.views.ChatPanelConversationsActions = $.app.ItemView.extend({
        template: "chat/chat-panel-conversations-actions",
        events: {
            "click .cmd-widget-hide": "hideChatPanel"
        },

        hideChatPanel: function () {
            this.trigger("hideChatPanel");
        }
    });

    $.chat.views.ChatPanelView = $.app.LayoutView.extend({
        template: "chat/chat-panel",
        regions: {
            actions: ".chat-panel-actions",
            panel: ".chat-panel-content"
        },

        initialize: function () {
            _.bindAll(this, "openConversation", "closeConversation", "channelCreated", "unreadCountUpdated");
        },

        buildFilters: function () {
            // @formatter:off
            if ($.common.isInterpreter() || $.common.isCustomer()) {
                return new $.filterbuilder
                    .init()
                    .addGroup("OR")
                    .add({
                        field: "sideAUuid",
                        op: "eq",
                        data: App.config.userData.uuid
                    })
                    .add({
                        field: "sideBUuid",
                        op: "eq",
                        data: App.config.userData.uuid
                    })
                    .done()
                    .toString();
            } else if ($.common.isAdmin()) {
                return new $.filterbuilder
                    .init()
                    .addGroup("OR")
                    .add({
                        field: "sideAUuid",
                        op: "eq",
                        data: App.config.company.uuid
                    })
                    .add({
                        field: "sideBUuid",
                        op: "eq",
                        data: App.config.company.uuid
                    })
                    .done()
                    .toString();
            }
            // @formatter:on
        },

        getCompanyChatFromCollection: function (collection) {
            var userUuid = App.config.userData.uuid;
            var companyUuid = App.config.company.uuid;

            var companyChatModelArray = collection.models.filter(function (model) {
                var sideAUuid = model.get("sideAUuid");
                var sideBUuid = model.get("sideBUuid");

                return sideAUuid === userUuid && sideBUuid === companyUuid || sideAUuid === companyUuid && sideBUuid === userUuid;
            });

            return companyChatModelArray.length > 0 ? companyChatModelArray[0] : null;
        },

        updateUnreadCount: function () {
            var that = this;
            var totalUnread = 0;

            // probably an inefficient way to get unread messages count... but this is the only way found so far
            Promise
                .all(
                    this.collection.models.map(function (model) {
                        return $.chat.helpers.getClient()
                            .getChannelByUniqueName(model.get("uniqueName"))
                            .then(function (channel) {
                                return channel
                                    .getUnconsumedMessagesCount()
                                    .then(function (count) {
                                        model.set("unread", count);
                                        return count;
                                    });
                            });
                    })
                )
                .then(function (results) {
                    totalUnread = results.reduce(function (total, count) {
                        return total + count;
                    }, 0);
                    that.trigger("unreadCountUpdated", totalUnread);
                });
        },

        buildCompanyChat: function () {
            var that = this;

            this.$el.find(".chat-panel-wait-overlay").show();
            this.$el.find(".chat-panel-content").hide();
            new $.core.TwilioChatChannelModel().factory({
                data: {
                    interpreterUuid: $.common.isInterpreter() ? App.config.interpreter.uuid : undefined,
                    requestorUuid: $.common.isCustomer() ? App.config.userData.uuid : undefined,
                    companyUuid: App.config.company.uuid,
                    type: $.common.isInterpreter() ? $.chat.constants.type.COMPANY_INTERPRETER : $.chat.constants.type.COMPANY_REQUESTOR
                },
                success: function (channelModel) {
                    that.$el.find(".chat-panel-wait-overlay").hide();
                    that.$el.find(".chat-panel-content").show();
                    that.collection.add(channelModel);
                    // $.chat.helpers
                    //     .getClient()
                    //     .getChannelByUniqueName(channelModel.get("uniqueName"))
                    //     .then(function (channel) {
                    //         channel.advanceLastConsumedMessageIndex(0).then(function () {
                    // set all messages consumed so that twilio tracks unread count
                    // });
                    // });
                    that.openConversation(channelModel);
                }
            });
        },

        clientReady: function () {
            this.renderConversationsList();
        },

        // joinedChannel: function (channel) {
        //     channel.advanceLastConsumedMessageIndex(0)
        //         .then(function () {
        //             // set all messages consumed so that twilio tracks unread count
        //         });
        //     if (this.conversationsView) {
        //         var model = new $.core.TwilioChatChannelModel({
        //             uniqueName: channel.uniqueName
        //         });
        //         model.fetchByUniqueName(channel.uniqueName);
        //         this.conversationsView.chatHeaderCollectionView.collection.add(model);
        //     }
        // },

        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },

        chatParticipantSelected: function (data) {
            var that = this;
            new $.core.TwilioChatChannelModel().factory({
                data: {
                    interpreterUuid: data.type === "INTERPRETER" ? data.value : undefined,
                    requestorUuid: data.type === "REQUESTOR" ? data.value : undefined,
                    companyUuid: App.config.company.uuid,
                    type: data.type === "INTERPRETER" ? $.chat.constants.type.COMPANY_INTERPRETER : $.chat.constants.type.COMPANY_REQUESTOR
                },
                success: function (channelModel) {
                    that.openConversation(channelModel, true);
                }
            });
        },

        openConversation: function (channelModel, showImmediately) {
            this.actions.reset();

            this.channelMainView = new $.chat.channel.views.ChannelMainView({
                chatClient: $.chat.helpers.getClient(),
                showImmediately: showImmediately,
                channel: channelModel,
                parentSelector: '#global-chat-container'
            });

            var chatChannelActions = new $.chat.views.ChatChannelActions();

            this.actions.show(chatChannelActions);
            this.panel.show(this.channelMainView);

            this.channelMainView.show();

            this.listenTo(this.channelMainView, "channelCreated", this.channelCreated);
            this.listenTo(this.channelMainView, "unconsumedMessageCountUpdate", this.updateUnreadCount);
            this.listenTo(chatChannelActions, "hideConversation", this.closeConversation);
            this.listenTo(chatChannelActions, "hideChatPanel", this.hide);
        },

        closeConversation: function () {
            this.renderConversationsList();
        },

        channelCreated: function (channel) {
            var sideAUuid = channel.attributes.sideAUuid;
            var sideBUuid = channel.attributes.sideBUuid;
            var invitationUuid = sideAUuid === App.config.company.uuid ? sideBUuid : sideAUuid;

            channel
                .invite(invitationUuid)
                .then(function () {
                    console.log("Invitation sent to " + invitationUuid);
                });

        },

        renderConversationsList: function () {
            var that = this;
            this.collection = new $.core.TwilioChatChannelCollection();
            this.collection.queryParams.filters = this.buildFilters();
            this.collection.queryParams.sidx = "lastMessage";
            this.collection.queryParams.sord = "desc";
            this.collection.queryParams.rows = 20;
            this.collection.fetch({
                success: function (collection) {
                    if ($.common.isInterpreter() || $.common.isCustomer()) {
                        var companyChatModel = that.getCompanyChatFromCollection(collection);

                        // Make sure to always show company chat
                        if (!companyChatModel) {
                            that.buildCompanyChat();
                        } else {
                            that.openConversation(companyChatModel, false);
                        }
                    }

                    // join chat channels for new users
                    collection.models.forEach(function (model) {
                        $.chat.helpers.getClient()
                            .getChannelByUniqueName(model.get("uniqueName"))
                            .then(function (channel) {

                                channel
                                    .getMemberByIdentity(App.config.userData.uuid)
                                    .then(function () {
                                        that.updateUnreadCount();
                                    })
                                    .catch(function () {
                                        channel
                                            .join()
                                            .then(function () {
                                                channel
                                                    .setAllMessagesConsumed()
                                                    .then(function () {
                                                        that.updateUnreadCount();
                                                    })
                                                    .catch(function () {
                                                        console.log('error enabling unread count');
                                                    });
                                            })
                                            .catch(function (error) {
                                                console.log('error joining chat');
                                            });
                                    });
                            });
                    });
                }
            });

            this.actionsView = new $.chat.views.ChatPanelConversationsActions();
            this.listenTo(this.actionsView, "hideChatPanel", this.hide);

            this.conversationsView = new $.chat.views.ChatConversationViews({
                collection: this.collection
            });
            this.listenTo(this.conversationsView, "chatParticipantSelected", this.chatParticipantSelected);
            this.listenTo(this.conversationsView, "openChat", function (channelModel) {
                that.openConversation(channelModel, true);
            });
            this.listenTo(this.conversationsView, "unreadCountUpdated", this.unreadCountUpdated);

            this.actions.show(this.actionsView);
            this.panel.show(this.conversationsView);
        },

        onRender: function () {
            this.removeWrappingDiv();
        },

        hide: function () {
            this.$el.css("transform", "translateX(355px)");

            if (this.channelMainView) {
                this.channelMainView.hide();
            }
        },

        unreadCountUpdated: function (unread) {
            this.trigger("unreadCountUpdated", unread);
        },

        messageAdded: function (message) {
            this.updateUnreadCount();
        }
    });

    $.chat.views.FabButtonView = $.app.ItemView.extend({
        template: "chat/fab",
        events: {
            "click .cmd-widget-toggle-chat-panel": "toggleChatPanel"
        },

        initialize: function () {
            this.model = new Backbone.Model({
                unread: 0
            });
        },

        toggleChatPanel: function () {
            this.trigger("toggleChatPanel", true);
        },

        unread: function (value) {
            this.model.set("unread", value);
            this.render();

            if (value) {
                this.$el.find(".btn-chat-fab").addClass("new-message");
            } else {
                this.$el.find(".btn-chat-fab").removeClass("new-message");
            }
        }
    });

    $.chat.views.MainView = $.app.LayoutView.extend({
        template: "chat/main",
        regions: {
            fab: "#fab-container",
            panel: "#chat-panel"
        },

        renewChatToken: function () {
            new $.core.TwilioTokensModel().getChatToken({
                data: {
                    identity: App.config.userData.uuid
                },
                success: function (model) {
                    $.chat.helpers
                        .getClient()
                        .updateToken(model.get("jwt"))
                        .then(function () {
                            console.log("Chat token renewed");
                        })
                        .catch(function (reason) {
                            console.log("Failed to renew token. Reason: ", reason);
                        });
                }
            });
        },

        initialize: function () {
            var that = this;

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

                                    that.chatClient = client;

                                    that.fabView = new $.chat.views.FabButtonView();
                                    that.chatPanelView = new $.chat.views.ChatPanelView();
                                    that.render();

                                    that.listenTo(that.fabView, "toggleChatPanel", function (visible) {
                                        that.chatPanelView.$el.css("transform", "translateX(0)");

                                        if (that.chatPanelView.channelMainView) {
                                            that.chatPanelView.channelMainView.show(true);
                                        }
                                    });
                                    that.listenTo(that.chatPanelView, "unreadCountUpdated", function (unread) {
                                        that.fabView.unread(unread);
                                    });

                                    // client.on("channelInvited", function (channel) {
                                    // console.log("channelInvited");
                                    // immediately joining direct chats
                                    // channel.join().then(function () {
                                    //     that.chatPanelView.joinedChannel(channel);
                                    // })
                                    // });

                                    client.on("messageAdded", function (message) {
                                        that.chatPanelView.messageAdded(message);
                                    });

                                    client.on("tokenAboutToExpire", that.renewChatToken);
                                    client.on("tokenExpired", that.renewChatToken);

                                    that.chatPanelView.clientReady();
                                })
                                .catch(function (error) {
                                    console.log('Could not create twilio client. Is the service working ok?', error);
                                });
                        }
                    });
                }
            });
        },

        onRender: function () {
            if (this.fabView) {
                this.fab.show(this.fabView);
            }
            if (this.chatPanelView) {
                this.panel.show(this.chatPanelView);
            }
        }
    });

    $.chat.views.bootstrap = function (options) {

        var mainView = new $.chat.views.MainView({
            el: "#global-chat-container"
        });
        mainView.render();

    };

})(jQuery);
