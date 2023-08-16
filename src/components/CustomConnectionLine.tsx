import { FunctionComponent } from "react";
import { ConnectionLineComponentProps, getStraightPath } from "reactflow";

const CustomConnectionLine: FunctionComponent<ConnectionLineComponentProps> = ({
	fromX,
	fromY,
	toX,
	toY,
	connectionLineStyle,
	// fromPosition,
	// toPosition,
	// connectionLineType,
}): JSX.Element => {
	const [edgePath] = getStraightPath({
		sourceX: fromX,
		sourceY: fromY,
		targetX: toX,
		targetY: toY,
	});
	// console.log({
	// 	fromX,
	// 	fromY,
	// 	toX,
	// 	toY,
	// 	connectionLineStyle,
	// })
	// console.log(edgePath)

	return (
		!false ? <g>
			<path
				style={connectionLineStyle}
				fill="none"
				d={edgePath}
				className="connection_animated" // from local style.css
			/>
			<circle
				cx={toX}
				cy={toY}
				fill="black"
				r={3}
				stroke="black"
				strokeWidth={1}
			/>
		</g>
			:
			<g>
				<path
					fill="none"
					stroke="#222"
					strokeWidth={1.5}
					className="animated"
					d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
				/>
				<circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
			</g>
	);
};

export default CustomConnectionLine;
