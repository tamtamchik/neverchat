/* globals define, Base64, md5 */
define(function(require) {
    'use strict';

    // import other dependencies
    require('js-base64');

    // import dependencies
    var Engine              = require('famous/core/Engine');
    var RenderNode          = require('famous/core/RenderNode');
    var Surface             = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');

    var HeaderFooterLayout  = require('famous/views/HeaderFooterLayout');
    var ScrollView          = require('famous/views/ScrollView');

    var StateModifier       = require('famous/modifiers/StateModifier');

    var MessageBox          = require('MessageBox');
    var Dweet               = require('DweetAdapter');

    // create the main context
    var mainContext = Engine.createContext();
    mainContext.setPerspective(1);

    var layout;
    var scrollView;
    var messagesRaw = [];
    var messages = [];
    var latestMessageDate = new Date(-1);
    var dweets;
    var email;
    var channel = 'neverchat_';
    var input;
    var loginSurface;
    var loginModifier;

    function _validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    function _calcTime(offset, seconds) {
      return Math.round(Math.abs(offset / seconds));
    }

    function _timeAgo(time, local) {
      if (!local) {
        local = Date.now();
      }
      if (typeof time !== 'number' || typeof local !== 'number') {
        return;
      }

      var offset = Math.abs((local - time)/1000);
      var span   = [];

      if (offset <= 60) {
        span = [ _calcTime(offset, 1), 'seconds' ];
      }
      else if (offset < (60 * 60)) {
        span = [ _calcTime(offset, 60), 'min' ];
      }
      else if (offset < (3600 * 24)) {
        span = [ _calcTime(offset, 3600), 'hr' ];
      }
      else if (offset < (86400 * 7)) {
        span = [ _calcTime(offset, 86400), 'day' ];
      }
      else if (offset < (604800 * 52)) {
        span = [ _calcTime(offset, 604800), 'week' ];
      }
      else if (offset < (31556926 * 10)) {
        span = [ _calcTime(offset, 31556926), 'year' ];
      }
      else {
        span = [ '', 'a long time' ];
      }

      span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
      span = span.join(' ');

      return (time <= local) ? span + ' ago' : 'in ' + span;
    }

    function _renderMessage(msg) {
      if (msg) {
        var surface = new MessageBox({
          classes: ['message','message-wrapper'],
          content: '<img class="author" src="http://www.gravatar.com/avatar/' + msg.content.user.toString() +
            '?s=200&d=identicon"><i class="fa fa-caret-left"></i><div class="item">' +
            '<span class="message-text">' + Base64.decode(msg.content.message) +
            '&nbsp;</span><span class="timeago" date=' + new Date(msg.created).getTime() + '><i class="fa fa-clock-o"></i> ' + _timeAgo(new Date(msg.created).getTime()) + '</span></div>',
          size: [undefined, 66]
        });
        surface.pipe(scrollView);
        messages.push(surface);
        scrollView.goToNextPage();
        scrollView.goToNextPage();
      }
    }

    function _updateDates() {
      var times = document.getElementsByClassName('timeago');
      for (var i = times.length - 1; i >= 0; i--) {
        times[i].innerHTML = '<i class="fa fa-clock-o"></i> ' +
          _timeAgo(parseInt(times[i].attributes.date.value, 0));
      }
    }

    function loadMessages(res) {
      var i;
      if (res && res.this !== 'failed') {
        for (i = res.with.length - 1; i >= 0; i--) {
          var created = new Date(res.with[i].created);
          if (latestMessageDate < created) {
            var it = {
              loaded: false,
              item: res.with[i]
            };
            messagesRaw.push(it);
            latestMessageDate = created;
          }
        }
        for (i = 0; i < messagesRaw.length; i++) {
          if (messagesRaw[i].loaded === false) {
            _renderMessage(messagesRaw[i].item);
            messagesRaw[i].loaded = true;
          }
        }
        _updateDates();
      }
    }

    function login() {
      var id = document.getElementById('main-input-email');
      var ch = document.getElementById('main-input-channel');
      if (id.value !== '' && _validateEmail(id.value)) {
        email = md5(id.value.toString());
        channel += md5(ch.value.toString());
        dweets = new Dweet(channel);
        dweets.getFeed(loadMessages);
        setInterval(function() {
          dweets.getFeed(loadMessages);
        }, 500 * 5);
        loginModifier.setTransform(
          Transform.translate(900000, 90000, 0),
          { duration : 0 }
        );
      }
      else {
        id.className = 'error';
      }
    }

    function enterEmail() {
      loginModifier = new StateModifier({
        origin: [1,0]
      });
      loginSurface = new Surface({
        classes: ['email-wrapper'],
        content: '<div class="email-container">' +
          '<div class="email-title">neverchat.io</div>' +
          '<input id="main-input-email" placeholder="enter email" type="text">' +
          '<input id="main-input-channel" placeholder="enter room (optional)" type="text">' +
          '<div id="main-input-save" class="button">Enter</div>' +
          '</div>'
      });
      loginSurface.on('keydown', function(e) {
        if (e.which === 13 && e.srcElement.value !== '') {
          login();
        }
      });
      loginSurface.on('click', function(e) {
        if (e.target.className === 'button') {
          login();
        }
      });
      mainContext.add(loginModifier).add(loginSurface);
    }

    function createLayout() {
      layout = new HeaderFooterLayout({
        headerSize: 75,
        footerSize: 41
      });

      mainContext.add(layout);
    }

    function addHeader() {
      layout.header.add(new Surface({
        content: '<div class="title">neverchat.io</div>',
        classes: ['header'],
        properties: {
          lineHeight: '50px',
          textAlign: 'center'
        }
      }));
    }

    function addContent() {
      scrollView = new ScrollView();
      layout.content.add(scrollView);
    }

    function addFooter() {
      /*jshint validthis:true */
      var that = this;
      input = new Surface({
        content: '<div class="main-input-wrapper">' +
          '<input id="main-input" placeholder="tap to write message" type="text"></div>',
        classes: ['footer']
      });
      input.on('keydown', function(e) {
        if (e.which === 13 && e.srcElement.value !== '') {
          var msg = e.srcElement.value;
          dweets.sendMessage(Base64.encode(msg), email, loadMessages.bind(that));
          e.srcElement.value = '';
        }
      });
      layout.footer.add(input);
    }

    function initialMessages() {
      var scrollModifier = new StateModifier({ size: [undefined, 60]});
      var scrollNode = new RenderNode(scrollModifier);
      scrollNode.add(scrollView);
      scrollView.sequenceFrom(messages);
    }

    createLayout();
    addHeader();
    addContent();
    addFooter();
    initialMessages();
    enterEmail();
});
