using Core.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Controllers
{
    [ApiController]
    [Route("seed")]
    public class SeedController : ControllerBase
    {
        private readonly ISeedService _seedService;

        public SeedController(ISeedService seedService)
        {
            _seedService = seedService;
        }

        public record SeedResult(Guid JobId, Guid[] CandidateIds);

        [HttpPost]
        public async Task<ActionResult<SeedResult>> Post()
        {
            var (jobId, candidateIds) = await _seedService.SeedAsync();
            return Ok(new SeedResult(jobId, candidateIds));
        }
    }
}
