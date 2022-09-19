import {MessageOptions} from 'discord.js';
import {DISCORD} from '../constants/discord';
import {GuildMessageTemplate} from '../db/models/Guild/GuildMessageTemplate';

export function convertMessageTemplateToMessage<T extends object>(messageTemplate: GuildMessageTemplate, values: T): MessageOptions;
export function convertMessageTemplateToMessage<T extends object>(messageTemplate?: GuildMessageTemplate, values?: T): MessageOptions|undefined {
    if (!messageTemplate) return undefined;

    return {
        content: parseMessage(messageTemplate.content, values),
        embeds: messageTemplate.embeds?.map((embed) => {
            return {
                image: {
                    url: 'https://imgur.com/1SjRXpE.png'
                },
                title: parseMessage(embed.title, values),
                description: parseMessage(embed.description, values),
                url: embed.url,
                color: embed.color ? `#${embed.color}` : undefined,
                fields: embed.fields?.map((field) => ({
                    inline: field.inline,
                    name: parseMessage(field.name, values) || DISCORD.INVISIBLE_CHARACTER,
                    value: parseMessage(field.value, values) || DISCORD.INVISIBLE_CHARACTER,
                })),
                author: embed.author ? {
                    ...embed.author,
                    name: parseMessage(embed.author.name, values),
                } : undefined,
                footer: embed.footer ? {
                    ...embed.footer,
                    text: parseMessage(embed.footer.text, values),
                } : undefined,
            };
        })
   }
}

export function parseMessage<T extends object>(message: string, values?: T): string;
export function parseMessage<T extends object>(message?: string|null, values?: T): string|undefined;
export function parseMessage<T extends object>(message?: string|null, values?: T): string|undefined {
    if (!message) return undefined;
    if (!values) return message;

    return message.replace(/{([^}]+)}/g, (match, group) => {
        const path = group.split('.');

        let value: any = values;
        for (const part of path) {
            if (!value) return match;

            value = value[part];
        }

        return value;
    })
}