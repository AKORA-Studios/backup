import { Bot } from "./typescript/classes";
import { newEmb, colors } from "./typescript/utilities";
import { TextChannel, MessageEmbed } from "discord.js";

const client = new Bot();

import * as DBL from "dblapi.js";
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