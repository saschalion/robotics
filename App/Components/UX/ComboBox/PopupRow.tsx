import * as React from 'react';

const css = require("./Styles.module.sass");
import cn from 'classnames';

export enum IconPosition {
	first,
	last
}

interface PopupRowProps {
	caption?: React.ReactNode;
	icon?: React.ReactNode;
	iconPosition?: IconPosition;
	multipleSelect?: boolean;
	extraClass?: string;
	captionClass?: string;
	onClick?(e: React.MouseEvent): void;
	onKeyDown?(e: React.KeyboardEvent): void;
	rootRef?: React.RefObject<HTMLDivElement>;
	focused?: boolean;
	disabledReason?: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
	title?: string;
	children?: React.ReactNode;
}

export function PopupRow(props: PopupRowProps) {
	return (
		<div
			ref={props.rootRef}
			title={props.title}
			className={cn(
				css.row,
				!!props.icon && css._hasIcon,
				props.focused && css._focused,
				props.disabledReason && css.row_disabled,
				props.className,
				props.multipleSelect && css._multiple,
				props.extraClass || null
			)}
			style={props.style}
			onClick={props.disabledReason ? undefined : props.onClick}
			onKeyDown={props.disabledReason ? undefined : props.onKeyDown}
		>
			{ (props.iconPosition || IconPosition.first) == IconPosition.first && props.icon }
			<div
				className={cn(css.row__caption, props.captionClass)}
				children={props.caption}
			/>
			{props.children}
			{ props.iconPosition == IconPosition.last && props.icon }
		</div>
	);
}
