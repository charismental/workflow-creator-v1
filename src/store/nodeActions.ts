import { NodeChange, applyNodeChanges } from "reactflow";
import { nodeByState, stateByNode } from "utils";
import { defaultColors } from "data";
import { useMainState } from "./useMainState";

const { setState, getState } = useMainState;

export const setHoveredEdgeNodes = (nodes: string[]) => {
	useMainState.setState({ hoveredEdgeNodes: nodes });
};

export const onNodesChange = (changes: NodeChange[] | any[]) => {
	const { activeProcess, activeRole, showAllRoles } = getState();

	const removeIndexPrefix = (prefixedString: string): string => {
		const prefix = !showAllRoles ? "" : prefixedString.match(/\d+/g)?.[0] || "";

		return prefixedString.slice(prefix.length);
	};

	const mappedChanges = changes.map((change) => ({
		...change,
		id: removeIndexPrefix(change.id),
	}));

	if (activeProcess) {
		const activeRoleIndex = (activeProcess?.roles || []).findIndex(
			({ roleName }) => roleName === activeRole
		);

		const { properties = {} } = activeProcess.roles?.[activeRoleIndex] || {};

		const nodeColor = properties?.color || defaultColors?.[activeRoleIndex];

		const { states: allStates = [] } = activeProcess || {};

		const nodes = allStates.map((s, i, arr) =>
			nodeByState({
				state: s,
				index: i,
				allNodesLength: arr.length,
				color: nodeColor,
			})
		);

		const updatedNodes = applyNodeChanges(mappedChanges, nodes);

		setState({
			activeProcess: {
				...activeProcess,
				states: updatedNodes.map((node) =>
					stateByNode({
						node: { ...node, data: { ...node.data, color: nodeColor } },
						allStates,
					})
				),
			},
		});
	}
};
