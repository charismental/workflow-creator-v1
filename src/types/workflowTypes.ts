import { Nullable, NumberBoolean } from "./";

export interface WorkflowSession {
	processId: Nullable<number>;
	processName: string;
	sessionId: string;
	dateCreated: Nullable<string>,
	dateUpdated: Nullable<string>,
	datePublished: Nullable<string>
}

export interface WorkflowProcess extends WorkflowSession {
	globals?: WorkflowGlobals;
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
	stateId: Nullable<number>;
	stateName: string;
	roleId: Nullable<number>;
	roleName: Nullable<string>;
	altStateId?: Nullable<number>;
	toStateName: string;
	internalOnly: boolean;
	properties?: {
		sourceHandle?: Nullable<string>;
		targetHandle?: Nullable<string>;
		points?: Nullable<string>;
	};
}

export interface WorkflowState {
	stateId: Nullable<number>;
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
	roleId: Nullable<number>;
	isCluster: NumberBoolean;
	isUniversal: NumberBoolean;
	roleName: string;
	transitions?: WorkFlowTransition[];
	properties?: { color?: string };
}

export interface WorkflowCompany {
	companyId: Nullable<number>;
	companyName: string;
	isInternal: NumberBoolean;
	isTrusted: boolean;
}
