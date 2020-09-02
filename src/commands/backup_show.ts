import { newEmb, importGuild, getFile, colors, generateTree, rawEmb, emojis, fancyCases } from '../typescript/utilities';
import { Command } from "../typescript/classes";
import * as fs from 'fs';
import { Message } from 'discord.js';
import { GuildStructure } from '../typescript/structures';

module.exports = new Command({
    name: 'Show',
    syntax: 'show [stored]',
    args: false,
    description: 'This commands shows the stored backup.\nWith the `stored` option the bot takes the latest backup from his cache.',
    module_type: 'backup',
    triggers: ['show'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {


        //Getting the file from the User
        if (args[0] && args[0].toLowerCase().includes('stored')) {
            try {
                let str = fs.readFileSync('./guild_saves/' + msg.guild.id + '.json').toString('utf8');
                let json = JSON.parse(str);
                var structure = importGuild(json);

                sendEmbeds(msg, structure);
            } catch (e) {
                msg.channel.send(newEmb(msg).setColor(colors.error).setTitle('I don\'t have stored this guild yet._.'));
            }
        } else {
            getFile(msg, "Send me your JSON File uwu", 30, (json) => {
                //Converting to GuildStructure Object
                var structure = importGuild(json);

                sendEmbeds(msg, structure);
            }, () => {

            });
        }
    }
);

const sendEmbeds = (msg: Message, structure: GuildStructure) => {
    var char_limit = newEmb(msg).setColor(colors.error).setTitle("Text too long D:");

    var info_emb = rawEmb()
        .setTitle(structure.name)
        .setColor(colors.info)
        .setThumbnail(structure.iconURL)
        .setDescription(structure.description)
        .setTimestamp(structure.savedAt);


    var channel_count = 0;
    if (structure.channels.length) channel_count += structure.channels.length;
    for (let cat of structure.channels.filter(v => v.childs)) channel_count += cat.childs.length;

    info_emb.setDescription(""
        + `${emojis.owner} <@${structure.ownerID}>\n`
        + `\n`
        + `${emojis.information} **Stats**\n` + "```"
        + `Channel ${channel_count}\n`
        + `Roles   ${structure.roles.length}\n`
        + `Emojis  ${structure.emojis.length}\n`
        + "```\n"
        + `${emojis.tag} **Region**\n`
        + "`" + fancyCases("-", structure.region) + "`"
    );





    var structure_emb = rawEmb()
        .setColor(colors.info)
        .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL());

    structure_emb.setDescription("```" + generateTree(structure) + "```")
        .setTimestamp(structure.savedAt);

    msg.channel.send(info_emb).catch(() => msg.channel.send(char_limit));
    msg.channel.send(structure_emb).catch(() => msg.channel.send(char_limit));
}