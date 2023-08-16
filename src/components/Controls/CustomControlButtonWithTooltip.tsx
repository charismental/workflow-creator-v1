import { Button, Tooltip } from "antd";

const CustomControlButtonWithTooltip = ({
    title,
    icon,
    clickEvent,
    isDisabled
}: {
    title: string;
    icon?: React.ReactNode;
    isDisabled?: boolean,
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
                disabled={isDisabled}
            />
        </Tooltip>
    );
};

export { CustomControlButtonWithTooltip };