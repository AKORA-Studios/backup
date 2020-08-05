import { newEmb, importGuild, colors } from '../typescript/utilities';
import { Command } from "../typescript/classes";
import { MessageAttachment } from 'discord.js';
//let a = new module();

module.exports = new Command({
    name: 'save',
    syntax: 'save [minimal]',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['save', 'save-guild'],
    user_permissions: ['ADMINISTRATOR'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (msg, args) => {
        var emb = newEmb(msg).setTitle("Exported Guild as JSON file").setColor(colors.success);


        msg.channel.send(emb);
        msg.channel.send(attachment);
    }
);