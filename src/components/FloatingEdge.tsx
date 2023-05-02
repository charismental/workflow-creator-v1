import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
  EdgeProps,
  getStraightPath,
  useStore as useReactFlowStore,
  Position,
  Node,
} from 'reactflow';
import { getEdgeParams } from '../utils';
import { getSmartEdge } from '@tisoap/react-flow-smart-edge';

import useMainStore from 'store';
import { shallow } from 'zustand/shallow';
import { bezierResult, stepResult, straightResult } from 'data/edgeOptions';

const foreignObjectSize = 40;

const FloatingEdge: FunctionComponent<EdgeProps> = ({
  id,
  source,
  target,
  markerEnd,
  style,
}) => {

  const edgeType = useMainStore(
    (state) => state.edgeType,
    shallow
  );

  const removeTransition = useMainStore(
    (state) => state.removeTransition,
    shallow
  );

  const nodes = useMainStore(
    (state) => state.nodes,
    shallow
  );

  const [isHover, setIsHover] = useState<boolean | null>(null);


  //  updates node style, but resizes nodes, will revert manually resized nodes

  // const updateNodeStyle = useCallback(() => {
  //   const filteredSourceNode = nodes.find((node) => node.id === sourceNode?.id);
  //   const filteredTargetNode = nodes.find((node) => node.id === targetNode?.id);
  //   const shadow = isHover ? "" : '0 0 4px 4px #0ff'

  //   setNodes(nodes.map((node: Node) =>
  //     node.id === filteredSourceNode?.id || node.id === filteredTargetNode?.id
  //       ? { ...node, style: { ...(node?.style || {}), boxShadow: shadow } }
  //       : node
  //   ), activeProcess?.ProcessName)

  // }, [nodes, activeProcess?.ProcessName])



  // does not resize nodes, but does not update node style, will revert manually resized nodes

  // const updateNodeStyle = useCallback(() => {
  //   const filteredSourceNode = nodes.find((node) => node.id === sourceNode?.id);
  //   const filteredTargetNode = nodes.find((node) => node.id === targetNode?.id);
  //   const shadow = isHover ? '' : '0 0 4px 4px #0ff';
  //   const processIndex = processes.findIndex(
  //     (p) => p.ProcessName === activeProcess
  //   );
  //   setNodes(
  //     processes[processIndex].nodes ||
  //       nodes?.map((node: Node) => {
  //         return node.id === filteredSourceNode?.id ||
  //           node.id === filteredTargetNode?.id
  //           ? { ...node, style: { boxShadow: shadow } }
  //           : node;
  //       })
  //   );
  // }, []);

  // useEffect(() => {
  //   if (isHover !== null) updateNodeStyle()
  // }, [isHover])

  // const handleMouseOver = () => {

  //   updateNodeStyle();
  // };

  // const handleMouseLeave = () => {

  //   updateNodeStyle()
  // };

  const onEdgeClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    id: string
  ) => {
    event.stopPropagation();
    removeTransition({ source, target })
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
      edgeType === 'Straight'
        ? straightResult
        : edgeType === 'Bezier'
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
        className="edge_path"
        d={edgeType === 'Straight' ? edgePath : svgPathString}
        markerEnd={markerEnd}
        // style={style}
        stroke={isHover ? '#0ff' : 'black'}
      />
      <foreignObject
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={
          (edgeType === 'Straight' ? labelX : edgeCenterX) -
          foreignObjectSize / 2
        }
        y={
          (edgeType === 'Straight' ? labelY : edgeCenterY) -
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
