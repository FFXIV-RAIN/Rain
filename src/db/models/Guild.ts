import {Table, Column, Model, PrimaryKey, HasOne, DataType, HasMany} from 'sequelize-typescript';
import {GuildConfig} from './GuildConfig';
import {GuildPromotionQueue} from './GuildPromotionQueue';
import {WelcomeConfig} from './modules/WelcomeConfig';
import {XivFreeCompany} from './XIV/XivFreeCompany';

@Table
export class Guild extends Model {
    @PrimaryKey
    @Column(DataType.TEXT)
    id!: string;
    
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    inactive!: boolean;

    @HasOne(() => GuildConfig)
    config!: GuildConfig;

    @HasMany(() => GuildPromotionQueue)
    promotionQueue?: GuildPromotionQueue[];

    @HasOne(() => WelcomeConfig)
    welcomeConfig!: WelcomeConfig;

    @HasOne(() => XivFreeCompany)
    freeCompany?: XivFreeCompany;
}