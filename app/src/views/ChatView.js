/* globals define, Trianglify, Base64, md5 */
define(function(require, exports, module) {

    // import other dependencies
    require('js-base64');

    // Import additional modules to be used in this view
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var RenderNode      = require('famous/core/RenderNode');

    var StateModifier   = require('famous/modifiers/StateModifier');

    var Easing          = require('famous/transitions/Easing');

    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var InputSurface    = require('famous/surfaces/InputSurface');

    var HeaderFooter    = require('famous/views/HeaderFooterLayout');

    var ChatHeaderView  = require('views/ChatHeaderView');
    var ScrollView      = require('views/CustomScrollView');

    // Constructor function for our ChatView class
    function ChatView() {

        this.messages = [];
        this.messagesRaw = [];
        this.latestMessageDate = new Date(-1);


        // Applies View's constructor function to ChatView class
        View.apply(this, arguments);

        _generateBackground.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
        _createFooterInputs.call(this);
        _createContent.call(this);

        _setListeners.call(this);
    }

    // Establishes prototype chain for ChatView class to inherit from View
    ChatView.prototype = Object.create(View.prototype);
    ChatView.prototype.constructor = ChatView;

    // Default options for ChatView class
    ChatView.DEFAULT_OPTIONS = {
        animationDuration: 1200, // TODO: play with duration
        backgroundProperties: {
            backgroundColor: 'rgba(220, 220, 220, 0.5)'
        },
        footerSize: 42,
        headerSize: 64,
        messageButtonOptions: {
            height: '26px',
            lineHeight: '26px',
            border: '2px solid transparent',
            background: 'transparent',
            textAlign: 'center',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 1)',
            boxShadow: 'none',
            fontWeight: '600',
            textShadow: '0px 1px 1px rgba(100,100,100,0.5)'
        },
        messageInputOptions: {
            height: '26px',
            padding: '1px 5px',
            lineHeight: '26px',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            background: 'transparent',
            borderRadius: '5px',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 1)',
            boxShadow: 'none',
            textShadow: '0px 1px 1px rgba(100,100,100,0.5)'
        },
        sendButtonWidth: 60
    };

    // Define your helper functions and prototype methods here
    // Use Trianglify to generate random background for application
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
        .setOpacity(1, { duration: this.options.animationDuration / 3 }, _showGUI.bind(this));
    }

    // Creates inital HeaderFooter layout
    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize,
            footerSize: this.options.footerSize
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(layoutModifier).add(this.layout);
    }

    // Creates Chat Header & Footer zones
    function _createHeader() {
        this.chatHeaderView = new ChatHeaderView();

        this.chatHeaderModifier = new StateModifier({
            opacity: 0
        });

        this.layout.header.add(this.chatHeaderModifier).add(this.chatHeaderView);
    }

    function _createFooter() {
        this.footerBackgroundSurface = new Surface({
            properties: this.options.backgroundProperties
        });

        this.footerLayout = new HeaderFooter({
            headerSize: 4,
            footerSize: this.options.sendButtonWidth,
            direction: 0
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.footerBackgroundModifier = new StateModifier({
            opacity: 0,
            transform: Transform.behind
        });

        this.layout.footer.add(this.footerBackgroundModifier).add(this.footerBackgroundSurface);
        this.layout.footer.add(layoutModifier).add(this.footerLayout);
    }

    function _createFooterInputs() {
        this.messageInput = new InputSurface({
            size: [undefined, 32],
            origin: [0.5, 0.5],
            name: 'messageInput',
            placeholder: 'Type message here',
            value: '',
            type: 'text',
            properties: this.options.messageInputOptions
        });

        this.messageButton = new Surface({
            classes: ['no-selection'],
            size: [this.options.sendButtonWidth-8, 32],
            origin: [0.5, 0.5],
            content: 'Send',
            properties: this.options.messageButtonOptions
        });

        this.messageInputModifier = new StateModifier({
            origin: [0.5, 0.5],
            opacity: 0
        });

        this.messageButtonModifier = new StateModifier({
            origin: [0.5, 0.5],
            opacity: 0
        });

        this.footerLayout.content.add(this.messageInputModifier).add(this.messageInput);
        this.footerLayout.footer.add(this.messageButtonModifier).add(this.messageButton);
    }

    // Show main GUI with effects
    function _showGUI() {
        // Make visible other surfaces
        this.chatHeaderModifier.setOpacity(1, { duration: this.options.animationDuration });
        this.footerBackgroundModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.messageInputModifier.setOpacity(1, { duration: this.options.animationDuration });
        this.messageButtonModifier.setOpacity(1, { duration: this.options.animationDuration });

        // bounce title and make it wisible
        this.chatHeaderView.bounceTitle();
    }

    function _setListeners() {
        // TODO: put listeners here
    }

    // Create base ScrollView
    function _createContent() {
        this.scrollView = new ScrollView();
        this.layout.content.add(this.scrollView);

        this.scrollModifier = new StateModifier({
            size: [undefined, 66]}
        );

        this.scrollNode = new RenderNode(this.scrollModifier);
        this.scrollNode.add(this.scrollView);
        this.scrollView.sequenceFrom(this.messages);
    }

    ChatView.prototype.loadMessages = function(res) {
        var i;
        if (res && res.this !== 'failed') {
            for (i = res.with.length - 1; i >= 0; i--) {
                var created = new Date(res.with[i].created);
                if (this.latestMessageDate < created) {
                    var it = {
                        loaded: false,
                        item: res.with[i]
                    };
                    this.messagesRaw.push(it);
                    this.latestMessageDate = created;
                }
            }
            for (i = 0; i < this.messagesRaw.length; i++) {
              if (this.messagesRaw[i].loaded === false) {
                this.renderMessage(this.messagesRaw[i].item);
                this.messagesRaw[i].loaded = true;
              }
            }
        }
    };

    ChatView.prototype.renderMessage = function(msg) {
      if (msg) {
        var surface = new MessageBox({
          classes: ['message','message-wrapper'],
          content: '<img class="author" src="http://www.gravatar.com/avatar/' + msg.content.user.toString() +
            '?s=200&d=identicon"><i class="fa fa-caret-left"></i><div class="item">' +
            '<span class="message-text">' + Base64.decode(msg.content.message) +
            '&nbsp;</span><span class="timeago" date=' + new Date(msg.created).getTime() + '>' +
            '<i class="fa fa-clock-o"></i> ' + _timeAgo(new Date(msg.created).getTime()) + '</span></div>',
          size: [undefined, 66]
        });
        surface.pipe(this.scrollView);
        this.messages.push(surface);
        this.scrollView.goToNextPage();
        this.scrollView.goToNextPage();
      }
    };

    module.exports = ChatView;
});
