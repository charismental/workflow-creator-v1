import { Controls, ControlButton } from "reactflow";
import { FC } from "react";
import { ClearOutlined } from "@ant-design/icons";
import useMainStore from "store";

const CustomControls: FC = () => {
  const clearStorage = useMainStore.persist.clearStorage;

  return (
    <Controls>
      <ControlButton onClick={() => clearStorage()} title="Clear State">
        <ClearOutlined />
      </ControlButton>
    </Controls>
  );
};

export default CustomControls;
