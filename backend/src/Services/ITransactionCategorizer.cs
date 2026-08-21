using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Services;

public interface ITransactionCategorizer
{
    Task<SpendingCategory> CategorizeAsync(
        AccountTransaction transaction,
        CancellationToken cancellationToken);
}
