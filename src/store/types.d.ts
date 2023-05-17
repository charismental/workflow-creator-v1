export type Nullable<T> = T | null;

export interface WorkflowConnection {
	stateTransitionId: Nullable<number>;
	fromStateId?: number;
	toStateId?: number;
	processId?: Nullable<number>;
	fromStateName: string;
	toStateName: string;
	properties?: {
		sourceHandle?: string | null;
		targetHandle?: string | null;
	};
}

export interface WorkflowState {
	processId?: Nullable<number>;
	stateId: Nullable<number>;
	stateName: string;
	displayOrder?: number;
	properties?: {
		x?: number;
		y?: number;
		h?: number;
		w?: number;
	};
}

interface NumberBooleanFields {
	isUniversal: NumberBoolean;
	isCluster: NumberBoolean;
}

export interface WorkflowRole {
	roleId: Nullable<number>;
	processId?: Nullable<number>;
	roleName: string;
	properties?: { color?: string };
	transitions?: WorkflowConnection[];
	isUniversal: NumberBoolean;
	isCluster: NumberBoolean;
}

export interface WorkflowProcess {
	ProcessID: Nullable<number>;
	processName: string;
	states?: Array<WorkflowState>;
	roles?: Array<WorkflowRole>;
}

export type NumberBoolean = 0 | 1;
