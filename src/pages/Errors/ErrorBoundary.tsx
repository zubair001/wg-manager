import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./Fallback";
import { ChildrenProps } from "@/interfaces/types";

const GlobalErrorBoundary = ({ children }: ChildrenProps) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default GlobalErrorBoundary;
