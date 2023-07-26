import { Table, Column, Model, PrimaryKey, HasOne, DataType, HasMany } from 'sequelize-typescript';
import { GuildConfig } from './GuildConfig';
import { GuildPromotionQueue } from './GuildPromotionQueue';
import { WelcomeConfig } from '../modules/WelcomeConfig';
import { XivFreeCompany } from '../XIV/XivFreeCompany';

@Table
export class Guild extends Model {
  @PrimaryKey
  @Column(DataType.TEXT)
  declare id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare inactive: boolean;

  @HasOne(() => GuildConfig)
  declare config: GuildConfig;

  @HasMany(() => GuildPromotionQueue)
  declare promotionQueue?: GuildPromotionQueue[];

  @HasOne(() => WelcomeConfig)
  declare welcomeConfig: WelcomeConfig;

  @HasOne(() => XivFreeCompany)
  declare freeCompany?: XivFreeCompany;
}
