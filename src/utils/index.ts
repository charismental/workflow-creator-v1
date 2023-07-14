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
} from "../types"

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
export function getEdgeParams(source: any, target: any) {
	const sourceIntersectionPoint = getNodeIntersection(source, target);
	const targetIntersectionPoint = getNodeIntersection(target, source);

	const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
	const targetPos = getEdgePosition(target, targetIntersectionPoint);

	return {
		sx: sourceIntersectionPoint.x,
		sy: sourceIntersectionPoint.y,
		tx: targetIntersectionPoint.x,
		ty: targetIntersectionPoint.y,
		sourcePos,
		targetPos,
	};
}

export function transformTransitionsToEdges(
	Transitions: WorkFlowTransition[],
	idPrefix: string = ""
): Edge[] {
	const mapper = (transition: WorkFlowTransition): Edge | any => {
		const { StateName: source, ToStateName: target, properties = {} } = transition;

		const { sourceHandle = null, targetHandle = null } = properties;

		return {
			style: {
				strokeWidth: 1.5,
				stroke: "black",
			},
			type: "floating",
			markerEnd: {
				type: "arrowclosed",
				color: "black",
			},
			sourceHandle,
			targetHandle,
			source: `${idPrefix}${source}`,
			target: `${idPrefix}${target}`,
			id: edgeIdByNodes({ source: `${idPrefix}${source}`, target: `${idPrefix}${target}` }),
		};
	};

	return Transitions.map(mapper);
}

// might get weird mama
export function transformNewConnectionToTransition(
	connection: Connection,
	existingTransitions: WorkFlowTransition[]
): WorkFlowTransition | null {
	const { source, target, sourceHandle, targetHandle } = connection;

	const foundTransition = existingTransitions.find(
		({ StateName, ToStateName }) => source === StateName && target === ToStateName
	);

	return (
		foundTransition ||
		(source && target
			? {
					StateID: null,
					ProcessID: null,
					RoleID: null,
					RoleName: null,
					ProcessName: null,
					InternalOnly: false,
					StateTransitionID: null,
					StateName: source,
					ToStateName: target,
					properties: { sourceHandle, targetHandle },
			  }
			: null)
	);
}

export function edgeIdByNodes({ source, target }: { source: string; target: string }): string {
	return `reactflow__edge-${source}-${target}`;
}

