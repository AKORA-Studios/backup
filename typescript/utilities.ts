import { Message, MessageEmbed, MessageReaction, User, PermissionString, Guild } from "discord.js";
import { GuildStructure, ChannelStructure, RoleStructure, EmojiStructure } from "./structures";
import * as bent from 'bent';
const getString = bent('string');

export const colors = {
    error: 0xF91A3C,
    info: 0x1AE3F9,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    unimportant: 0x738F8A
}

export const confirmAction = (msg: Message, text: string, confirm: (message: Message) => void, cancel: (message: Message) => void) => {
    var emb = newEmb(msg);

    emb.setTitle('Bestätigung').setDescription(text)

    msg.channel.send(emb).then(async message => {
        emb = newEmb(msg);

        const filter = (reaction: MessageReaction, user: User) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌')
                && user.id === msg.author.id;
        }

        const collector = message.createReactionCollector(filter, { maxEmojis: 1, time: 5000 });

        var check = await message.react('✅').catch();
        var abort = await message.react('❌').catch();

        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case '✅':
                    emb.setTitle('Confirmed uwu');
                    abort.remove().catch();

                    message.edit(emb.setColor(colors.success)).then(m => {
                        confirm(m);
                    });
                    break;
                case '❌':
                    emb.setTitle('Cancled qwq');
                    check.remove().catch;

                    message.edit(emb.setColor(colors.error)).then(m => {
                        cancel(m);
                    });
                    break;
            }
        });

        collector.on('end', collected => {
            if (collected.size > 0) return;

            emb.setTitle('Cancled qwq');
            check.remove().catch;

            message.edit(emb.setColor(colors.error)).then(m => {
                cancel(m);
            });
        });

        collector.on
    });
}

export const newEmb = (msg: Message) => {
    let client = msg.client.user || msg.author;
    return new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setFooter(client.tag, client.displayAvatarURL())
        .setTimestamp(new Date());
}

export const rawEmb = (msg: Message) => {
    return new MessageEmbed()
        .setTimestamp(new Date());
}

/**
 * Checks if the pool contains perms
 * Pool is usually the Array of permission that Someone has,
 * While perms is the set of needed permissions
 * if the pool contains all ppermissions from perms the function return true
 */
export const checkPermissionOverlap = (perms: Array<PermissionString>, pool: Array<PermissionString>): boolean => {
    for (let perm of perms) {
        if (!pool.includes(perm)) return false;
    }
    return true;
}

/**
 * @param {string} text 
 * @param {string} id 
 * @param {string} sec_id 
 */
export const encode_text = (text: string, id: string, sec_id: string): string => {
    let encoded = "";
    for (let i = 0; i < text.length; i++) {
        let char_code = text.charCodeAt(i);

        char_code += Number(id.charAt(i % (id.length - 1)));
        char_code += Number(sec_id.charAt(i % (id.length - 1)));

        encoded += String.fromCharCode(char_code);
    }
    return encoded;
}

export const decode_text = (text: string, id: string, sec_id: string): string => {
    let decoded = "";
    for (let i = 0; i < text.length; i++) {
        let char_code = text.charCodeAt(i);

        char_code -= Number(id.charAt(i % (id.length - 1)));
        char_code -= Number(sec_id.charAt(i % (id.length - 1)));

        decoded += String.fromCharCode(char_code);
    }
    return decoded;
}

export const exportGuild = async (guild: Guild) => {
    var structure = new GuildStructure();



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
        let e = new EmojiStructure();

        e.id = g_e.id;
        e.name = g_e.name;
        e.url = g_e.url;

        return e;
    });

    //Roles
    var roles = (await guild.roles.fetch()).cache.array().sort((a, b) => a.position - b.position);
    structure.roles = roles.filter(r => {
        if (r.managed) return false;

        return true;
    }).map(g_r => {
        let r = new RoleStructure();

        r.color = g_r.hexColor;
        r.hoist = g_r.hoist;
        r.id = g_r.id;
        r.mentionable = g_r.mentionable;
        r.name = g_r.name;
        r.permissions = g_r.permissions.toArray();

        return r;
    });

    //Channels
    var channels = guild.channels.cache.array().sort((a, b) => a.position - b.position);
    structure.channels = channels.map(g_c => {
        let c = new ChannelStructure();

        c.id = g_c.id;
        c.name = g_c.name;
        c.permissionOverwrites = g_c.permissionOverwrites.array();
        c.permissionsLocked = g_c.permissionsLocked;
        c.type = g_c.type;

        return c;
    })

    return structure;
}



export const importGuild = (obj: object): GuildStructure => {
    var structure = new GuildStructure();

    for (var i in obj) {
        structure[i] = obj[i];
    }

    return structure;
}

/**
 * Asign Values of b to Object A
 */
export const assignValues = (a, b) => {
    for (var i in a)
        a[i] = b[i];
    return a;
}



//Getting File
export const getFile = async (msg: Message, text: string, timeout: number, succes: (obj: object) => void, failure: () => void) => {
    //Getting the file from the User
    var emb = newEmb(msg).setColor(colors.info);
    emb.setTitle(text)
        .setDescription("*Write* `cancel` *to abort*")
        .setFooter(`I will wait ${timeout} Seconds`);
    await msg.channel.send(emb)


    //Creating The Collector
    var collector = msg.channel.createMessageCollector(
        (m: Message) => m.author.id == msg.author.id,
        {
            time: timeout * 1000,
        }
    );

    collector.on('collect', async (m) => {
        //Canceling
        if (m.content.toLowerCase().includes("cancel")) {
            m.reply("Action canceled")
            return collector.stop("Canceled");
        }

        //Check for Attachment
        if (m.attachments.size < 1) return m.reply("You need to send a File");

        //Getting File
        var attachment = m.attachments.first(),
            file = attachment.attachment,
            url = "";

        //Converting value to String
        if (file instanceof Buffer) url = file.toString('utf8');
        else if (typeof file == 'string') url = file;
        else url = (await streamToString(file)) + "";


        //Downloading the File
        try {
            var res = await getString(url)

            //Parsing
            try {
                var json = JSON.parse(res);

                succes(json);
            } catch (err) {
                console.log(err);
                m.channel.send(newEmb(m).setColor(colors.error).setTitle("There was an error parsing your file ._."));
                return failure();
            }
        } catch (err) {
            console.log(err);
            m.channel.send(newEmb(m).setColor(colors.error).setTitle("There was an error downloading your file ._."));
            return failure;
        }
    })
}

function streamToString(stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
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

export const generateTree = (structure: GuildStructure): string => {
    var tree = "";
    let i = 0;

    tree += structure.name + "\n";//Linebreak

    //Roles
    tree += "╠══ Roles \n";
    for (i = 0; i < structure.roles.length - 2; i++) {
        let role = structure.roles[i];
        tree += "║   ╠═ " + role.name + "\n";//Linebreak
    }
    i++;
    tree += "║   ╚═ " + structure.roles[i].name + "\n";
    tree += "║ \n";



    //Channels
    tree += "╠══ Chanels \n";
    for (i = 0; i < structure.channels.length - 2; i++) {
        let channel = structure.channels[i];
        tree += "║   ╠═ " + channel.name + "\n";//Linebreak
    }
    i++;
    tree += "║   ╚═ " + structure.channels[i].name + "\n";
    tree += "║ \n";

    return tree;
}

var addLine = (a: string, b: string) => {
    return (a + (b + "\n"));
}