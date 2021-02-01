import { colors, newEmb, rawEmb, confirmActionAsync } from "../typescript/utilities";
import { Command } from "../typescript/classes";
import { unlinkSync } from 'fs';

module.exports = new Command({
    name: 'Delete',
    syntax: 'delete [force]',
    args: false,
    description: "Delete your Backup. This command deletes your backup from my server so you cant use the `stored` option anymore, the backup will be gone FOREVER, your downloaded backups will still work tho.",
    module_type: 'backup',
    triggers: ['delete'],
    user_permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (msg, args) => {

        msg.channel.send(newEmb(msg)
            .setColor(colors.warning)
            .setTitle("WARNING")
            .setDescription("The backup will be gone **FOREVER**, confirm that you are **110%** sure that you want to delete this backup.")
        );

        try {
            await confirmActionAsync(msg, "Please Confirm you want to delete this Backup");
        } catch (e) { }

        try {
            unlinkSync('./guild_saves/' + msg.guild.id + '.json');
        } catch (e) { }

        return msg.channel.send(rawEmb().setColor(colors.success).setTitle("You backup was deleted succesfully"));
    }
);