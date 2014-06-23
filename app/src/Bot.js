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
            'email': 'Please, tell me your email for **Gravatar**. \
                We promice that it won\'t get furter than your device... we\'ll securely keep it encoded by **md5** \
                and use only that way! :3 \n\n To do this you need to send this type of message \
                `/me someone@neverchat.io`',
            // Error messages
            'wrongCommand': 'Your command is wrong! T_T Please check `/h` to see command examples...',
            'wrongEmail': ' is not valid email. Please, specify correct one! :3',
            'setUser': 'Hooray! Your new ID in system is: ',
            'getUser': 'Hey! I know you! Your are ',
            'noUser': 'I am not alowed to talk to strangers, please introduce yourself. \n\n To do this you need \
                to send this type of message `/me someone@neverchat.io`',
            // simple commands
            '/m': 'Meow!!! :3',
            '/h': 'I don\'t know how to help you yet...',
            '404': 'I don\'t know this command... purrr'
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
