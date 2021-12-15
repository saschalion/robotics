import * as React from "react";
import * as Tools from "Utils/Tools";
import { ObjectId } from "Models/ServerInterfaces";
import { UXCustomComboEdit } from "../CustomEdit/UXCustomComboEdit";
import { UXStringEdit } from "../StringEdit/UXStringEdit";
import { stopMouseEvent } from "Utils/ReactTools";
import { KeyCodes } from "Global/Types";

import { IconPosition, PopupRow } from "./PopupRow";
const styles = require('./Styles.module.sass');

export interface ComboItemData<T extends ObjectId = ObjectId> {
	id: T;
	caption: string;
	onDrawIcon?(): React.ReactNode;
	iconPosition?: IconPosition;
	disabledReason?: string;
	hidden?: boolean;
	data?: any;
	itemStyle?: React.CSSProperties;
}

export interface AdditionalComboItemData {
	caption: string;
	onClick?(): void;
}

export interface UXComboObjectBasicProps {
	data: ComboItemData<any>[];
	// Без внешних рамок и скруглений
	inline?: boolean;
	// Наличие красной рамки (семантически неверные данные)
	wrong?: boolean;
	// Надпись, видимая при отсутствии значения
	placeHolder?: string;
	// Контрол нередактируемый. Визуально подсвеченный серым
	disabled?: boolean;
	// Редактирование текста невозможно
	readOnly?: boolean;
	// Без строки поиска
	noSearch?: boolean;
	// Отображать точный поиск
	hasSearchExact?: boolean;
	// Ключ точного поиска
	keySearchExact?: string;
	// Маленький размер контрола
	small?: boolean;
	// Большой размер контрола
	large?: boolean;
	// Видимость. Если не задана считается true
	visible?: boolean;
	// Признак наличия кнопки стереть значение (clear) если не задано, то есть
	hasClear?: boolean;
	// Показывать лоадер
	showLoader?: boolean;
	// Данные загружены
	loaded?: boolean;
	// Признак наличия кнопки скопировать значение (copy) если не задано, то нету
	hasCopy?: boolean;
	// Внешний стиль
	style?: React.CSSProperties;
	// Максимально количество элементов в попапе
	maxDropdownItemCount?: number;
	// Признак того, что попап находится сверху
	dropdownOnTop?: boolean;
	// Кастомные стили инпута
	inputStyle?: React.CSSProperties;
	// Дополнительные элементы выпадающего списка
	additionalElements?: AdditionalComboItemData[];
}

export interface UXComboObjectProps extends UXComboObjectBasicProps, React.ClassAttributes<UXComboObject> {
	value: ObjectId;	// Значение
	onChange?(value: ObjectId, data?: any): void;
	// Событие возникает при получении фокуса контролом
	onFocus?(): void;
	// Событие возникает при потере фокуса контролом
	onBlur?(): void;
	onKeyPress?(event: React.KeyboardEvent): void;
	onSearch?(text: string): void;
	onSearchClear?(): void;
	// метод вызываеься при выборе значения в попапе
	onApply?(): void;
}

export interface UXComboObjectState {
	// Текст поиска
	searchText?: string;
}

export class UXComboObject extends React.Component<UXComboObjectProps, UXComboObjectState> {
	private handle: number;
	private readonly searchInputRef: React.RefObject<UXStringEdit>;
	private readonly editRef: React.RefObject<UXCustomComboEdit>;
	private popup: boolean;
	private searchExactMatch: boolean;
	// Значение при котором открылся popup, Нужно чтобы была возможность вернуть старое значение по ESC
	private valuePopupOpen: ObjectId;
	private readonly itemHeight: number;
	private listValid: boolean;
	private internalList: ComboItemData[];
	constructor (props: UXComboObjectProps) {
		super(props);
		this.handle = 0;
		this.state = {
			searchText: ''
		};
		this.popup = false;
		this.valuePopupOpen = '';
		this.searchInputRef = React.createRef();
		this.editRef = React.createRef();
		this.itemHeight = 60;
		this.listValid = false;
		this.searchExactMatch = this.props.hasSearchExact;
	}

	componentDidMount(): void {}

	componentWillReceiveProps(nextProps: Readonly<UXComboObjectProps>, nextContext: any): void {
		if (this.props.data != nextProps.data) {
			this.refreshList(nextProps.data);
		}
	}

	public refreshList(list: ComboItemData[])
	{
		this.internalList = list;
		this.setState({});
	}

	private indexByid(id: ObjectId, full: boolean = false): number {
		if (!id) return -1;
		const list = full ? this.props.data : this.list();
		for (let i = 0; i < list.length; i++) {
			if (list[i].id == id) {
				return i;
			}
		}
		return -1;
	}

