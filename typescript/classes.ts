import { Client, Collection, Message, TextChannel, NewsChannel, MessageEmbed, DMChannel, PermissionString } from "discord.js";
import { readdirSync } from "fs";
import { checkPermissionOverlap, colors } from "./utilities";

export type module_type = 'info' | 'moderation' | 'configuration' | 'misc' | 'fun';

export class Bot extends Client {
    commands: Collection<string, Command>;
    owner: Array<string>;
    command_path: string;
    prefix: "+";
    token: string;
    test_token: string;
    error_channel: TextChannel | NewsChannel | null;

    constructor() {
        super();
        this.error_channel = null;
        this.commands = new Collection();
        this.owner = new Array();
        this.command_path = "./commands";//Default
        this.prefix = "+";//Default

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
                message.channel.send(new MessageEmbed().setTitle("My Prefix is: " + this.prefix)).catch();
            }

            if (message.author.bot) return;
            if (message.channel instanceof DMChannel) return message.channel.send(new MessageEmbed().setTitle("You can't use me via DM")).catch();

            //Do Stuff

            if (!message.content.toLowerCase().startsWith(this.prefix)) return;

            var emb = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setFooter(this.user?.tag, this.user?.displayAvatarURL())
                .setTimestamp(new Date());

            var args = message.content.slice(this.prefix.length).split(/ +/);

            const commandName = args.shift()?.toLowerCase() || "";
            const command = this.commands.find(cmd => cmd.properties.triggers.includes(commandName));

            if (!command) return; //If its no Valid Command

            //Check for Arguments
            if (command.properties.args && !args.length) {
                emb.setDescription(`Du musst Argumente angeben, ${message.member?.toString()}!`);
                emb.addField(`Syntax`, `\`${this.prefix}${command.properties.syntax}\``);
                return message.channel.send(emb);

                //Check for Bot permissions
            } else if (!checkPermissionOverlap(
                command.properties.bot_permissions,
                message.channel.permissionsFor(message.client.user).toArray())) {
                return message.channel.send(emb.setTitle("I need more permissions for this command").setColor(colors.error));

                //Check for User permissions
            } else if (!checkPermissionOverlap(
                command.properties.user_permissions,
                message.channel.permissionsFor(message.author).toArray())) {
                return message.channel.send(emb.setTitle("You need more permissions to execute this command").setColor(colors.error));
            }


            try {
                command.execute(message, args, this);
            } catch (error) {
                console.error(error);

                emb.setDescription(`There is an Isssue with this command ._.`)
                message.channel.send(emb);

                emb = new MessageEmbed()
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

    async setErrorChannel(channel_id: number | string) {
        try {
            var channel = await this.channels.fetch("714557180757409942").catch();
            if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) { console.log("No Valid Channel"); return false; }

            let perms = channel.permissionsFor(this.user || "");

            if (perms == null) { console.log("Couldn't get permissions"); return false; }
            if (!perms.has("SEND_MESSAGES")) { console.log("Misssing permissions to send Messages"); return false; }

            console.log("Error Channel set to: ");
            console.log(" (G) > " + channel.guild.name);
            console.log(" (C) > " + channel.name);

            this.error_channel = channel;
            return true;
        } catch (e) {
            return false;
        }
    }

    loadCommands(path: string) {
        const commandFiles = readdirSync(path).filter((file: string) => file.split(".").pop() == "js");

        for (const file of commandFiles) {
            const command = require("." + path + "/" + file);

            this.commands.set(command.properties.name, command);
        }

        console.log(this.commands.size + " Commands Loaded");
    }
}

interface CommandProperties {
    name: string;
    syntax: string;
    args: boolean;
    description: string;
    module_type: module_type;
    triggers: string[];
    user_permissions: Array<PermissionString>;
    bot_permissions: Array<PermissionString>;
}

export class Command {
    properties: CommandProperties;
    execute: (msg: Message, args: string[]) => void;

    constructor(properties: CommandProperties, execute: (msg: Message, args: string[], client?: Bot) => void) {
        this.properties = properties;

        this.execute = execute;
    }
}