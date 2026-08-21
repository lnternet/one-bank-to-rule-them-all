namespace OneBankToRuleThemAllAPI.Models;

public sealed record CategorizedTransactionResponse(
    AccountTransaction Transaction,
    bool AiAssisted,
    string Message);
