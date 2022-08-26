import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, HasMany} from 'sequelize-typescript';
import {Guild} from '../Guild';
import {AutoRoleAssignments} from './AutoRoleAssignments';

@Table
export class AutoRoleConfig extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
   })
    enabled!: boolean;

    @Column(DataType.ARRAY(DataType.TEXT))
    memberJoinRoles?: string[];

    @Column(DataType.ARRAY(DataType.TEXT))
    botJoinRoles?: string[];

    @BelongsTo(() => Guild)
    guild!: Guild;

    @HasMany(() => AutoRoleAssignments)
    assignments!: AutoRoleAssignments[];

    get disabled() {
        return !this.enabled;
   }
}
