using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Services;

namespace server.Repositories
{
    public class TicketsRepository
    {
        private readonly AppDbContext _context;
        private readonly TicketSyncService _syncService;
        public TicketsRepository(AppDbContext context, TicketSyncService syncService)
        {
            _context = context;
            _syncService = syncService;
        }


        public async Task<List<MonthStatDto>> GetMonthlyStatsAsync()
        {
            var result = await _context.Tickets
                .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
                .Select(monthGroup => new MonthStatDto
                {
                       Month = $"{monthGroup.Key.Year}:{monthGroup.Key.Month:D2}",
                       Count = monthGroup.Count()
                            })
                .OrderBy(m => m.Month)
                .ToListAsync();

            return result;
        }
        public async Task<List<TypeMonthStatsDto>> GetStatsByTypeAndMonthAsync()
        {
            var tickets = await _context.Tickets.ToListAsync();

            var result = tickets
                .GroupBy(t => new { t.Type })
                .Select(
                    typeGroup => new TypeMonthStatsDto
                    {
                        Type = typeGroup.Key.ToString(),
                        Months = typeGroup
                            .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
                            .Select(monthGroup => new MonthStatDto
                            {
                                Month = $"{monthGroup.Key.Year}:{monthGroup.Key.Month:D2}",
                                Count = monthGroup.Count()
                            })
                            .OrderBy(m => m.Month)
                            .ToList()
                    })
                .OrderBy(s => s.Type)
                .ToList();

            return result;
        }
            
        public async Task<int> SyncAllAsync()
        {
            return await _syncService.SyncTicket();
        }
    }
}
