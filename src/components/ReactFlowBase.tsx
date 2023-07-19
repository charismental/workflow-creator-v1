import "reactflow/dist/style.css";
import "../css/style.css";
import { Typography } from "antd";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Edge, MiniMap, NodeTypes } from "reactflow";
import useMainStore, { MainActions, MainState } from "store";
import { shallow } from "zustand/shallow";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import { computedEdges, computedNodes } from "utils";
import LabelNode from "./LabelNode";
import { NumberBoolean } from "types/genericTypes";

const { Text } = Typography;

const connectionLineStyle = {
	strokeWidth: 1.5,
	stroke: "black",
};

const nodeTypes: NodeTypes = {
	custom: StateNode,
	label: LabelNode,
};

const selector = (state: MainState & MainActions) => ({
	activeProcess: state.activeProcess,
	onNodesChange: state.onNodesChange,
	setStatesForActiveProcess: state.setStatesForActiveProcess,
	onConnect: state.onConnect,
	activeProcessStates: state.activeProcess?.states || [],
	reactFlowInstance: state.reactFlowInstance,
	setReactFlowInstance: state.setReactFlowInstance,
	showMinimap: state.showMinimap,
	showAllRoles: state.showAllRoles,
	showAllConnectedStates: state.showAllConnectedStates,
	setContextMenuNodeId: state.setContextMenuNodeId,
	contextMenuNodeId: state.contextMenuNodeId,
	states: state.states,
});

interface ReactFlowBaseProps {
	activeRoleColor?: string;
	activeRole: any;
	roleIsToggled: boolean;
}
const edgeTypes: any = {
	floating: FloatingEdge,
};

const ReactFlowBase: FC<ReactFlowBaseProps> = (props): JSX.Element => {
	const reactFlowWrapper = useRef<HTMLDivElement>(null);

	const {
		showMinimap,
		setStatesForActiveProcess,
		onNodesChange,
		onConnect,
		activeProcess,
		activeProcessStates,
		reactFlowInstance,
		setReactFlowInstance,
		showAllRoles,
		showAllConnectedStates,
		setContextMenuNodeId,
		contextMenuNodeId,
		states,
	} = useMainStore(selector, shallow);

	const { activeRole, activeRoleColor, roleIsToggled } = props;

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

	const edges = computedEdges({
		roles: activeProcess?.roles || [],
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

	// const openEdgeContextMenu = (e: React.MouseEvent, el: Edge) => {
	// 	e.preventDefault();
	// 	return setItems([
	// 		getItem(<Text style={{ fontSize: "18px" }}>Source: {el.source}</Text>, 1, null),
	// 		getItem(<Text style={{ fontSize: "18px" }}>Target: {el.target}</Text>, 2, null),
	// 	]);
	// };

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

			const initialNumberBoolean: NumberBoolean = 0;

			// let displayOrder = 10;
			// if (activeProcessStates.length) {
			// 	displayOrder = Math.max(...activeProcessStates.map(({ displayOrder = 0 }) => displayOrder || 0)) + 10
			// }
			const foundState = states.find((s) => s.stateName === type);

			const newState = {
				...(foundState && { ...foundState }),
				requiresRoleAssignment: initialNumberBoolean,
				requiresUserAssignment: initialNumberBoolean,
				stateName: type,
				stateId: foundState?.stateId || null,
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
