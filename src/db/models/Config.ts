import {Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, DataType} from 'sequelize-typescript';
import { Guild } from './Guild';

@Table
export class Config extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @BelongsTo(() => Guild, 'id')
    guild!: Guild;
}