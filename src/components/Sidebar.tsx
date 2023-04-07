import { Space, Layout } from "antd";
import { FC } from "react";
import SelectBox from "./SelectBox";
import StateCollapseBox from "./StateCollapseBox";

interface SideBarProps {
  stateList: string[];
  roleList: string[];
  setActiveRole: (value: string) => void;
  activeRole: string;
  output: {};
  addNewStateOrRole: any
}

const Sidebar: FC<SideBarProps> = ({
  stateList,
  roleList,
  setActiveRole,
  addNewStateOrRole,
  activeRole,
  output,
}): JSX.Element => {
  const { Sider } = Layout;

  const toggleRoleForProcess = (role: string): void => {
    console.log('addRoleToProcess', role)
  };

  return (
    <Sider width="300" style={{ backgroundColor: '#fff', padding: '40px 25px' }}>
      <Space direction="vertical" size="small" style={{display: 'flex'}}>
      <StateCollapseBox items={stateList} addNew={addNewStateOrRole}  />
      <SelectBox
        addNew={addNewStateOrRole}
        placeholder="Select Role"
        selectValue={activeRole}
        items={roleList}
        type={"role"}
        hasColorInput
        multiselectHandler={toggleRoleForProcess}
        selectOnChange={setActiveRole}
      />
      <pre>{JSON.stringify(output, null, 2)}</pre>
      </Space>
    </Sider>
  );
};

export default Sidebar;
