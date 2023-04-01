import {
  Button,
  ButtonProps,
  Input,
  Label,
  Select,
  Switch,
  Text,
  makeStyles,
  shorthands,
  useId
} from "@fluentui/react-components";
import { AddSquare24Regular } from "@fluentui/react-icons";
import { FC, FormEventHandler, useState } from "react";
import { useMainStore } from "store";

const useStyles = makeStyles({
  roleFormContainer: {
    ...shorthands.border("1px", "solid", "black"),
    ...shorthands.borderRadius("20px"),
    ...shorthands.padding("4px", "5%"),
    ...shorthands.margin("20px"),
  },
  roleNameInput: {
    maxWidth: "90%",
    ...shorthands.margin(0, "auto"),
  },
  formTitleBar: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    ...shorthands.borderBottom("1px", "solid", "black"),
    ...shorthands.margin(0, 0, "20px", 0),
  },
});
interface SideBarProps {
  stateList: string[];
  roleList: string[];
  setActiveRole: (value: string) => void;
  output: {};
  addNewStateOrRole: (value: string, color?: string, name?: string) => void;
}

const AddButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      appearance={"transparent"}
      icon={<AddSquare24Regular />}
      size={"small"}
    />
  );
};

const Sidebar: FC<SideBarProps> = ({
  stateList,
  roleList,
  setActiveRole,
  output,
  addNewStateOrRole,
}): JSX.Element => {
  const style = useStyles();
  const colorId = useId("input-color");
  const roleNameId = useId("input-rolename");
  const stateNameId = useId("input-statename");
  const [color, setColor] = useState("#d4d4d4");
  const [roleName, setRoleName] = useState("");
  const [stateName, setStateName] = useState("");
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const submitForm: FormEventHandler<HTMLFormElement> = (e) => (
    e.preventDefault(),
    addNewStateOrRole("role", color, roleName),
    setRoleName("")
  );
  const updatedarkmode = useMainStore((state) => state.updateDarkMode)
  return (
    <aside>
      <Switch onChange={updatedarkmode} />

      <div className={style.roleFormContainer}>
        <Text className={style.formTitleBar}>Add a role</Text>
        <form onSubmit={submitForm}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <Label htmlFor={colorId}>Choose Color: </Label>
              <input
                id={colorId}
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <Label htmlFor={roleNameId}>Role Name: </Label>
              <Input
                className={style.roleNameInput}
                type="text"
                appearance="outline"
                id={roleNameId}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                contentAfter={<AddButton type="submit" />}
              />
            </div>
          </div>
        </form>
      </div>
      <div className={style.roleFormContainer}>
        <Text className={style.formTitleBar}>Add State</Text>
        <form
          onSubmit={(e) => (
            e.preventDefault(),
            addNewStateOrRole("state", "", stateName),
            setStateName("")
          )}
        >
          <div style={{ marginBottom: "10px" }}>
            <Label htmlFor={stateNameId}>State Name: </Label>
            <Input
              className={style.roleNameInput}
              type="text"
              appearance="outline"
              id={stateNameId}
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              contentAfter={<AddButton type="submit" />}
            />
          </div>
        </form>
      </div>
      <Text className="description">States:</Text>
      {stateList.map((state) => {
        return (
          <Text
            key={state}
            className="dndnode"
            onDragStart={(event) => onDragStart(event, state)}
            draggable
          >
            {state}
          </Text>
        );
      })}
      <Select
        className="form-control"
        onChange={(e) => setActiveRole(e.target.value)}
      >
        {roleList.map((roleKey) => {
          return (
            <option key={roleKey} value={roleKey}>
              {roleKey}
            </option>
          );
        })}
      </Select>

      <pre>{JSON.stringify(output, null, 2)}</pre>
    </aside>
  );
};

export default Sidebar;
