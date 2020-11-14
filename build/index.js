"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./typescript/classes");
const utilities_1 = require("./typescript/utilities");
const config_json_1 = require("./config.json");
const DBL = require("dblapi.js");
const discord_js_1 = require("discord.js");
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
client.on("guildCreate", g => dbl.postStats(client.guilds.cache.size));
client.on("guildDelete", g => dbl.postStats(client.guilds.cache.size));
client.on("message", async (msg) => {
    if (msg.channel.type !== "text")
        return;
    if (!(msg.channel instanceof discord_js_1.TextChannel))
        return;
    var msg_link_regex = /https:\/\/(discord|discordapp)\.com\/channels\/([0-9]{18})\/([0-9]{18})\/([0-9]{18})/g, id_regex = /([0-9]{18})/g, emb = new discord_js_1.MessageEmbed().setFooter(msg.author.tag, msg.author.displayAvatarURL());
    var links = msg.content.match(msg_link_regex);
    if (links === null)
        return;
    for (let i = 0; i < links.length; i++) {
        var link = links[i], ids = link.match(id_regex);
        if (ids === null || ids.length < 3)
            return;
        try {
            var guild = await client.guilds.fetch(ids[0]).catch();
            if (!guild)
                return;
            var channel = guild.channels.resolve(ids[1]);
            if (!channel || channel.type !== "text")
                return;
            var message = await channel.messages.fetch(ids[2]).catch();
            if (!message)
                return;
            emb.setAuthor(message.author.tag, message.author.displayAvatarURL());
            emb.setColor(utilities_1.colors.unimportant);
            emb.setDescription(message.content);
        }
        catch (e) {
            //If something is wrong
            emb.setTitle("Invalid");
            emb.setColor(utilities_1.colors.error);
            return;
        }
        msg.channel.send(emb).catch();
    }
});
client.login(client.token);
