import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  EdgeProps,
  getStraightPath,
  useStore as useReactFlowStore,
  Position,
} from "reactflow";
import { getEdgeParams, nodeByState } from "../utils";
import { getSmartEdge } from "@tisoap/react-flow-smart-edge";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
// import { bezierResult, stepResult, straightResult } from "data/edgeOptions";

const foreignObjectSize = 40;

const FloatingEdge: FunctionComponent<EdgeProps> = ({
  id,
  source,
  target,
  markerEnd,
  style,
}) => {
  const removeTransition = useMainStore(
    (state) => state.removeTransition,
    shallow
  );

  const states = useMainStore((state) => state.activeProcess?.States || []);

  const nodes = states.map((state, index) => nodeByState({ state, index, allNodesLength: states.length }));

  const [isHover, setIsHover] = useState<boolean | null>(null);

  // useEffect(() => {
  //   if (isHover !== null) updateNodeStyle()
  // }, [isHover])

  const onEdgeClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.stopPropagation();
    removeTransition({ source, target });
    setIsHover(false);
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
    targetY: ty,
  });

  return (
    <>
      <path
        id={id}
        className="edge_path"
        d={edgePath}
        markerEnd={markerEnd}
        // style={style}
        stroke={isHover ? "#0ff" : "black"}
      />
      <foreignObject
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
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
            onClick={onEdgeClick}
            icon={<CloseCircleOutlined />}
          />
        </div>
      </foreignObject>
    </>
  );
};

export default FloatingEdge;
