import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	ReactFlowInstance,
	NodeTypes,
	Edge,
} from "reactflow";
import { DragOutlined } from "@ant-design/icons";
import defaultEdgeOptions from "data/defaultEdgeOptions";
import { shallow } from "zustand/shallow";
import useMainStore, { MainActions, MainState } from "store";
import CustomConnectionLine from "../components/CustomConnectionLine";
import FloatingEdge from "../components/FloatingEdge";
import type { MenuProps } from "antd";
import StateNode from "../components/StateNode";
import { Dropdown, Typography, Descriptions } from "antd";
import { getItem } from "utils";
import "../css/style.css";
import "reactflow/dist/style.css";
import { nodeByState, transformTransitionsToEdges } from "utils";

const { Text, Title } = Typography;

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
	activeProcessStates: state.activeProcess?.States || [],
});

interface ReactFlowBaseProps {
	allSelfConnectingEdges: any;
	setAllSelfConnectingEdges: any;
	activeRoleColor?: string;
	activeRole: any;
	roleIsToggled: boolean;
}
const edgeTypes: any = {
	floating: FloatingEdge,
};

const ReactFlowBase: FC<ReactFlowBaseProps> = (props): JSX.Element => {
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

	// reactFlowInstance should only change on init. I think...
	useEffect(() => {
		if (reactFlowInstance) reactFlowInstance.fitView();
	}, [reactFlowInstance]);

	const {
		setStatesForActiveProcess,
		onNodesChange,
		onConnect,
		activeProcess,
		activeProcessStates,
	} = useMainStore(selector, shallow);

	const {
		allSelfConnectingEdges,
		setAllSelfConnectingEdges,
		activeRole,
		activeRoleColor,
		roleIsToggled,
	} = props;
	const [items, setItems] = useState<MenuProps["items"]>();
	const edges = transformTransitionsToEdges(
		activeProcess?.Roles?.find((r) => r.RoleName === activeRole)?.Transitions || []
	);

	const nodes = [...(activeProcess?.States || [])]
		.sort((a, b) => a?.DisplayOrder || 1 - (b?.DisplayOrder || 0))
		.map((state, index, arr) =>
			nodeByState({ state, index, allNodesLength: arr.length, color: activeRoleColor })
		);

	const openEdgeContextMenu = useCallback((e: React.MouseEvent, el: Edge) => {
		e.preventDefault();
		return setItems([
			getItem(<Text style={{ fontSize: "18px" }}>Source: {el.source}</Text>, 1, null),
			getItem(<Text style={{ fontSize: "18px" }}>Target: {el.target}</Text>, 2, null),
		]);
	}, []);

	const openNodeContextMenu = useCallback((e: React.MouseEvent, node: Node | any) => {
		e.preventDefault();
		e.preventDefault();
		setItems([
			getItem(<Title level={3}>{node.id}</Title>, 3, null, [
				getItem("Position", 1, <DragOutlined />, [
					getItem(<Text>X: {node.position.x}</Text>, "x", null),
					getItem(<Text>Y: {node.position.y}</Text>, "y", null),
				]),
				getItem("Dimensions", 2, <DragOutlined rotate={45} />, [
					getItem(`width: ${node.width} `, "w", null),
					getItem(`height: ${node.height}`, "h", null),
				]),
			]),
		]);
	}, []);

	const openPaneContextMenu = useCallback(
		() => (e: React.MouseEvent<Element, MouseEvent>) => {
			e.preventDefault();
			return setItems([
				getItem(
					<Descriptions
						style={{ fontSize: "18px", width: "min-content" }}
						title={`Process Name: ${activeProcess?.ProcessName || "Unknown Process Name"}`}
					>
						<Descriptions.Item label={"Active Role:"}>{activeRole}</Descriptions.Item>
					</Descriptions>,
					1,
					null
				),
			]);
		},
		[]
	);

	const toggleSelfConnected = useCallback(
		(stateId: string) => {
			let activeRoleSelfConnected = allSelfConnectingEdges?.[activeRole] || [];

			if (activeRoleSelfConnected.some(({ target }: any) => target === stateId)) {
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
				StateName: type,
				DisplayOrder:
					Math.max(...activeProcessStates.map(({ DisplayOrder }) => DisplayOrder || 0)) + 10,
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
				>
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
						<Controls />
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
