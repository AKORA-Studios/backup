import { newEmb, colors } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Fun Fact',
    syntax: 'fact',
    args: false,
    description: 'Sends you a fun fact uwu',
    module_type: 'fun',
    triggers: ['fact', 'funfact'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {

        const getString = bent('string');

        //Downloading the File
        try {
            var res = await getString("https://nekos.life/api/v2/fact")

            //Parsing
            try {
                var json = JSON.parse(res);

                msg.channel.send(newEmb(msg).setColor(colors.success).setDescription("*" + json.fact + "*").setTitle("Fun Fact:"))
            } catch (err) {
                console.log(err);
                msg.channel.send(newEmb(msg).setColor(colors.error).setTitle("There was an error extracting the fact :0"));
            }
        } catch (err) {
            console.log(err);
            msg.channel.send(newEmb(msg).setColor(colors.error).setTitle("There was an error catching a funny fact >~>"));
        }
    }
);
