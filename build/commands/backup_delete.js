"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
const fs_1 = require("fs");
module.exports = new classes_1.Command({
    name: 'Delete',
    syntax: 'delete [force]',
    args: false,
    description: "Delete your Backup. This command deletes your backup from my server so you cant use the `stored` option anymore, the backup will be gone FOREVER, your downloaded backups will still work tho.",
    module_type: 'backup',
    triggers: ['delete'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
}, async (msg, args) => {
    msg.channel.send(utilities_1.newEmb(msg)
        .setColor(utilities_1.colors.warning)
        .setTitle("WARNING")
        .setDescription("The backup will be gone **FOREVER**, confirm that you are **110%** sure that you want to delete this backup."));
    try {
        await utilities_1.confirmActionAsync(msg, "Please Confirm you want to delete this Backup");
    }
    catch (e) { }
    try {
        fs_1.unlinkSync('./guild_saves/' + msg.guild.id + '.json');
    }
    catch (e) { }
    return msg.channel.send(utilities_1.rawEmb().setColor(utilities_1.colors.success).setTitle("You backup was deleted succesfully"));
});
const catchErr = (msg, str, txt) => {
    msg.channel.send(utilities_1.rawEmb().setColor(utilities_1.colors.error).setTitle("Could'nt Load: " + str).setDescription(txt));
    return;
};
const mapPerms = (perm, roles) => {
    var role = roles.find(r => r.id === perm.id);
    if (role && role.loadedID)
        perm.id = role.loadedID;
    return perm;
};
