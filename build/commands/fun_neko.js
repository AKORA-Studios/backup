"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const bent = require("bent");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Neko',
    syntax: 'neko',
    args: false,
    description: 'Sends you a Neko',
    module_type: 'fun',
    triggers: ['neko'],
    user_permissions: ['SEND_MESSAGES'],
    bot_permissions: ['SEND_MESSAGES']
}, async (msg, args) => {
    const getString = bent('string');
    //Downloading the File
    try {
        var res = await getString("https://nekos.life/api/v2/img/neko");
        //Parsing
        try {
            var json = JSON.parse(res);
            msg.channel.send(utilities_1.newEmb(msg).setColor(utilities_1.colors.success).setImage(json.url).setTitle("Neko (,,◕　⋏　◕,,)"));
        }
        catch (err) {
            console.log(err);
            msg.channel.send(utilities_1.newEmb(msg).setColor(utilities_1.colors.error).setTitle("There was an error extracting the Neko :0"));
        }
    }
    catch (err) {
        console.log(err);
        msg.channel.send(utilities_1.newEmb(msg).setColor(utilities_1.colors.error).setTitle("There was an error catching a Neko >~>"));
    }
});
