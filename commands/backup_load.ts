import { confirmAction } from "../typescript/utilities";
import { Command } from "../typescript/classes";

module.exports = new Command({
    name: 'Load',
    syntax: 'load',
    args: false,
    description: 'Loads your Backup',
    module_type: 'backup',
    triggers: ['load', 'apply'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (msg, args) => {
        confirmAction(msg, "In progress", (m) => {
            m.channel.send("QwQ");
        }, (m) => {
            m.channel.send("qwq")
        });
    }
);