namespace Core.Domain.Candidates;

public sealed record CreateCandidateRequest(
    string FullName,
    string? Email,
    string? Phone,
    string? ResumeText,
    string? ResumeUrl
);

public sealed record CreateCandidateResponse(Guid CandidateId);
