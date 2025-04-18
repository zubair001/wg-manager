import { useAuth } from "@/hooks/useAuth";
import { ListGrid } from "@/components";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">
          Hello, {user?.user_metadata.full_name || "User"}!
        </h1>
      </div>
      <ListGrid />
    </div>
  );
}
