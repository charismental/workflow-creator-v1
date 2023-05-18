import { Layout, Space, Spin, Typography, message } from "antd";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import CustomControls from "components/CustomControls/CustomControls";
import ToggleRoleActiveState from "components/Modals/ToggleRoleActiveState";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import type { MainActions, MainState } from "store";
import useMainStore from "store";
import { roleColor } from "utils";
import { shallow } from "zustand/shallow";
import Sidebar from "./components/Sidebar";
import "./css/style.css";

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
	processes: state.processes,
	addProcess: state.addProcess,
	toggleRoleForProcess: state.toggleRoleForProcess,
	activeProcess: state.activeProcess,
	setActiveProcess: state.setActiveProcess,
	activeRole: state.activeRole,
	setActiveRole: state.setActiveRole,
	roles: state.Roles,
	setColorForActiveRole: state.setColorForActiveRole,
	currentStates: state.States,
	addNewState: state.addNewState,
	addNewRole: state.addNewRole,
	fetchAll: state.fetchAll,
	loading: state.globalLoading,
	reactFlowInstance: state.reactFlowInstance,
	updateRoleProperty: state.updateRoleProperty,
	Companies: state.Companies,
	toggleCompanyForProcess: state.toggleCompanyForProcess,
	addNewCompany: state.addNewCompany,
	edgeType: state.edgeType,
	setEdgeType: state.setEdgeType,
	setShowAllConnectedStates: state.setShowAllConnectedStates,
	setShowMinimap: state.setShowMinimap,
	toggleShowAllRoles: state.toggleShowAllRoles,
	contextMenuNodeId: state.contextMenuNodeId,
	onConnect: state.onConnect,
	onNodesChange: state.onNodesChange,
	setContextMenuNodeId: state.setContextMenuNodeId,
	setReactFlowInstance: state.setReactFlowInstance,
	setStatesForActiveProcess: state.setStatesForActiveProcess,
	showAllRoles: state.showAllRoles,
	showAllConnectedStates: state.showAllConnectedStates,
	showMinimap: state.showMinimap,
});

const WorkflowCreator = () => {
	const {
		processes,
		addProcess,
		showAllRoles,
		edgeType,
		showAllConnectedStates,
		setReactFlowInstance,
		showMinimap,
		contextMenuNodeId,
		setContextMenuNodeId,
		onNodesChange,
		setStatesForActiveProcess,
		toggleShowAllRoles,
		onConnect,
		setEdgeType,
		setShowAllConnectedStates,
		setShowMinimap,
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
		fetchAll,
		loading,
		reactFlowInstance,
		Companies,
		toggleCompanyForProcess,
		addNewCompany,
	} = useMainStore(storeSelector, shallow);
	const [toggleInactiveModal, setToggleInactiveModal] = useState(false);
	const filteredStates = useMainStore(
		useCallback((state) => state.filteredStates, [currentStates])
	);

	useEffect(() => {
		fetchAll();
	}, []);

	const [messageApi, contextHolder] = message.useMessage();

	const activeRoleColor = roleColor({
		RoleName: activeRole,
		allRoles: activeProcess?.Roles || [],
	});

	const roleIsToggled = !!activeProcess?.Roles?.some((r) => r.RoleName === activeRole);

	const availableStates = filteredStates(activeProcess?.States || []);

	const availableProcesses = processes.map((p) => p.ProcessName);

	const roleList = roles.map(({ RoleName }) => {
		return {
			label: RoleName,
			value: activeProcess?.Roles?.some((r) => r.RoleName === RoleName) || false,
		};
	});

	const companyList = Companies.map(({ CompanyName }) => {
		return {
			label: CompanyName,
			value: activeProcess?.Companies?.some((c) => c.CompanyName === CompanyName) || false,
		};
	});

	const addNewProcessAndSelect = ({ name }: { name: string }) => {
		addProcess(name);
		setActiveProcess(name);
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

	const openToggleActiveModal = (RoleName: string) => {
		setToggleInactiveModal(true);

		ToggleRoleActiveState({
			modalOpen: toggleInactiveModal,
			RoleName: activeRole,
			setModalOpen: setToggleInactiveModal,
			toggleRoleForProcess: () => toggleRoleForProcess(RoleName),
			successMessage: activeStatusRemovedMessage,
		});
	};

	const toggleRole = (RoleName: string): void => {
		const { Transitions = [] } = activeProcess?.Roles?.find((r) => r.RoleName === RoleName) || {};

		if (Transitions.length) openToggleActiveModal(RoleName);
		else toggleRoleForProcess(RoleName);
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
				tip={
					<Title
						level={4}
						style={{ color: "blue" }}
					>
						...Loading State
					</Title>
				}
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
							selectOnChange={setActiveProcess}
							addNew={addNewProcessAndSelect}
							type="process"
							selectValue={activeProcess?.ProcessName}
							items={availableProcesses}
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
								const foundRole: any = roles?.find((r: any) => r.RoleName === activeRole);

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
								activeProcess={activeProcess}
								contextMenuNodeId={contextMenuNodeId}
								onConnect={onConnect}
								onNodesChange={onNodesChange}
								reactFlowInstance={reactFlowInstance}
								setContextMenuNodeId={setContextMenuNodeId}
								setReactFlowInstance={setReactFlowInstance}
								setStatesForActiveProcess={setStatesForActiveProcess}
								showAllConnectedStates={showAllConnectedStates}
								showAllRoles={showAllRoles}
								showMinimap={showMinimap}
							/>
						</Content>
						<CustomControls
							edgeType={edgeType}
							setEdgeType={setEdgeType}
							setShowAllConnectedStates={setShowAllConnectedStates}
							setShowMinimap={setShowMinimap}
							toggleShowAllRoles={toggleShowAllRoles}
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
								disabled={!activeProcess?.Roles?.some((r) => r.RoleName === activeRole)}
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

document.addEventListener("keydown", function (e) {
	if (e.key === "Shift") {
		const elements = document.querySelectorAll(".stateNodeBody");

		elements.forEach(function (element) {
			element.classList.add("drag-handle");
		});
	}
});

document.addEventListener("keyup", function (e) {
	if (e.key === "Shift") {
		const elements = document.querySelectorAll(".stateNodeBody");

		elements.forEach(function (element) {
			element.classList.remove("drag-handle");
		});
	}
});

export default WorkflowCreator;
