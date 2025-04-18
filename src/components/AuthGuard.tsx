import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
