import { request, API, headers } from "Api/Config";

export const getItems = () => {
	return request.get(`${ API }/users/`).send().use(headers).end();
};