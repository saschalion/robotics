import { Dispatch } from "redux";
import * as Actions from "Actions/UsersActions";

import * as api from "Api/Users/Index";
import * as Tools from "Utils/Tools";
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
				return dispatch(Actions.deleteUserFailureAction(error));
			});
	};
}

export function addUser(data: Server.AddUser): (dispatcher: Dispatch<{}>) => Promise<{}> {
	return (dispatch: Dispatch<{}>) => {
		dispatch(Actions.addUserRequestAction());
		const currentFullDate = Tools.getCurrentFullDate();
		data.lastUpdate = currentFullDate;
		data.registerDate = currentFullDate;
		data.birthday = Tools.formatBirthday(data.birthday);

		return api.addUser(data)
			.then((result) => {
				return JSON.parse(result.text);
			})
			.then((response: Server.Success) => {
				return dispatch(Actions.addUserSuccessAction(response));
			})
			.catch((error) => {
				return dispatch(Actions.addUserFailureAction(error));
			});
	};
}

export function changeSortOrder(): (dispatcher: Dispatch<{}>) => Promise<{}> {
	return (dispatch: Dispatch<{}>) => {
		return Promise.resolve(dispatch(Actions.changeSortOrderAction()));
	};
}