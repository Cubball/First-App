using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Data;
using TaskBoard.DAL.Entities;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.DAL.Repositories;

public class BoardRepository : Repository<Board>, IBoardRepository
{
    public BoardRepository(TaskBoardDbContext dbContext)
        : base(dbContext)
    {
    }

    public Task<List<Board>> GetAllAsync()
    {
        return DbContext.Boards.ToListAsync();
    }

    public Task<Board?> GetWithListsAndCardsByIdAsync(int id)
    {
        return DbContext.Boards
            .Include(b => b.Lists)
                .ThenInclude(l => l.Cards)
            .FirstOrDefaultAsync(b => b.Id == id);
    }
}