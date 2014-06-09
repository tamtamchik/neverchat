/* globals define, JSONP */
define(function(require, exports, module) {

  function DweetAdapter(thingName) {
    var _thing = thingName;
    var _feedUrl = 'https://dweet.io:443/get/dweets/for/' + _thing + '?callback';
    var _postUrl = 'https://dweet.io:443/dweet/for/' + _thing;

    return {
      getFeed: function(callback) {
        JSONP(_feedUrl, callback);
      },
      sendMessage: function(message, user, callback) {
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
          if (r.readyState !== 4 || r.status !== 200) {
            return;
          }
          that.getFeed(callback);
        };
        r.send(params);
      }
    };
  }

  module.exports = DweetAdapter;
});
