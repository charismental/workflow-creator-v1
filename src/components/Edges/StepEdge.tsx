import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import {
	EdgeProps,
	getSmoothStepPath,
	useStore as useReactFlowStore,
} from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import { Nullable } from "types";
import { simplifySVGPath, testPathForPoint, pathIsEditable, handleEdgeChanges } from "utils";

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
	const { role = '', path = '', setPath, points } = data || {};

	const hideCloseButton = !selected || showAllConnections || !showPortsAndCloseButtons;

	const [isHover, setIsHover] = useState<Nullable<boolean>>(null);
	const [isDragging, setIsDragging] = useState<Nullable<boolean>>(false);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [currentMouseMovement, setCurrentMouseMovement] = useState({ x: 0, y: 0 })
	const pathRef = useRef<Nullable<SVGPathElement>>(null);

	const handleMouseDown = (e: any) => {
		if (selected) {

			setIsDragging(true);
			if (pathRef?.current) {
				const { left, top } = pathRef.current.getBoundingClientRect();
				setStartX(e.clientX - left);
				setStartY(e.clientY - top);
			}
		}
	};

	const handleMouseMove = (e: any) => {
		if (selected && isDragging && pathRef?.current) {
			const { left, top } = pathRef.current.getBoundingClientRect();
			const newX = e.clientX - left - startX;
			const newY = e.clientY - top - startY;

			setCurrentMouseMovement({ x: newX, y: newY });
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		!selected && setIsDragging(false)
	}, [setIsDragging, selected])
	// todo: hover method via data, no store access for components
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
	const isValidPath = testPathForPoint(path, { x: sourceX, y: sourceY }, true) && testPathForPoint(path, { x: targetX, y: targetY }, false);
	const svgPath = path && isValidPath ? path : selected ? simplifySVGPath(edgePath) : edgePath;
	const canEdit = selected && points && pathIsEditable(points);

	useEffect(() => {
		const updatedPath = simplifySVGPath(edgePath);
		// if (setPath && selected && !path) setPath({ source, target, path: updatedPath, role })
		if (setPath && selected && path !== updatedPath) setPath({ source, target, path: updatedPath, role })
	}, [setPath, selected, path, edgePath, source, target, role]);

	useEffect(() => {
		const { x, y } = currentMouseMovement;
		if (canEdit && isDragging && x && y) {
			const newPath = handleEdgeChanges(points, x, y);
			console.log('newPath', newPath);
			console.log('x', x, 'y', y);
			// setPath({ source, target, path: newPath, role });
			setCurrentMouseMovement({ x: 0, y: 0 });
		}
	}, [currentMouseMovement, canEdit, isDragging, points]);

	return (
		<>
			<path
				id={id}
				className="edge_path"
				d={svgPath}
				markerEnd={markerEnd}
				stroke={isHover ? "#0ff" : "black"}
			/>
			<path
				ref={pathRef}
				d={svgPath}
				fill="none"
				strokeOpacity={0}
				strokeWidth={20}
				className="react-flow__edge-interaction"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
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
