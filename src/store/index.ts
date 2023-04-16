// doing it this way for now to get around use of hook
import { RoleList, StateList, initialColors } from "data";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuProps } from "antd";
import { WorkflowConnection, WorkflowProcess } from "./types";
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

import initialWorkflows from "data/seed";

const initialProcessName = "LBHA v2";
const initialRole = "Intake-Specialist";
const defaultColor = "#d4d4d4";
export const initialNodes =
  initialWorkflows.find(({ ProcessName }) => ProcessName === initialProcessName)
    ?.nodes || [];

export interface MainState {
  activeProcessName: string;
  activeRole: string;
  states: { [key: string]: number };
  processes: Array<WorkflowProcess>;
  allEdges: any;
  allSelfConnectingEdges: { [roleName: string]: WorkflowConnection[] };
  roleColors: { [key: string]: string };
  roles: { [key: string]: number };
  nodes: Node[];
  edges: Edge[];
  edgeType: string;
  contextMenuItems: MenuProps["items"];
  colorTheme: boolean;
}

export interface MainActions {
  setActiveProcessName: (processName: string) => void;
  setActiveRole: (role: string) => void;
  setStates: (el: any) => void;
  addProcess: (processName: string) => void;
  updateProcess: (payload: {
    processIndex: number;
    process: WorkflowProcess;
  }) => void;
  deleteProcess: (processId: number) => void;
  setAllEdges: (
    allEdges: { [roleName: string]: Edge[] },
    processName?: string
  ) => void;
  setAllSelfConnectingEdges: (allSelfConnectingEdges: {
    [roleName: string]: WorkflowConnection[];
  }) => void;
  setRoleColors: (el: { [key: string]: string }, processName?: string) => void;
  setRoles: (el: { [key: string]: number }) => void;
  setNodes: (nodes: Node[], processName?: string) => void;
  setEdges: (edges: Edge[]) => void;
  toggleRoleForProcess: (role: string) => void;
  filteredStates: (nodes: Node[]) => string[];
  addNewStateItem: (name: string) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdgeType: (el: string) => void;
  setMenuItems: (items: MenuProps["items"]) => void;
  setColorScheme: () => void;
}

const useMainStore = create<MainState & MainActions>()(
  persist(
    (set, get) => ({
      colorTheme: true,
      setColorScheme: () => set({ colorTheme: !get().colorTheme }),
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
      contextMenuItems: [],
      setMenuItems: (items) => set({ contextMenuItems: items }),
      activeProcessName: initialProcessName,
      setActiveProcessName: (processName) =>
        set(({ processes, setNodes, setRoleColors, roles, setEdges }) => {
          const process = processes.find((p) => p.ProcessName === processName);
          const updatedColors: any = { ...(process?.colors || initialColors) };
          Object.keys(roles).forEach((role: string) => {
            if (!updatedColors[role]) {
              updatedColors[role] = defaultColor;
            }
          });
          setNodes(process?.nodes || [], processName);
          setRoleColors(updatedColors, processName);

          return { activeProcessName: processName };
        }),
      activeRole: initialRole,
      setActiveRole: (role) => set(() => ({ activeRole: role })),
      states: { ...StateList },
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
        set(({ activeProcessName, processes, updateProcess, activeRole }) => {
          const processIndex = processes.findIndex(
            (p) => p.ProcessName === activeProcessName
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
      roleColors: { ...initialColors },
      // setRoleColors: (el) => set(() => ({ roleColors: el })),
      setRoleColors: (colors, processName) =>
        set(({ activeProcessName, processes, updateProcess }) => {
          const processNameToUse = processName || activeProcessName;
          const processIndex = processes.findIndex(
            (p) => p.ProcessName === processNameToUse
          );

          const process = { ...processes[processIndex], colors };

          updateProcess({ processIndex, process });

          return { roleColors: colors };
        }),
      roles: { ...RoleList },
      setRoles: (el) => set(() => ({ roles: el })),
      setNodes: (nodes, processName) =>
        set(({ activeProcessName, processes, updateProcess }) => {
          const processNameToUse = processName || activeProcessName;
          const processIndex = processes.findIndex(
            (p) => p.ProcessName === processNameToUse
          );

          const process = { ...processes[processIndex], nodes };

          updateProcess({ processIndex, process });

          return { nodes };
        }),
      setEdges: (edges) => set(() => ({ edges })),
      processes: initialWorkflows,
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
            ProcessID: processes.length + 1,
            ProcessName: name,
            roles: [],
            nodes: [],
          };

          return { processes: processes.concat(newProcess) };
        }),
      deleteProcess: (processId) =>
        set(({ processes }) => ({
          processes: processes.filter((p) => p.ProcessID !== processId),
        })),
      toggleRoleForProcess: (role) =>
        set(({ processes, activeProcessName, roles: globalRoles }) => {
          const foundProcessIndex = processes.findIndex(
            (process) => process.ProcessName === activeProcessName
          );
          const updatedProcesses = [...processes];

          if (foundProcessIndex !== -1) {
            const updatedProcess = processes[foundProcessIndex];
            const { roles = [] } = updatedProcess;
            const foundRole = roles.find((r) => r?.RoleName === role);

            if (foundRole) {
              updatedProcess.roles = roles.filter((r) => r.RoleName !== role);
            } else {
              const newRole = {
                RoleID: globalRoles[role],
                RoleName: role,
                IsUniversal: 1,
                isCluster: 0,
              };

              updatedProcess.roles = roles.concat(newRole);
            }
          }

          return { processes: updatedProcesses };
        }),
      filteredStates: (nodes) =>
        Object.keys(get().states).filter((state) => {
          return !nodes.some((n) => n?.data?.label === state);
        }),
      addNewStateItem: (name) =>
        set(({ states }) => {
          const newId = Math.max(...Object.values(get().states)) + 1;
          const newStatesObj = {
            ...states,
            [name]: newId,
          };
          return { states: newStatesObj };
        }),
      edgeType: "Straight",
      setEdgeType: (el: string) => set({ edgeType: el }),
    }),
    {
      name: "main-store",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            throw new Error(
              `Error Hydrating State: ${JSON.stringify(error, null, 2)}`
            );
          } else {
            console.log("State Hydrated");
          }
        };
      },
    }
  )
);

export default useMainStore;
