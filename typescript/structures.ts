import { Guild, Client, PermissionOverwrites, PermissionString, DefaultMessageNotifications, ExplicitContentFilterLevel, SystemChannelFlagsString, VerificationLevel } from "discord.js";
var example = new Guild(new Client(), {});
example.afkChannel;

export class GuildStructure {
    afkChannelID: string;
    afkTimeout: number | undefined;
    channels: Array<ChannelStructure>;
    defaultMessageNotifications: DefaultMessageNotifications | number;
    description: string;
    emojis: Array<EmojiStructure>;
    explicitContentFilter: ExplicitContentFilterLevel;
    iconURL: string | undefined;
    mfaLevel: number;
    name: string;
    ownerID: string;
    publicUpdatesChannelID: string;
    region: string;
    roles: Array<RoleStructure>;
    rulesChannelID: string;
    systemChannelID: string;
    systemChannelFlags: Array<SystemChannelFlagsString>;
    verificationLevel: VerificationLevel;
    widgetChannelID: string;
    widgetEnabled: boolean;
}

export class ChannelStructure {
    id: string;
    name: string;
    type: Exclude<keyof typeof ChannelType, 'dm' | 'group' | 'unknown'>;
    permissionsLocked: boolean;
    permissionOverwrites: Array<PermissionOverwrites>;
    childs?: Array<ChannelStructure>;
    //position: number;
}

export class RoleStructure {
    id: string;
    name: string;
    color: string;//hex
    hoist: boolean;
    mentionable: boolean;
    permissions: Array<PermissionString>;
    position: number;
}

export class EmojiStructure {
    id: string;
    name: string;
    url: string;
}