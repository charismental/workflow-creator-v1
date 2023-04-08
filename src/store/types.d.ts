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

type BooleanNumber = 0 | 1;