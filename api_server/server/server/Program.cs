using Microsoft.AspNetCore.Identity;

using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Repositories;




var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddScoped(sp => new GlpiClient(
    baseUrl: builder.Configuration["Glpi:BaseUrl"],
    clientId: builder.Configuration["Glpi:ClientId"],
    clientSecret: builder.Configuration["Glpi:ClientSecret"],
    userName: builder.Configuration["Glpi:Username"],
    password: builder.Configuration["Glpi:Password"]
));


builder.Services.AddScoped<ComputerRepository>();

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

Console.ReadLine();