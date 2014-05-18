/* globals define, md5 */
define(function(require) {
    'use strict';
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
    var channel = 'famous-dweet';
    var input;
    var loginSurface;
    var loginModifier;

    createLayout();
    addHeader();
    addContent();
    addFooter();
    initialMessages();
    enterEmail();

    function _validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    function enterEmail(){
      loginModifier = new StateModifier({
        origin: [1,0]
      });
      loginSurface = new Surface({
        content: '<div class="email-container">' +
          '<div class="email-title">Welcome to Foreverchat!</div>' +
          '<input id="main-input-email" placeholder="enter email" type="text">' +
          '<input id="main-input-channel" placeholder="enter channel (optional)" type="text">' +
          '<input id="main-input-save" value="Save" type="button">' +
          '</div>',
        classes: ['email-wrapper'],
      });
      loginSurface.on('click', function(e){
        if (e.target.type === 'button') {
          var id = document.getElementById('main-input-email');
          var ch = document.getElementById('main-input-channel');
          if(id.value !== '' && _validateEmail(id.value)) {
            email = id.value;
            channel += ch.value;
            dweets = new Dweet(channel);
            dweets.getFeed(loadMessages);
            setInterval(function(){
              dweets.getFeed(loadMessages);}
            , 500 * 4);
            loginModifier.setTransform(
              Transform.translate(900000, 90000, 0),
              { duration : 0 }
            );
          } else {
            id.className = 'error';
          }
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
        content: '<div class="title">Foreverchat</div>',
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
      input = new Surface({
        content: '<div class="main-input-wrapper">' +
          '<input id="main-input" placeholder="tap to write message" type="text"></div>',
        classes: ['footer']
      });
      input.on('keydown', function(e) {
        if (e.which === 13 && e.srcElement.value !== '') {
          var msg = e.srcElement.value;
          dweets.sendMessage(msg, email, loadMessages);
          e.srcElement.value = "";
        }
      });
      layout.footer.add(input);
    }

    function initialMessages() {
      var scrollModifier = new StateModifier({ size: [undefined, 60]});
      var scrollNode = new RenderNode(scrollModifier);
      scrollNode.add(scrollView);

      scrollView.sequenceFrom(messages);

      // dweets.getFeed(loadMessages);
      // setInterval(function(){dweets.getFeed(loadMessages)}, 500 * 4);
    }

    function loadMessages(res) {
      if (res.this !== 'failed') {
        if (res.hasOwnProperty('with')) {
          for (var item in res.with.reverse()) {
            var created = new Date(res.with[item].created);
            if (latestMessageDate < created) {
              var it = {
                loaded: false,
                item: res.with[item]
              };
              messagesRaw.push(it);
              latestMessageDate = created;
            }
          }
        }

        for (var item in messagesRaw) {
          if (!messagesRaw[item].loaded) {
            renderMessage(messagesRaw[item].item);
            messagesRaw[item].loaded = true;
          }
        }
      }
    }

    function renderMessage(msg) {
      // msg.content.message = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem, maxime, laborum delectus eum amet voluptatum tempora odit distinctio molestias numquam ipsum sunt harum vel modi aperiam mollitia facilis soluta ullam.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, quibusdam, atque, obcaecati, delectus neque aperiam rem placeat aspernatur optio inventore iusto enim totam facere molestiae modi impedit dolor itaque veniam.'
      var surface = new MessageBox({
        classes: ['message','message-wrapper'],
        content: '<img class="author" src="http://www.gravatar.com/avatar/' + md5(msg.content.user.toString()) +
          '?s=200&d=identicon"><i class="fa fa-caret-left"></i><div class="item">' +
          '<span class="message-text">' + msg.content.message +
          '&nbsp;</span></div>' ,
        size: [undefined, 66]
      });
      surface.pipe(scrollView);
      messages.push(surface);
      scrollView.setPosition(20000);
    }
});
