// Чтение из localStorage
export function readLocalStorage(key: string, defaultValue?: string): string {
	return localStorage.getItem(key) || defaultValue;
}

// Запись в localStorage
export function writeLocalStorage(key: string, value: string) {
	localStorage.setItem(key, value);
}

// Получить ФИО
export function getFIO(lastName: string, firstName: string, middleName: string) {
	return `${lastName} ${firstName.substr(0, 1)}. ${middleName.substr(0, 1)}.`;
}

// Определяет мобилу и планшет
export const isMobileDevice = (): boolean => /Mobi/.test(navigator.userAgent);