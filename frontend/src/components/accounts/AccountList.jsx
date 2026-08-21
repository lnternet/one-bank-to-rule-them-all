import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../api/bankingApi.js";
import { useUser } from "../../context/UserContext.jsx";
import { usePageNavigate } from "../../hooks/usePageNavigate.js";

export default function AccountList() {
  const navigate = usePageNavigate();
  const { user } = useUser();
  const {
    data: accounts = [],
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["accounts", user.id],
    queryFn: () => getAccounts(user.id),
  });

  function handleAccountSelection(account) {
    navigate("/transactions", { state: { account } });
  }

  return (
    <section className="widget account-widget" id="accounts" aria-labelledby="accounts-title">
      <div className="widget-header">
        <div>
          <p className="section-label">Portfolio</p>
          <h2 id="accounts-title">Accounts</h2>
        </div>
      </div>

      {isLoading && <p className="state-message">Loading accounts...</p>}
      {isError && (
        <p className="state-message state-message-error">
          Accounts are unavailable right now.
        </p>
      )}
      {isSuccess && accounts.length === 0 && (
        <p className="state-message">No accounts found.</p>
      )}
      {isSuccess && accounts.length > 0 && (
        <ul className="account-list">
          {accounts.map((account) => (
            <li key={account.id}>
              <button
                className="account-item account-button"
                type="button"
                onClick={() => handleAccountSelection(account)}
              >
                <div>
                  <strong>{account.name}</strong>
                  <span>{account.number}</span>
                </div>
                <strong className={account.balance < 0 ? "amount debit" : "amount"}>
                  {formatMoney(account.balance, account.currency)}
                </strong>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(amount);
}
