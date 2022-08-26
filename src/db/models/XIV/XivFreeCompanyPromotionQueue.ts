import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import {XivCharacter} from './XivCharacter';
import {XivFreeCompany} from './XivFreeCompany';

@Table
export class XivFreeCompanyPromotionQueue extends Model {
    @PrimaryKey
    @ForeignKey(() => XivFreeCompany)
    @Column(DataType.TEXT)
    freeCompanyId!: string;

    @PrimaryKey
    @ForeignKey(() => XivCharacter)
    @Column(DataType.TEXT)
    characterId!: string;

    @Column(DataType.TEXT)
    rank!: string;

    @BelongsTo(() => XivFreeCompany)
    freeCompany!: XivFreeCompany;

    @BelongsTo(() => XivCharacter)
    character?: XivCharacter;
}
