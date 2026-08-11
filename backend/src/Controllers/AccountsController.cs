using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Data;
using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Controllers;

[ApiController]
[Route("api/users/{userId}/accounts")]
public sealed class AccountsController : ControllerBase
{
    private readonly IBankingRepository _bankingRepository;

    public AccountsController(IBankingRepository bankingRepository)
    {
        _bankingRepository = bankingRepository;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<Account>), StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<Account>> GetAccounts(string userId)
    {
        return Ok(_bankingRepository.GetAccountsByUserId(userId));
    }
}
