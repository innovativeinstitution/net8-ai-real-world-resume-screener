using Core.Application.Interfaces;
using Core.Domain.Candidates;
using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Controllers;

[ApiController]
[Route("candidates")]
public class CandidatesController : ControllerBase
{
    private readonly ICandidatesService _service;

    public CandidatesController(ICandidatesService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<CreateCandidateResponse>> Create([FromBody] CreateCandidateRequest req)
    {
        var result = await _service.CreateCandidateAsync(req);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> List()
    {
        var rows = await _service.ListCandidatesAsync();
        return Ok(rows);
    }
}
