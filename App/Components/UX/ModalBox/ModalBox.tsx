import * as React from "react";
import {ModalBoxFrame, ModalBoxFrameProps} from "./ModalBoxFrame";
import classNames from 'classnames';
import {ConfirmDialog} from "./Dialogs/ConfirmDialog";
import {ConstructorOf, KeyCodes} from "Global/Types";

const styles = require("./ModalBox.module.sass");

// ---------------------------------------------------------------------------------------------------------------------
export interface AbstractModalEditorProps<T, P = any> {
	// Передаваемое на редактирование значение
	value: T;
	additionalData?: P;
	onChange(value: T): void;
	onApply?(value: T): void;
	onOKClick?(): void;
	onCancelClick?(): void;
	ref?: any;
}

export type ModalOptions = {
	okBtnCaption?: string;
	hideButtonsPanel?: ModalBoxFrameProps['hideButtonsPanel'];
	hideCaptionPanel?: boolean;
	closeOnOutsideClick?: boolean;
	showConfirmOnCancelClick?: boolean;
	reversedButtons?: boolean;
	additionalElement?: React.ReactNode;
	hasFullScreen?: boolean;
};

export class AbstractModalEditor<T, P = any, S = any> extends React.Component<AbstractModalEditorProps<T, P>, S> {
	// Передача значения гарантируется через вызов внутри modalBox
	public isValueValid(changedValue?: T): boolean {
		return false;
	}

	public focus() {
		console.warn('AbstractModalEditor.focus не реализован в наследнике');
	}
}
// ---------------------------------------------------------------------------------------------------------------------
interface ModalLayerControllerProps extends React.ClassAttributes<ModalLayerController> {
}

type LayerInfo = {
	// Класс слоя
	class: typeof CustomModalLayer;
	// Дополнительные react св-ва класса слоя
	props: any;
	// ссылки на callback-функции промиса
	resolve(value: any): void;
	reject(reason: any): void;

};

export class ModalLayerController extends React.Component<ModalLayerControllerProps, {}> {
	private readonly layers: LayerInfo[];

	constructor(props: ModalLayerControllerProps) {
		super(props);
		this.layers = [];
	}

	componentDidMount(): void {
		modalBox = this;
		window['modalBox'] = modalBox;
	}

	componentWillUnmount(): void {
		this.rejectAll();
		modalBox = null;
		window['modalBox'] = modalBox;
	}

	// private add(): Promise<any> {
	// 	return this.internalAdd(ModalBoxLayer, {caption: 'Заголовок', editorClass: AskYesNoDialog, value: 'qu-qu?'});
	// }

	public showImmutable<T = any, P = any>(
		caption: React.ReactNode,
		editorClass: ConstructorOf<AbstractModalEditor<T, P, any>>,
		value: T,
		additionalData?: P,
		modalOptions?: ModalOptions
	): Promise<T> {
		return this.show<T, P>(caption, editorClass, JSON.parse(JSON.stringify(value)), additionalData, modalOptions);
	}

	public show<T = any, P = any>(
		caption: React.ReactNode,
		editorClass: ConstructorOf<AbstractModalEditor<T, P, any>>,
		value: T,
		additionalData?: P,
		modalOptions?: ModalOptions
	): Promise<T> {
		return this.internalAdd(ModalBoxLayer, {
			additionalData: additionalData,
			caption: caption,
			closeOnOutsideClick: true,
			editorClass: editorClass,
			hideButtonsPanel: false,
			value: value,
			...(modalOptions || {})
		});
	}

	public showNoButtons<T = any, P = any>(
		caption: React.ReactNode,
		editorClass: ConstructorOf<AbstractModalEditor<T, P, any>>,
		value: T,
		additionalData?: P,
		modalOptions?: ModalOptions
	): Promise<T> {
		return this.internalAdd(ModalBoxLayer, {
			additionalData: additionalData,
			caption: caption,
			closeOnOutsideClick: false,
			editorClass: editorClass,
			hideButtonsPanel: true,
			value: value,
			...(modalOptions || {})
		});
	}

	private internalAdd(layerClass: typeof CustomModalLayer, props: any): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let layer = {resolve: resolve, reject: reject, class: layerClass, props: props};
			this.layers.push(layer);
			this.setState({});
		});
	}

	public rejectAll() {
		this.onLayerReject(0, null);
	}

	private onLayerReject(index: number, reason: any) {
		for (let i = index; i < this.layers.length; i++) {
			const layer = this.layers[i];
			if (layer.reject) {
				try {
					layer.reject(reason);
				} catch (e) {
					console.error(e);
				} finally {
					layer.reject = null;
					layer.resolve = null;
				}
			}
		}
		this.layers.splice(index);
		this.setState({});
	}

	private onLayerResolve(index: number, value: any) {
		for (let i = index; i < this.layers.length; i++) {
			const layer = this.layers[i];
			if (layer.resolve) {
				try {
					layer.resolve(value);
				} catch (e) {
					console.error(e);
				} finally {
					layer.reject = null;
					layer.resolve = null;
				}
			}
		}
		this.layers.splice(index);
		this.setState({});
	}

	render(): JSX.Element {
		return (
			<>
				{
					this.layers.map((item, index, array) => React.createElement(item.class, {
							onReject: (value: any) => this.onLayerReject(index, value),
							onResolve: (value: any) => this.onLayerResolve(index, value),
							topMost: index == array.length - 1,
							key: index,
							...item.props
						})
					)
				}
			</>
		);
	}
}

