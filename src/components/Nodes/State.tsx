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

const State: FunctionComponent<NodeProps> = ({ id, isConnectable, data }): JSX.Element => {
	const removeState = useMainStore((state) => state.removeState, shallow);
	const updateStateProperty = useMainStore((state) => state.updateStateProperty);

	const contextMenuNodeId = useMainStore((state) => state.contextMenuNodeId, shallow);

	// todo: consolidate this with updateStateProperty
	const updateStateProperties = useMainStore((state) => state.updateStateProperties, shallow);

	const foundState = useMainStore((state) => (state?.activeProcess?.states || []).find(({ stateName }) => stateName === id));

	const onConnect = useMainStore((state) => state.onConnect, shallow);

	const removeTransition = useMainStore((state) => state.removeTransition, shallow);

	const isEdgeHovered = useMainStore((state) => state.hoveredEdgeNodes.includes(id))

	const showAllRoles = useMainStore((state) => state.showAllRoles, shallow);

	// todo, use only data.selfConnected
	// update util to always add selfConnected for stateToNode
	const selfConnected =
		useMainStore(
			(state) =>
				!!state.activeProcess?.roles
					?.find(({ roleName }) => roleName === state.activeRole)
					?.transitions?.find(({ stateName, toStateName }) =>
						[stateName, toStateName].every((el) => el === id)
					),
			shallow
		) || data?.selfConnected;

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
						value={foundState?.displayOrder || 0}
						onChange={handleDisplayOrderChange}
						maxLength={4}
					/>
				</Form.Item>
				<Form.Item colon={false} label="Requires Role Assignment">
					<Checkbox
						checked={!!foundState?.requiresRoleAssignment}
						onChange={() => updateStateProperty({ state: id, property: 'requiresRoleAssignment', value: !foundState?.requiresRoleAssignment })}
					/>
				</Form.Item>
				<Form.Item colon={false} label="Requires User Assignment">
					<Checkbox
						checked={!!foundState?.requiresUserAssignment}
						onChange={() => updateStateProperty({ state: id, property: 'requiresUserAssignment', value: !foundState?.requiresUserAssignment })}
					/>
				</Form.Item>
			</Form>
		</div>
	);

	const zIndexByTarget = (isSource = false) => {
		const zIndex = (isSource && !isTarget) || (!isSource && isTarget) ? 3 : 1;

		return { zIndex } 
	};

	return (
		<Popover
			destroyTooltipOnHide
			open={contextMenuNodeId === id}
			content={popoverContent}
		>
			<div
				key={`state-node-${id}`}
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
				{/* top source */}
				<Handle
					id="t_out_1"
					style={{ ...zIndexByTarget(true), left: 30, opacity: !isTarget ? 1 : 0 }}
					position={Position.Top}
					type="source"
					isConnectable={isConnectable}
				/>
				<Handle
					id="t_out_2"
					style={{ ...zIndexByTarget(true), opacity: !isTarget ? 1 : 0 }}
					position={Position.Top}
					type="source"
					isConnectable={isConnectable}
				/>
				<Handle
					id="t_out_3"
					style={{ ...zIndexByTarget(true), right: 24, left: 'unset', opacity: !isTarget ? 1 : 0 }}
					position={Position.Top}
					type="source"
					isConnectable={isConnectable}
				/>
				{/* right source */}
				<Handle
					id="r_out_1"
					style={{ ...zIndexByTarget(true), opacity: !isTarget ? 1 : 0 }}
					position={Position.Right}
					type="source"
					isConnectable={isConnectable}
				/>
				{/* bottom source */}
				<Handle
					id="b_out_1"
					style={{ ...zIndexByTarget(true), left: 30, opacity: !isTarget ? 1 : 0 }}
					position={Position.Bottom}
					type="source"
					isConnectable={isConnectable}
				/>
				<Handle
					id="b_out_2"
					style={{ ...zIndexByTarget(true), opacity: !isTarget ? 1 : 0 }}
					position={Position.Bottom}
					type="source"
					isConnectable={isConnectable}
				/>
				<Handle
					id="b_out_3"
					style={{ ...zIndexByTarget(true), right: 24, left: 'unset', opacity: !isTarget ? 1 : 0 }}
					position={Position.Bottom}
					type="source"
					isConnectable={isConnectable}
				/>
				{/* left source */}
				<Handle
					id="l_out_1"
					style={{ ...zIndexByTarget(true), opacity: !isTarget ? 1 : 0 }}
					position={Position.Left}
					type="source"
					isConnectable={isConnectable}
				/>
				{/* top target */}
				<Handle
					id="t_in_1"
					style={{ ...zIndexByTarget(), left: 30, opacity: isTarget ? 1 : 0 }}
					position={Position.Top}
					type="target"
					isConnectable={isConnectable}
				/>
				<Handle
					id="t_in_2"
					style={{ ...zIndexByTarget(), opacity: isTarget ? 1 : 0 }}
					position={Position.Top}
					type="target"
					isConnectable={isConnectable}
				/>
				<Handle
					id="t_in_3"
					style={{ ...zIndexByTarget(), right: 24, left: 'unset', opacity: isTarget ? 1 : 0 }}
					position={Position.Top}
					type="target"
					isConnectable={isConnectable}
				/>
				{/* right target */}
				<Handle
					id="r_in_1"
					style={{ ...zIndexByTarget(), opacity: isTarget ? 1 : 0 }}
					position={Position.Right}
					type="target"
					isConnectable={isConnectable}
				/>
				{/* bottom target */}
				<Handle
					id="b_in_1"
					style={{ ...zIndexByTarget(), left: 30, opacity: isTarget ? 1 : 0 }}
					position={Position.Bottom}
					type="target"
					isConnectable={isConnectable}
				/>
				<Handle
					id="b_in_2"
					style={{ ...zIndexByTarget(), opacity: isTarget ? 1 : 0 }}
					position={Position.Bottom}
					type="target"
					isConnectable={isConnectable}
				/>
				<Handle
					id="b_in_3"
					style={{ ...zIndexByTarget(), right: 24, left: 'unset', opacity: isTarget ? 1 : 0 }}
					position={Position.Bottom}
					type="target"
					isConnectable={isConnectable}
				/>
				{/* left target */}
				<Handle
					id="l_in_1"
					style={{ ...zIndexByTarget(), opacity: isTarget ? 1 : 0 }}
					position={Position.Left}
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
					{data?.label || "Unknown State"}
				</div>
			</div>
		</Popover>
	);
};

export { State };
