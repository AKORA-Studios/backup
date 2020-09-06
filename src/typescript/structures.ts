import { PermissionOverwrites, PermissionString, DefaultMessageNotifications, ExplicitContentFilterLevel, SystemChannelFlagsString, VerificationLevel } from "discord.js";

export class GuildStructure {
    afkChannelID: string;
    afkTimeout: number | undefined;
    channels: Array<ChannelStructure>;
    defaultMessageNotifications: DefaultMessageNotifications | number;
    description: string;
    emojis: Array<EmojiStructure>;
    explicitContentFilter: ExplicitContentFilterLevel;
    iconURL: string;
    mfaLevel: number;
    name: string;
    ownerID: string;
    publicUpdatesChannelID: string;
    region: string;
    roles: Array<RoleStructure>;
    rulesChannelID: string;
    savedAt: number;
    systemChannelID: string;
    systemChannelFlags: Array<SystemChannelFlagsString>;
    verificationLevel: VerificationLevel;
    widgetChannelID: string;
    widgetEnabled: boolean;

    constructor() {
        this.savedAt = new Date().getTime();
    }
}

export class ChannelStructure {
    id: string;
    loadedID?: string;
    name: string;
    nsfw?: boolean;
    type: Exclude<keyof typeof ChannelType, 'dm' | 'group' | 'unknown'>;
    topic: string | undefined;
    permissionsLocked: boolean;
    permissionOverwrites: Array<PermissionOverwrites>;
    childs?: Array<ChannelStructure>;
    //position: number;
}

export class RoleStructure {
    id: string;
    loadedID?: string;
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