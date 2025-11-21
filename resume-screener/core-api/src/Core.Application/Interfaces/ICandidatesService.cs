using Core.Domain.Candidates;

namespace Core.Application.Interfaces;

public interface ICandidatesService
{
    Task<CreateCandidateResponse> CreateCandidateAsync(CreateCandidateRequest req);
    Task<IEnumerable<object>> ListCandidatesAsync();
}