import {Table, Column, Model, BelongsTo, PrimaryKey, DataType, ForeignKey} from 'sequelize-typescript';
import { Guild } from '../Guild';

@Table
export class WelcomeConfig extends Model {
    @PrimaryKey
    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabled!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    ignoreBots!: boolean;

    @Column(DataType.TEXT)
    channelId?: string;

    @Column(DataType.TEXT)
    message?: string;

    @BelongsTo(() => Guild)
    guild!: Guild;

    get disabled() {
        return !this.enabled;
    }
}
