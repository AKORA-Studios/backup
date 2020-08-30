"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
const fs = require("fs");
const os = require("os");
module.exports = new classes_1.Command({
    name: 'Botinfo',
    syntax: 'botinfo',
    args: false,
    description: 'Shows you informations about this bot',
    module_type: 'info',
    triggers: ['botinfo'],
    user_permissions: [],
    bot_permissions: []
}, async (msg, args) => {
    var emb = utilities_1.newEmb(msg).setColor(utilities_1.colors.info);
    var { version, dependencies } = JSON.parse(fs.readFileSync("../package.json").toString());
    const memory = process.memoryUsage(), size_gb = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 10) / 10, used_mb = Math.round((memory.heapUsed / 1024 / 1024) * 10) / 10;
    child_process_1.exec("node -v", function (error, node_ver, stderr) {
        emb.addField("Version", "`" + version + "`", true)
            .addField("NodeJS", "`" + node_ver + "`", true)
            .addField("Discord.JS", "`" + dependencies["discord.js"] + "`", true)
            .addField("Owner", "`" + msg.client.users.resolve("387655649934311427").tag + "`", false)
            .addField("Memory", "`" + size_gb + "GB / " + used_mb + "MB`")
            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/200px-Typescript_logo_2020.svg.png");
        msg.channel.send(emb);
    });
});
