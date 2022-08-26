import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {Guild} from './Guild';

@Table
export class GuildPromotionQueue extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @PrimaryKey
    @Column(DataType.TEXT)
    characterName!: string;

    @Column(DataType.TEXT)
    rank!: string;

    @BelongsTo(() => Guild)
    guild!: Guild;
}
