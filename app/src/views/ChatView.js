/* globals define */
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');

    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');

    // Constructor function for our ChatView class
    function ChatView() {

        // Applies View's constructor function to ChatView class
        View.apply(this, arguments);

        _generateBackground.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
    }

    // Establishes prototype chain for ChatView class to inherit from View
    ChatView.prototype = Object.create(View.prototype);
    ChatView.prototype.constructor = ChatView;

    // Default options for ChatView class
    ChatView.DEFAULT_OPTIONS = {
        headerSize: 75,
        footerSize: 41,
        titleOptions: {
            fontSize: '24px',
            textAlign: 'center',
            color: 'white',
            letterSpacing: '1px',
            paddingTop: '26px'
        }
    };

    // Define your helper functions and prototype methods here
    // Use Trianglify to generate random background for application
    // TODO: change code to require Trianglify instead of appending it to HTML
    function _generateBackground() {
        var t = new Trianglify();
        var pattern = t.generate(document.body.clientWidth, document.body.clientHeight);

        this.backSurface = new ImageSurface({
            size: [undefined, undefined],
            content : pattern.dataUri,
            properties : {
                pointerEvents : 'none',
                opacity: 0.1
            }
        });

        this.add(this.backSurface);
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

    function _createHeader() {
        var backgroundSurface = new Surface({
            properties: {
                backgroundColor: 'rgba(150, 150, 150, 0.5)'
            }
        });

        var titleSurface = new Surface({
            size: [232, 75],
            content : 'neverchat.io',
            properties: this.options.titleOptions
        });

        var backgroundModifier = new StateModifier({
            transform : Transform.behind
        });

        var titleModifier = new StateModifier({
            origin: [0.5, 0.5],
            align : [0.5, 0.5]
        });

        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(titleModifier).add(titleSurface);
    }

    module.exports = ChatView;
});
