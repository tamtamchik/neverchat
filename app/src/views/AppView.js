/* globals define, Trianglify, md5, Base64 */
define(function(require, exports, module) {

    // =================================================================================================================
    var View                = require('famous/core/View');                                     // Require extra modules
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

        this.options.channel += md5('');
        this.dweets = new Dweet(this.options.channel);

        // Timer.setInterval(_loadFeed.bind(this), 2000);
        Timer.setTimeout(_showLogin.bind(this), 4000);
    }

    // Establishes prototype chain for AppView class to inherit from View
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    // =================================================================================================================
    AppView.DEFAULT_OPTIONS = {                                                    // Default options for AppView class
        animationDuration: 1200,
        channel: 'neverchat_'
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
        this.sendBotMessage(['welcome','hello']);
    }

    // =================================================================================================================
                                                                                                     // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    function _setListeners() {                                                          // Function for event listeners
        this.chatView.on('sendMessage', this.sendMessage.bind(this));
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _loadFeed() {                                                         // Generic function for loading feed
        this.dweets.getFeed(this.loadMessages, this);
    }

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.sendBotMessage = function sendBotMessage(message) {                    // Sends messages as a bot
        if (typeof message === 'string') {
            message = [message];
        }
        for (var i = message.length - 1; i >= 0; i--) {
            this.chatView.loadMessages(this.bot.getMessage(message[i]));
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.sendMessage = function sendMessage(message) {            // Generic function for sending messages
        var welcomeMessage;
        if (message === '/m') {
            this.sendBotMessage('meow');
        } else if (message === '/h') {
            this.sendBotMessage('help');
        } else {
            this.dweets.sendMessage(Base64.encode(message), md5('yuri@progforce.com'), this.loadMessages.bind(this));
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.loadMessages = function loadMessages(res) {              // Generic function for loading messages
        this.chatView.loadMessages(res);
    };

    // =================================================================================================================
    module.exports = AppView;                                                                          // Module export
});
