import { Nullable, NumberBoolean } from "./genericTypes";

export interface WorkflowProcess {
	ProcessID: Nullable<number>;
	ProcessName: string;
	SessionID?: string;
	Globals: WorkflowGlobals;
	States: Array<WorkflowState>;
	Roles: Array<WorkflowRole>;
	Companies: Array<WorkflowCompany>;
}

export interface WorkflowGlobals {
	States: Array<WorkflowState>;
	Roles: Array<WorkflowRole>;
	Companies: Array<WorkflowCompany>;
}

export interface WorkFlowTransition {
	StateTransitionID: Nullable<number>;
	StateID: Nullable<number>;
	StateName: string;
	RoleID: Nullable<number>;
	RoleName: Nullable<string>;
	AltStateID?: Nullable<number>;
	ToStateID?: Nullable<number>;
	ToStateName: string;
	ProcessID: Nullable<number>;
	ProcessName: Nullable<string>;
	InternalOnly: boolean;
	properties?: {
		sourceHandle?: string | null;
		targetHandle?: string | null;
	};
}

export interface WorkflowState {
	StateID: Nullable<number>;
	StateName: string;
	RequiresRoleAssignment: NumberBoolean;
	RequiresUserAssignment: NumberBoolean;
	DisplayOrder?: number;
	properties?: {
		x?: number;
		y?: number;
		h?: number;
		w?: number;
	};
}

export interface WorkflowRole {
	RoleID: Nullable<number>;
	IsCluster: NumberBoolean;
	IsUniversal: NumberBoolean;
	RoleName: string;
	Transitions?: WorkFlowTransition[];
	properties?: { color?: string };
}

export interface WorkflowCompany {
	CompanyID: Nullable<number>;
	CompanyName: string;
	isInternal: NumberBoolean;
	IsTrusted: boolean;
}
