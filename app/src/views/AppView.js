/* globals define */
define(function(require, exports, module) {
    var View          = require('famous/core/View');
    // var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var ChatView      = require('views/ChatView');

    function AppView() {
        View.apply(this, arguments);

        _createChat.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    function _createChat() {
        this.chatView = new ChatView();

        this.chatViewModifier = new StateModifier({
            transform: Transform.translate(0, 0)
        });

        this.add(this.chatViewModifier).add(this.chatView);
    }

    module.exports = AppView;
});
