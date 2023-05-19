import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useState } from "react";
import {
	EdgeProps,
	getStraightPath,
	getBezierPath,
	getSmoothStepPath,
	useStore as useReactFlowStore,
	Position,
} from "reactflow";
import { getSmartEdge } from "@tisoap/react-flow-smart-edge";
import { bezierResult, stepResult, straightResult } from "data/edgeOptions";
import { computedNodes, getEdgeParams } from "../utils";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import { Nullable } from "types";

const foreignObjectSize = 40;

const FloatingEdge: FunctionComponent<EdgeProps> = ({ id, source, target, markerEnd }) => {
	const [removeTransition, showAllConnections, edgeType, setHoveredEdgeNodes, activeProcess, showAllRoles, activeRole, showAllConnectedStates] = useMainStore(
		(state) => [
			state.removeTransition,
			state.showAllConnectedStates,
			state.edgeType,
			state.setHoveredEdgeNodes,
			state.activeProcess,
			state.showAllRoles,
			state.activeRole,
			state.showAllConnectedStates
		],
		shallow
	);

	const nodes = computedNodes({
		process: activeProcess,
		showAllRoles,
		activeRole,
		showAllConnections: showAllConnectedStates,
	});

	const [isHover, setIsHover] = useState<Nullable<boolean>>(null);

	const hoverEdge = (status: boolean) => {
		setHoveredEdgeNodes(status ? [source, target] : [])
		setIsHover(status);
	};

	const onEdgeClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
		event.stopPropagation();
		removeTransition({ source, target });
		hoverEdge(false);
	};

	const sourceNode = useReactFlowStore(
		useCallback((store) => store.nodeInternals.get(source), [source])
	);

	const targetNode = useReactFlowStore(
		useCallback((store) => store.nodeInternals.get(target), [target])
	);

	if (!sourceNode || !targetNode || source === target) {
		return null;
	}

	const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

	const getSmartEdgeResponse = getSmartEdge({
		sourcePosition: sourceNode.sourcePosition || Position.Top,
		targetPosition: targetNode.sourcePosition || Position.Bottom,
		sourceX: sx,
		sourceY: sy,
		targetX: tx,
		targetY: ty,
		nodes: nodes,
		// Pass down options in the getSmartEdge object
		options: stepResult,
			// edgeType === "Straight"
			// 	? straightResult
			// 	: edgeType === "Bezier"
			// 		? bezierResult
			// 		: stepResult,
	});

	if (getSmartEdgeResponse === null) {
		return null;
	}

	const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;

	const currentEdgeType = () => {
		const baseParams = {
			sourceX: sx,
			sourceY: sy,
			targetX: tx,
			targetY: ty,
			sourcePosition: sourcePos,
			targetPosition: targetPos,
		};

		switch (edgeType) {
			case "step":
				return getSmoothStepPath(baseParams);
			case "bezier":
				return getBezierPath(baseParams);
			default:
				return getStraightPath(baseParams);
		}
	}

	const [edgePath, labelX, labelY] = currentEdgeType();

	return (
		<>
			<path
				id={id}
				className="edge_path"
				// d={edgePath}
				d={svgPathString}
				markerEnd={markerEnd}
				stroke={isHover ? "#0ff" : "black"}
			/>
			{!showAllConnections && (
				<foreignObject
					onMouseOver={() => hoverEdge(true)}
					onMouseLeave={() => hoverEdge(false)}
					width={foreignObjectSize}
					height={foreignObjectSize}
					x={edgeCenterX - foreignObjectSize / 2}
					y={edgeCenterY - foreignObjectSize / 2}
					// x={labelX - foreignObjectSize / 2}
					// y={labelY - foreignObjectSize / 2}
					className="edgebutton-foreignobject"
					requiredExtensions="http://www.w3.org/1999/xhtml"
				>
					<div>
						<Button
							className="edgebutton"
							onClick={onEdgeClick}
							icon={<CloseCircleOutlined className="dumb-icon" />}
						/>
					</div>
				</foreignObject>
			)}
		</>
	);
};

export default FloatingEdge;
