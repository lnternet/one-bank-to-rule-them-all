using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Controllers;
using OneBankToRuleThemAllAPI.Data;
using OneBankToRuleThemAllAPI.Models;
using Xunit;

namespace OneBankToRuleThemAllAPI.Tests;

public sealed class TransactionsControllerTests
{
    [Fact]
    public void GetAccountTransactions_ReturnsFakeTransactionsForAccount()
    {
        var controller = new TransactionsController(new InMemoryBankingRepository());

        var result = controller.GetAccountTransactions("acct-bag-end");

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var transactions = Assert.IsAssignableFrom<IReadOnlyList<AccountTransaction>>(okResult.Value);

        Assert.True(transactions.Count >= 5);
        Assert.All(transactions, transaction =>
            Assert.True(transaction.FromAccountId == "acct-bag-end" || transaction.ToAccountId == "acct-bag-end"));
    }

    [Fact]
    public void GetTransaction_ReturnsTransactionDetails()
    {
        var controller = new TransactionsController(new InMemoryBankingRepository());

        var result = controller.GetTransaction("txn-001");

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var transaction = Assert.IsType<AccountTransaction>(okResult.Value);

        Assert.Equal("txn-001", transaction.Id);
        Assert.Equal(TransactionType.Instant, transaction.Type);
        Assert.Equal("Bag End Checking", transaction.FromAccountName);
    }
}
