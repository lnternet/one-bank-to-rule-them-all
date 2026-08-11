import { Navigate, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer.jsx";
import Header from "../components/layout/Header.jsx";
import TransactionsPanel from "../components/transactions/TransactionsPanel.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function TransactionsPage() {
  const { user } = useUser();
  const { state } = useLocation();
  const account = state?.account;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!account) {
    return <Navigate to="/frontpage" replace />;
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="page-shell">
        <div className="page-content">
          <TransactionsPanel account={account} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
