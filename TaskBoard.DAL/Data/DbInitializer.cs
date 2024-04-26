using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Entities;

namespace TaskBoard.DAL.Data;

public class DbInitializer
{
    private readonly List<List> _lists =
    [
        new()
        {
            Name = "Planned",
            Cards =
            [
                new() { Name = "Groceries", Description = "Go buy some groceries", DueDate = DateTime.UtcNow.AddDays(1), Priority = "Low" },
                new() { Name = "Laundry", Description = "Do the laundry", DueDate = DateTime.UtcNow.AddDays(2), Priority = "Medium" },
                new() { Name = "Math Assignment", Description = "Finish the math assignment", DueDate = DateTime.UtcNow.AddDays(3), Priority = "High" },
                new() { Name = "Workout", Description = "Go to the gym", DueDate = DateTime.UtcNow.AddDays(4), Priority = "Low" },
                new() { Name = "Update Passport Photo", Description = "Update passport photo", DueDate = DateTime.UtcNow.AddDays(5), Priority = "High" },
            ],
        },
        new()
        {
            Name = "Done",
            Cards =
            [
                new() { Name = "Buy a new laptop", Description = "Buy a new laptop", DueDate = DateTime.UtcNow.AddDays(1), Priority = "High" },
                new() { Name = "Go to the gym", Description = "Go to the gym", DueDate = DateTime.UtcNow.AddDays(-1), Priority = "Low" },
                new() { Name = "Catch up with friends", Description = "Catch up with friends", DueDate = DateTime.UtcNow.AddDays(-2), Priority = "Medium" },
                new() { Name = "Learn a new JS framework", Description = "Learn a new JS framework", DueDate = DateTime.UtcNow.AddDays(-3), Priority = "High" },
                new() { Name = "Update resume", Description = "Update resume", DueDate = DateTime.UtcNow.AddDays(-4), Priority = "Medium" },
            ],
        }
    ];

    private readonly TaskBoardDbContext _dbContext;

    public DbInitializer(TaskBoardDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task InitializeAsync()
    {
        await _dbContext.Database.MigrateAsync();
        if (await _dbContext.Cards.AnyAsync())
        {
            return;
        }

        _dbContext.Lists.AddRange(_lists);
        await _dbContext.SaveChangesAsync();
    }
}