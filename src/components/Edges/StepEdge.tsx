import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import {
	EdgeProps,
	getSmoothStepPath,
	useStore as useReactFlowStore,
} from "reactflow";
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
	const [localPath, setLocalPath] = useState(path);
	const pathRef = useRef<Nullable<SVGPathElement>>(null);

	const rounded = (num: number) => Math.round(num);

	const hideCloseButton = !selected || showAllConnections || !showPortsAndCloseButtons

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

	const canEdit = selected && points && pathIsEditable(points);

	useEffect(() => {
		const updatedPath = simplifySVGPath(edgePath);
		if (!disabled && !showAllConnections && ((setPath && selected && !path) || !isValidPath)) {
			setPath({ source, target, path: updatedPath, role })
			setLocalPath(updatedPath);
		}
	}, [setPath, selected, path, edgePath, source, target, role, isValidPath]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const keyMap: any = {
				ArrowUp: { x: 0, y: -1 },
				ArrowDown: { x: 0, y: 1 },
				ArrowLeft: { x: -1, y: 0 },
				ArrowRight: { x: 1, y: 0 },
			}

			if (!canEdit || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e?.key)) return;
			e.preventDefault();

			const { x, y } = keyMap[e.key];
			const updatedPath = handleEdgeChanges(points, x, y);
			setPath({ source, target, path: updatedPath, role, snapshot: true })
			setLocalPath(updatedPath);

		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [canEdit, points, role, setPath, setLocalPath, source, target]);

	// redo/undo set local path if path changes
	useEffect(() => {
		path && setLocalPath(path)
	}, [path, setLocalPath])


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
