import { colors, confirmAction, getFile, importGuild, newEmb, rawEmb, emojis, getFileAsync, confirmActionAsync } from "../typescript/utilities";
import { Command } from "../typescript/classes";
import { GuildEmoji, Message, PermissionOverwrites } from "discord.js";
import { RoleStructure } from "../typescript/structures";

module.exports = new Command({
    name: 'Load',
    syntax: 'load',
    args: false,
    description: 'Loads your Backup',
    module_type: 'backup',
    triggers: ['load', 'apply'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (message, args) => {
        try {
            var obj = await getFileAsync(message, "Please send me your backup file", 30);
        } catch (e) { return; }

        var struc = importGuild(obj),
            { guild } = message;

        message.channel.send(newEmb(message)
            .setColor(colors.warning)
            .setTitle("WARNING")
            .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command")
        );

        try {
            await confirmActionAsync(message, "Please Confirm you want to load this Backup");
        } catch (e) { return; }


        var emb = rawEmb().setColor(colors.success).setTitle("Loading Backup"),
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


        if (struc.emojis && struc.emojis.length > 0) {//Else Not interable
            var arr: Promise<GuildEmoji>[] = []
            for (const emoji of struc.emojis) {
                arr.push(msg.guild.emojis.create(emoji.url, emoji.name, {
                    reason: reason
                }));
                arr[arr.length - 1].catch((e) => catchErr(msg, emoji.name, e))
            }

            await Promise.all(arr)
        }
        await nextState();





        //Loading Roles
        await nextState();

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
            } else {
                msg.guild.roles.resolve(role.id).setPermissions(role.permissions);
            }
        }

        await nextState();





        //Loading Channels
        await nextState();

        if (struc.channels) {//Else Not interable
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

        await nextState();




        //Finished Loading
        const end = new Date();
        var span = (end.getTime() - start.getTime()) / 1000;
        return msg.channel.send(rawEmb().setColor(colors.success).setTitle("Finished Loading uwu").setFooter("Took " + Math.floor(span * 10) / 10 + " seconds"));
    }
);

function catchErr(msg: Message, str: string, txt: string) {
    msg.channel.send(rawEmb().setColor(colors.error).setTitle("Could'nt Load: " + str).setDescription(txt));
    return;
}

function mapPerms(perm: PermissionOverwrites, roles: RoleStructure[]): PermissionOverwrites {
    var role = roles.find(r => r.id === perm.id);
    if (role && role.loadedID) perm.id = role.loadedID;

    return perm;
}