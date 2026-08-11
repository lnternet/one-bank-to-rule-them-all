namespace OneBankToRuleThemAllAPI.Models;

public sealed record Account(
    string Id,
    string UserId,
    string Name,
    string Number,
    decimal Balance,
    string Currency);
