import { RollbackOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Popover } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties, FunctionComponent, useState } from "react";
import { Handle, NodeProps, NodeResizer, Position, useStore as useReactFlowStore } from "reactflow";

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

const StateWithFullHandles: FunctionComponent<NodeProps> = ({ id, isConnectable, data }): JSX.Element => {
	const {
		label,
		selfConnected,
		color = "#ccd9f6",
		w,
		h,
		contextMenuNodeId,
		details,
		isEdgeHovered,
		showAllRoles,
		updateStateProperties,
		removeState,
		updateStateProperty,
		removeTransition,
		onConnect,
	} = data;

	const onResize = (_: any, payload: any) => {
		const { height: h, width: w, x, y } = payload;
		updateStateProperties({ stateName: data.label, properties: { x, y, h, w } });
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

	const isConnecting = !!connectionNodeId;

	// do something here => initial width: 200, minWidth: 50?
	const minWidth = 120;
	const minHeight = 30;

	const handleDisplayOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		const numbersOnlyRegex = /^\d{1,4}$/;

		if (numbersOnlyRegex.test(inputValue) || inputValue === '' || inputValue === '-') {
			updateStateProperty({ state: id, property: 'displayOrder', value: inputValue });
		}
	};

	const popoverContent = (
		<div style={{ maxWidth: 800 }}>
			<Title level={4} style={{ marginTop: '0', marginBottom: '12px', textAlign: 'center' }}>{id}</Title>
			<Form layout="horizontal" labelWrap labelAlign="left" labelCol={{ span: 9 }} wrapperCol={{ span: 9, offset: 3 }} style={{ padding: '12px' }}>
				<Form.Item label="Display Order">
					<Input
						type="number"
						value={details?.displayOrder || 0}
						onChange={handleDisplayOrderChange}
						maxLength={4}
					/>
				</Form.Item>
				<Form.Item colon={false} label="Requires Role Assignment">
					<Checkbox
						checked={!!details?.requiresRoleAssignment}
						onChange={() => updateStateProperty({ state: id, property: 'requiresRoleAssignment', value: !details?.requiresRoleAssignment })}
					/>
				</Form.Item>
				<Form.Item colon={false} label="Requires User Assignment">
					<Checkbox
						checked={!!details?.requiresUserAssignment}
						onChange={() => updateStateProperty({ state: id, property: 'requiresUserAssignment', value: !details?.requiresUserAssignment })}
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
				key={`state-node-${id}-straight`}
				className="state-full-body"
				onMouseOver={() => setIsMouseOver(true)}
				onMouseOut={() => setIsMouseOver(false)}
				style={{
					minHeight,
					minWidth,
					borderStyle: isTarget ? "dashed" : "solid",
					backgroundColor: isTarget ? "#ffcce3" : color,
					...(isEdgeHovered && { boxShadow: '0 0 4px 4px #0ff' }),
					...(w && { width: w }),
					...(h && { height: h }),
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
							onClick={() => removeState(label)}
						/>
					</>
				)}
				{!isConnecting && (
					<Handle
						className="full-handle"
						style={{ zIndex: 3 }}
						position={Position.Top}
						type="source"
						isConnectable={isConnectable}
					/>
				)}
				<Handle
					className="full-handle"
					style={{ zIndex: 1 }}
					position={Position.Bottom}
					type="target"
					isConnectable={isConnectable}
				/>
				<div
					style={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						padding: '0 4px',
					}}
				>
					{label || "Unknown State"}
				</div>
			</div>
		</Popover>
	);
};

export { StateWithFullHandles };
