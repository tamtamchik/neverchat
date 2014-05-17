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
        footerSize: 40
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
        content: '<div class="main-input-wrapper"><input id="main-input" type="text"></div>',
        classes: ['footer']
      });
      input.on('keydown', function(e) {
        if (e.which == 13) {
          dweets.getFeed(loadMessages);
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
      setInterval(function(){dweets.getFeed(loadMessages)},500 * 100);
    }

    function loadMessages(res) {
      if (res.this != 'failed') {
        console.log('Request success.')
        for (var item in res.with.reverse()) {
          var created = new Date(res.with[item].created);
          if (latestMessageDate < created) {
            messagesRaw.push(res.with[item]);
            latestMessageDate = created;
            renderMessage(res.with[item]);
          }
        }
      } else {
        console.log('Request failed.')
      }
    }

//     identicon: a geometric pattern based on an email hash
// monsterid: a generated 'monster' with different colors, faces, etc
// wavatar: generated faces with differing features and backgrounds
// retro: awesome generated, 8-bit arcade-style pixelated faces
// blank: a transparent PNG image (border added to HTML below for demonstration purposes)


    function renderMessage(msg) {
      msg.content.message = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem, maxime, laborum delectus eum amet voluptatum tempora odit distinctio molestias numquam ipsum sunt harum vel modi aperiam mollitia facilis soluta ullam.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, quibusdam, atque, obcaecati, delectus neque aperiam rem placeat aspernatur optio inventore iusto enim totam facere molestiae modi impedit dolor itaque veniam.'
      var surface = new MessageBox({
        classes: ['message'],
        content: '<img class="author" src="http://www.gravatar.com/avatar/' + md5(msg.content.user) +
          '?s=200&d=identicon"><i class="fa fa-caret-left"></i><div class="item">' +
          '<span class="message-text">' + msg.content.message +
          '</span></div>' ,
        size: [undefined, 60]
      });
      surface.pipe(scrollView);
      messages.push(surface);
    }

});
