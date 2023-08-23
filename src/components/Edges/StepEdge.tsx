import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
	EdgeProps,
	getSmoothStepPath,
	useStore as useReactFlowStore,
} from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import { Nullable } from "types";
import { simplifySVGPath } from "utils";

const foreignObjectSize = 40;

const StepEdge: FunctionComponent<EdgeProps> = ({
	id,
	source,
	target,
	markerEnd,
	targetX,
	targetY,
	sourceX,
	sourceY,
	sourcePosition,
	targetPosition,
	selected,
	data,
}) => {
	const [
		removeTransition,
		showAllConnections,
		setHoveredEdgeNodes,
		showPortsAndCloseButtons
	] = useMainStore(
		(state) => [
			state.removeTransition,
			state.showAllConnectedStates,
			state.setHoveredEdgeNodes,
			state.showPortsAndCloseButtons,
		],
		shallow
	);
	const { role = '', path = '', setPath } = data || {};

	const hideCloseButton = !selected || showAllConnections || !showPortsAndCloseButtons;

	const [isHover, setIsHover] = useState<Nullable<boolean>>(null);

	const hoverEdge = (status: boolean) => {
		setHoveredEdgeNodes(status ? [source, target] : [])
		setIsHover(status);
	};

	const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
		event.stopPropagation();
		removeTransition({ source, target });
		hoverEdge(false);
	};

	const sourceNode = useReactFlowStore(
		useCallback((store: any) => store.nodeInternals.get(source), [source])
	);

	const targetNode = useReactFlowStore(
		useCallback((store: any) => store.nodeInternals.get(target), [target])
	);

	if (!sourceNode || !targetNode || source === target) return null;

	const edgeParams = {
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
	};

	const [edgePath, labelX, labelY] = getSmoothStepPath(edgeParams);

	const svgPath = path || selected ? simplifySVGPath(edgePath) : edgePath;

	useEffect(() => {
		if (setPath && selected && !path) setPath({ source, target, path: simplifySVGPath(edgePath), role })
	}, [setPath, selected, path, edgePath, source, target, role])

	return (
		<>
			<path
				id={id}
				className="edge_path"
				d={svgPath}
				markerEnd={markerEnd}
				stroke={isHover ? "#0ff" : "black"}
			/>
			{!hideCloseButton && (
				<foreignObject
					onMouseOver={() => hoverEdge(true)}
					onMouseLeave={() => hoverEdge(false)}
					width={foreignObjectSize}
					height={foreignObjectSize}
					x={labelX - foreignObjectSize / 2}
					y={labelY - foreignObjectSize / 2}
					className="edgebutton-foreignobject"
					requiredExtensions="http://www.w3.org/1999/xhtml"
				>
					<div>
						<Button
							className="edgebutton"
							onClick={handleDeleteClick}
							icon={<CloseCircleOutlined className="dumb-icon" />}
						/>
					</div>
				</foreignObject>
			)}
		</>
	);
};

export { StepEdge };
