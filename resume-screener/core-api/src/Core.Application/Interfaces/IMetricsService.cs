using Core.Domain.Metrics;

namespace Core.Application.Interfaces;

public interface IMetricsService
{
    Task<MetricsResponse> GetMetricsAsync();
}
