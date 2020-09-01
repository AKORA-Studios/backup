import { newEmb, exportGuild, colors } from '../typescript/utilities';
import { Command } from "../typescript/classes";
import { MessageAttachment } from 'discord.js';

module.exports = new Command({
    name: 'save',
    syntax: 'save [minimal]',
    args: false,
    description: 'This command exports your guild as a JSON file.(the bot also stores the latest save)\nIf you use the `minimal` argument it going to reduce your file size by ~50%',
    module_type: 'backup',
    triggers: ['save', 'save-guild'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (msg, args) => {
        var emb = newEmb(msg).setTitle("Exported Guild as JSON file").setColor(colors.success),
            json_structure = await exportGuild(msg.guild),
            minimal = false,
            text = "";

        //JSON Formatting
        if (args.length > 0 && args[0].toLowerCase().includes("minimal")) minimal = true;

        if (minimal) {
            text = JSON.stringify(json_structure);
            emb.setFooter("Exported with minimal formatting");
        } else {
            text = JSON.stringify(json_structure, null, 4);
            emb.setFooter("Exported with pretty formatting");
        }

        //Preparing for sending
        var buffer = Buffer.from(text, 'utf8');
        var attachment = new MessageAttachment(buffer, msg.guild.id + '.json')


        msg.channel.send([emb, attachment]);
    }
);