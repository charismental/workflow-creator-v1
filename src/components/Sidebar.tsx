import { Layout, Space, Radio, Typography } from "antd";
import type { RadioChangeEvent } from "antd";
import { CSSProperties, FC } from "react";
import useMainStore from "store";
import { shallow } from "zustand/shallow";

const { Text } = Typography;

const sidebar: CSSProperties = {
	backgroundColor: "white",
};
const sidebarSpacer: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	rowGap: "2rem",
	padding: "4rem 1rem",
};
const triggerStyle: CSSProperties = {
	color: "white",
	backgroundColor: "blue",
};
interface SideBarProps {
	children: React.ReactNode;
}

const Sidebar: FC<SideBarProps> = (props): JSX.Element => {
	const { Sider } = Layout;
	const { children } = props;

	return (
		// supposed to show tab on breakpoint if collapseWidth is 0
		<Sider
			width={"300px"}
			style={sidebar}
			breakpoint="lg"
			theme="dark"
			collapsedWidth="0"
			reverseArrow={true}
			zeroWidthTriggerStyle={triggerStyle}
		>
			<Space
				direction="vertical"
				size="small"
				style={sidebarSpacer}
			>
				{children}
			</Space>
		</Sider>
	);
};

export default Sidebar;
