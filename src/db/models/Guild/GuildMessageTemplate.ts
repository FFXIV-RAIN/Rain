import {Table, Column, Model, PrimaryKey, DataType, ForeignKey, BelongsTo, AutoIncrement, HasOne, HasMany} from 'sequelize-typescript';
import {ScheduledMessage} from '../modules/ScheduledMessages/ScheduledMessage';
import {Guild} from './Guild';

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

    @Column(DataType.JSON)
    embeds?: GuildMessageEmbedTemplate[];

    // TODO: Support Components
    // components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[];

    @BelongsTo(() => Guild)
    config!: Guild;

    @HasMany(() => ScheduledMessage)
    scheduledMessage?: ScheduledMessage;
}

export class GuildMessageEmbedTemplate {
    title?: string;
    description?: string;
    url?: string;
    color?: string;
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
    author?: {
        name: string;
        url?: string;
        iconURL?: string;
        proxyIconURL?: string;
    };

    // thumbnail?: Partial<MessageEmbedThumbnail> & { proxy_url?: string };
    // image?: Partial<MessageEmbedImage> & { proxy_url?: string };
    // video?: Partial<MessageEmbedVideo> & { proxy_url?: string };

    footer?: {
        text: string;
        iconURL?: string;
        proxyIconURL?: string;
    };
}
