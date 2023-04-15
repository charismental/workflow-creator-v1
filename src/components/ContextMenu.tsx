import { FC, useMemo } from "react";
import { Dropdown } from "antd";
import useMainStore from "store";

interface ContextMenuProps {
  children: React.ReactNode;
}

const ContextMenu: FC<ContextMenuProps> = ({ children }) => {
  const items = useMainStore((state) => state.contextMenuItems);

  return (
    <Dropdown trigger={["contextMenu"]} menu={{ items }}>
      {children}
    </Dropdown>
  );
};

export default ContextMenu;
