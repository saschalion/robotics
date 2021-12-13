import * as React from "react";
import classNames from "classnames";
import { connect } from "react-redux";

import { BaseComponent } from "Components/BaseComponent";
import { Dispatch } from "redux";
import { StoreState } from "Store/StoreState";
import { UsersState } from "Store/State/UsersState";

const styles: any = require("./App.module.sass");

interface IAppProps extends React.ClassAttributes<App>
{
	users?: UsersState;
	children?: any;
}

interface IAppState {}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends BaseComponent<IAppProps, IAppState> {
	doRender(): React.ReactElement<{}> {
		return (
			<main>
				{ this.props.children }
			</main>
		);
	}
}

function mapStateToProps(state: StoreState, props): IAppProps {
	return {
		users: state.users,
		children: props.children
	}
}

function mapDispatchToProps(dispatch: Dispatch<{}>): IAppProps {
	return {};
}