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
                and use only that way! :3  ',
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
    Bot.prototype.getMessage = function getMessage(message) {                               // Prepares correct message
        var text = this.messages[message] ? this.messages[message] : this.messages[404];
        var result = { with: [{
                thing: 'message',
                created: new Date(),
                content: {
                    message: Base64.encode(text),
                    user: this.botUser
                }}]
        };
        return result;
    };

    // =================================================================================================================
    module.exports = Bot;                                                                              // Module export
});
