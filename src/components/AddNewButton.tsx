import { Button, ButtonProps, Input, InputProps, InputRef } from "antd";
import { CSSProperties, FC, useRef } from "react";

interface AddNewButtonProps {
  placeholder?: InputProps["placeholder"];
  inputValue?: InputProps["value"];
  changeEvent: React.ChangeEventHandler<HTMLInputElement> | undefined;
  buttonShape: ButtonProps["shape"];
  buttonType: ButtonProps["type"];
  disabledState: ButtonProps["disabled"];
  addNew: any;
  icon?: ButtonProps["icon"];
  hasColorInput: boolean;
  colorInputValue?: CSSProperties['color'];
  onColorChange?: any;
}

const AddNewButton: FC<AddNewButtonProps> = (props) => {
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
    colorInputValue
  } = props;
  const inputRef = useRef<InputRef>(null);

  return (
    <div style={{ display: "flex" }}>
      <Input
        placeholder={placeholder}
        ref={inputRef}
        value={inputValue}
        onChange={changeEvent}
      />
      {hasColorInput && (
        <input
          type="color"
          name="color"
          id="colorRef"
          value={colorInputValue}
          style={{ marginLeft: "8px" }}
          onChange={onColorChange}
        />
      )}
      <Button
        shape={buttonShape}
        disabled={disabledState}
        icon={icon}
        onClick={addNew}
        type={buttonType}
      />
    </div>
  );
};

export default AddNewButton;
