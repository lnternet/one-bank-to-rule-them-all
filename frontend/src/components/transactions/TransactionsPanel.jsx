import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../../api/bankingApi.js";

export default function TransactionsPanel({ account }) {
  const {
    data: transactions = [],
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["transactions", account.id],
    queryFn: () => getTransactions(account.id),
  });

  const balanceImpact = useMemo(
    () =>
      transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
      ),
    [transactions],
  );

  return (
    <section
      className="widget transactions-panel"
      id="transactions"
      aria-labelledby="transactions-title"
    >
      <div className="panel-header">
        <div>
          <p className="section-label">Account activity</p>
          <h2 id="transactions-title">{account.name} transactions</h2>
        </div>
        <div className="summary-pill">
          <span>Net</span>
          <strong>{formatMoney(balanceImpact, "USD")}</strong>
        </div>
      </div>

      {isLoading && <p className="state-message">Loading transactions...</p>}
      {isError && (
        <p className="state-message state-message-error">
          Transactions are unavailable right now.
        </p>
      )}
      {isSuccess && transactions.length === 0 && (
        <p className="state-message">No transactions found.</p>
      )}
      {isSuccess && transactions.length > 0 && (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <button
                className="transaction-item transaction-button"
                type="button"
                onClick={() => window.alert("Not implemented yet")}
              >
                <div
                  className={
                    transaction.amount < 0 ? "amount debit" : "amount credit"
                  }
                >
                  {formatMoney(transaction.amount, transaction.currency)}
                </div>
                <div className="transaction-details">
                  <strong>
                    {transaction.fromAccountName} to {transaction.toAccountName}
                  </strong>
                  <span>{formatDate(transaction.transactionDate)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(amount);
}
