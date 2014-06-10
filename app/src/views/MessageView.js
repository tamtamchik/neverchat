/* globals define */
define(function(require, exports, module) {

    // =================================================================================================================
    var View               = require('famous/core/View');                                       // Require extra modules
    // var Surface         = require('famous/core/Surface');
    var Transform          = require('famous/core/Transform');
    var StateModifier      = require('famous/modifiers/StateModifier');
    var ImageSurface       = require('famous/surfaces/ImageSurface');

    // =================================================================================================================
    function MessageView(msg) {                                               // Constructor function for MessageView class
        this.message = msg.data;
        // Applies View's constructor function to MessageView class
        View.apply(this, arguments);

        _createAvatar.apply(this);
    }

    // Establishes prototype chain for MessageView class to inherit from View
    MessageView.prototype = Object.create(View.prototype);
    MessageView.prototype.constructor = MessageView;

    // =================================================================================================================
    MessageView.DEFAULT_OPTIONS = {                                             // Default options for MessageView class
        avatarHeight: 50,
        avatarWidth: 50,
        avatarUrl: {
            prefix: 'http://www.gravatar.com/avatar/',
            postfix: '?s=200&d=identicon'
        },
    };

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createAvatar() {                                                                      // Avatar generation
        var avatar = new ImageSurface({
            size: [this.options.avatarHeight, this.options.avatarWidth],
            content: this.options.avatarUrl.prefix + this.message.content.user + this.options.avatarUrl.postfix
        })

        avatar.pipe(this);
        this.add(avatar);
    }

    // =================================================================================================================
    module.exports = MessageView;                                                                       // Module export
});
