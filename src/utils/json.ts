function getCircularReplacer() {
    const seen = new WeakSet();
    return (_: string, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
            return;
            }
            seen.add(value);
        }
        return value;
    }

}

export function StringifySafe(value: any, space?: string | number) {
    return JSON.stringify(value, getCircularReplacer(), space);
}