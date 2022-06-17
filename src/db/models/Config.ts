import {Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey} from 'sequelize-typescript';
import { Guild } from './Guild';

@Table
export class Config extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column
    guildID!: string;

    @BelongsTo(() => Guild, 'id')
    guild!: Guild;
}