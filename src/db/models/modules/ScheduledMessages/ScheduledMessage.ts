import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, AutoIncrement, HasOne} from 'sequelize-typescript';
import {Timestamp} from '../../../../utils/timestamp';
import {Guild} from '../../Guild/Guild';
import {GuildMessageTemplate} from '../../Guild/GuildMessageTemplate';
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
        type: DataType.TEXT,
        allowNull: false
    })
    channelId!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    monday!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    tuesday!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    wednesday!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    thursday!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    friday!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    saturday!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    sunday!: boolean;

    /**
     * The number of minutes into the day we should send the message. (between 0 and 1440)
     */
    @Column({
        type: DataType.SMALLINT,
        allowNull: false,
    })
    minutes!: number;

    @ForeignKey(() => GuildMessageTemplate)
    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    messageTemplateId!: number;

    @BelongsTo(() => GuildMessageTemplate)
    messageTemplate?: GuildMessageTemplate;

    @BelongsTo(() => Guild)
    guild!: Guild;

    @BelongsTo(() => ScheduledMessagesConfig)
    scheduledMessagesConfig!: ScheduledMessagesConfig;

    get timeTill(): number {
        const milliseconds = this.minutes * Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.MINUTE];
        const millisecondsIntoDay = Timestamp.now().floor(Timestamp.UnitTypes.MINUTE).timeOfDay();

        return milliseconds - millisecondsIntoDay;
    }
}
