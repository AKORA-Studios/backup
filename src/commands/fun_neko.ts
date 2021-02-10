import { newEmb, colors, funCommand } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Neko',
    syntax: 'neko',
    args: false,
    description: 'Sends you a Neko',
    module_type: 'fun',
    triggers: ['neko'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        funCommand(msg, 'neko');
    }
);
