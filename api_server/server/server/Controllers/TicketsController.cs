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
        private readonly TicketsRepository _tcontext;

        public TicketsController(TicketsRepository tcontext)
        {
            _tcontext = tcontext;
        }



        [HttpGet("stats-by-month")]
        public async Task<IActionResult> GetMonthlyStats()
        {
            var tickets = await _tcontext.GetMonthlyStatsAsync();
            return Ok(tickets);
        }


        [HttpGet("stats-by-type-and-month")]
        public async Task<IActionResult> GetStatsByTypeAndMonth()
        {
            var stats = await _tcontext.GetStatsByTypeAndMonthAsync();
            return Ok(stats);
        }


        [HttpPost("glpi_synk_tickets")]
        public async Task<IActionResult> SynkTickets()
        {
            try
            {
                var count = await _tcontext.SyncAllAsync();
                return Ok(new { message = $"Синхронизировано {count} тикетов" });
            }
            catch (Exception ex)
            {
                // залогировать ex
                return StatusCode(502, new { message = "Не удалось синхронизировать с GLPI" });
            }
        }
    }
 }