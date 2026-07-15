using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services
{
    public class TicketSyncService
    {
        private readonly GlpiClient _glpiClient;
        private readonly AppDbContext _context;

        public TicketSyncService(GlpiClient glpiClient, AppDbContext context)
        {
            _glpiClient = glpiClient;
            _context = context;
        }

        public async Task<int> SyncTicket()
        {
            var glpiTickets = await _glpiClient.GetTicketsAsync();

            int changedCount = 0;

            var existingTickets = await _context.Tickets
                    .ToDictionaryAsync(t => t.GlpiId);

            foreach (var glpiTicket in glpiTickets)
            {

                if (existingTickets.TryGetValue(glpiTicket.Id, out var existing))
                {
                    // update logic
                    existing.Title = glpiTicket.Title;
                    existing.Priority = glpiTicket.Priority;
                    existing.Type = glpiTicket.Type;
                    existing.UpdatedAt = DateTime.UtcNow;
                    changedCount++;
                }
                else
                {
                    // add logic
                    _context.Tickets.Add(new Ticket
                    {
                        GlpiId = glpiTicket.Id,
                        Title = glpiTicket.Title,
                        Priority = glpiTicket.Priority,
                        Type = glpiTicket.Type,
                        CreatedAt = glpiTicket.CreatedAt
                    });
                    changedCount++;
                }
            }
            await _context.SaveChangesAsync();
            return changedCount;
        }
    }
}
