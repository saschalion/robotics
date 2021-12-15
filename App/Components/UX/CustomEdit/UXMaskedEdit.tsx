import * as React from "react";
import classNames from 'classnames';
import * as Tools from "Utils/Tools";

const ReactInputMask  = require ("react-input-mask");
const styles = require('./Styles.module.sass');

interface UXMaskedEditProps extends React.ClassAttributes<UXMaskedEdit> {
	value?: string;
	// Маска
	mask: string;
	// Символ который отображается на незаполненных позициях (по умолчанию символ "_")
	maskChar?: string;
	// задание собственных символов в маске, которые обозначают регулярные выражения
	// по умолчанию 9 - [0-9], a - [A-Za-z], * - [A-Za-z0-9]
	// при задании значения по умолчанию не задействуются
	formatChars?: { [key: string]: string };
	onChange?(value: string): void;
	// Без внешних рамок и скруглений
	inline?: boolean;
	// Наличие красной рамки (семантически неверные данные)
	wrong?: boolean;
	// Контрол снабжен кнопкой стирания значения. Если кнопка нажата, то возникает onClear()
	// по-умолчанию true
	hasClear?: boolean;
	// Надпись, видимая при отсутствии значения
	placeHolder?: string;
	// Контрол нередактируемый. Визуально подсвеченный серым
	disabled?: boolean;
	// Редактирование текста невозможно
	readOnly?: boolean;
	// Маленький размер контрола (приоритетнее large)
	small?: boolean;
	// Большой размер контрола
	large?: boolean;
	// tabIndex для input
	tabIndex?: number;
	// Возможно задание фиксированной ширины в пикселах. Например для использования в тулбаре
	fixedWidth?: number;
	// Событие возникает при нажатии "clear" кнопки
	onClear?(): void;
	// Событие возникает при получении фокуса контролом
	onFocus?(event: React.FocusEvent): void;
	// Событие возникает при потере фокуса контролом
	onBlur?(event: React.FocusEvent): void;
	// Позволяет обработать необработанные самим контролом нажатия клавиш
	onKeyDown?(event: React.KeyboardEvent): void;
	// Позволяет обработать необработанные самим контролом щелчек мыши
	onClick?(e: React.MouseEvent<HTMLDivElement>): void;
	// Кастомные стили
	inputMaskClassName?: React.CSSProperties;
	style?: React.CSSProperties;
}

interface UXMaskedEditState {
	focused: boolean;
	hovered: boolean;
}

export class UXMaskedEdit extends React.Component<UXMaskedEditProps, UXMaskedEditState> {
	private readonly inputRef: React.RefObject<HTMLInputElement>;
	constructor( props: UXMaskedEditProps) {
		super(props);
		this.state = {
			focused: false,
			hovered: false
		};
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onClear = this.onClear.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);

		this.inputRef = React.createRef();
	}

	private onChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.props.onChange && this.props.onChange(e.target.value ? e.target.value : null );
	}

	private onClear() {
		if (this.props.disabled) return;
		if (this.props.readOnly) return;
		this.props.onChange && this.props.onChange(null);
		this.props.onClear && this.props.onClear();
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

	private onKeyDown(event: React.KeyboardEvent) {
		this.props.onKeyDown && this.props.onKeyDown(event);
	}

	private onClick(e: React.MouseEvent<HTMLDivElement>) {
		this.props.onClick && this.props.onClick(e);
	}

	public focus() {
		this.inputRef && this.inputRef.current && this.inputRef.current.focus();
	}

	render(): JSX.Element {
		// Стили для самого компонента
		let componentExStyle: string = null;
		// Стили для action Button
		let actionButtonExStyle: string = null;
		if (this.props.disabled) {
			componentExStyle = '_style_disabled';
			actionButtonExStyle = '_style_disabled';
		} else if (this.state.focused) {
			if (!this.props.readOnly) {
				componentExStyle = '_style_focused';
				actionButtonExStyle = '_style_focused';
			}
		} else if (this.props.wrong) {
			componentExStyle = '_style_wrong';
			actionButtonExStyle = '_style_wrong';
		} else if (this.state.hovered) {
			componentExStyle = '_style_hovered';
			actionButtonExStyle = '_style_hovered';
		}

		if (this.props.readOnly) {
			componentExStyle = '_style_readOnly';
			actionButtonExStyle = '_style_readOnly';
		}

		// Стиль размера контрола
		let sizeStyle: string = '_size_middle';
		if (this.props.small) {
			sizeStyle = '_size_small';
		} else if (this.props.large) {
			sizeStyle = '_size_large';
		}
		// Дополнительные CSS стили
		let style: React.CSSProperties = {...this.props.style};
		if (this.props.fixedWidth) {
			style.minWidth = `${this.props.fixedWidth}px`;
			style.maxWidth = `${this.props.fixedWidth}px`;
		}

		return (
			<div
				className={classNames(
					styles['editor__frame'],
					this.props.inline && styles['_inline'],
					styles[componentExStyle],
					!Tools.isStringEmpty(this.props.value || "") && styles['_has_value'],
					this.state.focused && !this.props.readOnly  && styles['_style_real-focused'],
					styles[sizeStyle])
				}
				style={style}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onClick={this.onClick}

			>
				<ReactInputMask
					mask={ this.props.mask }
					maskChar={ this.props.maskChar }
					formatChars={ this.props.formatChars }
					className={ classNames(styles['editor__input'], styles[sizeStyle], this.props.inputMaskClassName) }
					disabled={ this.props.disabled }
					value={ this.props.value ? this.props.value : '' }
					onChange={ this.onChange }
					onKeyDown={ this.onKeyDown }
					readOnly={ this.props.readOnly }
					onFocus={ this.onFocus }
					onBlur={ this.onBlur }
					tabIndex={ this.props.tabIndex }
					spellCheck={ false }
				>
					{(inputProps: any) => {
						const props = {
							...inputProps,
							disabled: this.props.disabled
						};

						return (
							<input ref={this.inputRef} {...props} />
						);
					}}
				</ReactInputMask>
				{
					(this.props.hasClear !== false) && this.props.value && !this.props.readOnly &&
					<div
						className={classNames(
							styles['button'],
							styles['_kind_clear'],
							styles[sizeStyle],
							styles[actionButtonExStyle]
						)}
						onClick={this.onClear}
					/>
				}
				{
					this.props.placeHolder &&
					<div className={styles['editor__placeholder']}>
						{this.props.placeHolder}
					</div>
				}
			</div>
		);
	}
}