import { Controls, ControlButton } from "reactflow";
import { FC } from "react";
import { ClearOutlined, ReloadOutlined } from "@ant-design/icons";
import useMainStore from "store";

const CustomControls: FC = () => {
  const clearStorage = useMainStore.persist.clearStorage;
  const rehydrateState = useMainStore.persist.rehydrate;

  return (
    <Controls>
      <ControlButton onClick={() => clearStorage()} title="Clear State">
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
