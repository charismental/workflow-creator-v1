import { MarkerType, DefaultEdgeOptions } from "reactflow";

export const defaultEdgeOptions: DefaultEdgeOptions = {
	style: { strokeWidth: 1.5, stroke: "black" },
	type: "straightEdge",
	markerEnd: {
		type: MarkerType.ArrowClosed,
		color: "black",
	},
};

export default defaultEdgeOptions;
