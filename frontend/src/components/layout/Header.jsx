import { useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { usePageNavigate } from "../../hooks/usePageNavigate.js";
import Logo from "../brand/Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header() {
  const navigate = usePageNavigate();
  const { clearUser, user } = useUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
          <button type="button" onClick={() => navigate("/frontpage")}>
            Dashboard
          </button>
        </nav>
        {user && <span className="user-chip">{user.name} {user.surname}</span>}
        <ThemeToggle />
        {user && (
          <div className="profile-menu">
            <button
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              className="profile-menu-button"
              type="button"
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            >
              Account
            </button>
            {isProfileMenuOpen && (
              <div className="profile-menu-panel" role="menu">
                <button
                  className="logoff-button"
                  role="menuitem"
                  type="button"
                  onClick={handleLogoff}
                >
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
