const { TeamsActivityHandler } = require('botbuilder');

class MyBot extends TeamsActivityHandler {
    handleTeamsMessagingExtensionFetchTask(context, action) {
        const taskInfo = {
            title: "Angular App",
            height: 500,
            width: 500,
            url: "https://copilot-bot.lab.bravishma.com/task-module",
            fallbackUrl: "https://copilot-bot.lab.bravishma.com/task-module"
        };
        return {
            task: {
                type: 'continue',
                value: taskInfo
            }
        };
    }
}

module.exports.MyBot = MyBot;
