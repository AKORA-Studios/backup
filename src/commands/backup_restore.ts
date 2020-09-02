import { colors, confirmAction, getFile, importGuild, newEmb, rawEmb, emojis } from "../typescript/utilities";
import { Command } from "../typescript/classes";
import { Message, PermissionOverwrites, Role, TextChannel } from "discord.js";
import { RoleStructure } from "../typescript/structures";

module.exports = new Command({
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
},

    (message, args) => {
        getFile(message, "Please send me your backup file", 30, (obj) => {
            var struc = importGuild(obj),
                { guild } = message;

            message.channel.send(newEmb(message)
                .setColor(colors.warning)
                .setTitle("WARNING")
                .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command")
            );

            confirmAction(message, "Please Confirm you want to restore this Backup", async () => {
                guild = await msg.guild.fetch();

                var emb = newEmb(message).setColor(colors.success).setTitle("Loading Backup"),
                    text =
                        emojis.false + " Emojis\n"
                        + emojis.false + " Roles\n"
                        + emojis.false + " Channels\n",

                    msg = await message.channel.send(emb);


                const reason = "Loading Backup by " + message.author.tag,
                    start = new Date();





                //Loading Emojis
                text =
                    emojis.presence + " Emojis\n"
                    + emojis.false + " Roles\n"
                    + emojis.false + " Channels\n";

                msg = await msg.edit(emb.setDescription(text));

                if (struc.emojis) {//Else Not interable
                    for (let emoji of struc.emojis) {
                        if (guild.emojis.resolve(emoji.id)) continue;//Already exists

                        await msg.guild.emojis.create(emoji.url, emoji.name, {
                            reason: reason
                        }).catch((e) => catchErr(msg, emoji.name, e));
                    }
                }




                //Loading Roles
                text =
                    emojis.true + " Emojis\n"
                    + emojis.presence + " Roles\n"
                    + emojis.false + " Channels\n";

                await msg.edit(emb.setDescription(text));

                for (let i = 0; i < struc.roles.length; i++) {
                    var role = struc.roles.reverse()[i];

                    if (role.name !== "@everyone") {
                        if (guild.roles.resolve(role.id)) {
                            let r = guild.roles.resolve(role.id);
                            r.setColor(role.color, reason).catch(e => catchErr(msg, role.name, e));

                            if (r.hoist !== role.hoist) r.setHoist(role.hoist, reason).catch(e => catchErr(msg, role.name, e));
                            if (r.mentionable !== role.mentionable) r.setMentionable(role.mentionable, reason).catch(e => catchErr(msg, role.name, e));
                            if (r.name !== role.name) r.setName(role.name, reason).catch(e => catchErr(msg, role.name, e));
                            if (r.permissions.toArray() !== role.permissions) r.setName(role.name, reason).catch(e => catchErr(msg, role.name, e));
                            if (r.position !== role.position) r.setPermissions(role.permissions).catch(e => catchErr(msg, role.name, e));

                            struc.roles.reverse()[i].loadedID = role.id;
                        } else {
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
                    } else {
                        msg.guild.roles.resolve(msg.guild.id).setPermissions(role.permissions);
                    }
                }





                //Loading Channels
                text =
                    emojis.true + " Emojis\n"
                    + emojis.true + " Roles\n"
                    + emojis.presence + " Channels\n";

                await msg.edit(emb.setDescription(text));

                if (struc.channels) {//Else Not interable
                    //LOOSE - Channels
                    const LOOSE = struc.channels.filter(c => ["text"].includes(c.type));
                    for (let i = 0; i < LOOSE.length; i++) {
                        let channel = LOOSE[i];

                        if (guild.channels.resolve(channel.id)) {
                            let c = guild.channels.resolve(channel.id) as TextChannel;

                            if (c.name !== channel.name) c.setName(channel.name, reason).catch(e => catchErr(msg, channel.name, e));
                            if (c.topic !== channel.topic) c.setTopic(channel.topic, reason).catch(e => catchErr(msg, channel.name, e));
                            if (c.position !== i) c.setPosition(i).catch(e => catchErr(msg, channel.name, e));

                            var overwrites = channel.permissionOverwrites.map((p) => mapPerms(p, struc.roles));
                            if (c.permissionOverwrites.array() !== overwrites) c.overwritePermissions(overwrites).catch(e => catchErr(msg, role.name, e));

                            c.setNSFW(channel.nsfw).catch(e => catchErr(msg, channel.name, e));
                        } else {
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
                    for (let category of struc.channels.filter(c => c.type === "category")) {
                        let cat = await msg.guild.channels.create(category.name, {
                            permissionOverwrites: category.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                            type: category.type,
                            position: struc.channels.indexOf(category),
                            reason: reason
                        })
                            .then((c) => category.loadedID = c["id"])
                            .catch((e) => catchErr(msg, category.name, e));



                        for (let i = 0; i < category.childs.length; i++) {
                            let chan = category.childs[i];

                            if (guild.channels.resolve(chan.id)) {
                                let c = guild.channels.resolve(chan.id) as TextChannel;

                                if (c.name !== chan.name) c.setName(chan.name, reason).catch(e => catchErr(msg, chan.name, e));
                                if (c.topic !== chan.topic) c.setTopic(chan.topic, reason).catch(e => catchErr(msg, chan.name, e));
                                if (c.position !== i) c.setPosition(i).catch(e => catchErr(msg, chan.name, e));

                                var overwrites = chan.permissionOverwrites.map((p) => mapPerms(p, struc.roles));
                                if (c.permissionOverwrites.array() !== overwrites) c.overwritePermissions(overwrites).catch(e => catchErr(msg, role.name, e));

                                c.setNSFW(chan.nsfw).catch(e => catchErr(msg, chan.name, e));
                            } else {

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
                    emojis.true + " Emojis\n"
                    + emojis.true + " Roles\n"
                    + emojis.true + " Channels\n";
                await msg.edit(emb.setDescription(text));





                //Finished Loading
                const end = new Date();
                var span = (end.getTime() - start.getTime()) / 1000;
                msg.channel.send(newEmb(message).setColor(colors.success).setTitle("Finished Loading uwu").setFooter("Took: " + Math.floor(span * 10) / 10 + " seconds"));
            }, () => {

            });
        }, () => {

        })
    }
);

const catchErr = (msg: Message, str: string, txt) => {
    msg.channel.send(rawEmb().setColor(colors.error).setTitle("Could'nt Load: " + str).setDescription(txt));
    return;
}

const mapPerms = (perm: PermissionOverwrites, roles: RoleStructure[]): PermissionOverwrites => {
    var role = roles.find(r => r.id === perm.id);
    if (role && role.loadedID) perm.id = role.loadedID;

    return perm;
}