import { newEmb, colors } from '../typescript/utilities';
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Help Menu',
    syntax: 'help [command]',
    args: false,
    description: 'Shows the help menu, and help for single commands',
    module_type: 'info',
    triggers: ['help', 'h'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args, client) => {
        let emb = newEmb(msg);

        var commands = client.commands;

        if (args[0]) {
            var command = commands.find(cmd => cmd.properties.triggers.includes(args[0].toLowerCase()));
            if (!command) return msg.channel.send(emb.setTitle("Command not found ._.").setColor(colors.error));

            var props = command.properties,
                bot_perms = props.bot_permissions,
                user_perms = props.user_permissions;

            emb.setTitle(props.name)
                .setDescription(props.description + "\n\u200b")
                .addField("**Syntax:**", "`" + props.syntax + "`", true)
                .addField("**Triggers:**", props.triggers.map(v => "`" + v + "`").join(', '), true)
                .addField("**Required Bot Permissions:**", "```"
                    + bot_perms.join(', ')
                    + (bot_perms.length > 0 ? "" : "None")
                    + "```", false)

                .addField("**Required User Permissions:**", "```"
                    + user_perms.join(', ')
                    + (user_perms.length > 0 ? "" : "None")
                    + "```", false)
                .setFooter('<> required | [] optional')
                .setColor(colors.unimportant)

            msg.channel.send(emb);
        } else {
            var modules = commands.map((cmd) => cmd.properties.module_type).filter((mod, i, arr) => arr.indexOf(mod) == i);

            for (let mod of modules) {
                let cmds = commands.filter(cmd => cmd.properties.module_type == mod);
                emb.addField(`**${mod.toUpperCase()}**`, cmds.map(v => "`" + v.properties.triggers[0] + "`").join(', '));
            }

            emb.setColor(colors.unimportant)
                .addField('\u200b',
                    `[Bot Invite](https://discord.com/api/oauth2/authorize?client_id=${msg.client.user.id}&permissions=8&scope=bot)`,
                    true)
                .addField('\u200b', '[Support](https://discord.gg/Emk2udJ)', true)
            //.addField('\u200b', '[PBW](https://discord.gg/gtXeGtpxmE)', true)

            msg.channel.send(emb);
        }
    }
);
