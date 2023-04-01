import { FC } from "react";
import { getStraightPath } from "reactflow";

interface CustomConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  connectionLineStyle: any;
}

const CustomConnectionLine: FC<CustomConnectionLineProps> = ({ fromX, fromY, toX, toY, connectionLineStyle }): JSX.Element => {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY
  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle
        cx={toX}
        cy={toY}
        fill="black"
        r={3}
        stroke="black"
        strokeWidth={1}
      />
    </g>
  );
}

export default CustomConnectionLine;
