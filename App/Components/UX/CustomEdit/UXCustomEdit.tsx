import * as React from "react";
import classNames from 'classnames';
import {ModifierKey, testModifierKey} from "Utils/ReactTools";
import * as Tools from "Utils/Tools";
const styles = require('./Styles.module.sass');

export enum BorderMode {
	Success,
	Warning,
	Error
}

interface UXCustomEditProps extends React.ClassAttributes<UXCustomEdit> {
	// Без внешних рамок и скруглений
	inline?: boolean;
	// Наличие красной рамки (семантически неверные данные), приоритетней свойства "wrongMode"
	wrong?: boolean;
	// Наличие рамки (не задано значение - фича не учитывается, Success - зеленая, Warning - оранжевая, Error - красная)
	borderMode?: BorderMode;
	// Контрол снабжен кнопкой стирания значения. Если кнопка нажата, то возникает onClear()
	// по-умолчанию true
	hasClear?: boolean;
	// Контрол снабжен кнопкой копирования. Если кнопка нажата, то возникает  onCopy()
	// по-умолчанию false
	hasCopy?: boolean;
	// Контрол снабжен кнопкой выбора (действия). Если кнопка нажата, то возникает onAction()
	hasAction?: boolean;
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
	// Маленький размер контрола (приоритетнее large)
	small?: boolean;
	// Большой размер контрола
	large?: boolean;
	// tabIndex для input
	tabIndex?: number;
	// Видимость. Если не задана считается true
	visible?: boolean;
	// Возможно задание фиксированной ширины в пикселах. Например для использования в тулбаре
	fixedWidth?: number;
	// Возможность задания цвета текста
	textColor?: string;
	// Не отображать значение контрола
	hasNoValue?: boolean;
	// Событие возникает при нажатии "clear" кнопки
	onClear?(): void;
	// Событие возникает при нажатии "copy" кнопки
	onCopy?(): void;
	// Событие возникает при нажатии "action" кнопки
	onAction?(): void;
	// Событие возникает при вводе текста в input
	onChange?(value: string, e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
	// Событие возникает при получении фокуса контролом
	onFocus?(event: React.FocusEvent): void;
	// Событие возникает при потере фокуса контролом
	onBlur?(event: React.FocusEvent): void;
	// Позволяет обработать необработанные самим контролом нажатия клавиш
	onKeyDown?(event: React.KeyboardEvent): void;
	// Позволяет обработать необработанные самим контролом щелчек мыши
	onClick?(e: React.MouseEvent<HTMLDivElement>): void;
	// Позволяет отрисовать дополнительные контролы в области после input перед управляющими кнопками
	onCustomDraw?(): React.ReactNode;
	// Событие отрисовки хинта при наведении на контрол
	onDrawHint?(): string;
	// Компонент у нас PureComponent и он не перерисуется если onCustomDraw начнет рисовать что-то другое. т.к. адрес функции не изменился
	// через изменение св-ва versionCustomDraw его можно таким образом обмануть
	versionCustomDraw?: number;
	// Использовать textarea вместо input
	useTextArea?: boolean;
	// Кастомные стили
	style?: React.CSSProperties;
	// Кастомные стили инпута
	inputStyle?: React.CSSProperties;
	// block для textarea и customDraw (Можно, конечно, усложнить в дальнейшем)
	// использовать можно, например, для подписи
	hasColumnWrap?: boolean;
}

interface UXCustomEditState {
	focused: boolean;
	hovered: boolean;
}

const BlockFC: React.FC = ({children}) => (
	<div className={styles['editor__block-fc']}>{children}</div>
);

export class UXCustomEdit extends React.PureComponent<UXCustomEditProps, UXCustomEditState> {
	private readonly inputRef: React.RefObject<HTMLInputElement>;
	private readonly textAreaRef: React.RefObject<HTMLTextAreaElement>;

