export class StringUtils {
    static lowercaseChar(value: string, index: number) {
        return value.slice(0, index) + value.charAt(index).toLowerCase() + value.slice(index + 1);
    }
}