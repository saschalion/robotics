import {AbstractModalEditor, AbstractModalEditorProps} from "Components/UX/ModalBox/ModalBox";
import * as Server from "Models/ServerInterfaces";
import * as React from "react";
import {UXStringEdit} from "Components/UX/StringEdit/UXStringEdit";
import {UXRow} from "Components/UX/Row/UXRow";
import {ComboItemData, UXComboObject} from "Components/UX/ComboBox/UXComboObject";
import {UXMaskedEdit} from "Components/UX/CustomEdit/UXMaskedEdit";
import * as Tools from "Utils/Tools";
const styles = require('./Dialog.module.sass');

export interface AddUserDialogData extends Server.AddUser {
	roles: Server.Role[];
}

interface AddUserDialogProps extends React.ClassAttributes<AddUserDialogData> {
	value: AddUserDialogData;
	onChange(value: AddUserDialogData): void;
	onApply?(value: AddUserDialogData): void;
}

interface AddUserDialogState {
	isChanged?: boolean;
}

export class AddUserDialog extends React.Component<AddUserDialogProps, AddUserDialogState> implements AbstractModalEditor<AddUserDialogData> {
	private value: AddUserDialogData;
	private readonly _nameRef: React.RefObject<UXStringEdit>;

	constructor(props: AbstractModalEditorProps<AddUserDialogData>) {
		super(props);
		this.state = {
			isChanged: false,
		};
		this.value = JSON.parse(JSON.stringify(props.value));
		this._nameRef = React.createRef();
	}

	public focus() {
		this._nameRef && this._nameRef.current && this._nameRef.current.focus();
	}

	public isValueValid(): boolean {
		if (!this.state.isChanged) return false;
		if (Tools.isStringEmpty(this.data.name)) return false;
		if (Tools.isStringEmpty(this.data.surname)) return false;
		if (Tools.isStringEmpty(this.data.middleName)) return false;
		if (!this.data.roleId) return false;
		if (!this.isValidBirthday) return false;
		if (Tools.isStringEmpty(this.data.birthPlace)) return false;
		if (!this.isValidEmail) return false;
		if (!this.isValidPhone) return false;
		return true;
	}

	private onChangeData<T extends keyof AddUserDialogData>(key: T, value: AddUserDialogData[T]) {
		this.value[key] = value;
		this.setState({
			isChanged: true
		}, () => this.props.onChange(this.value));
	}

	private get data(): AddUserDialogData {
		return this.value;
	}

	private get roles(): ComboItemData[] {
		return this.data.roles.map(item => {
			return {
				id: item.id,
				caption: item.title
			}
		});
	}

	private get isValidBirthday(): boolean {
		if (!this.data.birthday) return false;
		return Tools.isValidPastDate(this.data.birthday, ".");
	}

	private get isValidEmail(): boolean {
		if (Tools.isStringEmpty(this.data.email)) return false;
		return Tools.isValidEmail(this.data.email);
	}

	private get isValidPhone(): boolean {
		if (Tools.isStringEmpty(this.data.phoneNumber)) return false;
		return Tools.isValidPhone(this.data.phoneNumber);
	}

	private renderContent(): JSX.Element {
		return (
			<div className={styles['dialog__form']}>
				<UXRow>
					<UXStringEdit
						placeHolder={"Имя"}
						onChange={(value) => {
							this.onChangeData("name", value);
						}}
						value={this.data.name}
						wrong={Tools.isStringEmpty(this.data.name)}
						hasClear
						large
						ref={this._nameRef}
					/>
				</UXRow>
				<UXRow>
					<UXStringEdit
						placeHolder={"Фамилия"}
						onChange={(value) => {
							this.onChangeData("surname", value);
						}}
						value={this.data.surname}
						wrong={Tools.isStringEmpty(this.data.surname)}
						hasClear
						large
					/>
				</UXRow>
				<UXRow>
					<UXStringEdit
						placeHolder={"Отчество"}
						onChange={(value) => {
							this.onChangeData("middleName", value);
						}}
						value={this.data.middleName}
						wrong={Tools.isStringEmpty(this.data.middleName)}
						hasClear
						large
					/>
				</UXRow>
				<UXRow>
					<UXComboObject
						placeHolder={"Роль"}
						data={this.roles}
						onChange={(value) => {
							this.onChangeData("roleId", value);
						}}
						value={this.data.roleId}
						wrong={Tools.isStringEmpty(this.data.roleId)}
						hasClear
						large
					/>
				</UXRow>
				<UXRow>
					<UXMaskedEdit
						placeHolder={"Дата рождения"}
						onChange={(value) => {
							this.onChangeData("birthday", value);
						}}
						mask="99.99.9999"
						value={this.data.birthday}
						wrong={!this.isValidBirthday}
						hasClear
						large
					/>
				</UXRow>
				<UXRow>
					<UXStringEdit
						placeHolder={"Место рождения"}
						onChange={(value) => {
							this.onChangeData("birthPlace", value);
						}}
						value={this.data.birthPlace}
						wrong={Tools.isStringEmpty(this.data.birthPlace)}
						hasClear
						large
					/>
				</UXRow>
				<UXRow>
					<UXStringEdit
						placeHolder={"Email"}
						onChange={(value) => {
							this.onChangeData("email", value);
						}}
						value={this.data.email}
						wrong={!this.isValidEmail}
						hasClear
						large
					/>
				</UXRow>
				<UXRow>
					<UXMaskedEdit
						placeHolder={"Номер телефона"}
						onChange={(value) => {
							this.onChangeData("phoneNumber", (value || "").replace(/[^+\d]/g, ''));
						}}
						mask="+7 (9__) ___-__-__"
						maskChar="_"
						formatChars={ {_: '[0-9]'} }
						value={this.data.phoneNumber}
						wrong={!this.isValidPhone}
						hasClear
						large
					/>
				</UXRow>
			</div>
		);
	}

	render(): JSX.Element {
		return (
			<div
				style={ {
					width: "900px",
					padding: "15px",
					maxHeight: "calc(100vh - 160px)",
					height: "calc(100vh - 160px)",
					overflow: "auto"
				}}
			>
				{this.renderContent()}
			</div>
		);
	}
}