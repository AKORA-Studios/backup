"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const utilities_1 = require("./utilities");
class Bot extends discord_js_1.Client {
    constructor() {
        super();
        this.error_channel = null;
        this.queue = [];
        this.commands = new discord_js_1.Collection();
        this.owner = new Array();
        this.command_path = "./commands"; //Default
        this.prefix = "+"; //Default
        //Error Handling
        this.on('shardError', error => console.error('A websocket connection encountered an error:', error));
        process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error));
        process.on('warning', console.warn);
        //==============
        this.on('ready', () => {
            console.log("Logged in as: " + this.user?.tag);
        });
        this.on("message", message => {
            if (message.mentions.users.has(this.user?.id + "")) {
                message.channel.send(new discord_js_1.MessageEmbed().setTitle("My Prefix is: " + this.prefix)).catch();
            }
            if (message.author.bot)
                return;
            if (message.channel instanceof discord_js_1.DMChannel)
                return message.channel.send(new discord_js_1.MessageEmbed().setTitle("You can't use me via DM")).catch();
            //Do Stuff
            if (!message.content.toLowerCase().startsWith(this.prefix))
                return;
            var emb = new discord_js_1.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setFooter(this.user?.tag, this.user?.displayAvatarURL())
                .setTimestamp(new Date());
            var args = message.content.slice(this.prefix.length).split(/ +/);
            const commandName = args.shift()?.toLowerCase() || "";
            const command = this.commands.find(cmd => cmd.properties.triggers.includes(commandName));
            if (!command)
                return; //If its no Valid Command
            //Check for Arguments
            if (command.properties.args && !args.length) {
                emb.setDescription(`Du musst Argumente angeben, ${message.member?.toString()}!`);
                emb.addField(`Syntax`, `\`${this.prefix}${command.properties.syntax}\``);
                return message.channel.send(emb);
                //Check for Bot permissions
            }
            else if (!utilities_1.checkPermissionOverlap(command.properties.bot_permissions, message.channel.permissionsFor(message.client.user).toArray())) {
                return message.channel.send(emb.setTitle("I need more permissions for this command").setColor(utilities_1.colors.error));
                //Check for User permissions
            }
            else if (!utilities_1.checkPermissionOverlap(command.properties.user_permissions, message.channel.permissionsFor(message.author).toArray())) {
                return message.channel.send(emb.setTitle("You need more permissions to execute this command").setColor(utilities_1.colors.error));
            }
            else if (command.properties.module_type === 'developer' &&
                !this.owner.includes(message.author.id)) {
                return message.channel.send(emb.setTitle("Only Bot Owners can execute this Command").setColor(utilities_1.colors.error));
            }
            try {
                var value = command.execute(message, args, this);
                if (value instanceof Promise) {
                    var prom = value;
                    prom.then(() => this.queue = this.queue.filter(p => p !== prom));
                    this.queue.push(prom);
                }
            }
            catch (error) {
                console.error(error);
                emb.setDescription(`There is an Isssue with this command ._.`);
                message.channel.send(emb);
                emb = new discord_js_1.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setFooter(this.user?.tag, this.user?.displayAvatarURL())
                    .setTimestamp(new Date());
                emb.setTitle('Error')
                    .addField('Auf:', `\`${message.guild?.name}\``, true)
                    .addField('Channel:', `\`${message.channel.name}\``, true)
                    .addField('Von:', message.author.toString(), true)
                    .addField('Befehl:', `\`${message.content}\``, false)
                    .addField('Error Message:', `\`${error}\``, false);
                this.error_channel?.send(emb);
            }
        });
    }
    async setErrorChannel(channel_id) {
        try {
            var channel = await this.channels.fetch("714557180757409942").catch();
            if (!(channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.NewsChannel)) {
                console.log("No Valid Channel");
                return false;
            }
            let perms = channel.permissionsFor(this.user || "");
            if (perms == null) {
                console.log("Couldn't get permissions");
                return false;
            }
            if (!perms.has("SEND_MESSAGES")) {
                console.log("Misssing permissions to send Messages");
                return false;
            }
            console.log("Error Channel set to: ");
            console.log(" (G) > " + channel.guild.name);
            console.log(" (C) > " + channel.name);
            this.error_channel = channel;
            return true;
        }
        catch (e) {
            return false;
        }
    }
    loadCommands(path) {
        const commandFiles = fs_1.readdirSync(path).filter((file) => file.split(".").pop() == "js");
        for (const file of commandFiles) {
            const command = require("." + path + "/" + file);
            this.commands.set(command.properties.name, command);
        }
        console.log(this.commands.size + " Commands Loaded");
    }
}
exports.Bot = Bot;
class Command {
    constructor(properties, execute) {
        this.properties = properties;
        this.execute = execute;
    }
}
exports.Command = Command;
