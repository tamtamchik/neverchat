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

    // =================================================================================================================
    function AppView() {                                                      // Constructor function for AppView class

        this.messages = [];
        this.feed = [];

        // Applies View's constructor function to AppView class
        View.apply(this, arguments);

        // Calling functions
        _generateBackground.call(this);
        _createChat.call(this);

        _setListeners.call(this);

        Timer.setTimeout(_showLogin.bind(this), 2000);

        this.options.channel += md5('');
        var dweets = new Dweet(this.options.channel);
        dweets.getFeed(this.loadMessages, this);
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
        var welcomeMessage = {
            with: [{
                thing: 'welcomeMessage',
                created: new Date(),
                content: {
                    message: Base64.encode('Welcome, to **neverchat.io**!'),
                    user: md5('bot@neverchat.io')
                }}]
        };

        this.chatView.loadMessages(welcomeMessage);

        var helloMessage = {
            with: [{
                thing: 'helloMessage',
                created: new Date(),
                content: {
                    message: Base64.encode(
                        'Please, tell me your email for **Gravatar**. We promice that it won\'t get furter than your device... we\'ll securely keep it encoded by **md5** and use only that way! :3'),
                    user: md5('bot@neverchat.io')
                }}]
        };

        this.chatView.loadMessages(helloMessage);
    }

    // =================================================================================================================
                                                                                                     // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    function _setListeners() {                                                          // Function for event listeners
        this.chatView.on('sendMessage', this.sendMessage.bind(this));
    }

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.sendMessage = function sendMessage(message) {            // Generic function for sending messages
        // TODO: fill function
    };

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.loadMessages = function loadMessages(res) {                  // Generic function for loading feed
        this.chatView.loadMessages(res);
    };

    // =================================================================================================================
    module.exports = AppView;                                                                          // Module export
});
