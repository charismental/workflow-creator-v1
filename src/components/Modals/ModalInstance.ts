import { Modal } from "antd";
import { LegacyButtonType } from "antd/es/button/button";
import { ReactNode } from "react";

export type ModalType = "error" | "confirm" | "warning" | "success";

export interface ModalProps {
	type: ModalType;
	title: string;
	closeable?: boolean;
	open: boolean;
	content: ReactNode | string;
	onCancel?: () => void;
	okText?: string;
	onOk?: () => void;
	cancelText?: string;
}

export default (props: ModalProps) => {
	const {
		type,
		title,
		open,
		content,
		closeable = true,
		onCancel,
		okText,
		onOk,
		cancelText,
	} = props;
	
	const okType: LegacyButtonType = 'primary';
	
	const modalOptions = {
		closeable,
		centered: true,
		mask: true,
		okType,
		// okButtonProps: { size: "large", danger: true },
		// cancelButtonProps: { type: "default", size: "large" },
		maskClosable: closeable,
		title,
		content,
		open,
		...(okText && { okText }),
		...(cancelText && { cancelText }),
		...(onOk && { onOk }),
		...(onCancel && { onCancel }),
	}
	
	Modal[type](modalOptions);	
};
