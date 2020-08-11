import { confirmAction } from "../typescript/utilities";
import { Command } from "../typescript/classes";

module.exports = new Command({
    name: 'test_confirm',
    syntax: 'test_confirm',
    args: false,
    description: 'Ping!',
    module_type: 'backup',
    triggers: ['test', 'confirm'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (msg, args) => {
        confirmAction(msg, "Ja oda nein?", (m) => m.channel.send("QwQ"), (m) => m.channel.send("qwq"));
        msg.client.emit("guildMemberAdd", msg.member)
    }
);