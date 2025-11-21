using Core.Domain.Jobs;

namespace Core.Application.Interfaces;

public interface IJobsService
{
    Task<CreateJobResponse> CreateJobAsync(CreateJobRequest req);
    Task<IEnumerable<object>> ListJobsAsync();
}
