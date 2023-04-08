// doing it this way for now to get around use of hook
import { RoleList, StateList, initialColors } from 'data';
import { Node } from 'reactflow';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkflowProcess } from './types';

interface MainState {
    activeProcessName: string;
    activeRole: string;
    initialAllEdges: any;
    initialAllState: { [key: string]: Array<any> };
    states: { [key: string]: number };
    processes: Array<WorkflowProcess>;
    allEdges: any;
    roleColors: { [key: string]: string };
    roles: { [key: string]: number };
    _hasHydrated: boolean;
}

interface MainActions {
    setActiveProcessName: (processName: string) => void;
    setActiveRole: (role: string) => void;
    setState: (el: any) => void;
    addProcess: any;
    deleteProcess: (processId: number) => void;
    // setAllEdges: (el: { [key: string]: number }) => void;
    setAllEdges: (el: any) => void;
    setRoleColors: (el: { [key: string]: string }) => void;
    setRoles: (el: { [key: string]: number }) => void;
    toggleRoleForProcess: (role: string) => void;
    filteredStates: (nodes: Node[]) => string[];
    addNewStateItem: (name: string) => void;
    // setAllCanSeeStates: (name: string) => void;
    setHasHydrated: (state: boolean) => void;
}

const useMainStore = create<MainState & MainActions>()(
    persist(
    (set, get) => ({
        _hasHydrated: false,
        setHasHydrated: (state) => set(({_hasHydrated: state})),
        activeProcessName: 'New Workflow',
        setActiveProcessName: (processName) => set(() => ({ activeProcessName: processName })),
        activeRole: 'Intake-Specialist',
        setActiveRole: (role) => set(() => ({ activeRole: role })),
        initialAllEdges: { "Intake-Specialist": [], "Intake-Specialist Manager": [], "Caseworker": [], "Caseworker Manager": [], "Partner Final Reviewer": [], "Partner Reviewer": [], "Customer-Support": [] },
        initialAllState: { "Intake-Specialist": [], "Intake-Specialist Manager": [], "Caseworker": [], "Caseworker Manager": [], "Partner Final Reviewer": [], "Partner Reviewer": [], "Customer-Support": [] },
        // setAllCanSeeStates: (name) => set(({allCanSeeStates}) => ({allCanSeeStates: {...allCanSeeStates, [name]: []}})),
        states: { ...StateList },
        setState: (el) => set(({states}) => {
            const newStateObj = {
                ...states,
                el
            }
            return {states: newStateObj}
        }),
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
        addNewStateItem: (name) => set(({ states }) => {
            const newId = Math.max(...Object.values(get().states)) + 1;
            const newStatesObj = {
                ...states,
                [name]: newId,
            };
            return { states: newStatesObj }
        })

    }), {
        name: 'main-store',
        onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true)
        }
    }))


export default useMainStore;