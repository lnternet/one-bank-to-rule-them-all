using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Controllers;
using OneBankToRuleThemAllAPI.Models;
using Xunit;

namespace OneBankToRuleThemAllAPI.Tests;

public sealed class TransactionsControllerTests
{
    [Fact]
    public void GetAccountTransactions_ReturnsFakeTransactionsForAccount()
    {
        var controller = new TransactionsController();

        var result = controller.GetAccountTransactions("acct-123");

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var transactions = Assert.IsAssignableFrom<IReadOnlyList<AccountTransaction>>(okResult.Value);

        Assert.Equal(3, transactions.Count);
        Assert.All(transactions, transaction => Assert.Equal("acct-123", transaction.AccountId));
    }
}
