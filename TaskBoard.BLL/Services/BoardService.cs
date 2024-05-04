using ErrorOr;
using FluentValidation;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.Board;
using TaskBoard.BLL.Services.Interfaces;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.BLL.Services;

public class BoardService : IBoardService
{
    private readonly IBoardRepository _boardRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateBoardModel> _createBoardModelValidator;
    private readonly IValidator<UpdateBoardModel> _updateBoardModelValidator;

    public BoardService(
        IBoardRepository boardRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateBoardModel> createBoardModelValidator,
        IValidator<UpdateBoardModel> updateBoardModelValidator)
    {
        _boardRepository = boardRepository;
        _unitOfWork = unitOfWork;
        _createBoardModelValidator = createBoardModelValidator;
        _updateBoardModelValidator = updateBoardModelValidator;
    }

    public async Task<ErrorOr<BoardModel>> CreateBoardAsync(CreateBoardModel boardModel)
    {
        var validationResult = await _createBoardModelValidator.ValidateAsync(boardModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<BoardModel>();
        }

        var board = boardModel.ToEntity();
        _boardRepository.Add(board);
        try
        {
            await _unitOfWork.SaveChangesAsync();
            return board.ToModel();
        }
        catch
        {
            return Error.Failure();
        }
    }

    public async Task<ErrorOr<Deleted>> DeleteBoardByIdAsync(int id)
    {
        var board = await _boardRepository.GetByIdAsync(id);
        if (board is null)
        {
            return Error.NotFound();
        }

        _boardRepository.Remove(board);
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

    public async Task<IEnumerable<BoardModel>> GetAllBoardsAsync()
    {
        var boards = await _boardRepository.GetAllAsync();
        return boards.ConvertAll(b => b.ToModel());
    }

    public async Task<ErrorOr<BoardWithListsModel>> GetBoardWithListsAndCardsByIdAsync(int id)
    {
        var board = await _boardRepository.GetWithListsAndCardsByIdAsync(id);
        if (board is null)
        {
            return Error.NotFound();
        }

        return board.ToModelWithLists();
    }

    public async Task<ErrorOr<Updated>> UpdateBoardAsync(UpdateBoardModel boardModel)
    {
        var validationResult = await _updateBoardModelValidator.ValidateAsync(boardModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<Updated>();
        }

        var board = await _boardRepository.GetByIdAsync(boardModel.Id);
        if (board is null)
        {
            return Error.NotFound();
        }

        board.Name = boardModel.Name;
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