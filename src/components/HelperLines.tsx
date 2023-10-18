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
				borderTop: `2.5px dashed ${color}`,
				width: "100%",
				height: "2.5px",
			}} />
		)}
		{/* vertical helper line */}
		<div style={{
			position: "absolute",
			zIndex: 5,
			left: `${left || 0}px`,
			borderLeft: `2.5px dashed ${color}`,
			width: "2.5px",
			height: "calc(100% - 80px)", // 80px is the height of the header TODO: set global value for header height
			opacity: typeof left === 'number' ? 1 : 0,
		}} />
	</>
);

export { HelperLines };
