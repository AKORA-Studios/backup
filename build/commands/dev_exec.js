"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Execute',
    syntax: 'execute <command>',
    args: true,
    description: 'Executes commands on the host machine',
    module_type: 'developer',
    triggers: ['execute', 'exec'],
    user_permissions: [],
    bot_permissions: []
}, async (msg, args) => {
    var command = args.join(' ');
    child_process_1.exec(command, function (error, stdout, stderr) {
        let emb = utilities_1.newEmb(msg).setTitle("Executed Command:");
        emb.addField("**Command:**", "```" + command + "```").setColor(utilities_1.colors.info);
        if (error != null)
            emb.addField("**Error:**", "```" + error.message + "```");
        if (stdout != "")
            emb.addField("**Stdout:**", "```" + stdout + "```");
        if (stderr != "")
            emb.addField("**Stderr:**", "```" + stderr + "```").setColor(utilities_1.colors.error);
        msg.channel.send(emb);
    });
});
