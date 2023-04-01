import { FC, useState } from "react";

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
  const [color, setColor] = useState("#d4d4d4");
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
      <form onSubmit={(e) => (e.preventDefault(), addNewStateOrRole("role", color))}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div>
            <label htmlFor="colorWell">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "lightblue" }}
          >
            Add Role +
          </button>
        </div>
      </form>
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
