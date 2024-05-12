using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Data;
using TaskBoard.DAL.Entities;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.DAL.Repositories;

public class CardRepository : Repository<Card>, ICardRepository
{
    public CardRepository(TaskBoardDbContext dbContext)
        : base(dbContext)
    {
    }

    public Task<Card?> GetWithListByIdAsync(int id)
    {
        return DbContext.Cards
            .Include(c => c.List)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
}