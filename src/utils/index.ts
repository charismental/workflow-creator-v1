import type { MenuProps } from "antd/es/menu";
import { defaultColors } from "data";
import { Edge, Position, Node, Connection } from "reactflow";
import {
	Nullable,
	NumberBoolean,
	WorkFlowTransition,
	WorkflowProcess,
	WorkflowRole,
	WorkflowState,
} from "../types";
import { pathFromPoints } from "./pointsHelpers";
export * from "./helperLine";
export * from "./simpleSVGPath";
export * from "./pointsHelpers";
export * from "./editEdgeHelpers";

interface IntersectionNodeType {
	width: any;
	height: any;
	positionAbsolute: any;
}

interface TargetNodeType {
	positionAbsolute: any;
}

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: IntersectionNodeType, targetNode: TargetNodeType) {
	// https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
	const {
		width: intersectionNodeWidth,
		height: intersectionNodeHeight,
		positionAbsolute: intersectionNodePosition,
	} = intersectionNode;
	const targetPosition = targetNode.positionAbsolute;

	const w = intersectionNodeWidth / 2;
	const h = intersectionNodeHeight / 2;

	const x2 = intersectionNodePosition.x + w;
	const y2 = intersectionNodePosition.y + h;
	const x1 = targetPosition.x + w;
	const y1 = targetPosition.y + h;

	const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
	const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
	const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
	const xx3 = a * xx1;
	const yy3 = a * yy1;
	const x = w * (xx3 + yy3) + x2;
	const y = h * (-xx3 + yy3) + y2;

	return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: any, intersectionPoint: any) {
	const n = { ...node.positionAbsolute, ...node };
	const nx = Math.round(n.x);
	const ny = Math.round(n.y);
	const px = Math.round(intersectionPoint.x);
	const py = Math.round(intersectionPoint.y);

	if (px <= nx + 1) {
		return Position.Left;
	}
	if (px >= nx + n.width - 1) {
		return Position.Right;
	}
	if (py <= ny + 1) {
		return Position.Top;
	}
	if (py >= n.y + n.height - 1) {
		return Position.Bottom;
	}

	return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams({ source, target, sourceHandle, targetHandle }: { source: any; target: any; sourceHandle?: { x: number, y: number }; targetHandle?: { x: number; y: number } }) {
	const sourceIntersectionPoint = getNodeIntersection(source, target);
	const targetIntersectionPoint = getNodeIntersection(target, source);

	const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
	const targetPos = getEdgePosition(target, targetIntersectionPoint);

	return {
		sx: sourceHandle?.x || sourceIntersectionPoint.x,
		sy: sourceHandle?.y || sourceIntersectionPoint.y,
		tx: targetHandle?.x || targetIntersectionPoint.x,
		ty: targetHandle?.y || targetIntersectionPoint.y,
		sourcePos,
		targetPos,
	};
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
				...(roleName && { role: roleName }),
				...(points && { points }),

			},
			id: edgeIdByNodes({ source: `${idPrefix}${source}`, target: `${idPrefix}${target}`, sourceHandle, targetHandle }),
		};
	};

	return Array.isArray(transitions) ? transitions.map(mapper) : [];
}

// might get weird mama
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

