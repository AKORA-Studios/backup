import { newEmb, colors, funCommand } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Tickle',
    syntax: 'tickle',
    args: false,
    description: 'Sends you a tickle gif uwu',
    module_type: 'fun',
    triggers: ['tickle'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        funCommand(msg, 'tickle');
    }
);
