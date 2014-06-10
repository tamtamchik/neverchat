/* globals define, Trianglify, Base64, md5 */
define(function(require, exports, module) {

    // =================================================================================================================
    require('js-base64');                                                                       // Require extra modules

    // Import additional modules to be used in this view
    var View            = require('famous/core/View');
    // var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var RenderNode      = require('famous/core/RenderNode');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');

    var ChatHeaderView  = require('views/ChatHeaderView');
    var ChatFooterView  = require('views/ChatFooterView');
    var ScrollView      = require('views/ChatScrollView');
    var MessageView     = require('views/MessageView');

    // =================================================================================================================
    function ChatView() {                                                 // Constructor function for our ChatView class

        this.messages = [];
        this.messagesRaw = [];
        this.latestMessageDate = new Date(-1);

        // Applies View's constructor function to ChatView class
        View.apply(this, arguments);

        _generateBackground.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
        _createContent.call(this);

        _setListeners.call(this);
    }

    // Establishes prototype chain for ChatView class to inherit from View
    ChatView.prototype = Object.create(View.prototype);
    ChatView.prototype.constructor = ChatView;

    // =================================================================================================================
    ChatView.DEFAULT_OPTIONS = {                                                   // Default options for ChatView class
        animationDuration: 1200, // TODO: play with duration
        footerSize: 42,
        headerSize: 64
    };

    // Define your helper functions and prototype methods here

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    // Use Trianglify to generate random background for application                             // Background generation
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

    // -----------------------------------------------------------------------------------------------------------------
    function _createLayout() {                                                     // Creates inital HeaderFooter layout
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize,
            footerSize: this.options.footerSize
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(layoutModifier).add(this.layout);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createHeader() {                                                     // Creates Chat Header & Footer zones
        this.chatHeaderView = new ChatHeaderView();

        this.chatHeaderModifier = new StateModifier({
            opacity: 0
        });

        this.layout.header.add(this.chatHeaderModifier).add(this.chatHeaderView);
    }

    function _createFooter() {
        this.chatFooterView = new ChatFooterView();

        this.chatFooterModifier = new StateModifier({
            opacity: 0
        });

        this.layout.footer.add(this.chatFooterModifier).add(this.chatFooterView);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createContent() {                                                                // Create base ScrollView
        this.scrollView = new ScrollView();
        this.layout.content.add(this.scrollView);

        this.scrollModifier = new StateModifier({
            size: [undefined, 66]}
        );

        this.scrollNode = new RenderNode(this.scrollModifier);
        this.scrollNode.add(this.scrollView);
        this.scrollView.sequenceFrom(this.messages);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _showGUI() {                                                                    // GUI appearence animation
        // Make visible other surfaces
        this.chatHeaderModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.chatFooterModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });

        // bounce title and make it wisible
        this.chatHeaderView.bounceTitle();
    }

    // =================================================================================================================
                                                                                                       // Events section

    // -----------------------------------------------------------------------------------------------------------------
    function _setListeners() {                                                                          // Set listeners
        // TODO: put listeners here
        this.on('resize',_generateBackground.bind(this));
    }

    // =================================================================================================================
                                                                                                      // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    ChatView.prototype.loadMessages = function(res) {                                                   // Load messages
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

    // -----------------------------------------------------------------------------------------------------------------
    ChatView.prototype.renderMessage = function(msg) {                                                 // Render message
      if (msg) {
        var surface = new MessageView({
            data: msg
        });

        surface.pipe(this.scrollView);
        this.messages.push(surface);
      }
    };

    // =================================================================================================================
    module.exports = ChatView;                                                                          // Module export
});
