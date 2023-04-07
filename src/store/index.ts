// doing it this way for now to get around use of hook
import { RoleList, StateList, initialColors } from 'data';
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
    RequiresUserAssignment: BooleanNumber;
    RequiresRoleAssignment: BooleanNumber;
    DisplayOrder: number;
}

export interface WorkflowRole {
    RoleID: number;
    RoleName: string;
    IsUniversal: BooleanNumber;
    isCluster: BooleanNumber;
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
    initialAllStates: any;
    states: { [key: string]: number };
    processes: Array<WorkflowProcess>;
    allEdges: any;
    allCanSeeStates: any;
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
    setAllCanSeeStates: (el: any) => void;
    setRoleColors: (el: { [key: string]: string }) => void;
    setRoles: (el: { [key: string]: number }) => void;
}

const useMainStore = create<MainState & MainActions>()(
    (set) => ({
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
        allCanSeeStates: {},
        setAllCanSeeStates: (el) => set(() => ({ allCanSeeStates: el })),
        roleColors: { ...initialColors },
        setRoleColors: (el) => set(() => ({ roleColors: el })),
        roles: { ...RoleList },
        setRoles: (el) => set(() => ({ roles: el })),
        processes: [{ ProcessID: 2373, ProcessName: 'New Workflow' }, { ProcessID: 2374, ProcessName: 'New Workflow 2' }],
        addProcess: ({ name }: any) => set(({ processes }) => {
            const newProcess = {
                ProcessID: processes.length + 1,
                ProcessName: name,
            }

            return { processes: processes.concat(newProcess) }
        }),
        deleteProcess: (processId) => set(({ processes }) => ({ processes: processes.filter(p => p.ProcessID !== processId) })),
    }))


export default useMainStore;