using TaskBoard.DAL.Data;

namespace TaskBoard.DAL.Repositories;

public abstract class Repository<TEntity> where TEntity : class
{
    protected TaskBoardDbContext DbContext { get; }

    protected Repository(TaskBoardDbContext dbContext)
    {
        DbContext = dbContext;
    }

    public void Add(TEntity entity)
    {
        DbContext.Set<TEntity>().Add(entity);
    }

    public void Remove(TEntity entity)
    {
        DbContext.Set<TEntity>().Remove(entity);
    }

    public Task<TEntity?> GetByIdAsync(int id)
    {
        return DbContext.Set<TEntity>().FindAsync(id).AsTask();
    }
}