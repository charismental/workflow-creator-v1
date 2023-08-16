import { toPng } from "html-to-image";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const downloadAsImage = (dataUrl: any) => {
	const a = document.createElement("a");

	a.setAttribute("download", "reactflow.png");
	a.setAttribute("href", dataUrl);
	a.click();
}

const DownloadButton = () => {
	//@ts-ignore
	const element: HTMLElement = document.querySelector("#download");

	const onClick = () => {
		toPng(element, {
			backgroundColor: "#ffffff",
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
		}).then(downloadAsImage);
	};
	return (
		<Button
			icon={<DownloadOutlined />}
			onClick={onClick}
		/>
	);
}

export { DownloadButton };
