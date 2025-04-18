import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Hello, {user?.user_metadata.full_name || " User"}
      </h1>
    </div>
  );
}
