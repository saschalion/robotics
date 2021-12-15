import {request, API, headers} from "Api/Config";

export const getItems = () => {
	return request.get(`${ API }/roles/`).send().use(headers).end();
};