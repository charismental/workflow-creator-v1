import Icon, {
	ApartmentOutlined,
	ExpandOutlined,
	LockFilled,
	MinusOutlined,
	PlusOutlined,
	// ReloadOutlined,
	// SaveOutlined,
	UndoOutlined,
	RedoOutlined,
	SwapOutlined,
	TableOutlined,
	UnlockOutlined,
	EyeOutlined,
	EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Radio, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
	ControlProps,
	Edge,
	Node,
	ReactFlowState,
	useReactFlow,
	useStore,
	useStoreApi,
} from "reactflow";
import { EdgeModal, NodeModal } from "../Modals";
import { MapSvg, CustomControlButtonWithTooltip, DownloadButton } from "./";

interface CustomControlsProps {
	getCurrentEdges: (() => Edge[]) | undefined;
	getCurrentNodes: (() => Node[]) | undefined;
	undo: () => void;
	redo: () => void;
	roleIsToggled: boolean;
	toggleShowAllRoles: any;
	setShowAllConnectedStates: any;
	setEdgeType: any;
	edgeType: string;
	// saveStateSnapshot: any;
	// revertToSnapshot: any;
	setShowPortsAndCloseButtons: any;
	showPortsAndCloseButtons: boolean;
	setShowMinimap: any;
	canUndo: boolean;
	canRedo: boolean;
}

const isInteractiveSelector = (s: ReactFlowState) =>
	s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;

const CustomControls = ({
	getCurrentEdges,
	getCurrentNodes,
	onInteractiveChange,
	undo,
	redo,
	canUndo,
	canRedo,
	roleIsToggled,
	toggleShowAllRoles,
	setShowAllConnectedStates,
	setEdgeType,
	edgeType,
	// saveStateSnapshot,
	// revertToSnapshot,
	showPortsAndCloseButtons,
	setShowPortsAndCloseButtons,
	setShowMinimap,
}: CustomControlsProps & ControlProps) => {
	const store = useStoreApi();
	const isInteractive = useStore(isInteractiveSelector);
	const { fitView, zoomIn, zoomOut } = useReactFlow();
	const [edgeModalOpen, setEdgeModalOpen] = useState(false);
	const [currentEdges, setCurrentEdges] = useState<Edge[]>([]);
	const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
	const [nodeModalOpen, setNodeModalOpen] = useState(false);

	const onToggleInteractivity = (status = !isInteractive) => {
		store.setState({
			nodesDraggable: status,
			nodesConnectable: status,
			elementsSelectable: status,
		});

		onInteractiveChange?.(status);
	};

	useEffect(() => {
		if (!roleIsToggled) {
			return onToggleInteractivity();
		} else if (roleIsToggled && !isInteractive) {
			return onToggleInteractivity();
		}
	}, [roleIsToggled]);

	const getEdgesAndOpenModal = () => {
		setCurrentEdges(getCurrentEdges ? getCurrentEdges() : []);
		setEdgeModalOpen(true);
	};

	const getNodesAndOpenModal = () => {
		setCurrentNodes(getCurrentNodes ? getCurrentNodes() : []);
		setNodeModalOpen(true);
	};

	const setShowAllConnections = () => {
		onToggleInteractivity(true);
		setShowAllConnectedStates();
	};

	const radioValues = [
		{ label: "Straight", value: "straight" },
		{ label: "Step", value: "step" },
		{ label: "Bezier", value: "bezier" },
		{ label: "Smart", value: "smart" },
	];

	const items: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<Radio.Group
					value={edgeType}
					optionType="button"
					buttonStyle="solid"
					options={radioValues}
					onChange={(e) => setEdgeType(e.target.value)}
				/>
			),
		},
	];

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
					icon={roleIsToggled && isInteractive ? <UnlockOutlined /> : <LockFilled />}
					clickEvent={() => onToggleInteractivity()}
					isDisabled={!roleIsToggled}
				/>
				{/* <CustomControlButtonWithTooltip
					title={"Save Progress to Local Storage"}
					icon={<SaveOutlined />}
					clickEvent={saveStateSnapshot}
				/>
				<CustomControlButtonWithTooltip
					title={"Restore State from Local Storage"}
					icon={<ReloadOutlined />}
					clickEvent={revertToSnapshot}
				/>
				<CustomControlButtonWithTooltip
					title={"Delete Progress"}
					icon={<DeleteOutlined />}
					clickEvent={() => console.log("you deleted a thing!")}
				/> */}
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
				<DownloadButton />
				<CustomControlButtonWithTooltip
					title={"Show All Roles and Connections"}
					icon={<TableOutlined />}
					clickEvent={toggleShowAllRoles}
				/>
				<CustomControlButtonWithTooltip
					title={"Show All Connected States"}
					icon={<ApartmentOutlined />}
					clickEvent={setShowAllConnections}
				/>
				<CustomControlButtonWithTooltip
					title={showPortsAndCloseButtons ? "Hide ports" : "Show ports"}
					icon={showPortsAndCloseButtons ? <EyeOutlined /> : <EyeInvisibleOutlined />}
					clickEvent={setShowPortsAndCloseButtons}
				/>
				<Dropdown
					autoFocus
					placement="top"
					trigger={["click"]}
					menu={{ items }}
				>
					<Tooltip
						placement="right"
						title={"Toggle Edge Type"}
					>
						<Button
							onClick={(e) => e.preventDefault()}
							icon={<SwapOutlined />}
						/>
					</Tooltip>
				</Dropdown>
				<CustomControlButtonWithTooltip
					title={"Undo"}
					icon={<UndoOutlined />}
					clickEvent={undo}
					isDisabled={!canUndo}
				/>
				<CustomControlButtonWithTooltip
					title={"Redo"}
					icon={<RedoOutlined />}
					clickEvent={redo}
					isDisabled={!canRedo}
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

export { CustomControls };