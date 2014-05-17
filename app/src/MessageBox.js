define(function(require, exports, module) {
    var Surface           = require('famous/core/Surface');
    var EventHandler      = require('famous/core/EventHandler');

    function MessageBox(options) {
        Surface.apply(this, arguments);
        this._superDeploy = Surface.prototype.deploy;
    }

    MessageBox.prototype = Object.create(Surface.prototype);

    MessageBox.prototype.constructor = MessageBox;

    MessageBox.prototype.deploy = function deploy(target) {
        this._superDeploy(target);
        // Fix for dynamic height
        var correctHeight = target.getElementsByClassName('item')[0].offsetHeight;
        var currentSize = this.getSize();
        currentSize[1] = correctHeight + 20;
        this.setSize(currentSize);
    };
    module.exports = MessageBox;
});
