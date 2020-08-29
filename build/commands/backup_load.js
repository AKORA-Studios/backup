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
}, (message, args) => {
    utilities_1.getFile(message, "Please send me your backup file", 30000, (obj) => {
        var struc = utilities_1.importGuild(obj), { guild } = message;
        message.channel.send(utilities_1.newEmb(message)
            .setColor(utilities_1.colors.warning)
            .setTitle("WARNING")
            .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command"));
        utilities_1.confirmAction(message, "Please Confirm you want to load this Backup", async () => {
            var emb = utilities_1.newEmb(message).setColor(utilities_1.colors.success).setTitle("Loading Backup"), text = "", msg = await message.channel.send(emb), send = msg.channel.send;
            const reason = "Loading Backup by " + message.author.tag;
            //Loading Emojis
            send(emb.setDescription(text + " > > Loading Emojis...\n"));
            for (let emoji of struc.emojis) {
                await msg.guild.emojis.create(emoji.url, emoji.name, {
                    reason: reason
                }); //From URL To Buffer needs to be added
            }
            text += " > > Loaded Emojis\n";
            //Loading Roles
            send(emb.setDescription(text + " > > Loading Roles...\n"));
            for (let role of struc.roles) {
                let r = await msg.guild.roles.create({
                    data: {
                        name: role.name,
                        color: role.color,
                        hoist: role.hoist,
                        position: role.position,
                        permissions: role.permissions,
                        mentionable: role.mentionable
                    }, reason: reason
                });
                role.loadedID = r.id;
            }
            text += " > > Loaded Roles\n";
        }, () => {
        });
    }, () => {
    });
});
