import {Table, Column, Model, PrimaryKey, HasOne} from 'sequelize-typescript';
import { Config } from './Config';

@Table
export class Guild extends Model {
    @PrimaryKey
    @Column
    id!: string;

    @HasOne(() => Config)
    config!: Config;
}