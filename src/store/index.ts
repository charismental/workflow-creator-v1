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
import GetAllProcesses from "api/GetAllProcesses";
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
	States: WorkflowState[];
	Roles: WorkflowRole[];
	Companies: WorkflowCompany[];
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
		StateName: string;
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
				const { activeProcess, activeRole, processes, States, Roles, Companies } = get();
				const snapShot = { activeProcess, activeRole, processes, States, Roles, Companies };

				localStorage.setItem('state-snapshot', JSON.stringify(snapShot));
			},
			revertToSnapshot: () => {
				const foundSnapshot = localStorage.getItem('state-snapshot');
				if (foundSnapshot) {
					try {
						const snapshot = JSON.parse(foundSnapshot);

						const { activeProcess, activeRole, processes, States, Roles, Companies } = snapshot;

						set({ activeProcess, activeRole, processes, States, Roles, Companies })
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
				const { processes = [], roles = [], states = [] }: any = GetAllProcesses();
				set({ states, roles, processes, globalLoading: false }, false, "fetchAll");
				const activeProcessName = processes[0]?.processName;
				get().setActiveProcess(activeProcessName);
			},
			globalLoading: false,
			_hasHydrated: false,
			setHasHydrated: (state) => set({ _hasHydrated: state }),
			States: [],
			Roles: [],
			Companies: [],
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
					const activeRoleIndex = (activeProcess?.Roles || []).findIndex(
						({ RoleName }) => RoleName === activeRole
					);

					const { properties = {} } = activeProcess.Roles?.[activeRoleIndex] || {};

					const nodeColor = properties?.color || defaultColors?.[activeRoleIndex];

					const { States: allStates = [] } = activeProcess || {};

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
				StateName,
				properties,
			}: {
				StateName: string;
				properties: { x?: number; y?: number; h?: number; w?: number };
			}) => {
				const { activeProcess, setStatesForActiveProcess } = get();

				const { States = [] } = activeProcess || {};

				const foundStateIndex = States.findIndex((state) => state.StateName === StateName);

				if (foundStateIndex !== -1) {
					setStatesForActiveProcess(
						States.map((s, i) =>
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
			setStatesForActiveProcess: (States: WorkflowState[]) => {
				const { activeProcess } = get();

				if (activeProcess) {
					set(
						{
							activeProcess: { ...activeProcess, States: States },
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

				const foundRoleIndex = Roles.findIndex(({ RoleName }, i) => {
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

				const foundRoleIndex = Roles.findIndex(({ RoleName }, i) => {
					if (showAllRoles) {
						roleIndexStr = source.match(/\d+/g)?.[0] || "";

						return Number(roleIndexStr) === i;
					}

					return roleName === activeRole;
				});

				if (foundRoleIndex !== -1 && activeProcess) {
					const { Transitions = [] } = Roles[foundRoleIndex];

					const updatedTransitions = transitions.filter(({ fromStateName, toStateName }) => {
						const updatedSource = showAllRoles
							? removeIndexPrefixFromName(roleIndexStr, source)
							: source;
						const updatedTarget = showAllRoles
							? removeIndexPrefixFromName(roleIndexStr, target)
							: target;
						return fromStateName !== updatedSource || toStateName !== updatedTarget;
					});

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
					const TransitionsFilter = (Transitions: WorkFlowTransition[]) => {
						return Transitions.filter(
							({ StateName, ToStateName }) => StateName !== stateName && ToStateName !== stateName
						);
					};

					const updatedRoles = Roles.map((r) => ({
						...r,
						Transitions: TransitionsFilter(r?.Transitions || []),
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
			setActiveProcess: (ProcessName: string) =>
				set(
					({ processes, activeProcess }) => {
						const processToSet = processes.find((p) => p.ProcessName === ProcessName);

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
							ProcessID: null,
							ProcessName: name,
							SessionID: "",
							Globals: { States: get().States, Roles: get().Roles, Companies: get().Companies },
							Roles: [],
							States: [],
							Companies: [],
						};

						return { processes: processes.concat(newProcess) };
					},
					false,
					"addProcess"
				),
			// fix
			deleteProcess: (ProcessName) =>
				set(
					({ processes }) => ({
						processes: processes.filter((p) => p.ProcessName !== ProcessName),
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
						const initialNumberBoolean: NumberBoolean = 0;

						const newRole: WorkflowRole = {
							RoleID: null,
							IsCluster: initialNumberBoolean,
							IsUniversal: initialNumberBoolean,
							RoleName: role,
							Transitions: [],
							properties: {
								color: color || roleColor({ RoleName: role, allRoles: Roles, index: Roles.length }),
							},
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
			toggleCompanyForProcess: (company: string) => {
				const { activeProcess } = get();
				if (activeProcess) {
					const { Companies = [] } = activeProcess;

					let updatedCompanies = Companies;

					if (Companies.some(({ CompanyName }) => CompanyName === company)) {
						updatedCompanies = Companies.filter(({ CompanyName }) => CompanyName !== company);
					} else {
						const initialNumberBoolean: NumberBoolean = 0;

						const newCompany = {
							CompanyID: null,
							CompanyName: company,
							isInternal: initialNumberBoolean,
							IsTrusted: false,
						};

						updatedCompanies = Companies.concat(newCompany);
					}
					set(
						{ activeProcess: { ...activeProcess, Companies: updatedCompanies } },
						false,
						"toggleCompanyForProcess"
					);
				}
			},
			updateRoleProperty: ({ role, property, value }) => {
				const { activeProcess } = get();

				if (activeProcess) {
					const { Roles = [] } = activeProcess;

					const roleInProcessIndex = Roles.findIndex(({ RoleName }) => RoleName === role);

					const foundRole = Roles[roleInProcessIndex];

					const updatedRoles =
						roleInProcessIndex !== -1
							? Roles.map((r, i) =>
								i !== roleInProcessIndex ? r : { ...foundRole, [property]: value }
							)
							: Roles;

					set(
						{
							activeProcess: { ...activeProcess, Roles: updatedRoles },
						},
						false,
						"updateRoleProperty"
					);
				}
			},
			updateStateProperty: ({ state, property, value }) => {
				const { activeProcess } = get();

				if (activeProcess) {
					const { States = [] } = activeProcess;

					const stateInProcessIndex = States.findIndex(({ StateName }) => StateName === state);

					const foundState = States[stateInProcessIndex];

					const updatedStates =
						stateInProcessIndex !== -1
							? States.map((s, i) =>
								i !== stateInProcessIndex ? s : { ...foundState, [property]: value }
							)
							: States;

					set(
						{
							activeProcess: { ...activeProcess, States: updatedStates },
						},
						false,
						"updateStateProperty",
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
								: { ...foundRole, properties: { ...foundRole.properties, color } }
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
				const { States } = get();

				return States.map((el) => el.StateName).filter(
					(StateName: string) => !existingStates.some((s) => s.StateName === StateName)
				);
			},
			addNewState: (name) => {
				const { States } = get();
				
				if (!States.some(({ StateName }) => StateName === name)) {

					const newState: WorkflowState = {
						StateID: null,
						StateName: name,
						RequiresRoleAssignment: 0,
						RequiresUserAssignment: 0,
						DisplayOrder: Math.max(...States.map(({ DisplayOrder }) => DisplayOrder || 0)) + 10,
					};

					set({ States: States.concat(newState) }, false, "addNewState");
				}
			},
			addNewRole: (role: string) =>
				set(
					({ Roles }) => {
						const initialNumberBoolean: NumberBoolean = 0;

						const newRole: WorkflowRole = {
							RoleID: null,
							RoleName: role,
							IsUniversal: initialNumberBoolean,
							IsCluster: initialNumberBoolean,
						};

						return { Roles: Roles.concat(newRole) };
					},
					false,
					"addNewRole"
				),
			addNewCompany: (company: string) =>
				set(
					({ Companies }) => {
						const initialNumberBoolean: NumberBoolean = 0;

						const newCompany = {
							CompanyID: null,
							CompanyName: company,
							isInternal: initialNumberBoolean,
							IsTrusted: false,
						};
						return { Companies: Companies.concat(newCompany) };
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
