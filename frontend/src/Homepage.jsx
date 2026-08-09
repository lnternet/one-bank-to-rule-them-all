import { useEffect, useMemo, useState } from 'react';

const accountId = 'demo-account';
const apiBaseUrl = typeof __API_BASE_URL__ === 'string' ? __API_BASE_URL__ : '';

export default function Homepage() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/accounts/${accountId}/transactions`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
        setStatus('success');
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }

        setError('Transactions are unavailable right now.');
        setStatus('error');
      }
    }

    loadTransactions();

    return () => controller.abort();
  }, []);

  const balanceImpact = useMemo(
    () => transactions.reduce((total, transaction) => total + transaction.amount, 0),
    [transactions],
  );

  return (
    <main className="page-shell">
      <div className="dashboard">
        <section className="hero" aria-labelledby="homepage-title">
          <p className="eyebrow">One Bank to Rule Them All</p>
          <h1 id="homepage-title">Work in progress</h1>
        </section>

        <section className="transactions-panel" aria-labelledby="transactions-title">
          <div className="panel-header">
            <div>
              <p className="section-label">Account activity</p>
              <h2 id="transactions-title">Recent transactions</h2>
            </div>
            <div className="summary-pill">
              <span>Net</span>
              <strong>{formatMoney(balanceImpact, 'USD')}</strong>
            </div>
          </div>

          {status === 'loading' && <p className="state-message">Loading transactions...</p>}
          {status === 'error' && <p className="state-message state-message-error">{error}</p>}
          {status === 'success' && transactions.length === 0 && (
            <p className="state-message">No transactions found.</p>
          )}
          {status === 'success' && transactions.length > 0 && (
            <ul className="transaction-list">
              {transactions.map((transaction) => (
                <li className="transaction-item" key={transaction.id}>
                  <div className="transaction-mark" aria-hidden="true">
                    {transaction.description.slice(0, 1)}
                  </div>
                  <div className="transaction-details">
                    <strong>{transaction.description}</strong>
                    <span>{formatDate(transaction.transactionDate)}</span>
                  </div>
                  <span className={transaction.amount < 0 ? 'amount debit' : 'amount credit'}>
                    {formatMoney(transaction.amount, transaction.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
  }).format(amount);
}
