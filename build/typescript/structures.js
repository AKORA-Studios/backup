"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiStructure = exports.RoleStructure = exports.ChannelStructure = exports.GuildStructure = void 0;
const discord_js_1 = require("discord.js");
var example = new discord_js_1.Guild(new discord_js_1.Client(), {});
example.afkChannel;
class GuildStructure {
    constructor() {
        this.savedAt = new Date().getTime();
    }
}
exports.GuildStructure = GuildStructure;
class ChannelStructure {
}
exports.ChannelStructure = ChannelStructure;
class RoleStructure {
}
exports.RoleStructure = RoleStructure;
class EmojiStructure {
}
exports.EmojiStructure = EmojiStructure;
