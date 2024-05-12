using ErrorOr;
using FluentValidation;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.List;
using TaskBoard.BLL.Services.Interfaces;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.BLL.Services;

public class ListService : IListService
{
    private readonly IListRepository _listRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateListModel> _createListModelValidator;
    private readonly IValidator<UpdateListModel> _updateListModelValidator;

    public ListService(
        IListRepository listRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateListModel> createListModelValidator,
        IValidator<UpdateListModel> updateListModelValidator)
    {
        _listRepository = listRepository;
        _unitOfWork = unitOfWork;
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
        _listRepository.Add(list);
        try
        {
            await _unitOfWork.SaveChangesAsync();
            return list.ToModel();
        }
        catch
        {
            return Error.Failure();
        }
    }

    public async Task<ErrorOr<Deleted>> DeleteListByIdAsync(int id)
    {
        var list = await _listRepository.GetByIdAsync(id);
        if (list is null)
        {
            return Error.NotFound();
        }

        _listRepository.Remove(list);
        try
        {
            await _unitOfWork.SaveChangesAsync();
            return Result.Deleted;
        }
        catch
        {
            return Error.Failure();
        }
    }

    public async Task<IEnumerable<ListModel>> GetAllListsByBoardIdAsync(int boardId)
    {
        var lists = await _listRepository.GetByBoardIdAsync(boardId);
        return lists.ConvertAll(l => l.ToModel());
    }

    public async Task<ErrorOr<ListModel>> GetListByIdAsync(int id)
    {
        var list = await _listRepository.GetByIdAsync(id);
        return list is null ? Error.NotFound() : list.ToModel();
    }

    public async Task<ErrorOr<Updated>> UpdateListAsync(UpdateListModel listModel)
    {
        var validationResult = await _updateListModelValidator.ValidateAsync(listModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<Updated>();
        }

        var list = await _listRepository.GetByIdAsync(listModel.Id);
        if (list is null)
        {
            return Error.NotFound();
        }

        list.Name = listModel.Name;
        try
        {
            await _unitOfWork.SaveChangesAsync();
            return Result.Updated;
        }
        catch
        {
            return Error.Failure();
        }
    }
}