import * as React from 'react';
import classNames from 'classnames';

const styles = require("./Button.module.sass");

interface ButtonProps {
	caption: string;
	onClick(): void;
	size?: "default"|"middle"|"big";
	theme?: "default"|"primary";
	style?: React.CSSProperties;
	fullWidth?: boolean;
	icon?: "plus";
	disabled?: boolean;
}

export class UXButton extends React.Component<ButtonProps, {}> {
	private onClick(): void {
		if (this.props.disabled) return;
		this.props.onClick();
	}

	render(): JSX.Element {
		return (
			<div
				className={
					classNames(
						styles['btn'],
						this.props.size && styles[`_size_${this.props.size}`],
						styles[`_theme_${this.props.theme || "default"}`],
						this.props.fullWidth && styles['_full-width'],
						this.props.disabled && styles['_disabled']
					)
				}
				onClick={() => this.onClick()}
				style={this.props.style || null}
			>
				{this.props.caption}
				{
					this.props.icon &&
					<div className={classNames(styles['btn__icon'], styles[`_icon_${this.props.icon}`])}/>
				}
			</div>
		);
	}
}