import "reactflow/dist/style.css";
import "../css/style.css";
import { DragOutlined } from "@ant-design/icons";
import { Descriptions, Dropdown, Typography, MenuProps } from "antd";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Edge, MiniMap, NodeTypes } from "reactflow";
import useMainStore, { MainActions, MainState } from "store";
import { shallow } from "zustand/shallow";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import { computedEdges, getItem, computedNodes } from "utils";
import LabelNode from "./LabelNode";

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
	} = useMainStore(selector, shallow);

	const { activeRole, activeRoleColor, roleIsToggled } = props;
	const [items, setItems] = useState<MenuProps["items"]>();

	const fitView = (timeout = 0) =>
		setTimeout(() => reactFlowInstance && reactFlowInstance.fitView(), timeout);

	useEffect(() => {
		fitView();
	}, [showAllRoles, showAllConnectedStates]);

	useEffect(() => {
		fitView(50);
	}, [reactFlowInstance]);

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

	const openEdgeContextMenu = (e: React.MouseEvent, el: Edge) => {
		e.preventDefault();
		return setItems([
			getItem(<Text style={{ fontSize: "18px" }}>Source: {el.source}</Text>, 1, null),
			getItem(<Text style={{ fontSize: "18px" }}>Target: {el.target}</Text>, 2, null),
		]);
	};

	const openNodeContextMenu = (e: React.MouseEvent, node: Node | any) => {
		e.preventDefault();
		setItems([
			getItem(
				<Text style={{ fontSize: "18px", textDecoration: "underline" }}>{node.id}</Text>,
				3,
				null,
				[
					getItem(
						<Text style={{ fontSize: "18px" }}>Position</Text>,
						"pos",
						<DragOutlined />,
						[
							getItem(<Text style={{ fontSize: "18px" }}>X: {node.position.x}</Text>, "x"),
							getItem(<Text style={{ fontSize: "18px" }}>Y: {node.position.y}</Text>, "y"),
						],
						"group"
					),
					getItem(
						<Text style={{ fontSize: "18px" }}>Dimensions</Text>,
						"dim",
						<DragOutlined rotate={45} />,
						[
							getItem(<Text style={{ fontSize: "18px" }}>W: {node.width}</Text>, "w"),
							getItem(<Text style={{ fontSize: "18px" }}>H: {node.height}</Text>, "h"),
						],
						"group"
					),
				],
				"group"
			),
		]);
	};

	const openPaneContextMenu = (e: React.MouseEvent<Element, MouseEvent>) => {
		e.preventDefault();
		return setItems([
			getItem(
				<Descriptions
					style={{ fontSize: "18px", width: "min-content" }}
					title={`Process Name: ${activeProcess?.processName || "Unknown Process Name"}`}
				>
					<Descriptions.Item label={"Active Role:"}>{activeRole}</Descriptions.Item>
				</Descriptions>,
				1,
				null
			),
		]);
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
			<Dropdown
				destroyPopupOnHide
				trigger={["contextMenu"]}
				menu={{ items }}
			>
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
						onEdgeContextMenu={openEdgeContextMenu}
						onNodeContextMenu={openNodeContextMenu}
						onPaneContextMenu={openPaneContextMenu}
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
						{/* <Controls /> */}
					</ReactFlow>
				</div>
			</Dropdown>
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
