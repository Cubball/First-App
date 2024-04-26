using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TaskBoardDbContext>(o => o.UseNpgsql(connectionString));

var app = builder.Build();

app.Run();