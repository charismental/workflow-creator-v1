import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";


export default async (processName: string): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.createProcess, {
		processName,
	})

	return data;
};
