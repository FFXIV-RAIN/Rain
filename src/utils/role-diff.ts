import { GuildMember, PartialGuildMember } from 'discord.js';

export class RoleDiff {
    private _roles: string[];

    constructor(roles: string[] = []) {
        this._roles = roles;
    }

    add(...roles: string[]) {
        for (const role of roles) {
            if (this._roles.includes(role)) continue;

            this._roles.push(role);
        }
    }
    
    remove(...roles: string[]) {
        for (const role of roles) {
            const index = this._roles.indexOf(role);

            if (index === -1) continue;

            this._roles.splice(index, 1);
        }
    }

    get roles() {
        return this._roles;
    }

    async commit(member: GuildMember | PartialGuildMember) {
        await member.roles.set(this._roles);

        this._roles = [];
    }
}