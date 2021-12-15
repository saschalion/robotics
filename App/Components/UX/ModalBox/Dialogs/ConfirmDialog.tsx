import * as React from "react";
import {AbstractModalEditor} from "../ModalBox";

interface ConfirmDialogProps  extends React.ClassAttributes<ConfirmDialog> {
	value: string;
	onChange(value: React.ReactNode): void;
}

interface ConfirmDialogState {}

export class ConfirmDialog extends React.Component<ConfirmDialogProps, ConfirmDialogState> implements AbstractModalEditor<React.ReactNode> {
	public isValueValid(): boolean {
		return true;
	}

	public focus() {
		// Нам не нужен никакой особенный фокус
	}

	render(): React.ReactNode {
		const style: React.CSSProperties = {
			padding: '40px 20px',
			minWidth: '480px',
			maxWidth: '680px',
			fontSize: '14px',
			lineHeight: '20px',
			userSelect: 'text',
		};
		return (
			<div
				style={style}
				dangerouslySetInnerHTML={{__html: this.props.value}}
			/>
		);
	}
};