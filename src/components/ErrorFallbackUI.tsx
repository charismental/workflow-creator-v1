import { FallbackProps } from "react-error-boundary";

export default function ({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <details>{error.message}</details>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
