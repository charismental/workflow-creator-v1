export interface WorkflowConnection {
	stateTransitionId?: number;
	fromStateId?: number;
	toStateId?: number;
	processId?: number;
	fromStateName: string;
	toStateName: string;
	properties?: {
		sourceHandle?: string | null;
		targetHandle?: string | null;
	};
}

export interface WorkflowState {
	stateId?: number;
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

export interface WorkflowRole extends NumberBooleanFields {
	roleId?: number;
	processId?: number;
	roleName: string;
	properties?: { color?: string };
	transitions?: WorkflowConnection[];
}

export interface WorkflowProcess {
	ProcessID?: number;
	processName: string;
	states?: Array<WorkflowState>;
	roles?: Array<WorkflowRole>;
}

export type NumberBoolean = 0 | 1;
