"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
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
    try {
        output = eval.call({
            msg,
            message: msg,
            colors: utilities_1.colors,
            emojis: utilities_1.emojis,
            rawEmb: utilities_1.rawEmb
        }, code);
    }
    catch (e) {
        output = e;
    }
    emb.addField("**Code:**", "```" + code + "```", false);
    emb.addField("**Output:**", "```" + output + "```", false);
    msg.channel.send(emb);
});
