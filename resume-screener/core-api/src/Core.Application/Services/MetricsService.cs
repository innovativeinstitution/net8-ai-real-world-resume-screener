using Core.Application.Interfaces;
using Core.Domain.Metrics;
using Core.Infrastructure.Db;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Core.Application.Services;

public class MetricsService : IMetricsService
{
    private readonly IDbConnectionFactory _db;
    private readonly ILogger<MetricsService> _logger;

    public MetricsService(IDbConnectionFactory db, ILogger<MetricsService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<MetricsResponse> GetMetricsAsync()
    {
        await using var conn = await _db.CreateOpenConnectionAsync();

        const string sql = @"
            SELECT
              (SELECT COUNT(*) FROM candidates) AS Candidates,
              (SELECT COUNT(*) FROM jobs)       AS Jobs,
              (SELECT COUNT(*) FROM rankings)   AS Rankings;";

        var result = await conn.QuerySingleAsync<MetricsResponse>(sql);
        _logger.LogInformation("Metrics retrieved: {Metrics}", result);
        return result;
    }
}
