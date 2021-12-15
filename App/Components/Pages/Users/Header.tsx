import * as React from "react";

import {BaseComponent} from "Components/BaseComponent";
import {UXButton} from 'Components/UX/Button/Button';

const styles: any = require("./Header.module.sass");

interface IHeaderProps {
	title: string;
	buttonCaption: string;
	onButtonClick(): void;
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
					<UXButton
						caption={buttonCaption}
						onClick={() => this.props.onButtonClick()}
						size={"middle"}
						icon={"plus"}
					/>
				</div>
			</div>
		);
	}
}