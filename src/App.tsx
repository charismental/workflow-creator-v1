import { Layout, Space, Typography } from "antd";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import useMainStore, { initialAllCanSeeStates, initialNodes } from "store";
import { WorkflowProcess } from "store/types";
import { shallow } from "zustand/shallow";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import Sidebar from "./components/Sidebar";
import "reactflow/dist/style.css";
import "./css/style.css";

const { Header, Content } = Layout;
const { Title } = Typography;

const spaceContainer: CSSProperties = {
  width: '100%'
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
  // const hasHydrated = useMainStore((state) => state._hasHydrated);
  // const initialAllState = useMainStore(
  //   useCallback((state) => state.initialAllState, [])
  // );

  const processes = useMainStore((state) => state.processes);
  const deleteProcess = useMainStore((state) => state.deleteProcess);
  const addProcess = useMainStore((state) => state.addProcess);
  const toggleRoleForProcess = useMainStore(
    (state) => state.toggleRoleForProcess
  );
  const [activeProcessName, setActiveProcessName] = useMainStore(
    (state) => [state.activeProcessName, state.setActiveProcessName],
    shallow
  );
  const [activeRole, setActiveRole] = useMainStore(
    (state) => [state.activeRole, state.setActiveRole],
    shallow
  );
  const [allEdges, setAllEdges] = useMainStore(
    (state) => [state.allEdges, state.setAllEdges],
    shallow
  );
  const [roles, setRoles] = useMainStore(
    (state) => [state.roles, state.setRoles],
    shallow
  );
  const [nodes, setNodes] = useMainStore(
    (state) => [state.nodes, state.setNodes],
    shallow
  );
  const [roleColors, setRoleColors] = useMainStore(
    (state) => [state.roleColors, state.setRoleColors],
    shallow
  );
  // const [allCanSeeStates, setAllCanSeeStates] = useMainStore((state) => [state.allCanSeeStates, state.setAllCanSeeStates], shallow);
  const [allCanSeeStates, setAllCanSeeStates] = useState<any>(initialAllCanSeeStates);
  const [currentStates, setCurrentStates] = useMainStore((state) => [state.states, state.setStates], shallow)
  const filteredStates = useMainStore(useCallback((state) => state.filteredStates, [currentStates]));
  const addNewStateItem = useMainStore((state) => state.addNewStateItem);

  useEffect(() => {
    setNodes(initialNodes);
  }, [])

  const addNewRole = ({
    color,
    name,
  }: {
    color: string;
    name?: string;
  }) => {
    if (!name) return

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
    }, [nodes]);

  // may actually be resolved now
  // only 'hides' the issue of non-activeRole edges still appearing for missing nodes
  // reduce function to avoid .filter().map()
  const outputJSON = {
    [activeRole]: {
      canSee: (allCanSeeStates?.[activeRole] || []).map(findStateNameByNode).filter((el: any) => el),
      canTransition: (allEdges?.[activeRole] || [])
        .map(({ source, target }: { source: string; target: string }) => {
          return {
            source: findStateNameByNode(source),
            target: findStateNameByNode(target),
          };
        }).filter(({ source, target }: any) => !!source && !!target)
      // Modified StateNode file to update Edges... seems to work???
      // .filter((el: any) =>
      //   ["source", "target"].every((key: string) => el[key])
      // ),
    },
  };

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

  // console.log(JSON.stringify(activeProcess, null, 2))

  const roleList = Object.keys(roles).map((role) => {
    return {
      label: role,
      value: activeProcess?.roles?.some((r) => r.RoleName === role) || false,
    };
  });


  const addNewProcessAndSelect = ({ name }: { name: string }) => {
    addProcess(name);
    setActiveProcessName(name)
  }

  // if (!hasHydrated) {
  //   return <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%' }} tip={<Title level={4} style={{ color: 'blue' }}>...Loading State</Title>} />
  // }

  return (
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
                roleIsToggled={!!activeProcess?.roles?.some((r) => r.RoleName === activeRole)}
                updateColor={updateColor}
                color={roleColors[activeRole]}
                toggleRole={() => toggleRoleForProcess(activeRole)}
                useStyle={{ flexGrow: 1 }}
              />
            </Header>
            <Content className="dndflow">
              <ReactFlowBase
                allCanSeeStates={allCanSeeStates}
                setAllCanSeeStates={setAllCanSeeStates}
                roleColors={roleColors}
                updateNodesColor={updateNodesColor}
                activeRole={activeRole}
              />
            </Content>
          </Layout>
          <Sidebar
            output={outputJSON}
            children={
              <>
                <StateCollapseBox
                  items={filteredStates(nodes)}
                  addNew={addNewStateItem}
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
              </>
            }
          />
        </Layout>
      </ReactFlowProvider>
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
