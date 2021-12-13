import * as React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import * as Tools from "Utils/Tools";

import { BaseComponent } from "Components/BaseComponent";
import { Dispatch } from "redux";

require("Global/Styles/global.sass");

interface ICustomPageProps {}

// @connect(mapStateToProps, mapDispatchToProps)
export abstract class CustomPage<P, S> extends BaseComponent<P, S> {
	abstract renderContent(): React.ReactElement<{}>;

	doRender(): React.ReactElement<{}> {
		return (
			<div className={classNames("page__inner", Tools.isMobileDevice() && '_mobile')}>
				<div className="page__wrap">
					<div className="page__content">
						{ this.renderContent() }
					</div>

					<footer />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props): ICustomPageProps {
	return {}
}

function mapDispatchToProps(dispatch: Dispatch<{}>): ICustomPageProps {
	return {
		...dispatch
	};
}