using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Repositories;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ComputerRepository _tcontext;

        public TicketsController(ComputerRepository tcontext)
        {
            _tcontext = tcontext;
        }


        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _tcontext.GetAllAsync();
            return Ok(tickets);
        }


        [HttpGet("stats-by-month")]
        public async Task<IActionResult> GetMonthlyStats()
        {
            var tickets = await _tcontext.GetAllAsync();


            var stats = tickets
                .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month})
                .Select(g => new
                {
                    Month = $"{g.Key.Year}:{g.Key.Month:D2}",
                    Count = g.Count()
                })
                .OrderBy(s => s.Month)
                .ToList();

            return Ok(stats);
        }
    }
}
