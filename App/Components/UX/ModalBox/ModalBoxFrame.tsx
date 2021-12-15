import * as React from "react";

import classNames from 'classnames';
import { UXButton } from "Components/UX/Button/Button";
const styles = require("./ModalBoxFrame.module.sass");

export interface ModalBoxFrameProps extends React.ClassAttributes<ModalBoxFrame> {
	offsetX?: number;
	offsetY?: number;
	caption: React.ReactNode;
	okBtnCaption?: string;
	hideButtonsPanel?: boolean | 'hideWithBottomPadding';
	hideCaptionPanel?: boolean;
	enabledOKButton?: boolean;
	hasFullScreen?: boolean;
	isFullScreen?: boolean;
	onOKClick(): void;
	onCancelClick(): void;
	onMouseDownCapture?(event: React.MouseEvent): void;
	onFullScreenClick?(): void;
}

export class ModalBoxFrame extends React.PureComponent<ModalBoxFrameProps, {}> {

	private readonly ref: React.RefObject<HTMLDivElement>;

	constructor(props: ModalBoxFrameProps) {
		super(props);
		this.ref = React.createRef();
	}

	private onOKClick() {
		if (this.props.enabledOKButton) {
			this.props.onOKClick && this.props.onOKClick();
		}
	}

	private onCancelClick() {
		this.props.onCancelClick && this.props.onCancelClick();
	}

	get width(): number {
		return this.ref.current.getBoundingClientRect().width;
	}

	get height(): number {
		return this.ref.current.getBoundingClientRect().height;
	}

	public focus() {
		this.ref.current && this.ref.current.focus();
	}

	render(): JSX.Element {
		let buttonsPanel: JSX.Element = null;
		if (!this.props.hideButtonsPanel) {
			buttonsPanel = (
				<div className={styles['modal-box__bottom-area']}>
					<UXButton
						caption={this.props.okBtnCaption || "Ок"}
						onClick={() => this.onOKClick()}
						fullWidth
					/>
					<UXButton
						caption={"Отмена"}
						theme={"primary"}
						style={{marginLeft: "10px"}}
						onClick={() => this.onCancelClick()}
						fullWidth
					/>
				</div>
			);
		}

		let captionPanel: JSX.Element = null;
		if (!this.props.hideCaptionPanel) {
			captionPanel = (
				<div
					className={classNames(
						styles['modal-box__top-area'],
						this.props.onMouseDownCapture && styles['_move']
					)}
					onMouseDownCapture={e => {
						this.props.onMouseDownCapture && this.props.onMouseDownCapture(e);
					}}
				>
					<div className={styles['modal-box__title']}>{this.props.caption}</div>
					<div className={styles['modal-box__top-buttons']}>
						<div
							className={classNames(
								styles['modal-box__top-buttons-item'],
								styles['_close']
							)}
							onClick={() => this.onCancelClick()}
						/>
					</div>
				</div>
			);
		}
		const modalBoxStyles: React.CSSProperties = {
			top: !this.props.isFullScreen ? this.props.offsetY : 0,
			left: !this.props.isFullScreen ? this.props.offsetX : 0
		};
		return (
			<div
				tabIndex={0} ref={this.ref}
				className={classNames(
					styles['modal-box']
				)}
				style={modalBoxStyles}
			>
				{captionPanel}
				<div
					className={classNames(styles['modal-box__main-area'],
						(this.props.hideButtonsPanel == 'hideWithBottomPadding') && styles['_kind_noPanel'])}
				>
					{this.props.children}
				</div>
				{buttonsPanel}
			</div>
		);
	}
}