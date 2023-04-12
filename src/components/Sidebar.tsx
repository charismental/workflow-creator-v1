import { Layout, Space, Radio, Typography } from "antd";
import type { RadioChangeEvent } from "antd";
import { CSSProperties, FC, useEffect, useState } from "react";
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
  output: any;
  children: React.ReactNode;
}

const Sidebar: FC<SideBarProps> = (props): JSX.Element => {
  const { Sider } = Layout;
  const { output, children } = props;
  const [edgeType, setEdgeType] = useMainStore(
    (state) => [state.edgeType, state.setEdgeType],
    shallow
  );

  const onChange = (e: RadioChangeEvent) => {
    setEdgeType(e.target.value);
  };

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
      <Space direction="vertical" size="small" style={sidebarSpacer}>
        {children}
        {output && (
          <pre style={{ maxHeight: "20em", overflow: "scroll" }}>
            {JSON.stringify(output, null, 2)}
          </pre>
        )}
        <div style={{ marginTop: "50px" }}>
          <div>
            <Text underline>Choose Edge Type</Text>
          </div>
          <div>
            <Radio.Group
              onChange={onChange}
              value={edgeType}
              defaultValue={"Straight"}
            >
              <Space direction={"vertical"}>
                <Radio value={"Straight"}>Straight</Radio>
                <Radio value={"Bezier"}>Bezier</Radio>
                <Radio value={"Step"}>Step</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
      </Space>
    </Sider>
  );
};

export default Sidebar;
