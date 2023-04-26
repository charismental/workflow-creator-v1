import { CloseCircleOutlined, CloseCircleFilled } from "@ant-design/icons";
import { getSmartEdge } from "@tisoap/react-flow-smart-edge";
import { Button } from "antd";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  EdgeProps,
  Node,
  Position,
  getStraightPath,
  useStore as useReactFlowStore,
} from "reactflow";
import { getEdgeParams } from "../utils";

import { bezierResult, stepResult, straightResult } from "data/edgeOptions";
import useMainStore from "store";
import { shallow } from "zustand/shallow";

const foreignObjectSize = 40;

const FloatingEdge: FunctionComponent<EdgeProps> = ({
  id,
  source,
  target,
  markerEnd,
  style,
}) => {
  const [edges, setEdges] = useMainStore(
    (state) => [state.edges, state.setEdges],
    shallow
  );

  const [edgeType, nodes, setNodes, activeProcess, lightMode] = useMainStore(
    (state) => [
      state.edgeType,
      state.nodes,
      state.setNodes,
      state.activeProcessName,
      state.lightMode,
    ],
    shallow
  );
  const [isHover, setIsHover] = useState<boolean | null>(null);

  const updateNodeStyle = useCallback(() => {
    const filteredSourceNode = nodes.find((node) => node.id === sourceNode?.id);
    const filteredTargetNode = nodes.find((node) => node.id === targetNode?.id);
    const shadow = isHover ? "" : "0 0 4px 4px #0ff";

    setNodes(
      nodes.map((node: Node) =>
        node.id === filteredSourceNode?.id || node.id === filteredTargetNode?.id
          ? { ...node, style: { ...(node?.style || {}), boxShadow: shadow } }
          : node
      ),
      activeProcess
    );
  }, [nodes, activeProcess]);

  useEffect(() => {
    if (isHover !== null) updateNodeStyle();
  }, [isHover]);

  const onEdgeClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    id: string
  ) => {
    event.stopPropagation();
    const filtered = edges.filter((ed: any) => ed.id !== id);
    setEdges(filtered);
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

  const getSmartEdgeResponse = getSmartEdge({
    sourcePosition: sourceNode.sourcePosition || Position.Top,
    targetPosition: targetNode.sourcePosition || Position.Bottom,
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
    nodes: nodes,
    // Pass down options in the getSmartEdge object
    options:
      edgeType === "Straight"
        ? straightResult
        : edgeType === "Bezier"
        ? bezierResult
        : stepResult,
  });

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  // docs say do this ->   but doesn't seem useful...
  // if (getSmartEdgeResponse === null) {
  //   return <BezierEdge {...props} />;
  // }

  if (getSmartEdgeResponse === null) {
    return null;
  }

  const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;

  const strokeColor = useCallback(() => {
    let color = "black";
    if (isHover !== null && isHover) {
      color = "#0ff";
    }
    if (!lightMode) {
      color = "white";
    }
    return color;
  }, [lightMode, isHover]);

  return (
    <>
      <path
        id={id}
        className="edge_path"
        d={edgeType === "Straight" ? edgePath : svgPathString}
        markerEnd={markerEnd}
        // style={style}
        stroke={strokeColor()}
      />
      <foreignObject
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={
          (edgeType === "Straight" ? labelX : edgeCenterX) -
          foreignObjectSize / 2
        }
        y={
          (edgeType === "Straight" ? labelY : edgeCenterY) -
          foreignObjectSize / 2
        }
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <Button
            className="edgebutton"
            onClick={(event) => onEdgeClick(event, id)}
            icon={
              lightMode ? (
                <CloseCircleOutlined className="dumb-icon" />
              ) : (
                <CloseCircleFilled
                  className="dumb-icon"
                  style={{ color: "gray" }}
                />
              )
            }
          />
        </div>
      </foreignObject>
    </>
  );
};

export default FloatingEdge;
