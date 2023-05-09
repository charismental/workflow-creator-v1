import type { MenuProps } from "antd/es/menu";
import { defaultColors } from "data";
import { Edge, MarkerType, Position, Node, Connection } from 'reactflow';
import { WorkflowConnection, WorkflowProcess, WorkflowRole, WorkflowState } from 'store/types';

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

export function createNodesAndEdges() {
  const nodes = [];
  const edges = [];
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  nodes.push({ id: "target", data: { label: "Target" }, position: center });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    nodes.push({ id: `${i}`, data: { label: "Source" }, position: { x, y } });

    edges.push({
      id: `edge-${i}`,
      target: "target",
      source: `${i}`,
      type: "floating",
      markerEnd: {
        type: MarkerType.Arrow,
      },
    });
  }

  return { nodes, edges };
}

export function transformTransitionsToEdges(transitions: WorkflowConnection[], idPrefix: string = ''): Edge[] {
  const mapper = (transition: WorkflowConnection): Edge | any => {
    const { fromStateName: source, toStateName: target } = transition;

    return {
      style: {
        strokeWidth: 1.5,
        stroke: "black"
      },
      type: "floating",
      markerEnd: {
        type: "arrowclosed",
        color: "black"
      },
      sourceHandle: null,
      targetHandle: null,
      source: `${idPrefix}${source}`,
      target: `${idPrefix}${target}`,
      id: edgeIdByNodes({ source: `${idPrefix}${source}`, target: `${idPrefix}${target}` }),
    }
  };

  return transitions.map(mapper);
}

export function transformNewConnectionToTransition(
  connection: Connection,
  existingTransitions: WorkflowConnection[]
): WorkflowConnection | null {
  const { source, target } = connection;

  const foundTransition = existingTransitions.find(
    ({ fromStateName, toStateName }) => source === fromStateName && target === toStateName
  );

  return (
    foundTransition || (source && target ? { fromStateName: source, toStateName: target } : null)
  );
}

export function edgeIdByNodes({ source, target }: { source: string; target: string }): string {
  return `reactflow__edge-${source}-${target}`;
}

export function nodeByState({ state, index, color, yOffset = 0, idPrefix = '', selfConnected = false }: { state: WorkflowState, index: number, allNodesLength?: number, color?: string; yOffset?: number; idPrefix?: string; selfConnected?: boolean }): Node {
  const { stateName, properties = {} } = state;
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
    id: idPrefix + stateName,
    dragHandle: '.drag-handle',
    type: 'custom',
    position: {
      x,
      y: y + yOffset,
    },
    data: {
      label: stateName,
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
  }
};

export function labelNode({ name, x, y, w }: { name: string, x: number; y: number, w?: number }): Node {
  return {
    id: `${name}_label`,
    draggable: false,
    type: 'label',
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
  }
};

export function stateByNode({ node, allStates }: { node: Node | any; allStates: WorkflowState[] }): WorkflowState {
  const { id: stateName, positionAbsolute = { x: 1, y: 1 }, width: w = 200, height: h = 30 } = node;
  const foundState = allStates.find(s => s?.stateName === stateName) || {};
  const properties = { ...positionAbsolute, h, w }

  return { ...foundState, stateName, properties };
};

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
    return allRoles[roleIndex]?.properties?.color || availableDefaultColors[roleIndex % availableDefaultColors.length]
  }

  return '#d4d4d4';
};

type MenuItem = Required<MenuProps>["items"][number];

export const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
) => ({ key, icon, children, label, type });

export function computedNodes({ process, showAllRoles, activeRole, showAllConnections }: { process: WorkflowProcess | null; showAllRoles: boolean; showAllConnections: boolean; activeRole: string }): Node[] {
  const { states = [], roles = [], processName = 'Process Name' } = process || {};
  const mappedStates = states.map(({ properties }) => properties || {});

  const startingY = Math.min(...mappedStates.map(({ y = 0 }) => y));
  const startingX = Math.min(...mappedStates.map(({ x = 0 }) => x));

  const totalSetHeight = Math.max(...mappedStates.map(({ h = 30, y = 0 }) => {
    return h + y - startingY;
  }));

  const totalSetWidth = Math.max(...mappedStates.map(({ w = 30, x = 0 }) => {
    return w + x - startingX;
  }));

  const yOffset = totalSetHeight + 40;

  const nodes: Node[] = [];

  if (showAllRoles) {
    nodes.push(labelNode({ name: processName, x: startingX, y: -80, w: totalSetWidth }));

    roles.forEach(({ roleName }, i) => {
      nodes.push(labelNode({ name: roleName, x: -360, y: yOffset * i + (totalSetHeight / 2 - 20) }));

      [...states]
        .sort((a, b) => a?.displayOrder || 1 - (b?.displayOrder || 0))
        .forEach((state, index, arr) => {
          const selfConnected = stateIsSelfConnected({ role: roleName, stateId: state.stateName, process })

          nodes.push(nodeByState({ state, index, allNodesLength: arr.length, selfConnected, idPrefix: String(i), yOffset: yOffset * i, color: roleColor({ roleName: roleName, allRoles: roles }) }))
        })
    })
  } else {
    [...states]
      .sort((a, b) => a?.displayOrder || 1 - (b?.displayOrder || 0))
      .forEach((state, index, arr) =>
        nodes.push(nodeByState({ state, index, allNodesLength: arr.length, color: roleColor({ roleName: activeRole, allRoles: roles }), ...(showAllConnections && { selfConnected: stateIsSelfConnected({ stateId: state.stateName, process }) }) }))
      )

  }

  return nodes;
}

export function computedEdges({ roles, activeRole, showAllRoles, showAllConnections }: { showAllRoles: boolean; roles: WorkflowRole[]; activeRole: string; showAllConnections: boolean }): Edge[] {
  if (showAllRoles) {
    const allEdges: Edge[] = [];

    roles.forEach(({ transitions = [] }, i) => {
      allEdges.push(...transformTransitionsToEdges(transitions, String(i)))
    })

    return allEdges;
  } else if (showAllConnections) {
    const allTransitions: WorkflowConnection[] = [];

    roles.forEach(({ transitions = [] }) => {
      allTransitions.push(...transitions);
    })

    return transformTransitionsToEdges(allTransitions.filter(({ fromStateName, toStateName }, i) => allTransitions.findIndex(transtion => transtion.fromStateName === fromStateName && transtion.toStateName === toStateName) === i));
  } else {
    const transitions = roles?.find((r) => r.roleName === activeRole)?.transitions || [];

    return transformTransitionsToEdges(transitions);
  }
}

export function stateIsSelfConnected({ stateId, role, process }: { stateId: string; role?: string; process: WorkflowProcess | null }): boolean {
  const { roles = [] } = process || {};
  if (!role) {
    const allTransitions: WorkflowConnection[] = [];

    roles.forEach(({ transitions = [] }) => allTransitions.push(...transitions));

    return allTransitions.some(({ fromStateName, toStateName }) => [fromStateName, toStateName].every(el => el === stateId));
  }
  return !!roles.find(({ roleName }) => roleName === role)?.transitions?.find(({ fromStateName, toStateName }) => [fromStateName, toStateName].every(el => el === stateId));
}
