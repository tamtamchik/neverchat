/* globals define */
define(function(require, exports, module) {

    // =================================================================================================================
    var View            = require('famous/core/View');                                          // Require extra modules
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Easing          = require('famous/transitions/Easing');

    // =================================================================================================================
    function LoginView() {                                                   // Constructor function for LoginView class
        // Applies View's constructor function to LoginView class
        View.apply(this, arguments);

        // Calling functions
    }

    // Establishes prototype chain for LoginView class to inherit from View
    LoginView.prototype = Object.create(View.prototype);
    LoginView.prototype.constructor = LoginView;

    // =================================================================================================================
    LoginView.DEFAULT_OPTIONS = {                                                 // Default options for LoginView class
        animationDuration: 1200, // TODO: play with duration
        backgroundProperties: {
            backgroundColor: 'rgba(220, 220, 220, 0.5)'
        }
    };

    // =================================================================================================================
                                                                                                       // Layout section


    // =================================================================================================================
                                                                                                      // Methods section


    // =================================================================================================================
    module.exports = LoginView;                                                                    // Module export
});
