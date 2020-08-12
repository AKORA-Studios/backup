import { newEmb, colors } from '../typescript/utilities';
import { Command } from "../typescript/classes";


module.exports = new Command({
  name: 'Eval',
  syntax: 'eval <JS Code>',
  args: false,
  description: 'Evaluates a Javascript expression',
  module_type: 'developer',
  triggers: ['eval'],
  user_permissions: ['SEND_MESSAGES'],
  bot_permissions: ['SEND_MESSAGES']
},

  async (msg, args) => {
    var code = args.join(' ');

    const func = () => eval(code);

    let emb = newEmb(msg).setColor(colors.info);
    emb.addField("**Code:**", "```" + code + "```", false);
    emb.addField("**Output:**", "```" + (await func.call({
      msg: msg,
      message: msg
    })) + "```", false);

    msg.channel.send(emb);
  }
);