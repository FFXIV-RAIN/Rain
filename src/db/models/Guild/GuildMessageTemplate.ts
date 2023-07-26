import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { ScheduledMessage } from '../modules/ScheduledMessages/ScheduledMessage';
import { Guild } from './Guild';
import { GuildMessageEmbedTemplate } from './GuildMessageEmbedTemplate';

@Table
export class GuildMessageTemplate extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => Guild)
  @Column(DataType.TEXT)
  declare guildId: string;

  @Column(DataType.STRING(2000))
  declare content?: string | null;

  // TODO: Support Components
  // components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[];

  @BelongsTo(() => Guild)
  declare config: Guild;

  @HasMany(() => ScheduledMessage)
  declare scheduledMessage?: ScheduledMessage;

  @HasMany(() => GuildMessageEmbedTemplate)
  declare embeds?: GuildMessageEmbedTemplate[];
}
