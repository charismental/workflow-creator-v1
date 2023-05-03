export interface WorkflowConnection {
    StateTransitionId?: number;
    FromStateId?: number;
    ToStateId?: number;
    ProcessId?: number;
    FromStateName: string;
    ToStateName: string;
}

export interface WorkflowState {
    StateId?: number;
    StateName: string;
    DisplayOrder?: number;
    Properties?: {
        x?: number;
        y?: number;
        h?: number;
        w?: number;
    };
    // tempChangeProps?: {
    //     [key: string]: any;
    // };
}

export interface WorkflowRole {
    RoleId?: number;
    ProcessId?: number;
    RoleName: string;
    Properties?: { color?: string };
    Transitions?: WorkflowConnection[];
}

export interface WorkflowProcess {
    ProcessID?: number;
    ProcessName: string;
    States?: Array<WorkflowState>;
    Roles?: Array<WorkflowRole>;
}
