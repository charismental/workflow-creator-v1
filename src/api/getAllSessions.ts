import AxiosDefault from "./AxiosDefault";
import { WorkflowSession } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";

// function lowercaseProperties(el: any): any {
//     // if it's not an object or array, return as is
//     if (el === null || typeof el !== 'object') return el;

//     const isArray = Array.isArray(el);
//     const newObj: any = isArray ? [] : {};

//     for (const key in el) {
//         const value = el[key];
//         // For arrays, use the existing key (index), but still recursively lowercase properties
//         // For objects, generate a new key with the first character lowercased
//         const newKey = isArray ? key : key.charAt(0).toLowerCase() + key.slice(1);
//         newObj[newKey] = lowercaseProperties(value);
//     }

//     return newObj;
// }

export default async (env?: string): Promise<WorkflowSession[]> => {
	const { data = [] } = await AxiosDefault.get(endpoints.getAllSessions, {
		validateStatus(status) {
			return status < 500;
		},
	})

	return data;
};
