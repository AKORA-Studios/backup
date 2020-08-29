import { colors, confirmAction, getFile, importGuild, newEmb } from "../typescript/utilities";
import { Command } from "../typescript/classes";

module.exports = new Command({
    name: 'Load',
    syntax: 'load',
    args: false,
    description: 'Loads your Backup',
    module_type: 'backup',
    triggers: ['load', 'apply'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (msg, args) => {
        getFile(msg, "Please send me your backup file", 30000, (obj) => {
            var struc = importGuild(obj),
                { guild } = msg;

            msg.channel.send(newEmb(msg)
                .setColor(colors.warning)
                .setTitle("WARNING")
                .setDescription("If you're not **110%** sure its the right backup use the `show` command to verify it is, or create a new one with the `save` command")
            );

            confirmAction(msg, "Please Confirm you want to load the Backup", (m) => {
                m.channel.send("QwQ");
            }, (m) => {
                m.channel.send("qwq")
            });
        }, () => {

        })
    }
);