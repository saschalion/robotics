import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { App } from "Components/Common/App/App";
import { NotFoundPage } from "Components/NotFoundPage/NotFoundPage";
import { Users } from "Components/Pages/Users/Users";
import { Main } from "Components/Common/Main/Main";

import { configureStore } from "Store/CreateStore";

const store = configureStore();

window['Store'] = store.getState();
store.subscribe(() => {
	window['Store'] = store.getState();
});

ReactDOM.render(
	<Provider store={ store }>
		<Router>
			<Main store={ store }>
				<App>
					<Switch>
						<Route exact path="/" component={ Users } />
						<Route path="*" component={ NotFoundPage } />
					</Switch>
				</App>
			</Main>
		</Router>
	</Provider>,
	document.getElementById("root"));