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
import { GuildMessageEmbedFieldTemplate } from './GuildMessageEmbedFieldTemplate';
import { GuildMessageTemplate } from './GuildMessageTemplate';

@Table
export class GuildMessageEmbedTemplate extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => GuildMessageTemplate)
  @Column(DataType.BIGINT)
  declare templateId: number;

  @Column(DataType.STRING(200))
  declare title?: string;

  @Column(DataType.STRING(2000))
  declare description?: string;

  @Column(DataType.STRING(200))
  declare url?: string;

  @Column(DataType.STRING(6))
  declare color?: string;

  @HasMany(() => GuildMessageEmbedFieldTemplate)
  declare fields?: GuildMessageEmbedFieldTemplate[];

  @BelongsTo(() => GuildMessageTemplate)
  declare messageTemplate: GuildMessageTemplate;
}
