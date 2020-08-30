import { exec } from 'child_process';
import { newEmb, colors } from '../typescript/utilities';
import { Command } from "../typescript/classes";
import * as fs from "fs";
import * as os from "os";

module.exports = new Command({
    name: 'Botinfo',
    syntax: 'botinfo',
    args: false,
    description: 'Shows you informations about this bot',
    module_type: 'info',
    triggers: ['botinfo'],
    user_permissions: [],
    bot_permissions: []
},

    async (msg, args) => {
        var emb = newEmb(msg).setColor(colors.info);
        var { version, dependencies } = JSON.parse(fs.readFileSync("../package.json").toString());

        const memory = process.memoryUsage(),
            size_gb = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 10) / 10,
            used_mb = Math.round((memory.heapUsed / 1024 / 1024) * 10) / 10;

        exec("node -v", function (error, node_ver, stderr) {
            emb.addField("Version", "`" + version + "`", true)
                .addField("NodeJS", "`" + node_ver + "`", true)
                .addField("Discord.JS", "`" + dependencies["discord.js"] + "`", true)
                .addField("Owner", "`" + msg.client.users.resolve("387655649934311427").tag + "`", false)
                .addField("Memory", "`" + size_gb + "GB / " + used_mb + "MB`")

                .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/200px-Typescript_logo_2020.svg.png")

            msg.channel.send(emb);

        });
    }
);