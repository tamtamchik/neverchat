/* globals define */
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var View               = require('famous/core/View');
    // var Surface         = require('famous/core/Surface');
    // var Transform       = require('famous/core/Transform');
    // var StateModifier   = require('famous/modifiers/StateModifier');

    // Constructor function for our MessageView class
    function MessageView() {
        // Applies View's constructor function to MessageView class
        View.apply(this, arguments);
    }

    // Establishes prototype chain for MessageView class to inherit from View
    MessageView.prototype = Object.create(View.prototype);
    MessageView.prototype.constructor = MessageView;

    // Default options for MessageView class
    MessageView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = MessageView;
});
