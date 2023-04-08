// import { PlusOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Divider,
//   Input,
//   InputRef,
//   Select,
//   Space,
//   Checkbox,
// } from "antd";
import { Checkbox } from "antd";
import React from "react";

interface ActiveRoleSettingsProps {
  color: string;
  roleIsToggled: boolean;
  useStyle?: any;
  toggleRole?: () => void;
  updateColor?: (color: string) => void;
}

const ActiveRoleSettings: React.FC<ActiveRoleSettingsProps> = ({
  useStyle = {},
  color,
  roleIsToggled,
  updateColor,
  toggleRole,
}) => {
  return (
    <div style={{ display: 'inline-flex', justifyContent: 'end', ...useStyle }}>
      {toggleRole && (
        <div style={{ display: 'flex', paddingTop: '2px', marginRight: '30px', width: '60px' }}>
          <Checkbox
            checked={roleIsToggled}
            onChange={toggleRole}
          >{roleIsToggled ? 'Active' : 'Inactive'}</Checkbox>
        </div>
      )}
      {updateColor && <input
        type="color"
        name="color"
        id="colorRef"
        value={color}
        onChange={(e) => updateColor(e.target.value)}
      />}
    </div>
  );
};

export default ActiveRoleSettings;
