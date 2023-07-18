import { ReactFlowInstance } from "reactflow";
import {
	WorkflowProcess,
	WorkflowSession,
	WorkflowState,
	WorkflowRole,
	WorkflowCompany,
} from "types";
import { create } from "zustand";
// import { devtools } from "zustand/middleware";

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
	sessions: WorkflowSession[];
	processes: WorkflowProcess[];
	states: WorkflowState[];
	roles: WorkflowRole[];
	companies: WorkflowCompany[];
	hoveredEdgeNodes: string[];
}

export const useMainState = create<MainState>()(() => ({
	sessions: [],
	hoveredEdgeNodes: [],
	contextMenuNodeId: undefined,
	activeProcess: null,
	globalLoading: false,
	_hasHydrated: false,
	states: [],
	roles: [],
	companies: [],
	edgeType: "straight",
	showAllRoles: false,
	showAllConnectedStates: false,
	activeRole: "",
	processes: [],
	reactFlowInstance: undefined,
	showMinimap: false,
}));
