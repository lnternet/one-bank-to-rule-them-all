namespace OneBankToRuleThemAllAPI.Models;

public sealed record CategorizedTransactionsResponse(
    IReadOnlyList<AccountTransaction> Transactions,
    bool AiAssisted,
    string Message);
