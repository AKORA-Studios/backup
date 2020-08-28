import { newEmb, colors, confirmAction } from '../typescript/utilities';
import { Command } from "../typescript/classes";
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

    async (msg, args) => {
        if (args[0] && args[0].toLowerCase().includes('force')) {
            smoothShutdown(msg);
        } else {
            confirmAction(msg, 'Do you want to shutdown the bot?', () => {
                smoothShutdown(msg);
            }, () => {

            })
        }
    }
);

const smoothShutdown = (msg: Message) => {
    msg.client.user.setPresence({
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