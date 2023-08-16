import { AxiosDefault, endpoints } from "api";
import { WorkflowProcess } from "types";


const cloneProcess = async ({ processName, newProcessName }: { processName: string; newProcessName: string }): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.cloneProcess, {
		processName,
		newProcessName,
	})

	return data;
};

export { cloneProcess }