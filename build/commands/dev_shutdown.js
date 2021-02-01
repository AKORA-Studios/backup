"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Shutdown',
    syntax: 'shutdown [force]',
    args: false,
    description: 'Initialises a shutdown uwu',
    module_type: 'developer',
    triggers: ['shutdown'],
    user_permissions: [],
    bot_permissions: []
}, (msg, args, bot) => {
    if (args[0] && args[0].toLowerCase().includes('force')) {
        smoothShutdown(msg, bot);
    }
    else {
        utilities_1.confirmAction(msg, 'Do you want to shutdown the bot?', () => {
            smoothShutdown(msg, bot);
        }, () => {
        });
    }
});
async function smoothShutdown(msg, bot) {
    if (bot.queue.length > 0) {
        var m = await msg.channel.send(utilities_1.rawEmb().setColor(utilities_1.colors.warning).setTitle('Waiting for queue').setFooter(`There are ${bot.queue.length} commands in the queue`));
        await Promise.all(bot.queue);
        await m.edit(utilities_1.rawEmb().setColor(utilities_1.colors.success).setDescription('Shutting down...'));
    }
    await msg.client.user.setPresence({
        activity: {
            name: 'suicide...',
            type: 'PLAYING'
        },
        status: 'dnd'
    }).then(() => {
        msg.client.destroy();
        process.exit(0);
    }).catch((e) => {
        process.exit(42);
    });
}
//# sourceMappingURL=dev_shutdown.js.map