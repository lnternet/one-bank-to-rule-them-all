using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Data;
using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Controllers;

[ApiController]
[Route("api")]
public sealed class TransactionsController : ControllerBase
{
    private readonly IBankingRepository _bankingRepository;

    public TransactionsController(IBankingRepository bankingRepository)
    {
        _bankingRepository = bankingRepository;
    }

    [HttpGet("accounts/{accountId}/transactions")]
    [ProducesResponseType(typeof(IReadOnlyList<AccountTransaction>), StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<AccountTransaction>> GetAccountTransactions(string accountId)
    {
        return Ok(_bankingRepository.GetTransactionsByAccountId(accountId));
    }

    [HttpGet("transactions/{transactionId}")]
    [ProducesResponseType(typeof(AccountTransaction), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<AccountTransaction> GetTransaction(string transactionId)
    {
        var transaction = _bankingRepository.GetTransactionById(transactionId);

        return transaction is null ? NotFound() : Ok(transaction);
    }
}
