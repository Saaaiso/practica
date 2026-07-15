using server.Data;
using server.Models;

namespace server
{
    public interface ITicketRepository
    {

            Task<List<MonthStatDto>> GetMonthlyStatsAsync();
            Task<List<TypeMonthStatsDto>> GetStatsByTypeAndMonthAsync();
            Task<int> SyncAllAsync();
 
    }
}
