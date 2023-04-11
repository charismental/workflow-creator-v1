import { PlusCircleOutlined, PlusCircleTwoTone } from "@ant-design/icons";
import { Checkbox, Divider, InputRef, Select, Space } from "antd";
import React, { useRef, useState } from "react";
import AddNewInput from "./AddNewInput";

const { Option } = Select;

interface SelectBoxProps {
  type: "role" | "state" | "process";
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
  const initialColor = "#d4d4d4";
  const [color, setColor] = useState(initialColor);
  const [name, setName] = useState("");
  const [resetKey, setResetKey] = useState(Math.random());
  const [dragPreventBlur, setDragPreventBlur] = useState<boolean | undefined>(
    undefined
  );
  const inputRef = useRef<InputRef>(null);

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const isDuplicateName = items.some(item => {
    const label = typeof item === "string" ? item : item?.label;

    return label === name;
  })

  const addNewItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    addNew && addNew({ type, color, name });
    setTimeout(() => {
      inputRef.current?.focus();
      setName("");
      setColor(initialColor);
    }, 10);
  };

  return (
    <Select
      key={resetKey}
      value={selectValue}
      open={dragPreventBlur}
      style={{  ...useStyle }}
      placeholder={placeholder}
      optionLabelProp="label"
      dropdownRender={(menu) => (
        <>
          {menu}
          {addNew && (
            <>
              <Divider style={{ margin: "8px 0" }} />
              <Space style={{ padding: "0 8px 4px" }} >
                <AddNewInput
                  disabledState={!name.length || isDuplicateName}
                  buttonShape="default"
                  buttonType="text"
                  addNew={addNewItem}
                  icon={
                    !name.length || isDuplicateName ? (
                      <PlusCircleOutlined style={{ fontSize: "20px" }} />
                    ) : (
                      <PlusCircleTwoTone style={{ fontSize: "20px" }} />
                    )
                  }
                  pressEnterHandler={name?.length && !isDuplicateName && addNewItem}
                  hasColorInput={hasColorInput}
                  colorInputValue={color}
                  onColorChange={(e: any) => setColor(e.target.value)}
                  placeholder={`Add New ${type}`}
                  inputValue={name}
                  changeEvent={onNameChange}
                />
              </Space>
            </>
          )}
        </>
      )}
    >
      {items.map((item) => {
        const label = typeof item === "string" ? item : item?.label;

        return (
          <Option key={label} label={label}>
            {isDraggable ? (
              <div
                // hacky
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDragPreventBlur(true);
                  setTimeout(() => {
                    setDragPreventBlur(undefined);
                    setResetKey(Math.random());
                  }, 200);
                }}
                draggable
                onDragStart={(event) => onDragStart(event, label)}
              >
                {label}
              </div>
            ) : (
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                onClick={() => selectOnChange && selectOnChange(label)}
              >
                <div>{label}</div>
                {multiselectHandler && typeof item !== "string" && (
                  <Checkbox
                    checked={item.value}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      multiselectHandler(item);
                    }}
                  />
                )}
              </div>
            )}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectBox;
