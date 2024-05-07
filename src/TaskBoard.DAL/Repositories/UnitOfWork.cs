using TaskBoard.DAL.Data;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.DAL.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly TaskBoardDbContext _dbContext;

    public UnitOfWork(TaskBoardDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task BeginTransactionAsync()
    {
        return _dbContext.Database.BeginTransactionAsync();
    }

    public Task CommitTransactionAsync()
    {
        return _dbContext.Database.CommitTransactionAsync();
    }

    public Task RollbackTransactionAsync()
    {
        return _dbContext.Database.RollbackTransactionAsync();
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}