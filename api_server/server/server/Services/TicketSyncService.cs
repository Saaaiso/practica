namespace server.Services
{
    public class TicketsBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceFackt;

        public TicketsBackgroundService(IServiceScopeFactory serviceFackt)
        {
            _serviceFackt = serviceFackt;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceFackt.CreateScope())
                {
                    var syncServise = scope.ServiceProvider.GetRequiredService<TicketsBackgroundService>;

                }
            }

        }
    }
}
