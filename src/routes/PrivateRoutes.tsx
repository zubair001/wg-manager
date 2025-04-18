import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { AppLayout } from "@/components";

export default function PrivateRoutes() {
  const { session, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!session) return <Navigate to="/login" replace />;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
