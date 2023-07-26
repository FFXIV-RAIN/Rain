import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {Guild} from '../../Guild/Guild';

@Table
export class ReminderConfig extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    declare guildId: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
   })
    declare enabled: boolean;

    @BelongsTo(() => Guild)
    declare guild: Guild;

    get disabled() {
        return !this.enabled;
   }
}
