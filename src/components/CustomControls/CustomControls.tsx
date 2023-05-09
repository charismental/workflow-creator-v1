import Icon, {
	DeleteOutlined,
	ExpandOutlined,
	LockFilled,
	MinusOutlined,
	PlusOutlined,
	ReloadOutlined,
	SaveOutlined,
	UnlockOutlined,
	TableOutlined,
	ApartmentOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { useCallback, useState } from "react";
import DownloadButton from "tools/DownloadImage";
import {
	ControlProps,
	Edge,
	Node,
	ReactFlowState,
	useReactFlow,
	useStore,
	useStoreApi,
} from "reactflow";
import useMainStore from "store";
import EdgeModal from "../Modals/EdgeModal";
import NodeModal from "../Modals/NodeModal";
import CustomControlButtonWithTooltip from "./CustomControlButtonWithTooltip";
import MapSvg from "./MapSvg";
import { shallow } from "zustand/shallow";

interface CustomControlsProps {
	getCurrentEdges: (() => Edge[]) | undefined;
	getCurrentNodes: (() => Node[]) | undefined;
}

const isInteractiveSelector = (s: ReactFlowState) =>
	s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;

export default ({
	getCurrentEdges,
	getCurrentNodes,
	onInteractiveChange,
}: CustomControlsProps & ControlProps) => {
	const store = useStoreApi();
	const isInteractive = useStore(isInteractiveSelector);
	const { fitView, zoomIn, zoomOut } = useReactFlow();
	const [edgeModalOpen, setEdgeModalOpen] = useState(false);
	const [currentEdges, setCurrentEdges] = useState<Edge[]>([]);
	const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
	const [nodeModalOpen, setNodeModalOpen] = useState(false);
	const setShowMinimap = useMainStore(useCallback((state) => state.setShowMinimap, []));
	const setShowAllConnectedStates = useMainStore((state) => state.setShowAllConnectedStates, shallow);
	const [showAllRoles, toggleShowAllRoles] = useMainStore((state) => [state.showAllRoles, state.toggleShowAllRoles], shallow);


	const onToggleInteractivity = (status = !isInteractive) => {
		store.setState({
			nodesDraggable: status,
			nodesConnectable: status,
			elementsSelectable: status,
		});

		onInteractiveChange?.(status);
	};

	const getEdgesAndOpenModal = () => {
		setCurrentEdges(getCurrentEdges ? getCurrentEdges() : []);
		setEdgeModalOpen(true);
	};

	const getNodesAndOpenModal = () => {
		setCurrentNodes(getCurrentNodes ? getCurrentNodes() : []);
		setNodeModalOpen(true);
	};

	const setShowAllRoles = () => {
		onToggleInteractivity(showAllRoles);
		toggleShowAllRoles();
	};

	const setShowAllConnections = () => {
		onToggleInteractivity(true);
		setShowAllConnectedStates();
	};

	return (
		<div style={{ marginBottom: "1rem", paddingLeft: "2rem" }}>
			<Space>
				<Button
					type={"default"}
					onClick={getEdgesAndOpenModal}
				>
					Show Edges
				</Button>
				<Button
					type={"default"}
					onClick={getNodesAndOpenModal}
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
					clickEvent={() => onToggleInteractivity()}
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
				<CustomControlButtonWithTooltip
					title={"Toggle Minimap"}
					icon={
						<Icon
							component={MapSvg}
							width={10}
							height={20}
						/>
					}
					clickEvent={setShowMinimap}
				/>
				<Tooltip
					title={"Download Workflow as Image"}
					placement={"top"}
				>
					<DownloadButton />
				</Tooltip>
				<CustomControlButtonWithTooltip
					title={"Show All Roles and Connections"}
					icon={<TableOutlined />}
					clickEvent={setShowAllRoles}
				/>
				<CustomControlButtonWithTooltip
					title={"Show All Connected States"}
					icon={<ApartmentOutlined />}
					clickEvent={setShowAllConnections}
				/>
				<EdgeModal
					allCurrentEdgesInCanvas={currentEdges}
					edgeModalOpen={edgeModalOpen}
					setEdgeModalOpen={setEdgeModalOpen}
				/>
				<NodeModal
					allCurrentNodesInCanvas={currentNodes}
					nodeModalOpen={nodeModalOpen}
					setNodeModalOpen={setNodeModalOpen}
				/>
			</Space>
		</div>
	);
};
