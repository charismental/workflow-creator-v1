import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeTypes,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  NodeTypes
} from "reactflow";

import defaultEdgeOptions from "data/defaultEdgeOptions";
import isEqual from "lodash.isequal";
import "reactflow/dist/style.css";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import "../css/style.css";

const initialEdges: Edge[] = [];

const connectionLineStyle = {
  strokeWidth: 1.5,
  stroke: "black",
};

const nodeTypes: NodeTypes = {
  custom: StateNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

// TODO: nodes.length
let id = 11;

const getId = () => `dndnode_${++id}`

interface ReactFlowBaseProps {
  allCanSeeStates: any;
  setAllCanSeeStates: any;
  allEdges: any;
  setAllEdges: any;
  roleColors: any;
  activeRole: any;
  nodes: any;
  setNodes: any;
  onNodesChange: any;
}



const ReactFlowBase: FC<ReactFlowBaseProps> = (props): JSX.Element => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const toggleCanSeeState = useCallback(
    (stateId: string) => {
      let activeRoleCanSee = props.allCanSeeStates[props.activeRole];

      if (activeRoleCanSee.includes(stateId)) {
        activeRoleCanSee = activeRoleCanSee.filter(
          (state: string) => state !== stateId
        );
      } else {
        activeRoleCanSee.push(stateId);
      }

      props.setAllCanSeeStates({
        ...props.allCanSeeStates,
        [props.activeRole]: activeRoleCanSee,
      });
    },
    [props.activeRole, props.allCanSeeStates, props.setAllCanSeeStates]
  );

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => {
        const updatedEdges = [
          ...(props.allEdges?.[props.activeRole] || []),
          ...eds.slice(-1),
        ]

        return addEdge({ ...params, data: { setEdges } }, updatedEdges);
      });
    },
    [setEdges, props.allEdges, props.activeRole]
  );

  useEffect(() => {
    if (
      props.nodes.length &&
      props.nodes.some(
        (n: any) => n?.data.color !== props.roleColors[props.activeRole]
      )
    ) {
      props.setNodes(
        props.nodes.map((n: any) => ({
          ...n,
          data: {
            ...n?.data,
            color: props.roleColors?.[props.activeRole] || "#d4d4d4",
          },
        }))
      );
    }
    // compare edges before doing this?
    // todo: filter invalid edges from missing nodes
    setEdges(() => props.allEdges?.[props.activeRole] || []);
  }, [props.activeRole, props.nodes, props.allEdges[props.activeRole]]);

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
      ...props.allEdges,
      [props.activeRole]: uniqueEdges(edges),
    };

    if (!isEqual(props.allEdges, updatedEdges)) {
      props.setAllEdges(updatedEdges);
    }
  }, [edges]);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds =
        reactFlowWrapper.current?.getBoundingClientRect();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (!reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        dragHandle: ".drag-handle",
        type: "custom",
        position,
        data: {
          label: type,
          color: props.roleColors[props.activeRole],
          toggleCanSeeState,
        },
      };

      props.setNodes((nds: any) => nds.concat(newNode));
    },
    [reactFlowInstance, props.setNodes, props.activeRole]
  );

  return (
    <>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={props.nodes.map((node: any) => ({
            ...node,
            data: {
              ...node.data,
              toggleCanSeeState,
              isCanSee: props.allCanSeeStates?.[props.activeRole]?.includes(node.id),
            },
          }))}
          edges={props.allEdges?.[props.activeRole] || []}
          onNodesChange={props.onNodesChange}
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
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
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
