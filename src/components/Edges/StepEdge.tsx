import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import {
	EdgeProps,
	getSmoothStepPath,
	useStore as useReactFlowStore,
} from "reactflow";
import debounce from "lodash.debounce";
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
	const {
		role = '',
		path = '',
		setPath,
		points,
		disabled = false,
		showAllConnections,
		removeTransition,
		setHoveredEdgeNodes,
		showPortsAndCloseButtons,
	} = data || {};

	const [isHover, setIsHover] = useState<Nullable<boolean>>(null);
	const [isDragging, setIsDragging] = useState<Nullable<boolean>>(false);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [localPath, setLocalPath] = useState(path);
	const [currentMouseMovement, setCurrentMouseMovement] = useState({ x: 0, y: 0 })
	const pathRef = useRef<Nullable<SVGPathElement>>(null);

	const rounded = (num: number) => Math.round(num);

	const updateEdge = useCallback(debounce((path) => {
		setPath({ source, target, path, role, snapshot: true })
	}, 10), [])

	const hideCloseButton = !selected || showAllConnections || !showPortsAndCloseButtons || isDragging;

	const setStartCoordinates = useCallback((x: number, y: number) => {
		if (pathRef?.current) {
			const { left, top } = pathRef.current.getBoundingClientRect();
			// console.log('startX', left, top)
			setStartX(x - left);
			setStartY(y - top);
		}
	}, [pathRef])

	const handleMouseDown = (e: any) => {
		if (selected) {
			setIsDragging(true);
			// console.log('handleMouseDown', e.clientX, e.clientY)
			setStartCoordinates(e.clientX, e.clientY);
			// if (pathRef?.current) {
			// 	const { left, top } = pathRef.current.getBoundingClientRect();
			// 	console.log('handleMouseDown', e.clientX, e.clientY, left, top)
			// 	setStartX(e.clientX - left);
			// 	setStartY(e.clientY - top);
			// }
		}
	};

	const handleMouseMove = (e: any) => {
		if (selected && isDragging && pathRef?.current) {
			const { left, top } = pathRef.current.getBoundingClientRect();
			const newX = e.clientX - left - startX;
			const newY = e.clientY - top - startY;
			// console.log('handleMouseMove', 'top', top, 'startY', startY, 'e.clientY', e.clientY, 'newY', newY)
			// console.log('handleMouseMove', e.clientX, e.clientY)
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
		sourceX: rounded(sourceX),
		sourceY: rounded(sourceY),
		targetX: rounded(targetX),
		targetY: rounded(targetY),
		sourcePosition,
		targetPosition,
	};

	const [edgePath, labelX, labelY] = getSmoothStepPath(edgeParams);
	const isValidPath = testPathForPoint(path, { x: rounded(sourceX), y: rounded(sourceY) }, true) && testPathForPoint(path, { x: rounded(targetX), y: rounded(targetY) }, false);

	// const svgPath = path && isValidPath ? path : selected ? simplifySVGPath(edgePath) : edgePath;
	// const svgPath = path
	const canEdit = selected && points && pathIsEditable(points);

	useEffect(() => {
		const updatedPath = simplifySVGPath(edgePath);
		if (!disabled && !showAllConnections && ((setPath && selected && !path) || !isValidPath)) {
			setPath({ source, target, path: updatedPath, role })
			setLocalPath(updatedPath);
		}
		// if (setPath && selected && path !== updatedPath) setPath({ source, target, path: updatedPath, role })
	}, [setPath, selected, path, edgePath, source, target, role, isValidPath]);

	useEffect(() => {
		const { x, y } = currentMouseMovement;
		// console.log(x, y)
		if (!disabled && canEdit && isDragging && (x || y)) {
			// console.log('handleEdgeChanges', x, y)
			const newPath = handleEdgeChanges(points, x, y);
			// setPath({ source, target, path: newPath, role });
			setLocalPath(newPath);
			setCurrentMouseMovement({ x: 0, y: 0 });
			updateEdge(newPath);
		}
	}, [currentMouseMovement, canEdit, isDragging, points]);

	return (
		<>
			<path
				id={id}
				className="edge_path"
				d={disabled || showAllConnections ? edgePath : localPath}
				markerEnd={markerEnd}
				stroke={isHover ? "#0ff" : "black"}
			/>
			<path
				ref={pathRef}
				d={disabled || showAllConnections ? edgePath : localPath}
				fill="none"
				strokeOpacity={0}
				// stroke={isDragging ? "#0ff" : "black"}
				strokeWidth={20}
				className="react-flow__edge-interaction"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseOver={() => hoverEdge(true)}
				onMouseLeave={() => hoverEdge(false)}
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
