import { newEmb, colors, confirmAction, rawEmb } from '../typescript/utilities';
import { Bot, Command } from "../typescript/classes";
import { Message } from 'discord.js';


module.exports = new Command({
    name: 'Shutdown',
    syntax: 'shutdown [force]',
    args: false,
    description: 'Initialises a shutdown uwu',
    module_type: 'developer',
    triggers: ['shutdown'],
    user_permissions: [],
    bot_permissions: []
},

    (msg, args, bot) => {
        if (args[0] && args[0].toLowerCase().includes('force')) {
            smoothShutdown(msg, bot);
        } else {
            confirmAction(msg, 'Do you want to shutdown the bot?', () => {
                smoothShutdown(msg, bot);
            }, () => {

            })
        }
    }
);

async function smoothShutdown(msg: Message, bot: Bot) {
    if (bot.queue.length > 0) {
        var m = await msg.channel.send(rawEmb().setColor(colors.warning).setTitle('Waiting for queue').setFooter(`There are ${bot.queue.length} commands in the queue`));
        await Promise.all(bot.queue);
        await m.edit(rawEmb().setColor(colors.success).setDescription('Shutting down...'));
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