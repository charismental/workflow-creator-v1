import { AxiosDefault, endpoints } from "api";
import { WorkflowProcess } from "types";


const publishProcess = async (process: WorkflowProcess): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.publishProcess, process)
	// remove this later
	if (Array.isArray(data) && data.length) return data[0];
	return data;
};

export { publishProcess }