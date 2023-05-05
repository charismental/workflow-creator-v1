import { Button, Tooltip } from "antd";

export default ({
    title,
    icon,
    clickEvent,
}: {
    title: string;
    icon?: React.ReactNode;
    clickEvent:
        | (React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>)
        | undefined;
}) => {
    return (
        <Tooltip
            placement="top"
            title={title}
        >
            <Button
                icon={icon}
                type={"default"}
                onClick={clickEvent}
            />
        </Tooltip>
    );
};