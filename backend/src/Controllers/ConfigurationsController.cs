using Microsoft.AspNetCore.Mvc;
using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Controllers;

[ApiController]
[Route("api/configurations")]
public sealed class ConfigurationsController : ControllerBase
{

    public ConfigurationsController()
    { }

    [HttpGet]
    [ProducesResponseType(typeof(Configurations), StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<Account>> GetAccounts()
    {
        return Ok( new Configurations());
    }
}
