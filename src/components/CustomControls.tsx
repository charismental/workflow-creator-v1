import { getRectOfNodes, useReactFlow, useStoreApi } from 'reactflow';

export default () => {
    const store = useStoreApi();
    const {fitView, zoomIn, zoomOut,getNodes} = useReactFlow()

    const showNodeState = () => {
        const {nodeInternals} = store.getState();
        const nodes = Array.from(nodeInternals).map(([, node]) => node);
        console.log('nodes: ', nodes)
        console.log('getNodes: ', getNodes())
        console.log("rect of Nodes: ", getRectOfNodes(nodes))
    }

    return (
        <aside>
            <button onClick={showNodeState}>console stuff</button>
            <button onClick={() => zoomIn()}>zoom in</button>
            <button onClick={() => zoomOut()}>zoom out</button>
        </aside>
    )
}