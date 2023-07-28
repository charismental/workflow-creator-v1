import { message } from 'antd';

type TopMessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface TopMessageProps {
    type: TopMessageType;
    content: string;
    duration?: number;
    onClose?: () => void;
    key?: string;
}

const TopMessage: any = (props: TopMessageProps) => {
    const { type = 'success', content = '', duration = 5, onClose, key } = props;

    return message[type]({ content, duration, onClose, ...(key && { key }) });
};

export default TopMessage;