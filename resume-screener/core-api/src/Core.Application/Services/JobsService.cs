using Core.Application.Interfaces;
using Core.Domain.Jobs;
using Core.Infrastructure.Db;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Core.Application.Services;

public class JobsService : IJobsService
{
    private readonly IDbConnectionFactory _db;
    private readonly ILogger<JobsService> _logger;

    public JobsService(IDbConnectionFactory db, ILogger<JobsService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<CreateJobResponse> CreateJobAsync(CreateJobRequest req)
    {
        var jobId = Guid.NewGuid();
        await using var conn = await _db.CreateOpenConnectionAsync();

        const string sql = "INSERT INTO jobs (job_id, title, description) VALUES (@job_id, @title, @description)";
        await conn.ExecuteAsync(sql, new { job_id = jobId, title = req.Title, description = req.Description });

        _logger.LogInformation("Job {JobId} created.", jobId);
        return new CreateJobResponse(jobId, req.Title, req.Description);
    }

    public async Task<IEnumerable<object>> ListJobsAsync()
    {
        await using var conn = await _db.CreateOpenConnectionAsync();
        return await conn.QueryAsync("SELECT job_id, title, description, created_at FROM jobs ORDER BY created_at DESC");
    }
}
