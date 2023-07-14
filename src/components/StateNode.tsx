import { RollbackOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Popover } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties, FunctionComponent, useState } from "react";

import { Handle, NodeProps, NodeResizer, Position, useStore as useReactFlowStore } from "reactflow";
import useMainStore from "store";
import { shallow } from "zustand/shallow";

const checkboxStyle: CSSProperties = {
	position: "absolute",
	zIndex: 100,
	cursor: "pointer",
	width: "20px",
	height: "20px",
	right: "5px",
	top: "3px",
};

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

const StateNode: FunctionComponent<NodeProps> = ({ id, isConnectable, data }): JSX.Element => {
	const removeState = useMainStore((state) => state.removeState, shallow);
	const updateStateProperty = useMainStore((state) => state.updateStateProperty);

	const contextMenuNodeId = useMainStore((state) => state.contextMenuNodeId, shallow);
	// todo: consolidate this with updateStateProperty
	const updateStateProperties = useMainStore((state) => state.updateStateProperties, shallow);

	const foundState = useMainStore((state) => (state?.activeProcess?.States || []).find(({ StateName }) => StateName === id));

	const onConnect = useMainStore((state) => state.onConnect, shallow);

	const removeTransition = useMainStore((state) => state.removeTransition, shallow);

	const isEdgeHovered = useMainStore((state) => state.hoveredEdgeNodes.includes(id))

	const showAllRoles = useMainStore((state) => state.showAllRoles, shallow);

	// todo, use only data.selfConnected
	// update util to always add selfConnected for stateToNode
	const selfConnected =
		useMainStore(
			(state) =>
				!!state.activeProcess?.Roles
					?.find(({ RoleName }) => RoleName === state.activeRole)
					?.Transitions?.find(({ StateName, ToStateName }) =>
						[StateName, ToStateName].every((el) => el === id)
					),
			shallow
		) || data?.selfConnected;

	const onResize = (_: any, payload: any) => {
		const { height: h, width: w, x, y } = payload;
		updateStateProperties({ StateName: data.label, properties: { x, y, h, w } });
	};

	const [isMouseOver, setIsMouseOver] = useState(false);

	const toggleSelfConnection = () => {
		const connectionPayload = { source: id, target: id };

		if (!selfConnected) {
			onConnect({ ...connectionPayload, sourceHandle: null, targetHandle: null });
		} else {
			removeTransition(connectionPayload);
		}
	};

	const connectionNodeId = useReactFlowStore(connectionNodeIdSelector);

	const isTarget =
		connectionNodeId &&
		connectionNodeId !== id &&
		(!showAllRoles || connectionNodeId.charAt(0) === id.charAt(0));

	const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };

	// do something here => initial width: 200, minWidth: 50?
	const minWidth = 200;
	const minHeight = 30;

	const handleDisplayOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		const numbersOnlyRegex = /^\d{1,4}$/;

		if (numbersOnlyRegex.test(inputValue) || inputValue === '' || inputValue === '-') {
			updateStateProperty({ state: id, property: 'DisplayOrder', value: inputValue });
		}
	};

	const popoverContent = (
		<div style={{ maxWidth: 800 }}>
			<Title level={4} style={{ marginTop: '0', marginBottom: '12px', textAlign: 'center' }}>{id}</Title>
			<Form layout="horizontal" labelWrap labelAlign="left" labelCol={{ span: 9 }} wrapperCol={{ span: 9, offset: 3 }} style={{ padding: '12px'}}>
				<Form.Item label="Display Order">
					<Input
						type="number"
						value={foundState?.DisplayOrder || 0}
						onChange={handleDisplayOrderChange}
						maxLength={4}
					/>
				</Form.Item>
				<Form.Item colon={false} label="Requires Role Assignment">
					<Checkbox
						checked={!!foundState?.RequiresRoleAssignment}
						onChange={() => updateStateProperty({ state: id, property: 'RequiresRoleAssignment', value: !foundState?.RequiresRoleAssignment })}
					/>
				</Form.Item>
				<Form.Item colon={false} label="Requires User Assignment">
					<Checkbox
						checked={!!foundState?.RequiresUserAssignment}
						onChange={() => updateStateProperty({ state: id, property: 'RequiresUserAssignment', value: !foundState?.RequiresUserAssignment })}
					/>
				</Form.Item>
			</Form>
		</div>
	);

	return (
		<Popover
			destroyTooltipOnHide
			open={contextMenuNodeId === id}
			content={popoverContent}
		>
			<div
				className="stateNodeBody"
				onMouseOver={() => setIsMouseOver(true)}
				onMouseOut={() => setIsMouseOver(false)}
				style={{
					minHeight,
					minWidth,
					borderStyle: isTarget ? "dashed" : "solid",
					backgroundColor: isTarget ? "#ffcce3" : data?.color || "#ccd9f6",
					...(isEdgeHovered && { boxShadow: '0 0 4px 4px #0ff' }),
					...(data?.w && { width: data.w }),
					...(data?.h && { height: data.h }),
				}}
			>
				{selfConnected && (
					<RollbackOutlined
						rotate={270}
						style={{
							color: "black",
							fontSize: "24px",
							position: "absolute",
							top: "-21px",
							right: "12px",
						}}
					/>
				)}
				<NodeResizer
					onResize={onResize}
					isVisible={isMouseOver}
					minWidth={minWidth}
					minHeight={minHeight}
					handleStyle={{ zIndex: 400 }}
				/>
				{!isTarget && isMouseOver && (
					<>
						<Checkbox
							style={checkboxStyle}
							checked={selfConnected}
							onChange={toggleSelfConnection}
						/>
						<div
							className="state-delete-button"
							onClick={() => removeState(data.label)}
						/>
					</>
				)}

				<Handle
					className="targetHandle"
					style={{ zIndex: 2 }}
					position={Position.Top}
					type="source"
					isConnectable={isConnectable}
				/>
				<Handle
					className="targetHandle"
					style={targetHandleStyle}
					position={Position.Bottom}
					type="target"
					isConnectable={isConnectable}
				/>
				{data?.label || "Unknown State"}
			</div>
		</Popover>
	);
};

export default StateNode;
