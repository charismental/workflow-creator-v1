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
import getAllSessions from "api/getAllSessions";
import {
	WorkFlowTransition,
	WorkflowProcess,
	WorkflowRole,
	WorkflowState,
	WorkflowCompany,
} from "../types/workflowTypes";
import { NumberBoolean } from "../types/genericTypes";

// import mockFetchAll from "data/mockFetchAll_v2";
import isEqual from "lodash.isequal";
import { nodeByState, roleColor, stateByNode, transformNewConnectionToTransition } from "utils";
const initialRole = "system";

export interface MainState {
	globalLoading: boolean;
	activeRole: string;
	_hasHydrated: boolean;
	activeProcess: WorkflowProcess | null;
	reactFlowInstance: ReactFlowInstance | undefined;
	showMinimap: boolean;
	showAllRoles: boolean;
	showAllConnectedStates: boolean;
	edgeType: string;
	contextMenuNodeId: string | undefined;
	processes: WorkflowProcess[];
	states: WorkflowState[];
	roles: WorkflowRole[];
	companies: WorkflowCompany[];
	hoveredEdgeNodes: string[];
}

export interface MainActions {
	fetchAll: (env?: string) => Promise<any>;
	setActiveRole: (role: string) => void;
	addProcess: (ProcessName: string) => void;
	updateProcess: (payload: { processIndex: number; process: WorkflowProcess }) => void;
	deleteProcess: (ProcessName: string) => void;
	toggleRoleForProcess: (role: string, color?: string) => void;
	toggleCompanyForProcess: (company: string) => void;
	updateRoleProperty: (payload: { role: string; property: string; value: any }) => void;
	updateStateProperty: (payload: { state: string; property: string; value: any }) => void;
	filteredStates: (existingStates: WorkflowState[]) => string[];
	addNewState: (name: string) => void;
	addNewRole: (role: string) => void;
	addNewCompany: (company: string) => void;
	setHasHydrated: (state: boolean) => void;
	onNodesChange: OnNodesChange;
	onConnect: OnConnect;
	removeTransition: (payload: { source: string; target: string }) => void;
	removeState: (StateName: string) => void;
	setStatesForActiveProcess: (States: WorkflowState[]) => void;
	updateStateProperties: (payload: {
		stateName: string;
		properties: { x?: number; y?: number; h?: number; w?: number };
	}) => void;
	setActiveProcess: (ProcessName: string) => void;
	setColorForActiveRole: (newColor: string) => void;
	setReactFlowInstance: (instance: ReactFlowInstance) => void;
	setShowMinimap: () => void;
	toggleShowAllRoles: () => void;
	setShowAllConnectedStates: () => void;
	setEdgeType: (type: string) => void;
	setContextMenuNodeId: (id: string | undefined) => void;
	saveStateSnapshot: () => void;
	revertToSnapshot: () => void;
	setHoveredEdgeNodes: (nodes: string[]) => void;
}

