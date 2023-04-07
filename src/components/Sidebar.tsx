import { Space, Layout } from "antd";
import { FC } from "react";
import SelectBox from "./SelectBox";
import CollapseBox from "./CollapseBox";

interface SideBarProps {
  stateList: string[];
  roleList: string[];
  setActiveRole: (value: string) => void;
  activeRole: string;
  output: {};
  addNewStateOrRole: (value: string, color?: string, name?: string) => void;
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
      {/* <SelectBox
        addNew={addNewStateOrRole}
        items={stateList}
        type={"state"}
        isDraggable
        placeholder="Select State"
      /> */}
      <CollapseBox items={stateList} type={"state"} addNew={addNewStateOrRole}  />
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
