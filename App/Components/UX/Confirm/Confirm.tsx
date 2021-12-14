import * as React from 'react';
import classNames from 'classnames';

import {KeyCodes} from 'Global/Types';
import {UXButton} from 'Components/UX/Button/Button';

const styles = require("./Confirm.module.sass");

interface ConfirmProps {
	title?: string;
	caption?: string;
	text: string;
	onComplete(): void;
	onCancel(): void;
}

interface ConfirmState {
	overlayClicked?: boolean;
}

export class UXConfirm extends React.Component<ConfirmProps, ConfirmState> {
	constructor(props: ConfirmProps) {
		super(props);

		this.state = {
			overlayClicked: false
		};

		this.focus = this.focus.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onComplete = this.onComplete.bind(this);
		this.onOverlayClick = this.onOverlayClick.bind(this);
	}

	private onCancel(): void {
		this.props.onCancel();
	}

	private onComplete(): void {
		this.props.onComplete();
	}

	private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
		switch (e.keyCode) {
			case KeyCodes.ENTER:
				this.onComplete();
				break;

			case KeyCodes.ESC:
				this.onCancel();
		}
	}

	private focus(e: HTMLDivElement): void {
		e && e.focus();
	}

	private onOverlayClick(): void {
		this.setState({
			overlayClicked: true
		},  () => {
			setTimeout(() => {
				this.setState({
					overlayClicked: false
				});
			}, 700);
		});
	}

	render(): JSX.Element {
		if (!this.props.text) {
			return null;
		}

		let classes = classNames(
			styles['confirm__inner'],
			this.state.overlayClicked && styles['_state_error']
		);

		return (
			<div
				className={classNames(styles['confirm'], styles['_size_small'])}
				ref={this.focus}
				tabIndex={1}
				onKeyDown={this.onKeyDown}
			>
				<div className={ classes }>
					<div className={ styles['confirm__head'] }>
						<div className={ styles['confirm__title'] }>
							{this.props.caption || "Подтвердите действие"}
						</div>
					</div>

					<div className={ styles['confirm__content'] }>
						{
							this.props.title &&
							<div className={ styles['confirm__content-title'] }>
								{this.props.title}
							</div>
						}
						<div className={ styles['confirm__text'] } dangerouslySetInnerHTML={{__html: this.props.text}} />
					</div>

					<div className={ styles['confirm__foot'] }>
						<UXButton
							caption={"Нет"}
							theme={"primary"}
							onClick={() => this.onCancel()}
							fullWidth
						/>
						<UXButton
							caption={"Да"}
							style={{marginLeft: "10px"}}
							onClick={() => this.onComplete()}
							fullWidth
						/>
					</div>
				</div>

				<span
					className={ styles['confirm__overlay'] }
					onClick={ this.onOverlayClick }
				/>
			</div>
		);
	}
}