import { NodeChange, applyNodeChanges } from "reactflow";
import { MainStore, NodeActions, WorkFlowTransition, WorkflowState } from "types"
import { getHelperLinePositions, nodeByState, stateByNode } from "utils";
import { defaultColors } from "data";

export const nodeActions = (set: any, get: () => MainStore): NodeActions => ({
    setHoveredEdgeNodes: (nodes: string[]) => {
        set({ hoveredEdgeNodes: nodes }, false, 'setHoveredEdgeNodes');
    },
    onNodesChange: (changes: NodeChange[] | any[]) => {
        const {
            activeProcess,
            activeRole,
            showAllRoles,
            edgeType,
            helperLines,
        } = get();
        const isStraightEdge = edgeType === 'straight';

        const removeIndexPrefix = (prefixedString: string): string => {
            const prefix = !showAllRoles ? "" : prefixedString.match(/\d+/g)?.[0] || "";

            return prefixedString.slice(prefix.length);
        };

        const { states = [] } = activeProcess || {};

        // todo: forEach instead of map, handle additional position changes
        // via nodeShouldSnapTo
        const mappedChanges = changes.map((change, i, arr) => {
            const { position = {}, id } = change;

            const updated = { ...change, id: removeIndexPrefix(id) };

            if (arr.length === 1 && arr[0].dragging) {
                const { x, y } = position;
                const roundToTwo = (n: number) => Math.round(n / 2) * 2

                Object.assign(updated, {
                    positionAbsolute: { x: roundToTwo(x), y: roundToTwo(y) },
                    position: { x: roundToTwo(x), y: roundToTwo(y) },
                });
            }

            return updated
        });

        if (changes.length === 1) {
            const [selectedNode] = changes;

            const { id, dragging, type } = selectedNode;

            if (dragging) {
                const helperLines = getHelperLinePositions({ nodeId: id });

                set({ helperLines }, false, 'onNodesChange/helperLines');
            } else if (type === 'position') {
                const [xNode, yNode, xTargetSide, yTargetSide, xSourceSide, ySourceSide] = helperLines.slice(2, 8);
                const foundSourceState = states.find(({ stateName }) => stateName === id);
                const { properties }: any = foundSourceState || {};
                const { x, w, y, h } = properties;

                if (xNode && xTargetSide && xSourceSide) {
                    const foundXNode = states.find(({ stateName }) => stateName === xNode);
                    const { properties }: any = foundXNode || {};
                    const { x: xNodeX, w: xNodeW } = properties;

                    let updatedX = x;
                    switch (xTargetSide) {
                        case 'left':
                            updatedX = xSourceSide === 'left' ? xNodeX : xNodeX - w;
                            break;
                        case 'right':
                            updatedX = xSourceSide === 'left' ? xNodeX + xNodeW : xNodeX + xNodeW - w;
                            break;
                    }

                    const updatedSelectedNode = {
                        ...selectedNode,
                        position: { y, x: updatedX },
                        positionAbsolute: { y, x: updatedX },
                    };

                    Object.assign(mappedChanges[0], updatedSelectedNode);
                }
                if (yNode && yTargetSide && ySourceSide) {
                    const foundYNode = states.find(({ stateName }) => stateName === yNode);
                    const { properties }: any = foundYNode || {};
                    const { y: yNodeY, h: yNodeH } = properties;

                    let updatedY = y;
                    switch (yTargetSide) {
                        case 'top':
                            updatedY = ySourceSide === 'top' ? yNodeY : yNodeY - h;
                            break;
                        case 'bottom':
                            updatedY = ySourceSide === 'top' ? yNodeY + yNodeH : yNodeY + yNodeH - h;
                            break;
                    }

                    const updatedSelectedNode = {
                        ...selectedNode,
                        position: { x: xNode ? mappedChanges[0]?.position?.x || x : x, y: updatedY },
                        positionAbsolute: { x: xNode ? mappedChanges[0]?.position?.x || x : x, y: updatedY },
                    };

                    Object.assign(mappedChanges[0], updatedSelectedNode);
                }

                set({ helperLines: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined] }, false, 'onNodesChange/helperLines')
            }
        }

        if (activeProcess) {
            const activeRoleIndex = (activeProcess?.roles || []).findIndex(
                ({ roleName }) => roleName === activeRole
            );

            const { properties = {} } = activeProcess.roles?.[activeRoleIndex] || {};

            const nodeColor = properties?.color || defaultColors?.[activeRoleIndex];

            const { states: allStates = [] } = activeProcess || {};

            const nodes = allStates.map((s, i, arr) =>
                nodeByState({
                    state: s,
                    index: i,
                    allNodesLength: arr.length,
                    color: nodeColor,
                    fullHandles: isStraightEdge,
                })
            );

            const updatedNodes = applyNodeChanges(mappedChanges, nodes);

            const updatedStates = updatedNodes.map((node) =>
                stateByNode({
                    node: { ...node, data: { ...node.data, color: nodeColor } },
                    allStates,
                })
            )

            set(
                {
                    activeProcess: {
                        ...activeProcess,
                        states: updatedStates,
                    },
                },
                false,
                'onNodesChange',
            );
        }
    },
    updateStateProperties: ({
        stateName,
        properties,
    }: {
        stateName: string;
        properties: { x?: number; y?: number; h?: number; w?: number };
    }) => {
        const { activeProcess, setStatesForActiveProcess } = get();

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
    },
    setStatesForActiveProcess: (states: WorkflowState[]) => {
        const { activeProcess } = get();

        if (activeProcess) {
            set(
                {
                    activeProcess: { ...activeProcess, states },
                },
                false,
                'setStatesForActiveProcess',
            );
        }
    },
    removeState: (stateNameToRemove: string) => {
        const { activeProcess } = get();

        const { roles = [] } = activeProcess || {};

        if (activeProcess) {
            const TransitionsFilter = (transitions: WorkFlowTransition[]) => {
                return transitions.filter(
                    ({ stateName, toStateName }) => stateName !== stateNameToRemove && toStateName !== stateNameToRemove
                );
            };

            const updatedRoles = roles.map((r) => ({
                ...r,
                transitions: TransitionsFilter(r?.transitions || []),
            }));

            const updatedStates = activeProcess.states?.filter((s) => s.stateName !== stateNameToRemove);

            set(
                {
                    activeProcess: { ...activeProcess, roles: updatedRoles, states: updatedStates },
                },
                false,
                'removeState',
            );
        }
    },
    updateStateProperty: ({ state, property, value }) => {
        const { activeProcess } = get();

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

            set(
                {
                    activeProcess: { ...activeProcess, states: updatedStates },
                },
                false,
                'updateStateProperty',
            );
        }
    },
    filteredStates: (existingStates) => {
        const { states } = get();

        return states.map((el) => el.stateName).filter(
            (stateName: string) => !existingStates.some((s) => s.stateName === stateName)
        );
    },
    addNewState: (name) => {
        const { states } = get();

        if (!states.some(({ stateName }) => stateName === name)) {

            const newState: WorkflowState = {
                stateId: null,
                stateName: name,
                requiresRoleAssignment: 0,
                requiresUserAssignment: 0,
                displayOrder: Math.max(...states.map(({ displayOrder }) => displayOrder || 0)) + 10,
            };

            set({ states: states.concat(newState) }, false, 'addNewState');
        }
    },
    setContextMenuNodeId: (nodeId) => {
        set({ contextMenuNodeId: nodeId }, false, 'setContextMenuNodeId');
    },
    setShowPortsAndCloseButtons: () => {
        const { showPortsAndCloseButtons } = get();

        set({ showPortsAndCloseButtons: !showPortsAndCloseButtons }, false, 'setShowPortsAndCloseButtons');
    },
});