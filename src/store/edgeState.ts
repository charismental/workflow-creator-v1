import { useMainState } from "./useMainState";

const { setState } = useMainState;

export const setEdgeType = (type: string) => setState({ edgeType: type });
