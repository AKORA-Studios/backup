"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
const fs = require("fs");
const path_1 = require("path");
module.exports = new classes_1.Command({
    name: 'Show',
    syntax: 'show [stored]',
    args: false,
    description: 'This commands shows the stored backup.\nWith the `stored` option the bot takes the latest backup from his cache.',
    module_type: 'backup',
    triggers: ['show'],
    user_permissions: [],
    bot_permissions: []
}, async (msg, args) => {
    //Getting the file from the User
    if (args[0] && args[0].toLowerCase().includes('stored')) {
        try {
            let str = fs.readFileSync(path_1.join(__dirname, '..', 'guild_saves', msg.guild.id + '.json')).toString('utf8');
            let json = JSON.parse(str);
            var structure = utilities_1.importGuild(json);
            sendEmbeds(msg, structure);
        }
        catch (e) {
            console.log(e);
            return msg.channel.send(utilities_1.newEmb(msg).setColor(utilities_1.colors.error).setTitle('I don\'t have stored this guild yet._.'));
        }
    }
    else {
        return utilities_1.getFile(msg, "Send me your JSON File uwu", 30, (json) => {
            //Converting to GuildStructure Object
            var structure = utilities_1.importGuild(json);
            sendEmbeds(msg, structure);
        }, () => {
        });
    }
});
const sendEmbeds = (msg, structure) => {
    var char_limit = utilities_1.newEmb(msg).setColor(utilities_1.colors.error).setTitle("Text too long D:");
    var info_emb = utilities_1.rawEmb()
        .setTitle(structure.name)
        .setColor(utilities_1.colors.info)
        .setThumbnail(structure.iconURL)
        .setDescription(structure.description)
        .setTimestamp(structure.savedAt);
    var channel_count = 0;
    if (structure.channels.length)
        channel_count += structure.channels.length;
    for (let cat of structure.channels.filter(v => v.childs))
        channel_count += cat.childs.length;
    info_emb.setDescription(""
        + `${utilities_1.emojis.owner} <@${structure.ownerID}>\n`
        + `\n`
        + `${utilities_1.emojis.information} **Stats**\n` + "```"
        + `Channel ${channel_count}\n`
        + `Roles   ${structure.roles.length}\n`
        + `Emojis  ${structure.emojis.length}\n`
        + "```\n"
        + `${utilities_1.emojis.tag} **Region**\n`
        + "`" + utilities_1.fancyCases("-", structure.region) + "`");
    var structure_emb = utilities_1.rawEmb()
        .setColor(utilities_1.colors.info)
        .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL());
    structure_emb.setDescription("```" + utilities_1.generateTree(structure) + "```")
        .setTimestamp(structure.savedAt);
    msg.channel.send(info_emb).catch(() => msg.channel.send(char_limit));
    msg.channel.send(structure_emb).catch(() => msg.channel.send(char_limit));
};
