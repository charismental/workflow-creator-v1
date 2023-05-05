import { Layout, Space, Spin, Typography } from "antd";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import Sidebar from "./components/Sidebar";
import "reactflow/dist/style.css";
import "./css/style.css";
import type { MainActions, MainState } from "store";
import { roleColor } from "utils";
import CustomControls from "components/CustomControls";

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
	roles: state.roles,
	setColorForActiveRole: state.setColorForActiveRole,
	currentStates: state.states,
	addNewState: state.addNewState,
	addNewRole: state.addNewRole,
	fetchAll: state.fetchAll,
	loading: state.globalLoading,
	reactFlowInstance: state.reactFlowInstance,
});

const WorkflowCreator = () => {
	const {
		processes,
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
		addNewRole,
		fetchAll,
		loading,
		reactFlowInstance,
	} = useMainStore(storeSelector, shallow);

	const filteredStates = useMainStore(
		useCallback((state) => state.filteredStates, [currentStates])
	);

	useEffect(() => {
		fetchAll();
	}, []);

	const activeRoleColor = roleColor({
		roleName: activeRole,
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

	const addNewProcessAndSelect = ({ name }: { name: string }) => {
		addProcess(name);
		setActiveProcess(name);
	};

	const addNewRoleAndToggle = ({ name, color }: { name: string; color: string }) => {
		addNewRole(name);
		toggleRoleForProcess(name, color);
		setActiveRole(name);
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
							toggleRole={() => toggleRoleForProcess(activeRole)}
							useStyle={{ flexGrow: 1 }}
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
								multiselectHandler={(el) => toggleRoleForProcess(el.label)}
								selectOnChange={setActiveRole}
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
