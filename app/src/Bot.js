/* jshint multistr: true */
/* globals define, md5, Base64 */
define(function(require, exports, module) {

    // =================================================================================================================
    function Bot() {                                                              // Constructor function for Bot class
        this.botUser = md5('bot@neverchat.io');

        // main bot messages
        this.messages = {
            // internal
            'welcome': 'Welcome, to **neverchat.io**!',
            'email': 'Please, tell me your email for **Gravatar**. We promice that it won\'t get furter than your device... we\'ll securely keep it encoded by **md5** and use only that way! :3 \n\n To do this you need to send this type of message `/me me@neverchat.io` just put your email. Purrr..',
            // Error messages
            'wrongCommand': 'Your command is wrong! T_T Please check `/h` to see command examples...',
            'wrongEmail': ' is not valid email. Please, specify correct one! :3',
            'setUser': 'Hooray! Nice to meet you :3 You can now connect to rooms by typing `/r general`',
            'setRoom': 'Room changed to: ',
            'noUser': 'I am not alowed to talk to strangers, please introduce yourself. \n\n To do this you need to send this type of message `/me someone@neverchat.io`',
            // simple commands
            '/m': 'Meow!!! :3',
            '/help': '**Commands** \n\n* to get ID in the system send `/me me@neverchat.io` (replace `me@neverchat.io` with your email) \n\n* to change room send `/r general` (replace `general` with any room you need) \n\n* to get available commands send `/help` \n\n&nbsp;\n\n**Markdown** \n\n* to make text *cursive* use `*emphasis*`\n\n* to make text **bold** use `**bold**`\n\n* to wrap text into \``code`\` use `` `code` ``, \n\nFull markdown can be found here: [http://daringfireball.net/projects/markdown/syntax](http://daringfireball.net/projects/markdown/syntax)',
            '404': 'I don\'t know this command... Purrr... Type `/help` to see all available commands, please.'
        };
    }

    // Establishes Bot constructor
    Bot.prototype.constructor = Bot;

    // =================================================================================================================
                                                                                                     // Methods section

    // -----------------------------------------------------------------------------------------------------------------
    Bot.prototype.getMessage = function getMessage(message, prefix, postfix) {              // Prepares correct message
        prefix      = typeof prefix !== 'undefined' ? prefix : '';
        postfix     = typeof postfix !== 'undefined' ? postfix : '';

        var text    = this.messages[message] ? this.messages[message] : this.messages[404];

        var result  = { with: [{
                thing: 'message',
                created: new Date(),
                internal: true,
                content: {
                    message: Base64.encode(prefix + text + postfix),
                    user: this.botUser
                }}]
        };
        return result;
    };

    // =================================================================================================================
    module.exports = Bot;                                                                              // Module export
});