// абстракция модального слоя ------------------------------------------------------------------------------------------
interface CustomModalLayerProps extends React.ClassAttributes<CustomModalLayer> {
	onResolve(value: any): void;
	onReject(reason: any): void;
	topMost?: boolean;
}

export class CustomModalLayer extends React.Component<CustomModalLayerProps, any> {}

// ---------------------------------------------------------------------------------------------------------------------
interface ModalBoxLayerProps extends CustomModalLayerProps {
	additionalData?: any;
	caption: string;
	okBtnCaption?: string;
	closeOnOutsideClick?: boolean;
	showConfirmOnCancelClick?: boolean;
	editorClass: typeof AbstractModalEditor;
	hideButtonsPanel?: ModalBoxFrameProps['hideButtonsPanel'];
	hideCaptionPanel?: boolean;
	hasFullScreen?: boolean;
	value: any;
}

interface ModalBoxLayerState {
	dx: number;
	dy: number;
	value: any;
	isFullScreen?: boolean;
}

export class ModalBoxLayer extends React.Component<ModalBoxLayerProps, ModalBoxLayerState> implements CustomModalLayer {
	private readonly modalBoxRef: React.RefObject<ModalBoxFrame>;
	private readonly layerRef: React.RefObject<HTMLDivElement>;
	private readonly editorRef: React.RefObject<AbstractModalEditor<any>>;
	private isMouseDownOnLayer: boolean;
	private isChanged: boolean;
	private mouseXPressed: number;
	private mouseYPressed: number;
	private dx: number;
	private dy: number;

	constructor (props: ModalBoxLayerProps) {
		super(props);

		this.state = {
			dx: 0,
			dy: 0,
			value: props.value,
			isFullScreen: false
		};

		this.modalBoxRef = React.createRef();
		this.layerRef = React.createRef();
		this.editorRef = React.createRef();

		this.isChanged = false;
		this.isMouseDownOnLayer = false;

		this.documentMouseMoveListener = this.documentMouseMoveListener.bind(this);
		this.documentMouseUpListener = this.documentMouseUpListener.bind(this);
		this.documentFocusListener = this.documentFocusListener.bind(this);
	}

	componentDidMount(): void {
		this.modalBoxRef.current.focus();
		this.editorRef.current.focus();
		this.setState({});
		document.addEventListener('focus', this.documentFocusListener, true);
	}

	componentWillUnmount(): void {
		document.removeEventListener('focus', this.documentFocusListener, true);
	}

	// проверка, что событие произошло СТРОГО на обертке (не было всплытия/погружения)
	private isMouseEventStrictOnModal(e: React.MouseEvent): boolean {
		if (!e || !e.target || !e.currentTarget || !this.layerRef.current) return;

		return e.target == e.currentTarget && e.target == this.layerRef.current;
	}

	// Промис для задавания пользователю вопроса о подтверждении операции
	private ask(title: string, question: React.ReactNode): Promise<void> {
		return new Promise<void>(((resolve, reject) => {
			modalBox.show(title, ConfirmDialog, question)
				.then(() => resolve())
				.catch(() => reject());
		}));
	}

	private showAskDialog(): void {
		const query = <span>{"Внесены изменения, вы уверены, что хотите закрыть окно?"}</span>;
		this.ask("Подтвердите действие", query)
			.then(() => this.props.onReject && this.props.onReject(null))
			.catch((er: any) => {});
	}

	private handleCloseWithAskDialog() {
		if (this.isChanged) {
			this.showAskDialog();
		} else {
			this.props.onReject && this.props.onReject(null);
		}
	}

	private mouseUpHandler(e: React.MouseEvent<HTMLDivElement>) {
		if (!this.props.closeOnOutsideClick || !this.isMouseDownOnLayer) return;
		if (this.isMouseEventStrictOnModal(e)) {
			this.handleCloseWithAskDialog();
		}
		this.isMouseDownOnLayer = false;
	}

	private mouseDownHandler(e: React.MouseEvent) {
		if (this.isMouseEventStrictOnModal(e)) this.isMouseDownOnLayer = true;
	}

	private resolve(value: any) {
		this.props.onResolve && this.props.onResolve(value);
	}

	private reject(reason: any) {
		this.props.onReject && this.props.onReject(reason);
	}

	private onOKClick() {
		if (this.editorRef.current && this.editorRef.current.isValueValid(this.state.value)) {
			this.resolve(this.state.value);
		}
	}

