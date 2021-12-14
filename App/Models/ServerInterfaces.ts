export type ObjectId = string;

export interface CustomResponse<P> {
	total: number;
	collection: P[];
}

export interface User {
	id?: ObjectId;
	surname: string;
	name: string;
	middleName: string;
	role: Role;
	birthday: string;
	birthPlace: string;
	email: string;
	phoneNumber: string;
	registerDate: string;
	lastUpdate: string;
}

export interface Role {
	id: ObjectId;
	title: string;
}

export interface Success {
	status: number;
	message: string;
}