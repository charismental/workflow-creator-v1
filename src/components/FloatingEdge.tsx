import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FunctionComponent, useCallback } from "react";
import { EdgeProps, getStraightPath, useStore as useReactFlowStore } from "reactflow";
import { getEdgeParams } from "../utils";

import useMainStore from "store";
import { shallow } from 'zustand/shallow';


const foreignObjectSize = 40;


const FloatingEdge: FunctionComponent<EdgeProps> = ({ id, source, target, markerEnd, style }) => {
  const [edges, setEdges] = useMainStore(
    (state) => [state.edges, state.setEdges],
    shallow
  );

  const onEdgeClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, id: string) => {
    event.stopPropagation();
    const filtered = edges.filter((ed: any) => ed.id !== id)
    setEdges(filtered);
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
            icon={<CloseCircleOutlined />}
          />
        </div>
      </foreignObject>
    </>
  );
}

export default FloatingEdge;
