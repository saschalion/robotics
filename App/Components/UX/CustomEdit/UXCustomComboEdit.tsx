import * as React from "react";
import {genId} from "Utils/Tools";
import {KeyCodes} from "Global/Types";
import {ModifierKey, stopMouseEvent, testModifierKey} from "Utils/ReactTools";
import classNames from 'classnames';
import * as Tools from "Utils/Tools";

const styles = require('./Styles.module.sass');

interface UXCustomComboEditProps extends React.ClassAttributes<UXCustomComboEdit> {
	value?: string;
	// Наличие красной рамки (семантически неверные данные)
	wrong?: boolean;
	// Контрол снабжен кнопкой стирания значения. Если кнопка нажата, то возникает onClear()
	hasClear?: boolean;
	// Контрол снабжен кнопкой скопирования значения. Если кнопка нажата, то возникает onCopy()
	hasCopy?: boolean;
	// Контрол нередактируемый. Визуально подсвеченный серым
	disabled?: boolean;
	// Редактирование текста невозможно
	readOnly?: boolean;
	// Маленький размер контрола (приоритетнее large)
	small?: boolean;
	// Большой размер контрола
	large?: boolean;
	// 	Скрывать кнопку dropdown
	hideDropdownButton?: boolean;
	// Признак того, что попап находится снизу
	dropdownOnBottom?: boolean;
	// Признак того, что попап находится сверху
	dropdownOnTop?: boolean;
	// Без внешних рамок и скруглений
	inline?: boolean;
	// Видимость. Если не задана считается true
	visible?: boolean;
	// Возможность задать высоту попапа
	popupHeight?: number;
	// placeholder
	placeHolder?: string;
	// Внешний стиль
	style?: React.CSSProperties;
	// Внешний стиль для инпута
	inputStyle?: React.CSSProperties;
	// Внешний класс
	className?: string;
	// Событие возникает при нажатии "clear" кнопки
	onClear?(): void;
	// Событие возникает при нажатии "copy" кнопки
	onCopy?(): void;
	// Событие возникает при получении фокуса контролом
	onFocus?(event: React.FocusEvent): void;
	// Событие возникает при потере фокуса контролом
	onBlur?(event: React.FocusEvent): void;
	// Изменилось состояние выпадашки true - открылось, false - закрылось
	onPopupChange?(flag: boolean): void;
	onKeyDown?(event: React.KeyboardEvent): void;
	// Событие возникает при необходимости отрисовать содержимое инпута
	onDrawValue?(): React.ReactNode;
	// Событие возникает при необходимости отрисовать инпут поиска
	onDrawSearchInline?(): React.ReactNode;
	// Событие возникает при необходимости отрисовать popup
	onDrawPopup?(): React.ReactNode;
	// Событие возникает при щелчке на область popup
	onPopupClick?(): void;
	// Событие отрисовки хинта при наведении на контрол
	onDrawHint?(): string;
}

interface UXCustomComboEditState {
	focused: boolean;
	hovered: boolean;
	popup: boolean;
}

export class UXCustomComboEdit extends React.Component<UXCustomComboEditProps, UXCustomComboEditState> {
	private readonly ref: React.RefObject<HTMLDivElement>;
	private readonly id: number;
	constructor(props: UXCustomComboEditProps) {
		super(props);

		this.state = {
			focused: false,
			hovered: false,
			popup: false,
		};

		this.ref = React.createRef();
		this.id = genId();

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onClearClick = this.onClearClick.bind(this);
		this.onCopyClick = this.onCopyClick.bind(this);
		this.onDocumentClick = this.onDocumentClick.bind(this);
		this.onPopupMessageReceived = this.onPopupMessageReceived.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	componentWillUnmount(): void {
		document.removeEventListener('click', this.onDocumentClick);
	}

	private onMouseEnter() {
		this.setState({hovered: true});
	}

	private onMouseLeave() {
		this.setState({hovered: false});
	}

	private onFocus(event: React.FocusEvent) {
		this.setState({focused: true}, () => {
			this.props.onFocus && this.props.onFocus(event);
		});
	}

	private onBlur(event: React.FocusEvent) {
		this.setState({focused: false}, () => {
			this.props.onBlur && this.props.onBlur(event);
		});
	}

	private onPopupMessageReceived(params: {id: number}) {
		if (params.id == this.id) {
			return;
		}
		this.popup(false);
	}

	private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
		// Без клавиш модификаторов
		if (testModifierKey(event, ModifierKey.none)) {
			switch (event.keyCode) {
				case KeyCodes.ENTER: {
					if (this.props.disabled) break;
					if (this.props.readOnly) break;
					this.popup(true);
					break;
				}
				default: {}
			}
		}
		this.props.onKeyDown && this.props.onKeyDown(event);
	}
	private onClick(e: React.MouseEvent<HTMLDivElement>) {
		// проверим для порядку, что не нажаты Клавиши-модификаторы
		if (!testModifierKey(e, ModifierKey.none)) return;

		// проверим, что контрол не заблокирован и не в режиме readonly
		if (this.props.disabled) return;
		if (this.props.readOnly) return;
		if (!this.state.popup) {
			this.popup(true);
		} else {
			this.popup(false);
			this.setState({}, () => this.ref.current.focus());
		}
	}

