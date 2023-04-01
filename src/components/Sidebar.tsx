import { Input, Label, makeStyles, shorthands, useId } from '@fluentui/react-components';
import { FC, useState } from "react";

const useStyles = makeStyles({
  roleFormContainer: {
    ...shorthands.border('1px', 'solid', 'black'),
    ...shorthands.borderRadius('20px'),
    ...shorthands.padding('20px'),
    ...shorthands.margin('20px')
  }
})
interface SideBarProps {
  stateList: string[];
  roleList: string[];
  setActiveRole: (value: string) => void;
  output: {};
  addNewStateOrRole: (value: string, color?: string) => void;
}

const Sidebar: FC<SideBarProps> = ({
  stateList,
  roleList,
  setActiveRole,
  output,
  addNewStateOrRole,
}): JSX.Element => {
  const style = useStyles();
  const colorId = useId('input-color')
  const roleNameId = useId('input-rolename')
  const [color, setColor] = useState("#d4d4d4");
  const [roleName, setRoleName] = useState('');
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">States:</div>
      {stateList.map((state) => {
        return (
          <div
            key={state}
            className="dndnode"
            onDragStart={(event) => onDragStart(event, state)}
            draggable
          >
            {state}
          </div>
        );
      })}
      <div className={style.roleFormContainer}>
        <div style={{textAlign: 'center', marginBottom: '8px'}}>Add a role</div>
      <form onSubmit={(e) => (e.preventDefault(), addNewStateOrRole("role", color))}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{marginBottom: '10px'}}>
            <Label htmlFor={colorId}>Choose Color: </Label>
            <input
              id={colorId}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div style={{marginBottom: '10px'}}>
            <Label htmlFor={roleNameId}>Role Name: </Label>
            <Input appearance='outline' id={roleNameId} value={roleName} onChange={(e) => setRoleName(e.target.value)} />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "lightblue" }}
          >
            Add Role +
          </button>
        </div>
      </form>
      </div>
      <button
        style={{ backgroundColor: "lightblue" }}
        onClick={() => addNewStateOrRole("state")}
      >
        Add State +
      </button>
      <select
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
      </select>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </aside>
  );
};

export default Sidebar;
