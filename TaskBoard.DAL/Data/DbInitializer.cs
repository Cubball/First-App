using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Entities;

namespace TaskBoard.DAL.Data;

public class DbInitializer
{
    private readonly Board _board = new()
    {
        Name = "My TODOs",
        Lists = new List<List>
        {
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
        },
    };

    private readonly TaskBoardDbContext _dbContext;

    public DbInitializer(TaskBoardDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task InitializeAsync()
    {
        await _dbContext.Database.MigrateAsync();
        if (await _dbContext.CardStates.AnyAsync())
        {
            return;
        }

        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        _dbContext.Boards.Add(_board);
        await _dbContext.SaveChangesAsync();
        var states = _board.Lists
            .SelectMany(l => l.Cards)
            .Select(c => new CardState
            {
                CardId = c.Id,
                Name = c.Name,
                Description = c.Description,
                DueDate = c.DueDate,
                Priority = c.Priority,
                ListId = c.ListId,
                ListName = _board.Lists.First(l => l.Id == c.ListId).Name,
                Deleted = false,
                UpdatedAt = DateTime.UtcNow,
                PreviousState = null,
                PreviousStateId = null,
            })
            .ToList();
        _dbContext.CardStates.AddRange(states);
        await _dbContext.SaveChangesAsync();
        await transaction.CommitAsync();
    }
}