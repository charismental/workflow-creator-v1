import {
	Edge,
	Node,
	useReactFlow,
	ReactFlowState,
	useStore,
	useStoreApi,
	ControlProps,
} from "reactflow";
import { Button, Space, Tooltip } from "antd";
import { useState } from "react";
import {
	MinusOutlined,
	PlusOutlined,
	ExpandOutlined,
	LockFilled,
	UnlockOutlined,
	SaveOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import EdgeModal from "./Modals/EdgeModal";
import NodeModal from "./Modals/NodeModal";

interface CustomControlsProps {
	allCurrentEdgesInCanvas: Edge<any>[] | undefined;
	allCurrentNodesInCanvas: Node<any>[] | undefined;
}

const isInteractiveSelector = (s: ReactFlowState) =>
	s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;

export default ({
	allCurrentEdgesInCanvas,
	allCurrentNodesInCanvas,
	onInteractiveChange,
}: CustomControlsProps & ControlProps) => {
	const store = useStoreApi();
	const isInteractive = useStore(isInteractiveSelector);
	const { fitView, zoomIn, zoomOut } = useReactFlow();
	const [edgeModalOpen, setEdgeModalOpen] = useState(false);
	const [nodeModalOpen, setNodeModalOpen] = useState(false);

	const onToggleInteractivity = () => {
		store.setState({
			nodesDraggable: !isInteractive,
			nodesConnectable: !isInteractive,
			elementsSelectable: !isInteractive,
		});
		console.log("not interactive");
		onInteractiveChange?.(!isInteractive);
	};

	return (
		<div style={{ marginBottom: "1rem", paddingLeft: "2rem" }}>
			<Space>
				<Button
					type={"default"}
					onClick={() => setEdgeModalOpen(true)}
				>
					Show Edges
				</Button>
				<Button
					type={"default"}
					onClick={() => setNodeModalOpen(true)}
				>
					Show Nodes
				</Button>
				<Tooltip
					placement="top"
					title={"Zoom In"}
				>
					<Button
						icon={<PlusOutlined />}
						type={"default"}
						onClick={() => zoomIn()}
					/>
				</Tooltip>
				<Tooltip
					placement="top"
					title={"Zoom Out"}
				>
					<Button
						icon={<MinusOutlined />}
						type={"default"}
						onClick={() => zoomOut()}
					/>
				</Tooltip>

				<Tooltip
					placement="top"
					title={"Fit To Canvas"}
				>
					<Button
						icon={<ExpandOutlined />}
						type={"default"}
						onClick={() => fitView()}
					/>
				</Tooltip>
				<Tooltip
					placement="top"
					title={"Lock Interactivity"}
				>
					<Button
						type={"default"}
						icon={isInteractive ? <UnlockOutlined /> : <LockFilled />}
						onClick={onToggleInteractivity}
					/>
				</Tooltip>
				<Tooltip
					placement="top"
					title={"Save Progress"}
				>
					<Button
						icon={<SaveOutlined />}
						type={"default"}
						onClick={() => console.log("you saved a thing!")}
					/>
				</Tooltip>
				<Tooltip
					placement="top"
					title={"Revert To Last Save Point"}
				>
					<Button
						icon={<ReloadOutlined />}
						type={"default"}
						onClick={() => console.log("you reverted a thing!")}
					/>
				</Tooltip>
				<EdgeModal
					allCurrentEdgesInCanvas={allCurrentEdgesInCanvas}
					edgeModalOpen={edgeModalOpen}
					setEdgeModalOpen={setEdgeModalOpen}
				/>
				<NodeModal
					allCurrentNodesInCanvas={allCurrentNodesInCanvas}
					nodeModalOpen={nodeModalOpen}
					setNodeModalOpen={setNodeModalOpen}
				/>
			</Space>
		</div>
	);
};
