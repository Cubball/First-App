using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskBoard.API.Endpoints;
using TaskBoard.API.Middleware;
using TaskBoard.BLL.Infrastructure;
using TaskBoard.BLL.Services;
using TaskBoard.BLL.Services.Interfaces;
using TaskBoard.DAL.Data;
using TaskBoard.DAL.Repositories;
using TaskBoard.DAL.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TaskBoardDbContext>(o => o.UseNpgsql(connectionString));
builder.Services.AddScoped<DbInitializer>();
builder.Services.AddScoped<ICardRepository, CardRepository>();
builder.Services.AddScoped<IListRepository, ListRepository>();
builder.Services.AddScoped<ICardStateRepository, CardStateRepository>();
builder.Services.AddScoped<IBoardRepository, BoardRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
builder.Services.AddValidatorsFromAssemblyContaining<IAssemblyMarker>();
builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<IListService, ListService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddScoped<IBoardService, BoardService>();

builder.Services.AddTransient<GlobalErrorHandlingMiddleware>();
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(
    o => o.AddDefaultPolicy(
        pb => pb.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()));

var app = builder.Build();

try
{
    using var scope = app.Services.CreateScope();
    var dbInitializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    await dbInitializer.InitializeAsync();
}
catch (Exception e)
{
    app.Logger.LogError(e, "Failed to initialize the database: {ExceptionMessage}", e.Message);
    return;
}

app.UseMiddleware<GlobalErrorHandlingMiddleware>();

app.UseCors();

app.MapCardEndpoints();
app.MapListEndpoints();
app.MapBoardEndpoints();

app.Run();

public partial class Program { }