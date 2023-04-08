// doing it this way for now to get around use of hook
import { RoleList, StateList, initialColors } from 'data';
import { Node } from 'reactflow';
import { create } from 'zustand';

function returnObjectMap(list: any, initial: any) {
    return Object.keys(list).forEach(el => {
        initial[el] = [];
    })
}

type BooleanNumber = 0 | 1;

export interface WorkflowConnection {
    source: string;
    target: string;
}

export interface WorkflowState {
    StateID: number;
    StateName: string;
    RequiresUserAssignment: BooleanNumber | number;
    RequiresRoleAssignment: BooleanNumber | number;
    DisplayOrder: number;
}

export interface WorkflowRole {
    RoleID: number;
    RoleName: string;
    IsUniversal: BooleanNumber | number;
    isCluster: BooleanNumber | number;
}

export interface WorkflowProcess {
    ProcessID: number;
    ProcessName: string;
    CatID?: number;
    states?: Array<WorkflowState>; //
    roles?: Array<WorkflowRole>;
    connections?: Array<WorkflowConnection>;
}

interface MainState {
    activeProcessName: string;
    activeRole: string;
    initialAllEdges: any;
    initialAllStates: {[key: string]: Array<any>};
    states: { [key: string]: number };
    processes: Array<WorkflowProcess>;
    allEdges: any;
    roleColors: { [key: string]: string };
    roles: { [key: string]: number };
}

interface MainActions {
    setActiveProcessName: (processName: string) => void;
    setActiveRole: (role: string) => void;
    setState: (el: { [key: string]: number }) => void;
    addProcess: any;
    deleteProcess: (processId: number) => void;
    setAllEdges: (el: { [key: string]: number }) => void;
    setRoleColors: (el: { [key: string]: string }) => void;
    setRoles: (el: { [key: string]: number }) => void;
    toggleRoleForProcess: (role: string) => void;
    filteredStates: (nodes: Node[]) => string[];
    findStateNameByNode: (nodeId: string, nodes: Node[]) => string | undefined;
    addNewStateItem: (name: string) => void;
}

const useMainStore = create<MainState & MainActions>()(
    (set, get) => ({
        activeProcessName: 'New Workflow',
        setActiveProcessName: (processName) => set(() => ({ activeProcessName: processName })),
        activeRole: 'Intake-Specialist',
        setActiveRole: (role) => set(() => ({ activeRole: role })),
        initialAllEdges: {},
        initialAllStates: {}, // cannot Object.keys() it....
        states: { ...StateList },
        setState: (el) => set(() => ({ states: el })),
        allEdges: [],
        setAllEdges: (el) => set(() => ({ allEdges: el })),
        roleColors: { ...initialColors },
        setRoleColors: (el) => set(() => ({ roleColors: el })),
        roles: { ...RoleList },
        setRoles: (el) => set(() => ({ roles: el })),
        processes: [{ ProcessID: 2373, ProcessName: 'New Workflow', roles: [] }, { ProcessID: 2374, ProcessName: 'New Workflow 2', roles: [] }],
        addProcess: ({ name }: any) => set(({ processes }) => {
            const newProcess = {
                ProcessID: processes.length + 1,
                ProcessName: name,
                roles: [],
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
        findStateNameByNode: (nodeId, nodes) => {
            const foundNode = nodes.find((node) => node.id === nodeId);
      
            return foundNode?.data?.label;
        },
        addNewStateItem: (name) => set(({states}) => {
            const newId = Math.max(...Object.values(get().states)) + 1;
            const newStatesObj = {
                ...states,
                [name]: newId,
              };
            return {states: newStatesObj}
        })

    }))


export default useMainStore;