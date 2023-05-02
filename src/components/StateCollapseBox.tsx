import { PlusCircleOutlined, PlusCircleTwoTone } from "@ant-design/icons";
import { Collapse, Divider, InputRef, Space, AutoComplete } from "antd";
import React, { useRef, useState } from "react";
import useMainStore from "store";
import { shallow } from "zustand/shallow";
import AddNewInput from "./AddNewInput";
import styles from "./StateCollapseBox.module.css";

const { Panel } = Collapse;

interface StateCollapsebox {
  items: string[];
  useStyle?: any;
  addNew?: any;
  disabled?: boolean;
}

const StateCollapseBox: React.FC<StateCollapsebox> = ({
  items,
  addNew,
  disabled = false,
  useStyle = {},
}) => {
  const [newStateName, setNewStateName] = useState("");
  const [searchStateName, setSearchStateName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [activeRole] = useMainStore((state) => [state.activeRole], shallow);

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onNewStateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewStateName(event.target.value);
  };

  const handleSearch = (value: string) => {
    return items.find((el) => el.startsWith(value));
  };

  const onSearchChange = (value: string) => {
    setSearchStateName(value);
  };
  const itemColor = () => {
    // return roleColors[activeRole];
    return "#ddd";
  };

  const addNewItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    addNew && addNew(name);
    setNewStateName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div style={{ border: "3px solid #d4d4d4", borderRadius: "10px" }}>
      <div>
        <Collapse
          onChange={() => setIsOpen(!isOpen)}
          ghost
          accordion
          style={{
            width: "100%",
            maxHeight: "400px",
            overflowY: "auto",
            ...useStyle,
          }}
          size="small"
          expandIconPosition="end"
        >
          <Panel header={"Add/Select State"} key="1">
            <AutoComplete
              placeholder={"Search States"}
              allowClear
              onSearch={(val) => handleSearch(val)}
              onChange={onSearchChange}
              value={searchStateName}
              open={searchStateName.length > 0}
              style={{ width: 200 }}
              onSelect={(value) => console.log("selected", value)}
              dropdownMatchSelectWidth={190}
              options={items.map((el) => ({ value: el }))}
              filterOption={(inputValue, item) =>
                (item &&
                  item.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                    -1) ||
                false
              }
            />
            {items.map((item) => (
              <div
                key={item}
                className={styles.stateItem}
                style={{
                  backgroundColor: itemColor(),
                  ...(disabled && { pointerEvents: "none" }),
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                draggable
                onDragStart={(event) => onDragStart(event, item)}
              >
                {item}
              </div>
            ))}
          </Panel>
        </Collapse>
      </div>
      {isOpen && (
        <div>
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <AddNewInput
              hasColorInput={false}
              changeEvent={onNewStateName}
              placeholder="Add New State"
              inputValue={newStateName}
              buttonShape="circle"
              buttonType="text"
              disabledState={!newStateName.length}
              addNew={addNewItem}
              pressEnterHandler={newStateName?.length && addNewItem}
              icon={
                !newStateName.length ? (
                  <PlusCircleOutlined style={{ fontSize: "20px" }} />
                ) : (
                  <PlusCircleTwoTone style={{ fontSize: "20px" }} />
                )
              }
            />
          </Space>
        </div>
      )}
    </div>
  );
};

export default StateCollapseBox;