export function nodeByState({
	state,
	index,
	color,
	yOffset = 0,
	idPrefix = "",
	selfConnected = false,
}: {
	state: WorkflowState;
	index: number;
	allNodesLength?: number;
	color?: string;
	yOffset?: number;
	idPrefix?: string;
	selfConnected?: boolean;
}): Node {
	const { StateName, properties = {} } = state;
	const defaultW = 200;
	const defaultH = 30;
	const defaultXPadding = 50;
	const defaultYPadding = 40;
	const divisor = 5; // todo: dynamic value based on allNodesLength if provided

	const { x: propX, y: propY, w: propW, h: propH } = properties;

	const x = typeof propX === "number" ? propX : (index % divisor) * (defaultW + defaultXPadding);
	const y =
		typeof propY === "number" ? propY : Math.floor(index / divisor) * (defaultH + defaultYPadding);
	const width = propW || defaultW;
	const height = propH || defaultH;

	return {
		id: idPrefix + StateName,
		dragHandle: ".drag-handle",
		type: "custom",
		position: {
			x,
			y: y + yOffset,
		},
		data: {
			label: StateName,
			...(color && { color }),
			...(selfConnected && { selfConnected }),
			w: width,
			h: height,
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
	const { id: StateName, positionAbsolute = { x: 1, y: 1 }, width: w = 200, height: h = 30 } = node;
	const foundState = allStates.find((s) => s?.StateName === StateName) || {};
	let StateID: Nullable<number> = null;
	let RequiresRoleAssignment: NumberBoolean | any = 0;
	let RequiresUserAssignment: NumberBoolean | any = 0;

	if ("StateID" in foundState && typeof foundState.StateID === "number")
		StateID = foundState.StateID;
	if ("RequiresRoleAssignment" in foundState) RequiresRoleAssignment = foundState.RequiresRoleAssignment
	if ("RequiresUserAssignment" in foundState) RequiresUserAssignment = foundState.RequiresUserAssignment

	const properties = { ...positionAbsolute, h, w };

	return { ...foundState, StateID, StateName, properties, RequiresUserAssignment, RequiresRoleAssignment };
}

export function roleColor({
	RoleName,
	allRoles,
	index,
}: {
	RoleName: string;
	allRoles: WorkflowRole[];
	index?: any;
}): string {
	const availableDefaultColors = defaultColors;

	const roleIndex =
		typeof index === "number" ? index : allRoles.findIndex((r) => r.RoleName === RoleName);

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
	showAllConnections,
}: {
	process: WorkflowProcess | null;
	showAllRoles: boolean;
	showAllConnections: boolean;
	activeRole: string;
}): Node[] {
	const { States = [], Roles = [], ProcessName = "Process Name" } = process || {};
	const mappedStates = States.map(({ properties }) => properties || {});

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
		nodes.push(labelNode({ name: ProcessName, x: startingX, y: startingY - 80, w: totalSetWidth }));

		Roles.forEach(({ RoleName }, i) => {
			nodes.push(
				labelNode({ name: RoleName, x: -360, y: yOffset * i + (totalSetHeight / 2 - 20) })
			);

			[...States]
				.sort((a, b) => a?.DisplayOrder || 1 - (b?.DisplayOrder || 0))
				.forEach((state, index, arr) => {
					const selfConnected = stateIsSelfConnected({
						role: RoleName,
						StateID: state.StateName,
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
							color: roleColor({ RoleName: RoleName, allRoles: Roles }),
						})
					);
				});
		});
	} else {
		[...States]
			.sort((a, b) => a?.DisplayOrder || 1 - (b?.DisplayOrder || 0))
			.forEach((state, index, arr) =>
				nodes.push(
					nodeByState({
						state,
						index,
						allNodesLength: arr.length,
						color: roleColor({ RoleName: activeRole, allRoles: Roles }),
						...(showAllConnections && {
							selfConnected: stateIsSelfConnected({ StateID: state.StateName, process }),
						}),
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
}: {
	showAllRoles: boolean;
	roles: WorkflowRole[];
	activeRole: string;
	showAllConnections: boolean;
}): Edge[] {
	if (showAllRoles) {
		const allEdges: Edge[] = [];

		roles.forEach(({ Transitions = [] }, i) => {
			allEdges.push(...transformTransitionsToEdges(Transitions, String(i)));
		});

		return allEdges;
	} else if (showAllConnections) {
		const allTransitions: WorkFlowTransition[] = [];

		roles.forEach(({ Transitions = [] }) => {
			allTransitions.push(...Transitions);
		});

		return transformTransitionsToEdges(
			allTransitions.filter(
				({ StateName, ToStateName }, i) =>
					allTransitions.findIndex(
						(transtion) =>
							transtion.StateName === StateName && transtion.ToStateName === ToStateName
					) === i
			)
		);
	} else {
		const Transitions = roles?.find((r) => r.RoleName === activeRole)?.Transitions || [];

		return transformTransitionsToEdges(Transitions);
	}
}

export function stateIsSelfConnected({
	StateID,
	role,
	process,
}: {
	StateID: string;
	role?: string;
	process: WorkflowProcess | null;
}): boolean {
	const { Roles = [] } = process || {};
	if (!role) {
		const allTransitions: WorkFlowTransition[] = [];

		Roles.forEach(({ Transitions = [] }) => allTransitions.push(...Transitions));

		return allTransitions.some(({ StateName, ToStateName }) =>
			[StateName, ToStateName].every((el) => el === StateID)
		);
	}
	return !!Roles
		.find(({ RoleName }) => RoleName === role)
		?.Transitions?.find(({ StateName, ToStateName }) =>
			[StateName, ToStateName].every((el) => el === StateID)
		);
}
