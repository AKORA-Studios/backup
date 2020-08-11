"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTree = exports.getFile = exports.assignValues = exports.importGuild = exports.exportGuild = exports.decode_text = exports.encode_text = exports.checkPermissionOverlap = exports.rawEmb = exports.newEmb = exports.confirmAction = exports.colors = void 0;
const discord_js_1 = require("discord.js");
const structures_1 = require("./structures");
const bent = require("bent");
const getString = bent('string');
exports.colors = {
    error: 0xF91A3C,
    info: 0x1AE3F9,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    unimportant: 0x738F8A
};
exports.confirmAction = (msg, text, confirm, cancel) => {
    var emb = exports.newEmb(msg);
    emb.setTitle('Bestätigung').setDescription(text);
    msg.channel.send(emb).then(async (message) => {
        emb = exports.newEmb(msg);
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌')
                && user.id === msg.author.id;
        };
        const collector = message.createReactionCollector(filter, { maxEmojis: 1, time: 5000 });
        var check = await message.react('✅').catch();
        var abort = await message.react('❌').catch();
        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case '✅':
                    emb.setTitle('Confirmed uwu');
                    abort.remove().catch();
                    message.edit(emb.setColor(exports.colors.success)).then(m => {
                        confirm(m);
                    });
                    break;
                case '❌':
                    emb.setTitle('Cancled qwq');
                    check.remove().catch;
                    message.edit(emb.setColor(exports.colors.error)).then(m => {
                        cancel(m);
                    });
                    break;
            }
        });
        collector.on('end', collected => {
            if (collected.size > 0)
                return;
            emb.setTitle('Cancled qwq');
            check.remove().catch;
            message.edit(emb.setColor(exports.colors.error)).then(m => {
                cancel(m);
            });
        });
        collector.on;
    });
};
exports.newEmb = (msg) => {
    let client = msg.client.user || msg.author;
    return new discord_js_1.MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setFooter(client.tag, client.displayAvatarURL())
        .setTimestamp(new Date());
};
exports.rawEmb = (msg) => {
    return new discord_js_1.MessageEmbed()
        .setTimestamp(new Date());
};
/**
 * Checks if the pool contains perms
 * Pool is usually the Array of permission that Someone has,
 * While perms is the set of needed permissions
 * if the pool contains all ppermissions from perms the function return true
 */
exports.checkPermissionOverlap = (perms, pool) => {
    for (let perm of perms) {
        if (!pool.includes(perm))
            return false;
    }
    return true;
};
/**
 * @param {string} text
 * @param {string} id
 * @param {string} sec_id
 */
exports.encode_text = (text, id, sec_id) => {
    let encoded = "";
    for (let i = 0; i < text.length; i++) {
        let char_code = text.charCodeAt(i);
        char_code += Number(id.charAt(i % (id.length - 1)));
        char_code += Number(sec_id.charAt(i % (id.length - 1)));
        encoded += String.fromCharCode(char_code);
    }
    return encoded;
};
exports.decode_text = (text, id, sec_id) => {
    let decoded = "";
    for (let i = 0; i < text.length; i++) {
        let char_code = text.charCodeAt(i);
        char_code -= Number(id.charAt(i % (id.length - 1)));
        char_code -= Number(sec_id.charAt(i % (id.length - 1)));
        decoded += String.fromCharCode(char_code);
    }
    return decoded;
};
exports.exportGuild = async (guild) => {
    var structure = new structures_1.GuildStructure();
    //The Hard Coded Stuff qwq
    structure.name = guild.name;
    structure.afkChannelID = guild.afkChannelID;
    structure.afkTimeout = guild.afkTimeout;
    structure.defaultMessageNotifications = guild.defaultMessageNotifications;
    structure.description = guild.description;
    structure.explicitContentFilter = guild.explicitContentFilter;
    structure.iconURL = guild.iconURL();
    structure.mfaLevel = guild.mfaLevel;
    structure.ownerID = guild.ownerID;
    structure.publicUpdatesChannelID = guild.publicUpdatesChannelID;
    structure.region = guild.region;
    structure.rulesChannelID = guild.rulesChannelID;
    structure.systemChannelFlags = guild.systemChannelFlags.toArray();
    structure.systemChannelID = guild.systemChannelID;
    structure.verificationLevel = guild.verificationLevel;
    structure.widgetChannelID = guild.widgetChannelID;
    structure.widgetEnabled = guild.widgetEnabled;
    //Emojis
    var emojis = guild.emojis.cache.array();
    structure.emojis = emojis.map(g_e => {
        let e = new structures_1.EmojiStructure();
        e.id = g_e.id;
        e.name = g_e.name;
        e.url = g_e.url;
        return e;
    });
    //Roles
    var roles = (await guild.roles.fetch()).cache.array().sort((a, b) => a.position - b.position);
    structure.roles = roles.filter(r => {
        if (r.managed)
            return false;
        return true;
    }).map(g_r => {
        let r = new structures_1.RoleStructure();
        r.color = g_r.hexColor;
        r.hoist = g_r.hoist;
        r.id = g_r.id;
        r.mentionable = g_r.mentionable;
        r.name = g_r.name;
        r.permissions = g_r.permissions.toArray();
        //r.position = g_r.position;
        return r;
    });
    //Channels
    var channels = guild.channels.cache.array().sort((a, b) => a.position - b.position);
    structure.channels = channels.map(g_c => {
        let c = new structures_1.ChannelStructure();
        c.id = g_c.id;
        c.name = g_c.name;
        c.permissionOverwrites = g_c.permissionOverwrites.array();
        c.permissionsLocked = g_c.permissionsLocked;
        //c.position = g_c.position;
        c.type = g_c.type;
        return c;
    });
    return structure;
};
exports.importGuild = (obj) => {
    var structure = new structures_1.GuildStructure();
    for (var i in obj) {
        structure[i] = obj[i];
    }
    return structure;
};
/**
 * Asign Values of b to Object A
 */
