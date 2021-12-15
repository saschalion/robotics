import * as React from "react";
import { Store } from "redux";
import { StoreState } from "Store/StoreState";

import { BaseComponent } from "Components/BaseComponent";
import { CHANGED_ROUTE_ACTION } from "Actions/UsersActions";
import {ModalLayerController} from "Components/UX/ModalBox/ModalBox";

interface IMainProps extends React.ClassAttributes<Main> {
	store: Store<StoreState>;
}

interface IMainState {
	location: string;
}

export class Main extends BaseComponent<IMainProps, IMainState> {
	constructor(props) {
		super(props);

		this.state = {
			location: window.location.href
		};
	}

	componentWillReceiveProps(nextProps: IMainProps) {
		if (window.location.href != this.state.location) {
			this.setState({
				location: window.location.href
			});

			this.props.store.dispatch({
				type: CHANGED_ROUTE_ACTION
			});
		}
	}

	doRender(): React.ReactElement<{}> {
		return (
			<main>
				{this.props.children}
				<ModalLayerController/>
			</main>
		);
	}
}