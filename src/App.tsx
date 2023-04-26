import Icon from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Layout,
  ModalFuncProps,
  Space,
  Spin,
  Switch,
  Typography,
  theme,
} from "antd";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "components/ErrorFallbackUI";
import { MoonSvg, SunSvg } from "assets/icons/icons";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import ModalInstance from "components/ModalInstance";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import ToggleEdgeTypes from "components/ToggleEdgeTypes";
import useHydration from "hooks/useHydration";
import { CSSProperties, useCallback, useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import type { MainActions, MainState } from "store";
import useMainStore, { initialNodes } from "store";
import { WorkflowProcess } from "store/types";
import OutputJSON from "utils/OutputJSON";
import { shallow } from "zustand/shallow";
import Sidebar from "./components/Sidebar";
import "./css/style.css";

const { Header, Content } = Layout;
const { Title } = Typography;

const spaceContainer: CSSProperties = {
  width: "100%",
};
const switchStyle: CSSProperties = {
  color: theme ? "" : "white",
  position: "absolute",
  fontSize: "10px",
  bottom: "20px",
  right: "20px",
};
const activeRoleTitleStyle: CSSProperties = {
  color: "white",
  flexGrow: 2,
  textAlign: "center",
  paddingBottom: "18px",
};

const layoutContainer: CSSProperties = { width: "100%", height: "100vh" };

const storeSelector = (state: MainActions & MainState) => ({
  processes: state.processes,
  addProcess: state.addProcess,
  toggleRoleForProcess: state.toggleRoleForProcess,
  activeProcessName: state.activeProcessName,
  setActiveProcessName: state.setActiveProcessName,
  activeRole: state.activeRole,
  setActiveRole: state.setActiveRole,
  allEdges: state.allEdges,
  setAllEdges: state.setAllEdges,
  roles: state.roles,
  setRoles: state.setRoles,
  nodes: state.nodes,
  setNodes: state.setNodes,
  roleColors: state.roleColors,
  setRoleColors: state.setRoleColors,
  allSelfConnectingEdges: state.allSelfConnectingEdges,
  setAllSelfConnectingEdges: state.setAllSelfConnectingEdges,
  currentStates: state.states,
  setCurrentStates: state.setStates,
  addNewStateItem: state.addNewStateItem,
  edgeType: state.edgeType,
  setEdgeType: state.setEdgeType,
  colorTheme: state.colorTheme,
  setColorTheme: state.setColorScheme,
});

const WorkflowCreator = () => {
  const hasHydrated = useHydration();

  const {
    processes,
    addProcess,
    toggleRoleForProcess,
    activeProcessName,
    setActiveProcessName,
    activeRole,
    setActiveRole,
    allEdges,
    setAllEdges,
    roles,
    setRoles,
    nodes,
    setNodes,
    roleColors,
    setRoleColors,
    allSelfConnectingEdges,
    setAllSelfConnectingEdges,
    currentStates,
    setCurrentStates,
    addNewStateItem,
    edgeType,
    setEdgeType,
    colorTheme,
    setColorTheme,
  } = useMainStore(storeSelector, shallow);

  const filteredStates = useMainStore(
    useCallback((state) => state.filteredStates, [currentStates])
  );

  const headerStyle: CSSProperties = {
    backgroundColor: colorTheme ? "#6E7888" : "#001529",
    padding: "25px",
    height: "80px",
    display: "inline-flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  useEffect(() => {
    const storage = localStorage.getItem("main-store");

    if (storage && JSON.parse(storage).state?.nodes.length) {
      setNodes(JSON.parse(storage).state?.nodes || []);
    } else {
      setNodes(initialNodes);
    }
  }, []);

  const addNewRole = ({ color, name }: { color: string; name?: string }) => {
    if (!name) return;

    const newRolesObj = {
      ...roles,
      [name]: Math.max(...Object.values(roles)) + 1,
    };

    setRoles(newRolesObj);
    setRoleColors({ ...roleColors, [name]: color });
    toggleRoleForProcess(name);
    setActiveRole(name);
  };

  const findStateNameByNode = useCallback(
    (nodeId: string): string | undefined => {
      const foundNode = nodes.find((node) => node.id === nodeId);

      return foundNode?.data?.label;
    },
    [nodes]
  );

  const updateNodesColor = useCallback(() => {
    setNodes(
      nodes.map((n: any) => ({
        ...n,
        data: {
          ...n?.data,
          color: roleColors?.[activeRole] || "#d4d4d4",
        },
      }))
    );
  }, [activeRole, roleColors, setNodes, nodes]);

  const updateColor = useCallback(
    (updatedColor: string) => {
      setRoleColors({ ...roleColors, [activeRole]: updatedColor });
      updateNodesColor();
    },
    [activeRole, setRoleColors, roleColors, updateNodesColor]
  );

  const availableProcesses = processes.map((p) => p.ProcessName);

  const activeProcess = processes.find(
    (process: WorkflowProcess) => process.ProcessName === activeProcessName
  );

  const roleList = Object.keys(roles).map((role) => {
    return {
      label: role,
      value: activeProcess?.roles?.some((r) => r.RoleName === role) || false,
    };
  });

  const addNewProcessAndSelect = ({ name }: { name: string }) => {
    const modalOptions: ModalFuncProps = {
      title: "Unsaved Changes Detected!",
      content: "Save Changes Before Creating New Process?",
      width: 700,
      centered: true,

      footer: [
        <Space style={{ marginTop: "20px" }}>
          <Button
            onClick={() => {
              console.log("return");
            }}
          >
            Return to Current Process
          </Button>
          <Button type="primary" danger>
            Continue Without Saving
          </Button>
          <Button
            onClick={() => (addProcess(name), setActiveProcessName(name))}
            type="primary"
          >
            Save Progress And Continue
          </Button>
        </Space>,
      ],
    };
    return ModalInstance({ modalType: "confirm", modalOptions });
  };

  if (!hasHydrated) {
    return (
      <Spin
        size="large"
        style={{ position: "absolute", top: "50%", left: "50%" }}
        tip={
          <Title level={4} style={{ color: "blue" }}>
            ...Loading State
          </Title>
        }
      />
    );
  }
  return (
    <ConfigProvider
      theme={
        colorTheme
          ? { algorithm: theme.defaultAlgorithm }
          : { algorithm: theme.darkAlgorithm }
      }
    >
      <Space direction="vertical" style={spaceContainer}>
        <ReactFlowProvider>
          <Layout style={layoutContainer}>
            <Layout>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Header style={headerStyle}>
                  <SelectBox
                    useStyle={{ flexGrow: 1, maxWidth: "360px" }}
                    selectOnChange={setActiveProcessName}
                    addNew={addNewProcessAndSelect}
                    type="process"
                    selectValue={activeProcessName}
                    items={availableProcesses}
                    placeholder="Select Process"
                    hasColorInput={false}
                  />
                  <Title level={2} style={activeRoleTitleStyle}>
                    {activeRole}
                  </Title>
                  <ActiveRoleSettings
                    roleIsToggled={
                      !!activeProcess?.roles?.some(
                        (r) => r.RoleName === activeRole
                      )
                    }
                    updateColor={updateColor}
                    color={roleColors[activeRole]}
                    toggleRole={() => toggleRoleForProcess(activeRole)}
                    useStyle={{ flexGrow: 1, color: "white" }}
                  />
                </Header>
              </ErrorBoundary>
              <Content className="dndflow">
                <ReactFlowBase
                  allSelfConnectingEdges={allSelfConnectingEdges}
                  setAllSelfConnectingEdges={setAllSelfConnectingEdges}
                  roleColors={roleColors}
                  updateNodesColor={updateNodesColor}
                  activeRole={activeRole}
                />
              </Content>
            </Layout>
            <Sidebar
              theme={colorTheme}
              children={
                <>
                  <StateCollapseBox
                    items={filteredStates(nodes)}
                    addNew={addNewStateItem}
                    colorTheme={colorTheme}
                  />
                  <SelectBox
                    addNew={addNewRole}
                    placeholder="Select Role"
                    selectValue={activeRole}
                    items={roleList}
                    type={"role"}
                    hasColorInput
                    useStyle={{ width: "100%" }}
                    multiselectHandler={(el) => toggleRoleForProcess(el.label)}
                    selectOnChange={setActiveRole}
                  />
                  <pre
                    style={{
                      maxHeight: "20em",
                      overflow: "scroll",
                      color: colorTheme ? "black" : "white",
                    }}
                  >
                    {JSON.stringify(
                      OutputJSON({
                        activeRole,
                        allEdges,
                        allSelfConnectingEdges,
                        findStateNameByNode,
                      }),
                      null,
                      2
                    )}
                  </pre>
                  <ToggleEdgeTypes
                    edgeType={edgeType}
                    setEdgeType={setEdgeType}
                  />
                  <div style={switchStyle}>
                    <Space>
                      <Icon
                        style={{
                          fontSize: "20pt",
                          color: colorTheme ? "black" : "white",
                        }}
                        component={SunSvg}
                      />
                      <Switch
                        size="small"
                        onChange={() => setColorTheme()}
                        style={{ margin: "10px" }}
                      />
                      <Icon
                        style={{
                          fontSize: "20pt",
                          color: colorTheme ? "black" : "white",
                        }}
                        component={MoonSvg}
                      />
                    </Space>
                  </div>
                </>
              }
            />
          </Layout>
        </ReactFlowProvider>
      </Space>
    </ConfigProvider>
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
