using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Repositories
{
    public class ComputerRepository
    {
        private readonly AppDbContext _context;
        public ComputerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Ticket>> GetAllAsync()
        {
            return await _context.Tickets
                .ToListAsync();
        }
    }
}
