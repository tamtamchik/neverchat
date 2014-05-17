/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine              = require('famous/core/Engine');
    var RenderNode          = require('famous/core/RenderNode');
    var Surface             = require('famous/core/Surface');

    var HeaderFooterLayout  = require('famous/views/HeaderFooterLayout');
    var ScrollView          = require('famous/views/ScrollView');

    var StateModifier       = require('famous/modifiers/StateModifier');

    var MessageBox          = require('MessageBox');

    var Dweet = require('dweet');

    // create the main context
    var mainContext = Engine.createContext();

    var layout;
    var scrollView;
    var messagesRaw = [];
    var messages = [];
    var latestMessageDate = new Date(-1);
    var dweets = new Dweet();
    var myid = Date() + Math.random();
    var input;

    createLayout();
    addHeader();
    addContent();
    addFooter();
    initialMessages();

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
        if (e.which == 13) {
          var msg = e.srcElement.value;
          dweets.sendMessage(msg,"yuri@progforce.com", loadMessages);
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

      dweets.getFeed(loadMessages);
      setInterval(function(){dweets.getFeed(loadMessages)}, 500 * 2);
    }

    function loadMessages(res) {
      if (res.this != 'failed') {
        console.log('Request success.')
        for (var item in res.with.reverse()) {
          var created = new Date(res.with[item].created);
          if (latestMessageDate < created) {
            var item = {
              loaded: false,
              item: res.with[item]
            }
            messagesRaw.push(item);
            latestMessageDate = created;
          }
        }
        for (var item in messagesRaw) {
          if (!messagesRaw[item].loaded) {
            renderMessage(messagesRaw[item].item);
            messagesRaw[item].loaded = true;
          }
        }
      } else {
        console.log('Request failed.')
      }
    }

    function renderMessage(msg) {
      // msg.content.message = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem, maxime, laborum delectus eum amet voluptatum tempora odit distinctio molestias numquam ipsum sunt harum vel modi aperiam mollitia facilis soluta ullam.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, quibusdam, atque, obcaecati, delectus neque aperiam rem placeat aspernatur optio inventore iusto enim totam facere molestiae modi impedit dolor itaque veniam.'
      var surface = new MessageBox({
        classes: ['message','message-wrapper'],
        content: '<img class="author" src="http://www.gravatar.com/avatar/' + md5(msg.content.user) +
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
