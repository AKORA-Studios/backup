import { Bot, Command } from "./typescript/classes";
import { colors, rawEmb } from "./typescript/utilities";
import { prefix, tokens, owner, dbl_token } from './config.json';

import * as DBL from "dblapi.js";
import { TextChannel, MessageEmbed, Guild } from "discord.js";

var main = new Bot();
var dbl = new DBL(dbl_token, main);

main.prefix = prefix;
main.owner = owner;
main.command_path = "./commands";
main.token = tokens[0];

main.loadCommands(main.command_path);

main.on('ready', () => {
    //For Top.gg stats
    dbl.postStats(main.guilds.cache.size);
    setInterval(() => {
        //Sending the stats to top.gg
        dbl.postStats(main.guilds.cache.size);
    }, 30 * 60 * 1000);

    ready(main)
});

function ready(client: Bot) {
    client.setErrorChannel(714557180757409942);
    client.user.setPresence({
        activity: {
            name: 'with some backups',
            type: 'PLAYING'
        },
        status: 'idle'
    });

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
}

async function guildCountUpdate(g: Guild, join: boolean) {
    dbl.postStats(main.guilds.cache.size);
    var emb = rawEmb()
        .setColor(join ? colors.success : colors.error)
        .setTimestamp();

    if (join) {
        g = await g.fetch();
        var owner = await main.users.fetch(g.ownerID);

        emb.setTitle(`Joined: ${g.name} [${main.guilds.cache.size}]`)
            .setFooter(owner.tag, owner.displayAvatarURL())
    } else {
        emb.setTitle(`Left: ${g.name} [${main.guilds.cache.size}]`)
    }


    main.channels.fetch("753474865104683110").then(c => (c as TextChannel).send(emb))
}

main.on("guildCreate", g => guildCountUpdate(g, true));
main.on("guildDelete", g => guildCountUpdate(g, false));

main.login(main.token);


//Childs
var childs: Bot[] = [];
for (const token of tokens.slice(1)) {
    var child = new Bot();

    child.prefix = prefix;
    child.owner = owner;
    child.command_path = "./commands";
    child.token = token;

    child.loadCommands(child.command_path);
    child.on('ready', () => ready(child));

    childs.push(child);
    child.login(token);
}
