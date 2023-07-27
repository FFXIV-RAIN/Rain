import {
  Table,
  Column,
  Model,
  BelongsTo,
  PrimaryKey,
  DataType,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Timestamp } from '../../../../utils/timestamp';
import { Guild } from '../../Guild/Guild';
import { GuildMessageTemplate } from '../../Guild/GuildMessageTemplate';
import { ScheduledMessagesConfig } from './ScheduledMessagesConfig';

@Table
export class ScheduledMessage extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => Guild)
  @ForeignKey(() => ScheduledMessagesConfig)
  @Column(DataType.TEXT)
  declare guildId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare channelId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare monday: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare tuesday: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare wednesday: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare thursday: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare friday: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare saturday: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare sunday: boolean;

  /**
   * The number of minutes into the day we should send the message. (between 0 and 1440)
   */
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  declare minutes: number;

  @ForeignKey(() => GuildMessageTemplate)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare messageTemplateId: number;

  @BelongsTo(() => Guild)
  declare guild: Guild;

  @BelongsTo(() => GuildMessageTemplate)
  declare messageTemplate?: GuildMessageTemplate;

  @BelongsTo(() => ScheduledMessagesConfig)
  declare scheduledMessagesConfig: ScheduledMessagesConfig;

  get timeTill(): number {
    const milliseconds = this.minutes * Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.MINUTE];
    const millisecondsIntoDay = Timestamp.now().floor(Timestamp.UnitTypes.SECOND).timeOfDay();

    // Add 1s to increase likelihood of it happening on the right minute
    return (
      Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.SECOND] + milliseconds - millisecondsIntoDay
    );
  }
}
