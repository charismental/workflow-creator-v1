import { WorkflowSession } from "types";
import getSessionProcess from "api/getSessionProcess";
import getAllSessions from "api/getAllSessions";
import { useMainState } from "./useMainState";
import { setActiveProcess } from "./processActions";
const { setState } = useMainState;

// had to rename this because of the endpoint call
export const getAllSessionsFromApi = async (env?: string) => {
	setState({ globalLoading: true });
	// const waitTime = Math.random() * (2500 - 500) + 500;
	// await new Promise((r) => setTimeout(r, waitTime));
	// const { processes = [], roles = [], states = [] }: any = mockGetAllSessions;
	const sessions: WorkflowSession[] = await getAllSessions();
	setState({ sessions, globalLoading: false });
	const { sessionId = "" } = sessions?.[0] || {};
	if (sessionId) {
		const sessionProcess = await getSessionProcess(sessionId);

		if (sessionProcess) setActiveProcess(sessionProcess);
	}
};
