import { FunctionComponent, useCallback } from "react";
import { EdgeProps, getStraightPath, useStore } from "reactflow";

import { getEdgeParams } from "../utils";

const foreignObjectSize = 40;

// interface FloatingEdgeProps {
//   id: string;
//   source: string;
//   target: string;
//   markerEnd: string;
//   style: CSSProperties;
//   data: any;
// }

const FloatingEdge: FunctionComponent<EdgeProps> = ({ id, source, target, markerEnd, style, data }) => {
  const onEdgeClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    event.stopPropagation();
    if (data?.setEdges)
      // not sure if need/want to type edges
      data.setEdges((edges:any) => edges.filter((ed:any) => ed.id !== id));
  };

  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );

  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            className="edgebutton"
            onClick={(event) => onEdgeClick(event, id)}
          >
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
}

export default FloatingEdge;

// import React from "react";
// import { getBezierPath } from "reactflow";

// export default function CustomEdge({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   data,
//   markerEnd
// }) {
//   const [edgePath] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition
//   });

//   return (
//     <>
//       <path
//         id={id}
//         style={style}
//         className="react-flow__edge-path"
//         d={edgePath}
//         markerEnd={markerEnd}
//       />
//     </>
//   );
// }
