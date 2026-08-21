namespace OneBankToRuleThemAllAPI.Models;

public sealed record AccountTransaction(
    string Id,
    string FromAccountId,
    string ToAccountId,
    string FromAccountName,
    string ToAccountName,
    DateOnly TransactionDate,
    string Message,
    TransactionType Type,
    SpendingCategory SpendingCategory,
    decimal Amount,
    string Currency);
