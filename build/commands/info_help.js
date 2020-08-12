"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Help Menu',
    syntax: 'help [command]',
    args: false,
    description: 'Shows the Help menu, and help for single commands',
    module_type: 'info',
    triggers: ['help', 'h'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
}, async (msg, args, client) => {
    let emb = utilities_1.newEmb(msg);
    var commands = client.commands;
    if (args[0]) {
        var command = commands.find(cmd => cmd.properties.triggers.includes(args[0].toLowerCase()));
        if (!command)
            return msg.channel.send(emb.setTitle("Command not found ._.").setColor(utilities_1.colors.error));
        emb.setTitle(command.properties.name)
            .setDescription(command.properties.description + "\n\u200b")
            .addField("**Syntax:**", "`" + command.properties.syntax + "`", true)
            .addField("**Triggers:**", command.properties.triggers.map(v => "`" + v + "`").join(', '), true)
            .addField("**Required Bot Permissions:**", "```" + command.properties.bot_permissions.join(', ') + "```", false)
            .addField("**Required User Permissions:**", "```" + command.properties.user_permissions.join(', ') + "```", false)
            .setFooter('<> required | [] optional')
            .setColor(utilities_1.colors.unimportant);
        msg.channel.send(emb);
    }
    else {
        var modules = commands.map((cmd) => cmd.properties.module_type).filter((mod, i, arr) => arr.indexOf(mod) == i);
        for (let mod of modules) {
            let cmds = commands.filter(cmd => cmd.properties.module_type == mod);
            emb.addField(`**${mod.toUpperCase()}**`, cmds.map(v => `\`${v.properties.triggers[0]}\``).join(', '));
        }
        msg.channel.send(emb.setTitle("Commands").setColor(utilities_1.colors.unimportant));
    }
});
