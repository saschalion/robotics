import { Dispatch } from "redux";
import * as Actions from "Actions/UsersActions";

import * as api from "Api/Users/Index";
import * as Server from "Models/ServerInterfaces";

export function getUsers(): (dispatcher: Dispatch<{}>) => Promise<{}> {
	return (dispatch: Dispatch<{}>) => {
		dispatch(Actions.getUsersItemsRequestAction());

		return api.getItems()
			.then((result) => {
				return JSON.parse(result.text);
			})
			.then((response: Server.CustomResponse<Server.User>) => {
				return dispatch(Actions.getUsersItemsSuccessAction(response.collection));
			})
			.catch((error) => {
				return error;
			});
	};
}

export function deleteUser(id: Server.ObjectId): (dispatcher: Dispatch<{}>) => Promise<{}> {
	return (dispatch: Dispatch<{}>) => {
		dispatch(Actions.deleteUserRequestAction());

		return api.deleteUser(id)
			.then((result) => {
				return JSON.parse(result.text);
			})
			.then((response: Server.Success) => {
				return dispatch(Actions.deleteUserSuccessAction(response));
			})
			.catch((error) => {
				return error;
			});
	};
}

export function changeSortOrder(): (dispatcher: Dispatch<{}>) => Promise<{}> {
	return (dispatch: Dispatch<{}>) => {
		return Promise.resolve(dispatch(Actions.changeSortOrderAction()));
	};
}