import { exec } from 'child_process';
import { newEmb, colors, code } from '../typescript/utilities';
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Git Update',
    syntax: 'git',
    args: false,
    description: 'Updates the Bot via git',
    module_type: 'developer',
    triggers: ['git', 'update'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        exec("git pull", function (error, stdout, stderr) {
            let emb = newEmb(msg).setTitle("Cloned from Git, Results:").setColor(colors.info)
            if (error != null) emb.addField("**Error:**", code(error.message));
            if (stdout != "") emb.addField("**Stdout:**", code(stdout));
            if (stderr != "") emb.addField("**Stderr:**", code(stderr));

            msg.channel.send(emb);
        });
    }
);