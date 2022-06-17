import {Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey} from 'sequelize-typescript';
import { Guild } from '../Guild';

@Table
export class WelcomeConfig extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column
    guildID!: string;

    enabled!: boolean;

    message?: string;

    @BelongsTo(() => Guild, 'id')
    guild!: Guild;
}
