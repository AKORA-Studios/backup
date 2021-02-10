import { newEmb, colors, emojis, rawEmb, code } from '../typescript/utilities';
import { Command } from "../typescript/classes";
import { MessageAttachment } from 'discord.js';


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
        var input = args.join(' ');

        let emb = newEmb(msg).setColor(colors.info),
            output = "";


        var obj = {
            message: msg,
            colors,
            emojis,
            rawEmb: rawEmb
        }
        for (const key in obj) {
            //@ts-ignore
            this[key] = obj[key]
        }

        try {
            output = eval(input);
        } catch (e) {
            output = e;
        }

        emb.addField("**Code:**", code(input), false);
        emb.addField("**Output:**", code(output), false);

        msg.channel.send(emb).catch(r => {
            var inp = new MessageAttachment(Buffer.from(input, 'utf8'), 'input.txt'),
                out = new MessageAttachment(Buffer.from(output, 'utf8'), 'output.txt'),
                emb = rawEmb().setColor(colors.info).setTitle('Output too large');
            msg.channel.send([emb, inp, out]).catch();
        });
    }
);