"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
const discord_js_1 = require("discord.js");
module.exports = new classes_1.Command({
    name: 'save',
    syntax: 'save [minimal]',
    args: false,
    description: 'This command exports your guild as a JSON file.(the bot also stores the latest save)\nIf you use the `minimal` argument it going to reduce your file size by ~50%',
    module_type: 'backup',
    triggers: ['save', 'save-guild'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
}, async (msg, args) => {
    var emb = utilities_1.newEmb(msg).setTitle("Exported Guild as JSON file").setColor(utilities_1.colors.success), json_structure = await utilities_1.exportGuild(msg.guild), minimal = false, text = "";
    //JSON Formatting
    if (args.length > 0 && args[0].toLowerCase().includes("minimal"))
        minimal = true;
    if (minimal) {
        text = JSON.stringify(json_structure);
        emb.setFooter("Exported with minimal formatting");
    }
    else {
        text = JSON.stringify(json_structure, null, 4);
        emb.setFooter("Exported with pretty formatting");
    }
    //Preparing for sending
    var buffer = Buffer.from(text, 'utf8');
    var attachment = new discord_js_1.MessageAttachment(buffer, msg.guild.id + '.json');
    msg.channel.send([emb, attachment]);
});
