import { useMainState } from "./useMainState";
const { setState, getState } = useMainState;

export const saveStateSnapshot = () => {
	const { activeProcess, activeRole, processes, states, roles, companies } = getState();
	const snapShot = { activeProcess, activeRole, processes, states, roles, companies };

	localStorage.setItem("state-snapshot", JSON.stringify(snapShot));
};

export const revertToSnapshot = () => {
	const foundSnapshot = localStorage.getItem("state-snapshot");
	if (foundSnapshot) {
		try {
			const snapshot = JSON.parse(foundSnapshot);

			const { activeProcess, activeRole, processes, states, roles, companies } = snapshot;

			setState({ activeProcess, activeRole, processes, states, roles, companies });
		} catch (err) {
			console.log("Something went wrong while parsing snapshot data");
		}
	}
};
