using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class Ticket
    {
        public int Id { get; set; }
        public int GlpiId { get; set; }
        public string Title { get; set; } = null!;
        public GlpiTicketPriority Priority { get; set; }
        public GlpiTicketType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Ticket> Tickets { get; set; }
    }
}
