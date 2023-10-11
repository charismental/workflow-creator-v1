import "reactflow/dist/style.css";
import "../css/style.css";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { Button, Input, Layout, Space, Spin, Tooltip, Typography } from "antd";
import { blue, grey } from "@ant-design/colors";
import { SaveTwoTone, SendOutlined, ShareAltOutlined, DiffOutlined } from "@ant-design/icons";
import isEqual from "lodash.isequal";

// store
import { shallow } from "zustand/shallow";
import useMainStore from "store";

// components
import ReactFlowBase from "components/ReactFlowBase";
import { ActiveRoleSettings, topMessage, StateCollapseBox } from "components/UI";
import { CustomControls } from "components/Controls/";
import { SelectBox } from "components/Inputs";
import { Sidebar } from "components/Layout";
import { ModalType, ModalInstance, ToggleRoleActiveState } from "components/Modals";

// utils
import { copyToClipboard, roleColor } from "utils";
import { queryObjectEncryptor } from "utils/queryObjectEncryptor";

// types
import { MainStore, Nullable, WorkflowProcess, WorkflowState } from "types";

// api
import { getSessionProcess } from "api";
import { CloneProcessComponent } from "components/Inputs/CloneProcessComponent";
import { DeleteProcessComponent } from "components/Inputs/DeleteProcessComponent";
import { DiffViewer } from "components/DiffViewer";

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

const storeSelector = (state: MainStore) => ({
	unsavedChanges: state.unsavedChanges,
	sessions: state.sessions,
	activeProcess: state.activeProcess,
	activeProcessDiffOriginal: state.activeProcessDiffOriginal,
	activeRole: state.activeRole,
	roles: state.roles,
	currentStates: state.states,
	loading: state.globalLoading,
	reactFlowInstance: state.reactFlowInstance,
	companies: state.companies,
	edgeType: state.edgeType,
	showPortsAndCloseButtons: state.showPortsAndCloseButtons,
	setEdgeType: state.setEdgeType,
	setShowAllConnectedStates: state.setShowAllConnectedStates,
	toggleShowAllRoles: state.toggleShowAllRoles,
	setUnsavedChanges: state.setUnsavedChanges,
	addProcess: state.addProcess,
	deleteSession: state.deleteSession,
	toggleRoleForProcess: state.toggleRoleForProcess,
	setActiveProcess: state.setActiveProcess,
	setActiveRole: state.setActiveRole,
	setColorForActiveRole: state.setColorForActiveRole,
	addNewState: state.addNewState,
	addNewRole: state.addNewRole,
	getAllSessions: state.getAllSessions,
	updateRoleProperty: state.updateRoleProperty,
	toggleCompanyForProcess: state.toggleCompanyForProcess,
	addNewCompany: state.addNewCompany,
	cloneProcess: state.cloneProcess,
	saveProcess: state.saveProcess,
	publishProcess: state.publishProcess,
	saveStateSnapshot: state.saveStateSnapshot,
	revertToSnapshot: state.revertToSnapshot,
	setShowPortsAndCloseButtons: state.setShowPortsAndCloseButtons,
	setShowMinimap: state.setShowMinimap,
});

