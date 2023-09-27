import { Layout, Space } from "antd";
import { CSSProperties, FC } from "react";

const sidebar: CSSProperties = {
	backgroundColor: "white",
	zIndex: 20,
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

export { Sidebar };
