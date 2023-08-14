import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "../types/workflowTypes";
import endpoints from "./endpointsEnum";


export default async (sessionId: string): Promise<string> => {
	const { data = null } = await AxiosDefault.post(endpoints.deleteSession, undefined, {
		params: { sessionId },
	})
	// define success, return success for snackbar/flag to filter local session list
	return data;
};