	constructor(props: UXCustomEditProps) {
		super(props);
		this.state = {
			focused: false,
			hovered: false,
		};
		this.textAreaRef = React.createRef();
		this.inputRef = React.createRef();
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onInputChanged = this.onInputChanged.bind(this);
		this.onInputKeyDown = this.onInputKeyDown.bind(this);
		this.onActionClick = this.onActionClick.bind(this);
		this.onClearClick = this.onClearClick.bind(this);
		this.onCopyClick = this.onCopyClick.bind(this);
		this.onComponentClick = this.onComponentClick.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

	componentDidMount(): void {
		if (this.elementRef == this.textAreaRef && (this.props.inputStyle && !this.props.inputStyle.height)) {
			this.elementRef.current.style.height = 'unset';
			this.elementRef.current.style.height = this.textAreaHeight;
		}
	}

	componentDidUpdate(prevProps: Readonly<UXCustomEditProps>, prevState: Readonly<UXCustomEditState>, snapshot?: any) {
		if (this.elementRef == this.textAreaRef
			&& prevProps.value !== this.props.value
			&& (this.props.inputStyle && !this.props.inputStyle.height)) {
			this.elementRef.current.style.height = 'unset';
			this.elementRef.current.style.height = this.textAreaHeight;
		}
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

	private onMouseEnter() {
		this.setState({hovered: true});
	}

	private onMouseLeave() {
		this.setState({hovered: false});
	}

	private onInputChanged(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
		if (this.elementRef == this.textAreaRef) {
			this.elementRef.current.style.height = 'unset';
			this.elementRef.current.style.height = this.textAreaHeight;
		}
		this.props.onChange && this.props.onChange(e.target.value ? e.target.value : null, e);
	}

	private onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) {
		this.props.onKeyDown && this.props.onKeyDown(e);
	}

	private onComponentClick(e: React.MouseEvent<HTMLDivElement>) {
		this.props.onClick && this.props.onClick(e);
	}

	private onClearClick(e: React.MouseEvent<HTMLDivElement>) {
		// проверим для порядку, что не нажаты Клавиши-модификаторы
		if (!testModifierKey(e, ModifierKey.none)) return;

		// проверим, что контрол не заблокирован и не в режиме readonly
		if (this.props.disabled) return;
		if (this.props.readOnly) return;
		setImmediate(() => {
			this.props.onClear && this.props.onClear();
		});
	}

	private onCopyClick(e: React.MouseEvent<HTMLDivElement>) {
		// проверим для порядку, что не нажаты Клавиши-модификаторы
		if (!testModifierKey(e, ModifierKey.none)) return;

		// проверим, что контрол не заблокирован и не в режиме readonly
		if (this.props.disabled) return;
		if (this.props.readOnly) return;
		setImmediate(() => {
			this.props.onCopy && this.props.onCopy();
		});
	}

	private onActionClick(e: React.MouseEvent<HTMLDivElement>) {
		// проверим для порядку, что не нажаты Клавиши-модификаторы
		if (!testModifierKey(e, ModifierKey.none)) return;

		// проверим, что контрол не заблокирован и не в режиме readonly
		if (this.props.disabled) return;
		if (this.props.readOnly) return;

		this.props.onAction && this.props.onAction();
	}

	// Устанавливает фокус на контрол
	public focus() {
		this.elementRef.current.focus();
	}

	// Выделяет текст в контроле
	public select() {
		this.elementRef.current.select();
	}

	// положение каретки в контроле
	public get cursorPosition(): number {
		const current = this.elementRef.current;
		if (!current) return null;
		return this.elementRef.current.selectionStart;
	}
	public set cursorPosition(val: number) {
		const current = this.elementRef.current;
		if (!current) return;
		this.elementRef.current.selectionStart = val;
	}

	public get elementRef(): React.RefObject<HTMLInputElement> | React.RefObject<HTMLTextAreaElement> {
		return this.props.useTextArea
			? this.textAreaRef
			: this.inputRef;
	}

	private get textAreaHeight(): string {
		const current = this.elementRef.current;
		if (!current) return null;
		return current.scrollHeight + 'px';
	}

	private renderValue(sizeStyle?: string): JSX.Element {
		if (this.props.hasNoValue) return null;
		return (
			// Реализовал использование textarea через опциональный пропс
			// Возможно нужно вынести в компонент с отдельной логикой, но особого смысла нет
			// высота - автоматическая в зависимости от размера значения
			this.props.useTextArea
				? (
					<textarea
						style={{
							resize: 'none',
							minHeight: '48px',
							padding: '8px 12px',
							color: this.props.textColor ? this.props.textColor : '',
							...this.props.inputStyle
						}}
						tabIndex={this.props.tabIndex}
						ref={this.textAreaRef}
						className={classNames(styles['editor__input'])}
						placeholder={this.props.placeHolder}
						spellCheck={Boolean(this.props.spellCheck)}
						disabled={Boolean(this.props.disabled)}
						readOnly={Boolean(this.props.readOnly)}
						value={this.props.value ? this.props.value : ''}
						maxLength={this.props.maxLength}
						onChange={this.onInputChanged}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
						onKeyDown={this.onInputKeyDown}
					/>
				) : (
					<input
						style={{
							color: this.props.textColor ? this.props.textColor : '',
							...this.props.inputStyle
						}}
						tabIndex={this.props.tabIndex}
						ref={this.inputRef}
						className={classNames(
							styles['editor__input'],
							sizeStyle && styles[sizeStyle]
						)}
						type={this.props.password ? 'password' : null}
						// placeholder={this.props.placeHolder}
						spellCheck={Boolean(this.props.spellCheck)}
						disabled={Boolean(this.props.disabled)}
						readOnly={Boolean(this.props.readOnly)}
						value={this.props.value ? this.props.value : ''}
						maxLength={this.props.maxLength}
						onChange={this.onInputChanged}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
						onKeyDown={this.onInputKeyDown}
					/>
				)
		);
	}

	private renderHint(sizeStyle?: string): JSX.Element {
		if (!this.state.hovered) return null;
		if (!this.props.onDrawHint) return null;
		return (
			<div
				className={classNames (
					styles['editor__hint'],
					sizeStyle && styles[sizeStyle],
					styles['_bottom-position']
				)}
			>
				{this.props.onDrawHint()}
			</div>
		);
	}

	render(): JSX.Element {
		// Сразу разберемся с невидимым контролом
		if (this.props.visible === false) return null;

		// Стили для самого компонента
		let componentExStyle: string = null;
		// Стили для action Button
		let actionButtonExStyle: string = null;
		if (this.props.disabled) {
			componentExStyle = '_style_disabled';
			actionButtonExStyle = '_style_disabled';
		} else {
			if (this.props.borderMode == BorderMode.Error || this.props.wrong) {
				componentExStyle = '_style_wrong';
				actionButtonExStyle = '_style_wrong';
			} else if (this.props.borderMode == BorderMode.Warning) {
				componentExStyle = '_style_warning';
			} else if (this.props.borderMode == BorderMode.Success) {
				componentExStyle = '_style_success';
			}
			//
			if (this.state.focused) {
				if (!this.props.borderMode && !this.props.wrong) {
					componentExStyle = '_style_focused';
				}
				if (!this.props.readOnly) {
					actionButtonExStyle = '_style_focused';
				}
			} else if (this.state.hovered) {
				if (!this.props.borderMode && !this.props.wrong) {
					componentExStyle = '_style_hovered';
				}
				if (!this.props.readOnly) {
					actionButtonExStyle = '_style_hovered';
				}
			}
		}
		// Стиль размера контрола
		let sizeStyle: string = '_size_middle';
		if (this.props.small) {
			sizeStyle = '_size_small';
		} else if (this.props.large) {
			sizeStyle = '_size_large';
		}
		// Дополнительные CSS стили
		let style: React.CSSProperties = {};
		if (this.props.fixedWidth) {
			style.minWidth = `${this.props.fixedWidth}px`;
			style.maxWidth = `${this.props.fixedWidth}px`;
		}
		if (this.props.useTextArea) {
			style.maxHeight = 'unset';
			style.height = 'unset';
		}
		style = {
			...style,
			...this.props.style
		};

		const TextAreaWrap = this.props.hasColumnWrap ? BlockFC : React.Fragment;
		return (
			<div
				className={classNames(
					styles['editor__frame'],
					this.props.inline && styles['_inline'],
					styles[componentExStyle],
					!Tools.isStringEmpty(this.props.value || "") && styles['_has_value'],
					this.state.focused && styles['_style_real-focused'],
					styles[sizeStyle])
				}
				style={style}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onClick={this.onComponentClick}

			>
				{
					this.props.hasCopy &&
					<div
						className={classNames(
							styles['button'],
							styles['_kind_copy_left'],
							styles[sizeStyle],
							styles[actionButtonExStyle],
							this.props.hasCopy && styles['_permanent'],
							'fa fa-link'
						)}
						onClick={this.onCopyClick}
					/>
				}
				<TextAreaWrap>
					{this.renderValue(sizeStyle)}
					{this.props.onCustomDraw && this.props.onCustomDraw()}
				</TextAreaWrap>
				{
					(this.props.hasClear !== false) && this.props.value && (this.props.disabled != true) && (this.props.readOnly != true) &&
					<div
						className={classNames(
							styles['button'],
							styles['_kind_clear'],
							styles[sizeStyle],
							styles[actionButtonExStyle],
							this.props.hasSearch && styles['_permanent']
						)}
						onClick={this.onClearClick}
					/>
				}
				{
					this.props.hasAction &&
					<div
						className={
							classNames(
								styles['button'],
								styles['_kind_action'],
								styles[actionButtonExStyle],
								styles[sizeStyle]
							)
						}
						onClick={this.onActionClick}
					/>
				}
				{
					this.props.hasSearch && !this.props.value &&
					<div
						className={
							classNames(
								styles['button'],
								styles['_kind_search'],
								styles[actionButtonExStyle],
								styles[sizeStyle]
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
				{this.renderHint(sizeStyle)}
			</div>
		);
	}
}
