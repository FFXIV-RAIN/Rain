import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {Guild} from '../Guild';
import {XivFreeCompany} from './XivFreeCompany';

@Table
export class XivCharacter extends Model {
    @PrimaryKey
    @Column(DataType.TEXT)
    characterId!: string;
    
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @Column(DataType.TEXT)
    discordId!: string;

    @Column(DataType.TEXT)
    homeWorld!: string;

    @Column(DataType.TEXT)
    characterName!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    rank?: string;

    @ForeignKey(() => XivFreeCompany)
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    freeCompanyId?: string;

    @BelongsTo(() => XivFreeCompany)
    freeCompany!: XivFreeCompany;

    @BelongsTo(() => Guild)
    guild!: Guild;
}
