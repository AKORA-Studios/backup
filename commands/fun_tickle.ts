import { newEmb, colors } from '../typescript/utilities';
import * as bent from "bent";
import { Command } from "../typescript/classes";


module.exports = new Command({
    name: 'Tickle',
    syntax: 'tickle',
    args: false,
    description: 'Sends you a tickle gif uwu',
    module_type: 'fun',
    triggers: ['tickle'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {

        const getString = bent('string');

        //Downloading the File
        try {
            var res = await getString("https://nekos.life/api/v2/img/tickle")

            //Parsing
            try {
                var json = JSON.parse(res);

                msg.channel.send(newEmb(msg).setColor(colors.success).setImage(json.url).setTitle("Neko (,,◕　⋏　◕,,)"))
            } catch (err) {
                console.log(err);
                msg.channel.send(newEmb(msg).setColor(colors.error).setTitle("There was an error extracting the Neko :0"));
            }
        } catch (err) {
            console.log(err);
            msg.channel.send(newEmb(msg).setColor(colors.error).setTitle("There was an error catching a Neko >~>"));
        }
    }
);
