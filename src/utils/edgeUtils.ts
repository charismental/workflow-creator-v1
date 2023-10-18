import { Edge, Connection } from "reactflow";
import {
	Nullable,
	WorkFlowTransition,
	WorkflowRole,
	WorkflowState,
} from "../types";
import { pathFromPoints } from "./pointsHelpers";
import { all } from "axios";

export function edgeIdByNodes({ source, target, sourceHandle, targetHandle }: { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }): string {
	return `reactflow__edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
}

export function transformTransitionsToEdges({
	transitions,
	roleName,
	edgeType = 'straight',
	idPrefix = "",
	selectedEdge = null,
	setPathForEdge,
	showAllConnections = false,
	removeTransition,
	setHoveredEdgeNodes,
	showPortsAndCloseButtons,
	showAllRoles = false,
}: {
	showAllConnections?: boolean;
	// todo
	setPathForEdge?: (payload: any) => void;
	transitions: WorkFlowTransition[];
	roleName?: string;
	edgeType: string;
	idPrefix?: string;
	selectedEdge?: Nullable<{ source: string; target: string; role: string }>;
	removeTransition: any;
	setHoveredEdgeNodes: any;
	showPortsAndCloseButtons: boolean;
	showAllRoles?: boolean;
}): Edge[] {
	const mapper = (transition: WorkFlowTransition): Edge | any => {
		const { stateName: source, toStateName: target, properties = {} } = transition;

		const { sourceHandle = null, targetHandle = null, points = null } = properties || {};

		const edgeTypeMap: any = {
			straight: 'straightEdge',
			step: 'stepEdge',
			bezier: 'bezierEdge',
			smart: 'smartEdge',
		};

		const path = points ? pathFromPoints(points) : '';

		const type = edgeTypeMap[edgeType];

		return {
			style: {
				strokeWidth: 1.5,
				stroke: "black",
			},
			type,
			markerEnd: {
				type: "arrowclosed",
				color: "black",
			},
			selected: selectedEdge?.source === source && selectedEdge?.target === target,
			sourceHandle,
			targetHandle,
			source: `${idPrefix}${source}`,
			target: `${idPrefix}${target}`,
			data: {
				path,
				setPath: setPathForEdge,
				showAllConnections,
				setHoveredEdgeNodes,
				showPortsAndCloseButtons,
				removeTransition,
				showAllRoles,
				...(roleName && { role: roleName }),
				...(points && { points }),
			},
			id: edgeIdByNodes({ source: `${idPrefix}${source}`, target: `${idPrefix}${target}`, sourceHandle, targetHandle }),
		};
	};

	return Array.isArray(transitions) ? transitions.map(mapper) : [];
}

// could get weird
export function transformNewConnectionToTransition(
	{
		connection,
		existingTransitions,
		allStates,
		roleId,
		roleName,
	}: {
		connection: Connection,
		existingTransitions: WorkFlowTransition[],
		allStates: WorkflowState[],
		roleId: Nullable<number>,
		roleName: string,
	}
): WorkFlowTransition | null {
	const { source, target, sourceHandle, targetHandle } = connection;

	const foundTransition = existingTransitions.find(
		({ stateName, toStateName }) => source === stateName && target === toStateName
	);

	const { properties = {} } = foundTransition || {};
	const { sourceHandle: existingSourceHandle, targetHandle: existingTargetHandle } = properties || {};

	const isNewHandleForExistingConnection = foundTransition && (sourceHandle !== existingSourceHandle || targetHandle !== existingTargetHandle);

	const foundState = (name: string): WorkflowState | undefined => {
		return allStates.find((s) => s.stateName === name);
	}

	const foundFromState = foundState(source || '');
	const foundToState = foundState(target || '');

	return isNewHandleForExistingConnection ?
		{ ...foundTransition, properties: { sourceHandle, targetHandle } } :
		source && target ?
			{
				stateId: foundFromState?.stateId || null,
				altStateId: foundToState?.stateId || null,
				roleId,
				roleName,
				internalOnly: false,
				stateName: source,
				toStateName: target,
				properties: { sourceHandle, targetHandle },
			}
			: null;
}

export function computedEdges({
	roles,
	activeRole,
	showAllRoles,
	showAllConnections,
	edgeType = 'straight',
	selectedEdge,
	setPathForEdge,
	removeTransition,
	setHoveredEdgeNodes,
	showPortsAndCloseButtons = true
}: {
	// todo
	setPathForEdge: (payload: any) => void;
	showAllRoles: boolean;
	roles: WorkflowRole[];
	activeRole: string;
	showAllConnections: boolean;
	edgeType: string;
	selectedEdge: Nullable<{ source: string; target: string; role: string }>;
	removeTransition: any,
	setHoveredEdgeNodes: any,
	showPortsAndCloseButtons?: boolean;
}): Edge[] {
	if (showAllRoles) {
		const allEdges: Edge[] = [];

		// selectedEdge logic in transformTransitionsToEdges
		roles.forEach(({ transitions = [], roleName }, i) => {
			allEdges.push(...transformTransitionsToEdges({
				transitions,
				idPrefix: String(i),
				edgeType,
				roleName,
				selectedEdge: selectedEdge?.role === roleName ? selectedEdge : null,
				setPathForEdge,
				removeTransition,
				setHoveredEdgeNodes,
				showPortsAndCloseButtons,
				showAllRoles,
			}));
		});
		
		return allEdges;
	} else if (showAllConnections) {
		const allTransitions: WorkFlowTransition[] = [];

		roles.forEach(({ transitions = [] }) => {
			Array.isArray(transitions) && allTransitions.push(...transitions);
		});

		return transformTransitionsToEdges({
			edgeType,
			selectedEdge,
			showAllConnections,
			transitions: allTransitions.filter(
				({ stateName, toStateName }, i) =>
					allTransitions.findIndex(
						(transtion) =>
							transtion.stateName === stateName && transtion.toStateName === toStateName
					) === i
			),
			removeTransition,
			setHoveredEdgeNodes,
			showPortsAndCloseButtons,
		});
	} else {
		const transitions = roles?.find((r) => r.roleName === activeRole)?.transitions || [];

		return transformTransitionsToEdges({
			transitions,
			edgeType,
			roleName: activeRole,
			selectedEdge: selectedEdge?.role === activeRole ? selectedEdge : null,
			setPathForEdge,
			removeTransition,
			setHoveredEdgeNodes,
			showPortsAndCloseButtons,
		});
	}
}