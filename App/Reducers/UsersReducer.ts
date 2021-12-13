import { handleActions } from "redux-actions";
import * as Actions from "Actions/UsersActions";
import * as Server from "Models/ServerInterfaces";

import { UsersState } from "Store/State/UsersState";

const initialState: UsersState = {
	itemsInRequest: false,
	location: '',
	items: []
};

export default handleActions<UsersState, Server.User>({
	[Actions.getChangeRouteAction.toString()]: (state, action) => {
		return {
			...state,
			location: window.location.href
		};
	},

	[Actions.getUsersItemsRequestAction.toString()]: (state, action) => {
		return {
			itemsInRequest: true
		};
	},

	[Actions.getUsersItemsSuccessAction.toString()]: (state, action) => {
		return {
			itemsInRequest: false,
			items: action.payload
		};
	},

	[Actions.getUsersItemsFailureAction.toString()]: (state, action) => {
		return {
			itemsInRequest: false
		};
	}
}, initialState);