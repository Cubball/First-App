using ErrorOr;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.List;
using TaskBoard.DAL.Data;

namespace TaskBoard.BLL.Services;

public class ListService : IListService
{
    private readonly TaskBoardDbContext _dbContext;
    private readonly IValidator<CreateListModel> _createListModelValidator;
    private readonly IValidator<UpdateListModel> _updateListModelValidator;

    public ListService(
        TaskBoardDbContext dbContext,
        IValidator<CreateListModel> createListModelValidator,
        IValidator<UpdateListModel> updateListModelValidator)
    {
        _dbContext = dbContext;
        _createListModelValidator = createListModelValidator;
        _updateListModelValidator = updateListModelValidator;
    }

    public async Task<ErrorOr<ListModel>> CreateListAsync(CreateListModel listModel)
    {
        var validationResult = await _createListModelValidator.ValidateAsync(listModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<ListModel>();
        }

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
        var validationResult = await _updateListModelValidator.ValidateAsync(listModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<Updated>();
        }

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