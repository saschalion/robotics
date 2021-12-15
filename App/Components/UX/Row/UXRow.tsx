import * as React from "react";
import classNames from 'classnames';
const styles = require("./UXRowStyles.module.sass");

interface UXRowProps extends React.ClassAttributes<UXRow> {
	doNotRender?: boolean;
	// Занять по вертикали все свободное место
	spring?: boolean;
	style?: React.CSSProperties;
	className?: string;
	title?: string;
}

interface UXRowState
{
}

export class UXRow extends React.Component<UXRowProps, UXRowState> {
	render(): JSX.Element {
		if (this.props.doNotRender) return null;

		return (
			<div
				className = {classNames(
					this.props.className,
					styles['ux-row'],
					this.props.spring && styles['_spring'],
				)}
				style={this.props.style}
				title={this.props.title}
				children={this.props.children}
			/>
		);
	}
}
