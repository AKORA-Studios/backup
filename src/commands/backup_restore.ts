import { colors, confirmAction, getFile, importGuild, newEmb, rawEmb, emojis, confirmActionAsync, getFileAsync } from "../typescript/utilities";
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

    async (message, args) => {
        try {
            var obj = await getFileAsync(message, "Please send me your backup file", 30,);
        } catch (e) { return; }
        var struc = importGuild(obj),
            { guild } = message;

        message.channel.send(newEmb(message)
            .setColor(colors.warning)
            .setTitle("WARNING")
            .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command")
        );

        try {
            await confirmActionAsync(message, "Please Confirm you want to restore this Backup");
        } catch (e) { return; }
        guild = await message.guild.fetch();

        var emb = rawEmb().setColor(colors.success).setTitle("Restoring Backup"),
            text = '', msg: Message, state = 0;

        async function nextState() {
            const { false: f, true: t, presence: p } = emojis;
            text =
                (state > 0 ? (state > 1 ? t : p) : f) + " Emojis\n" +
                (state > 2 ? (state > 3 ? t : p) : f) + emojis.false + " Roles\n" +
                (state > 4 ? (state > 5 ? t : p) : f) + emojis.false + " Channels\n";

            if (!msg) msg = await message.channel.send(emb.setDescription(text));
            else msg = await msg.edit(emb.setDescription(text));
            state++;
        }

        await nextState();
        const reason = "Loading Backup by " + message.author.tag,
            start = new Date();





        //Loading Emojis
        await nextState();

        if (struc.emojis) {//Else Not interable
            for (let emoji of struc.emojis) {
                if (guild.emojis.resolve(emoji.id)) continue;//Already exists

                await msg.guild.emojis.create(emoji.url, emoji.name, {
                    reason: reason
                }).catch((e) => catchErr(msg, emoji.name, e));
            }
        }

        await nextState();


        //Loading Roles
        await nextState();

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
                    }).catch(e => catchErr(msg, role.name, e));;

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

        await nextState();



        //Loading Channels
        await nextState();

        if (struc.channels) {//Else Not interable
            //LOOSE - Channels
            const LOOSE = struc.channels.filter(c => ["text"].includes(c.type));
            for (let i = 0; i < LOOSE.length; i++) {
                let channel = LOOSE[i];

                if (guild.channels.resolve(channel.id)) {
                    let c = guild.channels.resolve(channel.id) as TextChannel;

                    await c.edit({
                        name: channel.name,
                        topic: channel.topic,
                        position: i,
                        nsfw: channel.nsfw,
                        permissionOverwrites: channel.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                        lockPermissions: channel.permissionsLocked
                    }).catch(e => catchErr(msg, channel.name, e));
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
                } else {
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
                        let c = guild.channels.resolve(chan.id) as TextChannel;

                        await c.edit({
                            name: chan.name,
                            topic: chan.topic,
                            position: i,
                            nsfw: chan.nsfw,
                            parentID: category.loadedID,
                            permissionOverwrites: chan.permissionOverwrites.map((p) => mapPerms(p, struc.roles)),
                            lockPermissions: chan.permissionsLocked
                        }).catch(e => catchErr(msg, chan.name, e));
                    } else {
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

        await nextState();





        //Finished Loading
        const end = new Date();
        var span = (end.getTime() - start.getTime()) / 1000;
        return msg.channel.send(rawEmb().setColor(colors.success).setTitle("Finished Restoing uwu").setFooter("Took " + Math.floor(span * 10) / 10 + " seconds"));
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