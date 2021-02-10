import { Client, Collection, Message, TextChannel, NewsChannel, MessageEmbed, DMChannel, PermissionString } from "discord.js";
import { readdirSync } from "fs";
import { checkPermissionOverlap, colors } from "./utilities";

export type module_type = 'info' | 'developer' | 'backup' | 'misc' | 'fun';

export class Bot extends Client {
    commands: Collection<string, Command>;
    /** Queue of executing commands */
    queue: Promise<any>[]
    owner: Array<string>;
    command_path: string;
    prefix: string;
    token: string;
    test_token: string;
    error_channel: TextChannel | NewsChannel | null;

    constructor() {
        super();
        this.error_channel = null;
        this.queue = [];
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

            if (this.validateExecution(message, args, command, emb)) return;


            try {
                var value = command.execute(message, args, this);
                if (value instanceof Promise) {
                    var prom = value as Promise<any>;
                    prom.then(() => this.queue = this.queue.filter(p => p !== prom));
                    this.queue.push(prom);
                }
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

    /**
     * Returns true value if not valid
     */
    validateExecution(message: Message, args: string[], command: Command, emb: MessageEmbed) {
        if (message.channel.type !== 'text') return true;

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
        } else if (command.properties.module_type === 'developer' &&
            !this.owner.includes(message.author.id)) {
            return message.channel.send(emb.setTitle("Only Bot Owners can execute this Command").setColor(colors.error));
        }

        return false;
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

    loadCommands(path: string): void {
        const commandFiles = readdirSync(path).filter((file: string) => file.split(".").pop() == "js");

        for (const file of commandFiles) {
            const command = require(`.${path}/${file}`) as Command;

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
    execute: (msg: Message, args: string[], client?: Bot) => any | Promise<any>;

    constructor(properties: CommandProperties, execute: (msg: Message, args: string[], client?: Bot) => void) {
        this.properties = properties;

        this.execute = execute;
    }
}