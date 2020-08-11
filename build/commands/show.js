"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const bent = require("bent");
const getString = bent('string');
const classes_1 = require("../typescript/classes");
const fs = require("fs");
//let a = new module();
module.exports = new classes_1.Command({
    name: 'Show',
    syntax: 'show [stored]',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['show'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
}, async (msg, args) => {
    //Getting the file from the User
    if (args[0] && args[0].toLowerCase().includes('stored')) {
        try {
            let str = fs.readFileSync('./guild_saves/' + msg.guild.id + '.json').toString('utf8');
            let json = JSON.parse(str);
            var structure = utilities_1.importGuild(json);
            var info_emb = utilities_1.newEmb(msg).setTitle("Serverinfo").setColor(utilities_1.colors.info);
            var structure_emb = utilities_1.newEmb(msg).setTitle("Server Structure").setColor(utilities_1.colors.info);
            structure_emb.setDescription("```" + utilities_1.generateTree(structure) + "```");
            msg.channel.send(info_emb);
            msg.channel.send(structure_emb);
        }
        catch (e) {
            msg.channel.send(utilities_1.newEmb(msg).setColor(utilities_1.colors.error).setTitle('Something went wrong ._.'));
        }
    }
    else {
        utilities_1.getFile(msg, "Send me your JSON File uwu", 30, (json) => {
            //Converting to GuildStructure Object
            var structure = utilities_1.importGuild(json);
            var info_emb = utilities_1.newEmb(msg).setTitle("Serverinfo").setColor(utilities_1.colors.info);
            var structure_emb = utilities_1.newEmb(msg).setTitle("Server Structure").setColor(utilities_1.colors.info);
            structure_emb.setDescription("```" + utilities_1.generateTree(structure) + "```");
            msg.channel.send(info_emb);
            msg.channel.send(structure_emb);
        }, () => {
        });
    }
});
