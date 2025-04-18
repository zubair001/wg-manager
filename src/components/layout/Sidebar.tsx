import { LayoutDashboard, ClipboardList, Star, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Tasks", icon: ClipboardList, path: "/tasks" },
  { name: "Templates", icon: Star, path: "/templates" },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Archived", icon: ClipboardList, path: "/archived" },
  { name: "Profile", icon: Settings, path: "/profile" },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      } bg-gray-100 border-r h-full p-2 flex flex-col`}
    >
      {links.map(({ name, icon: Icon, path }) => (
        <div
          key={name}
          onClick={() => navigate(path)}
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 cursor-pointer"
        >
          <Icon className="w-5 h-5" />
          {isOpen && <span className="text-sm text-gray-800">{name}</span>}
        </div>
      ))}
    </aside>
  );
}
