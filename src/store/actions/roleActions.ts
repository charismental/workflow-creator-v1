import { MainStore, NumberBoolean, RoleActions, WorkflowRole } from "types"
import { roleColor } from "utils";

export const roleActions = (set: any, get: () => MainStore): RoleActions => ({
    toggleShowAllRoles: () => {
        const { showAllRoles } = get();

        set({ showAllRoles: !showAllRoles, showAllConnectedStates: false });
    },
    setActiveRole: (role) => set({ activeRole: role }, false, 'setActiveRole'),
    toggleRoleForProcess: (role, color) => {
        const { activeProcess, roles: globalRoles, setSnapshot } = get();

        if (activeProcess) {
            const { roles = [] } = activeProcess;

            let updatedRoles = roles;

            const foundRole = globalRoles.find(({ roleName }) => roleName === role);

            if (roles.some(({ roleName }) => roleName === role)) {
                updatedRoles = roles.filter(({ roleName }) => roleName !== role);
            } else {
                const initialNumberBoolean: NumberBoolean = 0;

                const newRole: WorkflowRole = {
                    roleId: foundRole?.roleId || null,
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

            const updatedActiveProcess = { ...activeProcess, roles: updatedRoles };

            setSnapshot({ ...updatedActiveProcess });

            set(
                {
                    activeProcess: updatedActiveProcess,
                },
                false,
                'toggleRoleForProcess',
            );
        }
    },
    updateRoleProperty: ({ role, property, value }) => {
        const { activeProcess, setSnapshot } = get();

        if (activeProcess) {
            const { roles = [] } = activeProcess;

            const roleInProcessIndex = roles.findIndex(({ roleName }) => roleName === role);

            const foundRole = roles[roleInProcessIndex];

            const updatedRoles =
                roleInProcessIndex !== -1
                    ? roles.map((r, i) =>
                        i !== roleInProcessIndex ? r : { ...foundRole, [property]: value }
                    )
                    : roles;

            const updatedActiveProcess = { ...activeProcess, roles: updatedRoles };

            setSnapshot({ ...updatedActiveProcess });

            set(
                {
                    activeProcess: updatedActiveProcess,
                },
                false,
                'updateRoleProperty',
            );
        }
    },
    setColorForActiveRole: (color: string) => {
        const { activeProcess, activeRole, setSnapshot } = get();

        if (activeProcess) {
            const { roles = [] } = activeProcess;

            const activeRoleIndex = roles.findIndex(({ roleName }) => roleName === activeRole);

            if (activeRoleIndex !== -1) {
                const foundRole = roles[activeRoleIndex];
                const updatedRoles = roles.map((r, i) =>
                    i !== activeRoleIndex
                        ? r
                        : { ...foundRole, properties: { ...foundRole.properties, color } }
                );
                

                const updatedActiveProcess = { ...activeProcess, roles: updatedRoles };

                setSnapshot({ ...updatedActiveProcess });

                set(
                    {
                        activeProcess: updatedActiveProcess,
                    },
                    false,
                    'setColorForActiveRole',
                );
            }
        }
    },
    addNewRole: (role: string) => {
        const { roles } = get();
        const initialNumberBoolean: NumberBoolean = 0;

        const newRole: WorkflowRole = {
            roleId: null,
            roleName: role,
            isUniversal: initialNumberBoolean,
            isCluster: initialNumberBoolean,
        };

        set({ roles: roles.concat(newRole) }, false, 'addNewRole');
    },
});