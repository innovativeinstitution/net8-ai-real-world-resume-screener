using Core.Domain.Rankings;

namespace Core.Application.Interfaces;

public interface IRankingsService
{
    Task<RankingsResponse> GetRankingsAsync(Guid jobId);
    Task QueueRankRefreshAsync(Guid jobId);
}
