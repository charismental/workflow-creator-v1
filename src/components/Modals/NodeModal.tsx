import { Divider, Modal, Space, Typography } from "antd";
import { Node } from "reactflow";

const { Title } = Typography;

interface EdgeModalProps {
	allCurrentNodesInCanvas: Node<any>[];
	nodeModalOpen: boolean;
	setNodeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({ allCurrentNodesInCanvas, nodeModalOpen, setNodeModalOpen }: EdgeModalProps) => {
	return (
		<Modal
			bodyStyle={{ padding: "8px", width: "calc(min-content + 20px)" }}
			open={nodeModalOpen}
			closable
			footer={null}
			onCancel={() => setNodeModalOpen(false)}
		>
			<Title level={3}>All Current Nodes (states)</Title>
			<div style={{ overflowY: "auto", maxHeight: "calc(100vh - 300px)" }}>
				{allCurrentNodesInCanvas.length ? (
					allCurrentNodesInCanvas.map((node, index) => (
						<div key={index}>
							<Space align={"center"}>
								<div className="modal_item">{index + 1}.</div>
								<div
									className="modal_item"
									style={{ fontWeight: "bold" }}
								>
									{node.id || "ID Unknown"}
								</div>
							</Space>
							<div style={{ textIndent: "30px" }}>Width: {node.width}</div>
							<div style={{ textIndent: "30px" }}>Height: {node.height}</div>
						</div>
					))
				) : (
					<div>There Are Currently No Nodes</div>
				)}
			</div>
		</Modal>
	);
};
