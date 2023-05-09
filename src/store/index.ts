// doing it this way for now to get around use of hook
import { defaultColors } from "data";
import { create } from "zustand";
// import { persist } from 'zustand/middleware';
import {
	Connection,
	Edge,
	NodeChange,
	OnConnect,
	OnNodesChange,
	ReactFlowInstance,
	applyNodeChanges,
} from "reactflow";
import { devtools } from "zustand/middleware";
import { WorkflowConnection, WorkflowProcess, WorkflowRole, WorkflowState } from "./types";

import mockFetchAll from "data/mockFetchAll";
import isEqual from "lodash.isequal";
import { nodeByState, roleColor, stateByNode, transformNewConnectionToTransition } from "utils";

// const initialRole = "Intake-Specialist";
const initialRole = "system";

export interface MainState {
	globalLoading: boolean;
	activeRole: string;
	_hasHydrated: boolean;
	processes: WorkflowProcess[];
	edges: Edge[];
	states: WorkflowState[];
	roles: WorkflowRole[];
	activeProcess: WorkflowProcess | null;
	reactFlowInstance: ReactFlowInstance | undefined;
	showMinimap: boolean;
	showAllRoles: boolean;
	showAllConnectedStates: boolean;
}

export interface MainActions {
	fetchAll: (env?: string) => Promise<any>;
	setActiveRole: (role: string) => void;
	addProcess: (processName: string) => void;
	updateProcess: (payload: { processIndex: number; process: WorkflowProcess }) => void;
	deleteProcess: (processName: string) => void;
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
	setShowMinimap: () => void;
	toggleShowAllRoles: () => void;
	setShowAllConnectedStates: () => void;
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
				const activeProcessName = processes[0]?.processName;
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
					const activeRoleIndex = (activeProcess?.roles || []).findIndex(
						({ roleName }) => roleName === activeRole
					);
					const { properties = {} } = activeProcess.roles?.[activeRoleIndex] || {};

					const nodeColor = properties?.color || defaultColors?.[activeRoleIndex];

