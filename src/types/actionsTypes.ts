import { OnNodesChange, OnConnect, ReactFlowInstance } from "reactflow";
import { MainState, Nullable, WorkflowProcess, WorkflowState } from ".";

export interface EdgeActions {
    setPathForEdge: (payload: { path: string; role: string; source: string; target: string; snapshot?: boolean }) => void;
    setSelectedEdge: (payload: Nullable<{ target: string; source: string; role?: string }>) => void;
    setEdgeType: (type: string) => void;
    onConnect: OnConnect;
    removeTransition: (payload: { source: string; target: string }) => void;
    setShowAllConnectedStates: () => void;
}

export interface NodeActions {
    setHoveredEdgeNodes: (nodes: string[]) => void;
    onNodesChange: OnNodesChange;
    updateStateProperties: (payload: {
        stateName: string;
        properties: { x?: number; y?: number; h?: number; w?: number };
    }) => void;
    setStatesForActiveProcess: (states: WorkflowState[], snapshot?: boolean) => void;
    removeState: (stateName: string) => void;
    updateStateProperty: (payload: { state: string; property: string; value: any }) => void;
    filteredStates: (existingStates: WorkflowState[]) => string[];
    addNewState: (name: string) => void;
    setContextMenuNodeId: (id: string | undefined) => void;
    setShowPortsAndCloseButtons: () => void;
}

export interface ReactFlowActions {
    setHasHydrated: (state: boolean) => void;
    saveStateSnapshot: () => void;
    revertToSnapshot: () => void;
    setReactFlowInstance: (instance: ReactFlowInstance) => void;
    setShowMinimap: () => void;
}

export interface RoleActions {
    setActiveRole: (role: string) => void;
    updateRoleProperty: (payload: { role: string; property: string; value: any }) => void;
    addNewRole: (role: string) => void;
    toggleShowAllRoles: () => void;
    setColorForActiveRole: (newColor: string) => void;
    toggleRoleForProcess: (role: string, color?: string) => void;
}

export interface CompanyActions {
    toggleCompanyForProcess: (company: string) => void;
    addNewCompany: (company: string) => void;
}

export interface ProcessActions {
    getAllSessions: (env?: string) => Promise<any>;
    deleteSession: (sessionId: string) => Promise<string>;
    cloneProcess: (processName: string, newName?: string) => Promise<boolean>;
    saveProcess: (newProcessName?: string) => Promise<boolean>;
    publishProcess: () => Promise<boolean>;
    addProcess: (processName: string) => void | any;
    setActiveProcess: (process: WorkflowProcess, role?: string) => void;
    setUnsavedChanges: (status: boolean) => void;
}

export interface MainActions extends EdgeActions, NodeActions, ReactFlowActions, RoleActions, CompanyActions, ProcessActions {
    setSnapshot: (snapshot: WorkflowProcess) => void;
    updateSnapshotIndex: (increment: 1 | -1) => void;
}

export type MainStore = MainActions & MainState