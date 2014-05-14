/* globals define */
define(function(require, exports, module) {

  function dweet() {
    var
      _thing = 'famous-dweet',
      _feedUrl = 'https://dweet.io:443/get/dweets/for/' + _thing + '?callback';

    return {
      getFeed: function() {
        JSONP(_feedUrl, function(res) {
          console.log(res);
        })
      }
    }
  }

  module.exports = dweet;
});
