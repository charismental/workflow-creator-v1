import { Layout, Space, Switch } from "antd";
import { CSSProperties, FC } from "react";

const sidebar: CSSProperties = {
  // backgroundColor: "white",
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
  output: any;
  children: React.ReactNode;
  theme: boolean;
  setColorTheme: (theme: boolean) => void;
}

const Sidebar: FC<SideBarProps> = (props): JSX.Element => {
  const { Sider } = Layout;
  const { output, children, theme, setColorTheme } = props;

  return (
    // supposed to show tab on breakpoint if collapseWidth is 0
    <Sider
      width={"300px"}
      style={sidebar}
      breakpoint="lg"
      collapsedWidth="0"
      reverseArrow={true}
      zeroWidthTriggerStyle={triggerStyle}
      theme={theme ? 'light' : 'dark'}
    >
      <Space direction="vertical" size="small" style={sidebarSpacer}>
        <div style={!theme ? {color: 'white'}: {}}>
          Color Theme
          <Switch onChange={() => setColorTheme(!theme)} style={{marginLeft: '20px'}}/>
        </div>
        {children}
        {output && <pre>{JSON.stringify(output, null, 2)}</pre>}
      </Space>
    </Sider>
  );
};

export default Sidebar;
