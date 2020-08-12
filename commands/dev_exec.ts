import { exec } from 'child_process';
import { newEmb, colors } from '../typescript/utilities';
import { Command } from "../typescript/classes";


module.exports = new Command({
  name: 'Execute',
  syntax: 'execute <command>',
  args: false,
  description: 'Executess Commands on the Host machine',
  module_type: 'developer',
  triggers: ['execute', 'exec'],
  user_permissions: ['SEND_MESSAGES'],
  bot_permissions: ['SEND_MESSAGES']
},

  async (msg, args) => {
    var command = args.join(' ');

    exec(command, function (error, stdout, stderr) {
      let emb = newEmb(msg).setTitle("Executed Command:");
      emb.addField("**Command:**", "```" + command + "```").setColor(colors.info);
      if (error != null) emb.addField("**Error:**", "```" + error.message + "```");
      if (stdout != "") emb.addField("**Stdout:**", "```" + stdout + "```");
      if (stderr != "") emb.addField("**Stderr:**", "```" + stderr + "```").setColor(colors.error);

      msg.channel.send(emb);
    });
  }
);