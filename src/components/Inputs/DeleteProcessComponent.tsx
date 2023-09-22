import { DeleteTwoTone } from "@ant-design/icons";

export interface DeleteProcessComponentProps {
	item: string;
	handler: (el: string) => any;
}

const DeleteProcessComponent: any = ({
	item,
	handler,
}: DeleteProcessComponentProps) => (
	() => <DeleteTwoTone
		twoToneColor="#eb2f96"
		style={{ marginLeft: "4px" }}
		onClick={(e: any) => {
			e.stopPropagation();
			handler(item);
		}}
	/>
)

export { DeleteProcessComponent };
