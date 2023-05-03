import { defaultColors } from 'data';
import { Edge, MarkerType, Position, Node, Connection } from 'reactflow';
import { WorkflowConnection, WorkflowRole, WorkflowState } from 'store/types';

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

  nodes.push({ id: 'target', data: { label: 'Target' }, position: center });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    nodes.push({ id: `${i}`, data: { label: 'Source' }, position: { x, y } });

    edges.push({
      id: `edge-${i}`,
      target: 'target',
      source: `${i}`,
      type: 'floating',
      markerEnd: {
        type: MarkerType.Arrow,
      },
    });
  }

  return { nodes, edges };
}

export function transformTransitionsToEdges(transitions: WorkflowConnection[]): Edge[] {
  const mapper = (transition: WorkflowConnection): Edge | any => {
    const { FromStateName: source, ToStateName: target } = transition;

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
      source,
      target,
      id: edgeIdByNodes({ source, target }),
    }
  };

  return transitions.map(mapper);
}

// export function transformEdgesToTransitions(edges: Edge[], existingTransitions: WorkflowConnection[]): WorkflowConnection[] {
//   const mapper = (edge: Edge): WorkflowConnection => {
//     const { source, target } = edge;

//     const foundTransition = existingTransitions.find(({ FromStateName, ToStateName }) => source === FromStateName && target === ToStateName)

//     return {
//       ...foundTransition,
//       FromStateName: source,
//       ToStateName: target,
//     }
//   };

//   return edges.map(mapper);
// }

export function transformNewConnectionToTransition(connection: Connection, existingTransitions: WorkflowConnection[]): WorkflowConnection | null {
  const { source, target } = connection;

  const foundTransition = existingTransitions.find(({ FromStateName, ToStateName }) => source === FromStateName && target === ToStateName)

  return foundTransition || (source && target ? { FromStateName: source, ToStateName: target } : null);
}

export function edgeIdByNodes({ source, target }: { source: string; target: string }): string {
  return `reactflow__edge-${source}-${target}`;
}

export function nodeByState({ state, index, allNodesLength, color }: { state: WorkflowState, index: number, allNodesLength?: number, color?: string }): Node {
  const { StateName, Properties = {} } = state;
  const defaultW = 200;
  const defaultH = 30;
  const defaultXPadding = 50;
  const defaultYPadding = 40;
  const divisor = 5; // todo: dynamic value based on allNodesLength if provided

  const { x: propX, y: propY, w: width = defaultW, h: height = defaultH } = Properties;

  const x = propX || index % divisor * (defaultW + defaultXPadding);
  const y = propY || Math.floor(index / divisor) * (defaultH + defaultYPadding);

  return {
    id: StateName,
    dragHandle: '.drag-handle',
    type: 'custom',
    position: {
      x,
      y
    },
    data: {
      label: StateName,
      ...(color && { color }),
    },
    positionAbsolute: {
      x,
      y
    },
    width,
    height,
    dragging: false
  }
};

export function stateByNode({ node, allStates }: { node: Node | any; allStates: WorkflowState[] }): WorkflowState {
  const { id: StateName, positionAbsolute = { x: 1, y: 1 }, width: w = 200, height: h = 30 } = node;
  const foundState = allStates.find(s => s?.StateName === StateName) || {};
  const Properties = { ...positionAbsolute, h, w }

  return { ...foundState, StateName, Properties };
};

export function roleColor({ roleName, allRoles, index }: { roleName: string; allRoles: WorkflowRole[]; index?: any }): string {
  const availableDefaultColors = defaultColors;

  const roleIndex = index || allRoles.findIndex(({ RoleName }) => RoleName === roleName);

  if (roleIndex !== -1) {
    return allRoles[roleIndex]?.Properties?.color || availableDefaultColors[roleIndex % availableDefaultColors.length]
  }

  return '#d4d4d4';
};
