import * as Server from "Models/ServerInterfaces";

export interface RolesState {
	readonly items: Server.Role[];
	readonly itemsInRequest: boolean;
}