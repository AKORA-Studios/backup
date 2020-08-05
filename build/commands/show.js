"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../typescript/utilities");
const classes_1 = require("../typescript/classes");
//let a = new module();
module.exports = new classes_1.Command({
    name: 'save',
    syntax: 'save [minimal]',
    args: false,
    description: 'qwq',
    module_type: 'misc',
    triggers: ['save', 'save-guild'],
    user_permissions: ['ADMINISTRATOR'],
    bot_permissions: ['ADMINISTRATOR']
}, async (msg, args) => {
    var emb = utilities_1.newEmb(msg).setTitle("Exported Guild as JSON file").setColor(utilities_1.colors.success);
    msg.channel.send(emb);
    msg.channel.send(attachment);
});
