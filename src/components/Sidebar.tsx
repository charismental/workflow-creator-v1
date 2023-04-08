import { Layout, Space } from "antd";
import { CSSProperties, FC } from "react";

const sidebar: CSSProperties = {
  backgroundColor: "#fff",
  padding: "40px 25px",
};
const sidebarSpacer: CSSProperties = {
  display: "flex",
};
interface SideBarProps {
  output: any;
  children: React.ReactNode
}

const Sidebar: FC<SideBarProps> = (props): JSX.Element => {
  const { Sider } = Layout;
  const { output, children } = props;

  return (
    // supposed to show tab on breakpoint if collapseWidth is 0
    <Sider width="300px" style={sidebar} breakpoint="lg"
    collapsedWidth="0">
      <Space direction="vertical" size="small" style={sidebarSpacer}>
        {children}
        {output && <pre>{JSON.stringify(output, null, 2)}</pre>}
      </Space>
    </Sider>
  );
};

export default Sidebar;
