import { FallbackProps } from "react-error-boundary";

export default function ({ error, resetErrorBoundary }: FallbackProps) {
  console.log("From Error boundary: ", error);
  return (
    <div
      role="alert"
      style={{
        marginTop: "100px",
        marginLeft: "100px",
      }}
    >
      <h1>Something went wrong:</h1>
      <details style={{ marginBottom: "20px" }}>{error.message}</details>
      <button onClick={resetErrorBoundary}>Reset Error</button>
    </div>
  );
}
