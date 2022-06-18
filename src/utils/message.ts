export function parseMessage<T extends object>(message: string, values: T): string {
    return message.replace(/{([^}]+)}/g, (_, group) => {
        const path = group.split('.');

        let value: any = values;
        for (const part of path) {
            if (!value) return '';

            value = value[part];
        }

        return value;
    })
}