import { confirmAction, encode_text, decode_text, exportGuild } from '../typescript/utilities';
import { Command } from "../typescript/classes";
import { MessageAttachment } from 'discord.js';
//let a = new module();

module.exports = new Command({
    name: 'save',
    syntax: 'save',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['save', 'save-guild'],
    user_permissions: [],
    bot_permissions: ['SEND_MESSAGES']
},

    async (msg, args) => {
        var json_structure = await exportGuild(msg.guild);
        var buffer = Buffer.from(JSON.stringify(json_structure, null, 4), 'utf8');
        var attachment = new MessageAttachment(buffer, 'backup.json')

        msg.channel.send(attachment);
        //msg.client.emit("guildMemberAdd", msg.member)
    }
);