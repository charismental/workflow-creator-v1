import { Button, Divider, ModalFuncProps, Space, Typography } from "antd";
import { CSSProperties } from "react";
import ModalInstance from "./ModalInstance";

const { Title } = Typography;

interface ProcessSelectModalProps {
	modalOpen: boolean;
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	unsavedChanges: boolean;
	newerVersion: boolean;
    getNewerVersion: () => void;
    saveChangesAndContinue: () => void;
}

const button_container: CSSProperties = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "end",
	alignContent: "end",
	marginTop: "1rem",
	padding: "4px 8px"
};

export default ({
	modalOpen,
	setModalOpen,
	unsavedChanges,
	newerVersion,
    getNewerVersion,
    saveChangesAndContinue
}: ProcessSelectModalProps) => {
	const modalOptions: ModalFuncProps = {
		closable: true,
		open: modalOpen,
		centered: true,
		content: (
			<>
				{unsavedChanges && <Title level={3}>There are unsaved changes on this workflow.</Title>}
				{newerVersion && <Title level={3}>There is a newer version of this workflow.</Title>}
			</>
		),
		footer: (
			<Space
				align={"end"}
				size={"large"}
			>
				<Divider />
				<div style={button_container}>
					<Button onClick={setModalOpen}>Cancel</Button>
					{newerVersion && <Button onClick={getNewerVersion}>Get Newer Version</Button>}
					{unsavedChanges && <Button onClick={saveChangesAndContinue}>Save Changes</Button>}
				</div>
			</Space>
		),
	};
    
    return ModalInstance({modalType: 'warn', modalOptions})
};
