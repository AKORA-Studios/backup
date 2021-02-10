import { newEmb, colors, funCommand } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Meow',
    syntax: 'meow',
    args: false,
    description: 'Sends you a cute Cat :3',
    module_type: 'fun',
    triggers: ['meow'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        funCommand(msg, 'cat');
    }
);
