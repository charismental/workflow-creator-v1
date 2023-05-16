import { Checkbox } from "antd";
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
			<div style={{ display: 'flex', paddingTop: "2px", marginRight: "30px" }}>

				<Checkbox
					checked={roleIsToggled}
					onChange={toggleRole}
				>
					{roleIsToggled ? "Active" : "Inactive"}
				</Checkbox>

				<Checkbox
					checked={roleHasPropertyActive('isUniversal')}
					onChange={() => updateRoleProperty({ property: 'isUniversal', value: Number(!roleHasPropertyActive('isUniversal')) })}
				>
					Universal
				</Checkbox>

				<Checkbox
					checked={roleHasPropertyActive('isCluster')}
					onChange={() => updateRoleProperty({ property: 'isCluster', value: Number(!roleHasPropertyActive('isCluster')) })}
				>
					Cluster
				</Checkbox>
			</div>
			{updateColor && (
				<input
					disabled={!roleIsToggled}
					type="color"
					name="color"
					id="colorRef"
					value={color}
					onChange={(e) => updateColor(e.target.value)}
				/>
			)}
		</div>
	);
};

export default ActiveRoleSettings;
