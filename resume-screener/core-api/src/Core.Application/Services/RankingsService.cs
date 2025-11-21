using System.Text.Json;
using Core.Application.Interfaces;
using Core.Domain.Messages;
using Core.Domain.Rankings;
using Core.Infrastructure.Db;
using Core.Infrastructure.Messaging;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Core.Application.Services;

public class RankingsService : IRankingsService
{
    private readonly IDbConnectionFactory _db;
    private readonly IRabbitPublisher _publisher;
    private readonly ILogger<RankingsService> _logger;

    public RankingsService(IDbConnectionFactory db, IRabbitPublisher publisher, ILogger<RankingsService> logger)
    {
        _db = db;
        _publisher = publisher;
        _logger = logger;
    }

    public async Task<RankingsResponse> GetRankingsAsync(Guid jobId)
    {
        await using var conn = await _db.CreateOpenConnectionAsync();

        const string sql = @"
            SELECT r.candidate_id AS CandidateId,
                   r.score AS Score,
                   r.justification AS Justification,
                   c.full_name AS FullName,
                   c.email AS Email
            FROM rankings r
            JOIN candidates c ON c.candidate_id = r.candidate_id
            WHERE r.job_id = @job_id
            ORDER BY r.score DESC";

        var rows = await conn.QueryAsync<RankingRow>(sql, new { job_id = jobId });
        return new RankingsResponse(jobId, rows.ToList());
    }

    public Task QueueRankRefreshAsync(Guid jobId)
    {
        var msg = new RankRefreshMessage(jobId, "text-embedding-3-small", "gpt-4o-mini", 25);
        _publisher.Publish("", "rank.refresh", JsonSerializer.Serialize(msg));

        _logger.LogInformation("Rank refresh queued for Job {JobId}", jobId);
        return Task.CompletedTask;
    }
}