const WorkflowCreator = () => {
	const {
		unsavedChanges,
		sessions,
		activeProcess,
		activeProcessDiffOriginal,
		activeRole,
		roles,
		currentStates,
		loading,
		reactFlowInstance,
		companies,
		edgeType,
		showPortsAndCloseButtons,
		setShowMinimap,
		setShowPortsAndCloseButtons,
		setEdgeType,
		setShowAllConnectedStates,
		toggleShowAllRoles,
		setUnsavedChanges,
		addProcess,
		toggleRoleForProcess,
		setActiveProcess,
		setActiveRole,
		setColorForActiveRole,
		addNewState,
		updateRoleProperty,
		addNewRole,
		getAllSessions,
		toggleCompanyForProcess,
		addNewCompany,
		deleteSession,
		cloneProcess,
		saveProcess,
		publishProcess,
		saveStateSnapshot,
		revertToSnapshot,
	} = useMainStore(storeSelector, shallow);
	const [toggleInactiveModal, setToggleInactiveModal] = useState(false);

	const filteredStates = useMainStore(
		useCallback((state) => state.filteredStates, [currentStates])
	);

	useEffect(() => {
		getAllSessions();
	}, []);

	const usePreviousProcess = (value: Nullable<WorkflowProcess>) => {
		const ref: any = useRef();
		useEffect(() => {
			ref.current = value;
		});

		return ref.current;
	}

	const previousProcess = usePreviousProcess(activeProcess);

	useEffect(() => {
		if (previousProcess?.sessionId && previousProcess.sessionId === activeProcess?.sessionId && !isEqual(previousProcess, activeProcess)) {
			// states will be different first pass until saved (adding properties automatically)
			if ((previousProcess?.states || []).some((state: WorkflowState) => state?.properties !== null)) setUnsavedChanges(true);
		}
	}, [activeProcess])

	const findProcessAndSetActive = (processName: string) => {
		const foundProcess = sessions.find((p) => p.processName === processName);
		const { sessionId = null } = foundProcess || {};
		if (!sessionId) return;

		if (unsavedChanges) {
			const type: ModalType = "confirm";

			const modalOptions = {
				open: true,
				title: "Unsaved Changes",
				okText: "Discard",
				closeable: false,
				type,
				content: (
					<div>
						You have unsaved changes. Would you like to save before continuing?
					</div>
				),
				// async/await?
				onOk() {
					setUnsavedChanges(false);
					getSessionProcess(sessionId)
						.then((res) => setActiveProcess(res))
						.catch((err) => console.error(err))
					// saveProcessHandler()
					// 	.then(async (success) => {
					// 		if (!success) throw new Error('Error saving process');
					// 		const fetchedProcess = await getSessionProcess(sessionId)
					// 		setActiveProcess(fetchedProcess)
					// 	})
					// 	.catch((err) => console.error(err))

				},
			};
			ModalInstance(modalOptions)
		} else {
			getSessionProcess(sessionId).then((res) => setActiveProcess(res));
		}

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

	const companyList = companies.map(({ companyName }) => {
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
			successMessage: () => topMessage({
				type: 'success',
				content: 'Transitions have been removed',
				duration: 5
			}),
		});
	};

	const toggleRole = (roleName: string): void => {
		const { transitions = [] } = activeProcess?.roles?.find((r) => r.roleName === roleName) || {};

		if (Array.isArray(transitions) && transitions.length) openToggleActiveModal(roleName);
		else toggleRoleForProcess(roleName);
	};

	const shareRoleWorkflow = async () => {
		const { protocol, host } = window.location;
		const baseUrl = `${protocol}//${host}/`;
		const foundRole = activeProcess?.roles?.find(({ roleName }) => roleName === activeRole);
		const hashedQuery = queryObjectEncryptor({ processId: activeProcess?.processId, role: foundRole, states: activeProcess?.states || [] });

		const url = `${baseUrl}sharedLink/${encodeURIComponent(hashedQuery)}`;
		const { success, message } = await copyToClipboard(url);

		topMessage({
			type: success ? 'success' : 'error',
			content: message,
			duration: 4,
		})

		console.log('url', url);
	};

	if (loading) {
		return (
			<Spin
				size="large"
				style={{ position: "absolute", top: "50%", left: "50%" }}
			/>
		);
	}
	const canPublish = !unsavedChanges && !!activeProcess?.sessionId;

	const saveProcessHandler = async () => {
		topMessage({
			type: 'loading',
			content: 'Saving process',
			duration: 4,
			key: "saveProcess"
		})

		const success = await saveProcess();

		topMessage({
			type: success ? 'success' : 'error',
			content: success ? 'Process saved' : 'Error saving process',
			duration: 3,
			key: "saveProcess"
		});

		return success;
	}

	const publishProcessHandler = async () => {
		topMessage({
			type: 'loading',
			content: 'Publishing process',
			duration: 4,
			key: "publishProcess"
		})

		const success = await publishProcess();

		topMessage({
			type: success ? 'success' : 'error',
			content: success ? 'Process published' : 'Error publishing process',
			duration: 3,
			key: "publishProcess"
		});

		return success;
	}

	const cloneProcessHandler = async (processName: string) => {
		const type: ModalType = "confirm";
		let newSessionName = '';

		const modalOptions = {
			open: true,
			title: "Clone Process",
			okText: "Clone",
			closeable: true,
			type,
			content: (
				<div>
					This will clone {processName}. Proceed?
					<Input
						style={{ marginTop: '10px', marginBottom: '10px' }}
						placeholder="Enter new process name"
						onChange={(e: any) => newSessionName = e.target.value}
					/>
				</div>
			),
			onOk() {
				cloneProcess(processName, newSessionName)
					.then((success) => {
						if (!success) topMessage({ type: 'error', content: 'Error cloning process', duration: 3 })
						else (newSessionName = '')
					})
			},
			onCancel() {
				newSessionName = '';
			}
		};
		ModalInstance(modalOptions)
	}

	const deleteSessionHandler = async (sessionName: string) => {
		const type: ModalType = "confirm";

		const modalOptions = {
			open: true,
			title: "Delete Session",
			okText: "Delete",
			closeable: false,
			type,
			content: (
				<div>
					This will permanently delete {sessionName}. Are you sure you wish to proceed?
				</div>
			),
			onOk() {
				// need to handle for unsuccessful delete request
				deleteSession(sessionName)
					.then(message => topMessage({ type: 'success', content: message, duration: 3 }))

			},
		};
		ModalInstance(modalOptions)
	}

	const checkProcessDiffHandler = async () => {
		const type: ModalType = "info";

		const modalOptions = {
			open: true,
			title: "Process Changes",
			okText: "Done",
			closeable: true,
			type,
			width: 2000,
			content: (
				<DiffViewer oldValue={JSON.stringify(activeProcessDiffOriginal, null, 2)} newValue={JSON.stringify(activeProcess, null, 2)} />
			),
		};
		ModalInstance(modalOptions)
	}

	const iconComponents = (el: string) => [
		CloneProcessComponent({ item: el, handler: cloneProcessHandler, validProcesses: publishedSessions }),
		DeleteProcessComponent({ item: el, handler: deleteSessionHandler }),
	]

	return (
		<Space
			direction="vertical"
			style={spaceContainer}
		>
			<Layout style={layoutContainer}>
				<Layout>
					<Header style={headerStyle}>
						<div>
							<SelectBox
								useStyle={{ maxWidth: "360px", minWidth: "300px" }}
								selectOnChange={findProcessAndSetActive}
								addNew={addNewProcessAndSelect}
								type="process"
								selectValue={activeProcess?.processName}
								items={availableSessions}
								placeholder="Select Process"
								hasColorInput={false}
								iconComponents={iconComponents}
							/>
							<Tooltip
								placement="bottomRight"
								title={"Save Process"}
							>
								<Button disabled={!unsavedChanges} onClick={saveProcessHandler} style={{ marginLeft: '4px' }} size="large" type="text" icon={<SaveTwoTone twoToneColor={unsavedChanges ? blue.primary : grey[0]} />} />
							</Tooltip>
							<Tooltip
								placement="bottomRight"
								title={"Publish Process"}
							>
								<Button disabled={!canPublish} onClick={publishProcessHandler} style={{ marginLeft: '2px' }} size="large" type="text" icon={<SendOutlined style={{ color: canPublish ? blue.primary : grey[0] }} />} />

							</Tooltip>
							<Tooltip
								placement="bottomRight"
								title={"Create Share Link for Role"}
							>
								<Button disabled={!roleIsToggled} onClick={shareRoleWorkflow} style={{ marginLeft: '2px' }} size="large" type="text" icon={<ShareAltOutlined style={{ color: roleIsToggled ? blue.primary : grey[0] }} />} />

							</Tooltip>
							<Tooltip
								placement="bottomRight"
								title={"Check Process Diff"}
							>
								<Button onClick={checkProcessDiffHandler} style={{ marginLeft: '2px' }} size="large" type="text" icon={<DiffOutlined style={{ color: blue.primary }} />} />

							</Tooltip>
						</div>
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
							toggleShowAllRoles={toggleShowAllRoles}
							setShowAllConnectedStates={setShowAllConnectedStates}
							setEdgeType={setEdgeType}
							edgeType={edgeType}
							saveStateSnapshot={saveStateSnapshot}
							revertToSnapshot={revertToSnapshot}
							showPortsAndCloseButtons={showPortsAndCloseButtons}
							setShowPortsAndCloseButtons={setShowPortsAndCloseButtons}
							setShowMinimap={setShowMinimap}
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
