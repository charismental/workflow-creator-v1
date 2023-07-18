import { WorkflowProcess, WorkflowRole } from "types";
import { useMainState } from "./useMainState";
import createProcess from "api/createProcess";

const { setState } = useMainState;

export const setActiveProcess = (process: WorkflowProcess) =>
	setState(() => {
		const { globals } = process;
		const { states, roles, companies } = globals;
		const sortRoles = (roles: WorkflowRole[]) =>
			[...roles].sort((a, b) => a.roleName.localeCompare(b.roleName));
		const { roles: activeProcessRoles = [] } = process;
		const activeRole =
			sortRoles(activeProcessRoles)?.[0]?.roleName || sortRoles(roles)?.[0]?.roleName || "";
		// const processToSet = processes.find((p) => p.processName === processName);

		// const previousProcessIndex = processes.findIndex(
		// 	(p) => p.processName === activeProcess?.processName
		// );

		// if (
		// 	activeProcess &&
		// 	previousProcessIndex !== -1 &&
		// 	!isEqual(processes[previousProcessIndex], activeProcess)
		// ) {
		// 	const updatedProcesses = processes.map((p, i) =>
		// 		i !== previousProcessIndex ? { ...p } : { ...activeProcess }
		// 	);

		// 	return { activeProcess: processToSet, processes: updatedProcesses };
		// }

		return { activeProcess: process, states, roles: sortRoles(roles), companies, activeRole };
	});

export const updateProcess = ({
	processIndex,
	process,
}: {
	processIndex: number;
	process: WorkflowProcess;
}) =>
	setState(({ processes }) => {
		const updatedProcesses = processes.map((p, i) => (i === processIndex ? process : p));

		return { processes: updatedProcesses };
	});

export const addProcess = async (name: string) => {
	const newProcess = await createProcess(name);
	setState(({ processes, sessions }) => {
		const { globals, roles, states, companies, ...session } = newProcess;
		setActiveProcess(newProcess);
		return { processes: [...processes, newProcess], sessions: [...sessions, session] };
	});
};
// fix
export const deleteProcess = (processName: string) =>
	setState(({ processes }) => ({
		processes: processes.filter((p) => p.processName !== processName),
	}));
