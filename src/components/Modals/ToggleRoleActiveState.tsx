import { ModalFuncProps, Typography } from "antd";
import ModalInstance from "./ModalInstance";
import { MainActions } from "store";

const { Title } = Typography;

interface SetAsInactiveModalProps {
	modalOpen: boolean;
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	RoleName: string;
	toggleRoleForProcess: MainActions["toggleRoleForProcess"];
	successMessage: () => void;
}

export default ({
	toggleRoleForProcess,
	RoleName,
	modalOpen,
	setModalOpen,
	successMessage,
}: SetAsInactiveModalProps) => {
	const modalOptions: ModalFuncProps = {
		centered: true,
		closable: true,
		open: modalOpen,
		maskClosable: true,
		content: (
			<>
				<Title level={3}>
					Setting as inactive will remove all Transitions associated with this role
				</Title>
				<Title level={5}>Are you sure you want to continue this action?</Title>
			</>
		),
		onOk() {
			toggleRoleForProcess(RoleName), successMessage();
		},
		okText: "Clear All Properties",
		okType: "primary",
		okButtonProps: { size: "large", danger: true },
		onCancel() {
			setModalOpen;
		},
		cancelText: "Cancel",
		cancelButtonProps: { type: "default", size: "large" },
	};
	return ModalInstance({ modalType: "warn", modalOptions });
};
