"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Restore',
    syntax: 'restore [stored]',
    args: false,
    description: "Restore your Backup. The difference to the `load` command is,\n"
        + "that it checks for existing channels, and **updates/deletes** them.\n"
        + "instead of just creating all channels",
    module_type: 'backup',
    triggers: ['restore'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
}, async (message, args) => {
    try {
        var obj = await utilities_1.getFileAsync(message, "Please send me your backup file", 30);
    }
    catch (e) { }
    var struc = utilities_1.importGuild(obj), { guild } = message;
    message.channel.send(utilities_1.newEmb(message)
        .setColor(utilities_1.colors.warning)
        .setTitle("WARNING")
        .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command"));
    try {
        await utilities_1.confirmActionAsync(message, "Please Confirm you want to restore this Backup");
    }
    catch (e) { }
    guild = await message.guild.fetch();
    var emb = utilities_1.rawEmb().setColor(utilities_1.colors.success).setTitle("Restoring Backup"), text = utilities_1.emojis.false + " Emojis\n"
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
            if (guild.emojis.resolve(emoji.id))
                continue; //Already exists
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
            if (guild.roles.resolve(role.id)) {
                let r = guild.roles.resolve(role.id);
                await r.edit({
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    permissions: role.permissions
                }).catch(e => catchErr(msg, role.name, e));
                ;
                struc.roles.reverse()[i].loadedID = role.id;
            }
            else {
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
        const LOOSE = struc.channels.filter(c => ["text"].includes(c.type));
        for (let i = 0; i < LOOSE.length; i++) {
            let channel = LOOSE[i];
            if (guild.channels.resolve(channel.id)) {
                let c = guild.channels.resolve(channel.id);
                await c.edit({
                    name: channel.name,
                    topic: channel.topic,
                    position: i,
                    nsfw: channel.nsfw,
                    permissionOverwrites: channel.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                    lockPermissions: channel.permissionsLocked
                }).catch(e => catchErr(msg, channel.name, e));
            }
            else {
                let c = await msg.guild.channels.create(channel.name, {
                    permissionOverwrites: channel.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                    topic: channel.topic,
                    type: channel.type,
                    nsfw: channel.nsfw,
                    position: struc.channels.indexOf(channel),
                    reason: reason
                }).catch((e) => catchErr(msg, channel.name, e));
            }
            //struc.channels[struc.channels.indexOf(channel)].loadedID = c["id"];
        }
        //Categorys
        const CATEGORYS = struc.channels.filter(c => c.type === "category");
        for (let z = 0; z < CATEGORYS.length; z++) {
            let category = CATEGORYS[z];
            if (guild.channels.resolve(category.id)) {
                let cat = guild.channels.resolve(category.id);
                await cat.edit({
                    name: category.name,
                    position: z,
                    permissionOverwrites: category.permissionOverwrites.map((p) => mapPerms(p, struc.roles))
                }).catch(e => catchErr(msg, cat.name, e));
                category.loadedID = cat.id;
            }
            else {
                let cat = await msg.guild.channels.create(category.name, {
                    permissionOverwrites: category.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                    type: category.type,
                    position: struc.channels.indexOf(category),
                    reason: reason
                })
                    .then((c) => category.loadedID = c["id"])
                    .catch((e) => catchErr(msg, category.name, e));
            }
            for (let i = 0; i < category.childs.length; i++) {
                let chan = category.childs[i];
                if (guild.channels.resolve(chan.id)) {
                    let c = guild.channels.resolve(chan.id);
                    await c.edit({
                        name: chan.name,
                        topic: chan.topic,
                        position: i,
                        nsfw: chan.nsfw,
                        parentID: category.loadedID,
                        permissionOverwrites: chan.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                        lockPermissions: chan.permissionsLocked
                    }).catch(e => catchErr(msg, chan.name, e));
                }
                else {
                    let c = await msg.guild.channels.create(chan.name, {
                        permissionOverwrites: chan.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                        position: i,
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
    }
    text =
        utilities_1.emojis.true + " Emojis\n"
            + utilities_1.emojis.true + " Roles\n"
            + utilities_1.emojis.true + " Channels\n";
    await msg.edit(emb.setDescription(text));
    //Finished Loading
    const end = new Date();
    var span = (end.getTime() - start.getTime()) / 1000;
    return msg.channel.send(utilities_1.rawEmb().setColor(utilities_1.colors.success).setTitle("Finished Restoing uwu").setFooter("Took " + Math.floor(span * 10) / 10 + " seconds"));
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
