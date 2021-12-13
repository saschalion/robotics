import * as React from "react";

import { BaseComponent } from "Components/BaseComponent";
const styles: any = require("./Header.module.sass");

interface IHeaderProps {
	title: string;
	buttonCaption: string;
}

export class Header extends BaseComponent<IHeaderProps, {}> {
	doRender(): React.ReactElement<{}> {
		const {title, buttonCaption} = this.props;

		return (
			<div className={styles['header']}>
				<div className={styles['header__inner']}>
					<div className={styles['header__title']}>
						{title}
					</div>
					<a className={styles['header__btn']}>
						<div className={styles['header__btn-caption']}>
							{buttonCaption}
						</div>
						<div className={styles['header__btn-icon']} />
					</a>
				</div>
			</div>
		);
	}
}