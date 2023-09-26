import { ReactFlowInstance } from "reactflow";
import { MainStore, ReactFlowActions } from "types"

export const reactFlowActions = (set: any, get: () => MainStore): ReactFlowActions => ({
    saveStateSnapshot: () => {
        const { activeProcess, activeRole, processes, states, roles, companies } = get();
        const snapShot = { activeProcess, activeRole, processes, states, roles, companies };

        localStorage.setItem('state-snapshot', JSON.stringify(snapShot));
    },
    revertToSnapshot: () => {
        // TODO: try/catch
        const foundSnapshot = localStorage.getItem('state-snapshot');

        if (foundSnapshot) {
            try {
                const snapshot = JSON.parse(foundSnapshot);

                const { activeProcess, activeRole, processes, states, roles, companies } = snapshot;

                set({ activeProcess, activeRole, processes, states, roles, companies }, false, 'revertToSnapshot')
            } catch (err) {
                console.log('Something went wrong while parsing snapshot data')
            }
        }
    },
    setHasHydrated: (state) => set({ _hasHydrated: state }, false, 'setHasHydrated'),
    setReactFlowInstance: (instance: ReactFlowInstance) => set({ reactFlowInstance: instance }, false, 'setReactFlowInstance'),
    setShowMinimap: () => {
        const { showMinimap } = get();

        set({ showMinimap: !showMinimap }, false, 'setShowMinimap');
    },
});