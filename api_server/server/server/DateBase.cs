using Microsoft.EntityFrameworkCore;

namespace server
{
    public class Ticket
    {
        public int Id { get; set; }
        public string GlpiId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Ticket> Tickets { get; set; }
    }
}
