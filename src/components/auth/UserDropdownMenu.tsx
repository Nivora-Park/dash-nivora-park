import { LogOut } from "lucide-react";

interface UserDropdownMenuProps {
  isOpen: boolean;
  onLogout: () => void;
}

export function UserDropdownMenu({ isOpen, onLogout }: UserDropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
      <button
        onClick={onLogout}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}
