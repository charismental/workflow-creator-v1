import { Modal, Space, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Edge } from "reactflow";

const { Title } = Typography;

interface EdgeModalProps {
	allCurrentEdgesInCanvas: Edge<any>[];
	edgeModalOpen: boolean;
	setEdgeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({ allCurrentEdgesInCanvas, edgeModalOpen, setEdgeModalOpen }: EdgeModalProps) => {
	return (
		<Modal
			bodyStyle={{ padding: "8px", width: "calc(min-content + 20px)" }}
			open={edgeModalOpen}
			closable
			footer={null}
			onCancel={() => setEdgeModalOpen(false)}
		>
			<Title level={3}>All Current Connections (edges)</Title>
			{allCurrentEdgesInCanvas.length ? (
				allCurrentEdgesInCanvas.map((edge, index) => (
					<div key={index}>
						<Space align={"center"}>
							<div className="modal_item">{index + 1}.</div>
							<div className="modal_item">
								{edge.source || "No Source"} <ArrowRightOutlined />
							</div>
							<div className="modal_item">{edge.target || "No Target"}</div>
						</Space>
					</div>
				))
			) : (
				<div>There Are Currently No Edges</div>
			)}
		</Modal>
	);
};
