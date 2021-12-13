import { createAction } from "redux-actions";
import * as Server from "Models/ServerInterfaces";

export const GET_USERS_ITEMS_REQUEST_ACTION = 'GET_USERS_ITEMS_REQUEST_ACTION';
export const GET_USERS_ITEMS_SUCCESS_ACTION = 'GET_USERS_ITEMS_SUCCESS_ACTION';
export const GET_USERS_ITEMS_FAILURE_ACTION = 'GET_USERS_ITEMS_FAILURE_ACTION';

export const getUsersItemsRequestAction = createAction(GET_USERS_ITEMS_REQUEST_ACTION);
export const getUsersItemsSuccessAction = createAction<Server.User[]>(GET_USERS_ITEMS_SUCCESS_ACTION);
export const getUsersItemsFailureAction = createAction<{ error: string }>(GET_USERS_ITEMS_FAILURE_ACTION);

export const CHANGED_ROUTE_ACTION = 'CHANGED_ROUTE_ACTION';
export const getChangeRouteAction = createAction(CHANGED_ROUTE_ACTION);

export const CHANGE_SORT_ORDER_ACTION = 'CHANGE_SORT_ORDER_ACTION';
export const changeSortOrderAction = createAction(CHANGE_SORT_ORDER_ACTION);