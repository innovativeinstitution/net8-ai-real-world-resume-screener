namespace Core.Domain.Messages;

public record RankRefreshMessage(
    Guid JobId,
    string EmbeddingModel,
    string GptModel,
    int TopK
);
