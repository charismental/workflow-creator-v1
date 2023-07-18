import { Layout, Space, Spin, Typography, message } from "antd";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import CustomControls from "components/CustomControls/CustomControls";
import ToggleRoleActiveState from "components/Modals/ToggleRoleActiveState";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import {
	MainState,
	useMainState,
	addProcess,
	toggleRoleForProcess,
	setActiveProcess,
	setActiveRole,
	setColorForActiveRole,
	addNewState,
	updateRoleProperty,
	addNewRole,
	filteredStates,
	getAllSessionsFromApi,
	toggleCompanyForProcess,
	addNewCompany,
} from "./store";
import { roleColor } from "utils";
import { shallow } from "zustand/shallow";
import Sidebar from "./components/Sidebar";
import "reactflow/dist/style.css";
import "./css/style.css";
import getSessionProcess from "api/getSessionProcess";

const {
	sessions,
	activeProcess,
	activeRole,
	roles,
	globalLoading,
	reactFlowInstance,
	companies,
	states: currentStates,
} = useMainState();
const { Header, Content } = Layout;
const { Title } = Typography;

const spaceContainer: CSSProperties = {
	width: "100%",
};
const headerStyle: CSSProperties = {
	backgroundColor: "#fff",
	padding: "25px",
	height: "80px",
	display: "inline-flex",
	justifyContent: "space-between",
	alignItems: "center",
};
const activeRoleTitleStyle: CSSProperties = {
	flexGrow: 2,
	textAlign: "center",
	paddingBottom: "18px",
};

const layoutContainer: CSSProperties = { width: "100%", height: "100vh" };

const WorkflowCreator = () => {
	const [toggleInactiveModal, setToggleInactiveModal] = useState(false);

	useEffect(() => {
		getAllSessionsFromApi();
	}, []);

	const [messageApi, contextHolder] = message.useMessage();

	const findProcessAndSetActive = (processName: string) => {
		const foundProcess = sessions.find((p) => p.processName === processName);
		const { sessionId = null } = foundProcess || {};
		if (sessionId) getSessionProcess(sessionId).then((res) => setActiveProcess(res));
	};

	const activeRoleColor = roleColor({
		roleName: activeRole,
		allRoles: activeProcess?.roles || [],
	});

	const roleIsToggled = !!activeProcess?.roles?.some((r) => r.roleName === activeRole);

	const availableStates = useCallback(
		() =>
			filteredStates(
				(activeProcess?.states || []).sort(
					(a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0)
				)
			),
		[currentStates]
	);

	const availableSessions = sessions.map((p) => p.processName).sort((a, b) => a.localeCompare(b));

	const roleList = roles.map(({ roleName }) => {
		return {
			label: roleName,
			value: activeProcess?.roles?.some((r) => r.roleName === roleName) || false,
		};
	});

	const companyList = companies
		.map(({ companyName }) => {
			return {
				label: companyName,
				value: activeProcess?.companies?.some((c) => c.companyName === companyName) || false,
			};
		})
		.sort((a, b) => a.label.localeCompare(b.label));

	const addNewProcessAndSelect = ({ name }: { name: string }) => {
		addProcess(name);
	};

	const addNewRoleAndToggle = ({ name, color }: { name: string; color: string }) => {
		addNewRole(name);
		toggleRoleForProcess(name, color);
		setActiveRole(name);
	};

	const addNewCompanyAndToggle = ({ name }: { name: string }) => {
		addNewCompany(name);
		toggleCompanyForProcess(name);
	};

	const openToggleActiveModal = (roleName: string) => {
		setToggleInactiveModal(true);

		ToggleRoleActiveState({
			modalOpen: toggleInactiveModal,
			roleName: activeRole,
			setModalOpen: setToggleInactiveModal,
			toggleRoleForProcess: () => toggleRoleForProcess(roleName),
			successMessage: activeStatusRemovedMessage,
		});
	};

	const toggleRole = (roleName: string): void => {
		const { transitions = [] } = activeProcess?.roles?.find((r) => r.roleName === roleName) || {};

		if (Array.isArray(transitions) && transitions.length) openToggleActiveModal(roleName);
		else toggleRoleForProcess(roleName);
	};

	const activeStatusRemovedMessage = () => {
		messageApi.open({
			type: "success",
			content: "Transtions have been Removed",
			duration: 5,
			style: { fontSize: "20px" },
		});
	};

	if (globalLoading) {
		return (
			<Spin
				size="large"
				style={{ position: "absolute", top: "50%", left: "50%" }}
			/>
		);
	}

	return (
		<Space
			direction="vertical"
			style={spaceContainer}
		>
			{contextHolder}
			<Layout style={layoutContainer}>
				<Layout>
					<Header style={headerStyle}>
						<SelectBox
							useStyle={{ flexGrow: 1, maxWidth: "360px" }}
							selectOnChange={findProcessAndSetActive}
							addNew={addNewProcessAndSelect}
							type="process"
							selectValue={activeProcess?.processName}
							items={availableSessions}
							placeholder="Select Process"
							hasColorInput={false}
						/>
						<Title
							level={2}
							style={activeRoleTitleStyle}
						>
							{activeRole}
						</Title>
						<ActiveRoleSettings
							roleIsToggled={roleIsToggled}
							updateColor={setColorForActiveRole}
							color={activeRoleColor}
							toggleRole={() => toggleRole(activeRole)}
							useStyle={{ flexGrow: 1 }}
							updateRoleProperty={({ property, value }: { property: string; value?: any }) =>
								updateRoleProperty({ role: activeRole, property, value })
							}
							roleHasPropertyActive={(property: string) => {
								const foundRole: any = activeProcess?.roles?.find(
									(r: any) => r.roleName === activeRole
								);

								return !!foundRole?.[property];
							}}
						/>
					</Header>
					<ReactFlowProvider>
						<Content className="dndflow">
							<ReactFlowBase
								roleIsToggled={roleIsToggled}
								activeRoleColor={activeRoleColor}
								activeRole={activeRole}
							/>
						</Content>
						<CustomControls
							roleIsToggled={roleIsToggled}
							getCurrentEdges={reactFlowInstance?.getEdges}
							getCurrentNodes={reactFlowInstance?.getNodes}
						/>
					</ReactFlowProvider>
				</Layout>
				<Sidebar
					children={
						<>
							<StateCollapseBox
								items={availableStates()}
								addNew={addNewState}
								roleColor={activeRoleColor}
								disabled={!activeProcess?.roles?.some((r) => r.roleName === activeRole)}
							/>
							<SelectBox
								addNew={addNewRoleAndToggle}
								placeholder="Select Role"
								selectValue={activeRole}
								items={roleList}
								type={"role"}
								hasColorInput
								useStyle={{ width: "100%" }}
								multiselectHandler={(el) => toggleRole(el.label)}
								selectOnChange={setActiveRole}
							/>
							<SelectBox
								addNew={addNewCompanyAndToggle}
								placeholder="Select Company"
								items={companyList}
								type="company"
								useStyle={{ width: "100%" }}
								multiselectHandler={(el) => toggleCompanyForProcess(el.label)}
							/>
						</>
					}
				/>
			</Layout>
		</Space>
	);
};

export default WorkflowCreator;
