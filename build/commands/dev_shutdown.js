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
    triggers: ['shutdown', 'kill'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
}, async (msg, args) => {
    if (args[0] && args[0].toLowerCase().includes('force')) {
        smoothShutdown(msg);
    }
    else {
        utilities_1.confirmAction(msg, 'Do you want to shutdown the bot?', () => {
            smoothShutdown(msg);
        }, () => {
        });
    }
});
const smoothShutdown = (msg) => {
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
};
