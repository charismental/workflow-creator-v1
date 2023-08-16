import { AxiosDefault, endpoints } from "api";
import { WorkflowProcess } from "types";


const saveProcess = async (process: WorkflowProcess): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.saveProcess, process)

	return data;
};

export { saveProcess }