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
import { Button, Space, Tooltip } from "antd";
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
		onInteractiveChange?.(!isInteractive);
	};

	const ControlButtonWithTooltip = ({
		title,
		icon,
		clickEvent,
	}: {
		title: string;
		icon?: React.ReactNode;
		clickEvent:
			| (React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>)
			| undefined;
	}) => {
		return (
			<Tooltip
				placement="top"
				title={title}
			>
				<Button
					icon={icon}
					type={"default"}
					onClick={clickEvent}
				/>
			</Tooltip>
		);
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
				<ControlButtonWithTooltip
					title={"Zoom In"}
					icon={<PlusOutlined />}
					clickEvent={() => zoomIn()}
				/>
				<ControlButtonWithTooltip
					title={"Zoom Out"}
					icon={<MinusOutlined />}
					clickEvent={() => zoomOut()}
				/>
				<ControlButtonWithTooltip
					title={"Fit To Canvas"}
					icon={<ExpandOutlined />}
					clickEvent={() => fitView()}
				/>
				<ControlButtonWithTooltip
					title={"Lock Interactivity"}
					icon={isInteractive ? <UnlockOutlined /> : <LockFilled />}
					clickEvent={onToggleInteractivity}
				/>
				<ControlButtonWithTooltip
					title={"Save Progress"}
					icon={<SaveOutlined />}
					clickEvent={() => console.log("you saved a thing!")}
				/>
				<ControlButtonWithTooltip
					title={"Revert To Last Save Point"}
					icon={<ReloadOutlined />}
					clickEvent={() => console.log("you reverted a thing!")}
				/>
				<ControlButtonWithTooltip
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
