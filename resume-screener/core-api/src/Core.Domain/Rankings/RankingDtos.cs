namespace Core.Domain.Rankings;

public sealed record RankingRow(Guid CandidateId, double Score, string? Justification, string FullName, string? Email);
public sealed record RankingsResponse(Guid JobId, IReadOnlyList<RankingRow> Rankings);
