import { GuildMember, PartialGuildMember } from 'discord.js';
import {ROLES} from '../roles';

export class RoleDiff {
    private _added: ROLES[] = [];
    private _removed: ROLES[] = [];

    add(...roles: ROLES[]) {
        for (const role of roles) {
            const removedIndex = this._removed.indexOf(role);

            if (removedIndex !== -1) {
                this._removed.splice(removedIndex, 1);
            }

            if (this._added.includes(role)) continue;

            this._added.push(role);
        }
    }
    
    remove(...roles: ROLES[]) {
        for (const role of roles) {
            const addedIndex = this._added.indexOf(role);

            if (addedIndex !== -1) {
                this._added.splice(addedIndex, 1);
            }

            if (this._removed.includes(role)) continue;

            this._removed.push(role);
        }
    }

    get added(): ROLES[] {
        return this._added;
    }

    get removed(): ROLES[] {
        return this._removed;
    }

    async submit(member: GuildMember | PartialGuildMember) {
        const promises = [];

        if (this.added.length > 0) {
            console.log(`Auto adding roles from ${member.user.id}: ${this.added.join(',')}...`);

            promises.push(member.roles.add(this.added));
        }

        if (this.removed.length > 0) {
            console.log(`Auto removing roles from ${member.user.id}: ${this.removed.join(',')}...`);
            
            promises.push(member.roles.remove(this.removed));
        }

        await Promise.all(promises);

        this._added = [];
        this._removed = [];
    }
}