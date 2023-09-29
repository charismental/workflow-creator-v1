import { toSvg } from "html-to-image";
import { Button, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { topMessage } from "components/UI";

const downloadAsImage = (dataUrl: any) => {
	const a = document.createElement("a");

	a.setAttribute("download", "workflow.svg");
	a.setAttribute("href", dataUrl);
	a.click();
}

const DownloadButton = () => {
	//@ts-ignore
	const element: HTMLElement = document.querySelector("#download");

	const onClick = () => {
		topMessage({
			type: 'loading',
			content: 'Generating Image',
			key: "downloadImage"
		});
		setTimeout(() => {
			toSvg(element, {
				backgroundColor: "#ffffff",
				filter: (node) => {
					const classesToCheck = ["react-flow__minimap", "react-flow__controls", "react-flow__handle", "react-flow__background"];

					return !node?.classList ||
						!classesToCheck.some(className => node.classList.contains(className));
				},
			}).then((dataUrl) => {
				downloadAsImage(dataUrl)
				topMessage({
					type: 'success',
					content: 'Download Will Begin Shortly...',
					duration: 1,
					key: "downloadImage"
				});
			})
		}, 350)
	};
	return (
		<>
			<Tooltip
				title={"Download Workflow as Image"}
				placement={"top"}
			>
				<Button
					icon={<DownloadOutlined />}
					onClick={onClick}
				/>
			</Tooltip>
		</>
	);
}

export { DownloadButton };
