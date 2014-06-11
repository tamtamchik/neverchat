/* globals define */
define(function(require, exports, module) {

    // =================================================================================================================
    var View               = require('famous/core/View');                                       // Require extra modules
    // var Surface         = require('famous/core/Surface');
    var Transform          = require('famous/core/Transform');
    var StateModifier      = require('famous/modifiers/StateModifier');
    var ImageSurface       = require('famous/surfaces/ImageSurface');
    var ContainerSurface   = require('famous/surfaces/ContainerSurface');

    // =================================================================================================================
    function MessageView(msg) {                                               // Constructor function for MessageView class
        this.message = msg.data;
        // Applies View's constructor function to MessageView class
        View.apply(this, arguments);

        _createBaseSurface.call(this);
        _createAvatar.call(this);
    }

    // Establishes prototype chain for MessageView class to inherit from View
    MessageView.prototype = Object.create(View.prototype);
    MessageView.prototype.constructor = MessageView;

    // =================================================================================================================
    MessageView.DEFAULT_OPTIONS = {                                             // Default options for MessageView class
        avatarHeight: 50,
        avatarProperties: {
            border: '3px solid rgba(255, 255, 255, 0.33)',
            borderRadius: '999em'
        },
        avatarUrl: {
            prefix: 'http://www.gravatar.com/avatar/',
            postfix: '?s=200&d=identicon'
        },
        avatarWidth: 50,
        messageMinHeight: 100
    };

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createBaseSurface() {                                                      // Creates base message surface
        this.container = new ContainerSurface();

        var containerModifier = new StateModifier();

        containerModifier.setSize([undefined, this.options.messageMinHeight]);

        this.container.pipe(this._eventOutput);
        this.add(containerModifier).add(this.container);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createAvatar() {                                                                      // Avatar generation
        var avatar = new ImageSurface({
            classes: ['no-selection'],
            size: [this.options.avatarHeight, this.options.avatarWidth],
            content: this.options.avatarUrl.prefix + this.message.content.user + this.options.avatarUrl.postfix,
            properties: this.options.avatarProperties
        });

        var avatarModirier = new StateModifier({
            transform: Transform.translate(10, 10, 0.1)
        });

        avatar.pipe(this.container);
        this.container.add(avatarModirier).add(avatar);
    }

    // =================================================================================================================
    module.exports = MessageView;                                                                       // Module export
});
