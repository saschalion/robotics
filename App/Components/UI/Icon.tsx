import * as React from "react";

import { BaseComponent } from "Components/BaseComponent";

interface IIconProps
{
	icon: string;
	width?: number;
	height?: number;
	useClassName?: string;
}

export class Icon extends BaseComponent<IIconProps, {}>
{
	doRender(): React.ReactElement<{}>
	{
		const { useClassName = 'icon', icon, width, height } = this.props;

		return (
			<svg { ...this.props } preserveAspectRatio="none">
				<use className={ useClassName } xlinkHref={ icon } />
			</svg>
		);
	}
}