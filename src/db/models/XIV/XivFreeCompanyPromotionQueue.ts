import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {XivCharacter} from './XivCharacter';
import {XivFreeCompany} from './XivFreeCompany';

@Table
export class XivFreeCompanyPromotionQueue extends Model {
    @PrimaryKey
    @ForeignKey(() => XivFreeCompany)
    @Column(DataType.TEXT)
    declare freeCompanyId: string;

    @PrimaryKey
    @ForeignKey(() => XivCharacter)
    @Column(DataType.TEXT)
    declare characterId: string;

    @Column(DataType.TEXT)
    declare rank: string;

    @BelongsTo(() => XivFreeCompany)
    declare freeCompany: XivFreeCompany;

    @BelongsTo(() => XivCharacter)
    character?: XivCharacter;
}
