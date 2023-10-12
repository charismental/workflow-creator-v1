import { MainActions, MainStore, WorkflowProcess } from "types"
import { edgeActions } from "./edgeActions";
import { nodeActions } from "./nodeActions";
import { reactFlowActions } from "./reactFlowActions";
import { roleActions } from "./roleActions";
import { processActions } from "./processActions";
import { companyActions } from "./companyActions";

const MAX_SNAPSHOTS = 11;

export const mainActions = (set: any, get: () => MainStore): MainActions => ({
    ...edgeActions(set, get),
    ...nodeActions(set, get),
    ...reactFlowActions(set, get),
    ...roleActions(set, get),
    ...processActions(set, get),
    ...companyActions(set, get),
    setSnapshot: (snapshot: WorkflowProcess) => {
        const { snapshots, snapshotIndex } = get();
        const newSnapshots = [snapshot, ...snapshots.slice(snapshotIndex, MAX_SNAPSHOTS - 1)];

        set({ snapshots: newSnapshots, snapshotIndex: 0 },
            false,
            'setSnapshot',
        );
    },
    updateSnapshotIndex: (increment: 1 | -1) => {
        const { snapshotIndex, snapshots } = get();
        const newIndex = snapshotIndex + increment;
        if (newIndex < 0 || newIndex >= snapshots.length) return;
        const updatedActiveProcess = snapshots[newIndex];

        set({ snapshotIndex: newIndex, activeProcess: updatedActiveProcess }, false, 'updateSnapshotIndex');
    },
});