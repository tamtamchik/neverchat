/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine              = require('famous/core/Engine');
    var RenderNode          = require('famous/core/RenderNode');

    var HeaderFooterLayout  = require('famous/views/HeaderFooterLayout');
    var ScrollView          = require('famous/views/ScrollView');

    var StateModifier       = require('famous/modifiers/StateModifier');

    var Dweet = require('dweet');

    // create the main context
    var mainContext = Engine.createContext();

    var d = new Dweet();

    d.getFeed();

});
