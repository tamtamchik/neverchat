/* globals define, md5 */
define(function(require, exports, module) {

    // =================================================================================================================
    var base64             = require('js-base64');                                                // Require extra modules
    var View               = require('famous/core/View');
    var Surface            = require('famous/core/Surface');
    var Transform          = require('famous/core/Transform');
    var StateModifier      = require('famous/modifiers/StateModifier');
    var ImageSurface       = require('famous/surfaces/ImageSurface');
    var ContainerSurface   = require('famous/surfaces/ContainerSurface');
    var Timer              = require('famous/utilities/Timer');

    // =================================================================================================================
    function MessageView(msg) {                                               // Constructor function for MessageView class
        this.message = msg.data;
        // Applies View's constructor function to MessageView class
        View.apply(this, arguments);

        _createBaseSurface.call(this);
        _createAvatar.call(this);
        _createMessageBox.call(this);
    }

    // Establishes prototype chain for MessageView class to inherit from View
    MessageView.prototype = Object.create(View.prototype);
    MessageView.prototype.constructor = MessageView;

    // =================================================================================================================
    MessageView.DEFAULT_OPTIONS = {                                             // Default options for MessageView class
        animationDuration: 1200,
        avatarHeight: 50,
        avatarOffset: 10,
        avatarProperties: {
            border: '3px solid rgba(255, 255, 255, 0.33)',
            borderRadius: '999em'
        },
        avatarUrl: {
            prefix: 'http://www.gravatar.com/avatar/',
            postfix: '?s=200&d=identicon'
        },
        avatarWidth: 50,
        messageMinHeight: 70
    };

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createBaseSurface() {                                                      // Creates base message surface
        this.container = new ContainerSurface();

        this.containerModifier = new StateModifier();

        this.containerModifier.setSize([undefined, this.options.messageMinHeight]);

        this.container.pipe(this._eventOutput);
        this.add(this.containerModifier).add(this.container);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createAvatar() {                                                                      // Avatar generation
        var avatar = new ImageSurface({
            classes: ['no-selection'],
            size: [this.options.avatarHeight, this.options.avatarWidth],
            content: this.options.avatarUrl.prefix + this.message.content.user + this.options.avatarUrl.postfix,
            properties: this.options.avatarProperties
        });

        var avatarModifier = new StateModifier({
            transform: Transform.translate(this.options.avatarOffset, this.options.avatarOffset, 0.1)
        });

        avatar.pipe(this.container);
        this.container.add(avatarModifier).add(avatar);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createMessageBox() {                                                           // Creates main message box
        var _this = this;

        var messageBox = new Surface({
            size: [window.innerWidth - this.options.avatarOffset * 3 - this.options.avatarWidth, undefined],
            content: '<div class="text-surface">' + Base64.decode(this.message.content.message) + '</div>',
            properties: {
                margin: '8px 0 0 60px',
                background: 'rgba(255, 255, 255, 0.5)',
                lineHeight: '1.6em',
                borderRadius: '4px',
                fontSize: '14px',
            }
        });

        var messageBoxModifier = new StateModifier({
            opacity: 0,
            transform: Transform.translate(this.options.avatarOffset, this.options.avatarOffset, 0.1)
        });

        messageBox.pipe(this.container);
        this.container.add(messageBoxModifier).add(messageBox);

        Timer.setInterval(function(){
            var contentHeight           = messageBox._currTarget.firstChild.offsetHeight;
            var currentContainerSizes   = _this.container.getSize();
            var currentMessageBoxSizes  = messageBox.getSize();
            var containerHieght         = contentHeight + 8 + 10;
            currentMessageBoxSizes[1]   = currentMessageBoxSizes[1] ? currentMessageBoxSizes[1] : 0;

            if (containerHieght < _this.options.avatarHeight) {
                containerHieght = _this.options.avatarHeight
            }
            if (currentMessageBoxSizes[1] < contentHeight) {
                messageBox.setSize([currentMessageBoxSizes[0], contentHeight],
                    { duration: _this.options.animationDuration / 3 });
                _this.containerModifier.setSize([
                    currentContainerSizes[0],
                    containerHieght + _this.options.avatarOffset * 2],
                    { duration: _this.options.animationDuration / 3 }
                );
            }
            currentMessageBoxSizes  = messageBox.getSize();
            messageBoxModifier.setOpacity(1, { duration: _this.options.animationDuration / 3 });
        }, 1000)
    }

    // =================================================================================================================
    module.exports = MessageView;                                                                       // Module export
});
