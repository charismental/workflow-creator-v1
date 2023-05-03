// doing it this way for now to get around use of hook
import { defaultColors } from "data";
import { create } from "zustand";
// import { persist } from 'zustand/middleware';
import { devtools } from "zustand/middleware";
import {
  WorkflowConnection,
  WorkflowProcess,
  WorkflowRole,
  WorkflowState,
} from "./types";
import {
  Node,
  OnConnect,
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
import {
  nodeByState,
  stateByNode,
  transformNewConnectionToTransition,
} from "utils";

// const initialRole = "Intake-Specialist";
const initialRole = "system";

export interface MainState {
  globalLoading: boolean;
  activeRole: string;
  states: Array<WorkflowState>;
  processes: Array<WorkflowProcess>;
  allSelfConnectingEdges: { [roleName: string]: WorkflowConnection[] };
  roles: Array<WorkflowRole>;
  _hasHydrated: boolean;
  nodes: Node[];
  edges: Edge[];
  activeProcess: WorkflowProcess | null;
}

export interface MainActions {
  fetchAll: (env?: string) => Promise<any>;
  setActiveRole: (role: string) => void;
  addProcess: (processName: string) => void;
  updateProcess: (payload: {
    processIndex: number;
    process: WorkflowProcess;
  }) => void;
  deleteProcess: (processName: string) => void;
  setAllSelfConnectingEdges: (allSelfConnectingEdges: {
    [roleName: string]: WorkflowConnection[];
  }) => void;
  setRoles: (roles: Array<WorkflowRole>) => void;
  toggleRoleForProcess: (role: string) => void;
  filteredStates: (existingStates: WorkflowState[]) => string[];
  addNewStateItem: (name: string) => void;
  setHasHydrated: (state: boolean) => void;
  onNodesChange: OnNodesChange;
  onConnect: OnConnect;
  removeTransition: (payload: { source: string; target: string }) => void;
  setStatesForActiveProcess: (states: WorkflowState[]) => void;
  setActiveProcess: (processName: string) => void;
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
        set(
          { states, roles, processes, globalLoading: false },
          false,
          "fetchAll"
        );
        const activeProcessName = processes[0]?.ProcessName;
        get().setActiveProcess(activeProcessName);
      },
      globalLoading: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      nodes: [],
      edges: [],
      onNodesChange: (changes: NodeChange[]) => {
        const { activeProcess, activeRole } = get();
        if (activeProcess) {
          const activeRoleIndex = (activeProcess?.Roles || []).findIndex(
            ({ RoleName }) => RoleName === activeRole
          );
          const { Properties = {} } =
            activeProcess.Roles?.[activeRoleIndex] || {};

          const nodeColor =
            Properties?.color || defaultColors?.[activeRoleIndex];

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

        const foundRoleIndex = Roles.findIndex(
          ({ RoleName }) => RoleName === activeRole
        );

        if (foundRoleIndex !== -1 && activeProcess) {
          const { Transitions = [] } = Roles[foundRoleIndex];

          const newTransition = transformNewConnectionToTransition(
            connection,
            Transitions
          );

          const updatedTransitions = [
            ...Transitions,
            ...(newTransition ? [newTransition] : []),
          ];

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
      removeTransition: ({
        source,
        target,
      }: {
        source: string;
        target: string;
      }) => {
        const { activeRole, activeProcess } = get();

        const { Roles = [] } = activeProcess || {};

        const foundRoleIndex = Roles.findIndex(
          ({ RoleName }) => RoleName === activeRole
        );

        if (foundRoleIndex !== -1 && activeProcess) {
          const { Transitions = [] } = Roles[foundRoleIndex];

          const updatedTransitions = Transitions.filter(
            ({ FromStateName, ToStateName }) =>
              FromStateName !== source || ToStateName !== target
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
      setActiveProcess: (processName: string) =>
        set(
          ({ processes }) => {
            const process = processes.find(
              (p) => p.ProcessName === processName
            );

            return { activeProcess: process };
          },
          false,
          "setActiveProcess"
        ),
      activeRole: initialRole,
      setActiveRole: (role) =>
        set(() => ({ activeRole: role }), false, "setActiveRole"),
      states: [],
      allSelfConnectingEdges: {},
      setAllSelfConnectingEdges: (allSelfConnectingEdges) =>
        set(
          () => ({ allSelfConnectingEdges }),
          false,
          "setAllSelfConnectingEdges"
        ),
      roles: [],
      setRoles: (roles) => set(() => ({ roles }), false, "setRoles"),
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
            const updatedProcesses = processes.map((p, i) =>
              i === processIndex ? process : p
            );

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
      // fix
      toggleRoleForProcess: (role) =>
        set(
          ({ processes, activeProcess, roles: globalRoles }) => {
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
                const { RoleId } =
                  globalRoles.find((el) => el.RoleName === role) || {};
                const newRole = {
                  ...(RoleId && { RoleId }),
                  RoleName: role,
                  Transitions: [],
                };

                updatedProcess.Roles = Roles.concat(newRole);
              }
            }

            return { processes: updatedProcesses };
          },
          false,
          "toggleRoleForProcess"
        ),
      filteredStates: (existingStates) => {
        const { states } = get();

        return states
          .map((el) => el.StateName)
          .filter(
            (stateName: string) =>
              !existingStates.some((s) => s.StateName === stateName)
          );
      },
      // fix
      addNewStateItem: (name) =>
        set(
          ({ states }) => {
            const highestId = Math.max(...states.map((el) => el.StateId || 0));
            const newId = highestId + 1;
            const newStatesObj = {
              ...states,
              [name]: newId,
            };
            return { states: newStatesObj };
          },
          false,
          "addNewStateItem"
        ),
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
