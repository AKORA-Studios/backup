"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./typescript/classes");
const utilities_1 = require("./typescript/utilities");
const discord_js_1 = require("discord.js");
const client = new classes_1.Bot();
const DBL = require("dblapi.js");
const dbl = new DBL('Your top.gg token', client);
const { prefix, token, test_token, owner } = require('./config.json');
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
    client.on('ready', () => {
        setInterval(() => {
            //Sending the stats to top.gg
            dbl.postStats(client.guilds.cache.size);
        }, 1800000);
    });
});
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
