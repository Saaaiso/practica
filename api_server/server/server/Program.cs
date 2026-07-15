using Microsoft.AspNetCore.Identity;

using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Repositories;
using server.Services;
using System.Text.Json.Serialization;




var builder = WebApplication.CreateBuilder(args);
;

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddScoped(sp => new GlpiClient(
    baseUrl: builder.Configuration["Glpi:BaseUrl"],
    clientId: builder.Configuration["Glpi:ClientId"],
    clientSecret: builder.Configuration["Glpi:ClientSecret"],
    userName: builder.Configuration["Glpi:Username"],
    password: builder.Configuration["Glpi:Password"]
));

builder.Services.AddScoped<TicketSyncService>();
builder.Services.AddScoped<TicketsRepository>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();

Console.ReadLine();