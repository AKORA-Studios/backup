import { confirmAction } from "../typescript/utilities";
import { Command } from "../typescript/classes";

module.exports = new Command({
    name: 'Load',
    syntax: 'load',
    args: false,
    description: 'Loads your Backup',
    module_type: 'backup',
    triggers: ['load', 'apply'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD']
},

    async (msg, args) => {
        confirmAction(msg, "DIESER BEFEHL BENENNT ALLE CHANNEL UM", (m) => {
            m.channel.send("QwQ");
            var channels = msg.guild.channels.cache.array();
            for (let chan of channels) {
                console.log(chan.parentID);
                chan.setName(`${chan.rawPosition}-${chan.position}-${chan.calculatedPosition}`);
            }
        }, (m) => {
            m.channel.send("qwq")
        });
        msg.client.emit("guildMemberAdd", msg.member)
    }
);