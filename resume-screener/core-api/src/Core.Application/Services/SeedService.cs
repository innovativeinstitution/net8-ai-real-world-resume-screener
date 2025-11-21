using Core.Application.Interfaces;
using Core.Infrastructure.Db;
using Dapper;

namespace Core.Application.Services
{
    public class SeedService : ISeedService
    {
        private readonly IDbConnectionFactory _db;

        public SeedService(IDbConnectionFactory db)
        {
            _db = db;
        }

        public async Task<(Guid JobId, Guid[] CandidateIds)> SeedAsync()
        {
            await using var conn = await _db.CreateOpenConnectionAsync();

            var jobId = Guid.NewGuid();
            const string jobSql = @"INSERT INTO jobs (job_id, title, description)
                                    VALUES (@job_id, @title, @description)";
            await conn.ExecuteAsync(jobSql, new
            {
                job_id = jobId,
                title = "Senior Backend Engineer",
                description = "C#, PostgreSQL, RabbitMQ, Vector search experience preferred."
            });

            const string candidateSql = @"INSERT INTO candidates (candidate_id, full_name, email, phone, resume_text, resume_url)
                                          VALUES (@candidate_id, @full_name, @email, @phone, @resume_text, @resume_url)";

            var c1 = Guid.NewGuid();
            var c2 = Guid.NewGuid();
            var c3 = Guid.NewGuid();

            var candidates = new[]
            {
                new {
                    candidate_id = c1,
                    full_name = "Alex Johnson",
                    email = "alex@example.com",
                    phone = "555-111-2222",
                    resume_text = "C# backend services, Dapper, PostgreSQL, queues (RabbitMQ).",
                    resume_url = (string?)null
                },
                new {
                    candidate_id = c2,
                    full_name = "Priya Sharma",
                    email = "priya@example.com",
                    phone = "555-333-4444",
                    resume_text = "Python, FastAPI, embeddings, OpenAI, pgvector, RAG pipelines.",
                    resume_url = (string?)null
                },
                new {
                    candidate_id = c3,
                    full_name = "Miguel Santos",
                    email = "miguel@example.com",
                    phone = "555-555-6666",
                    resume_text = "React, TypeScript, UX, plus .NET microservices experience.",
                    resume_url = (string?)null
                }
            };

            foreach (var c in candidates)
            {
                await conn.ExecuteAsync(candidateSql, c);
            }

            return (jobId, new[] { c1, c2, c3 });
        }
    }
}
