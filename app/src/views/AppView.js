/* globals define, Trianglify, md5, Base64, filterXSS */
define(function(require, exports, module) {

    // =================================================================================================================
                              require('xss');                                                  // Require extra modules
    var View                = require('famous/core/View');
    // var Surface              = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');
    var StateModifier       = require('famous/modifiers/StateModifier');
    var ImageSurface        = require('famous/surfaces/ImageSurface');
    var Timer               = require('famous/utilities/Timer');

    var ChatView            = require('views/ChatView');

    var Dweet               = require('DweetAdapter');
    var Bot                 = require('Bot');

    // =================================================================================================================
    function AppView() {                                                      // Constructor function for AppView class

        this.messages = [];
        this.feed = [];
        this.bot = new Bot();

        // Applies View's constructor function to AppView class
        View.apply(this, arguments);

        // Calling functions
        _generateBackground.call(this);
        _createChat.call(this);

        _setListeners.call(this);

        Timer.setTimeout(_showLogin.bind(this), 4000);
    }

    // Establishes prototype chain for AppView class to inherit from View
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    // =================================================================================================================
    AppView.DEFAULT_OPTIONS = {                                                    // Default options for AppView class
        animationDuration: 1200,
        channel: 'neverchat_',
        user: '',
        feedUpdateInterval: 2000
    };

    // =================================================================================================================
                                                                                                   // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    // Use Trianglify to generate random background for application                            // Background generation
    // TODO: change code to require Trianglify instead of appending it to HTML
    function _generateBackground() {
        var t = new Trianglify();
        var pattern = t.generate(document.body.clientWidth, document.body.clientHeight);

        this.backSurface = new ImageSurface({
            size: [undefined, undefined],
            content: pattern.dataUri
        });

        var backModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            opacity: 0
        });

        this.add(backModifier).add(this.backSurface);

        backModifier
            .setOpacity(0, { duration: this.options.animationDuration / 3 })
            // TODO: make showGUI after login
            .setOpacity(1, { duration: this.options.animationDuration / 3 });
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createChat() {                                                      // Create chat view and show chat GUI
        this.chatView = new ChatView();

        this.chatViewModifier = new StateModifier({
            transform: Transform.translate(0, 0)
        });

        this.add(this.chatViewModifier).add(this.chatView);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _showLogin() {                                                                         // Create login GUI
        this.sendBotMessage(['welcome','email']);
    }

    // =================================================================================================================
                                                                                                     // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    function _setListeners() {                                                          // Function for event listeners
        this.chatView.on('sendMessage', this.sendMessage.bind(this));
    }

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype._loadFeed = function _loadFeed() {                           // Generic function for loading feed
        this.dweets.getFeed(this.loadMessages.bind(this), this);
    };

    AppView.prototype._setRoom = function _setRoom(command, message) {
        var room = message.replace(command, '').trim();
        var roomName = (room !== '') ? room  : 'global';

        if (this.options.user !== '') {
            this.options.channel += md5(room);

            Timer.clear(this.dweetInterval);
            this.dweets = null;

            this.dweets = new Dweet(this.options.channel);

            this.dweetInterval = Timer.setInterval(this._loadFeed.bind(this), this.options.feedUpdateInterval);

            this.chatView.loadMessages(this.bot.getMessage('setRoom','','**' + roomName + '**'));
        } else {
            this.sendBotMessage('email');
        }
    };

    AppView.prototype._setUser = function _setUser(command, message) {
        var user = message.replace(command, '').trim();
        var re   = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (user) {
            if (re.test(user)) {
                this.options.user = md5(user);
                this.chatView.loadMessages(this.bot.getMessage('setUser'));
            } else {
                this.chatView.loadMessages(this.bot.getMessage('wrongEmail', '**' + user + '**'));
            }
        } else {
            this.chatView.loadMessages(this.bot.getMessage('wrongCommand'));
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype._execCommand = function _execCommand(command, message) {              // Commands definition
        switch (command) {
            case '/me':
                this._setUser(command, message);
                break;
            case '/r':
                this._setRoom(command, message);
                break;
            default:
                this.chatView.loadMessages(this.bot.getMessage(command));
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.sendBotMessage = function sendBotMessage(message) {                    // Sends messages as a bot
        if (typeof message === 'string') {
            message = [message];
        }
        for (var i = 0; i < message.length; i++) {
            if (message[i][0] === '/') {
                var command = message[i].split(' ')[0];
                this._execCommand(command, message[i]);
            } else {
                this.chatView.loadMessages(this.bot.getMessage(message[i]));
            }
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.sendMessage = function sendMessage(message) {            // Generic function for sending messages
        message = filterXSS(message);

        if (message[0] === '/') {
            this.sendBotMessage(message);
        } else if (this.options.user !== '') {
            this.dweets.sendMessage(Base64.encode(message), this.options.user, this.loadMessages.bind(this));
        } else {
            this.sendBotMessage('email');
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.loadMessages = function loadMessages(res) {              // Generic function for loading messages
        this.chatView.loadMessages(res);
    };

    // =================================================================================================================
    module.exports = AppView;                                                                          // Module export
});
