import { Button, Divider, ModalFuncProps, Space, Typography } from "antd";
import { CSSProperties } from "react";
import { MainActions } from "store";
import ModalInstance from "./ModalInstance";

const { Title } = Typography;

interface ProcessSelectModalProps {
	modalOpen: boolean;
	unsavedChanges: boolean;
	newerVersion: boolean;
    getNewerVersion: () => void;
	processName: string;
    saveChangesAndContinue: MainActions['setActiveProcess']
}

const button_container: CSSProperties = {
	display: "flex",
	flexDirection: "row",
	gap: '10px',
	justifyContent: "center",
	alignContent: "center",
	marginTop: "1rem",
};

export default ({
	modalOpen,
	unsavedChanges,
	newerVersion,
    getNewerVersion,
	processName,
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
				align={"center"}
				size={"large"}
			>
				<Divider />
				<div style={button_container}>
					{newerVersion && <Button onClick={getNewerVersion}>Get Newer Version</Button>}
					{unsavedChanges && <Button onClick={() => saveChangesAndContinue(processName)}>Save Changes</Button>}
				</div>
			</Space>
		),
	};
    
    return ModalInstance({modalType: 'warn', modalOptions})
};
