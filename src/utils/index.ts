import type { MenuProps } from "antd/es/menu";
export * from "./helperLine";
export * from "./simpleSVGPath";
export * from "./pointsHelpers";
export * from "./editEdgeHelpers";
export * from "./reactflowUtils";
export * from "./nodeUtils";
export * from "./edgeUtils";

type MenuItem = Required<MenuProps>["items"][number];

export const getItem = (
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
) => ({ key, icon, children, label, type });

export async function copyToClipboard(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		return { message: 'Copied to clipboard', success: true }
	} catch (err) {
		console.error('copyToClipboard: ', err);
		return { message: 'Unable to copy to clipboard', success: false }
	}
}
