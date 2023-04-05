import { Space, Typography } from "antd";
import { FC } from "react";
import SelectBox from "./SelectBox";
import styles from "./Sidebar.module.css";

const { Paragraph } = Typography;

interface SideBarProps {
  stateList: string[];
  roleList: string[];
  setActiveRole: (value: string) => void;
  output: {};
  addNewStateOrRole: (value: string, color?: string, name?: string) => void;
}

const Sidebar: FC<SideBarProps> = ({
  stateList,
  roleList,
  setActiveRole,
  addNewStateOrRole,
  output,
}): JSX.Element => {
  return (
    <aside>
      <Space direction="vertical" size="small" style={{display: 'flex'}}>
      <Paragraph className={styles.formTitleBar}>Add State</Paragraph>
      <SelectBox
        addNewStateOrRole={addNewStateOrRole}
        items={stateList}
        type={"state"}
      />
      <Paragraph className={styles.formTitleBar}>Add Role</Paragraph>
      <SelectBox
        addNewStateOrRole={addNewStateOrRole}
        items={roleList}
        type={"role"}
        setActiveRole={setActiveRole}
      />
      <pre>{JSON.stringify(output, null, 2)}</pre>
      </Space>
    </aside>
  );
};

export default Sidebar;
