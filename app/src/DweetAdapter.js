/* globals define, JSONP */
define(function(require, exports, module) {

    // =================================================================================================================
    function DweetAdapter(thingName) {                                    // Constructor function for DweetAdapter class
        this.thing = thingName;
        this.feedUrl = 'https://dweet.io:443/get/dweets/for/' + this.thing + '?callback';
        this.postUrl = 'https://dweet.io:443/dweet/for/' + this.thing;
    }
    DweetAdapter.prototype.constructor = DweetAdapter;

    // =================================================================================================================
                                                                                                      // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    DweetAdapter.prototype.getFeed = function(callback, scope) {                   // Load all messages feed from dweet channel
        JSONP(this.feedUrl, callback, scope);
    };

    // -----------------------------------------------------------------------------------------------------------------
    DweetAdapter.prototype.sendMessage = function(message, user, callback) {            // Send message to dweet channel
        var that = this;
        var params = {
            'message': message,
            'user': user
        };

        params = JSON.stringify(params);

        var r = new XMLHttpRequest();
        r.open('POST', this.postUrl, true);
        // FIXME: coses errors in Safari... need to check
        // r.setRequestHeader('Content-length', params.length);
        // r.setRequestHeader('Connection', 'close');
        r.setRequestHeader('Content-Type', 'application/json');
        r.onreadystatechange = function() {
            if (r.readyState !== 4 || r.status !== 200) {
                return;
            }
            that.getFeed(callback);
        };
        r.send(params);
    };

    // =================================================================================================================
    module.exports = DweetAdapter;                                                                      // Module export
});
