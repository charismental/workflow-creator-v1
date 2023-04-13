import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { CSSProperties, FunctionComponent, useCallback, useState } from "react";
import {
  EdgeProps,
  getStraightPath,
  useStore as useReactFlowStore,
  Position,
  Node,
} from "reactflow";
import { getEdgeParams } from "../utils";
import { getSmartEdge } from "@tisoap/react-flow-smart-edge";

import useMainStore from "store";
import { shallow } from "zustand/shallow";
import { bezierResult, stepResult, straightResult } from "data/edgeOptions";

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

  const [edgeType, nodes, setNodes] = useMainStore(
    (state) => [state.edgeType, state.nodes, state.setNodes],
    shallow
  );
  const [isHover, setIsHover] = useState(false);

  const handleMouseOver = () => {
    setIsHover(true);
    const filteredSourceNode = nodes.find((node) => node.id === sourceNode?.id);
    const filteredTargetNode = nodes.find((node) => node.id === targetNode?.id);
    const updatedNode = nodes.map((node: Node) =>
      node.id === filteredSourceNode?.id || node.id === filteredTargetNode?.id
        ? { ...node, style: { boxShadow: "0 0 4px 4px #0ff" } }
        : node
    );
    setNodes(updatedNode);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
    const filteredSourceNode = nodes.find((node) => node.id === sourceNode?.id);
    const filteredTargetNode = nodes.find((node) => node.id === targetNode?.id);
    const updatedNode = nodes.map((node: Node) =>
      node.id === filteredSourceNode?.id || node.id === filteredTargetNode?.id
        ? { ...node, style: { boxShadow: "" } }
        : node
    );
    setNodes(updatedNode);
  };

  const onEdgeClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    id: string
  ) => {
    event.stopPropagation();
    const filtered = edges.filter((ed: any) => ed.id !== id);
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

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgeType === "Straight" ? edgePath : svgPathString}
        markerEnd={markerEnd}
        style={style}
        fill="red"
      />

      <foreignObject
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
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
            icon={<CloseCircleOutlined />}
          />
        </div>
      </foreignObject>
    </>
  );
};

export default FloatingEdge;
