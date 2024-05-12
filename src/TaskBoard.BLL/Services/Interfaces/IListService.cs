using ErrorOr;
using TaskBoard.BLL.Models.List;

namespace TaskBoard.BLL.Services.Interfaces;

public interface IListService
{
    Task<IEnumerable<ListModel>> GetAllListsByBoardIdAsync(int boardId);

    Task<ErrorOr<ListModel>> GetListByIdAsync(int id);

    Task<ErrorOr<ListModel>> CreateListAsync(CreateListModel listModel);

    Task<ErrorOr<Updated>> UpdateListAsync(UpdateListModel listModel);

    Task<ErrorOr<Deleted>> DeleteListByIdAsync(int id);
}