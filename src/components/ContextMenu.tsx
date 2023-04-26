import React, { FC, memo } from "react";
import { Dropdown } from "antd";
import useMainStore from "store";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackUI from "./ErrorFallbackUI";
import logError from "utils/logError";

interface ContextMenuProps {
  children: any;
  items: any;
}

const ContextMenu: FC<ContextMenuProps> = ({ items, children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackUI} onError={logError}>
      <Dropdown trigger={["contextMenu"]} menu={{ items }} destroyPopupOnHide>
        {children}
      </Dropdown>
    </ErrorBoundary>
  );
};

export default memo(ContextMenu);
