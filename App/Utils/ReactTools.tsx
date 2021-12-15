import * as React from 'react';

// Глушит сообщение мыши
export const stopMouseEvent = (event: React.MouseEvent<any>): void => {
	event.preventDefault();
	event.stopPropagation();
};

// Глушит сообщение мыши
export const stopKeyBoardEvent = (event: React.KeyboardEvent): void => {
	event.preventDefault();
	event.stopPropagation();
};

// Перечисление для задания битовой маски клавиш-модификаторов
export enum ModifierKey {
	none = 0,
	alt = 1,
	shift = 2,
	control = 4,
	meta = 8
}

// Проверяет событие мыши на нажатие Клавиш-модификаторов. Можно использовать элементы пероечисления ModifierKey для
// задания битовой маски например, testModifierKey(event, Modifier.alt + Modifier.shift)
export const testModifierKey = (event: React.MouseEvent|React.KeyboardEvent, modifiersBitMask: number): boolean => {
	let resBits = 0;
	if (event.altKey) resBits = resBits + 1;
	if (event.shiftKey) resBits = resBits + 2;
	if (event.ctrlKey) resBits = resBits + 4;
	if (event.metaKey) resBits = resBits + 8;
	return resBits == modifiersBitMask;
};