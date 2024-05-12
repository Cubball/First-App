using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Data;
using TaskBoard.DAL.Entities;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.DAL.Repositories;

public class ListRepository : Repository<List>, IListRepository
{
    public ListRepository(TaskBoardDbContext dbContext)
        : base(dbContext)
    {
    }

    public Task<List<List>> GetByBoardIdAsync(int boardId)
    {
        return DbContext.Lists
            .Where(l => l.BoardId == boardId)
            .ToListAsync();
    }
}