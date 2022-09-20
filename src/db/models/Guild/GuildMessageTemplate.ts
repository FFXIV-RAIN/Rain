import {Table, Column, Model, PrimaryKey, DataType, ForeignKey, BelongsTo, AutoIncrement, HasMany} from 'sequelize-typescript';
import {ScheduledMessage} from '../modules/ScheduledMessages/ScheduledMessage';
import {Guild} from './Guild';
import {GuildMessageEmbedTemplate} from './GuildMessageEmbedTemplate';

@Table
export class GuildMessageTemplate extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.BIGINT)
    id!: number;

    @ForeignKey(() => Guild)
    @Column(DataType.TEXT)
    guildId!: string;

    @Column(DataType.STRING(2000))
    content?: string | null;

    // TODO: Support Components
    // components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[];

    @BelongsTo(() => Guild)
    config!: Guild;

    @HasMany(() => ScheduledMessage)
    scheduledMessage?: ScheduledMessage;

    @HasMany(() => GuildMessageEmbedTemplate)
    embeds?: GuildMessageEmbedTemplate[];
}