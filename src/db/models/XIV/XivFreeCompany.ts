import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, HasMany} from 'sequelize-typescript';
import {Guild} from '../Guild/Guild';
import {XivCharacter} from './XivCharacter';
import {XivFreeCompanyRanks} from './XivFreeCompanyRanks';
import {XivFreeCompanyPromotionQueue} from './XivFreeCompanyPromotionQueue';

@Table
export class XivFreeCompany extends Model {
    @PrimaryKey
    @Column(DataType.TEXT)
    freeCompanyId!: string;

    @Column(DataType.TEXT)
    name!: string;

    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @BelongsTo(() => Guild)
    guild!: Guild;

    @HasMany(() => XivCharacter)
    characters!: XivCharacter[];

    @HasMany(() => XivFreeCompanyRanks)
    ranks!: XivFreeCompanyRanks[];

    @HasMany(() => XivFreeCompanyPromotionQueue)
    promotionQueue!: XivFreeCompanyPromotionQueue[];
}
