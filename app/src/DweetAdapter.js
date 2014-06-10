/* globals define, JSONP */
define(function(require, exports, module) {

    // =================================================================================================================
    function DweetAdapter(thingName) {                                    // Constructor function for DweetAdapter class
        this._thing = thingName;
        this._feedUrl = 'https://dweet.io:443/get/dweets/for/' + _thing + '?callback';
        this._postUrl = 'https://dweet.io:443/dweet/for/' + _thing;
    }
    DweetAdapter.prototype.constructor = DweetAdapter;

    // =================================================================================================================
                                                                                                      // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    DweetAdapter.prototype.getFeed = function(callback) {                   // Load all messages feed from dweet channel
        JSONP(_feedUrl, callback);
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
        r.open('POST', _postUrl, true);
        r.setRequestHeader('Content-length', params.length);
        r.setRequestHeader('Connection', 'close');
        r.setRequestHeader('Content-Type', 'application/json');
        r.onreadystatechange = function() {
            if (r.readyState !== 4 || r.status !== 200) { return; }
            that.getFeed(callback);
        };
        r.send(params);
    };

    // =================================================================================================================
    module.exports = DweetAdapter;                                                                      // Module export
});
