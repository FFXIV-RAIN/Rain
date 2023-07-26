import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import { Guild } from './Guild';

@Table
export class GuildConfig extends Model {
  @PrimaryKey
  @ForeignKey(() => Guild)
  @Column(DataType.TEXT)
  declare guildId: string;

  @BelongsTo(() => Guild)
  declare guild: Guild;
}
