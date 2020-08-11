import { newEmb, importGuild, getFile, colors, generateTree } from '../typescript/utilities';
import * as bent from 'bent';
const getString = bent('string');
import { Command } from "../typescript/classes";
import * as fs from 'fs';
//let a = new module();


module.exports = new Command({
    name: 'Show',
    syntax: 'show [stored]',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['show'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
},

    async (msg, args) => {
        //Getting the file from the User
        if (args[0] && args[0].toLowerCase().includes('stored')) {
            try {
                let str = fs.readFileSync('./guild_saves/'+msg.guild.id+'.json').toString('utf8');
                let json = JSON.parse(str);
                var structure = importGuild(json);
    
                var info_emb = newEmb(msg).setTitle("Serverinfo").setColor(colors.info);
                var structure_emb = newEmb(msg).setTitle("Server Structure").setColor(colors.info);
    
                structure_emb.setDescription("```"+generateTree(structure)+"```")
    
                msg.channel.send(info_emb);
                msg.channel.send(structure_emb);
            } catch(e){
                msg.channel.send(newEmb(msg).setColor(colors.error).setTitle('Something went wrong ._.'));
            }
        } else {
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
    }
);
