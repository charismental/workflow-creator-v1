import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useState } from "react";
import { EdgeProps, getStraightPath, useStore as useReactFlowStore } from "reactflow";
import { getEdgeParams } from "../utils";
import useMainStore from "store";
import { shallow } from "zustand/shallow";

const foreignObjectSize = 40;

const FloatingEdge: FunctionComponent<EdgeProps> = ({ id, source, target, markerEnd, style }) => {
	const removeTransition = useMainStore((state) => state.removeTransition, shallow);
	const showAllRoles = useMainStore((state) => state.showAllRoles, shallow);

	const [isHover, setIsHover] = useState<boolean | null>(null);

	// useEffect(() => {
	//   if (isHover !== null) updateNodeStyle()
	// }, [isHover])

	const onEdgeClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
		event.stopPropagation();
		removeTransition({ source, target });
		setIsHover(false);
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

	const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

	const [edgePath, labelX, labelY] = getStraightPath({
		sourceX: sx,
		sourceY: sy,
		targetX: tx,
		targetY: ty,
	});

	return (
		<>
			<path
				id={id}
				className="edge_path"
				d={edgePath}
				markerEnd={markerEnd}
				stroke={isHover ? "#0ff" : "black"}
			/>
			{!showAllRoles && <foreignObject
				onMouseOver={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
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
			</foreignObject>}
		</>
	);
};

export default FloatingEdge;
