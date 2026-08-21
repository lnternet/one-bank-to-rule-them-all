import AccountList from "./components/accounts/AccountList.jsx";
import InvestmentGraph from "./components/investments/InvestmentGraph.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import NotificationsWidget from "./components/notifications/NotificationsWidget.jsx";
import { useUser } from "./context/UserContext.jsx";

export default function Frontpage() {
  const { user } = useUser();
  const displayName = user?.fullName || `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();

  return (
    <div className="app-shell">
      <Header />

      <main className="page-shell">
        <section className="dashboard-welcome" aria-labelledby="welcome-title">
          <p className="eyebrow">One Bank dashboard</p>
          <h1 id="welcome-title">Welcome back, {displayName}</h1>
          <p>
            Here is your personal banking overview for accounts, investments,
            notifications, and recent activity.
          </p>
        </section>

        <div className="dashboard">
          <div className="dashboard-main">
            <AccountList />
            <InvestmentGraph />
          </div>
          <div className="dashboard-side">
            <NotificationsWidget />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
