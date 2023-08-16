import { AxiosDefault, endpoints } from "./";


const deleteSession = async (sessionId: string): Promise<string> => {
	const { data = null } = await AxiosDefault.post(endpoints.deleteSession, undefined, {
		params: { sessionId },
	})
	// define success, return success for snackbar/flag to filter local session list
	return data;
};

export { deleteSession }