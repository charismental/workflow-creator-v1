import { RollbackOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import { CSSProperties, FunctionComponent, useCallback, useState } from "react";

import { Handle, NodeProps, NodeResizer, Position, useStore as useReactFlowStore } from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";

const checkboxStyle: CSSProperties = {
  position: "absolute",
  zIndex: 100,
  cursor: "pointer",
  width: "20px",
  height: "20px",
  right: "5px",
  top: "3px",
};

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

const StateNode: FunctionComponent<NodeProps> = ({
  id,
  isConnectable,
  data,
}): JSX.Element => {
  const removeState = useMainStore(
    (state) => state.removeState,
    shallow
  );

  const updateStateProperties = useMainStore(
    (state) => state.updateStateProperties,
    shallow
  );

  const onConnect = useMainStore(
    (state) => state.onConnect,
    shallow
  );

  const removeTransition = useMainStore(
    (state) => state.removeTransition,
    shallow
  );

  const selfConnected = useMainStore(
      (state) => !!(state.activeProcess?.Roles?.find(({ RoleName }) => RoleName === state.activeRole)?.Transitions?.find(({ FromStateName, ToStateName }) => [FromStateName, ToStateName].every(el => el === id))),
      shallow
    );

  const onResize = (_: any, payload: any) => {
    const { height: h, width: w, x, y } = payload;
    updateStateProperties({ stateName: data.label, properties: { x, y, h, w } });
  }

  const [isMouseOver, setIsMouseOver] = useState(false);

  const toggleSelfConnection = () => {
    const connectionPayload = { source: id, target: id };

    if (!selfConnected) {
      onConnect({ ...connectionPayload, sourceHandle: null, targetHandle: null });
    } else {
      removeTransition(connectionPayload);
    }
  };

  const connectionNodeId = useReactFlowStore(connectionNodeIdSelector);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };

  // do something here => initial width: 200, minWidth: 50?
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
        ...(data?.w && { width: data.w }),
        ...(data?.h && { height: data.h }),
      }}
    >
      {selfConnected && <RollbackOutlined rotate={270} style={{ color: 'black', fontSize: '32px', position: 'absolute', top: '-28px', right: '12px' }} />}
      <NodeResizer
        onResize={onResize}
        isVisible={isMouseOver}
        minWidth={minWidth}
        minHeight={minHeight}
        handleStyle={{ zIndex: 400 }}
      />
      {!isTarget && isMouseOver && (
        <>
          <Checkbox
            style={checkboxStyle}
            checked={selfConnected}
            onChange={toggleSelfConnection}
          />
          <div className="state-delete-button" onClick={() => removeState(data.label)} />
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
      {data?.label || "Unknown State"}
    </div>
  );
};

export default StateNode;
