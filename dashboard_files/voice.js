(function ($) { //# sourceURL=app/view/voice/voice.js

    "use strict";

    var TWILIO_TASK_TIMEOUT = parseInt(App.config.twilio.tasktimeout, 10) * 1000;

    $.voice = {};
    $.voice.frame = {};
    $.voice.views = {};
    $.voice.models = {};
    $.voice.utils = {};

    $.voice.utils.sanitizeTwilioClientName = function (username) {
        return username.replace(/[^a-zA-Z\\d]/g, "_");
    };

    $.voice.views.MainView = $.app.LayoutView.extend({
        template: "voice/main",
        regions: {
            call: "#voice-container",
            chat: "#chat-container"
        },

        initialize: function (options) {
            _.bindAll(this, "toggleChat");

            this.model = options.model;
            this.identity = options.identity;
            this.token = options.token;
            this.wsToken = options.wsToken;
            this.company = options.company;
            this.companyConfig = options.companyConfig;
            this.envContext = options.envContext;
            this.connection = options.connection;
            this.Attributes = options.Attributes;
            this.mode = options.mode || "INTERPRETER";
            this.lang = options.lang;
        },

        onRender: function () {
            this.removeWrappingDiv();

            $(".vri-overlay").html(this.el);
            $(".vri-overlay").fadeIn();
            $("body").css("overflow", "hidden");

            var that = this;
            var ViewClass = this.mode === "INTERPRETER" ? $.voice.views.CallView : $.voice.views.CustomerCallView;
            that.callView = new ViewClass({
                model: this.model,
                identity: this.identity,
                token: this.token,
                wsToken: this.wsToken,
                company: this.company,
                // companyConfig: this.companyConfig,
                companyConfig: this.company.config,
                envContext: this.envContext,
                connection: this.connection,
                Attributes: this.Attributes,
                lang: this.lang
            });
            this.listenTo(that.callView, "callClose", this.close);
            this.listenTo(that.callView, "toggleChat", this.toggleChat);

            this.chatView = new $.chat.channel.views.ChannelMainView({
                channel: new $.core.TwilioChatChannelModel({
                    uniqueName: that.model.get("jobUuid") || that.model.get("job").uuid,
                    friendlyName: "Job #" + (that.model.get("jobId") || that.model.get("job").id)
                }),
                startVisible: false,
                parentSelector: '.voice-call-container',
                create: true
            });
            this.chat.show(that.chatView);
            this.listenTo(that.chatView, "unconsumedMessageCountUpdate", function (count) {
                that.callView.updateUnconsumedMessages(count);
            });

            this.call.show(that.callView);
        },

        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },

        close: function () {
            $(".vri-overlay").fadeOut(400, function () {
                $(".vri-overlay").empty();
            });
            $("body").css("overflow", "auto");
        },

        toggleChat: function () {
            this.chatVisible = !this.chatVisible;

            if (this.chatVisible) {
                this.chatView.show();
                this.$el.find("#chat-container").show();
            } else {
                this.chatView.hide();
                this.$el.find("#chat-container").hide();
            }
        }
    });

    $.voice.views.CallView = $.app.ItemView.extend({
        template: "voice/call",
        events: {
            "click .hang": "hang",
            "click .toggleMute": "toggleMute",
            "click .toggleChat": "toggleChat"
        },

        initialize: function (options) {
            console.log("CallView init", this);
            var that = this;
            this.wsToken = options.wsToken;
            this.company = options.company;
            this.lang = options.lang;
            this.model = options.model;
            this.workerClient = options.workerClient;
            this.reservation = options.reservation;
            this.connection = options.connection;

            // TODO: Maybe better to create WorkerCallView
            if (this.workerClient) {
                this.workerClient.on("reservation.completed", function (reservation) {
                    that.hang();
                });
            }

            // this event handler works for scheduled calls
            if (this.connection) {
                this.connection.disconnect(function () {
                    that.model.disconnect();
                    that.closeView();
                });
            }
        },

        hang: function () {
            this.model.disconnect();

            // call disconnect only if connection set
            if (this.connection) {
                this.connection.disconnect();
            }

            this.closeView();

            if (this.taskTimeout) {
                clearTimeout(this.taskTimeout);
            }
        },

        closeView: function () {
            this.trigger("callClose");
            this.close();
        },

        onRender: function () {
            var that = this;
            var time = new Date().getTime();

            if (!this.callTimer) {
                this.callTimer = setInterval(function () {
                    var elapsed = (new Date().getTime() - time) / 1000;

                    that.elapsedTime = moment()
                        .startOf('day')
                        .seconds(elapsed)
                        .format(elapsed >= 3600 ? 'H:mm:ss' : 'mm:ss');

                    that.$el.find(".timer").html(that.elapsedTime);
                }, 1000);
            }
            this.removeWrappingDiv();
        },

        toggleMute: function (ev) {
            var connection = Twilio.Device.activeConnection();
            if (connection) {
                connection.mute(!connection.isMuted());

                this.$el
                    .find(".toggleMute i")
                    .addClass(connection.isMuted() ? "icon-microphone-off" : "icon-microphone")
                    .removeClass(connection.isMuted() ? "icon-microphone" : "icon-microphone-off");
            }
        },

        serializeData: function () {

            return _.extend({
                obj: this.model ? this.model.toJSON() : null
            }, {
                company: this.company,
                envContext: $.voice.utils.envContext
            });
        },

        onClose: function () {
            if (this.callTimer) {
                clearInterval(this.callTimer);
            }
        },

        removeWrappingDiv: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },

        toggleChat: function () {
            this.trigger("toggleChat");
        },

        updateUnconsumedMessages: function (count) {
            this.unconsumedMessageCount = count;

            if (count) {
                this.$el.find('.unread-count').show();
                this.$el.find('.unread-count').html(count);
            } else {
                this.$el.find('.unread-count').hide();
            }
        }

    });

    $.voice.views.CustomerCallView = $.voice.views.CallView.extend({
        initialize: function (options) {
            console.log("CustomerCallView", this);
            console.log("CustomerCallView options", options);

            $.voice.views.CallView.prototype.initialize(options);
            _.bindAll(this, "checkCallRequestAccepted", "closeView", "handleTaskFetchResponse");

            this.model = options.model;
            this.wsToken = options.wsToken;

            this.requestResource();
        },

        handleTaskFetchResponse: function (error, task) {
            console.log("Enter handleTaskFetchResponse", task);

            if (error) {
                console.log("error retrieving task: ", error);
                return;
            }

            var that = this;
            var callAnswered = task.assignmentStatus === "assigned" || task.assignmentStatus === "completed" || task.assignmentStatus === "wrapping";

            if (!callAnswered) {
                var message = "Timeout waiting for resource.";
                var retryCancelView = new $.voice.views.RetryCancelView({
                    model: new Backbone.Model({
                        message: message
                    })
                });
                retryCancelView.render();
                this.hang();
                /*this.listenTo(retryCancelView, "onRetryClicked", function () {
                    new $.voice.views.CustomerCallView({
                        company: that.company,
                        model: that.model,
                        wsToken: that.wsToken,
                        lang: that.lang
                    }).render();
                });*/
            }
        },

        checkCallRequestAccepted: function () {
            console.log("Enter checkCallRequestAccepted", this);
            var that = this;
            this.model.fetch({
                success: function (m) {
                    var taskSid = m.get("taskSid");
                    var workspace = new Twilio.TaskRouter.Workspace(that.wsToken);
                    workspace.tasks.fetch(taskSid, that.handleTaskFetchResponse);
                }
            });
        },

        buildOverflowPartners: function () {
            var partnerCSV = this.company.config.overflowPartners;
            console.log("partnerCSV:", partnerCSV);
            return partnerCSV ? partnerCSV.split(',') : [];
        },

        /*
         * Here be the hidden place where we pass Twilio Task parameters and request a call.
         */
        requestResource: function () {
            console.log("Enter requestResource", this);
            var that = this;
            var callback = function () {

                that.connection = Twilio.Device.connect({
                    Attributes: JSON.stringify({
                        session: that.model.getSessionIdentifier(),
                        language: that.lang + "_voice",
                        company: that.company.uuid,
                        partners: that.buildOverflowPartners(),
                        onDemand: true,
                        displayName: that.model.get('displayName'),
                        job: that.model.get("job").uuid,
                        env: App.env
                    })
                });

                that.taskTimeout = setTimeout(that.checkCallRequestAccepted, TWILIO_TASK_TIMEOUT);
                that.connection.disconnect(that.closeView);
            };

            // initialize twilio voice
            $.voice.frame.bootstrap({
                envContext: App.config.envContext
            });
            $.voice.frame.init({
                callback: callback
            });

        }
    });

    $.voice.views.IncomingCallView = $.app.ItemView.extend({
        template: "voice/receive-call",
        events: {
            "click .answer": "answer",
            "click .hang": "hang"
        },

        initialize: function (options) {
            console.log("IncomingCallView", this);
            var that = this;
            this.reservation = options.reservation;
            this.workerClient = options.workerClient;
            this.connection = options.connection;

            this.workerClient.on("reservation.accepted", function (reservation) {
                that.$el.modal("hide");
            });

            this.workerClient.on("reservation.canceled", function (reservation) {
                that.hang();
            });

            this.workerClient.on("reservation.rescinded", function (reservation) {
                that.hang();
            });

            // TODO: this could be probably acquired without an extra request
            this.workerClient.fetchReservations(function (error, reservations) {
                var pendingReservations = reservations.data.filter(function (reservation) {
                    return reservation.reservationStatus === "pending";
                });

                if (pendingReservations.length === 1) {
                    that.reservation = pendingReservations[0];
                    var displayName = that.reservation.task.attributes.displayName;
                    that.$el.find(".caller-name").html(displayName);
                }

            });

            this.$el.on("hide", function () {
                that.$el.off("hide");
            });
        },

        onRender: function () {
            this.$el.modal({
                backdrop: 'static'
            });
        },

        answer: function () {
            console.log("answer", this);
            var that = this;
            this.connection.accept();
            that.$el.modal("hide");

            this.callView = new $.voice.views.MainView({
                reservation: that.reservation,
                workerClient: that.workerClient,
                connection: that.connection,
                wsToken: that.wsToken,
                company: App.config.company,
                model: new $.core.IvrCallSessionModel({
                    job: {
                        id: that.reservation.task.attributes.jobId,
                        uuid: that.reservation.task.attributes.job
                    },
                    session: that.reservation.task.attributes.session
                }, {
                    companyUuid: App.config.company.uuid
                }),
                mode: "INTERPRETER"
            }).render();
        },

        hang: function () {
            console.log("pending", this);
            if (this.reservation.reservationStatus === "pending") {
                this.reservation.reject();
            }

            this.connection.ignore();
            this.$el.modal("hide");

            if (this.callView) {
                this.callView.close();
            }
        }
    });

    $.voice.views.VoiceRequestView = $.app.ItemView.extend({
        template: "voice/call-request",

        events: {
            "click .call-request": "call",
            "click .cancel": "cancel"
        },

        modelEvents: {
            "error": "popupError",
            "invalid": "popupInvalid"
        },

        initialize: function (options) {
            console.log("VoiceRequestView.init", this);
            _.extend(this, $.app.mixins.subviewContainerMixin);

            this.wsToken = options.wsToken;
            this.company = options.company;

            this.views = {
                language: {
                    selector: ".language-container",
                    view: new $.common.widget.customer.LanguageView({
                        model: this.model
                    })
                },
                customer: {
                    selector: ".customer-container",
                    view: new $.common.widget.customer.CustomerView({
                        model: this.model
                    })
                },
                client: {
                    selector: ".client-container",
                    view: new $.common.widget.customer.ClientView({
                        model: this.model
                    })
                },
                location: {
                    selector: ".location-container",
                    view: new $.common.widget.customer.LocationView({
                        model: this.model
                    })
                }
            };
        },

        onRender: function () {
            this.$el.modal({
                backdrop: 'static'
            });
            this.renderSubviews();
        },

        call: function () {
            console.log("Enter call", this);

            // validate model
            if (this.model.isValid()) {

                var that = this;

                var languageCode = this.model.get("language") ? this.model.get("language").iso639_3Tag : null;
                var customer = this.model.get("customer") ? this.model.get("customer").uuid : null;
                var client = this.model.get("client") ? this.model.get("client").uuid : null;
                var location = this.model.get("location") ? this.model.get("location").uuid : null;

                this.model = new $.core.IvrCallSessionModel({
                    company: this.options.company.uuid,
                    customer: customer,
                    language: languageCode,
                    client: client,
                    location: location,
                    displayName: customer ? this.model.get("customer").displayName : "Unknown caller"
                }, {
                    companyUuid: this.model.get("company").uuid
                });

                this.model.save(null, {
                    success: function (model) {
                        var callView = new $.voice.views.MainView({
                            wsToken: that.wsToken,
                            company: that.company,
                            lang: languageCode,
                            model: model,
                            mode: "CUSTOMER"
                        });
                        that.listenTo(callView, "callClose", function () {
                            that.trigger("callClosed");
                        });
                        callView.render();
                    },
                    error: popupHandleError
                });
                this.closeView();
            }
        },

        cancel: function () {
            this.closeView();
        },

        closeView: function () {
            this.$el.modal("hide");
        }

    });

    $.voice.views.RetryCancelView = $.app.ItemView.extend({

        template: "video/retrycancel",

        events: {
            "click .cmd-widget-retry": "retry",
            "click .cmd-widget-cancel": "cancel"
        },

        initialize: function (options) {
            this.conferenceView = options.conferenceView;
        },

        onRender: function () {
            var $modalEl = $("#modalContainer");
            $modalEl.html(this.el);
            $modalEl.modal({
                backdrop: 'static'
            });
        },

        retry: function (evt) {
            var $modalEl = $("#modalContainer");
            $modalEl.modal('hide');
            this.trigger("onRetryClicked");
        },

        cancel: function (evt) {
            var $modalEl = $("#modalContainer");
            $modalEl.modal('hide');
            this.trigger("onCancelClicked");
        }

    });

    $.voice.frame.bootstrap = function (options) {

        $.voice.utils.envContext = options.envContext;

        $.voice.frame.init = function (opts) {
            this.initTwilio(opts);
        };

        $.voice.frame.initTwilio = function (opts) {
            _.extend(this, $.app.mixins.subviewContainerMixin);

            new $.core.TwilioTokensModel().getVoiceToken({
                success: function (model) {
                    console.log("voice.TwilioTokensModel", this);
                    // call setup
                    Twilio.Device.setup(model.get("jwt"), {
                        debug: true,
                        closeProtection: true
                    });

                    // check status for scenarios where setup was called previously
                    // and callback function was passed, so invoke the callback
                    // immediately as ready won't be called again.
                    if (Twilio.Device.status() == "ready" && opts.callback) {
                        opts.callback.call(opts.context);

                        // clear the callback to avoid it being called if the connection resets
                        // e.g. if the computer is put to sleep and wakes up the callback would be
                        // called again.
                        opts.callback = null;
                    }

                    Twilio.Device.ready(function (device) {
                        console.log("Twilio.Device Ready!");
                        if (opts.callback) {
                            // invoke the
                            opts.callback.call(opts.context);

                            // TODO: could support reconnect here if / when internet disconnected
                            // TODO: but need to determine how to support connection to same on demand
                            // TODO: session
                            // clear the callback to avoid it being called if the connection resets
                            // e.g. if the computer is put to sleep and wakes up the callback would be
                            // called again.
                            opts.callback = null;
                        }
                    });
                    Twilio.Device.error(function (error) {
                        console.log("Twilio.Device Error: " + error.message);
                    });
                    Twilio.Device.offline(function () {
                        console.log("Twilio offline");
                    });
                }
            });
        };

    };

})(jQuery);
