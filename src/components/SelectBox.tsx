import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  InputRef,
  Select,
  Space,
} from "antd";
import React, { useRef, useState } from "react";

const { Option } = Select;

interface SelectBoxProps {
  type: 'role' | 'state' | 'process';
  items: string[] | { label: string; value: boolean }[];
  selectValue?: string;
  useStyle?: any;
  selectOnChange?: (value: string) => void;
  addNew?: any;
  isDraggable?: boolean;
  placeholder?: string;
  hasColorInput?: boolean;
  multiselectHandler?: (el: any) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  items,
  selectOnChange,
  addNew,
  selectValue,
  useStyle = {},
  type,
  placeholder,
  multiselectHandler,
  isDraggable = false,
  hasColorInput = false,
}) => {
  const [color, setColor] = useState("#d4d4d4");
  const [name, setName] = useState("");
  const [resetKey, setResetKey] = useState(Math.random())
  const [dragPreventBlur, setDragPreventBlur] = useState<boolean | undefined>(undefined);
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
    addNew && addNew({ type, color, name });
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      key={resetKey}
      value={selectValue}
      open={dragPreventBlur}
      style={{ width: '100%', ...useStyle }}
      placeholder={placeholder}
      optionLabelProp="label"
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
                {hasColorInput && (
                  <input
                    type="color"
                    name="color"
                    id="colorRef"
                    value={color}
                    style={{ marginLeft: '8px' }}
                    onChange={(e) => setColor(e.target.value)}
                  />
                )}
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={addNewItem}
                />
              </Space>
            </>}
        </>
      )}
    >
      {items.map((item) => {
        const label = typeof item === 'string' ? item : item.label;

        return (
          <Option key={label} label={label}>
            {isDraggable ? (
              <div
                // hacky
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDragPreventBlur(true);
                  setTimeout(() => {
                    setDragPreventBlur(undefined)
                    setResetKey(Math.random())
                  }, 200)
                }}
                draggable
                onDragStart={(event) => onDragStart(event, label)}
              >
                {label}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => selectOnChange && selectOnChange(label)}>
                <div>{label}</div>
                {multiselectHandler && typeof item !== 'string' && <Checkbox checked={item.value} onClick={(e: any) => {
                  e.stopPropagation()
                  multiselectHandler(item)
                }} />}
              </div>
            )}
          </Option>
        )
      })}
    </Select>
  );
};

export default SelectBox;
