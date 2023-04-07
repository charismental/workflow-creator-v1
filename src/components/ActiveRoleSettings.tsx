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
import React from "react";

interface ActiveRoleSettingsProps {
  color: string;
  roleIsToggled: boolean;
  useStyle?: any;
  toggleRole?: (role: string) => void;
  updateColor?: (color: string) => void;
}

const ActiveRoleSettings: React.FC<ActiveRoleSettingsProps> = ({
  useStyle = {},
  color,
  // roleIsToggled,
  updateColor,
}) => {
  return (
    <div style={{ display: 'inline-flex', justifyContent: 'end', ...useStyle }}>
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
