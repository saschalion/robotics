import { Dispatch } from "redux";
import * as Actions from "Actions/RolesActions";

import * as api from "Api/Roles/Index";
import * as Server from "Models/ServerInterfaces";

export function getRoles(): (dispatcher: Dispatch<{}>) => Promise<{}> {
	return (dispatch: Dispatch<{}>) => {
		dispatch(Actions.getRolesItemsRequestAction());

		return api.getItems()
			.then((result) => {
				return JSON.parse(result.text);
			})
			.then((response: Server.CustomResponse<Server.Role>) => {
				return dispatch(Actions.getRolesItemsSuccessAction(response.collection));
			})
			.catch((error) => {
				return error;
			});
	};
}