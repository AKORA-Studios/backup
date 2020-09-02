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
}, (message, args) => {
    utilities_1.getFile(message, "Please send me your backup file", 30, (obj) => {
        var struc = utilities_1.importGuild(obj), { guild } = message;
        message.channel.send(utilities_1.newEmb(message)
            .setColor(utilities_1.colors.warning)
            .setTitle("WARNING")
            .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command"));
        utilities_1.confirmAction(message, "Please Confirm you want to restore this Backup", async () => {
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
                        r.setColor(role.color, reason).catch(e => catchErr(msg, role.name, e));
                        if (r.hoist !== role.hoist)
                            r.setHoist(role.hoist, reason).catch(e => catchErr(msg, role.name, e));
                        if (r.mentionable !== role.mentionable)
                            r.setMentionable(role.mentionable, reason).catch(e => catchErr(msg, role.name, e));
                        if (r.name !== role.name)
                            r.setName(role.name, reason).catch(e => catchErr(msg, role.name, e));
                        if (r.permissions.toArray() !== role.permissions)
                            r.setName(role.name, reason).catch(e => catchErr(msg, role.name, e));
                        if (r.position !== role.position)
                            r.setPermissions(role.permissions).catch(e => catchErr(msg, role.name, e));
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
                        if (c.name !== channel.name)
                            c.setName(channel.name, reason).catch(e => catchErr(msg, channel.name, e));
                        if (c.topic !== channel.topic)
                            c.setTopic(channel.topic, reason).catch(e => catchErr(msg, channel.name, e));
                        if (c.position !== i)
                            c.setPosition(i).catch(e => catchErr(msg, channel.name, e));
                        var overwrites = channel.permissionOverwrites.map((p) => mapPerms(p, struc.roles));
                        if (c.permissionOverwrites.array() !== overwrites)
                            c.overwritePermissions(overwrites).catch(e => catchErr(msg, role.name, e));
                        if (channel.nsfw)
                            c.setNSFW(channel.nsfw).catch(e => catchErr(msg, channel.name, e));
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
                        if (cat.name !== category.name)
                            cat.setName(category.name, reason).catch(e => catchErr(msg, cat.name, e));
                        if (cat.position !== z)
                            cat.setPosition(z).catch(e => catchErr(msg, cat.name, e));
                        var overwrites = category.permissionOverwrites.map((p) => mapPerms(p, struc.roles));
                        if (cat.permissionOverwrites.array() !== overwrites)
                            cat.overwritePermissions(overwrites).catch(e => catchErr(msg, cat.name, e));
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
                            if (c.name !== chan.name)
                                c.setName(chan.name, reason).catch(e => catchErr(msg, chan.name, e));
                            if (c.topic !== chan.topic)
                                c.setTopic(chan.topic, reason).catch(e => catchErr(msg, chan.name, e));
                            if (c.position !== i)
                                c.setPosition(i).catch(e => catchErr(msg, chan.name, e));
                            var overwrites = chan.permissionOverwrites.map((p) => mapPerms(p, struc.roles));
                            if (c.permissionOverwrites.array() !== overwrites)
                                c.overwritePermissions(overwrites).catch(e => catchErr(msg, role.name, e));
                            if (chan.nsfw)
                                c.setNSFW(chan.nsfw).catch(e => catchErr(msg, chan.name, e));
                        }
                        else {
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
            }
            text =
                utilities_1.emojis.true + " Emojis\n"
                    + utilities_1.emojis.true + " Roles\n"
                    + utilities_1.emojis.true + " Channels\n";
            await msg.edit(emb.setDescription(text));
            //Finished Loading
            const end = new Date();
            var span = (end.getTime() - start.getTime()) / 1000;
            msg.channel.send(utilities_1.rawEmb().setColor(utilities_1.colors.success).setTitle("Finished Restoing uwu").setFooter("Took " + Math.floor(span * 10) / 10 + " seconds"));
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
