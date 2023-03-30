import React from "react";

export default ({
  stateList = [],
  roleList = [],
  setActiveRole,
  output = {},
  addNewStateOrRole
}) => {
  const onDragStart = (event, nodeType) => {
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
      <button
        style={{ backgroundColor: "lightblue" }}
        onClick={() => addNewStateOrRole("state")}
      >
        Add State +
      </button>
      <button
        style={{ backgroundColor: "lightblue" }}
        onClick={() => addNewStateOrRole("role")}
      >
        Add Role +
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
