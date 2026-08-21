import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categorizeAccountTransactions,
  getConfigurations,
  getTransaction,
  getTransactions,
} from "../../api/bankingApi.js";

export default function TransactionsPanel({ account }) {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsError, setDetailsError] = useState(null);
  const [loadingTransactionId, setLoadingTransactionId] = useState("");
  const [aiNotice, setAiNotice] = useState("");
  const [isCategorizingAccount, setIsCategorizingAccount] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const {
    data: transactions = [],
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["transactions", account.id],
    queryFn: () => getTransactions(account.id),
  });

  const {
    data: configurations = {
      transactionTypes: [],
      spendingCategories: [],
    },
    isLoading: isLoadingConfigurations,
  } = useQuery({
    queryKey: ["configurations"],
    queryFn: getConfigurations,
  });

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesType = selectedType
          ? transaction.type === selectedType
          : true;
        const matchesCategory = selectedCategory
          ? transaction.spendingCategory === selectedCategory
          : true;

        return matchesType && matchesCategory;
      }),
    [selectedCategory, selectedType, transactions],
  );

  const balanceImpact = useMemo(
    () =>
      filteredTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
      ),
    [filteredTransactions],
  );

  const loadTransactionDetails = async (
    transactionId,
    shouldShowDetails = true,
  ) => {
    setDetailsError(null);
    setLoadingTransactionId(transactionId);

    try {
      const details = await getTransaction(transactionId);
      if (shouldShowDetails) {
        setSelectedTransaction(details);
      }
      return details;
    } catch {
      setDetailsError({
        transactionId,
        message: "Transaction details are unavailable right now.",
      });
      return null;
    } finally {
      setLoadingTransactionId("");
    }
  };

  const handleShowDetails = async (transaction) => {
    if (selectedTransaction?.id === transaction.id) {
      setSelectedTransaction(null);
      setDetailsError(null);
      return;
    }

    await loadTransactionDetails(transaction.id);
  };

  const handleCategorySelection = async (category) => {
    setIsCategoryMenuOpen(false);

    if (!category) {
      setSelectedCategory("");
      return;
    }

    setIsCategorizingAccount(true);
    setAiNotice("AI is reviewing transaction details and sorting them into spending categories...");

    try {
      const result = await categorizeAccountTransactions(account.id);
      queryClient.setQueryData(["transactions", account.id], result.transactions);
      setSelectedCategory(category);
      setAiNotice(`${result.message} Showing ${category} transactions.`);
    } catch (error) {
      const message =
        error.response?.data ??
        "AI category sorting is unavailable right now. Check that the backend was restarted and has the API key in its environment.";
      setAiNotice(message);
    } finally {
      setIsCategorizingAccount(false);
    }
  };

  const handlePrintTransaction = async (transaction) => {
    const details =
      selectedTransaction?.id === transaction.id
        ? selectedTransaction
        : await loadTransactionDetails(transaction.id, false);

    if (!details) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const categoryRow = details.spendingCategory
      ? `
            <div class="row">
              <strong>Category:</strong>
              <span>${escapeHtml(details.spendingCategory)}</span>
            </div>`
      : "";

    doc.write(`
      <html>
        <head>
          <title>Transaction Statement</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .receipt { border: 1px solid #ccc; padding: 20px; border-radius: 8px; max-width: 520px; margin: 0 auto; }
            h2 { border-bottom: 2px solid #5a8ec4; padding-bottom: 10px; margin-top: 0; }
            .row { display: flex; justify-content: space-between; gap: 24px; margin: 12px 0; font-size: 14px; }
            .row span { text-align: right; }
            .message { display: block; margin-top: 6px; color: #555; line-height: 1.5; }
            .amount { font-size: 18px; font-weight: bold; color: ${details.amount < 0 ? "#cc0000" : "#006600"}; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <p style="text-align: center; font-weight: 700;">One Bank To Rule Them All</p>
            <h2>Transaction Receipt</h2>
            <div class="row">
              <strong>Transaction ID:</strong>
              <span>${escapeHtml(details.id)}</span>
            </div>
            <div class="row">
              <strong>Account:</strong>
              <span>${escapeHtml(account.name)}</span>
            </div>
            <div class="row">
              <strong>From:</strong>
              <span>${escapeHtml(details.fromAccountName)} (${escapeHtml(details.fromAccountId)})</span>
            </div>
            <div class="row">
              <strong>To:</strong>
              <span>${escapeHtml(details.toAccountName)} (${escapeHtml(details.toAccountId)})</span>
            </div>
            <div class="row">
              <strong>Date:</strong>
              <span>${formatDate(details.transactionDate)}</span>
            </div>
            <div class="row">
              <strong>Type:</strong>
              <span>${escapeHtml(details.type)}</span>
            </div>
            ${categoryRow}
            <div>
              <strong>Message:</strong>
              <span class="message">${escapeHtml(details.message)}</span>
            </div>
            <div class="row" style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 10px;">
              <strong>Amount:</strong>
              <span class="amount">${formatMoney(details.amount, details.currency)}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  const clearFilters = () => {
    setSelectedType("");
    setSelectedCategory("");
  };

  const hasActiveFilters = selectedType || selectedCategory;

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
        <div className="transaction-filter-box" aria-label="Transaction filters">
          <div className="transaction-filter-header">
            {/* <span>Filters</span>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters}>
                Clear
              </button>
            )} */}
          </div>
          <label className="transaction-filter-group">
            <span>Type</span>
            <select
              value={selectedType}
              disabled={isLoadingConfigurations}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="">All types</option>
              {configurations.transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="transaction-filter-group">
            <span>Category</span>
            <div className="category-select">
              <button
                type="button"
                className="category-select-trigger"
                aria-expanded={isCategoryMenuOpen}
                aria-haspopup="listbox"
                disabled={isLoadingConfigurations || isCategorizingAccount}
                onClick={() => setIsCategoryMenuOpen((isOpen) => !isOpen)}
              >
                {selectedCategory ? (
                  <CategoryChip category={selectedCategory} />
                ) : (
                  <span>All categories</span>
                )}
              </button>
              {isCategoryMenuOpen && (
                <div className="category-select-menu" role="listbox">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedCategory === ""}
                    onClick={() => handleCategorySelection("")}
                  >
                    All categories
                  </button>
                  {configurations.spendingCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      role="option"
                      aria-selected={selectedCategory === category}
                      onClick={() => handleCategorySelection(category)}
                    >
                      <CategoryChip category={category} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>
        <div className="summary-pill">
          <span>Net</span>
          <strong>{formatMoney(balanceImpact, "USD")}</strong>
        </div>
      </div>

      {aiNotice && <p className="ai-category-notice">{aiNotice}</p>}

      {isLoading && <p className="state-message">Loading transactions...</p>}
      {isError && (
        <p className="state-message state-message-error">
          Transactions are unavailable right now.
        </p>
      )}
      {isSuccess && transactions.length === 0 && (
        <p className="state-message">No transactions found.</p>
      )}
      {isSuccess &&
        transactions.length > 0 &&
        filteredTransactions.length === 0 && (
          <p className="state-message">No transactions match these filters.</p>
        )}
      {isSuccess && filteredTransactions.length > 0 && (
        <ul className="transaction-list">
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="transaction-item transaction-button">
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
                  <div className="transaction-meta">
                    <span>{formatDate(transaction.transactionDate)}</span>
                    <span>{transaction.type}</span>
                    {transaction.spendingCategory && (
                      <CategoryChip category={transaction.spendingCategory} />
                    )}
                  </div>
                </div>
                <div className="transaction-actions">
                  <button
                    type="button"
                    className="transaction-action-button"
                    aria-expanded={selectedTransaction?.id === transaction.id}
                    aria-label={`Show details for ${transaction.fromAccountName} to ${transaction.toAccountName}`}
                    onClick={() => handleShowDetails(transaction)}
                  >
                    {loadingTransactionId === transaction.id ||
                    isCategorizingAccount
                      ? "Loading"
                      : selectedTransaction?.id === transaction.id
                        ? "Hide"
                        : "Details"}
                  </button>
                  <button
                    type="button"
                    className="transaction-action-button"
                    aria-label={`Print statement for ${transaction.fromAccountName} to ${transaction.toAccountName}`}
                    title="Print Statement"
                    onClick={() => handlePrintTransaction(transaction)}
                  >
                    Print
                  </button>
                </div>
              </div>
              {detailsError?.transactionId === transaction.id &&
                loadingTransactionId === "" && (
                  <p className="transaction-detail-error">
                    {detailsError.message}
                  </p>
                )}
              {selectedTransaction?.id === transaction.id && (
                <TransactionDetails transaction={selectedTransaction} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TransactionDetails({ transaction }) {
  return (
    <div className="transaction-detail-panel">
      <dl>
        <div>
          <dt>Transaction ID</dt>
          <dd>{transaction.id}</dd>
        </div>
        <div>
          <dt>From</dt>
          <dd>
            {transaction.fromAccountName} ({transaction.fromAccountId})
          </dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>
            {transaction.toAccountName} ({transaction.toAccountId})
          </dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDate(transaction.transactionDate)}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{transaction.type}</dd>
        </div>
        {transaction.spendingCategory && (
          <div>
            <dt>Category</dt>
            <dd>
              <CategoryChip category={transaction.spendingCategory} />
            </dd>
          </div>
        )}
        <div>
          <dt>Message</dt>
          <dd>{transaction.message}</dd>
        </div>
      </dl>
    </div>
  );
}

function CategoryChip({ category }) {
  return (
    <span className={`category-chip ${getCategoryClassName(category)}`}>
      <CategoryIcon category={category} />
      {category}
    </span>
  );
}

function CategoryIcon({ category }) {
  const iconProps = {
    "aria-hidden": "true",
    focusable: "false",
    viewBox: "0 0 24 24",
  };

  switch (category) {
    case "Food":
      return (
        <svg {...iconProps}>
          <path d="M7 3v8" />
          <path d="M4.5 3v5.5a2.5 2.5 0 0 0 5 0V3" />
          <path d="M7 11v10" />
          <path d="M16 3c2 1.3 3 3.1 3 5.4V21" />
          <path d="M16 3v18" />
        </svg>
      );
    case "Groceries":
      return (
        <svg {...iconProps}>
          <path d="M6 8h14l-1.5 9H8L6 8Z" />
          <path d="M6 8 5 4H3" />
          <path d="M9 21h.01" />
          <path d="M17 21h.01" />
        </svg>
      );
    case "House":
      return (
        <svg {...iconProps}>
          <path d="M4 11 12 4l8 7" />
          <path d="M6 10v10h12V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "Shopping":
      return (
        <svg {...iconProps}>
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
      );
    case "Bills":
      return (
        <svg {...iconProps}>
          <path d="M7 3h10v18l-2-1-2 1-2-1-2 1-2-1V3Z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="m3 13 9 5 9-5" />
        </svg>
      );
  }
}

function getCategoryClassName(category) {
  return `category-${String(category ?? "misc").toLowerCase()}`;
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
