import { FallbackProps } from "react-error-boundary";

export default function ({ error, resetErrorBoundary }: FallbackProps) {
  console.log("From Error boundary: ", error);
  return (
    <div role="alert">
      <h1>Something went wrong:</h1>
      <details>{error.message}</details>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
