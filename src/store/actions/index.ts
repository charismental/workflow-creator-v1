import { MainActions, MainStore } from "types"
import { edgeActions } from "./edgeActions";
import { nodeActions } from "./nodeActions";
import { reactFlowActions } from "./reactFlowActions";
import { roleActions } from "./roleActions";
import { processActions } from "./processActions";
import { companyActions } from "./companyActions";

export const mainActions = (set: any, get: () => MainStore): MainActions => ({
    ...edgeActions(set, get),
    ...nodeActions(set, get),
    ...reactFlowActions(set, get),
    ...roleActions(set, get),
    ...processActions(set, get),
    ...companyActions(set, get),
});