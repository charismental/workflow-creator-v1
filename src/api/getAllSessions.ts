import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";
// import axios from "axios";

function lowercaseProperties(el: any): any {
    // if it's not an object or array, return as is
    if (el === null || typeof el !== 'object') return el;

    const isArray = Array.isArray(el);
    const newObj: any = isArray ? [] : {};

    for (const key in el) {
        const value = el[key];
        // For arrays, use the existing key (index), but still recursively lowercase properties
        // For objects, generate a new key with the first character lowercased
        const newKey = isArray ? key : key.charAt(0).toLowerCase() + key.slice(1);
        newObj[newKey] = lowercaseProperties(value);
    }

    return newObj;
}

export default async (env?: string) => {
	// axios.get('https://workfloweditorfunctions20230417180706.azurewebsites.net/api/GetAllSessions')
	// .then((res) => {
	// 	console.log(lowercaseProperties(res.data));
	// 	if (res.data && res.data.length) {
	// 		const processInfo: WorkflowProcess[] = res.data;
	// 		return processInfo;
	// 	}
	// })
	AxiosDefault.get(endpoints.getAllSessions, {
		validateStatus(status) {
			return status < 500;
		},
	})
		.then((res) => {
			console.log(lowercaseProperties(res.data));
			if (res.data && res.data.length) {
				const processInfo: WorkflowProcess[] = res.data;
				return processInfo;
			}
		})
		.catch((error) => {
			console.log(error.toJSON());
		});
};
