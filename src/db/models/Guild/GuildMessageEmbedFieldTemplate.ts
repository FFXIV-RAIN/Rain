import {Table, Column, Model, PrimaryKey, DataType, ForeignKey, AutoIncrement, BelongsTo} from 'sequelize-typescript';
import {GuildMessageEmbedTemplate} from './GuildMessageEmbedTemplate';

@Table
export class GuildMessageEmbedFieldTemplate extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.BIGINT)
    id!: number;

    @ForeignKey(() => GuildMessageEmbedTemplate)
    @Column(DataType.BIGINT)
    embedId!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    name!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    value!: string;

    @Column(DataType.BOOLEAN)
    inline?: boolean;

    @BelongsTo(() => GuildMessageEmbedTemplate)
    embedTemplate!: GuildMessageEmbedTemplate;
}