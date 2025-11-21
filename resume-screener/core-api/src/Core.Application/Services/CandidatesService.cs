using System.Text.Json;
using Core.Application.Interfaces;
using Core.Domain.Candidates;
using Core.Domain.Messages;
using Core.Infrastructure.Db;
using Core.Infrastructure.Messaging;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Core.Application.Services;

public class CandidatesService : ICandidatesService
{
    private readonly IDbConnectionFactory _db;
    private readonly IRabbitPublisher _publisher;
    private readonly ILogger<CandidatesService> _logger;

    public CandidatesService(IDbConnectionFactory db, IRabbitPublisher publisher, ILogger<CandidatesService> logger)
    {
        _db = db;
        _publisher = publisher;
        _logger = logger;
    }

    public async Task<CreateCandidateResponse> CreateCandidateAsync(CreateCandidateRequest req)
    {
        var candidateId = Guid.NewGuid();
        await using var conn = await _db.CreateOpenConnectionAsync();

        const string sql = @"INSERT INTO candidates (candidate_id, full_name, email, phone, resume_text, resume_url)
                             VALUES (@candidate_id, @full_name, @email, @phone, @resume_text, @resume_url)";
        await conn.ExecuteAsync(sql, new
        {
            candidate_id = candidateId,
            full_name = req.FullName,
            email = req.Email,
            phone = req.Phone,
            resume_text = req.ResumeText,
            resume_url = req.ResumeUrl
        });

        var msg = new ResumeParseMessage(candidateId, req.ResumeUrl, req.ResumeText, "text-embedding-3-small");
        _publisher.Publish("", "resume.parse", JsonSerializer.Serialize(msg));

        _logger.LogInformation("Candidate {CandidateId} created and parse message published.", candidateId);
        return new CreateCandidateResponse(candidateId);
    }

    public async Task<IEnumerable<object>> ListCandidatesAsync()
    {
        await using var conn = await _db.CreateOpenConnectionAsync();
        return await conn.QueryAsync("SELECT candidate_id, full_name, email, phone, created_at FROM candidates ORDER BY created_at DESC");
    }
}
