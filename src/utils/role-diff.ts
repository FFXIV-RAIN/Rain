import {GuildMember, PartialGuildMember} from 'discord.js';

export class RoleDiff {
    private _roles: string[];
    private _hasChanged: boolean;

    constructor(roles: string[] = []) {
        this._hasChanged = false;
        this._roles = roles;
   }

    add(...roles: string[]) {
        for (const role of roles) {
            if (this._roles.includes(role)) continue;

            this._hasChanged = true;
            this._roles.push(role);
       }
   }
    
    remove(...roles: string[]) {
        for (const role of roles) {
            const index = this._roles.indexOf(role);

            if (index === -1) continue;

            this._hasChanged = true;
            this._roles.splice(index, 1);
       }
   }

    get roles() {
        return this._roles;
   }

    get hasChanged(): boolean {
        return this._hasChanged;
   }

    async commit(member: GuildMember | PartialGuildMember) {
        if (this._hasChanged) {
            await member.roles.set(this._roles);
       }
   }
}