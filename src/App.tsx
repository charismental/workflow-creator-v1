import { Layout, Space, Spin, Typography, message } from "antd";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import CustomControls from "components/CustomControls/CustomControls";
import ToggleRoleActiveState from "components/Modals/ToggleRoleActiveState";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import type { MainActions, MainState } from "store";
import useMainStore from "store";
import { roleColor } from "utils";
import { shallow } from "zustand/shallow";
import Sidebar from "./components/Sidebar";
import "reactflow/dist/style.css";
import "./css/style.css";
import getSessionProcess from "api/getSessionProcess";

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

const storeSelector = (state: MainActions & MainState) => ({
	sessions: state.sessions,
	addProcess: state.addProcess,
	deleteSession: state.deleteSession,
	toggleRoleForProcess: state.toggleRoleForProcess,
	activeProcess: state.activeProcess,
	setActiveProcess: state.setActiveProcess,
	activeRole: state.activeRole,
	setActiveRole: state.setActiveRole,
	roles: state.roles,
	setColorForActiveRole: state.setColorForActiveRole,
	currentStates: state.states,
	addNewState: state.addNewState,
	addNewRole: state.addNewRole,
	getAllSessions: state.getAllSessions,
	loading: state.globalLoading,
	reactFlowInstance: state.reactFlowInstance,
	updateRoleProperty: state.updateRoleProperty,
	Companies: state.companies,
	toggleCompanyForProcess: state.toggleCompanyForProcess,
	addNewCompany: state.addNewCompany,
	cloneProcess: state.cloneProcess,
});

const WorkflowCreator = () => {
	const {
		sessions,
		addProcess,
		toggleRoleForProcess,
		activeProcess,
		setActiveProcess,
		activeRole,
		setActiveRole,
		roles,
		setColorForActiveRole,
		currentStates,
		addNewState,
		updateRoleProperty,
		addNewRole,
		getAllSessions,
		loading,
		reactFlowInstance,
		Companies,
		toggleCompanyForProcess,
		addNewCompany,
		deleteSession,
		cloneProcess,
	} = useMainStore(storeSelector, shallow);
	const [toggleInactiveModal, setToggleInactiveModal] = useState(false);
	const filteredStates = useMainStore(
		useCallback((state) => state.filteredStates, [currentStates])
	);

	useEffect(() => {
		getAllSessions();
	}, []);

	const [messageApi, contextHolder] = message.useMessage();

	const findProcessAndSetActive = (processName: string) => {
		const foundProcess = sessions.find((p) => p.processName === processName);
		const { sessionId = null } = foundProcess || {};
		if (sessionId) getSessionProcess(sessionId).then((res) => setActiveProcess(res));
	}

	const activeRoleColor = roleColor({
		roleName: activeRole,
		allRoles: activeProcess?.roles || [],
	});

	const roleIsToggled = !!activeProcess?.roles?.some((r) => r.roleName === activeRole);

	const availableStates = filteredStates((activeProcess?.states || []).sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0)));

	const availableSessions = sessions.map((p) => p.processName).sort((a, b) => a.localeCompare(b));
	// overkill
	const publishedSessions = sessions.filter((p) => p.processId !== null).map((p) => p.processName);

	const roleList = roles.map(({ roleName }) => {
		return {
			label: roleName,
			value: activeProcess?.roles?.some((r) => r.roleName === roleName) || false,
		};
	})

	const companyList = Companies.map(({ companyName }) => {
		return {
			label: companyName,
			value: activeProcess?.companies?.some((c) => c.companyName === companyName) || false,
		};
	}).sort((a, b) => a.label.localeCompare(b.label));

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

	if (loading) {
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
							canDelete={(el) => !publishedSessions.includes(el)}
							canClone={(el) => !publishedSessions.includes(el)}
							deleteHandler={deleteSession}
							cloneHandler={cloneProcess}
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
								const foundRole: any = activeProcess?.roles?.find((r: any) => r.roleName === activeRole);

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
								items={availableStates}
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
