import { Checkbox, makeStyles } from '@fluentui/react-components';
import { FunctionComponent, useState } from "react";
import {
  Handle,
  NodeProps,
  Position,
  getConnectedEdges,
  useReactFlow,
  useStore as useReactFlowStore,
  NodeResizer
} from "reactflow";

const useStyles = makeStyles({
  checkboxStyle: {
    position: "absolute",
    zIndex: 100,
    cursor: "pointer",
    width: "20px",
    height: "20px",
    right: "10px",
    top: "10px",
    transform: "translateY(-50%)",
  }
})

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

const StateNode: FunctionComponent<NodeProps> = ({
  id,
  isConnectable,
  data,
}): JSX.Element => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const style = useStyles();
  const { toggleCanSeeState, isCanSee = false } = data;

  const { getNode, getEdges, deleteElements } = useReactFlow();

  const connectionNodeId = useReactFlowStore(connectionNodeIdSelector);
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

  const minWidth = 200;
  const minHeight = 30;

  return (
    <div className="stateNodeBody" onMouseOver={() => setIsMouseOver(true)} onMouseOut={() => setIsMouseOver(false)} style={{
      minHeight,
      minWidth,
      borderStyle: isTarget ? "dashed" : "solid",
      backgroundColor: isTarget ? "#ffcce3" : data?.color || "#ccd9f6",
    }}>
      <NodeResizer isVisible={true} minWidth={200} minHeight={30} handleStyle={{ zIndex: 400 }} />
      {!isTarget && isMouseOver && (
        <>
          <Checkbox
            className={style.checkboxStyle}
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
  );
};

export default StateNode;
