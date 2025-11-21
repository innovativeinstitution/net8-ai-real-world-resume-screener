using Core.Application.Interfaces;
using Core.Domain.Jobs;
using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Controllers;

[ApiController]
[Route("jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobsService _service;

    public JobsController(IJobsService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<CreateJobResponse>> Create([FromBody] CreateJobRequest req)
    {
        var result = await _service.CreateJobAsync(req);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> List()
    {
        var rows = await _service.ListJobsAsync();
        return Ok(rows);
    }
}
