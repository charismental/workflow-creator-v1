import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Input,
  InputRef,
  Select,
  Space,
  Tag,
} from "antd";
import React, { useRef, useState } from "react";

const { Option } = Select;

interface SelectBoxProps {
  type: 'role' | 'state' | 'process';
  items: string[];
  selectValue?: string;
  useStyle?: any;
  selectOnChange?: (value: string) => void;
  addNew?: (type: string, color?: string, label?: string) => void;
  placeholder?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  items,
  selectOnChange,
  addNew,
  selectValue,
  useStyle = {},
  type,
  placeholder,
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

  const addNewItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    addNew && addNew(type, color, name);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      value={selectValue}
      style={{ width: '100%', ...useStyle }}
      placeholder={placeholder}
      optionLabelProp="children"
      dropdownRender={(menu) => (
        <>
          {menu}
          {addNew &&
            <>
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
                    onClick={addNewItem}
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
                      onClick={addNewItem}
                    ></Button>
                  </>
                )}
              </Space>
            </>}
        </>
      )}
    >
      {items.map((item) => (
        <Option key={item} value={item} label={item}>
          {type !== "state" ? (
            <div onClick={() => selectOnChange && selectOnChange(item)}>
              {item}
            </div>
          ) : (
            <Tag
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
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
