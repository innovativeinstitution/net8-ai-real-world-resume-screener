namespace Core.Domain.Messages;

public record ResumeParseMessage(
    Guid CandidateId,
    string? ResumeUrl,
    string? ResumeText,
    string EmbeddingModel
);
