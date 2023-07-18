import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";


export default async ({ processName, newProcessName }: { processName: string; newProcessName: string }): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.cloneProcess, {
		processName,
		newProcessName,
	})

	return data;
};
