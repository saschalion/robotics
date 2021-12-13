import { createAction } from "redux-actions";
import * as Server from "Models/ServerInterfaces";

export const GET_ROLES_ITEMS_REQUEST_ACTION = 'GET_ROLES_ITEMS_REQUEST_ACTION';
export const GET_ROLES_ITEMS_SUCCESS_ACTION = 'GET_ROLES_ITEMS_SUCCESS_ACTION';
export const GET_ROLES_ITEMS_FAILURE_ACTION = 'GET_ROLES_ITEMS_FAILURE_ACTION';

export const getRolesItemsRequestAction = createAction(GET_ROLES_ITEMS_REQUEST_ACTION);
export const getRolesItemsSuccessAction = createAction<Server.Role[]>(GET_ROLES_ITEMS_SUCCESS_ACTION);
export const getRolesItemsFailureAction = createAction<{ error: string }>(GET_ROLES_ITEMS_FAILURE_ACTION);