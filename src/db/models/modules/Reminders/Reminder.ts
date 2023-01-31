import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, AutoIncrement} from 'sequelize-typescript';
import {Timestamp} from '../../../../utils/timestamp';
import {Guild} from '../../Guild/Guild';
import {ReminderConfig} from './ReminderConfig';

@Table
export class Reminder extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.BIGINT)
    id!: number;

    @ForeignKey(() => Guild)
    @ForeignKey(() => ReminderConfig)
    @Column(DataType.TEXT)
    guildId!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    channelId!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    userId!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    date!: Date;

    @Column(DataType.TEXT)
    message!: string;

    @BelongsTo(() => Guild)
    guild!: Guild;

    @BelongsTo(() => ReminderConfig)
    reminderConfig!: ReminderConfig;

    get timeTill(): number {
        return new Timestamp(this.date).remove(Timestamp.UnitTypes.MILLISECOND, Timestamp.now().ms).ms;
    }
}
