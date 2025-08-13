import { User, ChevronDown } from "lucide-react";

interface UserProfileButtonProps {
  user: any;
  onClick: () => void;
}

export function UserProfileButton({ user, onClick }: UserProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
    >
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {user?.username || "Admin Nivora"}
        </div>
        <div className="text-xs text-gray-500 capitalize">
          {user?.role || "Super Admin"}
        </div>
      </div>
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
        <User className="w-4 h-4" />
      </div>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  );
}
