/*
 * Copyright (C) 2012 Interpreter Intelligence <support@interpreterintelligence.com>
 *
 * <copyright notice>
 */

var globalRoom;
var stats = {};

/* function getTrackStats(trackSid, type) {
    return new Promise(function (resolve, reject) {
        globalRoom
            .getStats()
            .then(function (statistics) {
                if (statistics.length > 0) {
                    if (type === "video") {
                        var videoStats = statistics[0]
                            .remoteVideoTrackStats
                            .filter(function (rvts) {
                                return rvts.trackSid === trackSid;
                            });
                        resolve(videoStats);
                    } else {
                        var audioStats = statistics[0]
                            .remoteAudioTrackStats[0]
                            .filter(function (rvts) {
                                return rvts.trackSid === trackSid;
                            });
                        resolve(audioStats);
                    }
                } else {
                    reject(null);
                }
            });
    });
}; */

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

(function ($) { //@ sourceURL=app/view/vri.js
    /* enable strict mode */
    "use strict";

    // namespace for booking video views
    if (!$.vri) $.vri = {};
    $.vri.pilot = {};
    $.vri.pilot.frame = {};

    var videoPrefs = {
        facingMode: "user",
        width: {
            ideal: 1280,
            max: 1280
        },
        height: {
            ideal: 720,
            max: 720
        },
        frameRate: {
            ideal: 24,
            max: 30
        }
    };

    // views (local) ////////////////////////////////////////////////////////

    // TODO: test constraints are supported
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters
    var qvgaConstraints = {
        video: {
            width: {
                exact: 320
            },
            height: {
                exact: 240
            }
        }
    };

    var vgaConstraints = {
        video: {
            width: {
                exact: 640
            },
            height: {
                exact: 480
            }
        }
    };

    var hdConstraints = {
        video: {
            width: {
                exact: 1280
            },
            height: {
                exact: 720
            }
        }
    };

    var fullHdConstraints = {
        video: {
            width: {
                exact: 1920
            },
            height: {
                exact: 1080
            }
        }
    };

    var supportedConstraints = {
        message: "WebRTC - mediaDevices.getSupportedConstraints() Not Supported."
    };
    if (navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints) {
        supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    }

    $.vri.ParticipantView = $.app.ItemView.extend({

        template: 'video/twilio/participant',

        events: {
            "click .container-video": "switchToMainView"
        },

        initialize: function (options) {
            _.bindAll(this, "trackAdded", "trackRemoved");

            this.isFirstRender = true;
        },

        onRender: function () {
            var that = this;
            var participant = this.model.get("participant");
            var container = this.$('.video-holder');

            this.controlsView = new $.vri.ParticipantControlsView({
                el: this.$el.find('.participant-controls')[0],
                model: new Backbone.Model({
                    participant: participant
                })
            });
            this.controlsView.render();

            participant.tracks.forEach(function (track) {
                that.trackAdded(container, track);
            });

            if (this.isFirstRender) {
                participant.on('trackSubscribed', function (track) {
                    that.trackAdded(container, track);
                });
            }
            this.isFirstRender = false;
        },

        trackAdded: function (container, track) {
            if (track.kind === "video") {
                // LOG("Dimensions [" + role + "] [" + track.dimensions.width + "x" + track.dimensions.height + "]");
                var trackWide = track.dimensions.width > track.dimensions.height;
                var localWide = window.innerWidth > window.innerHeight;

                if (trackWide && localWide || (!trackWide && !localWide)) {
                    container.find("video").addClass("cover");
                }

                if (trackWide) {
                    this.$el.find(".container-video").addClass("horizontal");
                } else {
                    this.$el.find(".container-video").addClass("vertical");
                }
            }
            // LOG("INFO: Adding track [" + track.kind + "]. Role [" + participant.role + "]. Participant [" + participant.identity + " / " + participant.sid + "]");
            //container.append(track.attach());

            var participant = this.model.get("participant");

            if (participant && participant.tracks) {
                participant
                    .tracks
                    .forEach(function (t) {
                        if (t.kind === track.kind) {
                            t.detach();
                        }
                    });
            }

            track.attach(container.find(track.kind)[0]);
        },

        trackRemoved: function (track) {

            if (!this.model) {
                // track removed event fired as well as participant disconnected
                return;
            }
            var participant = this.model.get("participant");
            var role = this.model.get("role");

            // LOG("INFO: Removing track [" + track.kind + "]. Role [" + participant.role + "]. Participant [" + participant.identity + " / " + participant.sid + "]");
            //debugger;
            var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

            if (isSafari) {
                track._attachments.forEach(function (element) {
                    element.remove();
                });
            } else {
                if (track.kind === "video" && track.detach) {
                    var container = this.$('.video-holder');
                    track.detach(container.find(track.kind)[0]);
                }
            }

            // remove event
            //participant.off('trackRemoved');
            // TODO: don't stop as track may be attached to more elements.
            // TODO: how to determine if still attached so stop can be called?
            // TODO: stop() is only available on LocalTrack
            //track.stop();
        },

        onBeforeClose: function () {
            var participant = this.model.get("participant");
            participant.removeListener("trackSubscribed", this.trackAdded);
            participant.removeListener("trackUnsubscribed", this.trackRemoved);
            this.disconnect();
        },

        disconnect: function () {
            var participant = this.model.get("participant");
            participant.tracks.forEach(this.trackRemoved, this);
        },

        switchToMainView: function () {
            if (this.$el.parents('.main-video').length === 0) {
                var miniatureContainer = this.$el.find(".container-video")[0];
                this.trigger('onSwitchToMainView', {
                    container: miniatureContainer,
                    participant: this.model.get('participant')
                });
            }
        },

        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, {
                wide: this.model.get('wide')
            });

        }

    });

    $.vri.PhoneConferenceView = $.app.ItemView.extend({

        template: 'video/conference',

        initialize: function (options) {

            this.connection = options.connection;
            this.company = options.company;
            this.companyConfig = options.companyConfig;
        },

        events: {
            "click .cmd-widget-close": "disconnect",
            "click .cmd-widget-disconnect": "disconnect"
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, {
                company: this.company,
                envContext: this.options.envContext
            });

        },

        onRender: function () {

            $(".vri-overlay").append(this.el);
            $(".vri-overlay").fadeIn();
            $("body").css("overflow", "hidden");

        },

        disconnect: function (evt) {

            this.connection.disconnect();
            this.close();

            $(".vri-overlay").fadeOut();
            $("body").css("overflow", "auto");

        }
    });

    // TODO: http://luxiyalu.com/scrolling-on-overlay/
    $.vri.ConferenceView = $.app.LayoutView.extend({

        template: 'video/conference',

        regions: {
            video: ".video-container",
            chat: ".chat-container"
        },

        initialize: function (options) {
            console.log("ConfView init opts:", options);
            console.log("ConfView init model:", this.model);

            _.bindAll(this, "connectSuccess", "connectFailure", "updateInfoView");

            this.routingAttributes = options.routingAttributes;
            this.reservation = options.reservation;
            this.sessionUuid = options.sessionUuid;
            this.token = options.token; // Here be the damn VriToken
            this.wsToken = options.wsToken;
            this.identity = options.identity;
            this.company = options.company;
            this.companyConfig = options.companyConfig;
            this.worker = options.worker;
            this.chatToken = options.chatToken;
            this.paused = false;
            this.muted = false;
            this.viewsMap = {};
            this.tim = options.tim;
        },

        events: {
            "click .cmd-widget-close": "disconnect",
            "click .cmd-widget-disconnect": "disconnect",
            "click .cmd-widget-share": "share",
            "click .cmd-widget-retry": "retry",
            "click .cmd-widget-real-time-info": "toggleRealTimeInfo"
        },

        serializeData: function () {

            return _.extend({
                obj: this.model.toJSON()
            }, {
                company: this.company,
                envContext: this.options.envContext
            });

        },

        inputDeviceChanged: function (model) {
            var that = this;

            if (model.get('kind') === 'audioinput') {

                Twilio.Video
                    .createLocalAudioTrack({
                        deviceId: model.get('deviceId')
                    })
                    .then(function (localAudioTrack) {
                        that.room.localParticipant.audioTracks.forEach(function (track) {
                            track.detach();
                            track.stop();
                            that.room.localParticipant.unpublishTrack(track);
                        });

                        that.room.localParticipant.publishTrack(localAudioTrack);
                    });

            } else if (model.get('kind') === 'videoinput') {

                Twilio.Video
                    .createLocalVideoTrack({
                        deviceId: model.get('deviceId')
                    })
                    .then(function (localVideoTrack) {
                        var lp = that.room.localParticipant;

                        lp.videoTracks.forEach(function (track) {
                            lp.unpublishTrack(track);
                            track.stop();
                            track.detach();
                        });
                        lp.publishTrack(localVideoTrack);

                        that.viewsMap[lp.sid] = new $.vri.ParticipantView({
                            // el: that.mainViewParticipant === lp ? ".main-video div" : ".miniatures div",
                            el: that.mainViewParticipant === lp ? ".main-video div" : that.viewsMap[lp.sid].$el,
                            model: new Backbone.Model({
                                identity: lp.identity,
                                tracks: lp.tracks,
                                participant: lp
                            })
                        });
                        that.viewsMap[lp.sid].render();
                    });
            }
        },

        onRender: function () {
            // remove wrapping div
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);

            $(".vri-overlay").append(this.el);
            $(".vri-overlay").fadeIn();
            $("body").css("overflow", "hidden");

            if (navigator.mediaDevices) {
                this.connect();
            } else {
                // IE falls into this condition
                this.$el.find('.no-media-support').show();
            }
        },

        updateInfoView: function () {
            if (this.infoView) {
                // FIXME: make sure we have a start date for now
                var actualStart = new Date();
                if (this.model.get("job")) {
                    actualStart = this.model.get("job").actualStartDate;
                }

                this.infoView.updateInfoView({
                    participants: this.room.participants,
                    actualStartDate: actualStart //this.model.get("job").actualStartDate
                });
            }
        },

        onClose: function () {
            console.log("Conf onClose");
            if (this.infoView) {
                this.infoView.close();
            }
            this.trigger("conferenceClose");
        },

        askForRate: function () {
            var rateView = new $.vri.RateView({
                model: this.model,
                conferenceView: this
            });
            rateView.render();
        },

        disconnect: function (evt) {
            var url = this.getVriBaseUrl();
            window.history.pushState(url, "", url);
            console.log("ConfView. disconnect url:", url);

            var that = this;

            if (this.room) {

                // remove local participant
                this.participantDisconnected(this.room.localParticipant);

                // remove all remote participants
                this.room.participants.forEach(function (participant) {
                    that.participantDisconnected(participant);
                    that.numParticipants--;
                    if (that.numParticipants === 0) {
                        // TODO: handle this as event
                        // call last participant method
                        that.lastDeparture();
                    }
                });

                this.room.localParticipant.tracks.forEach(function (track) {
                    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

                    if (isSafari) {
                        track._attachments.forEach(function (element) {
                            element.remove();
                        });
                    } else {
                        track.detach();
                    }
                    track.stop();
                });

                this.room.disconnect();
            }

            if (this.sessionStarted) {
                console.log("ConfView Close Video");
                this.model.close();
            }

            console.log("ConfView Disconnect VideoSession");
            this.model.disconnect();

            $(".vri-overlay").fadeOut();
            $("body").css("overflow", "auto");

            // only ask for rating if room was created
            if (this.room) {
                this.askForRate();
            }

            this.close();
        },

        getVriBaseUrl: function () {
            var url;

            if ($.common.isInterpreter()) {
                if (App.config.company.config.vriEnabled) {
                    url = this.currentDomain() + "/interpreter/agent";
                } else {
                    url = this.currentDomain() + "/interpreter/dashboard";
                }
            } else if ($.common.isCustomer()) {
                url = this.currentDomain() + "/customer/dashboard";
            }

            return url;
        },

        // Some scenarios have to be sanitized to avoid interfering with development
        currentDomain: function () {
            if (App.config.domain.indexOf("localhost") !== -1) {
                return App.config.domain;
            } else if (App.config.domain.indexOf("ngrok")) {
                return App.config.domain.replace(/http\b/g, "https");
            } else {
                return App.config.domain;
            }
        },

        share: function (evt) {
            // LOG("share");

            var shareView = new $.vri.ShareView({
                model: this.model,
                company: this.company
            });
            shareView.render();

        },

        toggleRealTimeInfo: function () {
            if (this.infoView) {
                this.infoView.close();
                this.infoView = null;
            } else {
                this.infoView = new $.vri.SessionInformationView({
                    sessionUuid: this.model.getSessionIdentifier(),
                    participants: this.room.participants,
                    actualStartDate: this.model.get("job").actualStartDate
                });
                this.infoView.render();
            }
        },

        checkWebRtcLink: function () {
            if (this.model.get("providerSessionIdentifier")) {

                this.connectSuccess();
                this.firstArrival();

                var externalVideoView = new $.vri.ExternalVideoView({
                    model: this.model,
                    conferenceView: this
                });
                externalVideoView.render();
                //alert("Got WebRtc");
                // bail
                return true;
            } else {
                return false;
            }
        },

        /*
         * The Room name for the video conference.
         * This is usually the UUID of visit record the job belongs to.
         * Also known as the "teamSession" on server side and in the Twilio Task attributes
         */
        getRoomName: function () {
            var roomName = this.model.getSessionIdentifier();
            if (this.reservation) {
                console.log("Check reservation:", this.reservation);
                roomName = this.reservation.task.attributes.teamSession;
            }
            console.log("roomName:", roomName);
            return roomName;
        },

        /*
         * The  VRI token is a Twilio AccessToken constructed on the server side
         */
        getVriToken: function () {
            return this.model.get("config") ? this.model.get("config").vriToken : this.token;
        },

        connectToTwilio: function () {
            var that = this;
            var Video = Twilio.Video;
            console.log("ConfView. ConnectToTwilio. that:", that);

            // apparently old safari versions do not have the enumerateDevices method
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices
                    .enumerateDevices()
                    .then(function (devices) {
                        devices.forEach(function (device) {
                            console.log("::: enumerateDevice", JSON.stringify(device));

                            if (device.getCapabilities) {
                                console.log("::: capabilities for device", JSON.stringify(device.getCapabilities()));
                            }
                        });
                    })
                    .catch(function (error) {
                        console.log("::: error enumerating devices", JSON.stringify(error));
                    });
            }

            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions
                    .query({
                        name: "camera"
                    })
                    .then(function (cameraPermission) {
                        console.log("::: camera permission state: ", cameraPermission.state);
                    });

                navigator.permissions
                    .query({
                        name: "microphone"
                    })
                    .then(function (microphonePermission) {
                        console.log("::: microphone permission state: ", microphonePermission.state);
                    });
            }

            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: videoPrefs
            }).then(function (mediaStream) {
                console.log('::: User media obtained:', JSON.stringify({
                    id: mediaStream.id,
                    active: mediaStream.active
                }));

                if (mediaStream.getTracks()) {
                    mediaStream.getTracks()
                        .forEach(function (track) {
                            console.log('::: Track:', JSON.stringify({
                                kind: track.kind,
                                id: track.id,
                                label: track.label,
                                enabled: track.enabled,
                                muted: track.muted,
                                readyState: track.readyState
                            }));
                        });
                }

                // VRI accessToken and a Room name to correctly connect video
                var vriToken = that.getVriToken();
                var roomName = that.getRoomName();

                return Video
                    .connect(vriToken, {
                        name: roomName,
                        tracks: mediaStream.getTracks()
                        /*, preferredVideoCodecs: [ { codec: 'VP8', simulcast: true } ] */
                    })
                    .then(that.connectSuccess, function (error) {
                        console.log("::: Error connecting to room", JSON.stringify(error));
                        console.log("::: Error connecting to room", error);
                        mediaStream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                        that.connectFailure(error);
                    })
                    .catch(function (error) {
                        console.log('::: Error connecting to room.', JSON.stringify(error));
                        console.log('::: Error connecting to room.', error);
                    });
            }).catch(function (error) {
                console.log("::: Could not acquire media stream", JSON.stringify(error));
                console.log("::: Could not acquire media stream", error);
                that.$el.find('.no-media-available').show();
                this.reject();
            });
        },

        /**
         * connect to video session encapsulated by this model
         *
         * data.token - token for connection
         * data.identity - identify of user connecting
         * data.view - view hosting the video session
         */
        connect: function () {
            console.log("ENTER ConfView connect");

            var that = this;

            if (!this.model && this.sessionUuid) {
                // existing session, load session model

                // search by session uuid
                var filtersJSON = {
                    groupOp: "AND",
                    rules: []
                };

                // add invoice number
                filtersJSON = addOrUpdateFilter(filtersJSON, "uuid", "eqw", this.sessionUuid);

                var sessions = new $.core.VideoSessionCollection();
                sessions.setSorting("createdDate", "desc");
                sessions.queryParams.filters = JSON.stringify(filtersJSON);
                sessions.fetch({
                    success: function (model, response, options) {
                        if (model.models.length > 0) {
                            // get first session in list
                            that.model = model.models[0];

                            // LOG("INFO: Session [" + that.model.getSessionIdentifier() + "]");
                            // LOG("INFO: Connecting session " + that.model.getSessionIdentifier());

                            if (that.checkWebRtcLink()) {
                                return;
                            }

                            // set necessary tokens
                            that.token = model.get("config").token; // Here be the damn VriToken
                            that.wsToken = model.get("config").wsToken;
                            that.identity = model.get("config").identity;

                            that.connectToTwilio();
                        } else {
                            // TODO: error handle if session not found. clean up window.
                            handleError({}, {
                                message: "Found no matching sessions."
                            });
                        }
                    },
                    // TODO: error handle if session not found. clean up window.
                    error: handleError
                });
            } else if (this.model.id) {
                // connect to existing session
                // LOG("INFO: Session [" + this.model.getSessionIdentifier() + "]");
                // LOG("INFO: Connecting session " + this.model.getSessionIdentifier());

                if (this.checkWebRtcLink()) {
                    return;
                }

                // if id is present all necessary tokens should be set already, but legacy code may not
                // set necessary tokens
                that.token = this.model.get("config").token; // Here be the damn VriToken
                that.wsToken = this.model.get("config").wsToken;
                that.identity = this.model.get("config").identity;

                this.connectToTwilio();
            } else {
                // generate new session and connect to it
                this.model.save(null, {
                    success: function (model, response) {

                        // LOG("INFO: Session [" + model.getSessionIdentifier() + "]");
                        // LOG("INFO: Connecting session " + model.getSessionIdentifier());

                        if (that.checkWebRtcLink()) {
                            return;
                        }

                        // set necessary tokens
                        that.token = model.get("config").token; // Here be the damn VriToken
                        that.wsToken = model.get("config").wsToken;
                        that.identity = model.get("config").identity;

                        that.connectToTwilio();
                        model.start();
                    },
                    error: popupHandleError
                });
            }
        },

        registerRoomEvents: function (room) {
            console.log(">> registerRoomEvents:", room);
            var that = this;
            room.on('participantConnected', function (participant) {
                LOG("INFO: Room participant connected. Participant [" + that.numParticipants + " / " + participant.sid + "]");
                console.log("INFO: Room participant connected. Participant [" + that.numParticipants + " / " + participant.sid + "]");
                if (that.numParticipants === 0) {
                    that.participantConnected(participant, that.$('.miniatures'), "remote-primary");
                    // TODO: handle this as event
                    // call first participant method
                    that.firstArrival(participant);
                } else {
                    that.participantConnected(participant, that.$('.miniatures'), "remote-other");
                }
                that.numParticipants++;
                that.updateInfoView();
            });
            room.on('participantDisconnected', function (participant) {
                // LOG("INFO: Room participant disconnected. Participant [" + that.numParticipants + " / " + participant.sid + "]");
                that.participantDisconnected(participant);
                that.numParticipants--;
                if (that.numParticipants === 0) {
                    // TODO: handle this as event
                    // call last participant method
                    that.lastDeparture();
                }
                that.updateInfoView();
            });
            room.once('disconnected', function (error) {
                // LOG("INFO: Room disconnected. Disconnecting participants. Message: " + error);
                // TOOD: assumption is disconnect always calls room.disconnect().
                //that.disconnect();
            });
        },

        updateUrl: function () {
            var newUrl;

            if ($.common.isCustomer() || $.common.isInterpreter()) {
                newUrl = this.getVriBaseUrl() + "?vriSession=" + this.model.get("session");
            } else {
                newUrl = this.currentDomain() + "/vri/" + App.config.company.uuid + "/" + this.model.get("session");
            }

            window.history.replaceState(newUrl, "", newUrl);
        },

        connectSuccess: function (room) {
            console.log("ENTER connectSuccess: rooom:", room);

            globalRoom = room;
            this.updateUrl();

            console.log("connect success! Room.sid:", room.sid);

            var that = this;
            this.room = room;

            // connect local participant
            this.participantConnected(room.localParticipant, this.$('.main-video'), "local");
            this.mainViewParticipant = room.localParticipant;
            this.numParticipants = 0;

            // connect all other participants
            room.participants.forEach(function (participant) {
                // LOG("INFO: Adding existing participants. Participant [" + that.numParticipants + " / " + participant.sid + "]");
                if (that.numParticipants === 0) {
                    that.participantConnected(participant, that.$('.miniatures'), "remote-primary");

                    var video = that.$el.find(".miniatures .container-video video")[0];
                    video.addEventListener("loadeddata", function () {
                        that.switchToMainView({
                            participant: participant,
                            container: that.$el.find(".miniatures > div")[0]
                        });
                    });

                } else {
                    that.participantConnected(participant, that.$('.miniatures'), "remote-other");
                }
                that.numParticipants++;
            });

            this.mainControlsView = new $.vri.MainControlsView({
                model: new Backbone.Model({
                    room: this.room,
                    participant: this.mainViewParticipant
                })
            });
            this.mainControlsView.render();

            this.listenTo(this.mainControlsView, "inputDeviceChanged", this.inputDeviceChanged);
            this.listenTo(this.mainControlsView, "toggleChat", function (enabled) {
                if (enabled) {
                    that.chatView.show();
                } else {
                    that.chatView.hide();
                }
            });

            var friendlyName = this.chatFriendlyName(room, that.model);
            console.log("friendlyName:", friendlyName);
            this.chatView = new $.chat.channel.views.ChannelMainView({
                channel: new $.core.TwilioChatChannelModel({
                    uniqueName: that.model.getSessionIdentifier(), // that.model.get("jobUuid") || that.model.get("job").uuid,
                    // friendlyName: "Job #" + (that.model.get("jobId") || that.model.get("job").id)
                    friendlyName: friendlyName
                }),
                startVisible: false,
                parentSelector: '.vri',
                create: true
            });
            this.listenTo(this.chatView, "unconsumedMessageCountUpdate", function (value) {
                that.mainControlsView.unconsumedMessageCountUpdate(value);
            });
            this.chat.show(this.chatView);


            this.registerRoomEvents(room);
        },

        chatFriendlyName: function (room, model) {
            console.log("friendly model:", model);
            if (!model.get("job") && !model.get("jobId")) {
                return "Job #" + room.name;
            } else {
                return "Job #" + (model.get("jobId") || model.get("job").id);
            }
        },

        connectFailure: function (error) {
            console.log("connect failure!", error);
            // show error to user
            // TODO: failure here, have more user friendly error message
            popupHandleActionError({
                message: "An error occurred connecting the video session. Please try again.<br/><br/>If the problem persists please contact your administrator with the following information [" + error.code + " / " + error.message + "]."
            });
            this.disconnect();
        },

        hideProgressBar: function () {
            this.$(".progress").slideUp();
            this.$(".vri-progress-bar").css("display", "none");
        },

        switchToMainView: function (data) {
            var mainView = this.viewsMap[this.mainViewParticipant.sid];
            var miniatureView = this.viewsMap[data.participant.sid];

            if (mainView) mainView.close();
            if (miniatureView) miniatureView.close();

            this.participantConnected(data.participant, $(".main-video"), data.participant.role);
            this.participantConnected(this.mainViewParticipant, $(".miniatures"), this.mainViewParticipant.role);

            this.mainViewParticipant = data.participant;
            this.mainControlsView.model.set('participant', this.mainViewParticipant);
            this.mainControlsView.render();
        },

        participantConnected: function (participant, container, role) {
            this.hideProgressBar();

            // LOG("INFO: Participant connected. Role [" + role + "]. Participant [" + participant.identity + " / " + participant.sid + "]");

            var participantContainer = new $.vri.ParticipantView({
                //el: container,
                model: new Backbone.Model({
                    identity: participant.identity,
                    tracks: participant.tracks,
                    participant: participant,
                    role: role
                })
            });

            this.viewsMap[participant.sid] = participantContainer;
            this.listenTo(participantContainer, "onSwitchToMainView", this.switchToMainView);

            // store the view on the participant for clean up
            // participant.view = participantContainer;
            participant.role = role;

            container.append(participantContainer.render().el);

            return participantContainer;
        },

        firstAvailableParticipant: function () {
            var firstAvailable;

            this.room.participants.forEach(function (participant) {
                if (!firstAvailable) {
                    firstAvailable = participant;
                }
            });

            return firstAvailable;
        },

        participantDisconnected: function (participant) {
            // LOG("INFO: Participant disconnected. Role [" + participant.role + "]. Participant [" + participant.identity + " / " + participant.sid + "]");

            if (participant.sid === this.mainViewParticipant.sid && this.room.participants.size > 0) {
                this.switchToMainView({
                    participant: this.firstAvailableParticipant(),
                    container: this.$el.find(".miniatures > div")[0]
                });
            }

            // ensure participant is in viewsMap
            if (this.viewsMap[participant.sid]) {
                // TODO: Diego can you see why this would not be in viewsMap?=======
                this.viewsMap[participant.sid].close();
                delete this.viewsMap[participant.sid];
            }
        },

        startInstant: function () {

            // TODO: clean up existing session
            // create new session
            this.model = new $.core.VideoSessionModel({
                company: {
                    id: this.company.id
                },
                starLeafEnabled: getParameterByName("starLeafEnabled")
            });

            this.joinConference();
        },

        joinConference: function () {

            // show conference
            /*var conferenceView = new $.vri.ConferenceView({
                /*el: $(".vri-overlay"),* /
                model: sessionModel,
                identity: this.identity,
                token: this.token,
                wsToken: this.wsToken,
                company: this.company,
                companyConfig: this.companyConfig
            });*/
            this.render();
        },

        firstArrival: function (participant) {
            this.sessionStarted = true;
            var that = this;
            var video = this.$el.find(".miniatures .container-video video")[0];
            video.addEventListener("loadeddata", function () {
                that.switchToMainView({
                    participant: participant,
                    container: that.$el.find(".miniatures > div")[0]
                });
            });

            this.model.fetch({
                success: this.updateInfoView
            });

            // TODO: include here for StarLead
            // LOG("First arrival");
            // clear the timeout and progress if set
            clearTimeout(this.cancelTimer);
            clearInterval(this.progressTimer);

            // remove progress bar
            this.hideProgressBar();
        },

        lastDeparture: function () {
            this.sessionEnded = true;
            var localParticipantView = this.viewsMap[this.room.localParticipant.sid];

            if (localParticipantView) {
                localParticipantView.close();
            }

            this.mainViewParticipant = this.room.localParticipant;
            this.participantConnected(this.mainViewParticipant, $(".main-video"), this.mainViewParticipant.role);
        }
    });

    $.vri.CustomerConferenceView = $.vri.ConferenceView.extend({

        connectSuccess: function (room /* session */ ) {
            console.log("connectSuccess. room", room);

            // invoke parent
            $.vri.ConferenceView.prototype.connectSuccess.apply(this, arguments);

            // initiate request
            if (this.wsToken) {
                this.requestResource();
            } else {
                popupHandleActionError({
                    message: "Could not connect to send request. Missing workspace token."
                });
                // TODO: close conference
            }
        },

        connectFailure: function (error) {
            console.log("connectFailure.", error);

            // invoke parent
            $.vri.ConferenceView.prototype.connectFailure.apply(this, arguments);

            this.cancelResource("Error connecting video: " + error);

        },

        disconnect: function (evt) {
            console.log("disconnect.", evt);

            // invoke parent
            $.vri.ConferenceView.prototype.disconnect.apply(this, arguments);

            this.cancelResource("Disconnection request.");
        },

        showProgressBar: function () {
            this.$(".vri-progress-bar").css("display", "block");
            this.$(".progress .bar").width("0%");
            this.$(".progress").slideDown();
        },

        requestResource: function () {
            var that = this;
            this.model
                .request({
                    language: this.model.get('language')
                }, {
                    success: function () {
                        that.showProgressBar();
                        var timeoutMs = parseInt(App.config.twilio.tasktimeout, 10) * 1000;
                        console.log("requestResource timeoutMs:", timeoutMs);

                        // create timeout for cancel
                        that.cancelTimer = setTimeout(function () {
                            clearInterval(that.progressTimer);
                            that.sessionEnded = true;
                            this.$(".progress .bar").width('100%');

                            // show retry / cancel
                            new $.vri.RetryCancelView({
                                model: new Backbone.Model({
                                    message: "Timeout waiting for resource."
                                }),
                                conferenceView: that
                            }).render();

                        }, timeoutMs); // wait extra 5 secs for timeout on customer side

                        var startMs = new Date().getTime();

                        that.progressTimer = setInterval(function () {
                            var currentMs = new Date().getTime();
                            var percentage = Math.min((currentMs - startMs) / timeoutMs * 100, 100);
                            this.$(".progress .bar").width(percentage + '%');
                        }, 500);
                    }
                });
        },

        retry: function (evt) {
            this.requestResource();
        },

        cancelResource: function (message) {

            if (!this.sessionStarted) {
                this.model.cancel({
                    reason: message
                });
            } else if (this.sessionStarted && this.sessionEnded) {
                this.model.disconnect();
            }

            // TODO: want to cancel video session also

            // clear the timeout and progress if set
            clearTimeout(this.cancelTimer);
            clearInterval(this.progressTimer);

            // remove progress bar
            this.hideProgressBar();

            /* if (!this.sessionStarted) {
                this.model.cancel({
                    reason: message
                });
            } */
        }
    });

    $.vri.WorkerConferenceView = $.vri.ConferenceView.extend({

        initialize: function () {
            var that = this;

            $.vri.ConferenceView.prototype.initialize.apply(this, arguments);

            this.worker.on("task.completed", function () {
                that.taskCompleted = true;
            });

            // make worker available again
            // this.makeAvailable();
        },

        disconnect: function (evt) {
            console.log("WorkerConfView disconnect");
            // invoke parent
            $.vri.ConferenceView.prototype.disconnect.apply(this, arguments);
            this.model.disconnect(); // TODO: Is this necessary? Receiving duplicate calls in the backend...
        },

        connectSuccess: function (room /* session */ ) {
            console.log("WorkerConfView connectSuccess.", room);
            // invoke parent
            // invoke parent
            $.vri.ConferenceView.prototype.connectSuccess.apply(this, arguments);
        },

        connectFailure: function (error) {
            console.log("WorkerConfView connectFailure.", error);
            // invoke parent
            $.vri.ConferenceView.prototype.connectFailure.apply(this, arguments);
            this.makeAvailable();
        },

        makeAvailable: function () {
            console.log("WorkerConfView makeAvailable.", this);
            // make worker available
            var props = {
                "ActivitySid": WFA_AVAILABLE
                /*,
                                "Attributes": {
                                    "contact_uri": "+14152166677"
                                }*/
            };
            //var props = {"FriendlyName":"UpdatedWorker"};
            this.worker.update(props, function (error, worker) {
                if (error) {
                    // console.log("Error:", error.code);
                    // console.log("Error:", error.message);
                } else {
                    // console.log("Success:", worker, worker.available);
                }
            });
        }
    });

    $.vri.ShareView = $.app.ItemView.extend({
        // el: $("#modalContainer"),
        template: "video/share",
        events: {
            "click .send-email-action": "sendMail",
            "click .send-sms-action": "sendSms",
            "change input": "synchModel"
        },
        initialize: function (options) {
            App.config.company.uuid = options.company.uuid;
        },
        onRender: function () {

            this.$modalEl = $("#modalContainer");

            this.$modalEl.html(this.el);
            this.$modalEl.modal({
                backdrop: 'static'
            });
        },
        sendMail: function () {
            var that = this;
            var link = App.config.domain + "/vri/" + App.config.company.uuid + "/" + this.model.get("session");
            var email = new $.core.EmailModel({
                jobId: this.model.get("job") ? this.model.get("job").id : null,
                subject: this.model.get("job") ? "Job #" + this.model.get("job").id : "Ad Hoc Video - Invitation",
                recipient: this.model.get("emailRecipient"),
                body: "" +
                    "<html>" +
                    "   <body>" +
                    "       You have been invited to join a videoconference. Click on the link or copy / paste it in your browser: <a href='" + link + "'>" + link + "</a>" +
                    "   </body>" +
                    "</html>"
            });
            email.save({}, {
                success: function () {
                    that.$modalEl.modal('hide');
                },
                error: popupFetchOptions.error
            });
        },
        sendSms: function () {
            var that = this;
            var link = App.config.domain + "/vri/" + App.config.company.uuid + "/" + this.model.get("session");
            var sms = new $.core.SmsModel({
                jobId: this.model.get("job") ? this.model.get("job").id : null,
                recipient: this.model.get("smsRecipient"),
                body: "Video link: " + link
            });
            sms.save({}, {
                success: function () {
                    that.$modalEl.modal('hide');
                },
                error: popupFetchOptions.error
            });
        }
    });

    $.vri.IncomingCallView = $.app.ItemView.extend({

        reservationCanceled: function () {
            this.sound.stop();

            var $modalEl = $("#modalContainer");
            $modalEl.modal('hide');
            this.close();
        },

        initialize: function (options) {

            // set the local sound to be the incoming call sound loaded earlier
            this.sound = window.incomingCallSound;

            //$(this.el).unbind();
            this.reservation = options.reservation;
            this.workerClient = options.workerClient;
            this.listenTo(this.workerClient, 'onReservationCanceled', this.reservationCanceled);
            this.listenTo(this.workerClient, 'onReservationRescinded', this.reservationCanceled);
            this.connection = options.connection;
        },

        //el: $("#modalContainer"),

        template: "video/incoming-call",

        events: {
            "click .cmd-widget-accept": "accept",
            "click .cmd-widget-decline": "decline"
        },

        onRender: function () {

            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal({
                backdrop: 'static'
            });

            this.sound.play();
        },

        accept: function (evt) {

            this.sound.stop();

            var $modalEl = $("#modalContainer");

            $modalEl.modal('hide');
            // TODO: need to unbind events also
            //this.$el.modal('hide');

            // for OPI jobs this is the JSON:
            /*
             {
             "from_country": "US",
             "called": "+14152124392",
             "to_country": "US",
             "to_city": "SAN FRANCISCO",
             "language": "deu",
             "to_state": "CA",
             "mode": "phone",
             "caller_country": "US",
             "call_status": "in-progress",
             "call_sid": "CA88b31bae48755154f19d88cb4d406eac",
             "account_sid": "ACff222a6633c37148249f45b3def4e873",
             "from_zip": "94108",
             "company": "dca952da-18ad-11e4-8e1b-d4e60461da24",
             "from": "+14152166677",
             "direction": "inbound",
             "called_zip": "94105",
             "caller_state": "CA",
             "to_zip": "94105",
             "called_country": "US",
             "from_city": "OAKLAND",
             "called_city": "SAN FRANCISCO",
             "caller_zip": "94108",
             "api_version": "2010-04-01",
             "called_state": "CA",
             "from_state": "CA",
             "caller": "+14152166677",
             "caller_city": "OAKLAND",
             "to": "+14152124392"
             }
             */
            // TODO: any errors, give reservation back before it's completed or have interpreter join from reservation list or from agenda view list
            // TODO: get job and add to jobs collection

            // for phone
            // 1. accept
            // 2. assign interpreter (this can be done via call back to AssignmentCallbackURL on workflow. Will need to implement for both phone / video)
            // 3. if on browser - bridge to SIP
            // 4. if on phone - bridge to phone number
            /*
             {
             "instruction": "deqeue"
             "to": "+14152166677" // required is worker does not include "contact_uri". "contact_uri":"sip:someone@somedomain.com"
             }
             */
            /*
             for (var property in reservation) {
             console.log(property + " : " + reservation[property]);
             }
             console.log("Attributes: ", reservation.task.attributes);
             */
            //debugger;
            if (this.reservation.task.attributes.mode === "phone") {

                this.reservation.dequeue(
                    null, //"18004746453",
                    null, //"WAxxx",
                    null, //"record-from-answer",
                    null, //"30",
                    null, //"http://requestb.in/13285vq1",
                    null, //"+16617133454", //"client:jenny",
                    function (error, reservation) {
                        if (error) {
                            popupHandleActionError({
                                message: error.message
                            });
                        }
                    }
                );
            } else {
                // video (or other)
                this.reservation.accept(function (error, reservation) {
                    if (error) {
                        popupHandleActionError({
                            message: error.message
                        });
                    }
                });
            }

        },

        decline: function (evt) {

            this.sound.stop();

            this.reservation.reject(
                function (error, reservation) {
                    if (error) {
                        popupHandleActionError({
                            message: error.message
                        });
                    }
                }
            );

            // TODO: need to unbind events also
            //this.$el.modal('hide');
            var $modalEl = $("#modalContainer");

            $modalEl.modal('hide');
        }

    });

    $.vri.RetryCancelView = $.app.ItemView.extend({

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

            this.conferenceView.retry();
        },

        cancel: function (evt) {

            var $modalEl = $("#modalContainer");

            $modalEl.modal('hide');

            this.conferenceView.disconnect();
        }

    });

    /**
     * this view is used to gather user interaction on page load so that the sounds of
     * incoming calls are enabled. By default no sounds are allowed until the user has
     * interacted with the page.
     */
    $.vri.ConfirmReadyView = $.app.ItemView.extend({

        template: "video/confirmready",

        events: {
            "click .cmd-widget-ok": "ok"
        },

        onRender: function () {

            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal({
                backdrop: 'static'
            });
        },

        ok: function (evt) {

            // register twilio voice client on Ok
            Twilio.Device.setup(this.options.clientToken);

            // play sound so that if / when the browser window is minimized
            // it will still play the incoming call sound. without this the browser
            // will not play the incoming call sound if no calls are received before
            // the window loses focus
            var dingUrl = App.config.context + "/sounds/ding.mp3";
            var sound = new Howl({
                src: [dingUrl],
                html5: true,
                volume: 0.25,
                preload: true,
                loop: false
            });
            sound.play();

            // load the actual sound for incoming call. it must be loaded here so that
            // when the call comes in the audio is played without issue.
            var incomingUrl = App.config.context + "/sounds/mystic_call.mp3";
            window.incomingCallSound = new Howl({
                src: [incomingUrl],
                html5: true,
                volume: 0.1,
                loop: true,
                preload: true
            });
            // ensure loaded
            window.incomingCallSound.load();

            var $modalEl = $("#modalContainer");

            $modalEl.modal('hide');
        }
    });

    $.vri.ExternalVideoView = $.app.ItemView.extend({

        template: "video/externalvideo",

        events: {
            "click .cmd-widget-complete": "complete"
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

        complete: function (evt) {

            var $modalEl = $("#modalContainer");

            $modalEl.modal('hide');

            this.conferenceView.lastDeparture();
        }

    });

    $.vri.VideoRemoteRequestView = $.app.ItemView.extend({

        template: "video/vri-request",

        events: {
            "click .cmd-widget-request": "request",
            "click .cmd-widget-cancel": "cancel"
        },

        modelEvents: {
            "error": "popupError",
            "invalid": "popupInvalid"
        },

        initialize: function (options) {

            // TODO: II-5195 disable dropdowns on these views. they are not popuplated with uuid / iso639_3Tag currently
            _.extend(this, $.app.mixins.subviewContainerMixin);

            this.callback = this.options.callback;

            this.views = {
                language: {
                    selector: '.language-container',
                    view: new $.common.widget.customer.LanguageView({
                        model: this.model
                    })
                },
                customer: {
                    selector: '.customer-container',
                    view: new $.common.widget.customer.CustomerView({
                        model: this.model
                    })
                },
                client: {
                    selector: '.client-container',
                    view: new $.common.widget.customer.ClientView({
                        model: this.model
                    })
                },
                location: {
                    selector: '.location-container',
                    view: new $.common.widget.customer.LocationView({
                        model: this.model
                    })
                }
            };
        },

        onRender: function () {
            var $modalEl = $("#modalContainer");

            this.renderSubviews();

            $modalEl.html(this.el);
            $modalEl.modal({
                backdrop: 'static'
            });
        },

        request: function (evt) {

            // validate model
            if (this.model.isValid()) {

                var that = this;
                var $modalEl = $("#modalContainer");

                // collect the conference attributes
                var languageCode = this.model.get("language") ? this.model.get("language").iso639_3Tag : null;
                var customer = this.model.get("customer") ? this.model.get("customer").uuid : null;
                var client = this.model.get("client") ? this.model.get("client").uuid : null;
                var location = this.model.get("location") ? this.model.get("location").uuid : null;
                var routingAttributes = {
                    languageCode: languageCode
                };

                var sessionModel = new $.core.VideoSessionModel({
                    company: this.options.company.uuid,
                    customer: customer,
                    language: languageCode,
                    client: client,
                    location: location,
                    starLeafEnabled: getParameterByName("starLeafEnabled")
                }, {
                    companyUuid: this.options.company.uuid
                });

                // create conference
                var conferenceView = new $.vri.CustomerConferenceView({
                    model: sessionModel,
                    identity: this.options.identity,
                    token: this.options.token,
                    wsToken: this.options.wsToken,
                    company: this.options.company,
                    companyConfig: this.options.companyConfig,
                    routingAttributes: routingAttributes,
                    envContext: this.options.envContext,
                    chatToken: this.options.chatToken
                });

                this.listenTo(conferenceView, "conferenceClose", function () {
                    that.trigger("conferenceClosed");
                });

                conferenceView.render();

                $modalEl.modal('hide');
            }
        },

        cancel: function (evt) {
            var $modalEl = $("#modalContainer");
            $modalEl.modal("hide");
        }

    });

    $.vri.RateView = $.app.ItemView.extend({

        initialize: function (options) {
            this.conferenceView = options.conferenceView;
        },

        //el: $("#modalContainer"),

        template: "video/rate",

        events: {
            "change input": "synchModel",
            "change textarea": "synchModel",
            "change select": "synchModel",
            "click .cmd-widget-ok": "ok",
            "click .cmd-widget-skip": "skip",
            "click .close": "skip"
        },

        onRender: function () {

            var that = this;
            var $modalEl = $("#modalContainer");

            $modalEl.html(this.el);
            $modalEl.modal({
                backdrop: 'static'
            });

            this.$("#rating").raty({
                path: App.config.context + '/js/raty/jquery.raty-1.3.2/img/',
                half: true,
                start: this.model.get("averageRating") ? this.model.get("averageRating") : 0,
                size: 24,
                starHalf: 'star-half-big.png',
                starOff: 'star-off-big.png',
                starOn: 'star-on-big.png',
                hintList: ['bad', 'poor', 'regular', 'good', 'excellent'],
                noRatedMsg: 'not rated yet',
                number: 5,
                click: function (score) {

                    that.model.set({
                        score: score
                    });
                    // set score
                    that.$("#rating-scr").html("(" + score + "/5)");
                    /*$.ajax({
                        url: App.config.context + '/rateable/rate/' + that.model.get("job").id,
                        dataType: 'html',
                        data: {
                            type: 'booking',
                            /* xhr: true, * /
                            rating: score,
                            active: true
                        },
                        success: function (doc) {
                            var avg = doc.substring(0, doc.indexOf(','));
                            that.$("#rating-scr").html("(" + avg + "/5)");
                            that.model.set({
                                averageRating: avg
                            }, {
                                silent: true
                            });
                        }

                    }); */
                }
            });
        },

        ok: function (evt) {
            this.model.rate();
            this.skip();

        },

        skip: function (evt) {

            // TODO: need to unbind events also
            //this.$el.modal('hide');
            var $modalEl = $("#modalContainer");

            $modalEl.modal('hide');

            // this.conferenceView.disconnect();
        }

    });

    $.vri.SettingsItemView = $.app.ItemView.extend({
        template: "video/vri-settings-item",
        tagName: "a",
        events: {
            "click": "deviceSelected"
        },
        /*attributes: function () {
            return {
                "href": "javascript:void(0)"
            };
        },*/
        initialize: function (options) {
            this.model = new Backbone.Model({
                title: options.title,
                selected: options.selected,
                kind: options.kind,
                deviceId: options.deviceId
            });
        },
        deviceSelected: function () {
            this.trigger('modelChanged', this.model);
        }
    });

    $.vri.SettingsGroupView = $.app.CompositeView.extend({
        template: "video/vri-settings-group",
        itemView: $.vri.SettingsItemView,
        onRender: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        },
        initialize: function (options) {
            this.model = options.model;
            this.collection = options.collection;
        },
        buildItemView: function (item, ItemViewType, itemViewOptions) {
            var view = new $.vri.SettingsItemView({
                title: item.get("title"),
                selected: item.get("selected"),
                kind: item.get("kind"),
                deviceId: item.get("deviceId")
            });
            this.listenTo(view, "modelChanged", this.selectionChanged);
            return view;
        },
        appendHtml: function (collectionView, itemView, index) {
            collectionView.$('.settings-items').append(itemView.el);
        },
        selectionChanged: function (selectedModel) {
            if (!selectedModel.get("selected")) {
                this.trigger("onInputDeviceChanged", selectedModel);
                this.collection.each(function (option) {
                    option.set('selected', option.get('title') === selectedModel.get('title'));
                });
                this.render();
            }
        }
    });

    $.vri.SettingsView = $.app.CollectionView.extend({
        template: "video/vri-settings",
        itemView: $.vri.SettingsGroupView,

        initialize: function (options) {
            this.model = new Backbone.Model({
                room: options.room
            });
            this.updateAvailableDevices();
        },

        buildItemView: function (item, ItemViewType, itemViewOptions) {
            var view = new $.vri.SettingsGroupView({
                model: new Backbone.Model({
                    title: item.get('title')
                }),
                collection: item.get('options')
            });
            this.listenTo(view, "onInputDeviceChanged", this.inputDeviceChanged);
            return view;
        },

        inputDeviceChanged: function (selectedModel) {
            this.trigger("onInputDeviceChanged", selectedModel);
        },

        getSelectedDevices: function () {
            var selectedDevices = [];

            this.model.get('room').localParticipant.audioTracks.forEach(function (value) {
                selectedDevices.push(value.mediaStreamTrack.label);
            });

            this.model.get('room').localParticipant.videoTracks.forEach(function (value) {
                selectedDevices.push(value.mediaStreamTrack.label);
            });

            return selectedDevices;
        },

        filterDevices: function (devicesInfo, kind) {
            var selectedDevices = this.getSelectedDevices();

            return devicesInfo
                .filter(function (di) {
                    return di.kind === kind;
                })
                .map(function (di) {
                    return {
                        title: di.label,
                        selected: selectedDevices.indexOf(di.label) !== -1,
                        kind: kind,
                        deviceId: di.deviceId
                    };
                });
        },

        updateAvailableDevices: function () {
            var that = this;
            navigator
                .mediaDevices
                .enumerateDevices()
                .then(function (devicesInfo) {
                    that.collection = new Backbone.Collection(
                        [{
                                title: "Video source",
                                options: new Backbone.Collection(that.filterDevices(devicesInfo, "videoinput"))
                            },
                            {
                                title: "Audio source",
                                options: new Backbone.Collection(that.filterDevices(devicesInfo, "audioinput"))
                            }
                        ]
                    );
                    that.render();
                });
        }

    });

    $.vri.SessionInformationEventView = $.app.ItemView.extend({
        template: "video/session-information-event",

        serializeData: function () {
            return _.extend({
                obj: this.model.toJSON()
            }, {
                formattedDate: $.app.mixins.templateHelpersMixin.formatDateTime(
                    new Date(this.model.get('event_date_ms')).toJSON(),
                    App.config.company.config.timeZone,
                    App.config.company.config.dateFormat
                )
            });

        }
    });

    $.vri.SessionInformationNoEventsView = $.app.ItemView.extend({
        template: "video/session-information-no-events"
    });

    $.vri.SessionInformationEventCollectionView = $.app.CollectionView.extend({
        template: "video/session-information-event-list",
        itemView: $.vri.SessionInformationEventView,
        emptyView: $.vri.SessionInformationNoEventsView,

        initialize: function (options) {
            this.collection = options.collection;

            var that = this;
            this.interval = setInterval(function () {
                that.collection.fetch({
                    success: function () {
                        that.collection.sort();
                        that.render();
                    }
                });
            }, 10000);
        },

        onBeforeClose: function () {
            if (this.interval) {
                clearInterval(this.interval);
            }
        },

        appendHtml: function (collectionView, itemView, index) {
            collectionView.$el.prepend(itemView.el);
        }
    });

    $.vri.SessionInformationParticipantView = $.app.ItemView.extend({
        template: "video/session-information-participant"
    });

    $.vri.SessionInformationNoParticipantsView = $.app.ItemView.extend({
        template: "video/session-information-no-participants"
    });

    $.vri.SessionInformationParticipantCollectionView = $.app.CollectionView.extend({
        template: "video/session-information-participant-list",
        itemView: $.vri.SessionInformationParticipantView,
        emptyView: $.vri.SessionInformationNoParticipantsView
    });

    $.vri.SessionInformationView = $.app.ItemView.extend({
        template: "video/session-information",
        el: ".vri-session-information",

        initialize: function (options) {
            _.extend(this, $.app.mixins.templateHelpersMixin);

            this.sessionUuid = options.sessionUuid;
            this.model = new Backbone.Model({
                elapsedTime: "-",
                startTime: "-"
            });
            this.participantCollection = new Backbone.Collection();

            this.eventCollection = new $.core.TwilioTaskRouterEventCollectionModel(null, {
                companyUuid: App.config.company.uuid,
                sessionUuid: this.sessionUuid
            });

            this.updateInfoView(options);

            var that = this;
            this.interval = setInterval(function () {
                if (that.model.get("startTime") !== "-") {
                    var elapsed = (new Date().getTime() - new Date(that.model.get("startTime")).getTime()) / 1000;
                    var value = moment()
                        .startOf('day')
                        .seconds(elapsed)
                        .format(elapsed >= 3600 ? 'H:mm:ss' : 'mm:ss');
                    that.model.set("elapsedTime", value);
                    that.$el.find(".elapsedTime").html(value);
                }
            }, 1000);
        },

        onRender: function () {
            if (!this.participantsView) {
                this.participantsView = new $.vri.SessionInformationParticipantCollectionView({
                    el: ".participants",
                    collection: this.participantCollection
                });
            }

            this.participantsView.render();

            if (!this.eventsView) {
                this.eventsView = new $.vri.SessionInformationEventCollectionView({
                    el: ".events",
                    collection: this.eventCollection
                });
            }

            this.eventsView.render();

            this.$el.find(".startTime").html(
                $.app.mixins.templateHelpersMixin.formatDateTime(
                    new Date(this.model.get('startTime')).toJSON(),
                    App.config.company.config.timeZone,
                    App.config.company.config.dateFormat
                )
            );
        },

        onBeforeClose: function () {
            clearInterval(this.interval);
            this.eventsView.close();
        },

        updateInfoView: function (params) {
            var that = this;

            if (params.participants) {
                this.participantCollection.reset();
                params.participants.forEach(function (p) {
                    that.participantCollection.add(new Backbone.Model({
                        participant: p.identity
                    }));
                });
            }

            if (params.actualStartDate) {
                this.model.set("startTime", params.actualStartDate);
            }
        },

        remove: function () {
            this.$el.empty();
            this.stopListening();
            return this;
        }
    });

    $.vri.ParticipantControlsView = $.app.ItemView.extend({
        template: "video/participant-controls",
        events: {
            "click .cmd-widget-mute": "toggleMute",
            "click .cmd-widget-pause": "togglePause"
        },

        isVideoEnabled: function () {
            var enabled = true;
            var participant = this.model.get('participant');

            if (participant) {
                participant.videoTracks.forEach(function (value) {
                    enabled &= value.mediaStreamTrack.enabled;
                });
            }

            return enabled;
        },

        isAudioEnabled: function () {
            var enabled = true;
            var participant = this.model.get('participant');

            if (participant) {
                participant.audioTracks.forEach(function (value) {
                    enabled &= value.mediaStreamTrack.enabled;
                });
            }

            return enabled;
        },

        toggleMute: function (ev) {
            var participant = this.model.get('participant');

            if (participant) {
                var audioTracks = participant.audioTracks;
                audioTracks.forEach(function (value) {
                    value.mediaStreamTrack.enabled = !value.mediaStreamTrack.enabled;
                });
            }

            if (ev) {
                ev.stopPropagation();
            }

            this.render();
        },

        togglePause: function (ev) {
            var participant = this.model.get('participant');

            if (participant) {
                participant.videoTracks.forEach(function (value) {
                    value.mediaStreamTrack.enabled = !value.mediaStreamTrack.enabled;
                });
            }

            if (ev) {
                ev.stopPropagation();
            }

            this.render();
        },

        serializeData: function () {
            var participant = this.model.get("participant");
            var local = !participant || participant.role === "local";
            var audioicon;
            var videoicon;

            if (this.isAudioEnabled()) {
                audioicon = local ? 'icon-microphone' : 'icon-volume-up';
            } else {
                audioicon = local ? 'icon-microphone-off' : 'icon-volume-off';
            }

            videoicon = this.isVideoEnabled() ? 'icon-pause' : 'icon-play';

            return _.extend(
                this.model.toJSON(), {
                    audioicon: audioicon,
                    videoicon: videoicon
                }
            );
        }
    });

    $.vri.MainControlsView = $.vri.ParticipantControlsView.extend({
        template: "video/main-controls",
        el: ".vri-mainvideo-controls",

        // parent events should be re-declared here
        events: {
            "click .cmd-widget-chat": "toggleChat",
            "click .cmd-widget-mute": "toggleMute",
            "click .cmd-widget-pause": "togglePause"
        },

        onRender: function () {
            this.settingsView = new $.vri.SettingsView({
                el: ".vri-settings",
                collection: new Backbone.Collection([]),
                room: this.model.get('room')
            });
            this.listenTo(this.settingsView, "onInputDeviceChanged", this.inputDeviceChanged);
            this.settingsView.render();
        },

        inputDeviceChanged: function (model) {
            this.trigger("inputDeviceChanged", model);
        },

        toggleChat: function () {
            this.chatEnabled = !this.chatEnabled;
            this.trigger('toggleChat', this.chatEnabled);
        },

        unconsumedMessageCountUpdate: function (value) {
            this.model.set("unconsumedMessageCount", value);
            this.render();
        }
    });

})(jQuery);
