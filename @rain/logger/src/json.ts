function getCircularReplacer() {
    const seen = new WeakSet();
    return (_: string, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '<circular>';
            }
            seen.add(value);
        }
        return value;
    }

}

export function StringifySafe(value: any, space?: string | number): string {
    if (typeof value === 'string') return value;

    return JSON.stringify(value, getCircularReplacer(), space);
}