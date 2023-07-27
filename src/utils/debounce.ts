const debounces: {
  [key: string]: NodeJS.Timeout;
} = {};

const DEFAULT_DELAY_IN_MS = 1000;

export function debounce(id: string, callback: () => void, delay: number = DEFAULT_DELAY_IN_MS) {
  if (debounces[id]) {
    clearTimeout(debounces[id]);
  }

  debounces[id] = setTimeout(callback, delay);
}
