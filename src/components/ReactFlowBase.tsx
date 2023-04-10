import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeTypes,
  ReactFlowInstance,
  NodeTypes
} from "reactflow";

import useMainStore, { MainActions, MainState } from "store";

const selector = (state: MainState & MainActions) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  allEdges: state.allEdges,
  setAllEdges: state.setAllEdges,
  onConnect: state.onConnect,
});

import defaultEdgeOptions from "data/defaultEdgeOptions";
import isEqual from "lodash.isequal";
import "reactflow/dist/style.css";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import "../css/style.css";
import { shallow } from "zustand/shallow";

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

const getId = () => `state_node_${++id}`

interface ReactFlowBaseProps {
  allCanSeeStates: any;
  setAllCanSeeStates: any;
  roleColors: any;
  activeRole: any;
  updateNodesColor: any;
}



const ReactFlowBase: FC<ReactFlowBaseProps> = (props): JSX.Element => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    allEdges,
    setAllEdges,
    onConnect,
  } = useMainStore(selector, shallow);

  const {
    allCanSeeStates,
    setAllCanSeeStates,
    roleColors,
    activeRole,
    updateNodesColor,
  } = props;

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

  useEffect(() => {
    if (
      nodes.length &&
      nodes.some(
        (n: any) => n?.data.color !== roleColors[activeRole]
      )
    ) {
      updateNodesColor();
    }
    // compare edges before doing this?
    // todo: filter invalid edges from missing nodes
    setEdges(allEdges?.[activeRole] || []);
  }, [activeRole, nodes, allEdges[activeRole]]);

  useEffect(() => {
    const uniqueEdges = (arr: any) => {
      // console.log(arr)
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
          color: roleColors[activeRole],
          toggleCanSeeState,
        },
      };

      setNodes((nds: any) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, activeRole]
  );

  return (
    <>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes.map((node: any) => ({
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
