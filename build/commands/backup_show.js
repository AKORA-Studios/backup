"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
const fs = require("fs");
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
    var char_limit = utilities_1.newEmb(msg).setColor(utilities_1.colors.error).setTitle("Text too long D:");
    //Getting the file from the User
    if (args[0] && args[0].toLowerCase().includes('stored')) {
        try {
            let str = fs.readFileSync('./guild_saves/' + msg.guild.id + '.json').toString('utf8');
            let json = JSON.parse(str);
            var structure = utilities_1.importGuild(json);
            var info_emb = utilities_1.newEmb(msg).setTitle("Serverinfo").setColor(utilities_1.colors.info);
            var structure_emb = utilities_1.newEmb(msg).setTitle("Server Structure").setColor(utilities_1.colors.info);
            structure_emb.setDescription("```" + utilities_1.generateTree(structure) + "```");
            msg.channel.send(info_emb).catch(() => msg.channel.send(char_limit));
            msg.channel.send(structure_emb).catch(() => msg.channel.send(char_limit));
        }
        catch (e) {
            msg.channel.send(utilities_1.newEmb(msg).setColor(utilities_1.colors.error).setTitle('I saved stored this guild yet ._.'));
        }
    }
    else {
        utilities_1.getFile(msg, "Send me your JSON File uwu", 30, (json) => {
            //Converting to GuildStructure Object
            var structure = utilities_1.importGuild(json);
            var info_emb = utilities_1.rawEmb(msg).setTitle(structure.name).setColor(utilities_1.colors.info)
                .setThumbnail(structure.iconURL)
                .setDescription(structure.description);
            var structure_emb = utilities_1.newEmb(msg).setTitle("Server Structure").setColor(utilities_1.colors.info);
            structure_emb.setDescription("```" + utilities_1.generateTree(structure) + "```")
                .setTimestamp(structure.savedAt);
            msg.channel.send(info_emb).catch(() => msg.channel.send(char_limit));
            msg.channel.send(structure_emb).catch(() => msg.channel.send(char_limit));
        }, () => {
        });
    }
});
