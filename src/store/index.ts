// doing it this way for now to get around use of hook
import { defaultColors } from "data";
import { create } from "zustand";
// import { persist } from 'zustand/middleware';
import { WorkflowConnection, WorkflowProcess, WorkflowRole, WorkflowState } from "./types";
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

import mockFetchAll from "data/mockFetchAll";

const initialRole = "Intake-Specialist";

export interface MainState {
  globalLoading: boolean;
  activeRole: string;
  states: Array<WorkflowState>;
  processes: Array<WorkflowProcess>;
  allEdges: any;
  allSelfConnectingEdges: { [roleName: string]: WorkflowConnection[] };
  // roleColors: { [key: string]: string };
  roles: Array<WorkflowRole>;
  _hasHydrated: boolean;
  nodes: Node[];
  edges: Edge[];
  edgeType: string;
  activeProcess: WorkflowProcess | null;
}

export interface MainActions {
  fetchAll: (env?: string) => Promise<any>;
  setActiveRole: (role: string) => void;
  setStates: (el: any) => void;
  addProcess: (processName: string) => void;
  updateProcess: (payload: {
    processIndex: number;
    process: WorkflowProcess;
  }) => void;
  deleteProcess: (processName: string) => void;
  setAllEdges: (
    allEdges: { [roleName: string]: Edge[] },
    processName?: string
  ) => void;
  setAllSelfConnectingEdges: (allSelfConnectingEdges: {
    [roleName: string]: WorkflowConnection[];
  }) => void;
  // setRoleColors: (el: { [key: string]: string }, processName?: string) => void;
  setRoles: (roles: Array<WorkflowRole>) => void;
  setNodes: (nodes: Node[], processName?: string) => void;
  setEdges: (edges: Edge[]) => void;
  toggleRoleForProcess: (role: string) => void;
  filteredStates: (nodes: Node[]) => string[];
  addNewStateItem: (name: string) => void;
  setHasHydrated: (state: boolean) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdgeType: (el: string) => void;
  setActiveProcess: (processName: string) => void;
}

const useMainStore = create<MainState & MainActions>()(
  // persist(
  (set, get) => ({
    activeProcess: null,
    fetchAll: async (env?: string) => {
      set({ globalLoading: true });
      const waitTime = Math.random() * (2500 - 500) + 500;
      await new Promise(r => setTimeout(r, waitTime));

      const { processes = [], roles = [], states = [] }: any = mockFetchAll;
      set({ states, roles, processes, globalLoading: false });
      const activeProcessName = processes[0]?.ProcessName;
      get().setActiveProcess(activeProcessName)
    },
    globalLoading: false,
    _hasHydrated: false,
    setHasHydrated: (state) => set({ _hasHydrated: state }),
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
    setActiveProcess: (processName: string) => set(({ processes, setNodes, roles, setEdges }) => {
      const process = processes.find((p) => p.ProcessName === processName);
      // const updatedColors: any = { ...(process?.colors || initialColors) };
      // Object.keys(roles).forEach((role: string) => {
      // if (!updatedColors[role]) {
      // updatedColors[role] = defaultColor;
      // }
      // });
      // setNodes(process?.nodes || [], processName);
      // setRoleColors(updatedColors, processName);

      return { activeProcess: process };
    }),
    activeRole: initialRole,
    setActiveRole: (role) => set(() => ({ activeRole: role })),
    states: [],
    setStates: (el) =>
      set(({ states }) => {
        const newStateObj = {
          ...states,
          el,
        };
        return { states: newStateObj };
      }),
    allEdges: {},
    setAllEdges: (allEdges) =>
      set(({ activeProcess, processes, updateProcess, activeRole }) => {
        const processIndex = processes.findIndex(
          (p) => p.ProcessName === activeProcess?.ProcessName
        );

        // TODO: check against nodes for process, filter invalid connections
        const process = {
          ...processes[processIndex],
          connections: [...(allEdges?.[activeRole] || [])],
        };

        updateProcess({ processIndex, process });

        return { allEdges };
      }),
    allSelfConnectingEdges: {},
    setAllSelfConnectingEdges: (allSelfConnectingEdges) =>
      set(() => ({ allSelfConnectingEdges })),
    // roleColors: { ...initialColors },
    // setRoleColors: (colors, processName) =>
    //   set(({ activeProcessName, processes, updateProcess }) => {
    //     const processNameToUse = processName || activeProcessName;
    //     const processIndex = processes.findIndex(
    //       (p) => p.processName === processNameToUse
    //     );

    //     const process = { ...processes[processIndex], colors };

    //     updateProcess({ processIndex, process });

    //     return { roleColors: colors };
    //   }),
    roles: [],
    setRoles: (roles) => set(() => ({ roles })),
    setNodes: (nodes, processName) =>
      set(({ activeProcess, processes, updateProcess }) => {
        const processNameToUse = processName || activeProcess?.ProcessName;
        const processIndex = processes.findIndex(
          (p) => p.ProcessName === processNameToUse
        );

        const process = { ...processes[processIndex], nodes };

        updateProcess({ processIndex, process });

        return { nodes };
      }),
    setEdges: (edges) => set(() => ({ edges })),
    processes: [],
    updateProcess: ({
      processIndex,
      process,
    }: {
      processIndex: number;
      process: WorkflowProcess;
    }) =>
      set(({ processes }) => {
        const updatedProcesses = processes.map((p, i) =>
          i === processIndex ? process : p
        );

        return { processes: updatedProcesses };
      }),
    addProcess: (name: string) =>
      set(({ processes }) => {
        const newProcess = {
          // ProcessId: processes.length + 1,
          ProcessName: name,
          Roles: [],
          States: [],
        };

        return { processes: processes.concat(newProcess) };
      }),
      // fix
    deleteProcess: (processName) =>
      set(({ processes }) => ({
        processes: processes.filter((p) => p.ProcessName !== processName),
      })),
    toggleRoleForProcess: (role) =>
      set(({ processes, activeProcess, roles: globalRoles }) => {
        const foundProcessIndex = processes.findIndex(
          (process) => process.ProcessName === activeProcess?.ProcessName
        );

        const updatedProcesses = [...processes];

        if (foundProcessIndex !== -1) {
          const updatedProcess = processes[foundProcessIndex];
          const { Roles = [] } = updatedProcess;
          const foundRole = Roles.find((r) => r?.RoleName === role);

          if (foundRole) {
            updatedProcess.Roles = Roles.filter((r) => r.RoleName !== role);
          } else {
            const { RoleId } = globalRoles.find(el => el.RoleName === role) || {};
            const newRole = {
              ...(RoleId && { RoleId }),
              RoleName: role,
              Transitions: [],
            };

            updatedProcess.Roles = Roles.concat(newRole);
          }
        }

        return { processes: updatedProcesses };
      }),
    filteredStates: (nodes) => {
      const { states } = get();

      return states.map(el => el.StateName).filter((stateName: string) => !nodes.some((n) => n?.data?.label === stateName));
    },
    // fix
    addNewStateItem: (name) =>
      set(({ states }) => {
        const highestId = Math.max(...states.map(el => el.StateId || 0));
        const newId = highestId + 1;
        const newStatesObj = {
          ...states,
          [name]: newId,
        };
        return { states: newStatesObj };
      }),
    edgeType: "Straight",
    setEdgeType: (el: string) => set({ edgeType: el }),
  })
);

export default useMainStore;
