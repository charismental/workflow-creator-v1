import React from "react";
import { toPng } from "html-to-image";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import useMainStore from "store";

function downloadImage(dataUrl: any) {
	const a = document.createElement("a");

	a.setAttribute("download", "reactflow.png");
	a.setAttribute("href", dataUrl);
	a.click();
}

function DownloadButton() {
	const reactFlowInstance = useMainStore((state) => state.reactFlowInstance);

	//@ts-ignore
	const element: HTMLElement = document.querySelector("#download");
	const onClick = () => {
		reactFlowInstance?.fitView();
		toPng(element, {
			backgroundColor: "#d3d3d3",
			filter: (node) => {
				// we don't want to add the minimap and the controls to the image
				if (
					node?.classList?.contains("react-flow__minimap") ||
					node?.classList?.contains("react-flow__controls")
				) {
					return false;
				}

				return true;
			},
		}).then(downloadImage);
	};
	return (
		<Button
			icon={<DownloadOutlined />}
			onClick={onClick}
		/>
	);
}

export default DownloadButton;
