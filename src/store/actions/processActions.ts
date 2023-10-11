import { cloneProcess, createProcess, deleteSession, getAllSessions, getSessionProcess, publishProcess, saveProcess } from "api";
import { MainStore, NumberBoolean, ProcessActions, WorkflowProcess, WorkflowRole, WorkflowSession } from "types"

export const processActions = (set: any, get: () => MainStore): ProcessActions => ({
    deleteSession: async (processName: string) => {
        // TODO: should select new active process if deleted process is active
        const { sessions, processes } = get();
        const { sessionId = '' } = sessions.find(({ processName: name }) => name === processName) || {};
        const successMessage = await deleteSession(sessionId);

        if (successMessage?.toLowerCase()?.includes('was deleted')) {
            set(
                {
                    sessions: sessions.filter(({ sessionId: id }) => id !== sessionId),
                    processes: processes.filter(({ sessionId: id }) => id !== sessionId)
                },
                false,
                'deleteSession',
            )
        }

        return successMessage || 'Something went wrong';
    },
    saveProcess: async () => {
        // handle for success/failure, return message?
        const { activeProcess, activeRole, setActiveProcess } = get();
        if (!activeProcess) return false;

        // not necessary to include globals in payload
        const { globals, ...activeProcessWithoutGlobals } = activeProcess;
        const savePayload = { ...activeProcessWithoutGlobals }

        const saved = await saveProcess(savePayload);
        const success = !!saved?.sessionId;

        if (success) {
            setActiveProcess(saved, activeRole);
            setTimeout(() => {
                set({ unsavedChanges: false }, false, 'saveProcess/unsavedChanges');
            }, 0)
        }

        return success;
    },
    publishProcess: async () => {
        const { activeProcess, activeRole, setActiveProcess } = get();
        if (!activeProcess?.sessionId) return false;

        const published = await publishProcess(activeProcess);
        const success = !!published?.sessionId;

        if (success) setActiveProcess(published, activeRole);

        return success;
    },
    cloneProcess: async (processName: string, newName?: string) => {
        const { sessions, activeRole, activeProcess, setActiveProcess } = get();
        const invalidNames = sessions.map(({ processName }) => processName);

        const nameUpdater = (name: string, invalid: string[] = []): string => {
            let updatedName = name;
            const namePieces = updatedName.split(' - copy');
            const currentCount = parseInt(namePieces[1], 10) || 0;

            if (namePieces.length === 1) (updatedName += ' - copy 1');
            else (updatedName = `${namePieces[0]} - copy ${currentCount + 1}`);

            return invalid.includes(updatedName) ?
                nameUpdater(updatedName, invalid) :
                updatedName;
        }

        const cloned = await cloneProcess({ processName, newProcessName: newName && !invalidNames.includes(newName) ? newName : nameUpdater(newName || processName, invalidNames) });

        const success = !!cloned?.sessionId;

        if (success) {
            const {
                dateCreated = null,
                datePublished = null,
                dateUpdated = null,
                processId = null,
                processName,
                sessionId,
            } = cloned

            const clonedSession = {
                dateCreated,
                datePublished,
                dateUpdated,
                processId,
                processName,
                sessionId,
            }
            const isSameAsActive = activeProcess?.processName === processName
            setActiveProcess(cloned, isSameAsActive ? activeRole : undefined);

            set(
                {
                    sessions: [...sessions, clonedSession],
                    unsavedChanges: false,
                },
                false,
                'cloneProcess',
            );
        }

        return success;
    },
    getAllSessions: async () => {
        const { setActiveProcess } = get();
        set({ globalLoading: true }, false, 'getAllSessions/globalLoading');
        const sessions: WorkflowSession[] = await getAllSessions();
        const mapped: WorkflowSession[] = [];

        sessions.forEach((session, i, arr) => {
            if (arr.some(({ processName, sessionId }) => sessionId !== session.sessionId &&
                processName === session.processName)) {
                session.processName += ` (${i + 1})`;
            }

            mapped.push(session);
        });

        set({ sessions: mapped, globalLoading: false }, false, 'getAllSessions');

        const { sessionId = '' } = sessions?.[0] || {};

        if (sessionId) {
            const sessionProcess = await getSessionProcess(sessionId);

            if (sessionProcess) setActiveProcess(sessionProcess);
        }
    },
    setActiveProcess: (process: WorkflowProcess, role) => {
        const sortRoles = (roles: WorkflowRole[]) => [...roles].sort((a, b) => a.roleName.localeCompare(b.roleName));

        const { globals } = process;

        const { states = [], roles = [], companies = [] } = globals || {};

        const { roles: activeProcessRoles = [] } = process;

        const activeRole = role || sortRoles(activeProcessRoles)?.[0]?.roleName || sortRoles(roles)?.[0]?.roleName || "";

        set({ activeProcess: process, activeProcessDiffOriginal: { ...process }, states, roles: sortRoles(roles), companies, activeRole },
            false,
            'setActiveProcess',
        );
    },
    updateProcess: ({
        processIndex,
        process,
    }: {
        processIndex: number;
        process: WorkflowProcess;
    }) => {
        const { processes } = get();

        const updatedProcesses = processes.map((p, i) => (i === processIndex ? process : p));

        set({ processes: updatedProcesses }, false, 'updateProcess');
    },
    addProcess: async (name: string) => {
        const newProcess = await createProcess(name);

        const { setActiveProcess, sessions, processes } = get();

        const { globals, roles, states, companies, ...session } = newProcess;

        setActiveProcess(newProcess);

        set({ processes: [...processes, newProcess], sessions: [...sessions, session] }, false, 'addProcess');
    },
    setUnsavedChanges: (status) => set({ unsavedChanges: status }, false, 'setUnsavedChanges'),
});