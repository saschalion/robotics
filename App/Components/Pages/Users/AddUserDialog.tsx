import {AbstractModalEditor, AbstractModalEditorProps} from "Components/UX/ModalBox/ModalBox";
import * as React from "react";

export interface AddUserDialogData {

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

	constructor(props: AbstractModalEditorProps<AddUserDialogData>) {
		super(props);
		this.state = {
			isChanged: false,
		};
		this.value = JSON.parse(JSON.stringify(props.value));
	}

	public focus() {}

	public isValueValid(): boolean {
		if (!this.state.isChanged) return false;
		return true;
	}

	private onChangeData<T extends keyof AddUserDialogData>(key: T, value: AddUserDialogData[T]) {
		this.value[key] = value;
		this.setState({
			isChanged: true
		}, () => this.props.onChange(this.value));
	}

	private renderContent(): JSX.Element {
		return null;
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