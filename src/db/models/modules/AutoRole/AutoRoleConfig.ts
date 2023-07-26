import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, HasMany} from 'sequelize-typescript';
import {Guild} from '../../Guild/Guild';
import {AutoRoleAssignments} from './AutoRoleAssignments';

@Table
export class AutoRoleConfig extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    declare guildId: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
   })
    declare enabled: boolean;

    @Column(DataType.ARRAY(DataType.TEXT))
    memberJoinRoles?: string[];

    @Column(DataType.ARRAY(DataType.TEXT))
    botJoinRoles?: string[];

    @BelongsTo(() => Guild)
    declare guild: Guild;

    @HasMany(() => AutoRoleAssignments)
    declare assignments: AutoRoleAssignments[];

    get disabled() {
        return !this.enabled;
   }
}
