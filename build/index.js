"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./typescript/classes");
const utilities_1 = require("./typescript/utilities");
const config_json_1 = require("./config.json");
const DBL = require("dblapi.js");
var client = new classes_1.Bot();
var dbl = new DBL(config_json_1.dbl_token, client);
client.prefix = config_json_1.prefix;
client.owner = config_json_1.owner;
client.command_path = "./commands";
client.token = config_json_1.token;
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
    const reload = new classes_1.Command({
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
        msg.channel.send(utilities_1.rawEmb().setDescription("Reloaded all modules").setColor(utilities_1.colors.success));
        client.commands.set("Reload", reload);
    });
    client.commands.set("Reload", reload);
});
async function guildCountUpdate(g, join) {
    dbl.postStats(client.guilds.cache.size);
    var emb = utilities_1.rawEmb()
        .setColor(join ? utilities_1.colors.success : utilities_1.colors.error)
        .setTimestamp();
    if (join) {
        g = await g.fetch();
        var owner = await client.users.fetch(g.ownerID);
        emb.setTitle(`Joined: ${g.name} [${client.guilds.cache.size}]`)
            .setFooter(owner.tag, owner.displayAvatarURL());
    }
    else {
        emb.setTitle(`Left: ${g.name} [${client.guilds.cache.size}]`);
    }
    client.channels.fetch("753474865104683110").then(c => c.send(emb));
}
client.on("guildCreate", g => guildCountUpdate(g, true));
client.on("guildDelete", g => guildCountUpdate(g, false));
client.login(client.token);
