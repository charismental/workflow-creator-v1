import type { MainState } from "store";

interface OutputTypes {
	activeRole: MainState["activeRole"];
	allSelfConnectingEdges: MainState["allSelfConnectingEdges"];
	findStateNameByNode: (nodeId: string) => string | undefined;
}

export default function ({ activeRole, allSelfConnectingEdges, findStateNameByNode }: OutputTypes) {
	return {
		[activeRole]: {
			connections: [...[], ...(allSelfConnectingEdges?.[activeRole] || [])]
				// .map(({ source, target }: { source: string; target: string }) => {
				//   return {
				//     source: findStateNameByNode(source),
				//     target: findStateNameByNode(target),
				//   };
				// })
				.filter(({ source, target }: any) => !!source && !!target),
		},
	};
}
