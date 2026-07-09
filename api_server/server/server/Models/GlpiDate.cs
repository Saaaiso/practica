using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using System.Net.Sockets;
using System.Text.Json.Serialization;

namespace server.Models
{
    public enum GlpiTicketPriority
    {
        VeryLow = 1,
        Low = 2,
        Medium = 3,
        High = 4,
        VeryHigh = 5,
        Major = 6
    }

    public enum GlpiTicketType
    {
        ChangeRequest = 1, // запрос на изменение
        Incident = 2       // ошибка/инцидент
    }

    public class GlpiStatus
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = null!;
    }

    public class GlpiDate
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = null!;

        [JsonPropertyName("priority")]
        public GlpiTicketPriority Priority { get; set; }

        [JsonPropertyName("type")]
        public GlpiTicketType Type { get; set; }

        [JsonPropertyName("date")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("status")]
        public GlpiStatus Status { get; set; } = null!;
    }

}
