"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
//let a = new module();
module.exports = new classes_1.Command({
    name: 'Encryption',
    syntax: 'securemsg <@user>',
    args: false,
    description: 'qwq',
    module_type: 'fun',
    triggers: ['securemsg', 'smsg'],
    user_permissions: [],
    bot_permissions: []
}, async (msg, args) => {
    if (!msg.mentions.users.first())
        return msg.channel.send("misssing Mention");
    let encoded = utilities_1.encode_text(msg.content, msg.author.id, msg.mentions.users.first().id);
    let decoded = utilities_1.decode_text(encoded, msg.author.id, msg.mentions.users.first().id);
    msg.channel.send("**Encoded:**");
    msg.channel.send(encoded);
    msg.channel.send("**Decoded:**");
    msg.channel.send(decoded);
});
