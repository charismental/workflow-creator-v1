import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useState } from "react";
import {
	EdgeProps,
	useStore as useReactFlowStore,
	useNodes,
} from "reactflow";
import { getSmartEdge, svgDrawStraightLinePath } from "@tisoap/react-flow-smart-edge";
import { Nullable } from "types";

const foreignObjectSize = 40;

const SmartEdge: FunctionComponent<EdgeProps> = ({
	id,
	source,
	target,
	markerEnd,
	markerStart,
	targetX,
	targetY,
	sourceX,
	sourceY,
	sourcePosition,
	targetPosition,
	data,
}) => {
	const { showAllConnections, setHoveredEdgeNodes, showPortsAndCloseButtons, removeTransition } = data;

	const hideCloseButton = showAllConnections || !showPortsAndCloseButtons;

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

	const nodes = useNodes();

	const edgeParams = {
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		nodes,
		options: {
			drawEdge: svgDrawStraightLinePath,
		},
	};

	const getSmartEdgeResponse = getSmartEdge(edgeParams);

	if (getSmartEdgeResponse === null) return null;

	const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;

	return (
		<>
			<path
				id={id}
				className="edge_path"
				d={svgPathString}
				markerEnd={markerEnd}
				markerStart={markerStart}
				stroke={isHover ? "#0ff" : "black"}
			/>
			<path
				d={svgPathString}
				fill="none"
				strokeOpacity={0}
				strokeWidth={20}
				className="react-flow__edge-interaction"
				onMouseOver={() => hoverEdge(true)}
				onMouseLeave={() => hoverEdge(false)}
			/>
			{!hideCloseButton && (
				<foreignObject
					onMouseOver={() => hoverEdge(true)}
					onMouseLeave={() => hoverEdge(false)}
					width={foreignObjectSize}
					height={foreignObjectSize}
					x={edgeCenterX - foreignObjectSize / 2}
					y={edgeCenterY - foreignObjectSize / 2}
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

export { SmartEdge };
