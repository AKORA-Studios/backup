import { newEmb, importGuild, getFile, colors } from '../typescript/utilities';
import * as bent from 'bent';
const getString = bent('string');
import { Command } from "../typescript/classes";
import { MessageAttachment, Message, Collection } from 'discord.js';
//let a = new module();


module.exports = new Command({
    name: 'save',
    syntax: 'show [minimal]',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['show'],
    user_permissions: ['ADMINISTRATOR'],
    bot_permissions: ['ADMINISTRATOR']
},

    async (msg, args) => {
        //Getting the file from the User
        getFile(msg, "Send me your JSON File uwu", 30, (json) => {
            //Converting to GuildStructure Object
            var structure = importGuild(json);

            msg.channel.send(structure.iconURL);
        }, () => {

        });
    }
);
