namespace server.Models
{
    public class TypeMonthStatsDto
    {
        public string Type { get; set; }
        public List<MonthStatDto> Months { get; set; }
    }

    public class MonthStatDto
    {
        public string Month { get; set; }
        public int Count { get; set; }
    }


    public class DailyStatDto
    {
        public string Day { get; set; } = null!;
        public int Count { get; set; }
    }

    public class TypeDayStatsDto
    {
        public string Type { get; set; }
        public List<DailyStatDto> Days { get; set; } = new();
    }

    public class StatusDto { 
        public string Type { get; set; }
        public List<PrioritiesDto> Status { get; set; }
    }

    public class PrioritiesDto
    {

        public string Priorities { get; set; }
        public int Count { get; set; }
    }
}
