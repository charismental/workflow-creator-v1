import {
  Layout,
  Space,
  Typography,
  Divider,
  Spin,
  Button,
  ConfigProvider,
  theme,
  Switch,
} from "antd";
import Icon, { OneToOneOutlined } from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

import { CSSProperties, useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import useMainStore, { initialNodes } from "store";
import { WorkflowProcess } from "store/types";
import { shallow } from "zustand/shallow";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import Sidebar from "./components/Sidebar";
import "reactflow/dist/style.css";
import "./css/style.css";
import OutputJSON from "components/OutputJSON";
import ToggleEdgeTypes from "components/ToggleEdgeTypes";
import type { MainActions, MainState } from "store";
import useHydration from "hooks/useHydration";

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

const SunSvg = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <title>weather-sunny</title>
    <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
  </svg>
);

const MoonSvg = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <title>weather-night</title>
    <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
  </svg>
);

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
    setNodes(initialNodes);
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
    addProcess(name);
    setActiveProcessName(name);
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
