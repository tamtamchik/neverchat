/* globals define */
define(function(require, exports, module) {

  function dweet() {
    var
      _thing = 'famous-dweet',
      _feedUrl = 'https://dweet.io:443/get/dweets/for/' + _thing + '?callback',
      _postUrl = 'https://dweet.io:443/dweet/for/' + _thing;

    return {
      getFeed: function(callback) {
        JSONP(_feedUrl, callback)
      },
      sendMessage: function(message, user, uid, callback) {
        var r = new XMLHttpRequest();
        r.open('POST', _postUrl, true);
        r.onreadystatechange = function () {
          if (r.readyState != 4 || r.status != 200) return;
          callback();
        };
        r.send('message=' + message + '&user=' + user + '&uid=' + uid);
      }
    }
  }

  module.exports = dweet;
});
