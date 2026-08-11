using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Data;

public sealed class InMemoryBankingRepository : IBankingRepository
{
    private static readonly IReadOnlyList<User> Users =
    [
        new("user-frodo", "Frodo Baggins"),
        new("user-aragorn", "Aragorn Elessar"),
        new("user-galadriel", "Galadriel of Lothlorien"),
    ];

    private static readonly IReadOnlyList<Account> Accounts =
    [
        new("acct-bag-end", "user-frodo", "Bag End Checking", "**** 1111", 1842.42m, "USD"),
        new("acct-mithril", "user-frodo", "Mithril Savings", "**** 1112", 9910.00m, "USD"),
        new("acct-strider", "user-aragorn", "Strider Travel Fund", "**** 2221", 3275.75m, "USD"),
        new("acct-gondor", "user-aragorn", "Gondor Treasury", "**** 2222", 45000.00m, "USD"),
        new("acct-lorien", "user-galadriel", "Lorien Reserve", "**** 3331", 76000.00m, "USD"),
        new("acct-mirror", "user-galadriel", "Mirror Forecast Fund", "**** 3332", 12000.00m, "USD"),
    ];

    private static readonly IReadOnlyList<AccountTransaction> Transactions =
    [
        Tx("txn-001", "acct-bag-end", "acct-mithril", -25.50m, "Second breakfast supplies, absolutely essential", TransactionType.Instant, 1),
        Tx("txn-002", "acct-bag-end", "acct-strider", -120.00m, "Ranger escort fee, suspicious but useful", TransactionType.Normal, 2),
        Tx("txn-003", "acct-bag-end", "acct-gondor", -8.75m, "Prancing Pony room service and pipeweed tax", TransactionType.Normal, 3),
        Tx("txn-004", "acct-bag-end", "acct-lorien", 300.00m, "Elven gift reimbursement, no questions asked", TransactionType.Instant, 4),
        Tx("txn-005", "acct-bag-end", "acct-mirror", -14.20m, "Emergency lembas crumbs insurance", TransactionType.Future, 5),

        Tx("txn-006", "acct-mithril", "acct-bag-end", 250.00m, "Mithril vest cashback, dragon-resistant tier", TransactionType.Normal, 1),
        Tx("txn-007", "acct-mithril", "acct-gondor", -900.00m, "Council catering, twelve speeches too many", TransactionType.Instant, 2),
        Tx("txn-008", "acct-mithril", "acct-lorien", -45.00m, "Cloak cleaning, invisible stains included", TransactionType.Normal, 3),
        Tx("txn-009", "acct-mithril", "acct-strider", 110.00m, "Map folding consultancy", TransactionType.Future, 4),
        Tx("txn-010", "acct-mithril", "acct-mirror", -12.99m, "Subscription: Riddle Premium", TransactionType.Normal, 5),

        Tx("txn-011", "acct-strider", "acct-gondor", 1500.00m, "Return of the king signing bonus", TransactionType.Instant, 1),
        Tx("txn-012", "acct-strider", "acct-bag-end", -60.00m, "Hobbit-sized boot replacement", TransactionType.Normal, 2),
        Tx("txn-013", "acct-strider", "acct-lorien", -320.00m, "Sword polish and dramatic cloak repair", TransactionType.Normal, 3),
        Tx("txn-014", "acct-strider", "acct-mirror", 72.00m, "Prophecy cancellation refund", TransactionType.Future, 4),
        Tx("txn-015", "acct-strider", "acct-mithril", -18.40m, "Athelas bundle, smells better than expected", TransactionType.Instant, 5),

        Tx("txn-016", "acct-gondor", "acct-strider", -2200.00m, "White Tree landscaping retainer", TransactionType.Normal, 1),
        Tx("txn-017", "acct-gondor", "acct-lorien", -780.00m, "Beacon maintenance across seven hills", TransactionType.Future, 2),
        Tx("txn-018", "acct-gondor", "acct-bag-end", 95.00m, "Tiny ring courier mileage", TransactionType.Instant, 3),
        Tx("txn-019", "acct-gondor", "acct-mirror", -40.00m, "Palantir screen protector", TransactionType.Normal, 4),
        Tx("txn-020", "acct-gondor", "acct-mithril", 510.00m, "Treasury interest, steward approved", TransactionType.Normal, 5),

        Tx("txn-021", "acct-lorien", "acct-mirror", -640.00m, "Mirror water refill, premium moonlight", TransactionType.Instant, 1),
        Tx("txn-022", "acct-lorien", "acct-bag-end", -33.30m, "Welcome basket with suspiciously durable bread", TransactionType.Normal, 2),
        Tx("txn-023", "acct-lorien", "acct-gondor", 1200.00m, "Alliance dividend, very elegant paperwork", TransactionType.Future, 3),
        Tx("txn-024", "acct-lorien", "acct-strider", -210.00m, "Crown fitting deposit", TransactionType.Normal, 4),
        Tx("txn-025", "acct-lorien", "acct-mithril", -88.88m, "Starlight storage fee", TransactionType.Instant, 5),

        Tx("txn-026", "acct-mirror", "acct-lorien", 420.00m, "Future gains seen vaguely in a bowl", TransactionType.Future, 1),
        Tx("txn-027", "acct-mirror", "acct-gondor", -130.00m, "Prophecy audit, outcome unclear", TransactionType.Normal, 2),
        Tx("txn-028", "acct-mirror", "acct-bag-end", -9.99m, "One tiny vision, no refunds", TransactionType.Instant, 3),
        Tx("txn-029", "acct-mirror", "acct-strider", 64.00m, "Heroic destiny adjustment", TransactionType.Future, 4),
        Tx("txn-030", "acct-mirror", "acct-mithril", -22.10m, "Crystal bowl polishing", TransactionType.Normal, 5),
    ];

    public IReadOnlyList<User> GetUsers()
    {
        return Users;
    }

    public IReadOnlyList<Account> GetAccountsByUserId(string userId)
    {
        return Accounts
            .Where(account => string.Equals(account.UserId, userId, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public IReadOnlyList<AccountTransaction> GetTransactionsByAccountId(string accountId)
    {
        return Transactions
            .Where(transaction =>
                string.Equals(transaction.FromAccountId, accountId, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(transaction.ToAccountId, accountId, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(transaction => transaction.TransactionDate)
            .ToList();
    }

    public AccountTransaction? GetTransactionById(string transactionId)
    {
        return Transactions.FirstOrDefault(transaction =>
            string.Equals(transaction.Id, transactionId, StringComparison.OrdinalIgnoreCase));
    }

    private static AccountTransaction Tx(
        string id,
        string fromAccountId,
        string toAccountId,
        decimal amount,
        string message,
        TransactionType type,
        int day)
    {
        return new AccountTransaction(
            Id: id,
            FromAccountId: fromAccountId,
            ToAccountId: toAccountId,
            FromAccountName: GetAccountName(fromAccountId),
            ToAccountName: GetAccountName(toAccountId),
            TransactionDate: new DateOnly(2026, 8, day),
            Message: message,
            Type: type,
            Amount: amount,
            Currency: "USD");
    }

    private static string GetAccountName(string accountId)
    {
        return Accounts.First(account => account.Id == accountId).Name;
    }
}
