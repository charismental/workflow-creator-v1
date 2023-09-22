import { CopyTwoTone } from "@ant-design/icons";
import React from "react";

export interface CloneProcessComponentProps {
	item: string;
	handler: (el: string) => any;
	validProcesses: string[];
}

const CloneProcessComponent: any = ({
	item,
	handler,
	validProcesses = [],
}: CloneProcessComponentProps) => (validProcesses.includes(item) ? (
	() => <CopyTwoTone
		onClick={(e: any) => {
			e.stopPropagation();
			handler(item);
		}}
	/>
) : () => <></>)

export { CloneProcessComponent };
