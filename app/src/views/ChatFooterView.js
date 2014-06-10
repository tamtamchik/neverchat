/* globals define */
define(function(require, exports, module) {

    // =================================================================================================================
    var View            = require('famous/core/View');                                          // Require extra modules
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var InputSurface    = require('famous/surfaces/InputSurface');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');

    // =================================================================================================================
    function ChatFooterView() {                                         // Constructor function for ChatFooterView class
        // Applies View's constructor function to ChatFooterView class
        View.apply(this, arguments);

        // Calling functions
        _createFooter.call(this);
        _createInputs.call(this);
    }

    // Establishes prototype chain for ChatFooterView class to inherit from View
    ChatFooterView.prototype = Object.create(View.prototype);
    ChatFooterView.prototype.constructor = ChatFooterView;

    // =================================================================================================================
    ChatFooterView.DEFAULT_OPTIONS = {                                       // Default options for ChatFooterView class
        animationDuration: 1200, // TODO: play with duration
        backgroundProperties: {
            backgroundColor: 'rgba(220, 220, 220, 0.5)'
        },
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

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createFooter() {                                                            // Main footer create function
        // Background
        this.footerBackgroundSurface = new Surface({
            properties: this.options.backgroundProperties
        });

        // 2 columns layout
        this.footerLayout = new HeaderFooter({
            headerSize: 4,
            footerSize: this.options.sendButtonWidth,
            direction: 0
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.footerBackgroundModifier = new StateModifier({
            transform: Transform.behind
        });

        // Adding elements to the view
        this.add(this.footerBackgroundModifier).add(this.footerBackgroundSurface);
        this.add(layoutModifier).add(this.footerLayout);
    }

    // -----------------------------------------------------------------------------------------------------------------
    function _createInputs() {                                                          // Creates input items in footer
        // Text input
        this.messageInput = new InputSurface({
            size: [undefined, 32],
            origin: [0.5, 0.5],
            name: 'messageInput',
            placeholder: 'Type message here',
            value: '',
            type: 'text',
            properties: this.options.messageInputOptions
        });

        // Send button
        this.messageButton = new Surface({
            classes: ['no-selection'],
            size: [this.options.sendButtonWidth-8, 32],
            origin: [0.5, 0.5],
            content: 'Send',
            properties: this.options.messageButtonOptions
        });

        this.messageInputModifier = new StateModifier({
            origin: [0.5, 0.5]
        });

        this.messageButtonModifier = new StateModifier({
            origin: [0.5, 0.5]
        });

        // Adding elements to the view
        this.footerLayout.content.add(this.messageInputModifier).add(this.messageInput);
        this.footerLayout.footer.add(this.messageButtonModifier).add(this.messageButton);
    }

    // =================================================================================================================
    module.exports = ChatFooterView;                                                                    // Module export
});
