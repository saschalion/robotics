import { combineReducers, Reducer } from "redux";
import { StoreState } from "Store/StoreState";

import usersReducer from "./UsersReducer";
import rolesReducer from "./RolesReducer";

const rootReducer: Reducer<StoreState> = combineReducers<StoreState>({
	users: usersReducer,
	roles: rolesReducer
});

export default rootReducer;