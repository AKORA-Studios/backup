"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
const discord_js_1 = require("discord.js");
//let a = new module();
module.exports = new classes_1.Command({
    name: 'save',
    syntax: 'save',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['save', 'save-guild'],
    user_permissions: [],
    bot_permissions: ['SEND_MESSAGES']
}, async (msg, args) => {
    var json_structure = await utilities_1.exportGuild(msg.guild);
    var buffer = Buffer.from(JSON.stringify(json_structure, null, 4), 'utf8');
    var attachment = new discord_js_1.MessageAttachment(buffer, 'backup.json');
    msg.channel.send(attachment);
    //msg.client.emit("guildMemberAdd", msg.member)
});