					const { states: allStates = [] } = activeProcess || {};

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
								states: updatedNodes.map((node) =>
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

				const { states = [] } = activeProcess || {};

				const foundStateIndex = states.findIndex((state) => state.stateName === stateName);

				if (foundStateIndex !== -1) {
					setStatesForActiveProcess(
						states.map((s, i) =>
							i !== foundStateIndex
								? s
								: {
										...states[foundStateIndex],
										properties: { ...states[foundStateIndex].properties, ...properties },
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
							activeProcess: { ...activeProcess, states: states },
						},
						false,
						"setStatesForActiveProcess"
					);
				}
			},
			onConnect: (connection: Connection) => {
				const { activeRole, activeProcess } = get();

				const { roles = [] } = activeProcess || {};

				const foundRoleIndex = roles.findIndex(({ roleName }) => roleName === activeRole);

				if (foundRoleIndex !== -1 && activeProcess) {
					const { transitions = [] } = roles[foundRoleIndex];

					const newTransition = transformNewConnectionToTransition(connection, transitions);

					const updatedTransitions = [...transitions, ...(newTransition ? [newTransition] : [])];

					const updatedRoles = roles.map((r, i) =>
						i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r
					);

					set(
						{
							activeProcess: { ...activeProcess, roles: updatedRoles },
						},
						false,
						"onConnect"
					);
				}
			},
			showAllRoles: false,
			toggleShowAllRoles: () => set(({ showAllRoles }) => ({ showAllRoles: !showAllRoles, showAllConnectedStates: false })),
			showAllConnectedStates: false,
			setShowAllConnectedStates: () => set(({ showAllConnectedStates }) => ({ showAllConnectedStates: !showAllConnectedStates, showAllRoles: false })),
			removeTransition: ({ source, target }: { source: string; target: string }) => {
				const { activeRole, activeProcess } = get();

				const { roles = [] } = activeProcess || {};

				const foundRoleIndex = roles.findIndex(({ roleName }) => roleName === activeRole);

				if (foundRoleIndex !== -1 && activeProcess) {
					const { transitions = [] } = roles[foundRoleIndex];

					const updatedTransitions = transitions.filter(
						({ fromStateName, toStateName }) => fromStateName !== source || toStateName !== target
					);

					const updatedRoles = roles.map((r, i) =>
						i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r
					);

					set(
						{
							activeProcess: { ...activeProcess, roles: updatedRoles },
						},
						false,
						"removeTransition"
					);
				}
			},
			removeState: (stateName: string) => {
				const { activeProcess } = get();

				const { roles = [] } = activeProcess || {};

				if (activeProcess) {
					const transitionsFilter = (transitions: WorkflowConnection[]) => {
						return transitions.filter(
							({ fromStateName, toStateName }) =>
								fromStateName !== stateName && toStateName !== stateName
						);
					};

					const updatedRoles = roles.map((r) => ({
						...r,
						transitions: transitionsFilter(r?.transitions || []),
					}));

					const updatedStates = activeProcess.states?.filter((s) => s.stateName !== stateName);

					set(
						{
							activeProcess: { ...activeProcess, roles: updatedRoles, states: updatedStates },
						},
						false,
						"removeState"
					);
				}
			},
			setActiveProcess: (processName: string) =>
				set(
					({ processes, activeProcess }) => {
						const processToSet = processes.find((p) => p.processName === processName);

						const previousProcessIndex = processes.findIndex(
							(p) => p.processName === activeProcess?.processName
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
							processName: name,
							roles: [],
							states: [],
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
						processes: processes.filter((p) => p.processName !== processName),
					}),
					false,
					"deleteProcess"
				),
			toggleRoleForProcess: (role, color) => {
				const { activeProcess } = get();

				if (activeProcess) {
					const { roles = [] } = activeProcess;

					let updatedRoles = roles;

					if (roles.some(({ roleName }) => roleName === role)) {
						updatedRoles = roles.filter(({ roleName }) => roleName !== role);
					} else {
						const newRole = {
							roleName: role,
							properties: {
								color: color || roleColor({ roleName: role, allRoles: roles, index: roles.length }),
							},
							transitions: [],
						};

						updatedRoles = roles.concat(newRole);
					}

					set(
						{
							activeProcess: { ...activeProcess, roles: updatedRoles },
						},
						false,
						"toggleRoleForProcess"
					);
				}
			},
			setColorForActiveRole: (color: string) => {
				const { activeProcess, activeRole } = get();

				if (activeProcess) {
					const { roles = [] } = activeProcess;

					const activeRoleIndex = roles.findIndex(({ roleName }) => roleName === activeRole);

					if (activeRoleIndex !== -1) {
						const foundRole = roles[activeRoleIndex];
						const updatedRoles = roles.map((r, i) =>
							i !== activeRoleIndex
								? r
								: { ...foundRole, properties: { ...foundRole.properties, color } }
						);

						set(
							{
								activeProcess: { ...activeProcess, roles: updatedRoles },
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
					.map((el) => el.stateName)
					.filter((stateName: string) => !existingStates.some((s) => s.stateName === stateName));
			},
			addNewState: (name) =>
				set(
					({ states }) => {
						const newState = {
							stateName: name,
							displayOrder: Math.max(...states.map(({ displayOrder }) => displayOrder || 0)) + 10,
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
							roleName: role,
						};

						return { roles: roles.concat(newRole) };
					},
					false,
					"addNewRole"
				),
			reactFlowInstance: undefined,
			setReactFlowInstance: (instance: ReactFlowInstance) => set({ reactFlowInstance: instance }),
			showMinimap: false,
			setShowMinimap: () => {
				set({ showMinimap: !get().showMinimap });
			},
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
