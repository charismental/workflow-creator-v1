import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  Edge,
  EdgeTypes,
  ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState
} from "reactflow";

import defaultEdgeOptions from "data/defaultEdgeOptions";
import isEqual from "lodash.isequal";
import "reactflow/dist/style.css";
import getId from "utils/getId";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import { RoleList, roleColors } from "../data/data";
import initialNodes from "../data/initialNodes";
import "./css/style.css";

const initialEdges: Edge[] = [];

const connectionLineStyle = {
  strokeWidth: 1.5,
  stroke: "black",
};

const nodeTypes = {
  custom: StateNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

let id = 11;

// don't do this
const initialRole = "Intake-Specialist";
const initialAllEdges: any = {};
const initialAllStates: any = {};
Object.keys(RoleList).forEach((role) => {
  initialAllEdges[role] = [];
  initialAllStates[role] = [];
});

const ReactFlowBase: FC = (props: any): JSX.Element => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [activeRole, setActiveRole] = useState(initialRole);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [allEdges, setAllEdges] = useState(initialAllEdges);
  const [allCanSeeStates, setAllCanSeeStates] = useState(initialAllStates);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();
  const [roles, setRoles] = useState(RoleList);
  const [roleColor, setRoleColor] = useState(roleColors);

  const toggleCanSeeState = useCallback(
    (stateId: string) => {
      let activeRoleCanSee = allCanSeeStates[activeRole];

      if (activeRoleCanSee.includes(stateId)) {
        activeRoleCanSee = activeRoleCanSee.filter(
          (state: string) => state !== stateId
        );
      } else {
        activeRoleCanSee.push(stateId);
      }

      setAllCanSeeStates({
        ...allCanSeeStates,
        [activeRole]: activeRoleCanSee,
      });
    },
    [activeRole, allCanSeeStates, setAllCanSeeStates]
  );

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => {
        const updatedEdges = [
          ...(allEdges?.[activeRole] || []),
          ...eds.slice(-1),
        ].map((edg, i) => ({
          ...edg,
          id: `${edg.id + i}`,
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
      nodes.some(
        (n) => n?.data.color !== roleColor[activeRole as keyof typeof roles]
      )
    ) {
      setNodes(
        nodes.map((n) => ({
          ...n,
          data: {
            ...n?.data,
            color: roleColor?.[activeRole as keyof typeof roles] || "#d4d4d4",
          },
        }))
      );
    }

    setEdges(() => allEdges?.[activeRole] || []);
  }, [activeRole, nodes]);

  useEffect(() => {
    const uniqueEdges = (arr: any) => {
      return arr.filter(
        (v: any, i: any, a: any) =>
          a.findIndex((v2: any) =>
            ["target", "source"].every((k) => v2[k] === v[k])
          ) === i
      );
    };

    const updatedEdges = {
      ...allEdges,
      [activeRole]: uniqueEdges(edges),
    };

    if (!isEqual(allEdges, updatedEdges)) {
      setAllEdges(updatedEdges);
      // console.log(JSON.stringify(allEdges, null, 2));
    }
  }, [edges]);

  const onDragOver = useCallback(
    (event: any) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      // don't do this...
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()!;

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }
      
      // don't do this either
      const position = reactFlowInstance!.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(id),
        type: "custom",
        position,
        data: { label: type, color: roleColor[activeRole as keyof typeof RoleList], toggleCanSeeState },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, activeRole]
  );

  return (
    <>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  toggleCanSeeState,
                  isCanSee: allCanSeeStates?.[activeRole]?.includes(node.id),
                },
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
        </ReactFlowProvider>
      </div>
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

export default ReactFlowBase;
