import { exec } from 'child_process';
import { newEmb, colors, code } from '../typescript/utilities';
import { Command } from "../typescript/classes";

module.exports = new Command({
    name: 'Execute',
    syntax: 'execute <command>',
    args: true,
    description: 'Executes commands on the host machine',
    module_type: 'developer',
    triggers: ['execute', 'exec'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        var command = args.join(' ');

        exec(command, function (error, stdout, stderr) {
            let emb = newEmb(msg).setTitle("Executed Command:");
            emb.addField("**Command:**", code(command)).setColor(colors.info);
            if (error != null) emb.addField("**Error:**", code(error.message));
            if (stdout != "") emb.addField("**Stdout:**", code(stdout));
            if (stderr != "") emb.addField("**Stderr:**", code(stderr)).setColor(colors.error);

            msg.channel.send(emb);
        });
    }
);