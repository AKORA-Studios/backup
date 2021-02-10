import { newEmb, colors, funCommand } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Kiss',
    syntax: 'kiss',
    args: false,
    description: 'Sends you kiss gif uwu',
    module_type: 'fun',
    triggers: ['kiss'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        funCommand(msg, 'kiss');
    }
);
