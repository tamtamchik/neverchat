/* globals define, Trianglify */
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');

    var Easing = require('famous/transitions/Easing');

    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var InputSurface    = require('famous/surfaces/InputSurface');

    var HeaderFooter    = require('famous/views/HeaderFooterLayout');

    // Constructor function for our ChatView class
    function ChatView() {

        // Applies View's constructor function to ChatView class
        View.apply(this, arguments);

        _generateBackground.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);

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
        titleOffset: 22,
        titleOptions: {
            fontSize: '24px',
            textAlign: 'center',
            color: 'white',
            letterSpacing: '1px',
            textShadow: '0px 1px 1px rgba(100,100,100,0.5)'
        },
        titleWidth: 300,
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
        // Header background
        this.headerBackgroundSurface = new Surface({
            properties: this.options.backgroundProperties
        });

        this.headerTitleSurface = new Surface({
            classes: ['title','no-selection'],
            size: [this.options.titleWidth, this.options.headerSize - this.options.titleOffset],
            content: 'neverchat<span>.io</span>',
            properties: this.options.titleOptions
        });

        this.headerBackgroundModifier = new StateModifier({
            opacity: 0,
            transform: Transform.behind
        });

        this.headerTitleModifier = new StateModifier({
            origin: [0.5, 0],
            opacity: 0
        });

        this.layout.header.add(this.headerBackgroundModifier).add(this.headerBackgroundSurface);
        this.layout.header.add(this.headerTitleModifier).add(this.headerTitleSurface);
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
            size: [this.options.sendButtonWidth-8, 32],
            origin: [0.5, 0.5],
            content: 'Send',
            properties: this.options.messageButtonOptions
        });

        this.footerBackgroundModifier = new StateModifier({
            opacity: 0,
            transform: Transform.behind
        });

        this.messageInputModifier = new StateModifier({
            origin: [0.5, 0.5],
            opacity: 0
        });

        this.messageButtonModifier = new StateModifier({
            origin: [0.5, 0.5],
            opacity: 0
        });

        this.layout.footer.add(this.footerBackgroundModifier).add(this.footerBackgroundSurface);
        this.layout.footer.add(layoutModifier).add(this.footerLayout);
        this.footerLayout.content.add(this.messageInputModifier).add(this.messageInput);
        this.footerLayout.footer.add(this.messageButtonModifier).add(this.messageButton);
    }

    // Show main GUI with effects
    function _showGUI() {

        // bounce title and make it wisible
        this.headerTitleModifier.setTransform(
            Transform.translate(0, this.options.titleOffset, 0),
            { duration : this.options.animationDuration * 2, curve: Easing.outElastic });

        // Make visible other surfaces
        this.headerTitleModifier.setOpacity(1, { duration: this.options.animationDuration });
        this.headerBackgroundModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.footerBackgroundModifier.setOpacity(1, { duration: this.options.animationDuration / 3 });
        this.messageInputModifier.setOpacity(1, { duration: this.options.animationDuration });
        this.messageButtonModifier.setOpacity(1, { duration: this.options.animationDuration });
    }

    function _setListeners() {
        // TODO: put listeners here
    }

    module.exports = ChatView;
});
