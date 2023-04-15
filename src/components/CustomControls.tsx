import { Controls, ControlButton } from "reactflow";
import { FC } from "react";
import {
  ClearOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useMainStore from "store";
import { Modal } from "antd";
import { shallow } from "zustand/shallow";

const CustomControls: FC = () => {
  const clearStorage = useMainStore.persist.clearStorage;
  const rehydrateState = useMainStore.persist.rehydrate;
  const [setNodes, activeProcessName] = useMainStore(
    (state) => [state.setNodes, state.activeProcessName],
    shallow
  );

  const deleteStateWarning = () =>
    Modal.confirm({
      title: "Are you sure you want to reset the state?",
      icon: <ExclamationCircleFilled />,
      content: (
        <div>
          <p>This action cannot be undone!</p>
        </div>
      ),
      onCancel() {},
      onOk() {
        return new Promise((res, rej) => {
          setTimeout(() => {
            res((setNodes([], activeProcessName), clearStorage()));
          }, 2000);
        }).catch(() => console.log("error...."));
      },
      centered: true,
      okText: "I'm Sure",
    });

  return (
    <Controls>
      <ControlButton onClick={deleteStateWarning} title="Clear State">
        <ClearOutlined />
      </ControlButton>
      <ControlButton
        onClick={async () => await rehydrateState()}
        title="Rehydrate State"
      >
        <ReloadOutlined />
      </ControlButton>
    </Controls>
  );
};

export default CustomControls;
