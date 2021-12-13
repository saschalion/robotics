import * as Server from "Models/ServerInterfaces";

export interface UsersState {
	readonly location: string;
	readonly items: Server.User[];
	readonly itemsInRequest?: boolean;
	readonly sortedAsc?: boolean;
}