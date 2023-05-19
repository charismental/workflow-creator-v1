import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useState } from "react";
import {
	EdgeProps,
	getStraightPath,
	getBezierPath,
	getSmoothStepPath,
	useStore as useReactFlowStore,
} from "reactflow";
import { getEdgeParams } from "../utils";
import useMainStore from "store";
import { shallow } from "zustand/shallow";

const foreignObjectSize = 40;

const FloatingEdge: FunctionComponent<EdgeProps> = ({ id, source, target, markerEnd }) => {
	const [removeTransition, showAllConnections, edgeType, setHoveredEdgeNodes] = useMainStore(
		(state) => [
			state.removeTransition,
			state.showAllConnectedStates,
			state.edgeType,
			state.setHoveredEdgeNodes,
		],
		shallow
	);

	const [isHover, setIsHover] = useState<boolean | null>(null);

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
				d={edgePath}
				markerEnd={markerEnd}
				stroke={isHover ? "#0ff" : "black"}
			/>
			{!showAllConnections && (
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
