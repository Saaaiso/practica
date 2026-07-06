using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using System.Net.Sockets;

namespace server
{
    public enum GlpiTicketPriority
    {
        Moderate = 3,   // умеренный
        High = 4,       // высокий
        Critical = 5
            // критический
    }

    public enum GlpiTicketType
    {
        ChangeRequest = 1, // запрос на изменение
        Incident = 2       // ошибка/инцидент
    }
    public class GlpiDate
    {
        public int Id { get; set; }
        public int GlpiId { get; set; }         
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public GlpiTicketPriority Priority { get; set; }
        public GlpiTicketType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
