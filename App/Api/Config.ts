export const request = require("superagent-promise")(require("superagent"), Promise);

export const headers = function (req) {
	req.set('Accept', '*/*');
	req.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
};

let isLocal = window.location.href.indexOf('localhost') != -1;

export const API_DOMAIN = 'http://localhost:3000';
export const API = `${ API_DOMAIN }/api`;