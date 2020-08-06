"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const bent = require("bent");
const getString = bent('string');
const classes_1 = require("../typescript/classes");
//let a = new module();
module.exports = new classes_1.Command({
    name: 'save',
    syntax: 'show [minimal]',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['show'],
    user_permissions: ['ADMINISTRATOR'],
    bot_permissions: ['ADMINISTRATOR']
}, async (msg, args) => {
    //Getting the file from the User
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
});
