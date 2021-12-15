import { handleActions } from "redux-actions";
import * as Tools from "Utils/Tools";
import * as Actions from "Actions/UsersActions";
import * as Server from "Models/ServerInterfaces";

import { UsersState } from "Store/State/UsersState";

const initialState: UsersState = {
	itemsInRequest: false,
	location: '',
	items: [],
	sortedAsc: Tools.readLocalStorage("sortedAsc", "1") == "1"
};

export default handleActions<UsersState, Server.User[]>({
	[Actions.getChangeRouteAction.toString()]: (state, action) => {
		return {
			...state,
			location: window.location.href
		};
	},

	[Actions.getUsersItemsRequestAction.toString()]: (state, action) => {
		return {
			...state,
			itemsInRequest: true
		};
	},

	[Actions.getUsersItemsSuccessAction.toString()]: (state, action) => {
		return {
			...state,
			itemsInRequest: false,
			items: action.payload
		};
	},

	[Actions.getUsersItemsFailureAction.toString()]: (state, action) => {
		return {
			...state,
			itemsInRequest: false
		};
	},

	[Actions.deleteUserSuccessAction.toString()]: (state, action) => {
		return {
			...state
		};
	},

	[Actions.changeSortOrderAction.toString()]: (state, action) => {
		Tools.writeLocalStorage("sortedAsc", state.sortedAsc ? "0" : "1");
		return {
			...state,
			sortedAsc: !state.sortedAsc
		};
	}
}, initialState);