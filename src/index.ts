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

async function guildCountUpdate(g: Guild, join: boolean) {
    dbl.postStats(client.guilds.cache.size);
    var emb = rawEmb()
        .setColor(join ? colors.success : colors.error)
        .setTimestamp();

    if (join) {
        g = await g.fetch();
        var owner = await client.users.fetch(g.ownerID);

        emb.setTitle(`Joined: ${g.name} [${client.guilds.cache.size}]`)
            .setFooter(owner.tag, owner.displayAvatarURL())
    } else {
        emb.setTitle(`Left: ${g.name} [${client.guilds.cache.size}]`)
    }


    client.channels.fetch("753474865104683110").then(c => (c as TextChannel).send(emb))
}

client.on("guildCreate", g => guildCountUpdate(g, true));
client.on("guildDelete", g => guildCountUpdate(g, false));

client.login(client.token);
