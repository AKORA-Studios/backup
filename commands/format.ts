import { newEmb, getFile, colors } from '../typescript/utilities';
import { MessageAttachment } from "discord.js";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Format',
    syntax: 'format [minimal]',
    args: false,
    description: 'Formats your JSON file',
    module_type: 'misc',
    triggers: ['format', 'f'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
},

    async (msg, args) => {
        //Getting the file from the User
        let minimal = false, text = "", emb = newEmb(msg).setColor(colors.info);

        if (args.length > 0 && args[0].toLowerCase().includes("minimal")) minimal = true;


        getFile(msg, "Send me your JSON File uwu", 30, (json) => {
            //Converting to GuildStructure Object
            if (minimal) {
                text = JSON.stringify(json);
                emb.setFooter("Exported with minimal formatting");
            } else {
                text = JSON.stringify(json, null, 4);
                emb.setFooter("Exported with pretty formatting");
            }

            //Preparing for sending
            var buffer = Buffer.from(text, 'utf8');
            var attachment = new MessageAttachment(buffer, 'backup.json')


            msg.channel.send(emb);
            msg.channel.send(attachment);
        }, () => {

        });

    }
);
