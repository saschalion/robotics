import {PhoneNumber, PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';

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

// Функция - автоинкремент
let generatorValue = 0;
export const genId = (): number => {
	return ++generatorValue;
};

// Определяет строку на пустоту
export const isStringEmpty = (str: string): boolean => {
	return (!str || !str.trim().length);
};

export const getCurrentFullDate = (): string => {
	const date = new Date();
	const year = date.getFullYear();
	const month = leadingZero(String(date.getMonth()));
	const day = leadingZero(String(date.getDate()));
	const hours = leadingZero(String(date.getHours()));
	const minutes = leadingZero(String(date.getMinutes()));
	const seconds = leadingZero(String(date.getSeconds()));
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
};

const leadingZero = (str: string): string => {
	return ('00' + str).slice(-2);
};

export const formatBirthday = (DDMMYYYY: string, separator = "."): string => {
	const [d, m, y] = DDMMYYYY.split(separator).map( item => parseInt(item) );
	if (!d || !m || !y) {
		return "";
	}
	return `${y}-${leadingZero(String(m))}-${leadingZero(String(d))}T00:00:00.000Z`;
};

/**
 * Валидирует дату в диапазоне 1900 года и по сегодня
 * @param DDMMYYYY дата в формате DD-MM-YYYY не позже сегодня и не раньше 1900г.
 * @param separator разделитель даты
 */
export const isValidPastDate = (DDMMYYYY: string, separator = '-'): boolean => {
	const [ d, m, y ] = DDMMYYYY.split(separator).map( item => parseInt(item) );

	if ( !d || !m || !y ) {
		return false;
	}

	const checkDate = new Date(y, m - 1, d);

	// Не даём вводить будущие даты
	if ( checkDate.getTime() > new Date().getTime() ) {
		return false;
	}

	if ( checkDate.getFullYear() < 1900 ) {
		return false;
	}

	return (
		y == checkDate.getFullYear() &&
		m - 1 == checkDate.getMonth() &&
		d == checkDate.getDate()
	);
};

export const isValidEmail = (email: string): boolean => {
	const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm;
	return !email || new RegExp(regexp).test(email);
};

export const isValidPhone = (phone: string): boolean => {
	const regexp = /^\+79[\d]{9}$/g;
	return new RegExp(regexp).test(phone || "");
};

/**
 * Форматирование любого телефона мира с помощью библиотеки google-libphonenumber
 *
 * @param {string} value Номер телефона
 * @param {PhoneNumberFormat} format Формат номера телефона
 *
 * @example
 * Номер телефона +7 (900) 123-45-67 будет отформатирован как:
 * E164 +79001234567
 * INTERNATIONAL +7 900 123-45-67
 * NATIONAL 8 (900) 123-45-67
 * RFC3966 tel:+7-900-123-45-67
 */
export const formatPhoneNumber = (value: string, format: PhoneNumberFormat): string =>
{
	const phoneUtil = PhoneNumberUtil.getInstance();
	const isValidPhone = phoneUtil.isPossibleNumberString(value, '');

	// Для НЕ валидного номера телефона возвращаем исходную строку, так как его нельзя будет парсить
	if ( !isValidPhone ) {
		return value;
	}

	const parsedPhoneNumber: PhoneNumber = phoneUtil.parse(value);
	return phoneUtil.format(parsedPhoneNumber, format);
};