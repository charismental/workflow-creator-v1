import React from "react";

interface HelperLinesProps {
	color: string;
	top: number | undefined;
	left: number | undefined;
}

const HelperLines: React.FC<HelperLinesProps> = ({
	color,
	top,
	left,
}) => (
	<>
		{/* horizontal helper line */}
		{typeof top === 'number' && (
			<div style={{
				position: "absolute",
				zIndex: 5,
				top: `${top}px`,
				backgroundColor: color,
				width: "100%",
				height: "2.5px",
			}} />
		)}
		{/* vertical helper line */}
		<div style={{
			position: "absolute",
			zIndex: 5,
			left: `${left || 0}px`,
			backgroundColor: color,
			width: "2.5px",
			height: "100%",
			opacity: typeof left === 'number' ? 1 : 0,
		}} />
	</>
);

export { HelperLines };