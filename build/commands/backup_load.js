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
    utilities_1.getFile(message, "Please send me your backup file", 30, (obj) => {
        var struc = utilities_1.importGuild(obj), { guild } = message;
        message.channel.send(utilities_1.newEmb(message)
            .setColor(utilities_1.colors.warning)
            .setTitle("WARNING")
            .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command"));
        utilities_1.confirmAction(message, "Please Confirm you want to load this Backup", async () => {
            var emb = utilities_1.rawEmb().setColor(utilities_1.colors.success).setTitle("Loading Backup"), text = utilities_1.emojis.false + " Emojis\n"
                + utilities_1.emojis.false + " Roles\n"
                + utilities_1.emojis.false + " Channels\n", msg = await message.channel.send(emb);
            const reason = "Loading Backup by " + message.author.tag, start = new Date();
            //Loading Emojis
            text =
                utilities_1.emojis.presence + " Emojis\n"
                    + utilities_1.emojis.false + " Roles\n"
                    + utilities_1.emojis.false + " Channels\n";
            msg = await msg.edit(emb.setDescription(text));
            if (struc.emojis) { //Else Not interable
                for (let emoji of struc.emojis) {
                    await msg.guild.emojis.create(emoji.url, emoji.name, {
                        reason: reason
                    }).catch((e) => catchErr(msg, emoji.name, e));
                }
            }
            //Loading Roles
            text =
                utilities_1.emojis.true + " Emojis\n"
                    + utilities_1.emojis.presence + " Roles\n"
                    + utilities_1.emojis.false + " Channels\n";
            await msg.edit(emb.setDescription(text));
            for (let i = 0; i < struc.roles.length; i++) {
                var role = struc.roles.reverse()[i];
                if (role.name !== "@everyone") {
                    let r = await msg.guild.roles.create({
                        data: {
                            name: role.name,
                            color: role.color,
                            hoist: role.hoist,
                            permissions: role.permissions,
                            mentionable: role.mentionable
                        }, reason: reason
                    }).catch((e) => catchErr(msg, role.name, e));
                    struc.roles.reverse()[i].loadedID = r["id"];
                }
                else {
                    msg.guild.roles.resolve(msg.guild.id).setPermissions(role.permissions);
                }
            }
            //Loading Channels
            text =
                utilities_1.emojis.true + " Emojis\n"
                    + utilities_1.emojis.true + " Roles\n"
                    + utilities_1.emojis.presence + " Channels\n";
            await msg.edit(emb.setDescription(text));
            if (struc.channels) { //Else Not interable
                //LOOSE - Channels
                for (let channel of struc.channels.filter(c => ["text"].includes(c.type))) {
                    let c = await msg.guild.channels.create(channel.name, {
                        permissionOverwrites: channel.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                        topic: channel.topic,
                        type: channel.type,
                        nsfw: channel.nsfw,
                        position: struc.channels.indexOf(channel),
                        reason: reason
                    }).catch((e) => catchErr(msg, channel.name, e));
                    //struc.channels[struc.channels.indexOf(channel)].loadedID = c["id"];
                }
                //Categorys
                for (let category of struc.channels.filter(c => c.type === "category")) {
                    let cat = await msg.guild.channels.create(category.name, {
                        permissionOverwrites: category.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                        type: category.type,
                        position: struc.channels.indexOf(category),
                        reason: reason
                    })
                        .then((c) => category.loadedID = c["id"])
                        .catch((e) => catchErr(msg, category.name, e));
                    for (let chan of category.childs) {
                        let c = await msg.guild.channels.create(chan.name, {
                            permissionOverwrites: chan.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                            topic: chan.topic,
                            type: chan.type,
                            nsfw: chan.nsfw,
                            parent: category.loadedID,
                            reason: reason
                        })
                            .then((c) => chan.loadedID = c["id"])
                            .catch((e) => catchErr(msg, chan.name, e));
                    }
                }
            }
            text =
                utilities_1.emojis.true + " Emojis\n"
                    + utilities_1.emojis.true + " Roles\n"
                    + utilities_1.emojis.true + " Channels\n";
            await msg.edit(emb.setDescription(text));
            //Finished Loading
            const end = new Date();
            var span = (end.getTime() - start.getTime()) / 1000;
            msg.channel.send(utilities_1.rawEmb().setColor(utilities_1.colors.success).setTitle("Finished Loading uwu").setFooter("Took " + Math.floor(span * 10) / 10 + " seconds"));
        }, () => {
        });
    }, () => {
    });
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
