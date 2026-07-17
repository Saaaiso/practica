using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Services;

namespace server.Repositories
{
    public class TicketsRepository: ITicketRepository
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
                .GroupBy(t => t.Type)
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


        public async Task<List<TypeDayStatsDto>> GetStatsTypeAndDays()
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-30);

            var rawStats = await _context.Tickets
                .Where(t => t.CreatedAt >= startDate)
                .GroupBy(t => new { t.Type, Date = t.CreatedAt.Date })
                .Select(g => new
                {
                    g.Key.Type,
                    g.Key.Date,
                    Count = g.Count()
                })
                .ToListAsync();

       
            return rawStats
                .GroupBy(x => x.Type)
                .Select(typeGroup => new TypeDayStatsDto
                {
                    Type = typeGroup.Key.ToString(),
                    Days = typeGroup
                        .Select(d => new DailyStatDto
                        {
                            Day = d.Date.ToString("yyyy-MM-dd"), 
                            Count = d.Count
                        })
                        .OrderBy(d => d.Day)
                        .ToList()
                })
                .OrderBy(s => s.Type)
                .ToList();
        }


        public async Task<List<StatusDto>> GetTypePriorityAsync() { 

            var tickets = await _context.Tickets.ToListAsync();

            return tickets
                .GroupBy(t => t.Type)
                .Select(g => new StatusDto
                {
                    Type = g.Key.ToString(),
                    Status = g
                    .GroupBy(t => t.Priority)
                    .Select(d => new PrioritiesDto
                    {
                        Priorities = d.Key.ToString(),
                        Count = d.Count(),
                    })
                    .OrderBy(d => d.Priorities)
                    .ToList()
                })
                .OrderBy(s => s.Type)
                .ToList();
        
        }
    }
}
