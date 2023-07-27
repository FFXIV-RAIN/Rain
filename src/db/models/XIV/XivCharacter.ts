import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {Guild} from '../Guild/Guild';
import {XivFreeCompany} from './XivFreeCompany';

@Table
export class XivCharacter extends Model {
    @PrimaryKey
    @Column(DataType.TEXT)
    declare characterId: string;

    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    declare guildId: string;

    @Column(DataType.TEXT)
    declare discordId: string;

    @Column(DataType.TEXT)
    declare homeWorld: string;

    @Column(DataType.TEXT)
    declare characterName: string;

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
    declare freeCompany: XivFreeCompany;

    @BelongsTo(() => Guild)
    declare guild: Guild;
}
