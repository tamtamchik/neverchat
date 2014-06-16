/* globals define, md5 */
define(function(require, exports, module) {

    // =================================================================================================================
    var View          = require('famous/core/View');                                            // Require extra modules
    // var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var ChatView      = require('views/ChatView');
    var LoginView     = require('views/LoginView');

    var Dweet         = require('DweetAdapter');

    // =================================================================================================================
    function AppView() {                                                       // Constructor function for AppView class
        // Applies View's constructor function to AppView class
        View.apply(this, arguments);

        // Calling functions
        // _createChat.call(this);

        _showLogin.call();
        // this.options.channel += md5('');
        // var dweets = new Dweet(this.options.channel);
        // dweets.getFeed(_loadInitialMessages, this);
    }

    // Establishes prototype chain for AppView class to inherit from View
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    // =================================================================================================================
    AppView.DEFAULT_OPTIONS = {                                                     // Default options for AppView class
        channel: 'neverchat_'
    };

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createChat() {                                                       // Create chat view and show chat GUI
        this.chatView = new ChatView();

        this.chatViewModifier = new StateModifier({
            transform: Transform.translate(0, 0)
        });

        this.add(this.chatViewModifier).add(this.chatView);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _showLogin() {                                                                          // Create login GUI
        this.loginView = new LoginView();

        this.loginViewModifier = new StateModifier({
            transform: Transform.translate(0, 0)
        });

        this.add(this.loginViewModifier).add(this.loginView);
    }

    // =================================================================================================================
                                                                                                      // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    AppView.prototype.loadMessages = function loadMessages(res) {                                        // Loading feed
        this.chatView.loadMessages(res);
    }

    // =================================================================================================================
    module.exports = AppView;                                                                           // Module export
});
