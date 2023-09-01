import { defaultColors } from "data";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
    Connection,
    NodeChange,
    OnConnect,
    OnNodesChange,
    ReactFlowInstance,
    applyNodeChanges,
} from "reactflow";
import {
    getAllSessions,
    getSessionProcess,
    createProcess,
    deleteSession,
    cloneProcess,
    saveProcess,
    publishProcess,
} from "api";
import {
    WorkFlowTransition,
    WorkflowProcess,
    WorkflowRole,
    WorkflowState,
    WorkflowCompany,
    WorkflowSession,
    NumberBoolean,
    Nullable,
} from "types";
import {
    getHelperLinePositions,
    nodeByState,
    roleColor,
    stateByNode,
    transformNewConnectionToTransition,
    simplifySVGPath,
} from "utils";

export interface MainState {
    selectedEdge: Nullable<{ source: string; target: string; role: string; }>;
    globalLoading: boolean;
    activeRole: string;
    _hasHydrated: boolean;
    activeProcess: WorkflowProcess | null;
    reactFlowInstance: ReactFlowInstance | undefined;
    showMinimap: boolean;
    showAllRoles: boolean;
    showPortsAndCloseButtons: boolean;
    showAllConnectedStates: boolean;
    edgeType: string;
    contextMenuNodeId: string | undefined;
    sessions: WorkflowSession[];
    processes: WorkflowProcess[];
    states: WorkflowState[];
    roles: WorkflowRole[];
    companies: WorkflowCompany[];
    hoveredEdgeNodes: string[];
    unsavedChanges: boolean;
    helperLines: [
        number | undefined,
        number | undefined,
        string | undefined,
        string | undefined,
        string | undefined,
        string | undefined,
        string | undefined,
        string | undefined,
    ];
}

export interface MainActions {
    setSelectedEdge: (payload: Nullable<{ target: string; source: string; role?: string }>) => void;
    setUnsavedChanges: (status: boolean) => void;
    getAllSessions: (env?: string) => Promise<any>;
    deleteSession: (sessionId: string) => Promise<string>;
    cloneProcess: (processName: string) => Promise<void>;
    saveProcess: () => Promise<boolean>;
    publishProcess: () => Promise<boolean>;
    setActiveRole: (role: string) => void;
    addProcess: (processName: string) => void | any;
    updateProcess: (payload: { processIndex: number; process: WorkflowProcess }) => void;
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
    removeState: (stateName: string) => void;
    setStatesForActiveProcess: (States: WorkflowState[]) => void;
    updateStateProperties: (payload: {
        stateName: string;
        properties: { x?: number; y?: number; h?: number; w?: number };
    }) => void;
    setActiveProcess: (process: WorkflowProcess, role?: string) => void;
    setColorForActiveRole: (newColor: string) => void;
    setReactFlowInstance: (instance: ReactFlowInstance) => void;
    setShowMinimap: () => void;
    setShowPortsAndCloseButtons: () => void;
    toggleShowAllRoles: () => void;
    setShowAllConnectedStates: () => void;
    setEdgeType: (type: string) => void;
    setContextMenuNodeId: (id: string | undefined) => void;
    saveStateSnapshot: () => void;
    revertToSnapshot: () => void;
    setHoveredEdgeNodes: (nodes: string[]) => void;
    setPathForEdge: (payload: { path: string; role: string; source: string; target: string }) => void;
}

