import { newEmb, colors } from '../typescript/utilities';
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Help Menu',
    syntax: 'help [command]',
    args: false,
    description: 'Shows the Help menu, and help for single commands',
    module_type: 'info',
    triggers: ['help', 'h'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
},

    async (msg, args, client) => {
        //Getting the file from the User
        let emb = newEmb(msg)
            .setTitle(`Modul Hilfe`);

        var commands = client.commands;

        if (args[0]) {
            var command = commands.find(cmd => cmd.properties.triggers.includes(args[0].toLowerCase()));
            if (!command) return msg.channel.send(emb.setTitle("Befehl nicht gefunden qwq").setColor(colors.error));

            emb.addField("**Name:**", command.properties.name)
                .addField("**Syntax:**", command.properties.syntax)
                .addField("**Beschreibung:**", command.properties.description)
                .setFooter(command.properties.triggers.join(', '))

            msg.channel.send(emb);
        } else {
            var modules = commands.map((cmd) => cmd.properties.module_type).filter((mod, i, arr) => arr.indexOf(mod) == i);

            for (let mod of modules) {
                let cmds = commands.filter(cmd => cmd.properties.module_type == mod);
                emb.addField(`**${mod.toUpperCase()}**`, cmds.map(v => `\`${v.properties.triggers[0]}\``).join(', '));
            }

            msg.channel.send(emb.setTitle("Hilfsmenü"));
        }
    }
);
