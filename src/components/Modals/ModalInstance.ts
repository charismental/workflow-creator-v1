import type { ModalFuncProps } from "antd";
import { Modal } from "antd";

interface ModalProps {
	modalOptions: ModalFuncProps;
	modalType: "error" | "confirm" | "warning" | "warn" | "success";
}

export default ({ modalType, modalOptions }: ModalProps) => {
	switch (modalType) {
		case "error":
			Modal.error({ ...modalOptions });
			break;
		case "success":
			Modal.success({ ...modalOptions });
			break;
		case "warning":
			Modal.warning({ ...modalOptions });
			break;
		case "warn":
			Modal.warn({ ...modalOptions });
			break;
		default:
			Modal.confirm({ ...modalOptions });
			break;
	}
};
