import { Message, MessageEmbed, MessageReaction, User, PermissionString, Guild, GuildChannel, TextChannel } from "discord.js";
import { GuildStructure, ChannelStructure, RoleStructure, EmojiStructure } from "./structures";
import * as bent from 'bent';
import * as fs from 'fs';
const getString = bent('string');

export const colors = {
    error: 0xF91A3C,
    info: 0x1AE3F9,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    unimportant: 0x2F3136
}

export const emojis = {
    true: "<:true:749345137833803836>",
    false: "<:false:749345292452757574>",
    presence: "<:presence:749346186137174097>",
    member: "<:member:750712895251152930>",
    information: "<:information:750712943737569340>",
    tag: "<:tag:750712982383755395>",
    developer: "<:developer:750709679931392011>",
    owner: "<:owner:750713044606255179>",
    online: "<:online:750709966167474237>",
    offline: "<:offline:750709986476163103>",
    bot: "<:bot:750712868814716928>"
}

export function code(str: string, single = false) {
    return `${single ? '`' : '```'}${str}${single ? '`' : '```'}`
}

export function fancyCases(seperator: string, text: string): string {
    var arr = text.split(seperator)
    arr = arr.map(v => v.charAt(0).toUpperCase() + v.substr(1));

    return arr.join(" ");
}

export function confirmAction(msg: Message, text: string, confirm: (message: Message) => void, cancel: (message: Message) => void) {
    var emb = rawEmb();

    emb.setTitle('Confirmation').setDescription(text)

    msg.channel.send(emb).then(async message => {
        emb = rawEmb();

        const filter = (reaction: MessageReaction, user: User) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌')
                && user.id === msg.author.id;
        }

        const collector = message.createReactionCollector(filter, { maxEmojis: 1, time: 15000 });

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

export function confirmActionAsync(msg: Message, text: string): Promise<Message> {
    return new Promise((res, rej) => {
        confirmAction(msg, text, res, rej)
    });
}

export function newEmb(msg: Message) {
    let client = msg.client.user || msg.author;
    return new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setFooter(client.tag, client.displayAvatarURL())
        .setTimestamp(new Date());
}

export function rawEmb() {
    return new MessageEmbed();
    //.setTimestamp(new Date());
}

/**
 * Checks if the pool contains perms
 * Pool is usually the Array of permission that Someone has,
 * While perms is the set of needed permissions
 * if the pool contains all ppermissions from perms the function return true
 */
export function checkPermissionOverlap(perms: Array<PermissionString>, pool: Array<PermissionString>): boolean {
    for (let perm of perms) {
        if (!pool.includes(perm)) return false;
    }
    return true;
}

export function channelToStructure(g_c: GuildChannel): ChannelStructure {
    let c = new ChannelStructure();

    c.id = g_c.id;
    c.name = g_c.name;
    c.permissionOverwrites = g_c.permissionOverwrites.array();
    c.permissionsLocked = g_c.permissionsLocked;
    c.type = g_c.type;
    c.topic = g_c["topic"]
    c.nsfw = g_c["nsfw"];

    return c;
}

export async function exportGuild(guild: Guild) {
    guild = await guild.fetch();
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
    structure.emojis = emojis.map(emo => {
        return {
            id: emo.id,
            name: emo.name,
            url: emo.url
        } as EmojiStructure;
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
        r.permissions = g_r.permissions.bitfield;
        //r.position = g_r.position;

        return r;
    });

    //Channels
    var channels = guild.channels.cache.array().sort((a, b) => a.position - b.position);

    var loose_channels = channels.filter(c => c.parentID === null && c.type !== "category").map(channelToStructure);

    channels = channels.filter(c => !loose_channels.find(ch => ch.id === c.id));//Removing Loose Channels

    var categorys = channels.filter(c => c.type === "category").map(g_c => {
        let chan = new ChannelStructure();

        chan.id = g_c.id;
        chan.name = g_c.name;
        chan.permissionOverwrites = g_c.permissionOverwrites.array();
        chan.permissionsLocked = g_c.permissionsLocked;
        chan.type = g_c.type;
        chan.topic = g_c["topic"];

        chan.childs = channels.filter(c => c.parentID === g_c.id).map(channelToStructure);

        return chan;
    });

    var structure_channels = loose_channels.concat(categorys);

    structure.channels = structure_channels;


    //Save file
    fs.writeFile(`./guild_saves/${guild.id}.json`, JSON.stringify(structure), null, () => { });

    return structure;
}

export function importGuild(obj: object): GuildStructure {
    return obj as GuildStructure
}

/**
 * Asign Values of b to Object A
 */
export function assignValues<A>(a: A, b): A {
    for (var i in a)
        a[i] = b[i];
    return a;
}

export async function funCommand(msg: Message, endpoint: string) {
    const getString = bent('string');

    //Downloading the File
    try {
        var res = await getString(`https://nekos.life/api/v2/img/${endpoint}`)

        //Parsing
        try {
            var json = JSON.parse(res);

            msg.channel.send(newEmb(msg).setColor(colors.success).setImage(json.url).setTitle("Neko (,,◕　⋏　◕,,)"))
        } catch (err) {
            console.log(err);
            msg.channel.send(newEmb(msg).setColor(colors.error).setTitle("There was an error extracting the Neko :0"));
        }
    } catch (err) {
        console.log(err);
        msg.channel.send(newEmb(msg).setColor(colors.error).setTitle("There was an error catching a Neko >~>"));
    }
}

//Getting File
export async function getFile(msg: Message, text: string, timeout: number, succes: (obj: object) => void, failure: () => void) {
    //Getting the file from the User
    var emb = rawEmb().setColor(colors.info);
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
            msg.channel.send(rawEmb().setFooter(msg.author.tag, msg.author.displayAvatarURL()).setColor(colors.error).setDescription("**Canceld uwu**"));
            return collector.stop("Canceled");
        }

        //Check for Attachment
        if (m.attachments.size < 1) return;// m.reply("You need to send a File");

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
                collector.stop("Collected");
                succes(json);
            } catch (err) {
                console.log(err);
                m.channel.send(rawEmb().setColor(colors.error).setTitle("There was an error parsing your JSON file ._."));
                collector.stop("Collected");
                return failure();
            }
        } catch (err) {
            console.log(err);
            m.channel.send(rawEmb().setColor(colors.error).setTitle("There was an error downloading your file ._."));
            collector.stop("Collected");
            return failure();
        }
    })
}

