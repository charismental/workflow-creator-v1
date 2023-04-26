import React, { FC, memo } from "react";
import { Dropdown } from "antd";
import useMainStore from "store";

interface ContextMenuProps {
  children: any;
  items: any;
}

const ContextMenu: FC<ContextMenuProps> = ({ items, children }) => {
  return (
    <Dropdown trigger={["contextMenu"]} menu={{ items }} destroyPopupOnHide>
      {children}
    </Dropdown>
  );
};

export default memo(ContextMenu);
