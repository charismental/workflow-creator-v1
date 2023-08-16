import { AxiosDefault, endpoints } from "api";
import { WorkflowProcess } from "types";

const getSessionProcess = async (sessionId: string): Promise<WorkflowProcess> => {
	const { data = null } = await AxiosDefault.get(endpoints.getSessionProcess, {
		params: { sessionId },
		validateStatus(status) {
			return status < 500;
		},
	})

	return data;
};

export { getSessionProcess }