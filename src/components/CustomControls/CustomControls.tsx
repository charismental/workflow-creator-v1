import {
	DeleteOutlined,
	ExpandOutlined,
	LockFilled,
	MinusOutlined,
	PlusOutlined,
	ReloadOutlined,
	SaveOutlined,
	UnlockOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import { useState } from "react";
import {
	ControlProps,
	Edge,
	Node,
	ReactFlowState,
	useReactFlow,
	useStore,
	useStoreApi,
} from "reactflow";
import EdgeModal from "../Modals/EdgeModal";
import NodeModal from "../Modals/NodeModal";
import CustomControlButtonWithTooltip from "./CustomControlButtonWithTooltip";

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
				<CustomControlButtonWithTooltip
					title={"Zoom In"}
					icon={<PlusOutlined />}
					clickEvent={() => zoomIn()}
				/>
				<CustomControlButtonWithTooltip
					title={"Zoom Out"}
					icon={<MinusOutlined />}
					clickEvent={() => zoomOut()}
				/>
				<CustomControlButtonWithTooltip
					title={"Fit To Canvas"}
					icon={<ExpandOutlined />}
					clickEvent={() => fitView()}
				/>
				<CustomControlButtonWithTooltip
					title={"Lock Interactivity"}
					icon={isInteractive ? <UnlockOutlined /> : <LockFilled />}
					clickEvent={onToggleInteractivity}
				/>
				<CustomControlButtonWithTooltip
					title={"Save Progress"}
					icon={<SaveOutlined />}
					clickEvent={() => console.log("you saved a thing!")}
				/>
				<CustomControlButtonWithTooltip
					title={"Revert To Last Save Point"}
					icon={<ReloadOutlined />}
					clickEvent={() => console.log("you reverted a thing!")}
				/>
				<CustomControlButtonWithTooltip
					title={"Delete Progress"}
					icon={<DeleteOutlined />}
					clickEvent={() => console.log("you deleted a thing!")}
				/>
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
