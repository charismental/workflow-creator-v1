import { Checkbox, ColorPicker } from "antd";
import React from "react";

interface ActiveRoleSettingsProps {
	color: string;
	roleIsToggled: boolean;
	useStyle?: any;
	toggleRole?: () => void;
	updateColor?: (color: string) => void;
	updateRoleProperty: (payload: { property: string; value?: any }) => void;
	roleHasPropertyActive: (property: string) => boolean;
}

const ActiveRoleSettings: React.FC<ActiveRoleSettingsProps> = ({
	useStyle = {},
	color,
	roleIsToggled,
	updateColor,
	toggleRole,
	updateRoleProperty,
	roleHasPropertyActive,
}) => {
	return (
		<div style={{ display: "inline-flex", justifyContent: "end", ...useStyle }}>
			<div style={{ display: "flex", paddingTop: "2px", marginRight: "30px" }}>
				<Checkbox
					checked={roleIsToggled}
					onChange={toggleRole}
				>
					{roleIsToggled ? "Active" : "Inactive"}
				</Checkbox>

				<Checkbox
					checked={roleHasPropertyActive("IsUniversal")}
					onChange={() =>
						updateRoleProperty({
							property: "IsUniversal",
							value: Number(!roleHasPropertyActive("IsUniversal")),
						})
					}
				>
					Universal
				</Checkbox>

				<Checkbox
					checked={roleHasPropertyActive("IsCluster")}
					onChange={() =>
						updateRoleProperty({
							property: "IsCluster",
							value: Number(!roleHasPropertyActive("IsCluster")),
						})
					}
				>
					Cluster
				</Checkbox>
			</div>
			{updateColor && (
				<ColorPicker
					disabled={!roleIsToggled}
					value={color}
					onChange={(e) => updateColor(e.toHexString())}
					allowClear
				/>
			)}
		</div>
	);
};

export default ActiveRoleSettings;
