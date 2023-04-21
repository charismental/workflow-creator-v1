import {
  ClearOutlined,
  ExclamationCircleFilled,
  SaveOutlined
} from "@ant-design/icons";
import { FC } from "react";
import { ControlButton, Controls } from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import ModalInstance from "./ModalInstance";

const CustomControls: FC = () => {
  const clearStorage = useMainStore.persist.clearStorage;
  const rehydrateState = useMainStore.persist.rehydrate;
  const [setAllEdges, setNodes, activeProcessName] = useMainStore(
    (state) => [state.setNodes, state.setAllEdges, state.activeProcessName],
    shallow
  );

  const deleteStateWarning = () => {
    const modalOptions = {
      title: "Are you sure you want to reset the state?",
      icon: <ExclamationCircleFilled />,
      onCancel() {},
      onOk() {
        return new Promise((res, rej) => {
          setTimeout(() => {
            res(
              // setAlledges works, setNodes throws render error i can't track down
              // (setNodes({}, activeProcessName),
              // setAllEdges([], activeProcessName),
              // doing document reload instead....
              (clearStorage(), location.reload())
            );
          }, 2000);
        }).catch(() => console.log("error...."));
      },
      centered: true,
      okText: "I'm Sure",
    };
    return ModalInstance({modalType: 'confirm', modalOptions})
  };

  return (
    <Controls >
      <ControlButton onClick={deleteStateWarning} title="Clear State">
        <ClearOutlined />
      </ControlButton>
      <ControlButton
        onClick={async () => await rehydrateState()}
        title="Save State"
      >
        <SaveOutlined />
      </ControlButton>
    </Controls>
  );
};

export default CustomControls;
