import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowInstance,
  NodeTypes,
  Edge,
} from "reactflow";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import isEqual from "lodash.isequal";
import { shallow } from "zustand/shallow";
import useMainStore, { MainActions, MainState } from "store";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import StateNode from "../components/StateNode";

import "../css/style.css";
import "reactflow/dist/style.css";
import { transformTransitionsToEdges } from "utils";
import { WorkflowProcess } from "store/types";

const connectionLineStyle = {
  strokeWidth: 1.5,
  stroke: "black",
};

const nodeTypes: NodeTypes = {
  custom: StateNode,
};

const selector = (state: MainState & MainActions) => ({
  nodes: state.nodes,
  activeProcess: state.activeProcess,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setNodes: state.setNodes,
  onConnect: state.onConnect,
  edgeType: state.edgeType,
});

interface ReactFlowBaseProps {
  allSelfConnectingEdges: any;
  setAllSelfConnectingEdges: any;
  roleColors: any;
  activeRole: any;
  updateNodesColor: any;
  roleIsToggled: boolean;
}
const edgeTypes: any = {
  floating: FloatingEdge,
};

const ReactFlowBase: FC<ReactFlowBaseProps> = (props): JSX.Element => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  // reactFlowInstance should only change on init. I think...
  useEffect(() => {
    if (reactFlowInstance) reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  const {
    nodes,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    activeProcess
  } = useMainStore(selector, shallow);

  const {
    allSelfConnectingEdges,
    setAllSelfConnectingEdges,
    roleColors,
    activeRole,
    updateNodesColor,
    roleIsToggled,
  } = props;
  const [items, setItems] = useState<MenuProps["items"]>();

  const edges = transformTransitionsToEdges(activeProcess?.Roles?.find(r => r.RoleName === activeRole)?.Transitions || []);

  // const edgeContextMenuItems = (el: Edge): MenuProps['items'] => {
  //   return [{label: `Source: ${el.source}`, key: 1}, {label: `Target: ${el.target}`, key:2}]
  // }

  const openEdgeContextMenu = useCallback((e: React.MouseEvent, el: Edge) => {
    e.preventDefault();
    setItems([
      { label: `Source: ${el.source}`, key: 1 },
      { label: `Target: ${el.target}`, key: 2 },
    ]);
  }, []);

  const openNodeContextMenu = useCallback((e: React.MouseEvent, node: any) => {
    e.preventDefault();
    setItems([
      {
        label: `Position: {x: ${node.position.x}, y: ${node.position.y}}`,
        key: 1,
      },
      {
        label: `Dimensions: {width: ${node.style.width}, height: ${node.style.height}}`,
        key: 2,
      },
    ]);
  }, []);

  const toggleSelfConnected = useCallback(
    (stateId: string) => {
      let activeRoleSelfConnected = allSelfConnectingEdges?.[activeRole] || [];

      if (
        activeRoleSelfConnected.some(({ target }: any) => target === stateId)
      ) {
        activeRoleSelfConnected = activeRoleSelfConnected.filter(
          ({ target }: any) => target !== stateId
        );
      } else {
        activeRoleSelfConnected.push({ source: stateId, target: stateId });
      }

      setAllSelfConnectingEdges({
        ...allSelfConnectingEdges,
        [activeRole]: activeRoleSelfConnected,
      });
    },
    [activeRole, allSelfConnectingEdges, setAllSelfConnectingEdges]
  );

  // TODO: handle these behaviors intentionally
  // useEffect(() => {
  //   if (
  //     nodes.length &&
  //     nodes.some((n: any) => n?.data.color !== roleColors[activeRole])
  //   ) {
  //     updateNodesColor();
  //   }
  //   // compare edges before doing this?
  //   setEdges(allEdges?.[activeRole] || []);
  // }, [activeRole, nodes, allEdges[activeRole]]);

  // TODO: handle this intentionally on all edge changes
  // useEffect(() => {
  //   const uniqueEdges = (arr: any) => {
  //     return arr.filter(
  //       (v: any, i: any, a: any) =>
  //         a.findIndex((v2: any) =>
  //           ["target", "source"].every((k) => v2[k] === v[k])
  //         ) === i
  //     );
  //   };

  //   const updatedEdges = {
  //     ...allEdges,
  //     [activeRole]: uniqueEdges(edges),
  //   };

  //   if (!isEqual(allEdges, updatedEdges)) {
  //     console.log(JSON.stringify(updatedEdges, null, 2))
  //     setAllEdges(updatedEdges);
  //   }
  // }, [edges]);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();

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
        id: type,
        dragHandle: ".drag-handle",
        type: "custom",
        position,
        data: {
          label: type,
          color: roleColors[activeRole],
          toggleSelfConnected,
        },
        positionAbsolute: { ...position },
      };

      const updatedNodes = nodes.concat(newNode);
      setNodes(updatedNodes);
    },
    [reactFlowInstance, setNodes, activeRole, nodes]
  );

  return (
    <>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        {/* <Dropdown menu={{ items }} trigger={["contextMenu"]}> */}
        <ReactFlow
          nodes={nodes.map((node: any) => ({
            ...node,
            data: {
              ...node.data,
              toggleSelfConnected,
              selfConnected: allSelfConnectingEdges?.[activeRole]?.some(
                ({ target }: any) => target === node.id
              ),
            },
          }))}
          // edges={allEdges?.[activeRole] || []}
          edges={edges}
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
          onEdgeContextMenu={openEdgeContextMenu}
          onNodeContextMenu={openNodeContextMenu}
        >
          {!roleIsToggled && <div style={{ zIndex: 5000000, backgroundColor: 'darkGrey', opacity: .5, width: '100%', height: '100%', position: 'relative', cursor: 'not-allowed' }} />}
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
        {/* </Dropdown> */}
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
