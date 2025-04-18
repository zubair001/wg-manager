import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-16 border-b flex items-center px-4 justify-between bg-white">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold">WG Manager</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        >
          <UserCircle className="w-6 h-6 text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Profile
            </button>
            <hr className="border-t" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
