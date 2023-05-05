import { DragOutlined } from "@ant-design/icons";
import { Descriptions, Dropdown, Typography, MenuProps } from "antd";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Edge, MiniMap, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import useMainStore, { MainActions, MainState } from "store";
import { getItem, nodeByState, transformTransitionsToEdges } from "utils";
import { shallow } from "zustand/shallow";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import StateNode from "../components/StateNode";
import "../css/style.css";

const { Text } = Typography;

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
	} = useMainStore(selector, shallow);

	const { activeRole, activeRoleColor, roleIsToggled } = props;
	const [items, setItems] = useState<MenuProps["items"]>();

	// reactFlowInstance should only change on init. I think...
	useEffect(() => {
		if (reactFlowInstance?.viewportInitialized) {
			setTimeout(() => {
				reactFlowInstance.fitView();
			}, 1000);
		}
	}, [reactFlowInstance]);

	const edges = transformTransitionsToEdges(
		activeProcess?.roles?.find((r) => r.roleName === activeRole)?.transitions || []
	);

	const nodes = [...(activeProcess?.states || [])]
		.sort((a, b) => a?.displayOrder || 1 - (b?.displayOrder || 0))
		.map((state, index, arr) =>
			nodeByState({ state, index, allNodesLength: arr.length, color: activeRoleColor })
		);

	const openEdgeContextMenu = (e: React.MouseEvent, el: Edge) => {
		e.preventDefault();
		return setItems([
			getItem(<Text style={{ fontSize: "18px" }}>Source: {el.source}</Text>, 1, null),
			getItem(<Text style={{ fontSize: "18px" }}>Target: {el.target}</Text>, 2, null),
		]);
	};

	const openNodeContextMenu = (e: React.MouseEvent, node: Node | any) => {
		e.preventDefault();
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
				Properties: { ...position },
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
						nodeTypes={nodeTypes}
						edgeTypes={edgeTypes}
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
