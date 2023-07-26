import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {XivFreeCompany} from './XivFreeCompany';

@Table
export class XivFreeCompanyRanks extends Model {
    @PrimaryKey
    @ForeignKey(() => XivFreeCompany)
    @Column(DataType.TEXT)
    declare freeCompanyId: string;

    @PrimaryKey
    @Column(DataType.TEXT)
    declare freeCompanyRank: string;

    @Column(DataType.TEXT)
    declare discordRank: string;

    @BelongsTo(() => XivFreeCompany)
    declare freeCompany: XivFreeCompany;
}
