using Microsoft.AspNetCore.Identity;
using server;

using Microsoft.EntityFrameworkCore;

var glpi = new GlpiClient(
    baseUrl: "http://localhost",
    clientId: "0c6f5281bdc21ceb7e9023bb1762e0a68fc3ebd15ebcbe2f910c6187aeda9833",
    clientSecret: "67034eee34dac705c9c3fddceb142bdc34bb6d9b3aec00aab0ec0d2824df5850",
    userName: "samatbek _admin",
    password: "Samsa2007"
    );

try
{
    var tickets = await glpi.GetTicketsAsync();

    foreach ( var ticket in tickets )
    {
        Console.WriteLine( $"{ticket.Id}, {ticket.Type}, {ticket.Priority}" );
    }

}
catch (Exception ex) { 
    Console.WriteLine(ex.ToString());
}

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

Console.ReadLine();