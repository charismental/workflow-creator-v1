import { Node } from "reactflow";
import {
	Nullable,
	NumberBoolean,
	WorkFlowTransition,
	WorkflowProcess,
	WorkflowRole,
	WorkflowState,
} from "../types";
import { defaultColors } from "data";

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
