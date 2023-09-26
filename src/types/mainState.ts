import { ReactFlowInstance } from "reactflow";
import { Nullable, WorkflowCompany, WorkflowProcess, WorkflowRole, WorkflowSession, WorkflowState } from "types";

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