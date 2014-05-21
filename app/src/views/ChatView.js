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

        _setListeners.call(this);
    }

    // Establishes prototype chain for ChatView class to inherit from View
    ChatView.prototype = Object.create(View.prototype);
    ChatView.prototype.constructor = ChatView;

    // Default options for ChatView class
    ChatView.DEFAULT_OPTIONS = {
        headerSize: 64,
        footerSize: 41,
        titleWidth: 300,
        titleOffset: 22,
        animationDuration: 1200, // TODO: play with duration
        titleOptions: {
            fontSize: '24px',
            textAlign: 'center',
            color: 'white',
            letterSpacing: '1px',
            textShadow: '0px 1px 1px rgba(100,100,100,0.5)'
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
        .setOpacity(0, { duration: this.options.animationDuration / 3 })
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

    // Creates Chat Header & footer zone
    function _createHeader() {
        this.backgroundSurface = new Surface({
            properties: {
                backgroundColor: 'rgba(220, 220, 220, 0.5)'
            }
        });

        this.titleSurface = new Surface({
            size: [this.options.titleWidth, this.options.headerSize],
            content: 'neverchat.io',
            properties: this.options.titleOptions
        });

        this.backgroundModifier = new StateModifier({
            opacity: 0,
            transform: Transform.behind
        });

        this.titleModifier = new StateModifier({
            origin: [0.5, 0],
            opacity: 0
        });

        this.layout.header.add(this.backgroundModifier).add(this.backgroundSurface);
        this.layout.header.add(this.titleModifier).add(this.titleSurface);
    }

    // Show main GUI with effects
    function _showGUI() {
        this.backgroundModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.titleModifier.setTransform(
            Transform.translate(0, this.options.titleOffset, 0),
            { duration : this.options.animationDuration, curve: Easing.outElastic }
        );
        this.titleModifier.setOpacity(1, { duration: this.options.animationDuration });
    }

    function _setListeners() {
        // TODO: put listeners here
    }

    module.exports = ChatView;
});
