/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');

    // import the AppView class using require
    var AppView = require('views/AppView');
    var appView = new AppView();

    // create the main context
    var mainContext = Engine.createContext();
    mainContext.setPerspective(1);
    mainContext.add(appView);
});
