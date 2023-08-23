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
import useMainStore, { MainActions, MainState } from "store";
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
import { NumberBoolean } from "types";

const connectionLineStyle = {
	strokeWidth: 1.5,
	stroke: "black",
};

const nodeTypes: NodeTypes = {
	state: State,
	fullHandles: StateWithFullHandles,
	label: Label,
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
	edgeType: state.edgeType,
	helperLines: state.helperLines,
	selectedEdge: state.selectedEdge,
	setSelectedEdge: state.setSelectedEdge,
	setPathForEdge: state.setPathForEdge,
});

interface ReactFlowBaseProps {
	activeRoleColor?: string;
	activeRole: any;
	roleIsToggled: boolean;
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
		edgeType,
		helperLines,
		selectedEdge,
		setSelectedEdge,
		setPathForEdge,
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
	});

	const fullHandles = edgeType === "straight";

	const nodes = computedNodes({
		process: activeProcess,
		showAllRoles,
		activeRole,
		showAllConnections: showAllConnectedStates,
		fullHandles,
	});

	const customConnectionLineMap: any = {
		straight: { component: CustomConnectionLine },
		step: { connectionLineType: ConnectionLineType.SmoothStep },
		bezier: { connectionLineType: ConnectionLineType.Bezier },
		smart: { connectionLineType: ConnectionLineType.Straight },
	};
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
				{/* horizontal helper line */}
				{typeof helperLines[1] === 'number' && (
					<div style={{
						position: "absolute",
						zIndex: 5,
						top: `${helperLines[1]}px`,
						backgroundColor: "green",
						width: "100%",
						height: "2px",
					}} />
				)}
				{/* vertical helper line */}
					<div style={{
						position: "absolute",
						zIndex: 5,
						left: `${helperLines[0] || 0}px`,
						backgroundColor: "green",
						width: "2px",
						height: "100%",
						opacity: typeof helperLines[0] === 'number' ? 1 : 0,
					}} />
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
					onEdgeClick={(_, {source, target, data}) => setSelectedEdge({source, target, ...(data?.role && { role: data.role })})}
					snapGrid={snapGrid}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
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