	private onKeyDown(event: React.KeyboardEvent) {
		if (!event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey && !this.props.disabled) {
			switch (event.keyCode) {
				// Возврат к предыдущему значению
				case KeyCodes.ESC: {
					if (this.popup) {
						event.stopPropagation();
						event.preventDefault();
						this.editRef.current.popup(false);
						this.doSetValue(this.valuePopupOpen);
						setImmediate(() => this.editRef.current.focus());
					}
					break;
				}
				// Попытка применить редактируемое значение
				case KeyCodes.ENTER: {
					if (this.popup) {
						event.stopPropagation();
						event.preventDefault();
						this.editRef.current.popup(false);
						setImmediate(() => {
							this.editRef.current.focus();
							this.props.onApply && this.props.onApply();
						});
					}
					break;
				}
				case KeyCodes.DOWN: {
					event.stopPropagation();
					event.preventDefault();
					const list = this.list();
					const index = this.indexByid(this.props.value);
					if (index + 1 < list.length) {
						this.doSetValue(list[index + 1].id);
					}
					break;
				}
				case KeyCodes.UP: {
					event.stopPropagation();
					event.preventDefault();
					const list = this.list();
					const index = this.indexByid(this.props.value);
					if ((index > 0) && (list.length > 0)) {
						this.doSetValue(list[index - 1].id);
					}
					break;
				}
				case KeyCodes.DEL: {
					if (!this.popup) {
						this.doSetValue(null);
					}
				}
			}
		}
	}

	private setSearchText(text: string) {
		if (this.state.searchText == text) return;
		this.listValid = false;
		this.setState({searchText: text});
	}

	private list(): ComboItemData[] {
		if (this.listValid) {
			return this.internalList;
		}
		this.internalList = this.props.data.filter((item) => !item.hidden);
		if ( this.state.searchText && this.props.onSearch ) {
			this.props.onSearch(this.state.searchText);
		}
		if (this.state.searchText && !this.props.onSearch) {
			const searchTextLowerCase = this.state.searchText.toLowerCase().replace(/[её]/g, "е");
			this.internalList = this.internalList.filter((item) => {
				const caption = item.caption;
				const formattedCaption = caption.toLowerCase().replace(/[её]/g, "е");
				return this.searchExactMatch ?
					formattedCaption.indexOf(searchTextLowerCase) == 0 :
					formattedCaption.indexOf(searchTextLowerCase) >= 0;
			});
		}
		this.listValid = true;
		return this.internalList;
	}

	private doSetValue(id: ObjectId) {
		if (this.props.value != id) {
			let item: ComboItemData = null;

			if ( id ) {
				let list = this.list().filter(listItem => listItem.id == id);
				item = list.length ? list[0] : null;
			}

			this.props.onChange && this.props.onChange(id, item && item.data ? item.data : null);
		}
	}

	private onDrawValue(): React.ReactNode {
		const item = this.props.data[this.indexByid(this.props.value, true)];
		if (item) {
			return item.caption;
		} else {
			return  <span style={{color: '#EC3844'}}>{this.props.value}</span>;
		}
	}

	private onDrawPopupRow(index: number): React.ReactNode {
		const item = this.list()[index];

		return (
			<PopupRow
				key={index}
				disabledReason={item.disabledReason}
				caption={item.caption}
				focused={item.id == this.props.value}
				icon={item.onDrawIcon && item.onDrawIcon()}
				style={item.itemStyle}
				onClick={(e) => {
					stopMouseEvent(e);
					this.doSetValue(item.id);
					this.editRef.current.popup(false);
					this.props.onApply && this.props.onApply();
					// Правильно будет сбросить состояние
					this.editRef.current.setHover();
				}}
			/>
		);
	}

	// Опрелеляет высоту выпадашки
	private popupHeight(): number {
		const itemCount = Math.min(this.props.maxDropdownItemCount || 11, this.list().length);
		return this.itemHeight * itemCount;
	}

	private renderAdditionalElement = (item: AdditionalComboItemData, i: number): JSX.Element => {
		const {caption, onClick} = item;
		return (
			<div
				key={i}
				className={styles['additionalElements__item']}
				onClick={() => onClick()}
			>
				{caption}
			</div>
		);
	};

	private renderAdditionalElements(): JSX.Element {
		if (!this.props.additionalElements) return null;
		return (
			<>
				<div className={styles['separator']} />
				{this.props.additionalElements.map(this.renderAdditionalElement)}
			</>
		);
	}

	private onDrawPopup(): React.ReactNode {
		return (
			<>
				{this.list().map((item, index) => {
					return this.onDrawPopupRow(index);
				})}
			</>
		);
	}

	private onPopupChange(flag: boolean) {
		this.popup = flag;
		if (flag) {
			this.valuePopupOpen = this.props.value;
		} else {
			this.props.onSearchClear && this.props.onSearchClear();
			this.setSearchText('');
		}
	}

	public focus() {
		this.editRef.current.focus();
	}

	render(): JSX.Element {
		return (
			<UXCustomComboEdit
				placeHolder={this.props.placeHolder}
				ref={this.editRef}
				wrong={this.props.wrong}
				inline={this.props.inline}
				hasClear={Boolean(this.props.value) && this.props.hasClear !== false}
				hasCopy={Boolean(this.props.value) && !!this.props.hasCopy}
				disabled={this.props.disabled}
				readOnly={this.props.readOnly}
				small={this.props.small}
				inputStyle={this.props.inputStyle}
				large={this.props.large}
				visible={this.props.visible}
				popupHeight={this.popupHeight()}
				dropdownOnTop={this.props.dropdownOnTop}
				onDrawValue={() => this.onDrawValue()}
				onDrawPopup={() => this.onDrawPopup()}
				onPopupChange={flag => this.onPopupChange(flag)}
				onClear={() => this.doSetValue(null)}
				onCopy={() => {}}
				onKeyDown={e => this.onKeyDown(e)}
				onPopupClick={() => this.searchInputRef.current && this.searchInputRef.current.focus() }
				style={this.props.style}
				value={this.props.value}
			/>
		);
	}
}
