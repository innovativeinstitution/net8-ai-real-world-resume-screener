namespace Core.Domain.Jobs;

public sealed record CreateJobRequest(string Title, string Description);
public sealed record CreateJobResponse(Guid JobId, string Title, string Description);
