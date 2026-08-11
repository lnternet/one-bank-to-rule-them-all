import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import Logo from "../brand/Logo.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { clearUser, user } = useUser();

  function handleLogoff() {
    clearUser();
    navigate("/");
  }

  return (
    <header className="site-header">
      <Logo />
      <div className="header-actions">
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#accounts">Accounts</a>
          <a href="#investments">Investments</a>
        </nav>
        {user && <span className="user-chip">{user.name} {user.surname}</span>}
        <button className="icon-button" type="button" aria-label="Open profile">
          <span className="profile-icon" aria-hidden="true" />
        </button>
        <button className="icon-button" type="button" aria-label="Log off" onClick={handleLogoff}>
          <span className="logoff-icon" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
