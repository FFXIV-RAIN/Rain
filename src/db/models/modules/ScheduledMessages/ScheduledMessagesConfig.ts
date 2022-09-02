import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, HasMany} from 'sequelize-typescript';
import {Guild} from '../../Guild/Guild';
import {ScheduledMessage} from './ScheduledMessage';

@Table
export class ScheduledMessagesConfig extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
   })
    enabled!: boolean;

    @BelongsTo(() => Guild)
    guild!: Guild;

    @HasMany(() => ScheduledMessage)
    messages!: ScheduledMessage[];

    get disabled() {
        return !this.enabled;
    }
}
