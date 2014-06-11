/* globals define */
define(function(require, exports, module) {

    // =================================================================================================================
    var View            = require('famous/core/View');                                          // Require extra modules
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Easing          = require('famous/transitions/Easing');

    // =================================================================================================================
    function ChatHeaderView() {                                         // Constructor function for ChatHeaderView class
        // Applies View's constructor function to ChatHeaderView class
        View.apply(this, arguments);

        // Calling functions
        _createHeader.call(this);
    }

    // Establishes prototype chain for ChatHeaderView class to inherit from View
    ChatHeaderView.prototype = Object.create(View.prototype);
    ChatHeaderView.prototype.constructor = ChatHeaderView;

    // =================================================================================================================
    ChatHeaderView.DEFAULT_OPTIONS = {                                       // Default options for ChatHeaderView class
        animationDuration: 1200, // TODO: play with duration
        backgroundProperties: {
            backgroundColor: 'rgba(220, 220, 220, 0.5)'
        },
        headerSize: 64,
        titleOffset: 22,
        titleOptions: {
            fontSize: '24px',
            textAlign: 'center',
            color: 'white',
            letterSpacing: '1px',
            textShadow: '0px 1px 1px rgba(100,100,100,0.5)'
        },
        titleWidth: 300,
        baseZIndex: 1
    };

    // =================================================================================================================
                                                                                                       // Layout section

    // -----------------------------------------------------------------------------------------------------------------
    function _createHeader() {                                                            // Main header create function
        // Header background
        this.headerBackgroundSurface = new Surface({
            properties: this.options.backgroundProperties
        });

        // Title
        this.headerTitleSurface = new Surface({
            classes: ['title','no-selection'],
            size: [this.options.titleWidth, this.options.headerSize - this.options.titleOffset],
            content: 'neverchat<span>.io</span>',
            properties: this.options.titleOptions
        });

        this.headerBackgroundModifier = new StateModifier({
            transform: Transform.translate(0, 0, this.options.baseZIndex)
        });

        this.headerTitleModifier = new StateModifier({
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, this.options.baseZIndex + 1)
        });

        // Adding elements to the view
        this.add(this.headerBackgroundModifier).add(this.headerBackgroundSurface);
        this.add(this.headerTitleModifier).add(this.headerTitleSurface);
    }

    // =================================================================================================================
                                                                                                      // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    ChatHeaderView.prototype.bounceTitle = function() {                              // Initial bouncing title animation
        this.headerTitleModifier.setTransform(
            Transform.translate(0, this.options.titleOffset, this.options.baseZIndex + 1),
            { duration : this.options.animationDuration * 2, curve: Easing.outElastic });
    };

    // =================================================================================================================
    module.exports = ChatHeaderView;                                                                    // Module export
});
