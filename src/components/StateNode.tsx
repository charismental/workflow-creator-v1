import { Checkbox, makeStyles } from '@fluentui/react-components';
import { FunctionComponent } from "react";
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
    left: "85%",
  }
})

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

const StateNode: FunctionComponent<NodeProps> = ({
  id,
  isConnectable,
  data,
}): JSX.Element => {
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

  return (
      <div className="stateNode">
        <div
          className="stateNodeBody"
          style={{
            borderStyle: isTarget ? "dashed" : "solid",
            backgroundColor: isTarget ? "#ffcce3" : data?.color || "#ccd9f6",
          }}
        >
          <NodeResizer isVisible={true} minWidth={180} minHeight={100} />
          {!isTarget && (
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
      </div>
  );
};

export default StateNode;
