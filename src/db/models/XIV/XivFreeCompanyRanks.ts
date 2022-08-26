import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {XivFreeCompany} from './XivFreeCompany';

@Table
export class XivFreeCompanyRanks extends Model {
    @PrimaryKey
    @ForeignKey(() => XivFreeCompany)
    @Column(DataType.TEXT)
    freeCompanyId!: string;
    
    @PrimaryKey
    @Column(DataType.TEXT)
    freeCompanyRank!: string;

    @Column(DataType.TEXT)
    discordRank!: string;

    @BelongsTo(() => XivFreeCompany)
    freeCompany!: XivFreeCompany;
}