export function getFileAsync(msg: Message, text: string, timeout: number): Promise<object> {
    return new Promise((res, rej) => {
        getFile(msg, text, timeout, res, rej)
    });
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

export function generateTree(structure: GuildStructure): string {
    var tree = "";
    let i = 0, x = 0, end = false;

    tree += `${structure.name}\n`;//Linebreak

    //Roles
    tree += "╠══ Roles \n";
    var roles = structure.roles.reverse();
    for (i = 0; i < roles.length; i++) {
        let role = roles[i];
        end = (i === roles.length - 1);

        tree += `║   ${end ? "╚" : "╠"}═ ${role.name}\n`;//Linebreak
    }
    tree += "║ \n";



    //Channels
    tree += "╚══ Channels \n";
    var loose = structure.channels.filter(c => !c.childs);
    var categorys = structure.channels.filter(c => c.childs);

    for (i = 0; i < loose.length; i++) {
        let channel = loose[i];

        tree += "    ╠═ " + channel.name + "\n";
    }

    for (i = 0; i < categorys.length; i++) {
        let category = categorys[i];
        end = (i === categorys.length - 1);

        tree += `    ${end ? "╚" : "╠"}═ ${category.name}\n`;
        for (x = 0; x < category.childs.length; x++) {
            let e_end = (x === category.childs.length - 1);
            tree += `    ${end ? " " : "║"}    ${e_end ? "╚" : "╠"}═ ${category.childs[x].name} \n`;
        }
    }

    return tree;
}