import { confirmAction, encode_text, decode_text, exportGuild } from '../typescript/utilities';
import { Command } from "../typescript/classes";
import { MessageAttachment } from 'discord.js';
//let a = new module();

module.exports = new Command({
    name: 'Encryption',
    syntax: 'securemsg <@user>',
    args: false,
    description: 'qwq',
    module_type: 'fun',
    triggers: ['securemsg', 'smsg'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {

        if (!msg.mentions.users.first()) return msg.channel.send("misssing Mention");

        let encoded = encode_text(msg.content, msg.author.id, msg.mentions.users.first().id);
        let decoded = decode_text(encoded, msg.author.id, msg.mentions.users.first().id);

        msg.channel.send("**Encoded:**");
        msg.channel.send(encoded);
        msg.channel.send("**Decoded:**");
        msg.channel.send(decoded);
    }
);
