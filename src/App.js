import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Controls
} from "reactflow";

import StateNode from "./StateNode";
import FloatingEdge from "./FloatingEdge";
import CustomConnectionLine from "./CustomConnectionLine";
import Sidebar from "./Sidebar";
import { StateList, RoleList, roleColors } from "./data";
import isEqual from "lodash.isequal";

import "reactflow/dist/style.css";
import "./style.css";

const initialNodes = [
  {
    id: "dndnode_1",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: -403,
      y: -125
    },
    data: {
      label: "Application-Received",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: -403,
      y: -125
    },
    dragging: false
  },
  {
    id: "dndnode_2",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 318.50545597980437,
      y: -43.41075418112968
    },
    data: {
      label: "Intake-Complete",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 318.50545597980437,
      y: -43.41075418112968
    },
    dragging: false
  },
  {
    id: "dndnode_3",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: -161.72817608078262,
      y: -39.6334742821079
    },
    data: {
      label: "Eligibility",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: -161.72817608078262,
      y: -39.6334742821079
    },
    dragging: false
  },
  {
    id: "dndnode_4",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 67.00545597980435,
      y: -148.419135373935
    },
    data: {
      label: "Outreach",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 67.00545597980435,
      y: -148.419135373935
    },
    dragging: false
  },
  {
    id: "dndnode_5",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 545.597232565478,
      y: -146.15276743452193
    },
    data: {
      label: "Case-Review",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 545.597232565478,
      y: -146.15276743452193
    },
    dragging: false
  },
  {
    id: "dndnode_6",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 812.4630291448713,
      y: -25.23168861509922
    },
    data: {
      label: "Pending Approval",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: true,
    positionAbsolute: {
      x: 812.4630291448713,
      y: -25.23168861509922
    },
    dragging: false
  },
  {
    id: "dndnode_7",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 1563.8454402019563,
      y: -147.66367939413064
    },
    data: {
      label: "Approved",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 1563.8454402019563,
      y: -147.66367939413064
    },
    dragging: false
  },
  {
    id: "dndnode_8",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 1050.2263679394127,
      y: -144.64185547491323
    },
    data: {
      label: "Partner-Review",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 1050.2263679394127,
      y: -144.64185547491323
    },
    dragging: false
  },
  {
    id: "dndnode_9",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 1280.978112969391,
      y: -49.454402019564526
    },
    data: {
      label: "Partner-Final-Review",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 1280.978112969391,
      y: -49.454402019564526
    },
    dragging: false
  },
  {
    id: "dndnode_10",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 87.35872514988952,
      y: 93.03020511202273
    },
    data: {
      label: "Pending-Denial",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 87.35872514988952,
      y: 93.03020511202273
    },
    dragging: false
  },
  {
    id: "dndnode_11",
    dragHandle: ".drag-handle",
    type: "custom",
    position: {
      x: 1410.7989144840642,
      y: 95.43292521300096
    },
    data: {
      label: "Denied",
      color: "#4672C4"
    },
    width: 202,
    height: 32,
    selected: false,
    positionAbsolute: {
      x: 1410.7989144840642,
      y: 95.43292521300096
    },
    dragging: false
  }
];

const initialEdges = [];

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

const defaultEdgeOptions = {
  style: { strokeWidth: 1.5, stroke: "black" },
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black"
  }
};

let id = 11;
const getId = () => `dndnode_${++id}`;

// don't do this
const initialRole = "Intake-Specialist";
const initialAllEdges = {};
const initialAllStates = {};
Object.keys(RoleList).forEach((role) => {
  initialAllEdges[role] = [];
  initialAllStates[role] = [];
});

const WorkflowCreator = () => {
  const reactFlowWrapper = useRef(null);
  const [activeRole, setActiveRole] = useState(initialRole);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [allEdges, setAllEdges] = useState(initialAllEdges);
  const [allCanSeeStates, setAllCanSeeStates] = useState(initialAllStates);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [states, setState] = useState(StateList);
  const [roles, setRoles] = useState(RoleList);

  const addNewStateOrRole = (value) => {
    const newStateOrRoleName = window.prompt(
      `Please enter name of the new ${value}`
    );

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
      nodes.some((n) => n?.data.color !== roleColors[activeRole])
    ) {
      setNodes(
        nodes.map((n) => ({
          ...n,
          data: { ...n?.data, color: roleColors?.[activeRole] || '#d4d4d4' }
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
        data: { label: type, color: roleColors[activeRole], toggleCanSeeState }
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
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
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
            <Controls />
          </ReactFlow>
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
