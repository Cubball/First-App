using ErrorOr;
using Microsoft.EntityFrameworkCore;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models;
using TaskBoard.DAL.Data;

namespace TaskBoard.BLL.Services;

public class ListService : IListService
{
    private readonly TaskBoardDbContext _dbContext;

    public ListService(TaskBoardDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<ListModel>> CreateListAsync(CreateListModel listModel)
    {
        // TODO: validate
        var list = listModel.ToEntity();
        _dbContext.Add(list);
        try
        {
            await _dbContext.SaveChangesAsync();
            return list.ToModel();
        }
        catch
        {
            return Error.Failure();
        }
    }

    public async Task<ErrorOr<Deleted>> DeleteListByIdAsync(int id)
    {
        var list = await _dbContext.Lists.FindAsync(id);
        if (list is null)
        {
            return Error.NotFound();
        }

        _dbContext.Remove(list);
        try
        {
            await _dbContext.SaveChangesAsync();
            return Result.Deleted;
        }
        catch
        {
            return Error.Failure();
        }
    }

    public async Task<IEnumerable<ListModel>> GetAllListsAsync()
    {
        var lists = await _dbContext.Lists.ToListAsync();
        return lists.Select(l => l.ToModel()).ToList();
    }

    public async Task<ErrorOr<Updated>> UpdateListAsync(UpdateListModel listModel)
    {
        // TODO: validate
        var list = await _dbContext.Lists.FindAsync(listModel.Id);
        if (list is null)
        {
            return Error.NotFound();
        }

        list.Name = listModel.Name;
        try
        {
            await _dbContext.SaveChangesAsync();
            return Result.Updated;
        }
        catch
        {
            return Error.Failure();
        }
    }
}