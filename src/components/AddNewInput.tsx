import {
  Button,
  ButtonProps,
  Col,
  Input,
  InputProps,
  InputRef,
  Row,
  Space,
} from "antd";
import { CSSProperties, FC, useRef } from "react";

interface AddNewInputProps {
  placeholder?: InputProps["placeholder"];
  inputValue?: InputProps["value"];
  changeEvent: React.ChangeEventHandler<HTMLInputElement> | undefined;
  pressEnterHandler: any;
  buttonShape: ButtonProps["shape"];
  buttonType: ButtonProps["type"];
  disabledState: ButtonProps["disabled"];
  addNew: any;
  icon?: ButtonProps["icon"];
  hasColorInput: boolean;
  colorInputValue?: CSSProperties["color"];
  onColorChange?: any;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  buttonStyle?: CSSProperties;
}

const AddNewInput: FC<AddNewInputProps> = (props) => {
  const {
    placeholder,
    buttonType,
    inputValue,
    changeEvent,
    buttonShape,
    disabledState,
    onColorChange,
    addNew,
    icon,
    hasColorInput,
    colorInputValue,
    containerStyle,
    inputStyle,
    buttonStyle,
    pressEnterHandler = () => {},
  } = props;
  const inputRef = useRef<InputRef>(null);

  return (
    <Space align="center" style={{ ...containerStyle }}>
      <Row justify={'space-between'} align={'middle'} wrap={false} gutter={16}>
        <Col flex={3}>
          <Input
            style={{ ...inputStyle }}
            placeholder={placeholder}
            ref={inputRef}
            value={inputValue}
            onChange={changeEvent}
            onPressEnter={pressEnterHandler}
          />
        </Col>
        {hasColorInput && (
          <Col flex={2}>
            <input
              type="color"
              name="color"
              id="colorRef"
              value={colorInputValue}
              onChange={onColorChange}
            />
          </Col>
        )}
        <Col flex={2}>
          <Button
            style={{ ...buttonStyle }}
            shape={buttonShape}
            disabled={disabledState}
            icon={icon}
            onClick={addNew}
            type={buttonType}
          />
        </Col>
      </Row>
    </Space>
  );
};

export default AddNewInput;
