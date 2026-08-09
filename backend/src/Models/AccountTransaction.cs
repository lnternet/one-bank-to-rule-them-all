namespace OneBankToRuleThemAllAPI.Models;

public sealed record AccountTransaction(
    string Id,
    string AccountId,
    DateOnly TransactionDate,
    string Description,
    decimal Amount,
    string Currency);
