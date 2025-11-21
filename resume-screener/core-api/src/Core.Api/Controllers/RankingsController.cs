using Core.Application.Interfaces;
using Core.Domain.Rankings;
using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Controllers;

[ApiController]
[Route("rankings")]
public class RankingsController : ControllerBase
{
    private readonly IRankingsService _service;

    public RankingsController(IRankingsService service)
    {
        _service = service;
    }

    [HttpGet("{jobId:guid}")]
    public async Task<ActionResult<RankingsResponse>> Get(Guid jobId)
    {
        var result = await _service.GetRankingsAsync(jobId);
        return Ok(result);
    }

    [HttpPost("{jobId:guid}/refresh")]
    public async Task<ActionResult> Refresh(Guid jobId)
    {
        await _service.QueueRankRefreshAsync(jobId);
        return Accepted(new { status = "queued" });
    }
}
