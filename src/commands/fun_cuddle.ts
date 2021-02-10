import { newEmb, colors, funCommand } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Cuddle',
    syntax: 'cuddle',
    args: false,
    description: 'Sends you a cuddle gif uwu',
    module_type: 'fun',
    triggers: ['cuddle'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        funCommand(msg, 'cuddle');
    }
);
