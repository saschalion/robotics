export function readLocalStorage(key: string): string {
	return localStorage.getItem(key) || '';
}

export function writeLocalStorage(key: string, value: string) {
	localStorage.setItem(key, value);
}

// Определяет мобилу и планшет
export const isMobileDevice = (): boolean => /Mobi/.test(navigator.userAgent);