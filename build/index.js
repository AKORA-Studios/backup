"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./typescript/classes");
const utilities_1 = require("./typescript/utilities");
const client = new classes_1.Bot();
const { prefix, token, test_token, owner } = require('./config.json');
const { MessageEmbed } = require("discord.js");

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
});

client.on("message", async (msg) => {
    if (msg.channel.type !== "text") return;

    var msg_link_regex = /https:\/\/discordapp.com\/channels\/([0-9]{18})\/([0-9]{18})\/([0-9]{18})/g,
        id_regex = /([0-9]{18})/g;

    var links = msg.content.match(msg_link_regex),
        link_ids = links.map(v => v.match(id_regex));

    for (let i = 0; i < links.length; i++) {
        var link = links[i],
            ids = link_ids[i];

        var guild = await client.guilds.fetch(ids[0]);
        if (!guild) return;

        var channel = await guild.channels.resolve(ids[1]);
        if (!channel || channel.type !== "text") return;

        var message = await channel.messages.fetch(ids[2]);
        if (!message) return:

        var emb = new MessageEmbed();
        emb.setAuthor(message.author.tag, message.author.displayAvatarURL());
        emb.setDescription(msg.content);

    }

});

client.login(client.token);
