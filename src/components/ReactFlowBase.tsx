import "reactflow/dist/style.css";
import "../css/style.css";
import { Typography } from "antd";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import { FC, useCallback, useEffect, useRef } from "react";
import ReactFlow, { Background, BackgroundVariant, MiniMap, NodeTypes } from "reactflow";
import { MainActions, MainState } from "store";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import { computedEdges, computedNodes } from "utils";
import LabelNode from "./LabelNode";
import { WorkflowState } from "types/workflowTypes";

const { Text } = Typography;

const connectionLineStyle = {
	strokeWidth: 1.5,
	stroke: "black",
};

const nodeTypes: NodeTypes = {
	custom: StateNode,
	label: LabelNode,
};

interface ReactFlowBaseProps {
	activeRoleColor?: string;
	activeRole: any;
	roleIsToggled: boolean;
	showMinimap: MainState["showMinimap"];
	setStatesForActiveProcess: MainActions["setStatesForActiveProcess"];
	onNodesChange: MainActions["onNodesChange"];
	onConnect: MainActions["onConnect"];
	activeProcess: MainState["activeProcess"];
	reactFlowInstance: MainState["reactFlowInstance"];
	setReactFlowInstance: MainActions["setReactFlowInstance"];
	showAllRoles: MainState["showAllRoles"];
	showAllConnectedStates: MainState["showAllConnectedStates"];
	setContextMenuNodeId: MainActions["setContextMenuNodeId"];
	contextMenuNodeId: MainState["contextMenuNodeId"];
}
const edgeTypes: any = {
	floating: FloatingEdge,
};

const ReactFlowBase: FC<ReactFlowBaseProps> = ({
	activeProcess,
	activeRoleColor,
	activeRole,
	roleIsToggled,
	showAllConnectedStates,
	showAllRoles,
	showMinimap,
	setContextMenuNodeId,
	setReactFlowInstance,
	setStatesForActiveProcess,
	onConnect,
	onNodesChange,
	reactFlowInstance,
	contextMenuNodeId,
}): JSX.Element => {
	const reactFlowWrapper = useRef<HTMLDivElement>(null);

	const fitView = (timeout = 0) =>
		setTimeout(() => reactFlowInstance && reactFlowInstance.fitView(), timeout);

	useEffect(() => {
		fitView();
	}, [showAllRoles, showAllConnectedStates]);

	useEffect(() => {
		fitView(50);
	}, [reactFlowInstance]);

	useEffect(() => {
		function handleClickOutside(e: any) {
			const node: Node = e.target;

			if (!document.getElementsByClassName("ant-popover")[0]?.contains(node)) {
				setContextMenuNodeId(undefined);
			}
		}

		if (contextMenuNodeId) document.addEventListener("click", handleClickOutside);
		else document.removeEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [contextMenuNodeId, setContextMenuNodeId]);

	const activeProcessStates = activeProcess?.States || [];

	const edges = computedEdges({
		roles: activeProcess?.Roles || [],
		activeRole,
		showAllRoles,
		showAllConnections: showAllConnectedStates,
	});

	const nodes = computedNodes({
		process: activeProcess,
		showAllRoles,
		activeRole,
		showAllConnections: showAllConnectedStates,
	});

	const openNodeContextMenu = (e: React.MouseEvent, node: Node | any) => {
		e.preventDefault();
		setContextMenuNodeId(node.id);
	};

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
			if (!type || !reactFlowInstance || !reactFlowBounds) return;

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});

			const newState: WorkflowState = {
				StateName: type,
				StateId: null,
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder:
					Math.max(...activeProcessStates.map(({ DisplayOrder }) => DisplayOrder || 0)) + 10,
				properties: { ...position },
			};

			const updatedStates = activeProcessStates.concat(newState);
			setStatesForActiveProcess(updatedStates);
		},
		[reactFlowInstance, setStatesForActiveProcess, activeRole, nodes]
	);

	return (
		<>
			<div
				className="reactflow-wrapper"
				ref={reactFlowWrapper}
				id="download"
				style={!roleIsToggled ? { pointerEvents: "none" } : {}}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onConnect={onConnect}
					onInit={setReactFlowInstance}
					onDrop={onDrop}
					onDragOver={onDragOver}
					fitView
					snapToGrid
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					proOptions={{ hideAttribution: true }}
					defaultEdgeOptions={defaultEdgeOptions}
					connectionLineComponent={CustomConnectionLine}
					connectionLineStyle={connectionLineStyle}
					onNodeContextMenu={openNodeContextMenu}
				>
					{showMinimap && (
						<MiniMap
							nodeColor={activeRoleColor}
							nodeStrokeColor={"black"}
							nodeStrokeWidth={6}
							zoomable
							maskStrokeColor="darkGray"
							maskStrokeWidth={20}
							pannable
						/>
					)}
					{!roleIsToggled && (
						<div
							style={{
								zIndex: 5000000,
								backgroundColor: "darkGrey",
								opacity: 0.5,
								width: "100%",
								height: "100%",
								position: "relative",
								cursor: "not-allowed",
							}}
						/>
					)}
					<Background variant={BackgroundVariant.Dots} />
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
