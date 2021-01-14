"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
const discord_js_1 = require("discord.js");
module.exports = new classes_1.Command({
    name: 'Eval',
    syntax: 'eval <JS Code>',
    args: true,
    description: 'Evaluates a Javascript expression',
    module_type: 'developer',
    triggers: ['eval'],
    user_permissions: [],
    bot_permissions: []
}, async (msg, args) => {
    var code = args.join(' ');
    let emb = utilities_1.newEmb(msg).setColor(utilities_1.colors.info), output = "";
    var obj = {
        message: msg,
        colors: utilities_1.colors,
        emojis: utilities_1.emojis,
        rawEmb: utilities_1.rawEmb
    };
    for (const key in obj) {
        //@ts-ignore
        this[key] = obj[key];
    }
    try {
        output = eval(code);
    }
    catch (e) {
        output = e;
    }
    emb.addField("**Code:**", "```" + code + "```", false);
    emb.addField("**Output:**", "```" + output + "```", false);
    msg.channel.send(emb).catch(r => {
        var inp = new discord_js_1.MessageAttachment(Buffer.from(code, 'utf8'), 'output.txt'), out = new discord_js_1.MessageAttachment(Buffer.from(output, 'utf8'), 'output.txt'), emb = utilities_1.rawEmb().setColor(utilities_1.colors.info).setTitle('Output too large');
        msg.channel.send([emb, inp, out]).catch();
    });
});
