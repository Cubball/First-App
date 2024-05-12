using ErrorOr;
using TaskBoard.BLL.Models.Board;

namespace TaskBoard.BLL.Services.Interfaces;

public interface IBoardService
{
    Task<IEnumerable<BoardModel>> GetAllBoardsAsync();

    Task<ErrorOr<BoardWithListsModel>> GetBoardWithListsAndCardsByIdAsync(int id);

    Task<ErrorOr<BoardModel>> CreateBoardAsync(CreateBoardModel boardModel);

    Task<ErrorOr<Updated>> UpdateBoardAsync(UpdateBoardModel boardModel);

    Task<ErrorOr<Deleted>> DeleteBoardByIdAsync(int id);
}