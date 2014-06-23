/* globals define */
define(function(require, exports, module) {

    // =================================================================================================================
    // var base64           = require('js-base64');                                            // Require extra modules
    var View                = require('famous/core/View');
    // var Surface          = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');
    var RenderNode          = require('famous/core/RenderNode');
    var StateModifier       = require('famous/modifiers/StateModifier');
    // var ImageSurface        = require('famous/surfaces/ImageSurface');
    var ContainerSurface    = require('famous/surfaces/ContainerSurface');
    var HeaderFooter        = require('famous/views/HeaderFooterLayout');
    // var Timer               = require('famous/utilities/Timer');

    // Custom modules
    var ChatHeaderView      = require('views/ChatHeaderView');
    var ChatFooterView      = require('views/ChatFooterView');
    var ScrollView          = require('views/ChatScrollView');
    var MessageView         = require('views/MessageView');

    // =================================================================================================================
    function ChatView() {                                                    // Constructor function for ChatView class

        // Defining vars
        this.messages = [];
        this.messagesRaw = [];
        this.latestMessageDate = new Date(-1);
        this.currentPage = 0;

        // Applies View's constructor function to ChatView class
        View.apply(this, arguments);

        // Calling functions
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
        _createContent.call(this);
        _showGUI.call(this);

        _setListeners.call(this);
    }

    // Establishes prototype chain for ChatView class to inherit from View
    ChatView.prototype = Object.create(View.prototype);
    ChatView.prototype.constructor = ChatView;

    // =================================================================================================================
    ChatView.DEFAULT_OPTIONS = {                                                  // Default options for ChatView class
        animationDuration: 1200, // TODO: play with duration
        footerSize: 42,
        headerSize: 64
    };

    // =================================================================================================================
                                                                                                      // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createLayout() {                                                    // Creates inital HeaderFooter layout
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
    function _createHeader() {                                                    // Creates Chat Header & Footer zones
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

        this.chatFooterView.pipe(this._eventOutput);

        this.layout.footer.add(this.chatFooterModifier).add(this.chatFooterView);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createContent() {                                                              // Creates base ScrollView

        this.scrollContainer = new ContainerSurface();
        this.scrollView = new ScrollView();

        this.scrollContainerModifier = new StateModifier();
        this.scrollViewModifier = new StateModifier();

        this.scrollContainer.add(this.scrollViewModifier).add(this.scrollView);
        this.layout.content.add(this.scrollContainerModifier).add(this.scrollContainer);

        this.scrollNode = new RenderNode(this.scrollViewModifier);
        this.scrollNode.add(this.scrollView);
        this.scrollView.sequenceFrom(this.messages);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _showGUI() {                                                                   // GUI appearence animation
        // Make visible other surfaces
        this.chatHeaderModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.chatFooterModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });

        // bounce title and make it wisible
        this.chatHeaderView.bounceTitle();
    }

    function _changePage(change) {
        this.currentPage += change.direction;
    }

    // =================================================================================================================
                                                                                                      // Events section

    // -----------------------------------------------------------------------------------------------------------------
    function _setListeners() {                                                                         // Set listeners
        // TODO: put listeners here
        this.scrollView.on('pageChange', _changePage.bind(this));
    }

    // =================================================================================================================
                                                                                                     // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    ChatView.prototype.loadMessages = function loadMessages(res) {       // Load messages via dweet adapter as callback
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
    ChatView.prototype.renderMessage = function renderMessage(msg) {                           // Render single message
      if (msg) {
        var surface = new MessageView({
            data: msg
        });

        surface.pipe(this.scrollView);
        this.messages.push(surface);
        surface.showMessage();
      }
    };

    // =================================================================================================================
    module.exports = ChatView;                                                                         // Module export
});
