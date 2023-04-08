import { Layout, Space, Typography } from "antd";
import ActiveRoleSettings from "components/ActiveRoleSettings";
import ReactFlowBase from "components/ReactFlowBase";
import SelectBox from "components/SelectBox";
import StateCollapseBox from "components/StateCollapseBox";
import { useCallback, useState } from "react";
import { ReactFlowProvider, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import Sidebar from "./components/Sidebar";
import "./css/style.css";
import { RoleList } from "./data";
import initialNodes from "./data/initialNodes";

const { Header, Content } = Layout;
const { Title } = Typography;

const WorkflowCreator = () => {
  const initialAllEdges = useMainStore(
    useCallback((state) => state.initialAllEdges, [])
  );
  const initialAllStates = useMainStore(
    useCallback((state) => state.initialAllStates, [])
  );
  const processes = useMainStore((state) => state.processes);
  const deleteProcess = useMainStore((state) => state.deleteProcess);
  const addProcess = useMainStore((state) => state.addProcess);
  const [activeProcessName, setActiveProcessName] = useMainStore(
    (state) => [state.activeProcessName, state.setActiveProcessName],
    shallow
  );
  const [states, setState] = useMainStore(
    (state) => [state.states, state.setState],
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
  // const [allCanSeeStates, setAllCanSeeStates] = useMainStore(state => [state.allCanSeeStates, state.setAllCanSeeStates], shallow);
  const [roles, setRoles] = useMainStore(
    (state) => [state.roles, state.setRoles],
    shallow
  );
  const [roleColors, setRoleColors] = useMainStore(
    (state) => [state.roleColors, state.setRoleColors],
    shallow
  );
  const [allCanSeeStates, setAllCanSeeStates] = useState(initialAllStates);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  Object.keys(RoleList).forEach((role) => {
    initialAllEdges[role] = [];
    initialAllStates[role] = [];
  });

  const addNewStateOrRole = ({
    type,
    color,
    name,
  }: {
    type: string;
    color?: string;
    name?: string;
  }) => {
    console.log(type, color, name);
    if (name) {
      let newId = Math.max(...Object.values(states)) + 1;

      switch (type) {
        case "state":
          const newStatesObj = {
            ...states,
            [name]: newId,
          };

          setState(newStatesObj);
          break;
        case "role":
          newId = Math.max(...Object.values(roles)) + 1;

          const newRolesObj = {
            ...roles,
            [name]: newId,
          };

          setRoles(newRolesObj);
          color && setRoleColors({ ...roleColors, [name]: color });
          setAllEdges({ ...allEdges, [name]: [] });
          setAllCanSeeStates({ ...allCanSeeStates, [name]: [] });
          break;
        default:
          return;
      }
    }
  };

  const filteredStates = Object.keys(states).filter((state) => {
    return !nodes.some((n) => n?.data?.label === state);
  });

  const findStateNameByNode = useCallback(
    (nodeId: string): string | undefined => {
      const foundNode = nodes.find((node) => node.id === nodeId);

      return foundNode?.data?.label;
    },
    [nodes]
  );

  // only 'hides' the issue of non-activeRole edges still appearing for missing nodes
  // reduce function to avoid .filter().map()
  const outputJSON = {
    [activeRole]: {
      canSee: allCanSeeStates?.[activeRole]
        .map(findStateNameByNode)
        .filter((el: any) => el),
      canTransition: (allEdges?.[activeRole] || [])
        .map(({ source, target }: { source: string; target: string }) => {
          return {
            source: findStateNameByNode(source),
            target: findStateNameByNode(target),
          };
        })
        .filter((el: any) =>
          ["source", "target"].every((key: string) => el[key])
        ),
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

    const toggleRoleForProcess = (role: string): void => {
    console.log('addRoleToProcess', role)
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <ReactFlowProvider>
        <Layout style={{ width: "100%", height: "100vh" }}>
          <Layout>
            <Header
              style={{
                backgroundColor: "#fff",
                padding: "25px",
                height: "80px",
                display: "inline-flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SelectBox
                useStyle={{ width: "300px", display: "inline-block" }}
                selectOnChange={setActiveProcessName}
                addNew={addProcess}
                type="process"
                selectValue={activeProcessName}
                items={availableProcesses}
                placeholder="Select Process"
              />
              <Title
                level={2}
                style={{ display: "inline-block", paddingBottom: "18px" }}
              >
                {activeRole}
              </Title>
              <ActiveRoleSettings
                roleIsToggled={true}
                updateColor={updateColor}
                color={roleColors[activeRole]}
                useStyle={{ lineHeight: "normal", minWidth: "200px" }}
              />
            </Header>
            <Content className="dndflow">
              <ReactFlowBase
                allCanSeeStates={allCanSeeStates}
                setAllCanSeeStates={setAllCanSeeStates}
                allEdges={allEdges}
                setAllEdges={setAllEdges}
                roleColors={roleColors}
                updateNodesColor={updateNodesColor}
                activeRole={activeRole}
                nodes={nodes}
                setNodes={setNodes}
                onNodesChange={onNodesChange}
              />
            </Content>
          </Layout>
          <Sidebar
            output={outputJSON}
            children={
              <>
                <StateCollapseBox
                  items={filteredStates}
                  addNew={addNewStateOrRole}
                />
                <SelectBox
                  addNew={addNewStateOrRole}
                  placeholder="Select Role"
                  selectValue={activeRole}
                  items={Object.keys(roles)}
                  type={"role"}
                  hasColorInput
                  multiselectHandler={toggleRoleForProcess}
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
