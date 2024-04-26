using Microsoft.EntityFrameworkCore;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.CardState;
using TaskBoard.DAL.Data;

namespace TaskBoard.BLL.Services;

public class HistoryService : IHistoryService
{
    private const int DefaultPageSize = 20;
    private const int DefaultPageNumber = 1;

    private readonly TaskBoardDbContext _dbContext;

    public HistoryService(TaskBoardDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CardsChangesListModel> GetCardChangesAsync(int page, int pageSize)
    {
        // NOTE: maybe better to return an error if these values are invalid?
        if (pageSize <= 0)
        {
            pageSize = DefaultPageSize;
        }

        if (page <= 0)
        {
            page = DefaultPageNumber;
        }

        var skip = (page - 1) * pageSize;
        var states = await _dbContext.CardStates
            .Include(s => s.PreviousState)
            .OrderByDescending(s => s.UpdatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
        var cardChanges = states.Select(s => s.ToChangeModel()).ToList();
        var totalItems = await _dbContext.CardStates.CountAsync();
        return new()
        {
            PageSize = pageSize,
            PageNumber = page,
            TotalItems = totalItems,
            Items = cardChanges,
        };
    }
}