import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey, HasMany} from 'sequelize-typescript';
import {Guild} from '../Guild/Guild';
import {XivCharacter} from './XivCharacter';
import {XivFreeCompanyRanks} from './XivFreeCompanyRanks';
import {XivFreeCompanyPromotionQueue} from './XivFreeCompanyPromotionQueue';

@Table
export class XivFreeCompany extends Model {
    @PrimaryKey
    @Column(DataType.TEXT)
    declare freeCompanyId: string;

    @Column(DataType.TEXT)
    declare name: string;

    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    declare guildId: string;

    @BelongsTo(() => Guild)
    declare guild: Guild;

    @HasMany(() => XivCharacter)
    declare characters: XivCharacter[];

    @HasMany(() => XivFreeCompanyRanks)
    declare ranks: XivFreeCompanyRanks[];

    @HasMany(() => XivFreeCompanyPromotionQueue)
    declare promotionQueue: XivFreeCompanyPromotionQueue[];
}
