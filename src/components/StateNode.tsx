import { FC } from 'react';
import {
  Handle,
  Position,
  getConnectedEdges,
  useReactFlow,
  useStore
} from "reactflow";

interface StateNodeProps {
  id: string;
  isConnectable: boolean;
  data: any;
}

const connectionNodeIdSelector = (state:any) => state.connectionNodeId;

const StateNode: FC<StateNodeProps> = ({ id, isConnectable, data }): JSX.Element => {

  const { toggleCanSeeState, isCanSee = false } = data;

  const { getNode, getEdges, deleteElements } = useReactFlow();

  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };

  const updatedLabel = isTarget
    ? "Drop here"
    : data?.label || "Drag to connect";

  const removeNode = () => {
    const node = getNode(id);

    if (!node) {
      return;
    }

    const edges = getEdges();

    const connectedEdges = getConnectedEdges([node], edges);

    deleteElements({ nodes: [node], edges: connectedEdges });
  };

  return (
    <div className="stateNode">
      <div
        className="stateNodeBody"
        style={{
          borderStyle: isTarget ? "dashed" : "solid",
          backgroundColor: isTarget ? "#ffcce3" : data?.color || "#ccd9f6"
        }}
      >
        {!isTarget && (
          <>
            <input
              style={{
                position: "absolute",
                zIndex: 100,
                cursor: "pointer",
                width: "20px",
                height: "20px",
                left: "85%"
              }}
              type="checkbox"
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
        {updatedLabel}
      </div>
    </div>
  );
}

export default StateNode;