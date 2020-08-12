"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./typescript/classes");
const utilities_1 = require("./typescript/utilities");
const client = new classes_1.Bot();
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
});
client.on("message", (msg) => {
    if (msg.channel.type != "dm")
        return;
    if (msg.content.toLowerCase().startsWith("to: ")) {
        if (msg.mentions.users.first()) {
            let receiver = msg.mentions.users.first();
            let text = msg.content.slice(msg.content.indexOf(">") + 2);
            let encoded = utilities_1.encode_text(text, msg.author.id, receiver.id);
            msg.channel.send("**Encoded Message:**");
            msg.channel.send(encoded);
        }
        else {
            msg.reply("No mention found qwq");
        }
    }
    else if (msg.content.toLowerCase().startsWith("from: ")) {
        if (msg.mentions.users.first()) {
            let receiver = msg.mentions.users.first();
            let text = msg.content.slice(msg.content.indexOf(">") + 2);
            let decoded = utilities_1.decode_text(text, msg.author.id, receiver.id);
            msg.channel.send("**Decoded Message:**");
            msg.channel.send(decoded);
        }
        else {
            msg.reply("No mention found qwq");
        }
    }
});
client.login(client.token);
