import { newEmb, colors, funCommand } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Huh',
    syntax: 'hub',
    args: false,
    description: 'Sends you a hug gif uwu',
    module_type: 'fun',
    triggers: ['hug'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        funCommand(msg, 'hug');
    }
);
