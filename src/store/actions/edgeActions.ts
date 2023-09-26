import { Connection } from "reactflow";
import { EdgeActions, MainStore } from "types"
import { simplifySVGPath, transformNewConnectionToTransition } from "utils";

export const edgeActions = (set: any, get: () => MainStore): EdgeActions => ({
    setPathForEdge: ({ path, role, source, target }) => {
        const { activeProcess, selectedEdge } = get();
        const { source: selectedSource, target: selectedTarget, role: selectedRole } = selectedEdge || {};

        if (activeProcess && selectedSource === source && selectedTarget === target && selectedRole === role) {
            const { roles = [] } = activeProcess;

            const foundRoleIndex = roles.findIndex(({ roleName }) => roleName === role);
            const { transitions = [] } = roles[foundRoleIndex] || {};

            const foundTransitionIndex = transitions.findIndex(({ stateName, toStateName }) => {
                return stateName === source && toStateName === target;
            });

            if (foundTransitionIndex !== -1) {
                const existingTransition = transitions[foundTransitionIndex];
                const points = path ? simplifySVGPath(path, true) : '';
                if (!points) delete existingTransition.properties?.points;
                const updatedTransition = { ...existingTransition, properties: { ...existingTransition?.properties || {}, ...(points && { points }) } };

                const updatedTransitions = transitions.map((t, i) => {
                    return i === foundTransitionIndex ? updatedTransition : t;
                });

                const updatedRoles = roles.map((r, i) => {
                    return i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r;
                });

                set(
                    {
                        activeProcess: {
                            ...activeProcess,
                            roles: updatedRoles,
                        },
                    },
                    false,
                    'setPathForEdge',
                );
            }
        }
    },
    setSelectedEdge: (payload) => {
        let selectedEdge = null;

        if (payload) {
            const { activeRole } = get();
            const { source, target, role } = payload;
            const selectedEdgeRole = role || activeRole;
            selectedEdge = { source, target, role: selectedEdgeRole };
        }
        set({ selectedEdge }, false, 'setSelectedEdge');
    },
    setEdgeType: (type) => set({ edgeType: type }, false, 'setEdgeType'),
    onConnect: (connection: Connection) => {
        const { activeRole, activeProcess, showAllRoles, states, setSelectedEdge } = get();
        const { source, target } = connection;
        let roleForSelectedEdge = activeRole;
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
                roleForSelectedEdge = roleName;
                return Number(roleIndexStr) === i;
            }

            return roleName === activeRole;
        });

        if (foundRoleIndex !== -1 && activeProcess) {
            const { transitions: roleTransitions, roleId, roleName } = roles[foundRoleIndex];

            const transitions = roleTransitions || [];

            const updatedConnection = {
                ...connection,
                ...(showAllRoles && {
                    source: removeIndexPrefixFromName(roleIndexStr, source || ""),
                    target: removeIndexPrefixFromName(roleIndexStr, target || ""),
                }),
            };

            const newTransition = transformNewConnectionToTransition({
                connection: updatedConnection,
                existingTransitions: transitions,
                allStates: states,
                roleId,
                roleName,
            });

            const filteredTransitions = transitions.filter(({ stateName, toStateName }) => {
                const { stateName: newTranstionSource, toStateName: newTransitionTarget } = newTransition || {};

                return !newTranstionSource ||
                    !newTransitionTarget ||
                    stateName !== newTranstionSource ||
                    toStateName !== newTransitionTarget;
            })

            const updatedTransitions = [...filteredTransitions, ...(newTransition ? [newTransition] : [])];

            const updatedRoles = roles.map((r, i) =>
                i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r
            );

            source && target && setTimeout(() => setSelectedEdge({ source, target, role: roleForSelectedEdge }), 10)

            set(
                {
                    activeProcess: { ...activeProcess, roles: updatedRoles },
                },
                false,
                'onConnect',
            );
        }
    },
    setShowAllConnectedStates: () => {
        const { showAllConnectedStates } = get();

        set({
            showAllConnectedStates: !showAllConnectedStates,
            showAllRoles: false,
        }, false, 'setShowAllConnectedStates');
    },
    removeTransition: ({ source, target }: { source: string; target: string }) => {
        const { activeRole, activeProcess, showAllRoles, setSelectedEdge } = get();

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
            setSelectedEdge(null);
            const { transitions = [] } = roles[foundRoleIndex];

            const updatedTransitions = transitions.filter(({ stateName, toStateName }) => {
                const updatedSource = showAllRoles
                    ? removeIndexPrefixFromName(roleIndexStr, source)
                    : source;
                const updatedTarget = showAllRoles
                    ? removeIndexPrefixFromName(roleIndexStr, target)
                    : target;
                return stateName !== updatedSource || toStateName !== updatedTarget;
            });

            const updatedRoles = roles.map((r, i) =>
                i === foundRoleIndex ? { ...r, transitions: updatedTransitions } : r
            );

            set(
                {
                    activeProcess: { ...activeProcess, roles: updatedRoles },
                },
                false,
                'removeTransition',
            );
        }
    },
});