export function edgeIdByNodes({ source, target, sourceHandle, targetHandle }: { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }): string {
	return `reactflow__edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
}

export function nodeByState({
	state,
	index,
	color,
	yOffset = 0,
	idPrefix = "",
	selfConnected = false,
	fullHandles = false,
	contextMenuNodeId,
	details,
	isEdgeHovered = false,
	showAllRoles = false,
	showPortsAndCloseButtons = false,
	updateStateProperties,
	removeState,
	updateStateProperty,
	removeTransition,
	onConnect,
}: {
	state: WorkflowState;
	index: number;
	allNodesLength?: number;
	color?: string;
	yOffset?: number;
	idPrefix?: string;
	selfConnected?: boolean;
	fullHandles?: boolean;
	contextMenuNodeId?: string;
	details?: {
		displayOrder: number;
		requiresRoleAssignment: NumberBoolean;
		requiresUserAssignment: NumberBoolean;
	};
	isEdgeHovered?: boolean;
	showAllRoles?: boolean;
	showPortsAndCloseButtons?: boolean;
	updateStateProperties?: any;
	removeState?: any;
	updateStateProperty?: any;
	removeTransition?: any;
	onConnect?: any;
}): Node {
	const { stateName, properties = {} } = state;
	const defaultW = 200;
	const defaultH = 30;
	const defaultXPadding = 50;
	const defaultYPadding = 40;
	const divisor = 5; // todo: dynamic value based on allNodesLength if provided

	const { x: propX, y: propY, w: propW, h: propH } = properties || {};

	const x = typeof propX === "number" ? propX : (index % divisor) * (defaultW + defaultXPadding);
	const y =
		typeof propY === "number" ? propY : Math.floor(index / divisor) * (defaultH + defaultYPadding);
	const width = propW || defaultW;
	const height = propH || defaultH;

	return {
		id: idPrefix + stateName,
		dragHandle: ".drag-handle",
		type: fullHandles ? "fullHandles" : "state",
		position: {
			x,
			y: y + yOffset,
		},
		data: {
			label: stateName,
			w: width,
			h: height,
			contextMenuNodeId,
			details,
			isEdgeHovered,
			showAllRoles,
			showPortsAndCloseButtons,
			selfConnected,
			color,
			updateStateProperties,
			removeState,
			updateStateProperty,
			removeTransition,
			onConnect,
		},
		positionAbsolute: {
			x,
			y: y + yOffset,
		},
		width,
		height,
	};
}

export function labelNode({
	name,
	x,
	y,
	w,
}: {
	name: string;
	x: number;
	y: number;
	w?: number;
}): Node {
	return {
		id: `${name}_label`,
		draggable: false,
		type: "label",
		position: {
			x,
			y,
		},
		data: {
			label: name,
			...(w && { w, centered: true }),
		},
		positionAbsolute: {
			x,
			y,
		},
		width: 300,
		height: 30,
	};
}

export function stateByNode({
	node,
	allStates,
}: {
	node: Node | any;
	allStates: WorkflowState[];
}): WorkflowState {
	const { id: stateName, positionAbsolute = { x: 1, y: 1 }, width: w = 200, height: h = 30 } = node;
	const foundState = allStates.find((s) => s?.stateName === stateName) || {};
	let stateId: Nullable<number> = null;
	let requiresRoleAssignment: NumberBoolean | any = 0;
	let requiresUserAssignment: NumberBoolean | any = 0;

	if ("stateId" in foundState && typeof foundState.stateId === "number")
		stateId = foundState.stateId;
	if ("requiresRoleAssignment" in foundState) requiresRoleAssignment = foundState.requiresRoleAssignment
	if ("requiresUserAssignment" in foundState) requiresUserAssignment = foundState.requiresUserAssignment

	const properties = { ...positionAbsolute, h, w };

	return { ...foundState, stateId, stateName, properties, requiresUserAssignment, requiresRoleAssignment };
}

export function roleColor({
	roleName,
	allRoles,
	index,
}: {
	roleName: string;
	allRoles: WorkflowRole[];
	index?: any;
}): string {
	const availableDefaultColors = defaultColors;

	const roleIndex =
		typeof index === "number" ? index : allRoles.findIndex((r) => r.roleName === roleName);

	if (roleIndex !== -1) {
		return (
			allRoles[roleIndex]?.properties?.color ||
			availableDefaultColors[roleIndex % availableDefaultColors.length]
		);
	}

	return "#d4d4d4";
}

type MenuItem = Required<MenuProps>["items"][number];

export const getItem = (
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
) => ({ key, icon, children, label, type });

export function computedNodes({
	process,
	showAllRoles,
	activeRole,
	fullHandles,
	contextMenuNodeId,
	hoveredEdgeNodes,
	showPortsAndCloseButtons,
	updateStateProperties,
	removeState,
	updateStateProperty,
	removeTransition,
	onConnect,
}: {
	process: WorkflowProcess | null;
	showAllRoles: boolean;
	activeRole: string;
	fullHandles: boolean;
	contextMenuNodeId?: string;
	hoveredEdgeNodes?: string[];
	showPortsAndCloseButtons: boolean;
	updateStateProperties?: any;
	removeState?: any;
	updateStateProperty?: any;
	removeTransition?: any;
	onConnect?: any;
}): Node[] {
	const { states = [], roles = [], processName = "Process Name" } = process || {};
	const mappedStates = states.map(({ properties }) => properties || {});

	const startingY = Math.min(...mappedStates.map(({ y = 0 }) => y));
	const startingX = Math.min(...mappedStates.map(({ x = 0 }) => x));

	const totalSetHeight = Math.max(
		...mappedStates.map(({ h = 30, y = 0 }) => {
			return h + y - startingY;
		})
	);

	const totalSetWidth = Math.max(
		...mappedStates.map(({ w = 30, x = 0 }) => {
			return w + x - startingX;
		})
	);

	const yOffset = totalSetHeight + 40;

	const nodes: Node[] = [];

	if (showAllRoles) {
		nodes.push(labelNode({ name: processName, x: startingX, y: startingY - 80, w: totalSetWidth }));

		roles.forEach(({ roleName }, i) => {
			nodes.push(
				labelNode({ name: roleName, x: -360, y: yOffset * i + (totalSetHeight / 2 - 20) })
			);

			[...states]
				.sort((a, b) => a?.displayOrder || 1 - (b?.displayOrder || 0))
				.forEach((state, index, arr) => {
					const selfConnected = stateIsSelfConnected({
						role: roleName,
						stateId: state.stateName,
						process,
					});

					nodes.push(
						nodeByState({
							state,
							index,
							allNodesLength: arr.length,
							selfConnected,
							idPrefix: String(i),
							yOffset: yOffset * i,
							color: roleColor({ roleName, allRoles: roles }),
							fullHandles,
							contextMenuNodeId,
							isEdgeHovered: (hoveredEdgeNodes || [])?.includes(state.stateName),
							showAllRoles,
							showPortsAndCloseButtons,
							details: {
								displayOrder: state.displayOrder || 0,
								requiresRoleAssignment: state.requiresRoleAssignment || 0,
								requiresUserAssignment: state.requiresUserAssignment || 0,
							},
							updateStateProperties,
							removeState,
							updateStateProperty,
							removeTransition,
							onConnect,
						})
					);
				});
		});
	} else {
		[...states]
			.sort((a, b) => a?.displayOrder || 1 - (b?.displayOrder || 0))
			.forEach((state, index, arr) =>
				nodes.push(
					nodeByState({
						state,
						index,
						allNodesLength: arr.length,
						color: roleColor({ roleName: activeRole, allRoles: roles }),
						fullHandles,
						selfConnected: stateIsSelfConnected({ stateId: state.stateName, process, role: activeRole }),
						contextMenuNodeId,
						isEdgeHovered: (hoveredEdgeNodes || [])?.includes(state.stateName),
						showAllRoles,
						showPortsAndCloseButtons,
						details: {
							displayOrder: state.displayOrder || 0,
							requiresRoleAssignment: state.requiresRoleAssignment || 0,
							requiresUserAssignment: state.requiresUserAssignment || 0,
						},
						updateStateProperties,
						removeState,
						updateStateProperty,
						removeTransition,
						onConnect,
					})
				)
			);
	}

	return nodes;
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

export function stateIsSelfConnected({
	stateId,
	role,
	process,
}: {
	stateId: string;
	role?: string;
	process: WorkflowProcess | null;
}): boolean {
	const { roles = [] } = process || {};

	if (!role) {
		const allTransitions: WorkFlowTransition[] = [];

		roles.forEach(({ transitions = [] }) => Array.isArray(transitions) && allTransitions.push(...transitions));

		return allTransitions.some(({ stateName, toStateName }) =>
			[stateName, toStateName].every((el) => el === stateId)
		);
	}
	return !!roles
		.find(({ roleName }) => roleName === role)
		?.transitions?.find(({ stateName, toStateName }) =>
			[stateName, toStateName].every((el) => el === stateId)
		);
}

export async function copyToClipboard(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		return { message: 'Copied to clipboard', success: true }
	} catch (err) {
		console.error('copyToClipboard: ', err);
		return { message: 'Unable to copy to clipboard', success: false }
	}
}
