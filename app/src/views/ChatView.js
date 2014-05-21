/* globals define, Trianglify */
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');

    var Easing = require('famous/transitions/Easing');

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
        titleWidth: 300,
        titleOptions: {
            fontSize: '24px',
            textAlign: 'center',
            color: 'white',
            letterSpacing: '1px'
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
            content: pattern.dataUri
        });

        var backModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            opacity: 0
        });

        this.add(backModifier).add(this.backSurface);

        backModifier
        .setOpacity(0, { duration: 500 })
        .setOpacity(1, { duration: 500 }, _bounceTitle.bind(this));
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

    // Creates Chat Header zone
    function _createHeader() {
        var backgroundSurface = new Surface({
            properties: {
                backgroundColor: 'rgba(150, 150, 150, 0.5)'
            }
        });

        var titleSurface = new Surface({
            size: [this.options.titleWidth, this.options.headerSize],
            content: 'neverchat.io',
            properties: this.options.titleOptions
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.behind
        });

        this.titleModifier = new StateModifier({
            origin: [0.5, 0],
            opacity: 0
        });

        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(this.titleModifier).add(titleSurface);
    }

    function _bounceTitle() {
        this.titleModifier.setTransform(
            Transform.translate(0, 26, 0),
            { duration : 2500, curve: Easing.outElastic }
        );
        this.titleModifier.setOpacity(1, { duration: 2500 });
    }

    module.exports = ChatView;
});
