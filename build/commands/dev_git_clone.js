"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
module.exports = new classes_1.Command({
    name: 'Git Update',
    syntax: 'git',
    args: false,
    description: 'Updates the Bot via git',
    module_type: 'developer',
    triggers: ['git', 'update'],
    user_permissions: [],
    bot_permissions: []
}, async (msg, args) => {
    child_process_1.exec("git pull", function (error, stdout, stderr) {
        let emb = utilities_1.newEmb(msg).setTitle("Cloned from Git, Results:").setColor(utilities_1.colors.info);
        if (error != null)
            emb.addField("**Error:**", "```" + error.message + "```");
        if (stdout != "")
            emb.addField("**Stdout:**", "```" + stdout + "```");
        if (stderr != "")
            emb.addField("**Stderr:**", "```" + stderr + "```");
        msg.channel.send(emb);
    });
});
//# sourceMappingURL=dev_git_clone.js.map