using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Controllers;

[ApiController]
[Route("api/accounts/{accountId}/transactions")]
public sealed class TransactionsController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<AccountTransaction>), StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<AccountTransaction>> GetAccountTransactions(string accountId)
    {
        var transactions = new List<AccountTransaction>
        {
            new(
                Id: "txn-001",
                AccountId: accountId,
                TransactionDate: new DateOnly(2026, 8, 1),
                Description: "Coffee shop",
                Amount: -4.75m,
                Currency: "USD"),
            new(
                Id: "txn-002",
                AccountId: accountId,
                TransactionDate: new DateOnly(2026, 8, 2),
                Description: "Salary",
                Amount: 2500.00m,
                Currency: "USD"),
            new(
                Id: "txn-003",
                AccountId: accountId,
                TransactionDate: new DateOnly(2026, 8, 3),
                Description: "Grocery store",
                Amount: -86.21m,
                Currency: "USD"),
        };

        return Ok(transactions);
    }
}
