import { Connection } from "reactflow";
import { useMainState } from "./useMainState";
import { roleColor, transformNewConnectionToTransition } from "utils";
import { NumberBoolean, WorkflowRole } from "types";

const { setState, getState } = useMainState;

export const addNewRole = (role: string) =>
	setState(({ roles }) => {
		const initialNumberBoolean: NumberBoolean = 0;

		const newRole: WorkflowRole = {
			roleId: null,
			roleName: role,
			isUniversal: initialNumberBoolean,
			isCluster: initialNumberBoolean,
		};

		return { roles: roles.concat(newRole) };
	});

export const onConnect = (connection: Connection) => {
	const { activeRole, activeProcess, showAllRoles } = getState();
	const { source, target } = connection;

	const { roles = [] } = activeProcess || {};
	let roleIndexStr = "";

	const removeIndexPrefixFromName = (prefix: string, name: string): string => {
		const index = name.indexOf(prefix);

		if (index !== -1) return name.slice(0, index) + name.slice(index + prefix.length);
		return name;
	};

	const foundRoleIndex = roles.findIndex(({ roleName }, i) => {
		if (showAllRoles) {
			roleIndexStr = (source || "").match(/\d+/g)?.[0] || "";

			return Number(roleIndexStr) === i;
		}

		return roleName === activeRole;
	});

	if (foundRoleIndex !== -1 && activeProcess) {
		const { transitions: roleTransitions } = roles[foundRoleIndex];

		const transitions = roleTransitions || [];

		const updatedConnection = {
			...connection,
			...(showAllRoles && {
				source: removeIndexPrefixFromName(roleIndexStr, source || ""),
				target: removeIndexPrefixFromName(roleIndexStr, target || ""),
			}),
		};
		const newTransition = transformNewConnectionToTransition(updatedConnection, transitions);

		const updatedTransitions = [...transitions, ...(newTransition ? [newTransition] : [])];

		const updatedRoles = roles.map((r: any, i: any) =>
			i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r
		);

		setState({
			activeProcess: { ...activeProcess, roles: updatedRoles },
		});
	}
};

export const toggleShowAllRoles = () =>
	setState(({ showAllRoles }) => ({ showAllRoles: !showAllRoles, showAllConnectedStates: false }));

export const removeTransition = ({ source, target }: { source: string; target: string }) => {
	const { activeRole, activeProcess, showAllRoles } = getState();

	const { roles = [] } = activeProcess || {};
	let roleIndexStr = "";

	const removeIndexPrefixFromName = (prefix: string, name: string): string => {
		const index = name.indexOf(prefix);

		if (index !== -1) return name.slice(0, index) + name.slice(index + prefix.length);
		return name;
	};

	const foundRoleIndex = roles.findIndex(({ roleName }, i) => {
		if (showAllRoles) {
			roleIndexStr = source.match(/\d+/g)?.[0] || "";

			return Number(roleIndexStr) === i;
		}

		return roleName === activeRole;
	});

	if (foundRoleIndex !== -1 && activeProcess) {
		const { transitions = [] } = roles[foundRoleIndex];

		const updatedTransitions = transitions.filter(({ stateName, toStateName }) => {
			const updatedSource = showAllRoles ? removeIndexPrefixFromName(roleIndexStr, source) : source;
			const updatedTarget = showAllRoles ? removeIndexPrefixFromName(roleIndexStr, target) : target;
			return stateName !== updatedSource || toStateName !== updatedTarget;
		});

		const updatedRoles = roles.map((r, i) =>
			i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r
		);

		setState({
			activeProcess: { ...activeProcess, roles: updatedRoles },
		});
	}
};

export const setActiveRole = (role: string) => setState(() => ({ activeRole: role }));

export const toggleRoleForProcess = (role: string, color?: string) => {
	const { activeProcess } = getState();

	if (activeProcess) {
		const { roles = [] } = activeProcess;

		let updatedRoles = roles;

		if (roles.some(({ roleName }) => roleName === role)) {
			updatedRoles = roles.filter(({ roleName }) => roleName !== role);
		} else {
			const initialNumberBoolean: NumberBoolean = 0;

			const newRole: WorkflowRole = {
				roleId: null,
				isCluster: initialNumberBoolean,
				isUniversal: initialNumberBoolean,
				roleName: role,
				transitions: [],
				properties: {
					color: color || roleColor({ roleName: role, allRoles: roles, index: roles.length }),
				},
			};

			updatedRoles = roles.concat(newRole);
		}

		setState({
			activeProcess: { ...activeProcess, roles: updatedRoles },
		});
	}
};

export const updateRoleProperty = ({
	role,
	property,
	value,
}: {
	role: string;
	property: string;
	value: any;
}) => {
	const { activeProcess } = getState();

	if (activeProcess) {
		const { roles = [] } = activeProcess;

		const roleInProcessIndex = roles.findIndex(({ roleName }) => roleName === role);

		const foundRole = roles[roleInProcessIndex];

		const updatedRoles =
			roleInProcessIndex !== -1
				? roles.map((r, i) => (i !== roleInProcessIndex ? r : { ...foundRole, [property]: value }))
				: roles;

		setState({
			activeProcess: { ...activeProcess, roles: updatedRoles },
		});
	}
};

export const setColorForActiveRole = (color: string) => {
	const { activeProcess, activeRole } = getState();

	if (activeProcess) {
		const { roles = [] } = activeProcess;

		const activeRoleIndex = roles.findIndex(({ roleName }) => roleName === activeRole);

		if (activeRoleIndex !== -1) {
			const foundRole = roles[activeRoleIndex];
			const updatedRoles = roles.map((r, i) =>
				i !== activeRoleIndex ? r : { ...foundRole, properties: { ...foundRole.properties, color } }
			);

			setState({
				activeProcess: { ...activeProcess, roles: updatedRoles },
			});
		}
	}
};
