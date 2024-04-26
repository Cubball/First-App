using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskBoard.API.Endpoints;
using TaskBoard.BLL.Infrastructure;
using TaskBoard.BLL.Services;
using TaskBoard.DAL.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TaskBoardDbContext>(o => o.UseNpgsql(connectionString));
builder.Services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
builder.Services.AddValidatorsFromAssemblyContaining<IAssemblyMarker>();
builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<IListService, ListService>();
builder.Services.AddScoped<DbInitializer>();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var dbInitializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
await dbInitializer.InitializeAsync();

app.MapCardEndpoints();

app.MapListEndpoints();

app.Run();