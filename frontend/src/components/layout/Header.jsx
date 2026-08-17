import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import Logo from "../brand/Logo.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { clearUser, user } = useUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const initials = user ? `${user.name[0] ?? ""}${user.surname[0] ?? ""}` : "";

  function handleLogoff() {
    clearUser();
    setIsProfileMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="site-header">
      <Logo />
      <div className="header-actions">
        <nav className="site-nav" aria-label="Primary navigation">
          <span>Accounts</span>
          <span>Investments</span>
        </nav>
        {user && <span className="user-chip">{user.name} {user.surname}</span>}
        {user && (
          <div className="profile-menu">
            <button
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              className="monogram-button"
              type="button"
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            >
              {initials}
            </button>
            {isProfileMenuOpen && (
              <div className="profile-menu-panel" role="menu">
                <button role="menuitem" type="button" onClick={handleLogoff}>
                  Log off
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
