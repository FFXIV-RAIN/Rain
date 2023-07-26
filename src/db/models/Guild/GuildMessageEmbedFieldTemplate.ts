import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import { GuildMessageEmbedTemplate } from './GuildMessageEmbedTemplate';

@Table
export class GuildMessageEmbedFieldTemplate extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => GuildMessageEmbedTemplate)
  @Column(DataType.BIGINT)
  declare embedId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare value: string;

  @Column(DataType.BOOLEAN)
  declare inline?: boolean;

  @BelongsTo(() => GuildMessageEmbedTemplate)
  declare embedTemplate: GuildMessageEmbedTemplate;
}
