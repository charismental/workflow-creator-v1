import { FluentProvider, Text, makeStyles, shorthands, teamsHighContrastTheme, teamsLightTheme } from '@fluentui/react-components';
import defaultEdgeOptions from "data/defaultEdgeOptions";
import isEqual from "lodash.isequal";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import { useMainStore } from 'store';
import getId from "utils/getId";
import CustomConnectionLine from "./components/CustomConnectionLine";
import FloatingEdge from "./components/FloatingEdge";
import Sidebar from "./components/Sidebar";
import StateNode from "./components/StateNode";
import "./css/style.css";
import { RoleList, StateList, roleColors } from "./data/data";
import initialNodes from './data/initialNodes';

const initialEdges = [];
// const initialEdges: Edge[]= [];

const useStyles = makeStyles({
  header: {
    width: '100%',
    height: '10%',
    ...shorthands.borderBottom('1px', 'solid', 'black')
  },
  headerText: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold'
  }
})

const connectionLineStyle = {
  strokeWidth: 1.5,
  stroke: "black"
};

const nodeTypes = {
  custom: StateNode
};

const edgeTypes = {
  floating: FloatingEdge
};



let id = 11;

// don't do this
const initialRole = "Intake-Specialist";
const initialAllEdges = {};
const initialAllStates = {};
Object.keys(RoleList).forEach((role) => {
  initialAllEdges[role] = [];
  initialAllStates[role] = [];
});

const WorkflowCreator = () => {
  const {darkMode} = useMainStore();
  const style = useStyles();
  const reactFlowWrapper = useRef(null);
  const [activeRole, setActiveRole] = useState(initialRole);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [allEdges, setAllEdges] = useState(initialAllEdges);
  const [allCanSeeStates, setAllCanSeeStates] = useState(initialAllStates);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [states, setState] = useState(StateList);
  const [roles, setRoles] = useState(RoleList);
  const [roleColor, setRoleColor] = useState(roleColors)

  const addNewStateOrRole = (value, color, newStateOrRoleName) => {

    if (newStateOrRoleName) {
      let newId = Math.max(...Object.values(states)) + 1;

      switch (value) {
        case "state":
          const newStatesObj = {
            ...states,
            [newStateOrRoleName]: newId,
          };

          setState(newStatesObj);
          break;
        case "role":
          newId = Math.max(...Object.values(roles)) + 1;

          const newRolesObj = {
            ...roles,
            [newStateOrRoleName]: newId
          };

          setRoles(newRolesObj);
          setRoleColor({...roleColor, [newStateOrRoleName]: color})
          console.log(roleColor)
          setAllEdges({ ...allEdges, [newStateOrRoleName]: [] });
          setAllCanSeeStates({ ...allCanSeeStates, [newStateOrRoleName]: [] });
          break;
        default:
          return;
      }
    }
  };

  const toggleCanSeeState = useCallback(
    (stateId) => {
      let activeRoleCanSee = allCanSeeStates[activeRole];

      if (activeRoleCanSee.includes(stateId)) {
        activeRoleCanSee = activeRoleCanSee.filter(
          (state) => state !== stateId
        );
      } else {
        activeRoleCanSee.push(stateId);
      }

      setAllCanSeeStates({
        ...allCanSeeStates,
        [activeRole]: activeRoleCanSee
      });
    },
    [activeRole, allCanSeeStates, setAllCanSeeStates]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updatedEdges = [
          ...(allEdges?.[activeRole] || []),
          ...eds.slice(-1)
        ].map((edg, i) => ({
          ...edg,
          id: `${edg.id + i}`
          // type: "smoothstep"
        }));

        return addEdge({ ...params, data: { setEdges } }, updatedEdges);
      });
    },
    [setEdges, allEdges, activeRole]
  );

  useEffect(() => {
    if (
      nodes.length &&
      nodes.some((n) => n?.data.color !== roleColor[activeRole])
    ) {
      setNodes(
        nodes.map((n) => ({
          ...n,
          data: { ...n?.data, color: roleColor?.[activeRole] || '#d4d4d4' }
        }))
      );
    }

    setEdges(() => allEdges?.[activeRole] || []);
  }, [activeRole, nodes]);

  useEffect(() => {
    const uniqueEdges = (arr) => {
      return arr.filter(
        (v, i, a) =>
          a.findIndex((v2) =>
            ["target", "source"].every((k) => v2[k] === v[k])
          ) === i
      );
    };

    const updatedEdges = {
      ...allEdges,
      [activeRole]: uniqueEdges(edges)
    };

    if (!isEqual(allEdges, updatedEdges)) {
      setAllEdges(updatedEdges);
      // console.log(JSON.stringify(allEdges, null, 2));
    }
  }, [edges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      });

      const newNode = {
        id: getId(),
        type: "custom",
        position,
        data: { label: type, color: roleColor[activeRole], toggleCanSeeState }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, activeRole]
  );

  const filteredStates = Object.keys(states).filter((state) => {
    return !nodes.some((n) => n?.data?.label === state);
  });

  const findStateNameByNode = (nodeId) => {
    const foundNode = nodes.find((node) => node.id === nodeId);

    return foundNode?.data?.label || nodeId;
  };

  const outputJSON = {
    [activeRole]: {
      canSee: allCanSeeStates?.[activeRole].map(findStateNameByNode),
      canTransition: (allEdges?.[activeRole] || []).map(
        ({ source, target }) => {
          return {
            source: findStateNameByNode(source),
            target: findStateNameByNode(target)
          };
        }
      )
    }
  };

  return (
    <>
      <FluentProvider theme={darkMode ? teamsHighContrastTheme : teamsLightTheme} style={{width: '100%', height: '100%'}}>
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
    <header className={style.header}>
      <Text className={style.headerText}>{activeRole}</Text>
    </header>
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                toggleCanSeeState,
                isCanSee: allCanSeeStates?.[activeRole]?.includes(node.id)
              }
            }))}
            edges={allEdges?.[activeRole] || []}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineComponent={CustomConnectionLine}
            connectionLineStyle={connectionLineStyle}
          >
          </ReactFlow>
            <Controls />
        </div>
        <Sidebar
          stateList={filteredStates}
          roleList={Object.keys(roles)}
          setActiveRole={setActiveRole}
          output={outputJSON}
          addNewStateOrRole={addNewStateOrRole}
        />
      </ReactFlowProvider>
    </div>
      </FluentProvider>
    </>
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
