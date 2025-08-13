import { useUserDropdown } from "@/hooks/useUserDropdown";
import { UserProfileButton } from "./UserProfileButton";
import { UserDropdownMenu } from "./UserDropdownMenu";

export function UserDropdown() {
  const { isOpen, dropdownRef, user, toggleDropdown, handleLogout } =
    useUserDropdown();

  return (
    <div className="relative" ref={dropdownRef}>
      <UserProfileButton user={user} onClick={toggleDropdown} />
      <UserDropdownMenu isOpen={isOpen} onLogout={handleLogout} />
    </div>
  );
}
