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
import { ReminderConfig } from './ReminderConfig';

@Table
export class Reminder extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => Guild)
  @ForeignKey(() => ReminderConfig)
  @Column(DataType.TEXT)
  declare guildId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare channelId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare date: Date;

  @Column(DataType.TEXT)
  declare message: string;

  @BelongsTo(() => Guild)
  declare guild: Guild;

  @BelongsTo(() => ReminderConfig)
  declare reminderConfig: ReminderConfig;

  get timeTill(): number {
    return new Timestamp(this.date).remove(Timestamp.UnitTypes.MILLISECOND, Timestamp.now().ms).ms;
  }
}
