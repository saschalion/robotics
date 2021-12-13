import {UsersState} from "Store/State/UsersState";
import {RolesState} from "Store/State/RolesState";

export interface StoreState {
	readonly users: UsersState;
	readonly roles: RolesState;
}