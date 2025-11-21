using Core.Application.Interfaces;
using Core.Domain.Metrics;
using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Controllers;

[ApiController]
[Route("metrics")]
public class MetricsController : ControllerBase
{
    private readonly IMetricsService _service;

    public MetricsController(IMetricsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<MetricsResponse>> Get()
    {
        var result = await _service.GetMetricsAsync();
        return Ok(result);
    }
}
