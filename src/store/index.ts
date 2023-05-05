// doing it this way for now to get around use of hook
import { defaultColors } from "data";
import { create } from "zustand";
// import { persist } from 'zustand/middleware';
import {
	OnConnect,
	OnNodesChange,
	Edge,
	applyNodeChanges,
	NodeChange,
	Connection,
	ReactFlowInstance,
} from "reactflow";
import { devtools } from "zustand/middleware";
import { WorkflowConnection, WorkflowProcess, WorkflowRole, WorkflowState } from "./types";

import mockFetchAll from "data/mockFetchAll";
import { nodeByState, roleColor, stateByNode, transformNewConnectionToTransition } from "utils";
import isEqual from "lodash.isequal";

// const initialRole = "Intake-Specialist";
const initialRole = "system";

export interface MainState {
	globalLoading: boolean;
	activeRole: string;
	allSelfConnectingEdges: { [roleName: string]: WorkflowConnection[] };
	_hasHydrated: boolean;
	processes: WorkflowProcess[];
	edges: Edge[];
	states: WorkflowState[];
	roles: WorkflowRole[];
	activeProcess: WorkflowProcess | null;
	reactFlowInstance: ReactFlowInstance | undefined;
}

export interface MainActions {
	fetchAll: (env?: string) => Promise<any>;
	setActiveRole: (role: string) => void;
	addProcess: (processName: string) => void;
	updateProcess: (payload: { processIndex: number; process: WorkflowProcess }) => void;
	deleteProcess: (processName: string) => void;
	setAllSelfConnectingEdges: (allSelfConnectingEdges: {
		[roleName: string]: WorkflowConnection[];
	}) => void;
	toggleRoleForProcess: (role: string, color?: string) => void;
	filteredStates: (existingStates: WorkflowState[]) => string[];
	addNewState: (name: string) => void;
	addNewRole: (role: string) => void;
	setHasHydrated: (state: boolean) => void;
	onNodesChange: OnNodesChange;
	onConnect: OnConnect;
	removeTransition: (payload: { source: string; target: string }) => void;
	removeState: (stateName: string) => void;
	setStatesForActiveProcess: (states: WorkflowState[]) => void;
	updateStateProperties: (payload: {
		stateName: string;
		properties: { x?: number; y?: number; h?: number; w?: number };
	}) => void;
	setActiveProcess: (processName: string) => void;
	setColorForActiveRole: (newColor: string) => void;
	setReactFlowInstance: (instance: ReactFlowInstance) => void;
}

