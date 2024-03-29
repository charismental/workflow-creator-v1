import { Modal } from "antd";
import { LegacyButtonType } from "antd/es/button/button";
import { ReactNode } from "react";

export type ModalType = "error" | "confirm" | "warning" | "success" | "info";

export interface ModalProps {
	type: ModalType;
	title: string;
	closeable?: boolean;
	open: boolean;
	content?: ReactNode | string;
	onCancel?: () => void;
	okText?: string;
	onOk?: () => void;
	cancelText?: string;
	width?: number;
}

const ModalInstance = (props: ModalProps) => {
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
		width,
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
		open,
		...(content && { content }),
		...(okText && { okText }),
		...(cancelText && { cancelText }),
		...(onOk && { onOk }),
		...(onCancel && { onCancel }),
		...(width && { width }),
	}
	
	Modal[type](modalOptions);	
};

export { ModalInstance }