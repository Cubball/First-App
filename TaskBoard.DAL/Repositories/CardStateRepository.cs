using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Data;
using TaskBoard.DAL.Entities;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.DAL.Repositories;

public class CardStateRepository : ICardStateRepository
{
    private readonly TaskBoardDbContext _dbContext;

    public CardStateRepository(TaskBoardDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(CardState cardState)
    {
        _dbContext.CardStates.Add(cardState);
    }

    public Task<int> GetCountByBoardIdAsync(int boardId)
    {
        return _dbContext.CardStates
            .Where(c => c.BoardId == boardId)
            .CountAsync();
    }

    public Task<CardState?> GetLatestByCardIdAsync(int cardId)
    {
        return _dbContext.CardStates
            .Where(c => c.CardId == cardId)
            .OrderByDescending(c => c.UpdatedAt)
            .FirstOrDefaultAsync();
    }

    public Task<List<CardState>> GetOrderedWithPreviousStateByBoardIdAsync(int boardId, int skip, int take)
    {
        return _dbContext.CardStates
            .Where(c => c.BoardId == boardId)
            .OrderByDescending(c => c.UpdatedAt)
            .Skip(skip)
            .Take(take)
            .Include(c => c.PreviousState)
            .ToListAsync();
    }

    public async Task<List<CardState>> GetOrderedWithPreviousStateByCardIdAsync(int cardId)
    {
        var states = await _dbContext.CardStates
            .Where(c => c.CardId == cardId)
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync();
        for (var i = 0; i < states.Count - 1; i++)
        {
            states[i].PreviousState = states[i + 1];
        }

        return states;
    }
}