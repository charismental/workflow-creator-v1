import "reactflow/dist/style.css";
import ReactFlowBase from "components/ReactFlowBase";
import { useState } from "react";
import { ReactFlowProvider, useNodesState } from "reactflow";
import { Layout, Space, Typography } from 'antd';
import Sidebar from "./components/Sidebar";
import "./css/style.css";
import { RoleList, StateList, roleColors } from "./data/data";
import initialNodes from "./data/initialNodes";
import ProcessSelector from "components/ProcessSelector";
import SelectBox from "components/SelectBox";

const initialRole = "Intake-Specialist";
const initialAllEdges: any = {};
const initialAllStates: any = {};

Object.keys(RoleList).forEach((role) => {
  initialAllEdges[role] = [];
  initialAllStates[role] = [];
});

const { Header, Content } = Layout;
const { Title } = Typography;

const WorkflowCreator = () => {
  const [activeRole, setActiveRole] = useState(initialRole);
  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [allEdges, setAllEdges] = useState(initialAllEdges);
  const [allCanSeeStates, setAllCanSeeStates] = useState(initialAllStates);
  const [states, setState] = useState(StateList);
  const [roles, setRoles] = useState(RoleList);
  const [roleColor, setRoleColor] = useState(roleColors);

  const addNewStateOrRole = (
    type: string,
    color: string | undefined,
    label: string | undefined
  ) => {
    if (label) {
      let newId = Math.max(...Object.values(states)) + 1;

      switch (type) {
        case "state":
          const newStatesObj = {
            ...states,
            [label]: newId,
          };

          setState(newStatesObj);
          break;
        case "role":
          newId = Math.max(...Object.values(roles)) + 1;

          const newRolesObj = {
            ...roles,
            [label]: newId,
          };

          setRoles(newRolesObj);
          setRoleColor({ ...roleColor, [label]: color });
          setAllEdges({ ...allEdges, [label]: [] });
          setAllCanSeeStates({ ...allCanSeeStates, [label]: [] });
          break;
        default:
          return;
      }
    }
  };

  const filteredStates = Object.keys(states).filter((state) => {
    return !nodes.some((n) => n?.data?.label === state);
  });

  const findStateNameByNode = (nodeId: string) => {
    const foundNode = nodes.find((node) => node.id === nodeId);

    return foundNode?.data?.label || nodeId;
  };

  const outputJSON = {
    [activeRole]: {
      canSee: allCanSeeStates?.[activeRole].map(findStateNameByNode),
      canTransition: (allEdges?.[activeRole] || []).map(
        ({ source, target }: { source: string; target: string }) => {
          return {
            source: findStateNameByNode(source),
            target: findStateNameByNode(target),
          };
        }
      ),
    },
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <ReactFlowProvider>
        <Layout style={{ width: '100%', height: '100vh' }}>
          <Layout>
            <Header style={{ backgroundColor: '#fff', padding: '25px', height: '80px', display: 'inline-flex', justifyContent: 'space-between' }}>
              <SelectBox useStyle={{ width: '300px', display: 'inline-block' }} type="process" selectValue="Test Workflow" items={['Test Workflow']} placeholder="Select Process" />
              <Title level={2} style={{ display: 'inline-block', marginTop: 0 }}>
                {activeRole}
              </Title>
            </Header>
            <Content className="dndflow">
              <ReactFlowBase
                allCanSeeStates={allCanSeeStates}
                setAllCanSeeStates={setAllCanSeeStates}
                allEdges={allEdges}
                setAllEdges={setAllEdges}
                roleColor={roleColor}
                activeRole={activeRole}
                nodes={nodes}
                setNodes={setNodes}
                onNodesChange={onNodesChange}
              />
            </Content>
          </Layout>
          <Sidebar
            activeRole={activeRole}
            stateList={filteredStates}
            roleList={Object.keys(roles)}
            setActiveRole={setActiveRole}
            output={outputJSON}
            addNewStateOrRole={addNewStateOrRole}
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
