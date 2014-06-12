/* globals define, Base64 */
define(function(require, exports, module) {

    // =================================================================================================================
                            require('js-base64');                                               // Require extra modules
    var View                = require('famous/core/View');
    var Surface             = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');
    var StateModifier       = require('famous/modifiers/StateModifier');
    var ImageSurface        = require('famous/surfaces/ImageSurface');
    var ContainerSurface    = require('famous/surfaces/ContainerSurface');
    var Timer               = require('famous/utilities/Timer');
    var HeaderFooter        = require('famous/views/HeaderFooterLayout');

    // =================================================================================================================
    function MessageView(msg) {                                            // Constructor function for MessageView class
        var that            = this;
        this.message        = msg.data;
        this.createdTime    = new Date().getTime();

        // Applies View's constructor function to MessageView class
        View.apply(this, arguments);

        _createBaseSurface.call(this);
        _createAvatarSurface.call(this);
        _createMessageBoxSurface.call(this);
        _createTimeSurface.call(this);

        // Setup call of sizing function and time ago update
        Timer.setInterval(function() {
            if (that.messageBox._currTarget) {
                that.tickActions.call(that);
            }
        }, this.options.animationDuration / 10);
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
            postfix: '?s=200&d=identicon',
            prefix: 'http://www.gravatar.com/avatar/'
        },
        avatarWidth: 50,
        messageBoxProperties: {
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '300',
            lineHeight: '1.6em',
            margin: '8px 0 0 20px'
        },
        messageMinHeight: 70,
        newMessageDelay: 6000,
        timeAgoProperties: {
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 1)',
            textAlign: 'right',
            lineHeight: '16px',
            fontWeight: '400',
            paddingRight: '10px',
            created: null
        }
    };

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createBaseSurface() {                                                      // Creates base message surface
        this.container = new ContainerSurface();

        this.containerModifier = new StateModifier();

        this.containerModifier.setSize([undefined, this.options.messageMinHeight]);

        this.layout = new HeaderFooter({
            headerSize: this.options.messageMinHeight,
            footerSize: 20
        });

        this.layoutModifier = new StateModifier();

        this.container.add(this.layoutModifier).add(this.layout);
        this.container.pipe(this._eventOutput);
        this.add(this.containerModifier).add(this.container);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createAvatarSurface() {                                                               // Avatar generation
        this.avatar = new ImageSurface({
            classes: ['no-selection', 'avatar'],
            size: [this.options.avatarHeight, this.options.avatarWidth],
            content: this.options.avatarUrl.prefix + this.message.content.user + this.options.avatarUrl.postfix,
            properties: this.options.avatarProperties
        });

        this.avatarModifier = new StateModifier({
            opacity: 0,
            origin: [0, 0],
            transform: Transform.translate(this.options.avatarOffset, this.options.avatarOffset, 0.1)
        });

        this.avatar.pipe(this.container);
        this.layout.header.add(this.avatarModifier).add(this.avatar);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createMessageBoxSurface() {                                                    // Creates main message box
        this.messageBox = new Surface({
            classes: ['new'],
            size: [window.innerWidth - this.options.avatarOffset * 3 - this.options.avatarWidth, undefined],
            content: '<div class="text-surface">' + Base64.decode(this.message.content.message) + '</div>',
            properties: this.options.messageBoxProperties
        });

        this.messageBoxModifier = new StateModifier({
            opacity: 0,
            origin: [0.5, 0],
            transform: Transform.translate(this.options.avatarOffset, this.options.avatarOffset, 0.1)
        });

        this.messageBox.pipe(this.container);
        this.layout.header.add(this.messageBoxModifier).add(this.messageBox);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createTimeSurface() {                                                             // Creates time ago zone
        this.options.timeAgoProperties.created = new Date(this.message.created).getTime();

        this.timeAgo = new Surface({
            classes: ['no-selection', 'timeago'],
            content: '<i class="fa fa-clock-o"></i> ' + _timeAgo(new Date(this.message.created).getTime()) + '</span>',
            properties: this.options.timeAgoProperties
        });

        this.timeAgoModifier = new StateModifier({
            opacity: 0
        });

        this.timeAgo.pipe(this.container);
        this.layout.footer.add(this.timeAgoModifier).add(this.timeAgo);
    }

    // =================================================================================================================
                                                                                            // Private functions section
    // -----------------------------------------------------------------------------------------------------------------
    function _calcTime(offset, seconds) {                                                // Transforms offset to seconds
      return Math.round(Math.abs(offset / seconds));
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _getTimeParams(offset) {                                                 // Returns type offset as a string
        var span   = [];

        if (offset <= 60) {
            span = [ _calcTime(offset, 1), 'seconds' ];
        }
        else if (offset < (60 * 60)) {
            span = [ _calcTime(offset, 60), 'min' ];
        }
        else if (offset < (3600 * 24)) {
            span = [ _calcTime(offset, 3600), 'hr' ];
        }
        else if (offset < (86400 * 7)) {
            span = [ _calcTime(offset, 86400), 'day' ];
        }
        else if (offset < (604800 * 52)) {
            span = [ _calcTime(offset, 604800), 'week' ];
        }
        else if (offset < (31556926 * 10)) {
            span = [ _calcTime(offset, 31556926), 'year' ];
        }
        else {
            span = [ '', 'a long time' ];
        }

        return span;
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _timeAgo(time, local) {                                              // Returns time string in `ago` format
        if (!local) {
            local = Date.now();
        }
        if (typeof time !== 'number' || typeof local !== 'number') {
            return;
        }

        var offset = Math.abs((local - time)/1000);
        var span   = _getTimeParams(offset);

        span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
        span = span.join(' ');

        return (time <= local) ? span + ' ago' : 'in ' + span;
    }

    // =================================================================================================================
                                                                                                      // Methods section
    // -----------------------------------------------------------------------------------------------------------------
    MessageView.prototype.tickActions = function tickActions() {              // Message size adjust and time ago update
        // Remove highlight from new messages
        if (this.createdTime < new Date().getTime() - this.options.newMessageDelay) {
            this.messageBox.removeClass('new');
        }

        // Defining sizes
        var contentHeight           = this.messageBox._currTarget.firstChild.offsetHeight;
        var currentMessageBoxSizes  = this.messageBox.getSize();
        var currentContainerSizes   = this.container.getSize();
        var containerHieght         = contentHeight + 8 + 10;
        var newDate                 = _timeAgo(parseInt(this.timeAgo.properties.created, 0));

        // checking null size and converting it to 0
        currentMessageBoxSizes[1]   = currentMessageBoxSizes[1] ? currentMessageBoxSizes[1] : 0;

        // Checking the most relevant size
        if (containerHieght < this.options.avatarHeight) {
            containerHieght = this.options.avatarHeight;
        }
        if (currentMessageBoxSizes[1] < contentHeight) {
            // Change size animation
            this.messageBox.setSize([currentMessageBoxSizes[0], contentHeight],
                { duration: this.options.animationDuration / 3 });
            this.containerModifier.setSize([
                currentContainerSizes[0],
                containerHieght + this.options.avatarOffset * 2],
                { duration: this.options.animationDuration / 3 }
            );
        }

        this.timeAgo.setContent('<i class="fa fa-clock-o"></i> ' + newDate);
        // Showing message baloon
        this.messageBoxModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.avatarModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.timeAgoModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
    };

    // =================================================================================================================
    module.exports = MessageView;                                                                       // Module export
});
