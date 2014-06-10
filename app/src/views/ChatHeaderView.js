/* globals define */
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');

    var StateModifier   = require('famous/modifiers/StateModifier');

    var Easing          = require('famous/transitions/Easing');

    // Constructor function for our ChatHeaderView class
    function ChatHeaderView() {

        // Applies View's constructor function to ChatHeaderView class
        View.apply(this, arguments);

        _createHeader.call(this);
    }

    // Establishes prototype chain for ChatHeaderView class to inherit from View
    ChatHeaderView.prototype = Object.create(View.prototype);
    ChatHeaderView.prototype.constructor = ChatHeaderView;

    // Default options for ChatHeaderView class
    ChatHeaderView.DEFAULT_OPTIONS = {
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
        titleWidth: 300
    };

    // Define your helper functions and prototype methods here
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
            transform: Transform.behind
        });

        this.headerTitleModifier = new StateModifier({
            origin: [0.5, 0],
        });

        this.add(this.headerBackgroundModifier).add(this.headerBackgroundSurface);
        this.add(this.headerTitleModifier).add(this.headerTitleSurface);
    }

    ChatHeaderView.prototype.bounceTitle = function() {
        this.headerTitleModifier.setTransform(
            Transform.translate(0, this.options.titleOffset, 0),
            { duration : this.options.animationDuration * 2, curve: Easing.outElastic });
    }

    module.exports = ChatHeaderView;
});
