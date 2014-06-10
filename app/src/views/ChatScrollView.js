/* globals define */
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var ScrollView         = require('famous/views/Scrollview');
    // var Surface         = require('famous/core/Surface');
    // var Transform       = require('famous/core/Transform');
    // var StateModifier   = require('famous/modifiers/StateModifier');

    // Constructor function for our CustomScrollView class
    function CustomScrollView() {
        // Applies View's constructor function to CustomScrollView class
        ScrollView.apply(this, arguments);
    }

    // Establishes prototype chain for CustomScrollView class to inherit from ScrollView
    CustomScrollView.prototype = Object.create(ScrollView.prototype);
    CustomScrollView.prototype.constructor = CustomScrollView;

    // Default options for CustomScrollView class
    CustomScrollView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = CustomScrollView;
});
