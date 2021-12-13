import * as React from "react";
import classNames from "classnames";
import * as Tools from "Utils/Tools";

import { BaseComponent } from "Components/BaseComponent";

const styles: any = require("./Loading.module.sass");

export class Loading extends BaseComponent<{}, {}>
{
	doRender(): React.ReactElement<{}>
	{
		return (
			<div className={ classNames(styles['loading'], Tools.isMobileDevice() && styles['_mobile']) }>
				<span className={ styles['loading__inner'] }>
					<span className={ classNames(styles['loading__loader'], styles['_size_big']) } />
					<span className={ classNames(styles['loading__loader'], styles['_size_small']) } />
				</span>
			</div>
		);
	}
}