import {
  Table,
  Column,
  Model,
  BelongsTo,
  PrimaryKey,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Guild } from './Guild';

@Table
export class GuildPromotionQueue extends Model {
  @PrimaryKey
  @ForeignKey(() => Guild)
  @Column(DataType.TEXT)
  declare guildId: string;

  @PrimaryKey
  @Column(DataType.TEXT)
  declare characterName: string;

  @Column(DataType.TEXT)
  declare rank: string;

  @BelongsTo(() => Guild)
  declare guild: Guild;
}