const useMainStore = create<MainState & MainActions>()(
    devtools(
        (set, get) => ({
            selectedEdge: null,
            setPathForEdge: ({ path, role, source, target }) => {
                const { activeProcess, selectedEdge } = get();
                const { source: selectedSource, target: selectedTarget, role: selectedRole } = selectedEdge || {};
                if (activeProcess && selectedSource === source && selectedTarget === target && selectedRole === role) {
                    const { roles = [] } = activeProcess;

                    const foundRoleIndex = roles.findIndex(({ roleName }) => roleName === role);
                    const { transitions = [] } = roles[foundRoleIndex] || {};

                    const foundTransitionIndex = transitions.findIndex(({ stateName, toStateName }) => {
                        return stateName === source && toStateName === target;
                    });

                    if (foundTransitionIndex !== -1) {
                        const existingTransition = transitions[foundTransitionIndex];
                        const points = path ? simplifySVGPath(path, true) : '';
                        if (!points) delete existingTransition.properties?.points;
                        const updatedTransition = { ...existingTransition, properties: { ...existingTransition?.properties || {}, ...(points && { points }) } };

                        const updatedTransitions = transitions.map((t, i) => {
                            return i === foundTransitionIndex ? updatedTransition : t;
                        });

                        const updatedRoles = roles.map((r, i) => {
                            return i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r;
                        });

                        set(
                            {
                                activeProcess: {
                                    ...activeProcess,
                                    roles: updatedRoles,
                                },
                            },
                            false,
                            "setPathForEdge"
                        );
                    }
                }
            },
            setSelectedEdge: (payload) => {
                let selectedEdge = null;

                if (payload) {
                    const { activeRole } = get();
                    const { source, target, role } = payload;
                    const selectedEdgeRole = role || activeRole;
                    selectedEdge = { source, target, role: selectedEdgeRole };
                }
                set({ selectedEdge });
            },
            helperLines: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
            unsavedChanges: false,
            setUnsavedChanges: (status) => set({ unsavedChanges: status }),
            sessions: [],
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
            deleteSession: async (processName: string) => {
                const { sessions } = get();
                const { sessionId = '' } = sessions.find(({ processName: name }) => name === processName) || {};
                const successMessage = await deleteSession(sessionId);

                if (successMessage?.toLowerCase()?.includes('was deleted')) {
                    set(({ sessions, processes }) => (
                        {
                            sessions: sessions.filter(({ sessionId: id }) => id !== sessionId),
                            processes: processes.filter(({ sessionId: id }) => id !== sessionId)
                        }),
                        false,
                        "deleteSession",
                    )
                }

                return successMessage || 'Something went wrong';
            },
            saveProcess: async () => {
                // handle for success/failure, return message?
                const { activeProcess, activeRole } = get();
                if (!activeProcess) return false;

                // not necessary to include globals in payload
                const { globals, ...activeProcessWithoutGlobals } = activeProcess;
                const savePayload = { ...activeProcessWithoutGlobals }

                const saved = await saveProcess(savePayload);
                const success = !!saved?.sessionId;

                if (success) {
                    get().setActiveProcess(saved, activeRole);
                    setTimeout(() => {
                        set({ unsavedChanges: false }, false, "saveProcess");
                    }, 0)
                }

                return success;
            },
            publishProcess: async () => {
                const { activeProcess, activeRole } = get();
                if (!activeProcess?.sessionId) return false;

                const published = await publishProcess(activeProcess);
                const success = !!published?.sessionId;

                if (success) get().setActiveProcess(published, activeRole);

                return success;
            },
            cloneProcess: async (processName: string) => {
                const { sessions, activeRole, activeProcess } = get();
                const invalidNames = sessions.map(({ processName }) => processName);

                const nameUpdater = (name: string, invalid: string[] = []): string => {
                    let updatedName = name;
                    const namePieces = updatedName.split(' - copy');
                    const currentCount = parseInt(namePieces[1], 10) || 0;

                    if (namePieces.length === 1) (updatedName += ' - copy 1');
                    else (updatedName = `${namePieces[0]} - copy ${currentCount + 1}`);

                    return invalid.includes(updatedName) ?
                        nameUpdater(updatedName, invalid) :
                        updatedName;
                }

                const cloned = await cloneProcess({ processName, newProcessName: nameUpdater(processName, invalidNames) });

                if (cloned?.sessionId) {
                    const {
                        dateCreated = null,
                        datePublished = null,
                        dateUpdated = null,
                        processId = null,
                        processName,
                        sessionId,
                    } = cloned

                    const clonedSession = {
                        dateCreated,
                        datePublished,
                        dateUpdated,
                        processId,
                        processName,
                        sessionId,
                    }
                    const isSameAsActive = activeProcess?.processName === processName
                    get().setActiveProcess(cloned, isSameAsActive ? activeRole : undefined);

                    set(
                        {
                            sessions: [...sessions, clonedSession],
                            unsavedChanges: false,
                        },
                        false,
                        "cloneProcess"
                    );
                }
            },
            getAllSessions: async () => {
                set({ globalLoading: true }, false, "globalLoading");
                const sessions: WorkflowSession[] = await getAllSessions();
                set({ sessions, globalLoading: false }, false, "getAllSessions");
                const { sessionId = '' } = sessions?.[0] || {};
                if (sessionId) {
                    const sessionProcess = await getSessionProcess(sessionId);

                    if (sessionProcess) get().setActiveProcess(sessionProcess);
                }
            },
            globalLoading: false,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            states: [],
            roles: [],
            companies: [],
            onNodesChange: (changes: NodeChange[] | any[]) => {
                const {
                    activeProcess,
                    activeRole,
                    showAllRoles,
                    edgeType,
                    helperLines,
                } = get();
                const isStraightEdge = edgeType === 'straight';

                const removeIndexPrefix = (prefixedString: string): string => {
                    const prefix = !showAllRoles ? "" : prefixedString.match(/\d+/g)?.[0] || "";

                    return prefixedString.slice(prefix.length);
                };

                const { states = [] } = activeProcess || {};

                // todo: forEach instead of map, handle additional position changes
                // via nodeShouldSnapTo
                const mappedChanges = changes.map((change, i, arr) => {
                    const { position = {}, id } = change;

                    const updated = { ...change, id: removeIndexPrefix(id) };

                    if (arr.length === 1 && arr[0].dragging) {
                        const { x, y } = position;
                        const roundToTwo = (n: number) => Math.round(n / 2) * 2

                        Object.assign(updated, {
                            positionAbsolute: { x: roundToTwo(x), y: roundToTwo(y) },
                            position: { x: roundToTwo(x), y: roundToTwo(y) },
                        });
                    }

                    return updated
                });

                if (changes.length === 1) {
                    const [selectedNode] = changes;

                    const { id, dragging, type } = selectedNode;

                    if (dragging) {
                        const helperLines = getHelperLinePositions({ nodeId: id });

                        set({ helperLines });
                    } else if (type === 'position') {
                        const [xNode, yNode, xTargetSide, yTargetSide, xSourceSide, ySourceSide] = helperLines.slice(2, 8);
                        const foundSourceState = states.find(({ stateName }) => stateName === id);
                        const { properties }: any = foundSourceState || {};
                        const { x, w, y, h } = properties;

                        if (xNode && xTargetSide && xSourceSide) {
                            const foundXNode = states.find(({ stateName }) => stateName === xNode);
                            const { properties }: any = foundXNode || {};
                            const { x: xNodeX, w: xNodeW } = properties;

                            let updatedX = x;
                            switch (xTargetSide) {
                                case 'left':
                                    updatedX = xSourceSide === 'left' ? xNodeX : xNodeX - w;
                                    break;
                                case 'right':
                                    updatedX = xSourceSide === 'left' ? xNodeX + xNodeW : xNodeX + xNodeW - w;
                                    break;
                            }

                            const updatedSelectedNode = {
                                ...selectedNode,
                                position: { y, x: updatedX },
                                positionAbsolute: { y, x: updatedX },
                            };

                            Object.assign(mappedChanges[0], updatedSelectedNode);
                        }
                        if (yNode && yTargetSide && ySourceSide) {
                            const foundYNode = states.find(({ stateName }) => stateName === yNode);
                            const { properties }: any = foundYNode || {};
                            const { y: yNodeY, h: yNodeH } = properties;

                            let updatedY = y;
                            switch (yTargetSide) {
                                case 'top':
                                    updatedY = ySourceSide === 'top' ? yNodeY : yNodeY - h;
                                    break;
                                case 'bottom':
                                    updatedY = ySourceSide === 'top' ? yNodeY + yNodeH : yNodeY + yNodeH - h;
                                    break;
                            }

                            const updatedSelectedNode = {
                                ...selectedNode,
                                position: { x: xNode ? mappedChanges[0]?.position?.x || x : x, y: updatedY },
                                positionAbsolute: { x: xNode ? mappedChanges[0]?.position?.x || x : x, y: updatedY },
                            };

                            Object.assign(mappedChanges[0], updatedSelectedNode);
                        }

                        set({ helperLines: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined] })
                    }
                }

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
                            fullHandles: isStraightEdge,
                        })
                    );

                    const updatedNodes = applyNodeChanges(mappedChanges, nodes);

                    const updatedStates = updatedNodes.map((node) =>
                        stateByNode({
                            node: { ...node, data: { ...node.data, color: nodeColor } },
                            allStates,
                        })
                    )

                    set(
                        {
                            activeProcess: {
                                ...activeProcess,
                                states: updatedStates,
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
            edgeType: "step",
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
                const { activeRole, activeProcess, showAllRoles, states, setSelectedEdge } = get();
                const { source, target } = connection;
                let roleForSelectedEdge = activeRole;
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
                        roleForSelectedEdge = roleName;
                        return Number(roleIndexStr) === i;
                    }

                    return roleName === activeRole;
                });

                if (foundRoleIndex !== -1 && activeProcess) {
                    const { transitions: roleTransitions, roleId, roleName } = roles[foundRoleIndex];

                    const transitions = roleTransitions || [];

                    const updatedConnection = {
                        ...connection,
                        ...(showAllRoles && {
                            source: removeIndexPrefixFromName(roleIndexStr, source || ""),
                            target: removeIndexPrefixFromName(roleIndexStr, target || ""),
                        }),
                    };

                    const newTransition = transformNewConnectionToTransition({
                        connection: updatedConnection,
                        existingTransitions: transitions,
                        allStates: states,
                        roleId,
                        roleName,
                    });

                    const filteredTransitions = transitions.filter(({ stateName, toStateName }) => {
                        const { stateName: newTranstionSource, toStateName: newTransitionTarget } = newTransition || {};

                        return !newTranstionSource ||
                            !newTransitionTarget ||
                            stateName !== newTranstionSource ||
                            toStateName !== newTransitionTarget;
                    })

                    const updatedTransitions = [...filteredTransitions, ...(newTransition ? [newTransition] : [])];

                    const updatedRoles = roles.map((r, i) =>
                        i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r
                    );
                    source && target && setTimeout(() => setSelectedEdge({ source, target, role: roleForSelectedEdge }), 10)
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
                const { activeRole, activeProcess, showAllRoles, setSelectedEdge } = get();

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
                    setSelectedEdge(null);
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
            setActiveProcess: (process: WorkflowProcess, role) =>
                set(
                    () => {
                        const { globals } = process;
                        const { states = [], roles = [], companies = [] } = globals || {};
                        const sortRoles = (roles: WorkflowRole[]) => [...roles].sort((a, b) => a.roleName.localeCompare(b.roleName));
                        const { roles: activeProcessRoles = [] } = process;
                        const activeRole = role || sortRoles(activeProcessRoles)?.[0]?.roleName || sortRoles(roles)?.[0]?.roleName || "";

                        return { activeProcess: process, states, roles: sortRoles(roles), companies, activeRole };
                    },
                    false,
                    "setActiveProcess"
                ),
            activeRole: '',
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
            addProcess: async (name: string) => {
                const newProcess = await createProcess(name);
                set(({ processes, setActiveProcess, sessions }) => {
                    const { globals, roles, states, companies, ...session } = newProcess;
                    setActiveProcess(newProcess);
                    return { processes: [...processes, newProcess], sessions: [...sessions, session] };
                },
                    false,
                    "addProcess"
                );
            },
            toggleRoleForProcess: (role, color) => {
                const { activeProcess, roles: globalRoles } = get();

                if (activeProcess) {
                    const { roles = [] } = activeProcess;

                    let updatedRoles = roles;

                    const foundRole = globalRoles.find(({ roleName }) => roleName === role);

                    if (roles.some(({ roleName }) => roleName === role)) {
                        updatedRoles = roles.filter(({ roleName }) => roleName !== role);
                    } else {
                        const initialNumberBoolean: NumberBoolean = 0;

                        const newRole: WorkflowRole = {
                            roleId: foundRole?.roleId || null,
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
            showPortsAndCloseButtons: true,
            setShowPortsAndCloseButtons: () => {
                set({ showPortsAndCloseButtons: !get().showPortsAndCloseButtons });
            },
            showMinimap: true,
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
