import { Button } from '@fluentui/react-components';
import { DismissCircle24Regular } from '@fluentui/react-icons';
import { FunctionComponent, useCallback } from "react";
import { EdgeProps, getStraightPath, useStore as useReactFlowStore } from "reactflow";
import { getEdgeParams } from "../utils";

const foreignObjectSize = 40;


const FloatingEdge: FunctionComponent<EdgeProps> = ({ id, source, target, markerEnd, style, data }) => {
  const onEdgeClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    event.stopPropagation();
    if (data?.setEdges)
      // not sure if need/want to type edges
      data.setEdges((edges: any) => edges.filter((ed: any) => ed.id !== id));
  };

  const sourceNode = useReactFlowStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );

  const targetNode = useReactFlowStore(
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
          <Button
            className="edgebutton"
            onClick={(event) => onEdgeClick(event, id)}
            icon={<DismissCircle24Regular />}
          />
        </div>
      </foreignObject>
    </>
  );
}

export default FloatingEdge;
