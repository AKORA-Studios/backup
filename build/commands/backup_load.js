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
    bot_permissions: ['ADMINISTRATOR']
}, async (msg, args) => {
    utilities_1.getFile(msg, "Please send me your backup file", 30000, (obj) => {
        var struc = utilities_1.importGuild(obj), { guild } = msg;
        msg.channel.send(utilities_1.newEmb(msg)
            .setColor(utilities_1.colors.warning)
            .setTitle("WARNING")
            .setDescription("If you're not **110%** sure its the right backup use the `show` command to verify it is, or create a new one with the `save` command"));
        utilities_1.confirmAction(msg, "Please Confirm you want to load the Backup", (m) => {
            m.channel.send("QwQ");
        }, (m) => {
            m.channel.send("qwq");
        });
    }, () => {
    });
});
