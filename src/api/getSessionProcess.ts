import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";


export default async (sessionId: string): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.get(endpoints.getSessionProcess, {
		params: { sessionId },
		validateStatus(status) {
			return status < 500;
		},
	})

	return data;
};
