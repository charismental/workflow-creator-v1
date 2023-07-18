import { ReactFlowInstance } from "reactflow";
import { useMainState } from "./useMainState";

const { setState, getState } = useMainState;

export const setContextMenuNodeId = (nodeId: string | undefined) => {
	setState({ contextMenuNodeId: nodeId });
};

export const setHasHydrated = (state: boolean) => setState({ _hasHydrated: state });

export const setShowMinimap = () => {
	setState({ showMinimap: !getState().showMinimap });
};

export const setReactFlowInstance = (instance: ReactFlowInstance) =>
	setState({ reactFlowInstance: instance });
