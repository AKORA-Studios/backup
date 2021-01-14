import { newEmb, getFile, colors, getFileAsync } from '../typescript/utilities';
import { MessageAttachment } from "discord.js";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Format',
    syntax: 'format [minimal]',
    args: false,
    description: 'Formats your JSON file',
    module_type: 'misc',
    triggers: ['format', 'f'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        //Getting the file from the User
        let minimal = false, text = "", emb = newEmb(msg).setColor(colors.info);

        if (args.length > 0 && args[0].toLowerCase().includes("minimal")) minimal = true;

        try {
            var json = await getFileAsync(msg, "Send me your JSON File uwu", 30);
        } catch (e) { }

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
        var attachment = new MessageAttachment(buffer, 'formatted.json')


        msg.channel.send([emb, attachment]);
    }
);
