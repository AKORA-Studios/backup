import { Bot, Command } from "./typescript/classes";
import { colors, rawEmb } from "./typescript/utilities";
import { prefix, token, owner, dbl_token } from './config.json';

import * as DBL from "dblapi.js";
import { TextChannel, MessageEmbed, Guild } from "discord.js";

var client = new Bot();
var dbl = new DBL(dbl_token, client);

client.prefix = prefix;
client.owner = owner;
client.command_path = "./commands";
client.token = token;

client.loadCommands(client.command_path);

client.on("ready", () => {
    client.setErrorChannel(714557180757409942);
    client.user.setPresence({
        activity: {
            name: 'with some backups',
            type: 'PLAYING'
        },
        status: 'idle'
    });

    //For Top.gg stats
    dbl.postStats(client.guilds.cache.size);
    setInterval(() => {
        //Sending the stats to top.gg
        dbl.postStats(client.guilds.cache.size);
    }, 30 * 60 * 1000);

    const reload = new Command({
        name: 'Reload',
        syntax: 'reload',
        args: false,
        description: 'Reloads all commands',
        module_type: 'developer',
        triggers: ['reload'],
        user_permissions: [],
        bot_permissions: []
    }, async (msg) => {
        client.loadCommands(client.command_path);
        msg.channel.send(rawEmb().setDescription("Reloaded all modules").setColor(colors.success));
        client.commands.set("Reload", reload);
    })
    client.commands.set("Reload", reload)
});

function guildCountUpdate(g: Guild, join: boolean) {
    dbl.postStats(client.guilds.cache.size)

    client.channels.fetch("753474865104683110").then(c => (c as TextChannel).send(
        rawEmb()
            .setTitle(`Guild ${join ? 'Joined' : 'Left'} [${client.guilds.cache.size}]`)
            .setColor(join ? colors.success : colors.error)
    ))
}

client.on("guildCreate", g => guildCountUpdate(g, true));
client.on("guildDelete", g => guildCountUpdate(g, false));

client.on("message", async (msg) => {
    if (msg.channel.type !== "text") return;
    if (!(msg.channel instanceof TextChannel)) return;

    var msg_link_regex = /https:\/\/(discord|discordapp)\.com\/channels\/([0-9]{18})\/([0-9]{18})\/([0-9]{18})/g,
        id_regex = /([0-9]{18})/g,
        emb = new MessageEmbed().setFooter(msg.author.tag, msg.author.displayAvatarURL());

    var links = msg.content.match(msg_link_regex);
    if (links === null) return;

    for (let i = 0; i < links.length; i++) {
        var link = links[i],
            ids = link.match(id_regex);

        if (ids === null || ids.length < 3) return;

        try {
            var guild = await client.guilds.fetch(ids[0]).catch();
            if (!guild) return;

            var channel = guild.channels.resolve(ids[1]) as TextChannel;
            if (!channel || channel.type !== "text") return;

            var message = await channel.messages.fetch(ids[2]).catch();
            if (!message) return;

            emb.setAuthor(message.author.tag, message.author.displayAvatarURL())
            emb.setColor(colors.unimportant);
            emb.setDescription(message.content);
        } catch (e) {
            //If something is wrong
            emb.setTitle("Invalid");
            emb.setColor(colors.error);
            return;
        }

        msg.channel.send(emb).catch();
    }
});

client.login(client.token);