const useMainStore = create<MainState & MainActions>()(
	// persist(
	devtools(
		(set, get) => ({
			activeProcess: null,
			fetchAll: async (env?: string) => {
				set({ globalLoading: true }, false, "globalLoading");
				const waitTime = Math.random() * (2500 - 500) + 500;
				await new Promise((r) => setTimeout(r, waitTime));

				const { processes = [], roles = [], states = [] }: any = mockFetchAll;
				set({ states, roles, processes, globalLoading: false }, false, "fetchAll");
				const activeProcessName = processes[0]?.ProcessName;
				get().setActiveProcess(activeProcessName);
			},
			globalLoading: false,
			_hasHydrated: false,
			setHasHydrated: (state) => set({ _hasHydrated: state }),
			edges: [],
			states: [],
			roles: [],
			onNodesChange: (changes: NodeChange[]) => {
				const { activeProcess, activeRole } = get();
				if (activeProcess) {
					const activeRoleIndex = (activeProcess?.Roles || []).findIndex(
						({ RoleName }) => RoleName === activeRole
					);
					const { Properties = {} } = activeProcess.Roles?.[activeRoleIndex] || {};

					const nodeColor = Properties?.color || defaultColors?.[activeRoleIndex];

					const { States: allStates = [] } = activeProcess || {};

					const nodes = allStates.map((s, i, arr) =>
						nodeByState({
							state: s,
							index: i,
							allNodesLength: arr.length,
							color: nodeColor,
						})
					);

					const updatedNodes = applyNodeChanges(changes, nodes);

					set(
						{
							activeProcess: {
								...activeProcess,
								States: updatedNodes.map((node) =>
									stateByNode({
										node: { ...node, data: { ...node.data, color: nodeColor } },
										allStates,
									})
								),
							},
						},
						false,
						"onNodesChange"
					);
				}
			},
			updateStateProperties: ({
				stateName,
				properties,
			}: {
				stateName: string;
				properties: { x?: number; y?: number; h?: number; w?: number };
			}) => {
				const { activeProcess, setStatesForActiveProcess } = get();

				const { States = [] } = activeProcess || {};

				const foundStateIndex = States.findIndex(({ StateName }) => StateName === stateName);

				if (foundStateIndex !== -1) {
					setStatesForActiveProcess(
						States.map((s, i) =>
							i !== foundStateIndex
								? s
								: {
										...States[foundStateIndex],
										Properties: { ...States[foundStateIndex].Properties, ...properties },
								  }
						)
					);
				}
			},
			setStatesForActiveProcess: (states: WorkflowState[]) => {
				const { activeProcess } = get();

				if (activeProcess) {
					set(
						{
							activeProcess: { ...activeProcess, States: states },
						},
						false,
						"setStatesForActiveProcess"
					);
				}
			},
			onConnect: (connection: Connection) => {
				const { activeRole, activeProcess } = get();

				const { Roles = [] } = activeProcess || {};

				const foundRoleIndex = Roles.findIndex(({ RoleName }) => RoleName === activeRole);

				if (foundRoleIndex !== -1 && activeProcess) {
					const { Transitions = [] } = Roles[foundRoleIndex];

					const newTransition = transformNewConnectionToTransition(connection, Transitions);

					const updatedTransitions = [...Transitions, ...(newTransition ? [newTransition] : [])];

					const updatedRoles = Roles.map((r, i) =>
						i === foundRoleIndex ? { ...r, Transitions: updatedTransitions } : r
					);

					set(
						{
							activeProcess: { ...activeProcess, Roles: updatedRoles },
						},
						false,
						"onConnect"
					);
				}
			},
			removeTransition: ({ source, target }: { source: string; target: string }) => {
				const { activeRole, activeProcess } = get();

				const { Roles = [] } = activeProcess || {};

				const foundRoleIndex = Roles.findIndex(({ RoleName }) => RoleName === activeRole);

				if (foundRoleIndex !== -1 && activeProcess) {
					const { Transitions = [] } = Roles[foundRoleIndex];

					const updatedTransitions = Transitions.filter(
						({ FromStateName, ToStateName }) => FromStateName !== source || ToStateName !== target
					);

					const updatedRoles = Roles.map((r, i) =>
						i === foundRoleIndex ? { ...r, Transitions: updatedTransitions } : r
					);

					set(
						{
							activeProcess: { ...activeProcess, Roles: updatedRoles },
						},
						false,
						"removeTransition"
					);
				}
			},
			removeState: (stateName: string) => {
				const { activeProcess } = get();

				const { Roles = [] } = activeProcess || {};

				if (activeProcess) {
					const transitionsFilter = (transitions: WorkflowConnection[]) => {
						return transitions.filter(
							({ FromStateName, ToStateName }) =>
								FromStateName !== stateName && ToStateName !== stateName
						);
					};

					const updatedRoles = Roles.map((r) => ({
						...r,
						Transitions: transitionsFilter(r?.Transitions || []),
					}));

					const updatedStates = activeProcess.States?.filter((s) => s.StateName !== stateName);

					set(
						{
							activeProcess: { ...activeProcess, Roles: updatedRoles, States: updatedStates },
						},
						false,
						"removeState"
					);
				}
			},
			setActiveProcess: (processName: string) =>
				set(
					({ processes, activeProcess }) => {
						const processToSet = processes.find((p) => p.ProcessName === processName);

						const previousProcessIndex = processes.findIndex(
							(p) => p.ProcessName === activeProcess?.ProcessName
						);

						if (
							activeProcess &&
							previousProcessIndex !== -1 &&
							!isEqual(processes[previousProcessIndex], activeProcess)
						) {
							const updatedProcesses = processes.map((p, i) =>
								i !== previousProcessIndex ? { ...p } : { ...activeProcess }
							);

							return { activeProcess: processToSet, processes: updatedProcesses };
						}

						return { activeProcess: processToSet };
					},
					false,
					"setActiveProcess"
				),
			activeRole: initialRole,
			setActiveRole: (role) => set(() => ({ activeRole: role }), false, "setActiveRole"),
			allSelfConnectingEdges: {},
			setAllSelfConnectingEdges: (allSelfConnectingEdges) =>
				set(() => ({ allSelfConnectingEdges }), false, "setAllSelfConnectingEdges"),
			processes: [],
			updateProcess: ({
				processIndex,
				process,
			}: {
				processIndex: number;
				process: WorkflowProcess;
			}) =>
				set(
					({ processes }) => {
						const updatedProcesses = processes.map((p, i) => (i === processIndex ? process : p));

						return { processes: updatedProcesses };
					},
					false,
					"updateProcess"
				),
			addProcess: (name: string) =>
				set(
					({ processes }) => {
						const newProcess = {
							ProcessName: name,
							Roles: [],
							States: [],
						};

						return { processes: processes.concat(newProcess) };
					},
					false,
					"addProcess"
				),
			// fix
			deleteProcess: (processName) =>
				set(
					({ processes }) => ({
						processes: processes.filter((p) => p.ProcessName !== processName),
					}),
					false,
					"deleteProcess"
				),
			toggleRoleForProcess: (role, color) => {
				const { activeProcess } = get();

				if (activeProcess) {
					const { Roles = [] } = activeProcess;

					let updatedRoles = Roles;

					if (Roles.some(({ RoleName }) => RoleName === role)) {
						updatedRoles = Roles.filter(({ RoleName }) => RoleName !== role);
					} else {
						const newRole = {
							RoleName: role,
							Properties: {
								color: color || roleColor({ roleName: role, allRoles: Roles, index: Roles.length }),
							},
							Transitions: [],
						};

						updatedRoles = Roles.concat(newRole);
					}

					set(
						{
							activeProcess: { ...activeProcess, Roles: updatedRoles },
						},
						false,
						"toggleRoleForProcess"
					);
				}
			},
			setColorForActiveRole: (color: string) => {
				const { activeProcess, activeRole } = get();

				if (activeProcess) {
					const { Roles = [] } = activeProcess;

					const activeRoleIndex = Roles.findIndex(({ RoleName }) => RoleName === activeRole);

					if (activeRoleIndex !== -1) {
						const foundRole = Roles[activeRoleIndex];
						const updatedRoles = Roles.map((r, i) =>
							i !== activeRoleIndex
								? r
								: { ...foundRole, Properties: { ...foundRole.Properties, color } }
						);

						set(
							{
								activeProcess: { ...activeProcess, Roles: updatedRoles },
							},
							false,
							"setColorForActiveRole"
						);
					}
				}
			},
			filteredStates: (existingStates) => {
				const { states } = get();

				return states
					.map((el) => el.StateName)
					.filter((stateName: string) => !existingStates.some((s) => s.StateName === stateName));
			},
			addNewState: (name) =>
				set(
					({ states }) => {
						const newState = {
							StateName: name,
							DisplayOrder: Math.max(...states.map(({ DisplayOrder }) => DisplayOrder || 0)) + 10,
						};

						return { states: states.concat(newState) };
					},
					false,
					"addNewState"
				),
			addNewRole: (role: string) =>
				set(
					({ roles }) => {
						const newRole = {
							RoleName: role,
						};

						return { roles: roles.concat(newRole) };
					},
					false,
					"addNewRole"
				),
			reactFlowInstance: undefined,
			setReactFlowInstance: (instance: ReactFlowInstance) => set({ reactFlowInstance: instance }),
		}),
		{
			name: "Main-Store",
			serialize: {
				options: {
					map: true,
					date: true,
					set: true,
					symbol: true,
					error: true,
				},
			},
		}
	)
);

export default useMainStore;
