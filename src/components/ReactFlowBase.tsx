import "reactflow/dist/style.css";
import "../css/style.css";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import { FC, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	ConnectionLineType,
	MiniMap,
	NodeTypes,
	SnapGrid,
} from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import CustomConnectionLine from "../components/CustomConnectionLine";
import {
	StraightEdge as straightEdge,
	StepEdge as stepEdge,
	BezierEdge as bezierEdge,
	SmartEdge as smartEdge,
} from "./Edges";
import { StateWithFullHandles, State, Label } from "./Nodes";
import { computedEdges, computedNodes } from "utils";
import { MainStore, NumberBoolean } from "types";
import { HelperLines } from "./HelperLines";

const connectionLineStyle = {
	strokeWidth: 1.5,
	stroke: "black",
};

const nodeTypes: NodeTypes = {
	state: State,
	fullHandles: StateWithFullHandles,
	label: Label,
};

const selector = (state: MainStore) => ({
	activeProcess: state.activeProcess,
	activeProcessStates: state.activeProcess?.states || [],
	reactFlowInstance: state.reactFlowInstance,
	showMinimap: state.showMinimap,
	showAllRoles: state.showAllRoles,
	showAllConnectedStates: state.showAllConnectedStates,
	showPortsAndCloseButtons: state.showPortsAndCloseButtons,
	contextMenuNodeId: state.contextMenuNodeId,
	states: state.states,
	edgeType: state.edgeType,
	helperLines: state.helperLines,
	selectedEdge: state.selectedEdge,
	hoveredEdgeNodes: state.hoveredEdgeNodes,
	updateStateProperties: state.updateStateProperties,
	updateStateProperty: state.updateStateProperty,
	removeState: state.removeState,
	onConnect: state.onConnect,
	onNodesChange: state.onNodesChange,
	setStatesForActiveProcess: state.setStatesForActiveProcess,
	setReactFlowInstance: state.setReactFlowInstance,
	setContextMenuNodeId: state.setContextMenuNodeId,
	setSelectedEdge: state.setSelectedEdge,
	setPathForEdge: state.setPathForEdge,
	setHoveredEdgeNodes: state.setHoveredEdgeNodes,
	removeTransition: state.removeTransition,
});

interface ReactFlowBaseProps {
	activeRoleColor?: string;
	activeRole: any;
	roleIsToggled: boolean;
	displayBackground?: boolean;
}

const edgeTypes: any = {
	straightEdge,
	stepEdge,
	bezierEdge,
	smartEdge,
};

const snapGrid: SnapGrid = [1, 1];

const ReactFlowBase: FC<ReactFlowBaseProps> = (props): JSX.Element => {
	const reactFlowWrapper = useRef<HTMLDivElement>(null);

	const {
		showMinimap,
		activeProcess,
		activeProcessStates,
		reactFlowInstance,
		showAllRoles,
		showAllConnectedStates,
		contextMenuNodeId,
		states,
		edgeType,
		helperLines,
		selectedEdge,
		showPortsAndCloseButtons,
		hoveredEdgeNodes,
		updateStateProperties,
		removeState,
		updateStateProperty,
		setStatesForActiveProcess,
		onNodesChange,
		onConnect,
		setReactFlowInstance,
		setContextMenuNodeId,
		setSelectedEdge,
		setPathForEdge,
		removeTransition,
		setHoveredEdgeNodes,
	} = useMainStore(selector, shallow);

	const { activeRole, activeRoleColor, roleIsToggled } = props;

	const fitView = (timeout = 0) =>
		setTimeout(() => reactFlowInstance && reactFlowInstance.fitView(), timeout);

	useEffect(() => {
		fitView();
	}, [showAllRoles, showAllConnectedStates, activeProcess?.sessionId]);

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
		edgeType,
		selectedEdge,
		setPathForEdge,
		removeTransition,
		setHoveredEdgeNodes,
		showPortsAndCloseButtons
	});

	const fullHandles = edgeType === "straight";

	const nodes = computedNodes({
		process: activeProcess,
		showAllRoles,
		activeRole,
		fullHandles,
		contextMenuNodeId,
		hoveredEdgeNodes,
		showPortsAndCloseButtons,
		updateStateProperties,
		removeState,
		updateStateProperty,
		removeTransition,
		onConnect,
	});

	const customConnectionLineMap: any = {
		straight: { component: CustomConnectionLine },
		step: { component: CustomConnectionLine },
		bezier: { connectionLineType: ConnectionLineType.Bezier },
		smart: { connectionLineType: ConnectionLineType.Straight },
	};

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

	const handleBaseClick = (e: any) => {
		if (!e?.target?.classList?.contains("react-flow__edge-interaction")) setSelectedEdge(null);
	};

	return (
		<>
			<div
				className="reactflow-wrapper"
				ref={reactFlowWrapper}
				id="download"
				style={!roleIsToggled ? { pointerEvents: "none" } : {}}
			>
				<HelperLines color="green" top={helperLines[1]} left={helperLines[0]} />
				<ReactFlow
					fitView
					snapToGrid
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onConnect={onConnect}
					onInit={setReactFlowInstance}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onClick={handleBaseClick}
					onEdgeClick={(_, { source, target, data }) => setSelectedEdge({ source, target, ...(data?.role && { role: data.role }) })}
					snapGrid={snapGrid}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					minZoom={0.2}
					proOptions={{ hideAttribution: true }}
					defaultEdgeOptions={defaultEdgeOptions}
					connectionLineComponent={customConnectionLineMap[edgeType]?.component}
					connectionLineType={customConnectionLineMap[edgeType]?.connectionLineType}
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
		const elements = document.querySelectorAll(".state-full-body");

		elements.forEach(function (element) {
			element.classList.add("drag-handle");
		});
	}
});

document.addEventListener("keyup", function (e) {
	if (e.key === "Shift") {
		const elements = document.querySelectorAll(".state-full-body");

		elements.forEach(function (element) {
			element.classList.remove("drag-handle");
		});
	}
});

export default ReactFlowBase;
