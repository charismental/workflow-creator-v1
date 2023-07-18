import { WorkFlowTransition, WorkflowState } from "types";
import { useMainState } from "./useMainState";

const { setState, getState } = useMainState;

export const updateStateProperties = ({
	stateName,
	properties,
}: {
	stateName: string;
	properties: { x?: number; y?: number; h?: number; w?: number };
}) => {
	const { activeProcess } = getState();

	const { states = [] } = activeProcess || {};

	const foundStateIndex = states.findIndex((state) => state.stateName === stateName);

	if (foundStateIndex !== -1) {
		setStatesForActiveProcess(
			states.map((s, i) =>
				i !== foundStateIndex
					? s
					: {
							...states[foundStateIndex],
							properties: { ...states[foundStateIndex].properties, ...properties },
					  }
			)
		);
	}
};

export const setStatesForActiveProcess = (states: WorkflowState[]) => {
	const { activeProcess } = getState();

	if (activeProcess) {
		setState({
			activeProcess: { ...activeProcess, states },
		});
	}
};

export const setShowAllConnectedStates = () =>
	setState(({ showAllConnectedStates }) => ({
		showAllConnectedStates: !showAllConnectedStates,
		showAllRoles: false,
	}));

export const removeState = (stateNameToRemove: string) => {
	const { activeProcess } = getState();

	const { roles = [] } = activeProcess || {};

	if (activeProcess) {
		const TransitionsFilter = (transitions: WorkFlowTransition[]) => {
			return transitions.filter(
				({ stateName, toStateName }) =>
					stateName !== stateNameToRemove && toStateName !== stateNameToRemove
			);
		};

		const updatedRoles = roles.map((r) => ({
			...r,
			transitions: TransitionsFilter(r?.transitions || []),
		}));

		const updatedStates = activeProcess.states?.filter((s) => s.stateName !== stateNameToRemove);

		setState({
			activeProcess: { ...activeProcess, roles: updatedRoles, states: updatedStates },
		});
	}
};

export const updateStateProperty = ({
	state,
	property,
	value,
}: {
	state: string;
	property: string;
	value: any;
}) => {
	const { activeProcess } = getState();

	if (activeProcess) {
		const { states = [] } = activeProcess;

		const stateInProcessIndex = states.findIndex(({ stateName }) => stateName === state);

		const foundState = states[stateInProcessIndex];

		const updatedStates =
			stateInProcessIndex !== -1
				? states.map((s, i) =>
						i !== stateInProcessIndex ? s : { ...foundState, [property]: value }
				  )
				: states;

		setState({
			activeProcess: { ...activeProcess, states: updatedStates },
		});
	}
};

export const filteredStates = (existingStates: WorkflowState[]) => {
	const { states } = getState();

	return states
		.map((el) => el.stateName)
		.filter((stateName: string) => !existingStates.some((s) => s.stateName === stateName));
};

export const addNewState = (name: string) => {
	const { states } = getState();

	if (!states.some(({ stateName }) => stateName === name)) {
		const newState: WorkflowState = {
			stateId: null,
			stateName: name,
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: Math.max(...states.map(({ displayOrder }) => displayOrder || 0)) + 10,
		};

		setState({ states: states.concat(newState) });
	}
};
