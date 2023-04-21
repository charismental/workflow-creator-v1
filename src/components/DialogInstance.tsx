import { Modal } from "antd";
import type { ModalFuncProps } from "antd";

interface DialogProps {
  dialogProps: ModalFuncProps;
  dialogMethod: "error" | "info" | "success" | "warn" | "warning" | "confirm";
}

export default ({ dialogMethod, dialogProps }: DialogProps) => {
  switch (dialogMethod) {
    case "error":
      return Modal.error({ ...dialogProps });
    case "info":
      return Modal.info({ ...dialogProps });
    case "success":
      return Modal.success({ ...dialogProps });
    case "warn":
      return Modal.warn({ ...dialogProps });
    case "warning":
      return Modal.warning({ ...dialogProps });
    default:
      return Modal.confirm({ ...dialogProps });
  }
};
