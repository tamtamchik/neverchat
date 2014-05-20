/* globals define */
define(function(require, exports, module) {
    var Surface           = require('famous/core/Surface');

    function MessageBox() {
        this.messageHeight = 0;
        Surface.apply(this, arguments);
        this._superDeploy = Surface.prototype.deploy;
    }

    MessageBox.prototype = Object.create(Surface.prototype);

    MessageBox.prototype.constructor = MessageBox;

    MessageBox.prototype.deploy = function deploy(target) {
        this._superDeploy(target);
        // Fix for dynamic height
        var correctHeight = target.getElementsByClassName('item')[0].offsetHeight  + 20;
        var currentSize = this.getSize();
        if (currentSize[1] < correctHeight) {
            currentSize[1] = correctHeight;
        }
        this.messageHeight = currentSize[1];
        target.classList.add('new-message');

        setTimeout(function(){
            target.classList.remove('new-message');
        },5000)
    };
    module.exports = MessageBox;
});
