import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, HasMany} from 'sequelize-typescript';
import {Guild} from '../../Guild/Guild';
import {ScheduledMessage} from './ScheduledMessage';

@Table
export class ScheduledMessagesConfig extends Model {
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

    @HasMany(() => ScheduledMessage)
    declare messages: ScheduledMessage[];

    get disabled() {
        return !this.enabled;
    }
}
