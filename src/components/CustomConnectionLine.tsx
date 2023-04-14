import { FunctionComponent } from "react";
import { ConnectionLineComponentProps, getStraightPath } from "reactflow";

const CustomConnectionLine: FunctionComponent<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}): JSX.Element => {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
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
  );
};

export default CustomConnectionLine;
