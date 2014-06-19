converter = new Showdown.converter();

/* globals define */
define(function(require) {
    'use strict';
    // =================================================================================================================
    var Engine      = require('famous/core/Engine');                                            // Require extra modules
    var AppView     = require('views/AppView');

    // =================================================================================================================
    var mainContext = Engine.createContext();                                              // Application initialization
    var appView     = new AppView();

    // =================================================================================================================
    mainContext.setPerspective(1000);                                            // Main context init and appView render
    mainContext.add(appView);
});
