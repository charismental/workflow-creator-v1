import { RollbackOutlined } from '@ant-design/icons';
import { Checkbox } from "antd";
import { CSSProperties, FunctionComponent, useCallback, useState } from "react";

import {
  Handle,
  NodeProps,
  NodeResizer,
  Position,
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
  const [nodes, setNodes] = useMainStore((state) => [state.nodes, state.setNodes], shallow)
  const [allEdges, setAlledges] = useMainStore((state) => [state.allEdges, state.setAllEdges], shallow)
  const [allSelfConnectingEdges, setAllSelfConnectingEdges] = useMainStore((state) => [state.allSelfConnectingEdges, state.setAllSelfConnectingEdges], shallow)
  const { toggleSelfConnected, selfConnected = false } = data;

  const connectionNodeId = useReactFlowStore(connectionNodeIdSelector);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };

  const removeNode = useCallback(() => {
    const updatedNodes = nodes.filter(node => node.id !== id);

    const updatedEdges = { ...allEdges };
    const updatedAllSelfConnectingEdges = { ...allSelfConnectingEdges };

    Object.keys(updatedEdges).forEach((key: string) => {
      updatedEdges[key] = updatedEdges[key].filter(({ source, target }: { source: string; target: string }) => ![source, target].includes(id))
      updatedAllSelfConnectingEdges[key] = (updatedAllSelfConnectingEdges?.[key] || []).filter(({ source, target }: { source: string; target: string }) => ![source, target].includes(id))
    })

    setAllSelfConnectingEdges(updatedAllSelfConnectingEdges)
    setAlledges(updatedEdges);
    setNodes(updatedNodes);
  }, [allEdges, setAlledges, nodes, setNodes, allSelfConnectingEdges, setAllSelfConnectingEdges]);

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
      {selfConnected && <RollbackOutlined rotate={270} style={{ color: 'black', fontSize: '32px', position: 'absolute', top: '-28px', right: '12px' }} />}
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
            checked={selfConnected}
            onChange={() => toggleSelfConnected(id)}
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
