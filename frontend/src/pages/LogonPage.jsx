import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../api/bankingApi.js";
import Logo from "../components/brand/Logo.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function LogonPage() {
  const navigate = useNavigate();
  const { selectUser } = useUser();
  const {
    data: users = [],
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  function handleUserSelection(user) {
    const [name, ...surnameParts] = user.name.split(" ");

    selectUser({
      id: user.id,
      name,
      surname: surnameParts.join(" "),
      fullName: user.name,
    });
    navigate("/frontpage");
  }

  return (
    <div className="app-shell">
      <header className="site-header logon-header">
        <Logo />
      </header>

      <main className="page-shell logon-shell">
        <section className="widget logon-panel" aria-labelledby="logon-title">
          <div className="widget-header">
            <div>
              <p className="section-label">Select profile</p>
              <h1 id="logon-title" className="panel-title">
                Log on
              </h1>
            </div>
          </div>

          {isLoading && <p className="state-message">Loading users...</p>}
          {isError && (
            <p className="state-message state-message-error">
              Users are unavailable right now.
            </p>
          )}
          {isSuccess && (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    className="user-option"
                    type="button"
                    onClick={() => handleUserSelection(user)}
                  >
                    <span className="user-avatar" aria-hidden="true">
                      {user.name.slice(0, 1)}
                    </span>
                    <span>{user.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
