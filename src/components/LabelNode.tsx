import { FunctionComponent } from "react";

import { NodeProps } from "reactflow";

const LabelNode: FunctionComponent<NodeProps> = ({
  data,
}): JSX.Element => {
  const minWidth = 200;
  const minHeight = 30;

  return (
    <div
      className="LabelNodeBody"
      style={{
        minHeight,
        minWidth,
        textAlign: data?.centered ? 'center' : 'left',
        ...(data?.w && { width: data.w }),
      }}
    >
      {data?.label}
    </div>
  );
};

export default LabelNode;