exports.assignValues = (a, b) => {
    for (var i in a)
        a[i] = b[i];
    return a;
};
//Getting File
exports.getFile = async (msg, text, timeout, succes, failure) => {
    //Getting the file from the User
    var emb = exports.newEmb(msg).setColor(exports.colors.info);
    emb.setTitle(text)
        .setDescription("*Write* `cancel` *to abort*")
        .setFooter(`I will wait ${timeout} Seconds`);
    await msg.channel.send(emb);
    //Creating The Collector
    var collector = msg.channel.createMessageCollector((m) => m.author.id == msg.author.id, {
        time: timeout * 1000,
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
        //Converting value to String
        if (file instanceof Buffer)
            url = file.toString('utf8');
        else if (typeof file == 'string')
            url = file;
        else
            url = (await streamToString(file)) + "";
        //Downloading the File
        try {
            var res = await getString(url);
            //Parsing
            try {
                var json = JSON.parse(res);
                succes(json);
            }
            catch (err) {
                console.log(err);
                m.channel.send(exports.newEmb(m).setColor(exports.colors.error).setTitle("There was an error parsing your file ._."));
                return failure();
            }
        }
        catch (err) {
            console.log(err);
            m.channel.send(exports.newEmb(m).setColor(exports.colors.error).setTitle("There was an error downloading your file ._."));
            return failure;
        }
    });
};
function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}
//Tree Generation
/*
╔══╦══╗
║  ║  ║
╠══╬══╣
║  ║  ║
╚══╩══╝

Name
╠══ Roles
║   ╠═ Role
║   ╚═ Role
║
╚══ Channels
    ╠═ Category1
    ║  ╠═ Channel
    ║  ╚═ Channel
    ║
    ╚═ Category2
        ╠═ Channel
        ╚═ Channel
*/
exports.generateTree = (structure) => {
    var tree = "";
    let i = 0;
    tree += structure.name + "\n"; //Linebreak
    //Roles
    tree += "╠══ Roles \n";
    var roles = structure.roles.reverse();
    for (i = 0; i < roles.length - 1; i++) {
        let role = roles[i];
        tree += "║   ╠═ " + role.name + "\n"; //Linebreak
    }
    tree += "║   ╚═ " + roles[i].name + "\n";
    tree += "║ \n";
    //Channels without Category
    tree += "╠══ Channels \n";
    var channels = structure.channels.reverse();
    for (i = 0; i < channels.length - 1; i++) {
        let channel = channels[i];
        if (channel.type === "category") {
            tree += "║   ╠═ " + channels[i].name + "\n";
            i++;
            while (i < channels.length && channels[i].type !== 'category') {
                tree += "║        ╠═ " + channels[i].name + "\n";
                i++;
            }
        }
        tree += "║   ╠═ " + channel.name + "\n"; //Linebreak
    }
    return tree;
};
