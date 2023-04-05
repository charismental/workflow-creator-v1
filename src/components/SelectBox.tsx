import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Divider,
    Input,
    InputRef,
    Select,
    Space,
    Tag,
    Typography
} from "antd";
import React, { useRef, useState } from "react";

const { Option } = Select;
const { Text } = Typography;
let index = 0;

interface SelectBoxProps {
  type: "role" | "state"; // add "process" later
  items: string[];
  setActiveRole?: (value: string) => void;
  addNewStateOrRole: (value: string, color?: string, name?: string) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  items,
  setActiveRole,
  addNewStateOrRole,
  type,
}) => {
  const [color, setColor] = useState("#d4d4d4");
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addNew = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    addNewStateOrRole(type, color, name);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      style={{ width: 200 }}
      placeholder="Add Role"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <Input
              placeholder={`Add New ${type}`}
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            {type === "state" && (
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={addNew}
              ></Button>
            )}
            {type === "role" && (
              <>
                {" "}
                <input
                  type="color"
                  name="color"
                  id="colorRef"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={addNew}
                ></Button>
              </>
            )}
          </Space>
        </>
      )}
    >
      {items.map((item) => (
        <Option key={item} value={item} label={item}>
          {type === "role" ? (
            <div>
              <Text onClick={() => setActiveRole && setActiveRole(item)}>
                {item}
              </Text>
            </div>
          ) : (
            
            <Tag
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => setActiveRole && setActiveRole(item)}
              draggable
              onDragStart={(event) => onDragStart(event, item)}
            >
              {item}
            </Tag>
          )}
        </Option>
      ))}
    </Select>
  );
};

export default SelectBox;
