import { AxiosDefault, endpoints } from "api";
import { WorkflowSession } from "types";

const getAllSessions = async (env?: string): Promise<WorkflowSession[]> => {
	const { data = [] } = await AxiosDefault.get(endpoints.getAllSessions, {
		validateStatus(status) {
			return status < 500;
		},
	})

	return data;
};

export { getAllSessions }