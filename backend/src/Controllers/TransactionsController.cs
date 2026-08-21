using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Data;
using OneBankToRuleThemAllAPI.Models;
using OneBankToRuleThemAllAPI.Services;

namespace OneBankToRuleThemAllAPI.Controllers;

[ApiController]
[Route("api")]
public sealed class TransactionsController : ControllerBase
{
    private readonly IBankingRepository _bankingRepository;
    private readonly ITransactionCategorizer _transactionCategorizer;

    public TransactionsController(
        IBankingRepository bankingRepository,
        ITransactionCategorizer transactionCategorizer)
    {
        _bankingRepository = bankingRepository;
        _transactionCategorizer = transactionCategorizer;
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

    [HttpPatch("transactions/{transactionId}/spending-category")]
    [ProducesResponseType(typeof(CategorizedTransactionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<CategorizedTransactionResponse>> CategorizeTransaction(
        string transactionId,
        CancellationToken cancellationToken)
    {
        var transaction = _bankingRepository.GetTransactionById(transactionId);
        if (transaction is null)
        {
            return NotFound();
        }

        try
        {
            var spendingCategory = await _transactionCategorizer.CategorizeAsync(
                transaction,
                cancellationToken);
            var updatedTransaction = _bankingRepository.UpdateTransactionSpendingCategory(
                transactionId,
                spendingCategory);

            if (updatedTransaction is null)
            {
                return NotFound();
            }

            return Ok(new CategorizedTransactionResponse(
                updatedTransaction,
                AiAssisted: true,
                Message: $"AI preselected {spendingCategory} based on the transaction details."));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                "AI categorization is unavailable right now.");
        }
    }

    [HttpPatch("accounts/{accountId}/transactions/spending-categories")]
    [ProducesResponseType(typeof(CategorizedTransactionsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<CategorizedTransactionsResponse>> CategorizeAccountTransactions(
        string accountId,
        CancellationToken cancellationToken)
    {
        var transactions = _bankingRepository.GetTransactionsByAccountId(accountId);
        if (transactions.Count == 0)
        {
            return NotFound();
        }

        try
        {
            var updatedTransactions = new List<AccountTransaction>();

            foreach (var transaction in transactions)
            {
                var spendingCategory = await _transactionCategorizer.CategorizeAsync(
                    transaction,
                    cancellationToken);
                var updatedTransaction = _bankingRepository.UpdateTransactionSpendingCategory(
                    transaction.Id,
                    spendingCategory);

                if (updatedTransaction is not null)
                {
                    updatedTransactions.Add(updatedTransaction);
                }
            }

            return Ok(new CategorizedTransactionsResponse(
                updatedTransactions
                    .OrderByDescending(transaction => transaction.TransactionDate)
                    .ToList(),
                AiAssisted: true,
                Message: "AI reviewed these transaction details and updated their spending categories."));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                "AI categorization is unavailable right now.");
        }
    }
}
