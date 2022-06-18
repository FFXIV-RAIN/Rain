import {Table, Column, Model, PrimaryKey, HasOne, DataType} from 'sequelize-typescript';
import { Config } from './Config';
import { WelcomeConfig } from './modules/WelcomeConfig';

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

    @HasOne(() => Config)
    config!: Config;

    @HasOne(() => WelcomeConfig)
    welcomeConfig!: WelcomeConfig;
}