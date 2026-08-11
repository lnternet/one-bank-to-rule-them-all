using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Data;
using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Controllers;

[ApiController]
[Route("api/users")]
public sealed class UsersController : ControllerBase
{
    private readonly IBankingRepository _bankingRepository;

    public UsersController(IBankingRepository bankingRepository)
    {
        _bankingRepository = bankingRepository;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<User>), StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<User>> GetUsers()
    {
        return Ok(_bankingRepository.GetUsers());
    }
}
