import { FC } from "react";
import { Typography, RadioChangeEvent, Radio, Space } from "antd";

const { Text } = Typography;

interface ToggleEdgeProps {
	edgeType: string;
	setEdgeType: (el: string) => void;
}

const ToggleEdgeTypes: FC<ToggleEdgeProps> = ({ edgeType, setEdgeType }) => {
	const onChange = (e: RadioChangeEvent) => {
		setEdgeType(e.target.value);
	};
	return (
		<div style={{ marginTop: "50px" }}>
			<div>
				<Text underline>Choose Edge Type</Text>
			</div>
			<div>
				<Radio.Group
					onChange={onChange}
					value={edgeType}
					defaultValue={"straight"}
				>
					<Space direction={"vertical"}>
						<Radio value={"straight"}>Straight</Radio>
						<Radio value={"bezier"}>Bezier</Radio>
						<Radio value={"step"}>Step</Radio>
					</Space>
				</Radio.Group>
			</div>
		</div>
	);
};

export { ToggleEdgeTypes };
