"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const discord_js_1 = require("discord.js");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Format',
    syntax: 'format [minimal]',
    args: false,
    description: 'Formats your JSON file',
    module_type: 'misc',
    triggers: ['format', 'f'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
}, async (msg, args) => {
    //Getting the file from the User
    let minimal = false, text = "", emb = utilities_1.newEmb(msg).setColor(utilities_1.colors.info);
    if (args.length > 0 && args[0].toLowerCase().includes("minimal"))
        minimal = true;
    utilities_1.getFile(msg, "Send me your JSON File uwu", 30, (json) => {
        //Converting to GuildStructure Object
        if (minimal) {
            text = JSON.stringify(json);
            emb.setFooter("Exported with minimal formatting");
        }
        else {
            text = JSON.stringify(json, null, 4);
            emb.setFooter("Exported with pretty formatting");
        }
        //Preparing for sending
        var buffer = Buffer.from(text, 'utf8');
        var attachment = new discord_js_1.MessageAttachment(buffer, 'backup.json');
        msg.channel.send([emb, attachment]);
    }, () => {
    });
});
