import { createAction } from "redux-actions";
import * as Server from "Models/ServerInterfaces";

export const GET_USERS_ITEMS_REQUEST_ACTION = 'GET_USERS_ITEMS_REQUEST_ACTION';
export const GET_USERS_ITEMS_SUCCESS_ACTION = 'GET_USERS_ITEMS_SUCCESS_ACTION';
export const GET_USERS_ITEMS_FAILURE_ACTION = 'GET_USERS_ITEMS_FAILURE_ACTION';

export const getUsersItemsRequestAction = createAction(GET_USERS_ITEMS_REQUEST_ACTION);
export const getUsersItemsSuccessAction = createAction<Server.User[]>(GET_USERS_ITEMS_SUCCESS_ACTION);
export const getUsersItemsFailureAction = createAction<{ error: string }>(GET_USERS_ITEMS_FAILURE_ACTION);

export const DELETE_USER_REQUEST_ACTION = 'DELETE_USER_REQUEST_ACTION';
export const DELETE_USER_SUCCESS_ACTION = 'DELETE_USER_SUCCESS_ACTION';
export const DELETE_USER_FAILURE_ACTION = 'DELETE_USER_FAILURE_ACTION';

export const deleteUserRequestAction = createAction(DELETE_USER_REQUEST_ACTION);
export const deleteUserSuccessAction = createAction<Server.Success>(DELETE_USER_SUCCESS_ACTION);
export const deleteUserFailureAction = createAction<{ error: string }>(DELETE_USER_FAILURE_ACTION);

export const ADD_USER_REQUEST_ACTION = 'ADD_USER_REQUEST_ACTION';
export const ADD_USER_SUCCESS_ACTION = 'ADD_USER_SUCCESS_ACTION';
export const ADD_USER_FAILURE_ACTION = 'ADD_USER_FAILURE_ACTION';

export const addUserRequestAction = createAction(ADD_USER_REQUEST_ACTION);
export const addUserSuccessAction = createAction<Server.Success>(ADD_USER_SUCCESS_ACTION);
export const addUserFailureAction = createAction<{ error: string }>(ADD_USER_FAILURE_ACTION);

export const CHANGED_ROUTE_ACTION = 'CHANGED_ROUTE_ACTION';
export const getChangeRouteAction = createAction(CHANGED_ROUTE_ACTION);

export const CHANGE_SORT_ORDER_ACTION = 'CHANGE_SORT_ORDER_ACTION';
export const changeSortOrderAction = createAction(CHANGE_SORT_ORDER_ACTION);