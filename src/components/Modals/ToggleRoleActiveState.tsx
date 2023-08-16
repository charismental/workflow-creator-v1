import { ModalType, ModalInstance } from "./";
import { MainActions } from "store";

interface SetAsInactiveModalProps {
	modalOpen: boolean;
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	roleName: string;
	toggleRoleForProcess: MainActions["toggleRoleForProcess"];
	successMessage: () => void;
}

const ToggleRoleActiveState = ({
	toggleRoleForProcess,
	roleName,
	modalOpen,
	setModalOpen,
	successMessage,
}: SetAsInactiveModalProps) => {
	const type: ModalType = "confirm";

	const modalOptions = {
		open: modalOpen,
		title: "Clear all Transitions?",
		okText: "Clear",
		type,
		content: (
			<div>
				Setting as inactive will remove all Transitions associated with this role. Are you sure you want to continue this action?
			</div>
		),
		onOk() {
			toggleRoleForProcess(roleName), successMessage();
		},
		onCancel() {
			setModalOpen;
		},
	};

	return ModalInstance(modalOptions);
};

export { ToggleRoleActiveState }