import { RollbackOutlined } from "@ant-design/icons";
import { Checkbox, Popover } from "antd";
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
	const removeTransition = useMainStore((state) => state.removeTransition);
	const [removeState, contextMenuNodeId, updateStateProperties, onConnect, showAllRoles] =
		useMainStore(
			(state) => [
				state.removeState,
				state.contextMenuNodeId,
				state.updateStateProperties,
				state.onConnect,
				state.showAllRoles,
			],
			shallow
		);

	// todo, use only data.selfConnected
	// update util to always add selfConnected for stateToNode
	const selfConnected =
		useMainStore(
			(state) =>
				!!state.activeProcess?.Roles?.find(
					({ RoleName }) => RoleName === state.activeRole
				)?.Transitions?.find(({ StateName, ToStateName }) =>
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

	const popoverContent = (
		<>
			<div style={{ textAlign: "center" }}>
				<div>{id}</div>
				<Checkbox
					checked={false}
					onChange={() => console.log("changed")}
				>
					one
				</Checkbox>
			</div>
		</>
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
