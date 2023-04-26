import { Dropdown } from "antd";
import { FC, memo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import logError from "utils/logError";

interface ContextMenuProps {
  children: any;
  items: any;
}

const ContextMenu: FC<ContextMenuProps> = ({ items, children }) => {
  return (
    <ErrorBoundary fallbackRender={({error, resetErrorBoundary}) => (
      <div>
        <h1>Error occured in ContextMenu.tsx</h1>
        <details>{error.message}</details>
        <button onClick={resetErrorBoundary}>Reset Error</button>
      </div>
    )} onError={logError}>
      <Dropdown trigger={["contextMenu"]} menu={{ items }} destroyPopupOnHide>
        {children}
      </Dropdown>
    </ErrorBoundary>
  );
};

export default memo(ContextMenu);
