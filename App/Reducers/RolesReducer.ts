import { handleActions } from "redux-actions";
import * as Actions from "Actions/RolesActions";
import * as Server from "Models/ServerInterfaces";

import { RolesState } from "Store/State/RolesState";

const initialState: RolesState = {
	itemsInRequest: false,
	items: []
};

export default handleActions<RolesState, Server.Role>({
	[Actions.getRolesItemsRequestAction.toString()]: (state, action) => {
		return {
			itemsInRequest: true
		};
	},

	[Actions.getRolesItemsSuccessAction.toString()]: (state, action) => {
		return {
			itemsInRequest: false,
			items: action.payload
		};
	},

	[Actions.getRolesItemsFailureAction.toString()]: (state, action) => {
		return {
			itemsInRequest: false
		};
	}
}, initialState);