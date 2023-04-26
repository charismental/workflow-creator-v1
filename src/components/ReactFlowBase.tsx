import { DragOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import isEqual from "lodash.isequal";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Edge,
  NodeTypes,
  ReactFlowInstance,
  SelectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import useMainStore, { MainActions, MainState } from "store";
import getItem from "utils/getItem";
import logError from "utils/logError";
import { shallow } from "zustand/shallow";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import "../css/style.css";
import ContextMenu from "./ContextMenu";
import CustomControls from "./CustomControls";

const { Text } = Typography;

const nodeTypes: NodeTypes = {
  custom: StateNode,
};

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
  edgeType: state.edgeType,
  lightMode: state.lightMode,
  contextMenuItems: state.contextMenuItems,
  activeProcessName: state.activeProcessName,
});

interface ReactFlowBaseProps {
  allSelfConnectingEdges: any;
  setAllSelfConnectingEdges: any;
  roleColors: any;
  activeRole: any;
  updateNodesColor: any;
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
    if (reactFlowInstance && reactFlowInstance.viewportInitialized)
      reactFlowInstance.fitView();
  }, [reactFlowInstance]);

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
    lightMode,
    contextMenuItems,
    activeProcessName,
  } = useMainStore(selector, shallow);

  const connectionLineStyle = {
    strokeWidth: 1.5,
    stroke: lightMode ? "black" : "white",
  };

  const {
    allSelfConnectingEdges,
    setAllSelfConnectingEdges,
    roleColors,
    activeRole,
    updateNodesColor,
  } = props;

  const setMenuItems = useMainStore(
    useCallback((state) => state.setMenuItems, [])
  );

  const onPaneContextMenu = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    return setMenuItems([
      getItem(
        <Text style={{ fontSize: "18px" }}>
          Process Name: {activeProcessName}
        </Text>,
        1,
        null
      ),
      getItem(
        <Text style={{ fontSize: "18px" }}>Active Role: {activeRole}</Text>,
        2,
        null
      ),
    ]);
  };

  const openEdgeContextMenu = (e: React.MouseEvent, el: Edge) => {
    console.log("edge context");
    e.preventDefault();
    return setMenuItems([
      getItem(
        <Text style={{ fontSize: "18px" }}>Source: {el.source}</Text>,
        1,
        null
      ),
      getItem(
        <Text style={{ fontSize: "18px" }}>Target: {el.target}</Text>,
        2,
        null
      ),
    ]);
  };

  const openNodeContextMenu = (e: React.MouseEvent, node: any) => {
    console.log("node context");
    console.log(node);
    e.preventDefault();
    setMenuItems([
      getItem("Position", 1, <DragOutlined />, [
        getItem(<Text>X: {node.position.x}</Text>, "x", null),
        getItem(<Text>Y: {node.position.y}</Text>, "y", null),
      ]),
      getItem("Dimensions", 2, <DragOutlined rotate={45} />, [
        getItem(`width: ${node.width} `, "w", null),
        getItem(`height: ${node.height}`, "h", null),
      ]),
    ]);
  };

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

  useEffect(() => {
    if (
      nodes.length &&
      nodes.some((n: any) => n?.data.color !== roleColors[activeRole])
    ) {
      updateNodesColor();
    }

    if (isEqual(edges, allEdges[activeRole])) {
      return
    }
    setEdges(allEdges?.[activeRole] || []);
  }, [activeRole, nodes, allEdges[activeRole]]);

  const uniqueEdges = (arr: any) => {
    return arr.filter(
      (v: any, i: any, a: any) =>
        a.findIndex((v2: any) =>
          ["target", "source"].every((k) => v2[k] === v[k])
        ) === i
    );
  };

  // TODO: handle this intentionally on all edge changes
  useEffect(() => {
    console.log("set edges");
    const updatedEdges = {
      ...allEdges,
      [activeRole]: uniqueEdges(edges),
    };

    if (isEqual(allEdges, updatedEdges)) {
      return 
    }
    setAllEdges(updatedEdges);
  }, [edges]);

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
          <ContextMenu items={contextMenuItems}>
        <ErrorBoundary fallbackRender={({error, resetErrorBoundary}) => (
          <div>
            <h1>Error occured in ReactFlowBase.tsx</h1>
            <details>{error.message}</details>
            <button onClick={resetErrorBoundary}>Reset Error</button>
          </div>
        )} onError={logError}>
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
              edges={allEdges?.[activeRole] || []}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              selectionMode={SelectionMode.Partial}
              onError={(e) => console.log("ReactFlow error: ", e)}
              connectionMode={ConnectionMode.Loose} // 'strict' (only source to target connections are possible) or 'loose' (source to source and target to target connections are allowed)
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              connectionLineComponent={CustomConnectionLine}
              connectionLineStyle={connectionLineStyle}
              onPaneContextMenu={onPaneContextMenu}
              onEdgeContextMenu={openEdgeContextMenu}
              onNodeContextMenu={openNodeContextMenu}
            >
              <Background variant={BackgroundVariant.Dots} />
              <CustomControls />
            </ReactFlow>
        </ErrorBoundary>
          </ContextMenu>
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
