import ReactDiffViewer from 'react-diff-viewer-continued';

const DiffViewer = ({ oldValue, newValue }: { oldValue?: string | object; newValue?: string | object }) => {
    return (
        <>
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                <ReactDiffViewer oldValue={oldValue} newValue={newValue} splitView={true} />
            </div>
        </>
    )
};

export { DiffViewer };