import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, AutoIncrement} from 'sequelize-typescript';
import {Guild} from '../../Guild/Guild';
import {ScheduledMessagesConfig} from './ScheduledMessagesConfig';

@Table
export class ScheduledMessage extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.BIGINT)
    id!: number;

    @ForeignKey(() => Guild)
    @ForeignKey(() => ScheduledMessagesConfig)
    @Column(DataType.TEXT)
    guildId!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    date!: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    message!: string;

    @BelongsTo(() => Guild)
    guild!: Guild;

    @BelongsTo(() => ScheduledMessagesConfig)
    scheduledMessagesConfig!: ScheduledMessagesConfig;
}