	private onClearClick(e: React.MouseEvent<HTMLDivElement>) {
		// проверим для порядку, что не нажаты Клавиши-модификаторы
		if (!testModifierKey(e, ModifierKey.none)) return;

		// проверим, что контрол не заблокирован и не в режиме readonly
		if (this.props.readOnly) return;
		if (this.props.disabled) return;
		// гасим сообщение что бы не открывался popup
		stopMouseEvent(e);
		this.props.onClear && this.props.onClear();
	}

	private onCopyClick(e: React.MouseEvent<HTMLDivElement>) {
		// проверим для порядку, что не нажаты Клавиши-модификаторы
		if (!testModifierKey(e, ModifierKey.none)) return;

		stopMouseEvent(e);
		this.props.onCopy && this.props.onCopy();
	}

	public popup(flag: boolean) {
		if (this.state.popup == flag) return;
		this.setState({popup: flag}, () => {
			this.props.onPopupChange && this.props.onPopupChange(flag);
			if (flag) {
				document.addEventListener('click', this.onDocumentClick);
			} else {
				document.removeEventListener('click', this.onDocumentClick);
			}
		});
	}

	private onDocumentClick(event: MouseEvent) {
		let element = (event.target || event.srcElement) as HTMLElement;
		while (element) {
			if (element.id == String(this.id)) return;
			element = element.parentNode as HTMLElement;
		}
		this.popup(false);
	}

	// Устанавливает фокус на контрол
	public focus() {
		this.ref.current.focus();
	}

	public setHover = (hovered: boolean = false) => this.setState({hovered});

	private renderDropDown(): JSX.Element {
		let sizeStyle: string = null;
		if (this.props.small) {
			sizeStyle = '_size_small';
		} else if (this.props.large) {
			sizeStyle = '_size_large';
		}
		const cssStyle: React.CSSProperties = {};
		if (typeof this.props.popupHeight == 'number') {
			cssStyle.height = `${this.props.popupHeight}px`;
		}

		return (
			<div
				className={classNames(
					styles['editor__drop-down'],
					styles[sizeStyle],
					this.props.dropdownOnTop && styles['_top-position'],
					this.props.dropdownOnBottom && styles['_bottom-position']
				)}
				id={String(this.id)}
				onClick={(e) => {
					stopMouseEvent(e);
					this.props.onPopupClick && this.props.onPopupClick();
				}}
				style={cssStyle}
			>
				{this.props.onDrawPopup ? this.props.onDrawPopup() : null}
			</div>
		);
	}

	render(): JSX.Element {
		// Сразу разберемся с невидимым контролом
		if (this.props.visible === false) return null;

		// Стили для самого компонента
		let componentExStyle: string = null;

		if (this.props.disabled) {
			componentExStyle = '_style_disabled';
		} else if (this.state.focused && !this.state.popup) {
			componentExStyle = '_style_focused';
		} else if (this.props.wrong) {
			componentExStyle = '_style_wrong';
		} else if (this.state.hovered) {
			componentExStyle = '_style_hovered';
		}

		let sizeStyle: string = '_size_middle';
		if (this.props.small) {
			sizeStyle = '_size_small';
		} else if (this.props.large) {
			sizeStyle = '_size_large';
		}

		return (
			<div
				tabIndex={this.props.disabled || this.state.popup ? -1 : 0}
				ref={this.ref}
				style={this.props.style}
				className={
					classNames(
						styles['editor__frame'], styles[componentExStyle], styles[sizeStyle],
						!Tools.isStringEmpty(this.props.value || "") && styles['_has_value'],
						this.props.className,
						this.props.inline && styles['_inline']
				)}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				onClick={this.onClick}
				onKeyDown={this.onKeyDown}
			>
				<div
					style={this.props.inputStyle}
					className={classNames(
						styles['editor__input-area'],
					)}>
					{this.props.onDrawValue ? this.props.onDrawValue() : null}
					{this.props.onDrawSearchInline ? this.props.onDrawSearchInline() : null}
				</div>
				{
					this.props.hasClear &&
					<div
						className={classNames(styles['button'], styles['_kind_clear'], styles[componentExStyle])}
						onClick={this.onClearClick}
					/>
				}
				{
					this.props.hasCopy &&
					<div
						className={classNames(styles['button'], styles['_kind_copy'], 'fa fa-copy', styles[componentExStyle])}
						onClick={this.onCopyClick}
					/>
				}
				{
					!this.props.disabled &&
					!this.props.hideDropdownButton &&
					<div
						className={
							classNames(
								styles['button'],
								styles['_kind_dropdown'],
								styles[componentExStyle],
								this.state.popup && styles['_style_dropdown'],
								this.props.dropdownOnTop && styles['_top-position']
							)
						}
					/>
				}
				{
					this.props.placeHolder &&
					<div className={styles['editor__placeholder']}>
						{this.props.placeHolder}
					</div>
				}
				{this.state.popup && this.renderDropDown()}
			</div>
		);
	}
}