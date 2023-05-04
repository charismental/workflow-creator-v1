import { PlusCircleOutlined, PlusCircleTwoTone } from "@ant-design/icons";
import { Collapse, Divider, InputRef, Space, Input } from "antd";
import React, { useRef, useState } from "react";
import AddNewInput from "./AddNewInput";
import styles from "./StateCollapseBox.module.css";

const { Panel } = Collapse;

interface StateCollapsebox {
	items: string[];
	useStyle?: any;
	addNew?: any;
	disabled?: boolean;
	roleColor?: string;
}

const StateCollapseBox: React.FC<StateCollapsebox> = ({
	items,
	addNew,
	disabled = false,
	useStyle = {},
	roleColor = "#d4d4d4",
}) => {
	const [newStateName, setNewStateName] = useState("");
	const [searchStateName, setSearchStateName] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<InputRef>(null);

	const onDragStart = (event: any, nodeType: any) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	const onNewStateName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewStateName(event.target.value);
	};

	const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchStateName(event.target.value);
	};

	const addNewItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
		e.preventDefault();
		addNew && addNew(newStateName);
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
					<Panel
						header={"Add/Select State"}
						key="1"
					>
						<Input
							style={{ width: "100%", position: "sticky", top: 0 }}
							placeholder="Search States"
							value={searchStateName}
							onChange={onSearchChange}
						/>
						{items
							.filter((item) => item.toLowerCase().includes(searchStateName.toLowerCase()))
							.map((item) => (
								<div
									key={item}
									className={styles.stateItem}
									style={{
										backgroundColor: roleColor,
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
