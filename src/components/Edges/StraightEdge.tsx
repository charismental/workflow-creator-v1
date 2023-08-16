import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useState } from "react";
import {
	EdgeProps,
	getStraightPath,
	useStore as useReactFlowStore,
} from "reactflow";
import { getEdgeParams } from "../../utils";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import { Nullable } from "types";

const foreignObjectSize = 40;

const StraightEdge: FunctionComponent<EdgeProps> = ({ id, source, target, markerEnd }) => {
	const [removeTransition, showAllConnections, setHoveredEdgeNodes] = useMainStore(
		(state) => [
			state.removeTransition,
			state.showAllConnectedStates,
			state.setHoveredEdgeNodes,
		],
		shallow
	);

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

	const { sx, sy, tx, ty } = getEdgeParams({ source: sourceNode, target: targetNode });

	const edgeParams = {
		sourceX: sx,
		sourceY: sy,
		targetX: tx,
		targetY: ty,
	};

	const [edgePath, labelX, labelY] = getStraightPath(edgeParams);

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
							onClick={handleDeleteClick}
							icon={<CloseCircleOutlined className="dumb-icon" />}
						/>
					</div>
				</foreignObject>
			)}
		</>
	);
};

export { StraightEdge };
