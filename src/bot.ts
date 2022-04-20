import { Client } from 'discord.js';
import { ROLES, STAFF_ROLES } from './roles';
import { ROLE_CHANGED, wasAnyRoleChanged } from './utils/roles';

const client = new Client({
    partials: [
        'GUILD_MEMBER',
    ],
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
    ]
});

client.on('ready', async () => {
    if (!client.user || !client.application) return;

    console.log(`${client.user.username} is online.`);
});

// TODO: Remove once Sapphire supports Bot Join Roles
client.on('guildMemberAdd', async (member) => {
    if (member.user.bot) {
        await member.roles.add(ROLES.BOTS);
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    // TODO: Remove once Sapphire supports Bot Join Roles
    if (oldMember.pending && !newMember.pending) {
        await newMember.roles.add([
            ROLES.GUESTS,
            ROLES.PRONOUNS_HEADER,
            ROLES.PRONOUNS_FOOTER,
        ]);
    }

    const STAFF_CHANGED = wasAnyRoleChanged(oldMember, newMember, STAFF_ROLES);

    if (STAFF_CHANGED === ROLE_CHANGED.ADDED) {
        await Promise.all([
            newMember.roles.remove(ROLES.GUESTS),
            newMember.roles.add(ROLES.STAFF),
        ]);
    } else if (STAFF_CHANGED === ROLE_CHANGED.REMOVED) {
        await Promise.all([
            newMember.roles.remove(ROLES.STAFF),
            newMember.roles.add(ROLES.GUESTS),
        ]);
    }
});

client.login(process.env.DISCORD_TOKEN);