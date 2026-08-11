import AccountList from "./components/accounts/AccountList.jsx";
import InvestmentGraph from "./components/investments/InvestmentGraph.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import NotificationsWidget from "./components/notifications/NotificationsWidget.jsx";

export default function Frontpage() {
  return (
    <div className="app-shell">
      <Header />

      <main className="page-shell">
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
