import { colors, confirmAction, getFile, importGuild, newEmb, rawEmb, emojis } from "../typescript/utilities";
import { Command } from "../typescript/classes";
import { Message } from "discord.js";

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

    (message, args) => {
        getFile(message, "Please send me your backup file", 30, (obj) => {
            var struc = importGuild(obj),
                { guild } = message;

            message.channel.send(newEmb(message)
                .setColor(colors.warning)
                .setTitle("WARNING")
                .setDescription("If you're not **110%** sure this is the right backup use the `show` command to verify, or create a new one with the `save` command")
            );

            confirmAction(message, "Please Confirm you want to load this Backup", async () => {
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
                        await msg.guild.emojis.create(emoji.url, emoji.name, {
                            reason: reason
                        }).catch((e) => catchErr(msg, emoji.name, e));;//From URL To Buffer needs to be added
                    }
                }




                //Loading Roles
                text =
                    emojis.true + " Emojis\n"
                    + emojis.presence + " Roles\n"
                    + emojis.false + " Channels\n";

                await msg.edit(emb.setDescription(text));

                for (let role of struc.roles.reverse()) {
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
                        struc.roles[struc.roles.indexOf(role)].loadedID = r["id"];
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
                    for (let channel of struc.channels.filter(c => ["text", "store", "news"].includes(c.type))) {
                        let c = await msg.guild.channels.create(channel.name, {
                            permissionOverwrites: channel.permissionOverwrites.map(p => {
                                let r = struc.roles.find(r => r.id === p.id);
                                if (r) p.id = r.loadedID;
                                return p;
                            }),
                            topic: channel.topic,
                            type: channel.type,
                            nsfw: channel.nsfw,
                            position: struc.channels.indexOf(channel),
                            reason: reason
                        }).catch((e) => catchErr(msg, channel.name, e));

                        struc.channels[struc.channels.indexOf(channel)].loadedID = c["id"];
                    }

                    //Categorys
                    for (let category of struc.channels.filter(c => c.type === "category")) {
                        let cat = await msg.guild.channels.create(category.name, {
                            permissionOverwrites: category.permissionOverwrites.map(p => {
                                let r = struc.roles.find(r => r.id === p.id);
                                if (r) p.id = r.loadedID;
                                return p;
                            }),
                            type: category.type,
                            position: struc.channels.indexOf(category),
                            reason: reason
                        })
                            .then((c) => category.loadedID = c["id"])
                            .catch((e) => catchErr(msg, category.name, e));


                        for (let chan of category.childs) {
                            let c = await msg.guild.channels.create(chan.name, {
                                permissionOverwrites: chan.permissionOverwrites.map(p => {
                                    let r = struc.roles.find(r => r.id === p.id);
                                    if (r) p.id = r.loadedID;
                                    return p;
                                }),
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
    msg.channel.send(rawEmb(msg).setColor(colors.error).setTitle("Could'nt Load: " + str).setDescription(txt));
    return;
}