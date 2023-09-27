import { MainState } from "types"

export const mainState: MainState = {
    selectedEdge: null,
    helperLines: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    unsavedChanges: false,
    sessions: [],
    hoveredEdgeNodes: [],
    contextMenuNodeId: undefined,
    activeProcess: null,
    globalLoading: false,
    _hasHydrated: false,
    states: [],
    roles: [],
    companies: [],
    edgeType: "step",
    showAllRoles: false,
    showAllConnectedStates: false,
    activeRole: '',
    processes: [],
    reactFlowInstance: undefined,
    showPortsAndCloseButtons: true,
    showMinimap: true,
};