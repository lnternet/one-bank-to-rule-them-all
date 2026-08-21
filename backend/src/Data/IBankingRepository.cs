using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Data;

public interface IBankingRepository
{
    IReadOnlyList<User> GetUsers();

    IReadOnlyList<Account> GetAccountsByUserId(string userId);

    IReadOnlyList<AccountTransaction> GetTransactionsByAccountId(string accountId);

    AccountTransaction? GetTransactionById(string transactionId);

    AccountTransaction? UpdateTransactionSpendingCategory(
        string transactionId,
        SpendingCategory spendingCategory);
}
