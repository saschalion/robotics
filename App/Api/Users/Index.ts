import { request, API, headers } from "Api/Config";
import * as Server from "Models/ServerInterfaces";

export const getItems = () => {
	return request.get(`${ API }/users/`).send().use(headers).end();
};

export const deleteUser = (id: Server.ObjectId) => {
	return request.del(`${ API }/users/${id}`).send().use(headers).end();
};

export const addUser = (data: Server.AddUser) => {
	return request.post(`${ API }/users`).send(data).use(headers).end();
};