"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const https_1 = require("https");
const classes_1 = require("../typescript/classes");
const discord_js_1 = require("discord.js");
//let a = new module();
module.exports = new classes_1.Command({
    name: 'save',
    syntax: 'show [minimal]',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['show'],
    user_permissions: ['ADMINISTRATOR'],
    bot_permissions: ['ADMINISTRATOR']
}, async (msg, args) => {
    //Getting the file from the User
    var emb = utilities_1.newEmb(msg).setColor(utilities_1.colors.info);
    emb.setTitle("Please send me your JSON File uwu").setDescription("*Write* `cancel` *to abort*").setFooter("I will wait 30 Seconds");
    await msg.channel.send(emb);
    var collector = msg.channel.createMessageCollector((m) => m.author.id == msg.author.id, {
        time: 30000,
    });
    collector.on('collect', async (m) => {
        //Canceling
        if (m.content.toLowerCase().includes("cancel")) {
            m.reply("Action canceled");
            return collector.stop("Canceled");
        }
        //Check for Attachment
        if (m.attachments.size < 1)
            return m.reply("You need to send a File");
        //Getting File
        var attachment = m.attachments.first(), file = attachment.attachment, url = "";
        if (file instanceof Buffer)
            url = file.toString('utf8');
        else if (typeof file == 'string')
            url = file;
        else
            url = (await streamToString(file)) + "";
        var text = "";
        //Downloading the File
        try {
            https_1.get(url, (res) => {
                res.on('data', (chunk) => {
                    text += chunk + "";
                });
            }).on("finish", () => {
                //Parsing
                try {
                    console.log(text);
                    var json = JSON.parse(text);
                    var buffer = Buffer.from(JSON.stringify(json, null, 4), 'utf8');
                    var att = new discord_js_1.MessageAttachment(buffer, 'qwq.json');
                    msg.channel.send(att);
                }
                catch (err) {
                    console.log(err);
                    return m.channel.send(utilities_1.newEmb(m).setColor(utilities_1.colors.error).setTitle("There was an error parsing your file ._."));
                }
            });
        }
        catch (err) {
            console.log(err);
            return m.channel.send(utilities_1.newEmb(m).setColor(utilities_1.colors.error).setTitle("There was an error downloading your file ._."));
        }
    });
});
function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}
