import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";


export default async (process: WorkflowProcess): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.post(endpoints.publishProcess, process)

	return data;
};
