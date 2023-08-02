import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";


export default async (process: WorkflowProcess): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.publishProcess, process)
	// remove this later
	if (Array.isArray(data) && data.length) return data[0];
	return data;
};
