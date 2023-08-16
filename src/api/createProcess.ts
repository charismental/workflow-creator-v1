import { AxiosDefault, endpoints } from "api";
import { WorkflowProcess } from "types";


const createProcess = async (processName: string): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.createProcess, {
		processName,
	})

	return data;
};

export { createProcess }