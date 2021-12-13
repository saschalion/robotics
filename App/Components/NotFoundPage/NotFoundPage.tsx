import * as React from "react";

import { BaseComponent } from "Components/BaseComponent";
import { Link } from "react-router-dom";

const styles: any = require("./NotFoundPage.module.sass");

export class NotFoundPage extends BaseComponent<{}, {}>
{
	doRender(): React.ReactElement<{}>
	{
		return (
			<div className={ styles['not-found'] }>
				<h1 className={ styles['not-found__title'] }>
					404
				</h1>

				<div className={ styles['not-found__text'] }>
					Страница, которую вы ищете
					<br />
					не найдена
				</div>

				<div className={ styles['not-found__link-inner'] }>
					<Link to="/" className={ styles['not-found__link'] }>
						Вернуться на главную
					</Link>
				</div>
			</div>
		);
	}
}