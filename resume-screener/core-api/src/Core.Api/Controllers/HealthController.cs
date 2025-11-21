using Core.Infrastructure.Db;
using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    private readonly IDbConnectionFactory _db;
    public HealthController(IDbConnectionFactory db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            await using var conn = await _db.CreateOpenConnectionAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT 1";
            await cmd.ExecuteScalarAsync();
            return Ok(new { status = "ok", db = "ok" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", error = ex.Message });
        }
    }
}
