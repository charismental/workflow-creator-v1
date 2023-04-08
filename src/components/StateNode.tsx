import { RollbackOutlined } from '@ant-design/icons';
import { Checkbox } from "antd";
import { CSSProperties, FunctionComponent, useCallback, useState } from "react";

import {
  Handle,
  NodeProps,
  NodeResizer,
  Position,
  getConnectedEdges,
  useReactFlow,
  useStore as useReactFlowStore,
} from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";

const checkboxStyle: CSSProperties = {
  position: "absolute",
  zIndex: 100,
  cursor: "pointer",
  width: "20px",
  height: "20px",
  right: "5px",
  top: "3px"
};

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

const StateNode: FunctionComponent<NodeProps> = ({
  id,
  isConnectable,
  data,
}): JSX.Element => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [allEdges, setAlledges] = useMainStore((state) => [state.allEdges, state.setAllEdges], shallow)
  const { toggleCanSeeState, isCanSee = false } = data;

  const { getNode, getEdges, deleteElements } = useReactFlow();

  const connectionNodeId = useReactFlowStore(connectionNodeIdSelector);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };

  const removeNode = useCallback(() => {
    const node = getNode(id);

    if (!node) return;

    const edges = getEdges();

    const connectedEdges = getConnectedEdges([node], edges);
    const removedNode = { nodes: [node], edges: connectedEdges }
    // TODO: should also delete edges/allEdges for this node with other roles

    // trying this...
    setAlledges(connectedEdges)
    
    deleteElements(removedNode);
  }, [allEdges, setAlledges]);

  const minWidth = 200;
  const minHeight = 30;

  return (
    <div
      className="stateNodeBody"
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
      style={{
        minHeight,
        minWidth,
        borderStyle: isTarget ? "dashed" : "solid",
        backgroundColor: isTarget ? "#ffcce3" : data?.color || "#ccd9f6",
      }}
    >
      {isCanSee && <RollbackOutlined rotate={270} style={{color: 'black', fontSize: '32px', position: 'absolute', top: '-28px', right: '12px' }} />}
      <NodeResizer
        isVisible
        minWidth={minWidth}
        minHeight={minHeight}
        handleStyle={{ zIndex: 400 }}
      />
      {!isTarget && isMouseOver && (
        <>
          <Checkbox
            style={checkboxStyle}
            checked={isCanSee}
            onChange={() => toggleCanSeeState(id)}
          />
          <div className="state-delete-button" onClick={removeNode} />
        </>
      )}

      <Handle
        className="targetHandle"
        style={{ zIndex: 2 }}
        position={Position.Top}
        type="source"
        isConnectable={isConnectable}
      />
      <Handle
        className="targetHandle"
        style={targetHandleStyle}
        position={Position.Bottom}
        type="target"
        isConnectable={isConnectable}
      />
      {data?.label || 'Unknown State'}
    </div>
  );
};

export default StateNode;
