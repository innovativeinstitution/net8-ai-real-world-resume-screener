using System.Threading.Tasks;

namespace Core.Application.Interfaces
{
    public interface ISeedService
    {
        Task<(Guid JobId, Guid[] CandidateIds)> SeedAsync();
    }
}
