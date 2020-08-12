"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Load',
    syntax: 'load',
    args: false,
    description: 'Loads your Backup',
    module_type: 'backup',
    triggers: ['load', 'apply'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD']
}, async (msg, args) => {
    utilities_1.confirmAction(msg, "Ja oda nein?", (m) => {
        m.channel.send("QwQ");
    }, (m) => {
        m.channel.send("qwq");
    });
    msg.client.emit("guildMemberAdd", msg.member);
});
