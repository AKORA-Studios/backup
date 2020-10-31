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

        let emb = newEmb(msg).setColor(colors.info),
            output = "";

        try {
            output = (() => eval(code)).call(Object.keys({
                msg: msg,
                message: msg,
                colors: colors,
                emojis: emojis,
                rawEmb: rawEmb
            }));
        } catch (e) {
            output = e;
        }

        emb.addField("**Code:**", "```" + code + "```", false);

        emb.addField("**Output:**", "```" + output + "```", false);

        msg.channel.send(emb);
    }
);