import * as React from "react";
import { UXCustomEdit } from "../CustomEdit/UXCustomEdit";

interface UXStringEditProps extends React.ClassAttributes<UXStringEdit> {
	// Без внешних рамок и скруглений
	inline?: boolean;
	// Наличие красной рамки (семантически неверные данные)
	wrong?: boolean;
	// Контрол снабжен кнопкой стирания значения. Если кнопка нажата, то возникает onClear()
	hasClear?: boolean;
	// контрол снабжен кнопкой копирования
	hasCopy?: boolean;
	// Контрол снабжен лупой
	hasSearch?: boolean;
	// Текст, отображаемый в edit-е
	value?: string;
	// Надпись, видимая при отсутствии значения
	placeHolder?: string;
	// Контрол нередактируемый. Визуально подсвеченный серым
	disabled?: boolean;
	// Ввод пароля со звездочками
	password?: boolean;
	// Редактирование текста невозможно
	readOnly?: boolean;
	// Максимальная длинна строки в input
	maxLength?: number;
	// Браузер подсвечивает ошибки в тексте
	spellCheck?: boolean;
	// Маленький размер контрола
	small?: boolean;
	// Большой размер контрола
	large?: boolean;
	// tabIndex для input
	tabIndex?: number;
	// Видимость. Если не задана считается true
	visible?: boolean;
	// Возможно задание фиксированной ширины в пикселах. Например для использования в тулбаре
	fixedWidth?: number;
	// Дополнительная нода внутри инпута, например для подписи
	onCustomDraw?(): React.ReactNode;
	// Позиционировать input и customDraw - в отдельном block элементе
	hasColumnWrap?: boolean;
	// Событие возникает при очищении
	onClear?(): void;
	// Событие возникает при копировании
	onCopy?(): void;
	// Событие возникает при вводе текста в input
	onChange?(value: string, e: React.ChangeEvent): void;
	// Событие возникает при получении фокуса контролом
	onFocus?(): void;
	// Событие возникает при потере фокуса контролом
	onBlur?(): void;
	// Позволяет обработать необработанные самим контролом нажатия клавиш
	onKeyDown?(event: React.KeyboardEvent): void;
	// Позволяет обработать необработанные самим контролом щелчек мыши
	onClick?(e: React.MouseEvent<HTMLDivElement>): void;
	// Позволяет отрисовать дополнительные контролы в области после input перед управляющими кнопками

	// Использовать textarea вместо input
	useTextArea?: boolean;

	// Кастомные стили
	style?: React.CSSProperties;
	// Кастомные стили инпута
	inputStyle?: React.CSSProperties;
}

interface UXStringEditState {
}

export class UXStringEdit extends React.PureComponent<UXStringEditProps, UXStringEditState> {
	readonly ref: React.RefObject<UXCustomEdit>;

	constructor(props: UXStringEditProps) {
		super(props);
		this.ref = React.createRef();
		this.state = {};
		this.doChange = this.doChange.bind(this);
		this.doClearClick = this.doClearClick.bind(this);
		this.doCopyClick = this.doCopyClick.bind(this);
		this.doFocus = this.doFocus.bind(this);
		this.doBlur = this.doBlur.bind(this);
		this.doKeyDown = this.doKeyDown.bind(this);
		this.doClick = this.doClick.bind(this);
	}

	private doFocus() {
		this.props.onFocus && this.props.onFocus();
	}

	private doBlur() {
		this.props.onBlur && this.props.onBlur();
	}

	private doChange(value: string, e?: React.ChangeEvent) {
		this.props.onChange && this.props.onChange(value, e);
	}

	private doClearClick() {
		// Очищаем значение
		this.doChange(null);
		// Фокусируемся на контрол
		this.ref.current && this.ref.current.focus && this.ref.current.focus();
		this.props.onClear && this.props.onClear();
	}
	private doCopyClick() {
		this.props.onCopy && this.props.onCopy();
	}
	private doClick(e: React.MouseEvent<HTMLDivElement>) {
		this.props.onClick && this.props.onClick(e);
	}

	private doKeyDown(event: React.KeyboardEvent) {
		this.props.onKeyDown && this.props.onKeyDown(event);
	}

	public focus() {
		if (this.ref.current) {
			this.ref.current.focus();
		}
	}

	public  select() {
		if (this.ref.current) {
			this.ref.current.select();
		}
	}

	private onCustomDraw = () => {
		if (this.props.onCustomDraw) return this.props.onCustomDraw();
	};

	render(): JSX.Element {
		return (
			<UXCustomEdit
				ref={this.ref}
				hasClear={ this.props.hasClear }
				hasCopy={ this.props.hasCopy }
				inline={this.props.inline}
				hasSearch={ this.props.hasSearch }
				value={ this.props.value }
				wrong={ this.props.wrong }
				placeHolder={ this.props.placeHolder }
				disabled={ this.props.disabled }
				password={ this.props.password }
				readOnly={ this.props.readOnly }
				maxLength={ this.props.maxLength }
				tabIndex={ this.props.tabIndex }
				spellCheck={ Boolean(this.props.spellCheck) }
				small={ this.props.small }
				large={ this.props.large }
				visible={this.props.visible}
				fixedWidth={this.props.fixedWidth}
				onChange={this.doChange}
				onCopy={this.doCopyClick}
				onClear={this.doClearClick}
				onFocus={this.doFocus}
				onBlur={this.doBlur}
				onKeyDown={this.doKeyDown}
				onClick={this.doClick}
				useTextArea={this.props.useTextArea}
				style={this.props.style}
				inputStyle={this.props.inputStyle}
				onCustomDraw={this.onCustomDraw}
				hasColumnWrap={this.props.hasColumnWrap}
			/>
		);
	}
}
