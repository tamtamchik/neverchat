/* globals define */
define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function AppView() {
        View.apply(this, arguments);

        _generateBackground.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    // Use Trianglify to generate random background for application
    // TODO: change code to require Trianglify instead of appending it to HTML
    function _generateBackground() {
        var t = new Trianglify();
        var pattern = t.generate(document.body.clientWidth, document.body.clientHeight);
        document.body.setAttribute('style', 'background-image: '+pattern.dataUrl);
    }

    module.exports = AppView;
});
