import { handleActions } from "redux-actions";
import * as Actions from "Actions/RolesActions";
import * as Server from "Models/ServerInterfaces";

import { RolesState } from "Store/State/RolesState";

const initialState: RolesState = {
	itemsInRequest: false,
	items: [],
	rolesById: {}
};

export default handleActions<RolesState, Server.Role[]>({
	[Actions.getRolesItemsRequestAction.toString()]: (state, action) => {
		return {
			...state,
			itemsInRequest: true
		};
	},

	[Actions.getRolesItemsSuccessAction.toString()]: (state, action) => {
		const rolesById = {};
		action.payload.forEach(role => {
			rolesById[role.id] = role.title;
		});
		return {
			itemsInRequest: false,
			items: action.payload,
			rolesById: rolesById
		};
	},

	[Actions.getRolesItemsFailureAction.toString()]: (state, action) => {
		return {
			...state,
			itemsInRequest: false
		};
	}
}, initialState);