import type { MenuProps } from "antd";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Edge, MiniMap, NodeTypes } from "reactflow";
import useMainStore, { MainActions, MainState } from "store";
import { shallow } from "zustand/shallow";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";

import "reactflow/dist/style.css";
import { computedEdges, computedNodes, nodeByState, transformTransitionsToEdges } from "utils";
import "../css/style.css";

const connectionLineStyle = {
	strokeWidth: 1.5,
	stroke: "black",
};

const nodeTypes: NodeTypes = {
	custom: StateNode,
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
	// const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

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
	} = useMainStore(selector, shallow);

	const { activeRole, activeRoleColor, roleIsToggled } = props;
	const [items, setItems] = useState<MenuProps["items"]>();

	// reactFlowInstance should only change on init. I think...
	useEffect(() => {
		if (reactFlowInstance) reactFlowInstance.fitView();
	}, [reactFlowInstance, showAllRoles]);

	const edges = computedEdges({ roles: activeProcess?.roles || [], activeRole, showAllRoles })

	const nodes = computedNodes({ process: activeProcess, showAllRoles, activeRole })

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

			const newState = {
				stateName: type,
				displayOrder:
					Math.max(...activeProcessStates.map(({ displayOrder }) => displayOrder || 0)) + 10,
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
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					defaultEdgeOptions={defaultEdgeOptions}
					connectionLineComponent={CustomConnectionLine}
					connectionLineStyle={connectionLineStyle}
					onEdgeContextMenu={openEdgeContextMenu}
					onNodeContextMenu={openNodeContextMenu}
				>
					{showMinimap && (
						<MiniMap
							nodeColor={activeRoleColor}
							maskStrokeColor="darkGray"
							maskStrokeWidth={20}
							nodeStrokeWidth={3}
							zoomable
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
					{/* <Controls /> */}
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
