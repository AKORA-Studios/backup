import { newEmb, importGuild, getFile, colors, generateTree } from '../typescript/utilities';
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

            var info_emb = newEmb(msg).setTitle("Serverinfo").setColor(colors.info);
            var structure_emb = newEmb(msg).setTitle("Server Structure").setColor(colors.info);

            structure_emb.setDescription("```"+generateTree(structure)+"```")

            msg.channel.send(info_emb);
            msg.channel.send(structure_emb);
        }, () => {

        });
    }
);
