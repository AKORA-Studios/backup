import { newEmb, colors, emojis, rawEmb } from '../typescript/utilities';
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Eval',
    syntax: 'eval <JS Code>',
    args: true,
    description: 'Evaluates a Javascript expression',
    module_type: 'developer',
    triggers: ['eval'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        var code = args.join(' ');

        let emb = newEmb(msg).setColor(colors.info);
        emb.addField("**Code:**", "```" + code + "```", false);

        emb.addField("**Output:**", "```" + (await evalInContext(code, {
            msg: msg,
            message: msg,
            colors: colors,
            emojis: emojis,
            rawEmb: rawEmb
        })) + "```", false);

        msg.channel.send(emb);
    }
);

function evalInContext(js: string, context: Object) {
    return function () { return eval(js); }.call(context);
}