const useMainStore = create<MainState & MainActions>()(
	// persist(
	devtools(
		(set, get) => ({
			hoveredEdgeNodes: [],
			setHoveredEdgeNodes: (nodes: string[]) => {
				set({ hoveredEdgeNodes: nodes });
			},
			saveStateSnapshot: () => {
				const { activeProcess, activeRole, processes, states, roles, companies } = get();
				const snapShot = { activeProcess, activeRole, processes, states, roles, companies };

				localStorage.setItem('state-snapshot', JSON.stringify(snapShot));
			},
			revertToSnapshot: () => {
				const foundSnapshot = localStorage.getItem('state-snapshot');
				if (foundSnapshot) {
					try {
						const snapshot = JSON.parse(foundSnapshot);

						const { activeProcess, activeRole, processes, states, roles, companies } = snapshot;

						set({ activeProcess, activeRole, processes, states, roles, companies })
					} catch (err) {
						console.log('Something went wrong while parsing snapshot data')
					}
				}
			},
			contextMenuNodeId: undefined,
			setContextMenuNodeId: (nodeId) => {
				set({ contextMenuNodeId: nodeId });
			},
			activeProcess: null,
			fetchAll: async (env?: string) => {
				set({ globalLoading: true }, false, "globalLoading");
				const waitTime = Math.random() * (2500 - 500) + 500;
				await new Promise((r) => setTimeout(r, waitTime));
				// const { processes = [], roles = [], states = [] }: any = mockFetchAll;
				const { processes = [], roles = [], states = [] }: any = getAllSessions();
				set({ states, roles, processes, globalLoading: false }, false, "fetchAll");
				const activeProcessName = processes[0]?.processName;
				get().setActiveProcess(activeProcessName);
			},
			globalLoading: false,
			_hasHydrated: false,
			setHasHydrated: (state) => set({ _hasHydrated: state }),
			states: [],
			roles: [],
			companies: [],
			onNodesChange: (changes: NodeChange[] | any[]) => {
				const { activeProcess, activeRole, showAllRoles } = get();

				const removeIndexPrefix = (prefixedString: string): string => {
					const prefix = !showAllRoles ? "" : prefixedString.match(/\d+/g)?.[0] || "";

					return prefixedString.slice(prefix.length);
				};

				const mappedChanges = changes.map((change) => ({
					...change,
					id: removeIndexPrefix(change.id),
				}));

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

					const updatedNodes = applyNodeChanges(mappedChanges, nodes);

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
			edgeType: "straight",
			setEdgeType: (type) => set({ edgeType: type }, false, "setEdgeType"),
			setStatesForActiveProcess: (states: WorkflowState[]) => {
				const { activeProcess } = get();

				if (activeProcess) {
					set(
						{
							activeProcess: { ...activeProcess, states },
						},
						false,
						"setStatesForActiveProcess"
					);
				}
			},
			onConnect: (connection: Connection) => {
				const { activeRole, activeProcess, showAllRoles } = get();
				const { source, target } = connection;

				const { roles = [] } = activeProcess || {};
				let roleIndexStr = "";

				const removeIndexPrefixFromName = (prefix: string, name: string): string => {
					const index = name.indexOf(prefix);

					if (index !== -1) return name.slice(0, index) + name.slice(index + prefix.length);
					return name;
				};

				const foundRoleIndex = roles.findIndex(({ roleName }, i) => {
					if (showAllRoles) {
						roleIndexStr = (source || "").match(/\d+/g)?.[0] || "";

						return Number(roleIndexStr) === i;
					}

					return roleName === activeRole;
				});

				if (foundRoleIndex !== -1 && activeProcess) {
					const { transitions = [] } = roles[foundRoleIndex];
					const updatedConnection = {
						...connection,
						...(showAllRoles && {
							source: removeIndexPrefixFromName(roleIndexStr, source || ""),
							target: removeIndexPrefixFromName(roleIndexStr, target || ""),
						}),
					};
					const newTransition = transformNewConnectionToTransition(updatedConnection, transitions);

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
			toggleShowAllRoles: () =>
				set(({ showAllRoles }) => ({ showAllRoles: !showAllRoles, showAllConnectedStates: false })),
			showAllConnectedStates: false,
			setShowAllConnectedStates: () =>
				set(({ showAllConnectedStates }) => ({
					showAllConnectedStates: !showAllConnectedStates,
					showAllRoles: false,
				})),
			removeTransition: ({ source, target }: { source: string; target: string }) => {
				const { activeRole, activeProcess, showAllRoles } = get();

				const { roles = [] } = activeProcess || {};
				let roleIndexStr = "";

				const removeIndexPrefixFromName = (prefix: string, name: string): string => {
					const index = name.indexOf(prefix);

					if (index !== -1) return name.slice(0, index) + name.slice(index + prefix.length);
					return name;
				};

				const foundRoleIndex = roles.findIndex(({ roleName }, i) => {
					if (showAllRoles) {
						roleIndexStr = source.match(/\d+/g)?.[0] || "";

						return Number(roleIndexStr) === i;
					}

					return roleName === activeRole;
				});

				if (foundRoleIndex !== -1 && activeProcess) {
					const { transitions = [] } = roles[foundRoleIndex];

					const updatedTransitions = transitions.filter(({ stateName, toStateName }) => {
						const updatedSource = showAllRoles
							? removeIndexPrefixFromName(roleIndexStr, source)
							: source;
						const updatedTarget = showAllRoles
							? removeIndexPrefixFromName(roleIndexStr, target)
							: target;
						return stateName !== updatedSource || toStateName !== updatedTarget;
					});

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
			removeState: (stateNameToRemove: string) => {
				const { activeProcess } = get();

				const { roles = [] } = activeProcess || {};

				if (activeProcess) {
					const TransitionsFilter = (transitions: WorkFlowTransition[]) => {
						return transitions.filter(
							({ stateName, toStateName }) => stateName !== stateNameToRemove && toStateName !== stateNameToRemove
						);
					};

					const updatedRoles = roles.map((r) => ({
						...r,
						transitions: TransitionsFilter(r?.transitions || []),
					}));

					const updatedStates = activeProcess.states?.filter((s) => s.stateName !== stateNameToRemove);

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
						const newProcess: WorkflowProcess = {
							processId: null,
							processName: name,
							sessionId: "",
							globals: { states: get().states, roles: get().roles, companies: get().companies },
							roles: [],
							states: [],
							companies: [],
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
						const initialNumberBoolean: NumberBoolean = 0;

						const newRole: WorkflowRole = {
							roleId: null,
							isCluster: initialNumberBoolean,
							isUniversal: initialNumberBoolean,
							roleName: role,
							transitions: [],
							properties: {
								color: color || roleColor({ roleName: role, allRoles: roles, index: roles.length }),
							},
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
			toggleCompanyForProcess: (company: string) => {
				const { activeProcess } = get();
				if (activeProcess) {
					const { companies = [] } = activeProcess;

					let updatedCompanies = companies;

					if (companies.some(({ companyName }) => companyName === company)) {
						updatedCompanies = companies.filter(({ companyName }) => companyName !== company);
					} else {
						const initialNumberBoolean: NumberBoolean = 0;

						const newCompany = {
							companyId: null,
							companyName: company,
							isInternal: initialNumberBoolean,
							isTrusted: false,
						};

						updatedCompanies = companies.concat(newCompany);
					}
					set(
						{ activeProcess: { ...activeProcess, companies: updatedCompanies } },
						false,
						"toggleCompanyForProcess"
					);
				}
			},
			updateRoleProperty: ({ role, property, value }) => {
				const { activeProcess } = get();

				if (activeProcess) {
					const { roles = [] } = activeProcess;

					const roleInProcessIndex = roles.findIndex(({ roleName }) => roleName === role);

					const foundRole = roles[roleInProcessIndex];

					const updatedRoles =
						roleInProcessIndex !== -1
							? roles.map((r, i) =>
								i !== roleInProcessIndex ? r : { ...foundRole, [property]: value }
							)
							: roles;

					set(
						{
							activeProcess: { ...activeProcess, roles: updatedRoles },
						},
						false,
						"updateRoleProperty"
					);
				}
			},
			updateStateProperty: ({ state, property, value }) => {
				const { activeProcess } = get();

				if (activeProcess) {
					const { states = [] } = activeProcess;

					const stateInProcessIndex = states.findIndex(({ stateName }) => stateName === state);

					const foundState = states[stateInProcessIndex];

					const updatedStates =
						stateInProcessIndex !== -1
							? states.map((s, i) =>
								i !== stateInProcessIndex ? s : { ...foundState, [property]: value }
							)
							: states;

					set(
						{
							activeProcess: { ...activeProcess, states: updatedStates },
						},
						false,
						"updateStateProperty",
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

				return states.map((el) => el.stateName).filter(
					(stateName: string) => !existingStates.some((s) => s.stateName === stateName)
				);
			},
			addNewState: (name) => {
				const { states } = get();
				
				if (!states.some(({ stateName }) => stateName === name)) {

					const newState: WorkflowState = {
						stateId: null,
						stateName: name,
						requiresRoleAssignment: 0,
						requiresUserAssignment: 0,
						displayOrder: Math.max(...states.map(({ displayOrder }) => displayOrder || 0)) + 10,
					};

					set({ states: states.concat(newState) }, false, "addNewState");
				}
			},
			addNewRole: (role: string) =>
				set(
					({ roles }) => {
						const initialNumberBoolean: NumberBoolean = 0;

						const newRole: WorkflowRole = {
							roleId: null,
							roleName: role,
							isUniversal: initialNumberBoolean,
							isCluster: initialNumberBoolean,
						};

						return { roles: roles.concat(newRole) };
					},
					false,
					"addNewRole"
				),
			addNewCompany: (company: string) =>
				set(
					({ companies }) => {
						const initialNumberBoolean: NumberBoolean = 0;

						const newCompany = {
							companyId: null,
							companyName: company,
							isInternal: initialNumberBoolean,
							isTrusted: false,
						};
						return { companies: companies.concat(newCompany) };
					},
					false,
					"addNewCompany"
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
