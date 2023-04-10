// doing it this way for now to get around use of hook
import { RoleList, StateList, initialColors } from 'data';
import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import { WorkflowProcess } from './types';
import {
    Node,
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
    Edge,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection,
} from "reactflow";

import initialWorkflows from 'data/seed';

const initialProcessName = 'LBHA v2';
const initialRole = 'Intake-Specialist';
const defaultColor = "#d4d4d4";
export const initialNodes = initialWorkflows.find(({ ProcessName }) => ProcessName === initialProcessName)?.nodes || [];
const initialAllEdges = { "Intake-Specialist": [], "Intake-Specialist Manager": [], "Caseworker": [], "Caseworker Manager": [], "Partner Final Reviewer": [], "Partner Reviewer": [], "Customer-Support": [] };
// need to make this go away
export const initialAllCanSeeStates = { "Intake-Specialist": [], "Intake-Specialist Manager": [], "Caseworker": [], "Caseworker Manager": [], "Partner Final Reviewer": [], "Partner Reviewer": [], "Customer-Support": [] };

export interface MainState {
    activeProcessName: string;
    activeRole: string;
    states: { [key: string]: number };
    processes: Array<WorkflowProcess>;
    allEdges: any;
    roleColors: { [key: string]: string };
    roles: { [key: string]: number };
    _hasHydrated: boolean;
    nodes: Node[];
    edges: Edge[];
}

export interface MainActions {
    setActiveProcessName: (processName: string) => void;
    setActiveRole: (role: string) => void;
    setStates: (el: any) => void;
    addProcess: (processName: string) => void;
    updateProcess: (payload: { processIndex: number; process: WorkflowProcess }) => void;
    deleteProcess: (processId: number) => void;
    setAllEdges: (el: any) => void;
    setRoleColors: (el: { [key: string]: string }, processName?: string) => void;
    setRoles: (el: { [key: string]: number }) => void;
    setNodes: (nodes: Node[], processName?: string) => void;
    setEdges: (edges: Edge[]) => void;
    toggleRoleForProcess: (role: string) => void;
    filteredStates: (nodes: Node[]) => string[];
    addNewStateItem: (name: string) => void;
    // setAllCanSeeStates: (name: string) => void;
    setHasHydrated: (state: boolean) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
}

const useMainStore = create<MainState & MainActions>()(
    // persist(
    (set, get) => ({
        _hasHydrated: false,
        setHasHydrated: (state) => set(({ _hasHydrated: state })),
        nodes: [],
        edges: [],
        onNodesChange: (changes: NodeChange[]) => {
            set({
                nodes: applyNodeChanges(changes, get().nodes),
            });
        },
        onEdgesChange: (changes: EdgeChange[]) => {
            set({
                edges: applyEdgeChanges(changes, get().edges),
            });
        },
        onConnect: (connection: Connection) => {
            const { allEdges, activeRole } = get();

            const updatedEdges = [...(allEdges?.[activeRole] || [])];

            set({
                edges: addEdge(connection, updatedEdges),
            });
        },
        activeProcessName: initialProcessName,
        setActiveProcessName: (processName) => set(({ processes, setNodes, setRoleColors, roles }) => {
            const process = processes.find(p => p.ProcessName === processName);
            const updatedColors: any = { ...(process?.colors || initialColors)};
            Object.keys(roles).forEach((role: string) => {
                if (!updatedColors[role]) {
                    updatedColors[role] = defaultColor;
                }
            })
            setNodes(process?.nodes || [], processName)
            setRoleColors(updatedColors, processName)

            return { activeProcessName: processName }
        }),
        activeRole: initialRole,
        setActiveRole: (role) => set(() => ({ activeRole: role })),
        // setAllCanSeeStates: (name) => set(({allCanSeeStates}) => ({allCanSeeStates: {...allCanSeeStates, [name]: []}})),
        states: { ...StateList },
        setStates: (el) => set(({ states }) => {
            const newStateObj = {
                ...states,
                el
            }
            return { states: newStateObj }
        }),
        allEdges: {},
        setAllEdges: (el) => set(() => ({ allEdges: el })),
        roleColors: { ...initialColors },
        // setRoleColors: (el) => set(() => ({ roleColors: el })),
        setRoleColors: (colors, processName) => set(({ activeProcessName, processes, updateProcess }) => {
            const processNameToUse = processName || activeProcessName;
            const processIndex = processes.findIndex(p => p.ProcessName === processNameToUse);

            const process = { ...processes[processIndex], colors };

            updateProcess({ processIndex, process });

            return { roleColors: colors }
        }),
        roles: { ...RoleList },
        setRoles: (el) => set(() => ({ roles: el })),
        setNodes: (nodes, processName) => set(({ activeProcessName, processes, updateProcess }) => {
            const processNameToUse = processName || activeProcessName;
            const processIndex = processes.findIndex(p => p.ProcessName === processNameToUse);

            const process = { ...processes[processIndex], nodes };

            updateProcess({ processIndex, process });

            return { nodes }
        }),
        setEdges: (edges) => set(() => ({ edges })),
        processes: initialWorkflows,
        updateProcess: ({ processIndex, process }: { processIndex: number; process: WorkflowProcess }) => set(({ processes }) => {
            const updatedProcesses = processes.map((p, i) => i === processIndex ? process : p);

            return { processes: updatedProcesses };
        }),
        addProcess: (name: string) => set(({ processes }) => {
            const newProcess = {
                ProcessID: processes.length + 1,
                ProcessName: name,
                roles: [],
                nodes: [],
            }

            return { processes: processes.concat(newProcess) }
        }),
        deleteProcess: (processId) => set(({ processes }) => ({ processes: processes.filter(p => p.ProcessID !== processId) })),
        toggleRoleForProcess: (role) => set(({ processes, activeProcessName, roles: globalRoles }) => {
            const foundProcessIndex = processes.findIndex(process => process.ProcessName === activeProcessName);
            const updatedProcesses = [...processes]

            if (foundProcessIndex !== -1) {
                const updatedProcess = processes[foundProcessIndex];
                const { roles = [] } = updatedProcess
                const foundRole = roles.find(r => r?.RoleName === role);

                if (foundRole) {
                    updatedProcess.roles = roles.filter(r => r.RoleName !== role)
                } else {
                    const newRole = {
                        RoleID: globalRoles[role],
                        RoleName: role,
                        IsUniversal: 1,
                        isCluster: 0,
                    }

                    updatedProcess.roles = roles.concat(newRole);
                }
            }

            return { processes: updatedProcesses }
        }),
        filteredStates: (nodes) => (Object.keys(get().states).filter((state) => {
            return !nodes.some((n) => n?.data?.label === state);
        })),
        addNewStateItem: (name) => set(({ states }) => {
            const newId = Math.max(...Object.values(get().states)) + 1;
            const newStatesObj = {
                ...states,
                [name]: newId,
            };
            return { states: newStatesObj }
        })

    })
    // , {
    //     name: 'main-store',
    //     onRehydrateStorage: () => (state) => {
    //         state?.setHasHydrated(true)
    //     }
    // })
)


export default useMainStore;