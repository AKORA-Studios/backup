import { newEmb, colors, funCommand } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Poke',
    syntax: 'poke',
    args: false,
    description: 'Sends you a poke gif uwu',
    module_type: 'fun',
    triggers: ['poke'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        funCommand(msg, 'poke');
    }
);
