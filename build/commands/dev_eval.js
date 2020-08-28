"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Eval',
    syntax: 'eval <JS Code>',
    args: false,
    description: 'Evaluates a Javascript expression',
    module_type: 'developer',
    triggers: ['eval'],
    user_permissions: [],
    bot_permissions: []
}, async (msg, args) => {
    var code = args.join(' ');
    const func = () => eval(code);
    let emb = utilities_1.newEmb(msg).setColor(utilities_1.colors.info);
    emb.addField("**Code:**", "```" + code + "```", false);
    emb.addField("**Output:**", "```" + (await func.call({
        msg: msg,
        message: msg
    })) + "```", false);
    msg.channel.send(emb);
});
