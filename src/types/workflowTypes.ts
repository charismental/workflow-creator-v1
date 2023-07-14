import { Nullable, NumberBoolean } from "./genericTypes";

export interface WorkflowProcess {
	processID: Nullable<number>;
	processName: string;
	sessionID?: string;
	globals: WorkflowGlobals;
	states: Array<WorkflowState>;
	roles: Array<WorkflowRole>;
	companies: Array<WorkflowCompany>;
}

export interface WorkflowGlobals {
	states: Array<WorkflowState>;
	roles: Array<WorkflowRole>;
	companies: Array<WorkflowCompany>;
}

export interface WorkFlowTransition {
	stateTransitionID: Nullable<number>;
	stateID: Nullable<number>;
	stateName: string;
	roleID: Nullable<number>;
	roleName: Nullable<string>;
	altStateID?: Nullable<number>;
	toStateID?: Nullable<number>;
	toStateName: string;
	processID: Nullable<number>;
	processName: Nullable<string>;
	internalOnly: boolean;
	properties?: {
		sourceHandle?: string | null;
		targetHandle?: string | null;
	};
}

export interface WorkflowState {
	stateID: Nullable<number>;
	stateName: string;
	requiresRoleAssignment: NumberBoolean;
	requiresUserAssignment: NumberBoolean;
	displayOrder?: number;
	properties?: {
		x?: number;
		y?: number;
		h?: number;
		w?: number;
	};
}

export interface WorkflowRole {
	roleID: Nullable<number>;
	isCluster: NumberBoolean;
	isUniversal: NumberBoolean;
	roleName: string;
	transitions?: WorkFlowTransition[];
	properties?: { color?: string };
}

export interface WorkflowCompany {
	companyID: Nullable<number>;
	companyName: string;
	isInternal: NumberBoolean;
	isTrusted: boolean;
}