	private onCancelClick() {
		if (this.props.showConfirmOnCancelClick) {
			this.handleCloseWithAskDialog();
			return;
		}
		this.reject(null);
	}

	private onFullScreenClick() {
		this.setState(((prevProps) => {
			return {
				isFullScreen: !prevProps.isFullScreen
			};
		}));
	}

	// Ловим необработанные нажатия клавиш. А именно ESC
	private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
		if (!event.altKey && !event.shiftKey && !event.metaKey) {
			if (event.keyCode == KeyCodes.ESC) {
				this.onCancelClick();
			}
			if (event.keyCode == KeyCodes.RETURN) {
				if (!this.props.hideButtonsPanel) {
					(!event.target || !event.target['tagName'] ||
						(event.target['tagName'].toUpperCase() != 'TEXTAREA')) && this.onOKClick();
				}
			}
		}
	}

	onMouseDownCapture(event: React.MouseEvent) {
		this.mouseXPressed = event.screenX;
		this.mouseYPressed = event.screenY;
		this.dx = this.state.dx;
		this.dy = this.state.dy;
		document.addEventListener('mouseup', this.documentMouseUpListener, true);
		document.addEventListener('mousemove', this.documentMouseMoveListener, true);
		event.preventDefault();
		event.stopPropagation();
	}

	documentMouseMoveListener(event: MouseEvent) {
		const layerWidth  = this.layerRef.current.getBoundingClientRect().width;
		const controlWidth = this.modalBoxRef.current.width;
		const layerHeight  = this.layerRef.current.getBoundingClientRect().height;
		const controlHeight = this.modalBoxRef.current.height;

		const dxMin = (controlWidth - layerWidth) / 2;
		const dxMax = (layerWidth - controlWidth) / 2;

		const dyMin = (controlHeight - layerHeight) / 2;
		const dyMax = (layerHeight - controlHeight) / 2;

		const dxNew = this.dx + event.screenX - this.mouseXPressed;
		const dyNew = this.dy + event.screenY - this.mouseYPressed;

		this.setState({
			dx: Math.min(dxMax, Math.max(dxMin, dxNew)),
			dy: Math.min(dyMax, Math.max(dyMin, dyNew))
		});
		event.preventDefault();
	}

	documentMouseUpListener(event: MouseEvent) {
		document.removeEventListener ('mouseup', this.documentMouseUpListener, true);
		document.removeEventListener ('mousemove', this.documentMouseMoveListener, true);
		event.preventDefault();
	}

	// обработчик изменения текущего фокуса
	documentFocusListener(event: FocusEvent) {
		// если мы верхний слой, значит нас это касается
		if (this.props.topMost) {
			// если фокус изменился на компонент, находящийся на нашем слое, то волноваться не о чем - сваливаем
			let element = (event.target || event.srcElement) as HTMLElement;
			while (element) {
				if (element == this.layerRef.current) return;
				element = element.parentNode as HTMLElement;
			}
			// возвращаем фокус
			this.modalBoxRef.current.focus();
		}
	}

	onValueChanged(value: any, apply: boolean) {
		if (!this.isChanged) this.isChanged = true;

		this.setState({value: value}, () => {
			if (apply) {
				this.resolve(this.state.value);
			}
		});
	}

	render(): JSX.Element {
		return (
			<div
				className={classNames(styles['modal'], this.props.topMost && styles['_topmost'])}
				onKeyDown={e => this.onKeyDown(e)}
				onMouseUp={e => this.mouseUpHandler(e)}
				onMouseDown={e => this.mouseDownHandler(e)}
				ref={this.layerRef}
			>
				<ModalBoxFrame
					caption={this.props.caption}
					onOKClick={() => this.onOKClick()}
					okBtnCaption={this.props.okBtnCaption}
					onCancelClick={() => this.onCancelClick()}
					onFullScreenClick={() => this.onFullScreenClick()}
					enabledOKButton={this.editorRef.current ? this.editorRef.current.isValueValid(this.state.value) : false}
					offsetX={this.state.dx}
					offsetY={this.state.dy}
					ref={this.modalBoxRef}
					onMouseDownCapture={e => this.onMouseDownCapture(e)}
					hideButtonsPanel={this.props.hideButtonsPanel}
					hideCaptionPanel={this.props.hideCaptionPanel}
					hasFullScreen={this.props.hasFullScreen}
					isFullScreen={this.state.isFullScreen}
				>
					{
						React.createElement(
							this.props.editorClass, {
								ref: this.editorRef,
								value: this.state.value,
								additionalData: this.props.additionalData,
								onChange: (v: any) => this.onValueChanged(v, false),
								onApply: (v: any) => this.onValueChanged(v, true),
								onOKClick: () => this.onOKClick(),
								onCancelClick: () => this.onCancelClick()
							}
						)
					}
				</ModalBoxFrame>
			</div>
		);
	}
}

export let modalBox: ModalLayerController = null;